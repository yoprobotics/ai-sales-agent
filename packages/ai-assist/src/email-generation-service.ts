import { OpenAIService } from './openai-service';
import { z } from 'zod';

// Schémas de validation
const EmailGenerationInputSchema = z.object({
  prospect: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    jobTitle: z.string().optional(),
    company: z.object({
      name: z.string(),
      industry: z.string().optional(),
      size: z.string().optional(),
      description: z.string().optional(),
    }),
    score: z.number().min(0).max(100).optional(),
    signals: z.array(z.string()).optional(),
  }),
  sender: z.object({
    firstName: z.string(),
    lastName: z.string(),
    jobTitle: z.string(),
    company: z.string(),
    value_proposition: z.string(),
  }),
  context: z.object({
    sequence_step: z.number().default(1),
    previous_interaction: z.string().optional(),
    campaign_goal: z.string(),
    call_to_action: z.string(),
  }),
  language: z.enum(['fr', 'en']).default('en'),
  tone: z.enum(['formal', 'casual', 'friendly', 'professional']).default('professional'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
});

const EmailTemplateSchema = z.object({
  subject: z.string(),
  preview: z.string(),
  body: z.string(),
  signature: z.string().optional(),
  ps: z.string().optional(),
  variables: z.array(z.string()).optional(),
});

type EmailGenerationInput = z.infer<typeof EmailGenerationInputSchema>;
type EmailTemplate = z.infer<typeof EmailTemplateSchema>;

export interface GeneratedEmail {
  subject: string;
  body: string;
  preview: string;
  html: string;
  plainText: string;
  personalizationScore: number;
  estimatedReadTime: number;
  metadata: {
    tokens: number;
    model: string;
    latency: number;
  };
}

export class EmailGenerationService {
  private openai: OpenAIService;
  
  // Templates de base pour fallback
  private readonly fallbackTemplates = {
    en: {
      subjects: [
        'Quick question about {{company}}',
        'Helping {{company}} with {{value_prop}}',
        '{{first_name}}, thought you might find this relevant',
        'Question about your {{industry}} challenges',
      ],
      intros: [
        'Hi {{first_name}},',
        'Hello {{first_name}},',
        'Dear {{first_name}},',
      ],
      bodies: {
        short: 'I noticed {{company}} is in the {{industry}} space. We help similar companies {{value_proposition}}. Would you be open to a brief call to discuss?',
        medium: 'I noticed {{company}} is growing in the {{industry}} sector. We\'ve helped similar companies {{value_proposition}}, resulting in significant improvements in their sales process. I\'d love to share some insights specific to your industry. Would you have 15 minutes next week for a brief call?',
        long: 'I\'ve been following {{company}}\'s progress in the {{industry}} space, and I\'m impressed by your recent developments. At {{sender_company}}, we specialize in {{value_proposition}}, and we\'ve helped companies similar to yours achieve remarkable results. For instance, one of our clients in your industry saw a 40% increase in qualified leads within the first quarter. I believe we could deliver similar value for {{company}}. Would you be interested in a brief conversation to explore how we might help you achieve your goals?',
      }
    },
    fr: {
      subjects: [
        'Question rapide concernant {{company}}',
        'Aider {{company}} avec {{value_prop}}',
        '{{first_name}}, ceci pourrait vous intéresser',
        'Question sur vos défis en {{industry}}',
      ],
      intros: [
        'Bonjour {{first_name}},',
        'Cher/Chère {{first_name}},',
      ],
      bodies: {
        short: 'J\'ai remarqué que {{company}} évolue dans le secteur {{industry}}. Nous aidons des entreprises similaires à {{value_proposition}}. Seriez-vous ouvert(e) à un bref appel pour en discuter?',
        medium: 'J\'ai remarqué que {{company}} connaît une croissance dans le secteur {{industry}}. Nous avons aidé des entreprises similaires à {{value_proposition}}, avec des améliorations significatives de leur processus de vente. J\'aimerais partager quelques insights spécifiques à votre industrie. Auriez-vous 15 minutes la semaine prochaine pour un bref échange?',
        long: 'Je suis l\'évolution de {{company}} dans le secteur {{industry}}, et je suis impressionné(e) par vos récents développements. Chez {{sender_company}}, nous sommes spécialisés dans {{value_proposition}}, et nous avons aidé des entreprises similaires à la vôtre à obtenir des résultats remarquables. Par exemple, l\'un de nos clients dans votre secteur a constaté une augmentation de 40% de ses leads qualifiés au premier trimestre. Je crois que nous pourrions apporter une valeur similaire à {{company}}. Seriez-vous intéressé(e) par une brève conversation pour explorer comment nous pourrions vous aider à atteindre vos objectifs?',
      }
    }
  };

  constructor(openaiService: OpenAIService) {
    this.openai = openaiService;
  }

