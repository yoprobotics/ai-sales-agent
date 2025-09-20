import { NextRequest } from 'next/server';

/**
 * Sensitive keys that should never be logged
 */
const SENSITIVE_KEYS = [
  'password',
  'passwordHash',
  'token',
  'accessToken',
  'refreshToken',
  'access_token',
  'refresh_token',
  'api_key',
  'apiKey',
  'secret',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'ENCRYPTION_KEY',
  'STRIPE_SECRET_KEY',
  'SENDGRID_API_KEY',
  'OPENAI_API_KEY',
  'DATABASE_URL',
  'authorization',
  'cookie',
  'session',
  'creditCard',
  'cvv',
  'ssn',
  'socialSecurityNumber',
];

/**
 * Patterns to detect sensitive data
 */
const SENSITIVE_PATTERNS = [
  /^sk_[a-zA-Z0-9]{32,}$/, // Stripe secret key
  /^pk_[a-zA-Z0-9]{32,}$/, // Stripe public key
  /^SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}$/, // SendGrid API key
  /^sk-[a-zA-Z0-9]{48}$/, // OpenAI API key
  /^Bearer\s+[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/, // JWT token
  /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/, // Credit card number
  /^\d{3,4}$/, // CVV
  /^\d{3}-\d{2}-\d{4}$/, // SSN
];

/**
 * Sanitize object for logging by removing sensitive data
 */
export function sanitizeForLogging(obj: any, depth = 0): any {
  // Prevent deep recursion
  if (depth > 10) return '[MAX_DEPTH]';
  
  // Handle null and undefined
  if (obj === null || obj === undefined) return obj;
  
  // Handle primitives
  if (typeof obj !== 'object') {
    // Check if value matches sensitive patterns
    const strValue = String(obj);
    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(strValue)) {
        return '[REDACTED]';
      }
    }
    return obj;
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForLogging(item, depth + 1));
  }
  
  // Handle objects
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // Check if key is sensitive
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
      continue;
    }
    
    // Recursively sanitize value
    sanitized[key] = sanitizeForLogging(value, depth + 1);
  }
  
  return sanitized;
}

/**
 * Create a safe log entry from a request
 */
export function createSafeLogEntry(request: NextRequest, additionalData?: any) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Safe headers (exclude sensitive ones)
  const safeHeaders: Record<string, string> = {};
  const headerEntries = Array.from(request.headers.entries());
  
  for (const [key, value] of headerEntries) {
    const lowerKey = key.toLowerCase();
    if (lowerKey === 'authorization' || lowerKey === 'cookie') {
      safeHeaders[key] = '[REDACTED]';
    } else {
      safeHeaders[key] = value;
    }
  }
  
  // Safe query parameters
  const safeQuery: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive.toLowerCase()))) {
      safeQuery[key] = '[REDACTED]';
    } else {
      safeQuery[key] = value;
    }
  });
  
  return {
    timestamp: new Date().toISOString(),
    method: request.method,
    path: pathname,
    query: safeQuery,
    headers: safeHeaders,
    ip: request.headers.get('x-forwarded-for') || 
        request.headers.get('x-real-ip') || 
        'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    requestId: request.headers.get('x-request-id') || crypto.randomUUID(),
    ...(additionalData ? { data: sanitizeForLogging(additionalData) } : {}),
  };
}

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

/**
 * Structured logger
 */
export class SecureLogger {
  private context: string;
  
  constructor(context: string) {
    this.context = context;
  }
  
  private log(level: LogLevel, message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      ...(data ? { data: sanitizeForLogging(data) } : {}),
    };
    
    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to logging service (e.g., DataDog, LogRocket, etc.)
      console.log(JSON.stringify(logEntry));
    } else {
      // In development, use console with colors
      const colors = {
        [LogLevel.DEBUG]: '\x1b[36m', // Cyan
        [LogLevel.INFO]: '\x1b[32m',  // Green
        [LogLevel.WARN]: '\x1b[33m',  // Yellow
        [LogLevel.ERROR]: '\x1b[31m', // Red
        [LogLevel.FATAL]: '\x1b[35m', // Magenta
      };
      
      const color = colors[level];
      const reset = '\x1b[0m';
      
      console.log(
        `${color}[${level}]${reset} [${this.context}] ${message}`,
        data ? sanitizeForLogging(data) : ''
      );
    }
  }
  
  debug(message: string, data?: any) {
    if (process.env.NODE_ENV !== 'production') {
      this.log(LogLevel.DEBUG, message, data);
    }
  }
  
  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }
  
  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }
  
  error(message: string, error?: Error | any, data?: any) {
    const errorData = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
          ...data,
        }
      : { error, ...data };
    
    this.log(LogLevel.ERROR, message, errorData);
  }
  
  fatal(message: string, error?: Error | any, data?: any) {
    const errorData = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
          ...data,
        }
      : { error, ...data };
    
    this.log(LogLevel.FATAL, message, errorData);
    
    // In production, trigger alerts
    if (process.env.NODE_ENV === 'production') {
      // TODO: Trigger alert (e.g., PagerDuty, OpsGenie, etc.)
    }
  }
  
  /**
   * Log API request/response
   */
  logRequest(request: NextRequest, response?: any, duration?: number) {
    const entry = createSafeLogEntry(request, {
      response: response ? sanitizeForLogging(response) : undefined,
      duration: duration ? `${duration}ms` : undefined,
    });
    
    this.info('API Request', entry);
  }
  
  /**
   * Log security event
   */
  logSecurityEvent(event: string, request: NextRequest, details?: any) {
    const entry = createSafeLogEntry(request, {
      securityEvent: event,
      details: details ? sanitizeForLogging(details) : undefined,
    });
    
    this.warn(`Security Event: ${event}`, entry);
  }
}

/**
 * Create a logger instance for a specific context
 */
export function createLogger(context: string): SecureLogger {
  return new SecureLogger(context);
}

/**
 * Default logger instances
 */
export const authLogger = createLogger('Auth');
export const apiLogger = createLogger('API');
export const securityLogger = createLogger('Security');
export const stripeLogger = createLogger('Stripe');
export const emailLogger = createLogger('Email');
export const aiLogger = createLogger('AI');
