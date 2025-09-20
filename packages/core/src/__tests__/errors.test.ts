import {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  SubscriptionError,
  createError,
  handleError,
  formatErrorResponse
} from '../errors';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create basic app error', () => {
      const error = new AppError('Test error', 500, 'TEST_ERROR');
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.isOperational).toBe(true);
    });

    it('should include details when provided', () => {
      const details = { field: 'email', value: 'invalid' };
      const error = new AppError('Validation failed', 400, 'VALIDATION', true, details);
      
      expect(error.details).toEqual(details);
    });
  });

  describe('Specific Error Classes', () => {
    it('should create authentication error', () => {
      const error = new AuthenticationError();
      
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error.message).toBe('Authentication failed');
    });

    it('should create authorization error', () => {
      const error = new AuthorizationError('Admin access required');
      
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('AUTHORIZATION_ERROR');
      expect(error.message).toBe('Admin access required');
    });

    it('should create validation error', () => {
      const error = new ValidationError('Invalid input', {
        fields: ['email', 'password']
      });
      
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.details).toEqual({ fields: ['email', 'password'] });
    });

    it('should create not found error', () => {
      const error = new NotFoundError('User');
      
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.message).toBe('User not found');
    });

    it('should create rate limit error', () => {
      const error = new RateLimitError();
      
      expect(error.statusCode).toBe(429);
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
    });

    it('should create subscription error', () => {
      const error = new SubscriptionError('Plan limit reached');
      
      expect(error.statusCode).toBe(402);
      expect(error.code).toBe('SUBSCRIPTION_ERROR');
    });
  });

  describe('Error Factory', () => {
    it('should create errors by type', () => {
      const authError = createError('AUTHENTICATION_ERROR', 'Invalid token');
      expect(authError).toBeInstanceOf(AuthenticationError);
      expect(authError.message).toBe('Invalid token');

      const notFoundError = createError('NOT_FOUND', 'Resource');
      expect(notFoundError).toBeInstanceOf(NotFoundError);
      expect(notFoundError.message).toBe('Resource');
    });

    it('should create generic error for unknown type', () => {
      const error = createError('UNKNOWN_TYPE', 'Unknown error');
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe('UNKNOWN_TYPE');
    });
  });

  describe('Error Handling', () => {
    it('should handle AppError instances', () => {
      const originalError = new ValidationError('Test');
      const handledError = handleError(originalError);
      
      expect(handledError).toBe(originalError);
    });

    it('should wrap standard Error', () => {
      const standardError = new Error('Standard error');
      const handledError = handleError(standardError);
      
      expect(handledError).toBeInstanceOf(AppError);
      expect(handledError.message).toBe('Standard error');
      expect(handledError.code).toBe('INTERNAL_ERROR');
    });

    it('should handle unknown error types', () => {
      const handledError = handleError('string error');
      
      expect(handledError).toBeInstanceOf(AppError);
      expect(handledError.message).toBe('Unknown error occurred');
      expect(handledError.code).toBe('UNKNOWN_ERROR');
    });
  });

  describe('Error Response Formatting', () => {
    it('should format error response', () => {
      const error = new ValidationError('Invalid email', {
        field: 'email',
        value: 'invalid'
      });
      
      const response = formatErrorResponse(error);
      
      expect(response).toEqual({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email',
          details: {
            field: 'email',
            value: 'invalid'
          }
        }
      });
    });

    it('should omit details if not provided', () => {
      const error = new AppError('Test error', 500, 'TEST_ERROR');
      const response = formatErrorResponse(error);
      
      expect(response).toEqual({
        success: false,
        error: {
          code: 'TEST_ERROR',
          message: 'Test error'
        }
      });
    });
  });
});
