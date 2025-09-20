import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { createAIServicesFromEnv } from '@ai-sales-agent/ai-assist';
import { authenticateRequest } from '../../../lib/auth';
import { createRateLimiter } from '../../../lib/rate-limit';
import { logger } from '../../../lib/logger';

// Request validation
const GenerateEmailRequestSchema = z.object({
  prospectId: z.string().uuid(),
  sequenceStep: z.number().min(1).max(10).default(1),
  language: z.enum(['fr', 'en']).default('en'),
  tone: z.enum(['formal', 'casual', 'friendly', 'professional']).default('professional'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
});

// Rate limiter: 20 generations per minute per user
const rateLimiter = createRateLimiter({
  points: 20,
  duration: 60,
  keyPrefix: 'ai_email',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate
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
        endpoint: '/api/ai/generate-email',
      });
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
      });
    }

    // Validate request
    const validatedData = GenerateEmailRequestSchema.parse(req.body);

    // TODO: Load prospect from database
    // const prospect = await db.prospect.findUnique({
    //   where: { id: validatedData.prospectId, userId: user.id }
    // });
    
    // Mock data for now
    const prospect = {
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'CEO',
      company: {
        name: 'TechCorp Inc',
        industry: 'Technology',
        size: 'medium',
        description: 'Leading software solutions provider',
      },
      score: 75,
      signals: ['Recent funding', 'Hiring sales team', 'Using competitor'],
    };

    const sender = {
      firstName: user.firstName || 'Sales',
      lastName: user.lastName || 'Agent',
      jobTitle: 'Sales Development Representative',
      company: user.companyName || 'AI Sales Agent',
      value_proposition: 'Automate your B2B prospecting with AI-powered qualification and personalized outreach',
    };

    const context = {
      sequence_step: validatedData.sequenceStep,
      campaign_goal: 'Book a discovery call',
      call_to_action: 'Schedule a 15-minute demo',
    };

    // Initialize AI services
    const aiServices = createAIServicesFromEnv();

    // Generate email
    const startTime = Date.now();
    const generatedEmail = await aiServices.emailGeneration.generateEmail({
      prospect,
      sender,
      context,
      language: validatedData.language,
      tone: validatedData.tone,
      length: validatedData.length,
    });
    const processingTime = Date.now() - startTime;

    // Log generation
    logger.info('Email generated', {
      userId: user.id,
      prospectId: validatedData.prospectId,
      language: validatedData.language,
      tone: validatedData.tone,
      personalizationScore: generatedEmail.personalizationScore,
      processingTime,
    });

    // TODO: Save generated email to database
    // await db.generatedEmail.create({
    //   data: {
    //     prospectId: validatedData.prospectId,
    //     userId: user.id,
    //     subject: generatedEmail.subject,
    //     body: generatedEmail.body,
    //     html: generatedEmail.html,
    //     metadata: generatedEmail.metadata,
    //   }
    // });

    // Return the generated email
    return res.status(200).json({
      success: true,
      data: {
        subject: generatedEmail.subject,
        body: generatedEmail.body,
        preview: generatedEmail.preview,
        html: generatedEmail.html,
        plainText: generatedEmail.plainText,
        personalizationScore: generatedEmail.personalizationScore,
        estimatedReadTime: generatedEmail.estimatedReadTime,
        processingTime,
      },
      metadata: generatedEmail.metadata,
    });
  } catch (error) {
    logger.error('Email generation error', {
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
      error: 'Failed to generate email. Please try again.',
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};