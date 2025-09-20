// Custom error classes for AI Sales Agent

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
    details?: Record<string, any>
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication errors
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: Record<string, any>) {
    super(message, 401, 'AUTHENTICATION_ERROR', true, details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', details?: Record<string, any>) {
    super(message, 403, 'AUTHORIZATION_ERROR', true, details);
  }
}

export class TokenExpiredError extends AppError {
  constructor(message: string = 'Token has expired', details?: Record<string, any>) {
    super(message, 401, 'TOKEN_EXPIRED', true, details);
  }
}

export class InvalidTokenError extends AppError {
  constructor(message: string = 'Invalid token', details?: Record<string, any>) {
    super(message, 401, 'INVALID_TOKEN', true, details);
  }
}

// Validation errors
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', true, details);
  }
}

export class InvalidInputError extends AppError {
  constructor(message: string = 'Invalid input provided', details?: Record<string, any>) {
    super(message, 400, 'INVALID_INPUT', true, details);
  }
}

export class SchemaValidationError extends AppError {
  constructor(message: string = 'Schema validation failed', details?: Record<string, any>) {
    super(message, 400, 'SCHEMA_VALIDATION_ERROR', true, details);
  }
}

// Resource errors
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', details?: Record<string, any>) {
    super(`${resource} not found`, 404, 'NOT_FOUND', true, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', details?: Record<string, any>) {
    super(message, 409, 'CONFLICT', true, details);
  }
}

export class DuplicateResourceError extends AppError {
  constructor(resource: string = 'Resource', details?: Record<string, any>) {
    super(`${resource} already exists`, 409, 'DUPLICATE_RESOURCE', true, details);
  }
}

// Rate limiting errors
export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', details?: Record<string, any>) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', true, details);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Too many requests', details?: Record<string, any>) {
    super(message, 429, 'TOO_MANY_REQUESTS', true, details);
  }
}

// Subscription and payment errors
export class SubscriptionError extends AppError {
  constructor(message: string = 'Subscription error', details?: Record<string, any>) {
    super(message, 402, 'SUBSCRIPTION_ERROR', true, details);
  }
}

export class PaymentRequiredError extends AppError {
  constructor(message: string = 'Payment required', details?: Record<string, any>) {
    super(message, 402, 'PAYMENT_REQUIRED', true, details);
  }
}

export class QuotaExceededError extends AppError {
  constructor(resource: string = 'Resource', details?: Record<string, any>) {
    super(`${resource} quota exceeded`, 402, 'QUOTA_EXCEEDED', true, details);
  }
}

export class PlanLimitError extends AppError {
  constructor(message: string = 'Plan limit reached', details?: Record<string, any>) {
    super(message, 402, 'PLAN_LIMIT_REACHED', true, details);
  }
}

// External service errors
export class ExternalServiceError extends AppError {
  constructor(service: string, message: string = 'External service error', details?: Record<string, any>) {
    super(`${service}: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR', true, { service, ...details });
  }
}

export class AIServiceError extends AppError {
  constructor(message: string = 'AI service error', details?: Record<string, any>) {
    super(message, 502, 'AI_SERVICE_ERROR', true, details);
  }
}

export class EmailServiceError extends AppError {
  constructor(message: string = 'Email service error', details?: Record<string, any>) {
    super(message, 502, 'EMAIL_SERVICE_ERROR', true, details);
  }
}

export class PaymentServiceError extends AppError {
  constructor(message: string = 'Payment service error', details?: Record<string, any>) {
    super(message, 502, 'PAYMENT_SERVICE_ERROR', true, details);
  }
}

// Database errors
export class DatabaseError extends AppError {
  constructor(message: string = 'Database error', details?: Record<string, any>) {
    super(message, 500, 'DATABASE_ERROR', false, details);
  }
}

export class ConnectionError extends AppError {
  constructor(message: string = 'Connection error', details?: Record<string, any>) {
    super(message, 500, 'CONNECTION_ERROR', false, details);
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = 'Operation timeout', details?: Record<string, any>) {
    super(message, 504, 'TIMEOUT_ERROR', true, details);
  }
}

// File processing errors
export class FileProcessingError extends AppError {
  constructor(message: string = 'File processing error', details?: Record<string, any>) {
    super(message, 400, 'FILE_PROCESSING_ERROR', true, details);
  }
}

export class InvalidFileFormatError extends AppError {
  constructor(message: string = 'Invalid file format', details?: Record<string, any>) {
    super(message, 400, 'INVALID_FILE_FORMAT', true, details);
  }
}

export class FileSizeExceededError extends AppError {
  constructor(message: string = 'File size exceeded', details?: Record<string, any>) {
    super(message, 413, 'FILE_SIZE_EXCEEDED', true, details);
  }
}

// Business logic errors
export class BusinessLogicError extends AppError {
  constructor(message: string = 'Business logic error', details?: Record<string, any>) {
    super(message, 422, 'BUSINESS_LOGIC_ERROR', true, details);
  }
}

export class InvalidStateError extends AppError {
  constructor(message: string = 'Invalid state', details?: Record<string, any>) {
    super(message, 422, 'INVALID_STATE', true, details);
  }
}

export class WorkflowError extends AppError {
  constructor(message: string = 'Workflow error', details?: Record<string, any>) {
    super(message, 422, 'WORKFLOW_ERROR', true, details);
  }
}

// Error factory function
export function createError(
  type: string,
  message: string,
  details?: Record<string, any>
): AppError {
  switch (type) {
    case 'AUTHENTICATION_ERROR':
      return new AuthenticationError(message, details);
    case 'AUTHORIZATION_ERROR':
      return new AuthorizationError(message, details);
    case 'VALIDATION_ERROR':
      return new ValidationError(message, details);
    case 'NOT_FOUND':
      return new NotFoundError(message, details);
    case 'CONFLICT':
      return new ConflictError(message, details);
    case 'RATE_LIMIT_EXCEEDED':
      return new RateLimitError(message, details);
    case 'SUBSCRIPTION_ERROR':
      return new SubscriptionError(message, details);
    case 'EXTERNAL_SERVICE_ERROR':
      return new ExternalServiceError('Unknown', message, details);
    case 'DATABASE_ERROR':
      return new DatabaseError(message, details);
    case 'FILE_PROCESSING_ERROR':
      return new FileProcessingError(message, details);
    case 'BUSINESS_LOGIC_ERROR':
      return new BusinessLogicError(message, details);
    default:
      return new AppError(message, 500, type, true, details);
  }
}

// Error handler utility
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new AppError(error.message, 500, 'INTERNAL_ERROR', false);
  }
  
  return new AppError('Unknown error occurred', 500, 'UNKNOWN_ERROR', false);
}

// Error response formatter
export function formatErrorResponse(error: AppError) {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details && { details: error.details }),
    },
  };
}
