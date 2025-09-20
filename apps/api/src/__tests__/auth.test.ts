import { createMocks } from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

// Mock handlers (these would be your actual API route handlers)
import { register, login, refresh, logout } from '../pages/api/auth';

const prisma = global.prisma as PrismaClient;

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'newuser@example.com',
          password: 'Test123!@#',
          firstName: 'New',
          lastName: 'User',
          language: 'en',
          dataRegion: 'US',
          acceptTerms: true
        }
      });

      await register(req, res);

      expect(res._getStatusCode()).toBe(201);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.user).toBeDefined();
      expect(data.data.user.email).toBe('newuser@example.com');
      expect(data.data.accessToken).toBeDefined();
      expect(data.data.refreshToken).toBeDefined();

      // Verify user was created in database
      const user = await prisma.user.findUnique({
        where: { email: 'newuser@example.com' }
      });
      expect(user).toBeDefined();
      expect(user?.firstName).toBe('New');
    });

    it('should reject duplicate email registration', async () => {
      // Create existing user
      await prisma.user.create({
        data: {
          email: 'existing@example.com',
          password: await bcrypt.hash('password', 10),
          firstName: 'Existing',
          lastName: 'User',
          role: 'CLIENT',
          plan: 'STARTER',
          dataRegion: 'US',
          language: 'en',
          isEmailVerified: false
        }
      });

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'existing@example.com',
          password: 'Test123!@#',
          firstName: 'New',
          lastName: 'User',
          acceptTerms: true
        }
      });

      await register(req, res);

      expect(res._getStatusCode()).toBe(409);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('DUPLICATE_EMAIL');
    });

    it('should validate required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'invalid-email',
          password: 'weak'
        }
      });

      await register(req, res);

      expect(res._getStatusCode()).toBe(400);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: await bcrypt.hash('Test123!@#', 10),
          firstName: 'Test',
          lastName: 'User',
          role: 'CLIENT',
          plan: 'STARTER',
          dataRegion: 'US',
          language: 'en',
          isEmailVerified: true
        }
      });
    });

    it('should login with valid credentials', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'Test123!@#'
        }
      });

      await login(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.user.email).toBe('test@example.com');
      expect(data.data.accessToken).toBeDefined();
      expect(data.data.refreshToken).toBeDefined();

      // Verify JWT tokens
      const decoded = jwt.verify(data.data.accessToken, process.env.JWT_SECRET!);
      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('email', 'test@example.com');
    });

    it('should reject invalid password', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'WrongPassword123!'
        }
      });

      await login(req, res);

      expect(res._getStatusCode()).toBe(401);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject non-existent user', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'nonexistent@example.com',
          password: 'Test123!@#'
        }
      });

      await login(req, res);

      expect(res._getStatusCode()).toBe(401);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should track last login time', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'Test123!@#'
        }
      });

      await login(req, res);

      const user = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      });

      expect(user?.lastLoginAt).toBeDefined();
      expect(user?.lastLoginAt).toBeInstanceOf(Date);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      const userId = 'test-user-id';
      const refreshToken = jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
      );

      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          cookie: `refreshToken=${refreshToken}`
        }
      });

      await refresh(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);
      expect(data.data.accessToken).toBeDefined();
      expect(data.data.accessToken).not.toBe(refreshToken);
    });

    it('should reject invalid refresh token', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          cookie: 'refreshToken=invalid-token'
        }
      });

      await refresh(req, res);

      expect(res._getStatusCode()).toBe(401);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_REFRESH_TOKEN');
    });

    it('should reject expired refresh token', async () => {
      const expiredToken = jwt.sign(
        { userId: 'test', type: 'refresh' },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '-1s' }
      );

      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          cookie: `refreshToken=${expiredToken}`
        }
      });

      await refresh(req, res);

      expect(res._getStatusCode()).toBe(401);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('TOKEN_EXPIRED');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear auth cookies on logout', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          authorization: 'Bearer valid-token'
        }
      });

      await logout(req, res);

      expect(res._getStatusCode()).toBe(200);
      const data = JSON.parse(res._getData());
      expect(data.success).toBe(true);

      // Check that cookies are cleared
      const cookies = res._getHeaders()['set-cookie'];
      expect(cookies).toContain('accessToken=; Max-Age=0');
      expect(cookies).toContain('refreshToken=; Max-Age=0');
    });
  });
});
