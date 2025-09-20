import { OpenAIService } from './openai-service';
import { z } from 'zod';
import type { Prospect, ScoreExplanation } from '@ai-sales-agent/core';

// Schémas de validation
const QualificationInputSchema = z.object({
  prospect: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email(),
    jobTitle: z.string().optional(),
    company: z.object({
      name: z.string(),
      domain: z.string().optional(),
      industry: z.string().optional(),
      size: z.string().optional(),
      revenue: z.string().optional(),
      location: z.string().optional(),
      description: z.string().optional(),
      employees: z.number().optional(),
      technologies: z.array(z.string()).optional(),
    }),
    linkedinUrl: z.string().optional(),
    websiteUrl: z.string().optional(),
    notes: z.string().optional(),
  }),
  icp: z.object({
    industry: z.array(z.string()),
    companySize: z.array(z.string()),
    revenue: z.string().optional(),
    location: z.array(z.string()),
    keywords: z.array(z.string()),
    jobTitles: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
  }),
  language: z.enum(['fr', 'en']).default('en'),
});

const QualificationResponseSchema = z.object({
  budget: z.object({
    score: z.number().min(0).max(100),
    explanation: z.string(),
    signals: z.array(z.string()),
  }),
  authority: z.object({
    score: z.number().min(0).max(100),
    explanation: z.string(),
    signals: z.array(z.string()),
  }),
  need: z.object({
    score: z.number().min(0).max(100),
    explanation: z.string(),
    signals: z.array(z.string()),
  }),
  timing: z.object({
    score: z.number().min(0).max(100),
    explanation: z.string(),
    signals: z.array(z.string()),
  }),
  overallScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  recommendation: z.string(),
  nextSteps: z.array(z.string()),
});

type QualificationInput = z.infer<typeof QualificationInputSchema>;
type QualificationResponse = z.infer<typeof QualificationResponseSchema>;

export class QualificationService {
  private openai: OpenAIService;

  constructor(openaiService: OpenAIService) {
    this.openai = openaiService;
  }

  /**
   * Qualifier un prospect selon les critères BANT
   */
  async qualifyProspect(input: QualificationInput): Promise<ScoreExplanation> {
    // Valider l'input
    const validated = QualificationInputSchema.parse(input);
    
    // Préparer les données pour OpenAI (sans PII sensibles)
    const sanitizedProspect = {
      jobTitle: validated.prospect.jobTitle || 'Unknown',
      company: {
        name: validated.prospect.company.name,
        industry: validated.prospect.company.industry,
        size: validated.prospect.company.size,
        revenue: validated.prospect.company.revenue,
        location: validated.prospect.company.location,
        description: validated.prospect.company.description,
        employees: validated.prospect.company.employees,
        technologies: validated.prospect.company.technologies,
      },
      hasLinkedIn: !!validated.prospect.linkedinUrl,
      hasWebsite: !!validated.prospect.websiteUrl,
      hasNotes: !!validated.prospect.notes,
    };

    const systemPrompt = this.getSystemPrompt(validated.language);
    const userPrompt = this.getUserPrompt(sanitizedProspect, validated.icp, validated.language);

    try {
      // Appeler OpenAI avec le service sécurisé
      const response = await this.openai.completion({
        systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        temperature: 0.3, // Plus déterministe pour le scoring
        sanitizeInput: false, // Déjà sanitisé manuellement
        metadata: {
          type: 'qualification',
          prospectCompany: sanitizedProspect.company.name,
        }
      });

      // Parser et valider la réponse
      const parsed = this.parseResponse(response.content);
      const validated = QualificationResponseSchema.parse(parsed);

      // Convertir au format ScoreExplanation
      return this.toScoreExplanation(validated);
      
    } catch (error) {
      console.error('Qualification error:', error);
      
      // Fallback avec scoring basique
      return this.getFallbackScore(sanitizedProspect, validated.icp);
    }
  }

  /**
   * Prompt système pour la qualification
   */
  private getSystemPrompt(language: 'fr' | 'en'): string {
    const prompts = {
      en: `You are an expert B2B sales qualification AI. Your task is to evaluate prospects using the BANT (Budget, Authority, Need, Timing) framework.

For each dimension, provide:
1. A score from 0-100
2. A clear, concise explanation (1-2 sentences)
3. Specific signals or evidence observed

Also provide:
- An overall score (weighted average)
- Confidence level (0-100) based on available information
- A recommendation (qualify, nurture, or disqualify)
- 2-3 specific next steps

Respond in JSON format exactly as specified. Be objective and data-driven.`,

      fr: `Vous êtes une IA experte en qualification de prospects B2B. Votre tâche est d'évaluer les prospects selon le framework BANT (Budget, Autorité, Besoin, Timing).

Pour chaque dimension, fournissez :
1. Un score de 0 à 100
2. Une explication claire et concise (1-2 phrases)
3. Des signaux ou preuves spécifiques observés

Fournissez également :
- Un score global (moyenne pondérée)
- Un niveau de confiance (0-100) basé sur les informations disponibles
- Une recommandation (qualifier, nourrir, ou disqualifier)
- 2-3 prochaines étapes spécifiques

Répondez au format JSON exact spécifié. Soyez objectif et basé sur les données.`
    };

    return prompts[language];
  }

