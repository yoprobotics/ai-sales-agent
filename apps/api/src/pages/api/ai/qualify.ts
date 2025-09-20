import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createAIServicesFromEnv } from '@ai-sales-agent/ai-assist';
import { authenticateRequest } from '../../../lib/auth';
import { createRateLimiter } from '../../../lib/rate-limit';
import { logger } from '../../../lib/logger';

// Request validation
const QualifyRequestSchema = z.object({
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
    }),
    linkedinUrl: z.string().optional(),
    websiteUrl: z.string().optional(),
    notes: z.string().optional(),
  }),
  icpId: z.string().uuid(),
  language: z.enum(['fr', 'en']).default('en'),
});

// Rate limiter: 10 qualifications per minute per user
const rateLimiter = createRateLimiter({
  points: 10,
  duration: 60,
  keyPrefix: 'ai_qualify',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const user = await authenticateRequest(req, res);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Rate limiting
    try {
      await rateLimiter.consume(user.id);
    } catch (rateLimitError) {
      logger.warn('Rate limit exceeded', {
        userId: user.id,
        endpoint: '/api/ai/qualify',
      });
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
      });
    }

    // Validate request
    const validatedData = QualifyRequestSchema.parse(req.body);

    // TODO: Load ICP from database
    // const icp = await db.icp.findUnique({ where: { id: validatedData.icpId, userId: user.id } });
    // For now, using mock ICP
    const icp = {
      industry: ['Technology', 'Software'],
      companySize: ['small', 'medium'],
      revenue: '1m_10m',
      location: ['US', 'Canada'],
      keywords: ['automation', 'AI', 'sales'],
      jobTitles: ['CEO', 'CTO', 'VP Sales'],
      technologies: ['Salesforce', 'HubSpot'],
    };

    // Initialize AI services
    const aiServices = createAIServicesFromEnv();

    // Qualify the prospect
    const startTime = Date.now();
    const scoreExplanation = await aiServices.qualification.qualifyProspect({
      prospect: validatedData.prospect,
      icp,
      language: validatedData.language,
    });
    const processingTime = Date.now() - startTime;

    // Log the qualification
    logger.info('Prospect qualified', {
      userId: user.id,
      prospectCompany: validatedData.prospect.company.name,
      score: scoreExplanation.total,
      confidence: scoreExplanation.confidence,
      processingTime,
    });

    // TODO: Save qualification to database
    // await db.prospect.update({
    //   where: { id: prospectId },
    //   data: {
    //     score: scoreExplanation.total,
    //     scoreExplanation,
    //     qualifiedAt: new Date(),
    //   }
    // });

    // Get AI metrics for cost tracking
    const metrics = aiServices.openai.getMetrics(
      new Date(Date.now() - 60000) // Last minute
    );

    // Return the qualification result
    return res.status(200).json({
      success: true,
      data: {
        score: scoreExplanation.total,
        breakdown: scoreExplanation.breakdown,
        reasoning: scoreExplanation.reasoning,
        confidence: scoreExplanation.confidence,
        processingTime,
      },
      metadata: {
        aiCost: metrics.totalCost,
        tokensUsed: metrics.totalTokens,
      },
    });
  } catch (error) {
    logger.error('Qualification error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: error.errors,
      });
    }

    return res.status(500).json({
      error: 'Failed to qualify prospect. Please try again.',
    });
  }
}

// Disable body parsing, we'll do it manually
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};