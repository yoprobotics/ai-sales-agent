import { LRUCache } from 'lru-cache';

type RateLimitConfig = {
  interval: number; // milliseconds
  uniqueTokenPerInterval: number; // max requests per interval
};

export class RateLimiter {
  private tokenCache: LRUCache<string, number[]>;
  private interval: number;

  constructor(config: RateLimitConfig) {
    this.interval = config.interval;
    this.tokenCache = new LRUCache({
      max: config.uniqueTokenPerInterval,
      ttl: config.interval,
    });
  }

  async check(identifier: string, limit: number): Promise<boolean> {
    const tokenCount = this.tokenCache.get(identifier) || [];
    const now = Date.now();
    const validTokens = tokenCount.filter(
      (timestamp) => now - timestamp < this.interval
    );

    if (validTokens.length >= limit) {
      return false;
    }

    validTokens.push(now);
    this.tokenCache.set(identifier, validTokens);
    return true;
  }

  reset(identifier: string): void {
    this.tokenCache.delete(identifier);
  }

  remaining(identifier: string, limit: number): number {
    const tokenCount = this.tokenCache.get(identifier) || [];
    const now = Date.now();
    const validTokens = tokenCount.filter(
      (timestamp) => now - timestamp < this.interval
    );
    return Math.max(0, limit - validTokens.length);
  }
}

// Preset rate limiters for different use cases
export const loginRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 5, // 5 attempts per 15 minutes
});

export const apiRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100, // 100 requests per minute
});

export const emailRateLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 50, // 50 emails per hour
});
