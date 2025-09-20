import { OpenAIService } from '../src/openai-service';

describe('OpenAIService', () => {
  describe('sanitizeData', () => {
    let service: OpenAIService;

    beforeEach(() => {
      // Mock service with fake API key for testing
      service = new OpenAIService({
        apiKey: 'test-api-key',
      });
    });

    it('should redact email addresses', () => {
      const data = {
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          contact: 'test@company.org',
        },
      };

      const result = service.sanitizeData(data);

      expect(result.sanitized.user.email).toBe('[EMAIL_REDACTED]');
      expect(result.sanitized.user.contact).toBe('[EMAIL_REDACTED]');
      expect(result.sanitized.user.name).toBe('John Doe');
      expect(result.removedFields).toContain('user.email');
      expect(result.removedFields).toContain('user.contact');
    });

    it('should redact phone numbers', () => {
      const data = {
        contact: {
          phone: '+1-555-123-4567',
          phoneNumber: '555 123 4567',
          mobile: '(555) 123-4567',
          fax: '123', // Too short, should not be redacted
        },
      };

      const result = service.sanitizeData(data);

      expect(result.sanitized.contact.phone).toBe('[REDACTED]');
      expect(result.sanitized.contact.phoneNumber).toBe('[REDACTED]');
      expect(result.sanitized.contact.mobile).toBe('[PHONE_REDACTED]');
      expect(result.sanitized.contact.fax).toBe('123');
    });

    it('should redact sensitive PII fields', () => {
      const data = {
        user: {
          ssn: '123-45-6789',
          creditCard: '4111-1111-1111-1111',
          password: 'mysecretpassword',
          bankAccount: 'ACC123456789',
          dateOfBirth: '1990-01-01',
        },
      };

      const result = service.sanitizeData(data);

      expect(result.sanitized.user.ssn).toBe('[REDACTED]');
      expect(result.sanitized.user.creditCard).toBe('[REDACTED]');
      expect(result.sanitized.user.password).toBe('[REDACTED]');
      expect(result.sanitized.user.bankAccount).toBe('[REDACTED]');
      expect(result.sanitized.user.dateOfBirth).toBe('[REDACTED]');
    });

    it('should redact API keys and tokens in URLs', () => {
      const data = {
        urls: [
          'https://api.example.com?api_key=secret123&param=value',
          'https://api.example.com?token=abc123xyz',
          'https://api.example.com?secret=mysecret&data=test',
        ],
      };

      const result = service.sanitizeData(data);

      expect(result.sanitized.urls[0]).toContain('api_key=[REDACTED]');
      expect(result.sanitized.urls[0]).toContain('param=value');
      expect(result.sanitized.urls[1]).toContain('token=[REDACTED]');
      expect(result.sanitized.urls[2]).toContain('secret=[REDACTED]');
      expect(result.sanitized.urls[2]).toContain('data=test');
    });

    it('should handle nested objects and arrays', () => {
      const data = {
        users: [
          {
            name: 'User 1',
            email: 'user1@example.com',
            profile: {
              phone: '555-1234-5678',
              address: '123 Main St',
            },
          },
          {
            name: 'User 2',
            email: 'user2@example.com',
            profile: {
              phone: '555-9876-5432',
              address: '456 Oak Ave',
            },
          },
        ],
      };

      const result = service.sanitizeData(data);

      expect(result.sanitized.users[0].email).toBe('[EMAIL_REDACTED]');
      expect(result.sanitized.users[1].email).toBe('[EMAIL_REDACTED]');
      expect(result.sanitized.users[0].profile.phone).toBe('[PHONE_REDACTED]');
      expect(result.sanitized.users[1].profile.phone).toBe('[PHONE_REDACTED]');
      expect(result.sanitized.users[0].profile.address).toBe('[REDACTED]');
      expect(result.sanitized.users[1].profile.address).toBe('[REDACTED]');
      expect(result.removedFields).toContain('users[0].email');
      expect(result.removedFields).toContain('users[1].email');
    });

    it('should preserve non-sensitive data', () => {
      const data = {
        company: {
          name: 'Acme Corp',
          industry: 'Technology',
          size: 'large',
          revenue: '10M-50M',
          description: 'Leading provider of innovative solutions',
          employees: 500,
        },
      };

      const result = service.sanitizeData(data);

      expect(result.sanitized).toEqual(data);
      expect(result.removedFields).toHaveLength(0);
    });

    it('should handle case-insensitive PII field detection', () => {
      const data = {
        Email: 'test@example.com',
        EMAIL: 'test2@example.com',
        PhoneNumber: '555-123-4567',
        CreditCard: '4111111111111111',
      };

      const result = service.sanitizeData(data);

      expect(result.sanitized.Email).toBe('[EMAIL_REDACTED]');
      expect(result.sanitized.EMAIL).toBe('[EMAIL_REDACTED]');
      expect(result.sanitized.PhoneNumber).toBe('[REDACTED]');
      expect(result.sanitized.CreditCard).toBe('[REDACTED]');
    });
  });

  describe('getMetrics', () => {
    let service: OpenAIService;

    beforeEach(() => {
      service = new OpenAIService({
        apiKey: 'test-api-key',
      });
    });

    it('should calculate metrics correctly', () => {
      // Simulate adding metrics
      const metrics = service['metricsLog'];
      metrics.push({
        requestId: 'test1',
        startTime: Date.now() - 1000,
        endTime: Date.now(),
        latencyMs: 1000,
        model: 'gpt-4',
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
        estimatedCost: 0.0075,
      });
      metrics.push({
        requestId: 'test2',
        startTime: Date.now() - 2000,
        endTime: Date.now() - 1000,
        latencyMs: 500,
        model: 'gpt-4',
        promptTokens: 200,
        completionTokens: 100,
        totalTokens: 300,
        estimatedCost: 0.015,
        error: 'Rate limit error',
      });

      const aggregated = service.getMetrics();

      expect(aggregated.totalRequests).toBe(2);
      expect(aggregated.totalTokens).toBe(450);
      expect(aggregated.totalCost).toBeCloseTo(0.02, 2);
      expect(aggregated.averageLatency).toBe(750);
      expect(aggregated.errorRate).toBe(50);
      expect(aggregated.byModel['gpt-4']).toBeDefined();
      expect(aggregated.byModel['gpt-4'].requests).toBe(2);
      expect(aggregated.byModel['gpt-4'].errors).toBe(1);
    });

    it('should filter metrics by date', () => {
      const metrics = service['metricsLog'];
      const now = Date.now();
      
      metrics.push({
        requestId: 'old',
        startTime: now - 10000, // 10 seconds ago
        model: 'gpt-4',
        totalTokens: 100,
      });
      metrics.push({
        requestId: 'recent',
        startTime: now - 1000, // 1 second ago
        model: 'gpt-4',
        totalTokens: 200,
      });

      const since = new Date(now - 5000); // Last 5 seconds
      const filtered = service.getMetrics(since);

      expect(filtered.totalRequests).toBe(1);
      expect(filtered.totalTokens).toBe(200);
    });
  });

  describe('cleanMetrics', () => {
    let service: OpenAIService;

    beforeEach(() => {
      service = new OpenAIService({
        apiKey: 'test-api-key',
      });
    });

    it('should remove old metrics', () => {
      const metrics = service['metricsLog'];
      const now = Date.now();
      
      metrics.push({
        requestId: 'old1',
        startTime: now - 10000,
        model: 'gpt-4',
      });
      metrics.push({
        requestId: 'old2',
        startTime: now - 8000,
        model: 'gpt-4',
      });
      metrics.push({
        requestId: 'recent',
        startTime: now - 1000,
        model: 'gpt-4',
      });

      service.cleanMetrics(new Date(now - 5000));

      expect(service['metricsLog']).toHaveLength(1);
      expect(service['metricsLog'][0].requestId).toBe('recent');
    });
  });
});
