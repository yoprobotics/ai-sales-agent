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

// Validation errors
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', true, details);
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

// Rate limiting errors
export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', details?: Record<string, any>) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', true, details);
  }
}

// Subscription and payment errors
export class SubscriptionError extends AppError {
  constructor(message: string = 'Subscription error', details?: Record<string, any>) {
    super(message, 402, 'SUBSCRIPTION_ERROR', true, details);
  }
}

export class QuotaExceededError extends AppError {
  constructor(resource: string = 'Resource', details?: Record<string, any>) {
    super(`${resource} quota exceeded`, 402, 'QUOTA_EXCEEDED', true, details);
  }
}

// External service errors
export class ExternalServiceError extends AppError {
  constructor(service: string, message: string = 'External service error', details?: Record<string, any>) {
    super(`${service}: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR', true, { service, ...details });
  }
}

// Database errors
export class DatabaseError extends AppError {
  constructor(message: string = 'Database error', details?: Record<string, any>) {
    super(message, 500, 'DATABASE_ERROR', false, details);
  }
}

// File processing errors
export class FileProcessingError extends AppError {
  constructor(message: string = 'File processing error', details?: Record<string, any>) {
    super(message, 400, 'FILE_PROCESSING_ERROR', true, details);
  }
}

// Business logic errors
export class BusinessLogicError extends AppError {
  constructor(message: string = 'Business logic error', details?: Record<string, any>) {
    super(message, 422, 'BUSINESS_LOGIC_ERROR', true, details);
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