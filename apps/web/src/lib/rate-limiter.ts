// Temporary rate limiter - will be properly implemented after deployment

class RateLimiter {
  async check(key: string, limit: number): Promise<boolean> {
    // Temporary implementation - always allow
    return true;
  }
}

export const apiRateLimiter = new RateLimiter();
export const loginRateLimiter = new RateLimiter();