  /**
   * Prompt utilisateur avec les données du prospect
   */
  private getUserPrompt(
    prospect: any,
    icp: any,
    language: 'fr' | 'en'
  ): string {
    const context = {
      en: `Evaluate this prospect against the Ideal Customer Profile (ICP):

PROSPECT INFORMATION:
${JSON.stringify(prospect, null, 2)}

IDEAL CUSTOMER PROFILE:
${JSON.stringify(icp, null, 2)}

Provide your analysis in the following JSON structure:
{
  "budget": {
    "score": number,
    "explanation": string,
    "signals": [string]
  },
  "authority": {
    "score": number,
    "explanation": string,
    "signals": [string]
  },
  "need": {
    "score": number,
    "explanation": string,
    "signals": [string]
  },
  "timing": {
    "score": number,
    "explanation": string,
    "signals": [string]
  },
  "overallScore": number,
  "confidence": number,
  "recommendation": "qualify" | "nurture" | "disqualify",
  "nextSteps": [string]
}`,

      fr: `Évaluez ce prospect par rapport au Profil Client Idéal (ICP) :

INFORMATIONS DU PROSPECT :
${JSON.stringify(prospect, null, 2)}

PROFIL CLIENT IDÉAL :
${JSON.stringify(icp, null, 2)}

Fournissez votre analyse dans la structure JSON suivante :
{
  "budget": {
    "score": number,
    "explanation": string,
    "signals": [string]
  },
  "authority": {
    "score": number,
    "explanation": string,
    "signals": [string]
  },
  "need": {
    "score": number,
    "explanation": string,
    "signals": [string]
  },
  "timing": {
    "score": number,
    "explanation": string,
    "signals": [string]
  },
  "overallScore": number,
  "confidence": number,
  "recommendation": "qualify" | "nurture" | "disqualify",
  "nextSteps": [string]
}`
    };

    return context[language];
  }

  /**
   * Parser la réponse JSON d'OpenAI
   */
  private parseResponse(content: string): any {
    try {
      // Extraire le JSON de la réponse (peut être entouré de texte)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      throw new Error('Invalid response format from OpenAI');
    }
  }

  /**
   * Convertir au format ScoreExplanation
   */
  private toScoreExplanation(response: QualificationResponse): ScoreExplanation {
    return {
      total: response.overallScore,
      breakdown: {
        budget: response.budget.score,
        authority: response.authority.score,
        need: response.need.score,
        timing: response.timing.score,
        signals: Math.round(
          (response.budget.signals.length + 
           response.authority.signals.length + 
           response.need.signals.length + 
           response.timing.signals.length) * 5
        ), // Score basé sur le nombre de signaux
      },
      reasoning: {
        budget: response.budget.explanation,
        authority: response.authority.explanation,
        need: response.need.explanation,
        timing: response.timing.explanation,
        signals: [...response.budget.signals, ...response.authority.signals, ...response.need.signals, ...response.timing.signals].join('. '),
      },
      confidence: response.confidence,
    };
  }

  /**
   * Score de fallback si OpenAI échoue
   */
  private getFallbackScore(prospect: any, icp: any): ScoreExplanation {
    // Logique de scoring basique basée sur la correspondance ICP
    let score = 50;
    const signals: string[] = [];

    // Vérifier l'industrie
    if (prospect.company.industry && icp.industry.includes(prospect.company.industry)) {
      score += 10;
      signals.push('Industry match');
    }

    // Vérifier la taille
    if (prospect.company.size && icp.companySize.includes(prospect.company.size)) {
      score += 10;
      signals.push('Company size match');
    }

    // Vérifier la localisation
    if (prospect.company.location && icp.location.some((loc: string) => 
      prospect.company.location.toLowerCase().includes(loc.toLowerCase())
    )) {
      score += 10;
      signals.push('Location match');
    }

    // Vérifier les technologies
    if (prospect.company.technologies && icp.technologies) {
      const techMatch = prospect.company.technologies.filter((tech: string) =>
        icp.technologies.includes(tech)
      );
      if (techMatch.length > 0) {
        score += Math.min(techMatch.length * 5, 20);
        signals.push(`${techMatch.length} technology matches`);
      }
    }

    // Job title relevance
    if (prospect.jobTitle && icp.jobTitles) {
      const titleMatch = icp.jobTitles.some((title: string) =>
        prospect.jobTitle.toLowerCase().includes(title.toLowerCase())
      );
      if (titleMatch) {
        score += 10;
        signals.push('Job title match');
      }
    }

    score = Math.min(score, 100);

    return {
      total: score,
      breakdown: {
        budget: score - 10,
        authority: score - 5,
        need: score,
        timing: score - 15,
        signals: signals.length * 10,
      },
      reasoning: {
        budget: 'Unable to assess budget from available information',
        authority: 'Job title suggests potential decision-making authority',
        need: 'Company profile matches target criteria',
        timing: 'No specific timing signals detected',
        signals: signals.join('. '),
      },
      confidence: 40, // Low confidence for fallback
    };
  }
}