  /**
   * Générer un email personnalisé
   */
  async generateEmail(input: EmailGenerationInput): Promise<GeneratedEmail> {
    const validated = EmailGenerationInputSchema.parse(input);
    
    // Préparer les données sanitisées
    const sanitizedData = this.prepareSanitizedData(validated);
    
    try {
      const startTime = Date.now();
      
      // Appeler OpenAI
      const response = await this.openai.completion({
        systemPrompt: this.getSystemPrompt(validated.language, validated.tone),
        messages: [{
          role: 'user',
          content: this.getUserPrompt(sanitizedData, validated)
        }],
        temperature: 0.7,
        maxTokens: 1000,
        sanitizeInput: false, // Déjà sanitisé
        metadata: {
          type: 'email_generation',
          language: validated.language,
          tone: validated.tone,
        }
      });

      // Parser la réponse
      const emailContent = this.parseEmailResponse(response.content);
      
      // Créer les versions HTML et plain text
      const html = this.createHtmlVersion(emailContent);
      const plainText = this.createPlainTextVersion(emailContent);
      
      // Calculer les métriques
      const personalizationScore = this.calculatePersonalizationScore(emailContent, validated);
      const estimatedReadTime = this.calculateReadTime(plainText);
      
      return {
        subject: emailContent.subject,
        body: emailContent.body,
        preview: emailContent.preview || emailContent.body.substring(0, 150),
        html,
        plainText,
        personalizationScore,
        estimatedReadTime,
        metadata: {
          tokens: response.usage?.total_tokens || 0,
          model: response.metrics.model,
          latency: Date.now() - startTime,
        }
      };
      
    } catch (error) {
      console.error('Email generation error:', error);
      
      // Utiliser un template de fallback
      return this.generateFallbackEmail(validated);
    }
  }

  /**
   * Préparer les données sanitisées pour OpenAI
   */
  private prepareSanitizedData(input: EmailGenerationInput): any {
    return {
      prospect: {
        firstName: input.prospect.firstName || '[Name]',
        jobTitle: input.prospect.jobTitle || '[Title]',
        company: {
          name: input.prospect.company.name,
          industry: input.prospect.company.industry || '[Industry]',
          size: input.prospect.company.size,
        },
        score: input.prospect.score,
        signals: input.prospect.signals,
      },
      sender: {
        firstName: input.sender.firstName,
        lastName: input.sender.lastName,
        jobTitle: input.sender.jobTitle,
        company: input.sender.company,
        value_proposition: input.sender.value_proposition,
      },
      context: input.context,
    };
  }

  /**
   * System prompt pour la génération d'emails
   */
  private getSystemPrompt(language: 'fr' | 'en', tone: string): string {
    const prompts = {
      en: `You are an expert B2B sales copywriter. Generate personalized cold emails that:
- Are ${tone} in tone
- Focus on value, not features
- Include social proof when possible
- Have a clear, single call-to-action
- Are concise and scannable
- Avoid spam triggers and excessive capitalization
- Use the prospect's context and signals for personalization

Return the email in this JSON format:
{
  "subject": "compelling subject line",
  "preview": "preview text (first 150 chars)",
  "body": "email body with proper formatting",
  "ps": "optional PS line for additional value"
}`,

      fr: `Vous êtes un expert en rédaction de ventes B2B. Générez des emails de prospection personnalisés qui :
- Sont ${tone === 'professional' ? 'professionnels' : tone} dans le ton
- Se concentrent sur la valeur, pas les fonctionnalités
- Incluent une preuve sociale si possible
- Ont un appel à l'action clair et unique
- Sont concis et faciles à parcourir
- Évitent les déclencheurs de spam et la capitalisation excessive
- Utilisent le contexte et les signaux du prospect pour la personnalisation

Retournez l'email dans ce format JSON :
{
  "subject": "ligne d'objet convaincante",
  "preview": "texte de prévisualisation (150 premiers caractères)",
  "body": "corps de l'email avec formatage approprié",
  "ps": "ligne PS optionnelle pour valeur ajoutée"
}`
    };

    return prompts[language];
  }

  /**
   * User prompt avec le contexte
   */
  private getUserPrompt(data: any, input: EmailGenerationInput): string {
    const lengthGuide = {
      short: '3-5 sentences',
      medium: '2-3 paragraphs',
      long: '3-4 paragraphs',
    };

    return `Generate a ${input.length} (${lengthGuide[input.length]}) cold email:

PROSPECT:
- Name: ${data.prospect.firstName}
- Title: ${data.prospect.jobTitle}
- Company: ${data.prospect.company.name}
- Industry: ${data.prospect.company.industry}
- Company Size: ${data.prospect.company.size}
${data.prospect.score ? `- Qualification Score: ${data.prospect.score}/100` : ''}
${data.prospect.signals ? `- Buying Signals: ${data.prospect.signals.join(', ')}` : ''}

SENDER:
- Name: ${data.sender.firstName} ${data.sender.lastName}
- Title: ${data.sender.jobTitle}
- Company: ${data.sender.company}
- Value Proposition: ${data.sender.value_proposition}

CONTEXT:
- Campaign Goal: ${data.context.campaign_goal}
- Call to Action: ${data.context.call_to_action}
- Sequence Step: ${data.context.sequence_step}
${data.context.previous_interaction ? `- Previous Interaction: ${data.context.previous_interaction}` : ''}

Generate a compelling, personalized email that will get a response.`;
  }

