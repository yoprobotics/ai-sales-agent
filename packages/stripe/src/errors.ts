import Stripe from 'stripe';

export class StripeServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'StripeServiceError';
  }
}

/**
 * Handle Stripe errors and convert to our error format
 */
export function handleStripeError(error: unknown): StripeServiceError {
  if (error instanceof Stripe.errors.StripeError) {
    const statusCodeMap: Record<string, number> = {
      'StripeCardError': 400,
      'StripeRateLimitError': 429,
      'StripeInvalidRequestError': 400,
      'StripeAPIError': 500,
      'StripeConnectionError': 502,
      'StripeAuthenticationError': 401,
    };

    return new StripeServiceError(
      error.message,
      error.code || error.type,
      statusCodeMap[error.type] || 500,
      {
        type: error.type,
        param: error.param,
        raw: error.raw,
      }
    );
  }

  if (error instanceof Error) {
    return new StripeServiceError(
      error.message,
      'UNKNOWN_ERROR',
      500,
      { originalError: error.message }
    );
  }

  return new StripeServiceError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    500,
    { error }
  );
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Stripe.errors.StripeError) {
    return [
      'StripeRateLimitError',
      'StripeConnectionError',
      'StripeAPIError',
    ].includes(error.type);
  }
  return false;
}

/**
 * Retry a Stripe operation with exponential backoff
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

      if (!isRetryableError(error) || i === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}