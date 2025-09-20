// Export all AI services
export * from './openai-service';
export * from './qualification-service';
export * from './email-generation-service';

// Re-export commonly used services for convenience
import { OpenAIService, OpenAIConfig } from './openai-service';
import { QualificationService } from './qualification-service';
import { EmailGenerationService } from './email-generation-service';

/**
 * Factory function to create all AI services with a single configuration
 */
export function createAIServices(config: OpenAIConfig): {
  openai: OpenAIService;
  qualification: QualificationService;
  emailGeneration: EmailGenerationService;
} {
  const openai = new OpenAIService(config);
  const qualification = new QualificationService(openai);
  const emailGeneration = new EmailGenerationService(openai);

  return {
    openai,
    qualification,
    emailGeneration,
  };
}

/**
 * Initialize AI services from environment variables
 */
export function createAIServicesFromEnv(): ReturnType<typeof createAIServices> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  return createAIServices({
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || '3'),
    timeout: parseInt(process.env.OPENAI_TIMEOUT || '60000'),
  });
}