  /**
   * Parser la réponse JSON d'OpenAI
   */
  private parseEmailResponse(content: string): EmailTemplate {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      return EmailTemplateSchema.parse(parsed);
      
    } catch (error) {
      console.error('Failed to parse email response:', error);
      throw new Error('Invalid email format from OpenAI');
    }
  }

  /**
   * Créer la version HTML
   */
  private createHtmlVersion(email: EmailTemplate): string {
    const body = email.body
      .split('\n\n')
      .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('');
      
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    p { margin: 1em 0; }
    .signature { margin-top: 2em; }
    .ps { margin-top: 2em; font-style: italic; color: #666; }
  </style>
</head>
<body>
  ${body}
  ${email.signature ? `<div class="signature">${email.signature}</div>` : ''}
  ${email.ps ? `<p class="ps">PS: ${email.ps}</p>` : ''}
</body>
</html>`;
  }

  /**
   * Créer la version plain text
   */
  private createPlainTextVersion(email: EmailTemplate): string {
    let text = email.body;
    if (email.signature) text += `\n\n${email.signature}`;
    if (email.ps) text += `\n\nPS: ${email.ps}`;
    return text;
  }

  /**
   * Calculer le score de personnalisation
   */
  private calculatePersonalizationScore(email: EmailTemplate, input: EmailGenerationInput): number {
    let score = 50; // Base score
    
    // Points for using prospect's name
    if (email.body.includes(input.prospect.firstName || '')) score += 10;
    
    // Points for mentioning company
    if (email.body.includes(input.prospect.company.name)) score += 10;
    
    // Points for industry relevance
    if (input.prospect.company.industry && email.body.includes(input.prospect.company.industry)) score += 10;
    
    // Points for using signals
    if (input.prospect.signals && input.prospect.signals.length > 0) score += 15;
    
    // Points for appropriate length
    const wordCount = email.body.split(/\s+/).length;
    if (
      (input.length === 'short' && wordCount < 100) ||
      (input.length === 'medium' && wordCount >= 100 && wordCount <= 200) ||
      (input.length === 'long' && wordCount > 200)
    ) {
      score += 5;
    }
    
    return Math.min(score, 100);
  }

  /**
   * Calculer le temps de lecture estimé
   */
  private calculateReadTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute * 60); // en secondes
  }

  /**
   * Générer un email de fallback avec templates
   */
  private generateFallbackEmail(input: EmailGenerationInput): GeneratedEmail {
    const templates = this.fallbackTemplates[input.language];
    const subject = this.replaceVariables(
      templates.subjects[Math.floor(Math.random() * templates.subjects.length)],
      input
    );
    
    const intro = this.replaceVariables(
      templates.intros[Math.floor(Math.random() * templates.intros.length)],
      input
    );
    
    const body = intro + '\n\n' + this.replaceVariables(templates.bodies[input.length], input);
    
    const signature = `\nBest regards,\n${input.sender.firstName} ${input.sender.lastName}\n${input.sender.jobTitle}\n${input.sender.company}`;
    
    const fullBody = body + signature;
    
    return {
      subject,
      body: fullBody,
      preview: body.substring(0, 150),
      html: this.createHtmlVersion({ subject, body: fullBody, preview: '', signature: '' }),
      plainText: fullBody,
      personalizationScore: 60,
      estimatedReadTime: this.calculateReadTime(fullBody),
      metadata: {
        tokens: 0,
        model: 'fallback',
        latency: 0,
      }
    };
  }

  /**
   * Remplacer les variables dans les templates
   */
  private replaceVariables(template: string, input: EmailGenerationInput): string {
    return template
      .replace(/\{\{first_name\}\}/g, input.prospect.firstName || 'there')
      .replace(/\{\{company\}\}/g, input.prospect.company.name)
      .replace(/\{\{industry\}\}/g, input.prospect.company.industry || 'your industry')
      .replace(/\{\{value_proposition\}\}/g, input.sender.value_proposition)
      .replace(/\{\{sender_company\}\}/g, input.sender.company)
      .replace(/\{\{value_prop\}\}/g, input.sender.value_proposition.substring(0, 50) + '...');
  }
}
