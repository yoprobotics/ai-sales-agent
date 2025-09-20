import { SendGridError } from './types';

/**
 * Handle SendGrid errors and convert to our error format
 */
export function handleSendGridError(error: unknown): SendGridError {
  if (error instanceof Error && 'response' in error) {
    const sgError = error as any;
    const response = sgError.response;
    
    if (response?.body?.errors?.length > 0) {
      const firstError = response.body.errors[0];
      return new SendGridError(
        firstError.message,
        'SENDGRID_API_ERROR',
        response.statusCode || 500,
        {
          errors: response.body.errors,
          field: firstError.field,
          help: firstError.help,
        }
      );
    }

    return new SendGridError(
      sgError.message || 'SendGrid API error',
      'SENDGRID_API_ERROR',
      response?.statusCode || 500,
      { response: response?.body }
    );
  }

  if (error instanceof Error) {
    return new SendGridError(
      error.message,
      'SENDGRID_ERROR',
      500,
      { originalError: error.message }
    );
  }

  return new SendGridError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    500,
    { error }
  );
}

/**
 * Check if error is rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (error instanceof SendGridError) {
    return error.statusCode === 429;
  }
  
  if (error instanceof Error && 'response' in error) {
    const sgError = error as any;
    return sgError.response?.statusCode === 429;
  }
  
  return false;
}

/**
 * Check if error is validation error
 */
export function isValidationError(error: unknown): boolean {
  if (error instanceof SendGridError) {
    return error.statusCode === 400;
  }
  
  if (error instanceof Error && 'response' in error) {
    const sgError = error as any;
    return sgError.response?.statusCode === 400;
  }
  
  return false;
}

/**
 * Retry with exponential backoff for rate-limited requests
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRateLimitError(error) || i === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}