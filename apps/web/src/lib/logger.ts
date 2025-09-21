// Simplified logger for Vercel deployment
// Uses console methods which are automatically captured by Vercel

type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private context: LogContext = {};
  private isDevelopment = process.env.NODE_ENV !== 'production';
  
  constructor(defaultContext?: LogContext) {
    this.context = {
      service: 'ai-sales-agent',
      environment: process.env.NODE_ENV || 'development',
      ...defaultContext
    };
  }

  private formatMessage(level: string, message: string, meta?: LogContext): string {
    const timestamp = new Date().toISOString();
    const metaString = meta && Object.keys(meta).length > 0 
      ? ` ${JSON.stringify({ ...this.context, ...meta })}` 
      : '';
    return `${timestamp} [${level.toUpperCase()}]: ${message}${metaString}`;
  }

  error(message: string, meta?: LogContext) {
    console.error(this.formatMessage('error', message, meta));
  }

  warn(message: string, meta?: LogContext) {
    console.warn(this.formatMessage('warn', message, meta));
  }

  info(message: string, meta?: LogContext) {
    console.info(this.formatMessage('info', message, meta));
  }

  http(message: string, meta?: LogContext) {
    if (this.isDevelopment) {
      console.log(this.formatMessage('http', message, meta));
    }
  }

  verbose(message: string, meta?: LogContext) {
    if (this.isDevelopment) {
      console.log(this.formatMessage('verbose', message, meta));
    }
  }

  debug(message: string, meta?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }

  silly(message: string, meta?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('silly', message, meta));
    }
  }

  log(level: LogLevel, message: string, meta?: LogContext) {
    this[level](message, meta);
  }

  child(context: LogContext): Logger {
    return new Logger({ ...this.context, ...context });
  }
}

// Create the main logger instance
export const logger = new Logger();

// Create specialized loggers
export const httpLogger = logger.child({ context: 'http' });
export const dbLogger = logger.child({ context: 'database' });
export const authLogger = logger.child({ context: 'auth' });
export const paymentLogger = logger.child({ context: 'payment' });
export const emailLogger = logger.child({ context: 'email' });
export const aiLogger = logger.child({ context: 'ai' });

// Helper functions for structured logging
export function logRequest(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  userId?: string
) {
  httpLogger.info('HTTP Request', {
    method,
    path,
    statusCode,
    duration,
    userId,
  });
}

export function logError(
  error: Error,
  context?: Record<string, any>
) {
  logger.error(error.message, {
    stack: error.stack,
    name: error.name,
    ...context,
  });
}

export function logAudit(
  action: string,
  userId: string,
  resourceType: string,
  resourceId: string,
  details?: Record<string, any>
) {
  logger.info('Audit Log', {
    action,
    userId,
    resourceType,
    resourceId,
    timestamp: new Date().toISOString(),
    ...details,
  });
}

export function logSecurity(
  event: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  details: Record<string, any>
) {
  const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
  logger[level](`Security Event: ${event}`, {
    event,
    severity,
    timestamp: new Date().toISOString(),
    ...details,
  });
}

export function logMetric(
  metric: string,
  value: number,
  unit?: string,
  tags?: Record<string, string>
) {
  logger.info('Metric', {
    metric,
    value,
    unit,
    tags,
    timestamp: new Date().toISOString(),
  });
}

// Async logging with batching for high-volume scenarios
class BatchLogger {
  private batch: any[] = [];
  private batchSize = 100;
  private flushInterval = 5000; // 5 seconds
  private timer: NodeJS.Timeout | null = null;

  constructor(batchSize?: number, flushInterval?: number) {
    if (batchSize) this.batchSize = batchSize;
    if (flushInterval) this.flushInterval = flushInterval;
    this.startTimer();
  }

  log(entry: any) {
    this.batch.push({
      ...entry,
      timestamp: new Date().toISOString(),
    });

    if (this.batch.length >= this.batchSize) {
      this.flush();
    }
  }

  private startTimer() {
    this.timer = setInterval(() => {
      if (this.batch.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  private flush() {
    const entries = [...this.batch];
    this.batch = [];

    // In production, this would send to a log aggregation service
    // For now, just log them individually
    entries.forEach((entry) => {
      logger.info('Batch Log', entry);
    });
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.flush();
  }
}

export const batchLogger = new BatchLogger();

// Graceful shutdown handling (works in Node.js environments)
if (typeof process !== 'undefined' && process.on) {
  process.on('SIGTERM', () => {
    batchLogger.stop();
    logger.info('Logger shutting down gracefully');
  });
}

// Export default logger
export default logger;