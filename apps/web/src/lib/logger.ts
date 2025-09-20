import winston from 'winston';

// Log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Create the logger
export const logger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  defaultMeta: {
    service: 'ai-sales-agent',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version,
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }`;
        }),
      ),
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
  ],
});

// Add file transports in production
if (process.env.NODE_ENV === 'production') {
  // Error log file
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true,
    })
  );

  // Combined log file
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true,
    })
  );
}

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
  logger.log(level, `Security Event: ${event}`, {
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

// Graceful shutdown
process.on('SIGTERM', () => {
  batchLogger.stop();
  logger.info('Logger shutting down gracefully');
});

// Export default logger
export default logger;
