import { NextRequest } from 'next/server';

// In-memory store for rate limiting (use Redis in production)
const attempts = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of attempts.entries()) {
    if (value.resetAt < now) {
      attempts.delete(key);
    }
  }
}, 60000); // Clean up every minute

export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxAttempts: number; // Maximum attempts in the window
  keyGenerator?: (req: NextRequest) => string; // Function to generate key
}

const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
  keyGenerator: (req) => {
    // Use IP address as key by default
    return req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  },
};

export function rateLimit(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };
  
  return {
    check: (req: NextRequest): { success: boolean; remaining: number; resetAt: Date } => {
      const key = finalConfig.keyGenerator!(req);
      const now = Date.now();
      
      // Get or create attempt record
      let record = attempts.get(key);
      
      if (!record || record.resetAt < now) {
        // Create new record
        record = {
          count: 0,
          resetAt: now + finalConfig.windowMs,
        };
        attempts.set(key, record);
      }
      
      // Increment attempt count
      record.count++;
      
      // Check if limit exceeded
      const success = record.count <= finalConfig.maxAttempts;
      const remaining = Math.max(0, finalConfig.maxAttempts - record.count);
      const resetAt = new Date(record.resetAt);
      
      return { success, remaining, resetAt };
    },
    
    reset: (req: NextRequest): void => {
      const key = finalConfig.keyGenerator!(req);
      attempts.delete(key);
    },
  };
}

// Pre-configured rate limiters
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
  keyGenerator: (req) => {
    // Use email + IP for login attempts
    const body = req.body as any;
    const email = body?.email || '';
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    return `login:${email}:${ip}`;
  },
});

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 100,
});

export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxAttempts: 3,
  keyGenerator: (req) => {
    // Use email for password reset
    const body = req.body as any;
    const email = body?.email || '';
    return `reset:${email}`;
  },
});