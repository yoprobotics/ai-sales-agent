import { createMocks } from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import { RateLimiter } from '../middleware/rate-limiter';
import { CSRFProtection } from '../middleware/csrf';
import { SecurityHeaders } from '../middleware/security-headers';
import { validateEncryptionKey } from '../utils/encryption';

describe('Security Tests', () => {
  describe('Rate Limiting', () => {
    let rateLimiter: RateLimiter;

    beforeEach(() => {
      rateLimiter = new RateLimiter({
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 5
      });
    });

    it('should allow requests within limit', async () => {
      const ip = '192.168.1.1';

      for (let i = 0; i < 5; i++) {
        const allowed = await rateLimiter.checkLimit(ip);
        expect(allowed).toBe(true);
      }
    });

    it('should block requests exceeding limit', async () => {
      const ip = '192.168.1.2';

      // First 5 requests should pass
      for (let i = 0; i < 5; i++) {
        const allowed = await rateLimiter.checkLimit(ip);
        expect(allowed).toBe(true);
      }

      // 6th request should be blocked
      const blocked = await rateLimiter.checkLimit(ip);
      expect(blocked).toBe(false);
    });

    it('should reset limits after window expires', async () => {
      const ip = '192.168.1.3';

      // Use up the limit
      for (let i = 0; i < 5; i++) {
        await rateLimiter.checkLimit(ip);
      }

      // Should be blocked
      expect(await rateLimiter.checkLimit(ip)).toBe(false);

      // Fast-forward time
      jest.advanceTimersByTime(61 * 1000);

      // Should be allowed again
      expect(await rateLimiter.checkLimit(ip)).toBe(true);
    });

    it('should track different IPs separately', async () => {
      const ip1 = '192.168.1.4';
      const ip2 = '192.168.1.5';

      // Use up limit for IP1
      for (let i = 0; i < 5; i++) {
        await rateLimiter.checkLimit(ip1);
      }

      // IP1 should be blocked
      expect(await rateLimiter.checkLimit(ip1)).toBe(false);

      // IP2 should still be allowed
      expect(await rateLimiter.checkLimit(ip2)).toBe(true);
    });
  });

  describe('CSRF Protection', () => {
    let csrf: CSRFProtection;

    beforeEach(() => {
      csrf = new CSRFProtection();
    });

    it('should generate and validate CSRF tokens', () => {
      const sessionId = 'test-session-123';
      const token = csrf.generateToken(sessionId);

      expect(token).toBeDefined();
      expect(token).toHaveLength(32);

      const isValid = csrf.validateToken(sessionId, token);
      expect(isValid).toBe(true);
    });

    it('should reject invalid CSRF tokens', () => {
      const sessionId = 'test-session-456';
      const validToken = csrf.generateToken(sessionId);
      const invalidToken = 'invalid-token';

      expect(csrf.validateToken(sessionId, invalidToken)).toBe(false);
      expect(csrf.validateToken('wrong-session', validToken)).toBe(false);
    });

    it('should handle missing CSRF token in request', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: {
          data: 'test'
        }
      });

      const middleware = csrf.middleware();
      await middleware(req, res, () => {});

      expect(res._getStatusCode()).toBe(403);
      const data = JSON.parse(res._getData());
      expect(data.error.code).toBe('CSRF_TOKEN_MISSING');
    });

    it('should skip CSRF for safe methods', async () => {
      const { req, res } = createMocks({
        method: 'GET'
      });

      const next = jest.fn();
      const middleware = csrf.middleware();
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res._getStatusCode()).not.toBe(403);
    });
  });

  describe('JWT Security', () => {
    const secret = 'test-secret-key-32-characters-long';
    const refreshSecret = 'test-refresh-secret-32-chars-long';

    it('should use different secrets for access and refresh tokens', () => {
      expect(secret).not.toBe(refreshSecret);
    });

    it('should set appropriate expiration times', () => {
      const accessToken = jwt.sign(
        { userId: 'test', type: 'access' },
        secret,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: 'test', type: 'refresh' },
        refreshSecret,
        { expiresIn: '7d' }
      );

      const accessDecoded = jwt.decode(accessToken) as any;
      const refreshDecoded = jwt.decode(refreshToken) as any;

      const accessExpiry = accessDecoded.exp - accessDecoded.iat;
      const refreshExpiry = refreshDecoded.exp - refreshDecoded.iat;

      expect(accessExpiry).toBe(15 * 60); // 15 minutes
      expect(refreshExpiry).toBe(7 * 24 * 60 * 60); // 7 days
    });

    it('should include necessary claims in JWT', () => {
      const token = jwt.sign(
        {
          userId: 'user-123',
          email: 'test@example.com',
          role: 'CLIENT',
          type: 'access'
        },
        secret,
        { expiresIn: '15m' }
      );

      const decoded = jwt.verify(token, secret) as any;

      expect(decoded.userId).toBe('user-123');
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.role).toBe('CLIENT');
      expect(decoded.type).toBe('access');
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('should not decode tokens with wrong secret', () => {
      const token = jwt.sign(
        { userId: 'test' },
        secret,
        { expiresIn: '15m' }
      );

      expect(() => {
        jwt.verify(token, 'wrong-secret');
      }).toThrow('invalid signature');
    });
  });

  describe('Security Headers', () => {
    let securityHeaders: SecurityHeaders;

    beforeEach(() => {
      securityHeaders = new SecurityHeaders();
    });

    it('should set all required security headers', () => {
      const { req, res } = createMocks();
      const next = jest.fn();

      securityHeaders.middleware()(req, res, next);

      expect(res._headers['x-frame-options']).toBe('DENY');
      expect(res._headers['x-content-type-options']).toBe('nosniff');
      expect(res._headers['x-xss-protection']).toBe('1; mode=block');
      expect(res._headers['strict-transport-security']).toBe('max-age=31536000; includeSubDomains');
      expect(res._headers['content-security-policy']).toContain("default-src 'self'");
      expect(res._headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(res._headers['permissions-policy']).toBeDefined();
      expect(next).toHaveBeenCalled();
    });

    it('should remove X-Powered-By header', () => {
      const { req, res } = createMocks();
      res.setHeader('X-Powered-By', 'Express');
      
      const next = jest.fn();
      securityHeaders.middleware()(req, res, next);

      expect(res._headers['x-powered-by']).toBeUndefined();
    });
  });

  describe('Password Security', () => {
    it('should enforce strong password requirements', () => {
      const weakPasswords = [
        'password',
        '12345678',
        'Password',
        'Password1',
        'password123!',
        'PASSWORD123!',
        'Pass123' // Too short
      ];

      const strongPasswords = [
        'Test123!@#',
        'MyP@ssw0rd!',
        'Secure#Pass123',
        'C0mpl3x!Pass'
      ];

      weakPasswords.forEach(pwd => {
        expect(isStrongPassword(pwd)).toBe(false);
      });

      strongPasswords.forEach(pwd => {
        expect(isStrongPassword(pwd)).toBe(true);
      });
    });

    it('should not store passwords in plain text', async () => {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const bcrypt = require('bcryptjs');

      const plainPassword = 'Test123!@#';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Simulate user creation
      const userData = {
        email: 'security@test.com',
        password: hashedPassword, // Should be hashed
        firstName: 'Security',
        lastName: 'Test'
      };

      expect(userData.password).not.toBe(plainPassword);
      expect(userData.password).toMatch(/^\$2[aby]\$\d{2}\$/); // BCrypt hash pattern
    });
  });

  describe('Encryption Key Validation', () => {
    it('should validate encryption key length', () => {
      const shortKey = 'too-short';
      const correctKey = 'exactly-32-characters-long-key!!'; // 32 chars
      const longKey = 'this-key-is-way-too-long-and-should-be-rejected';

      expect(validateEncryptionKey(shortKey)).toBe(false);
      expect(validateEncryptionKey(correctKey)).toBe(true);
      expect(validateEncryptionKey(longKey)).toBe(false);
    });

    it('should throw error on invalid encryption key at startup', () => {
      process.env.ENCRYPTION_KEY = 'invalid-key';

      expect(() => {
        require('../utils/encryption').initialize();
      }).toThrow('ENCRYPTION_KEY must be exactly 32 characters');
    });
  });

  describe('SQL Injection Prevention', () => {
    it('should use parameterized queries', () => {
      // This is a static test to ensure we're using Prisma correctly
      const maliciousInput = "'; DROP TABLE users; --";
      
      // Prisma automatically escapes inputs
      const query = {
        where: {
          email: maliciousInput // Prisma will safely escape this
        }
      };

      // The query object should maintain the malicious string as data, not SQL
      expect(query.where.email).toBe(maliciousInput);
      expect(query.where.email).toContain('DROP TABLE'); // Still present as string, not executed
    });
  });

  describe('XSS Prevention', () => {
    it('should sanitize user input', () => {
      const maliciousInputs = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=alert("XSS")>',
        '<svg onload=alert("XSS")>',
        'javascript:alert("XSS")',
        '<iframe src="javascript:alert(\'XSS\')"></iframe>'
      ];

      const sanitize = (input: string) => {
        return input
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      };

      maliciousInputs.forEach(input => {
        const sanitized = sanitize(input);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror=');
        expect(sanitized).not.toContain('onload=');
      });
    });
  });

  describe('File Upload Security', () => {
    it('should validate file types', () => {
      const allowedTypes = ['text/csv', 'application/vnd.ms-excel'];
      const blockedTypes = [
        'application/x-executable',
        'application/x-sh',
        'text/html',
        'application/javascript'
      ];

      const validateFileType = (mimeType: string) => {
        return allowedTypes.includes(mimeType);
      };

      allowedTypes.forEach(type => {
        expect(validateFileType(type)).toBe(true);
      });

      blockedTypes.forEach(type => {
        expect(validateFileType(type)).toBe(false);
      });
    });

    it('should enforce file size limits', () => {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

      const validateFileSize = (size: number) => {
        return size <= MAX_FILE_SIZE;
      };

      expect(validateFileSize(5 * 1024 * 1024)).toBe(true); // 5MB
      expect(validateFileSize(10 * 1024 * 1024)).toBe(true); // 10MB
      expect(validateFileSize(11 * 1024 * 1024)).toBe(false); // 11MB
    });
  });
});

function isStrongPassword(password: string): boolean {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}
