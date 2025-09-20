// Global test setup file
require('dotenv').config({ path: '.env.test' });

// Mock environment variables
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-32-characters-long';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-key-32-chars';
process.env.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'test-encryption-key-32-character';
process.env.NODE_ENV = 'test';
process.env.APP_BASE_URL = 'http://localhost:3000';

// Increase test timeout for E2E tests
jest.setTimeout(30000);

// Suppress console logs in tests unless explicitly needed
if (process.env.SUPPRESS_LOGS !== 'false') {
  global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
}

// Global test utilities
global.testUtils = {
  async waitFor(condition, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await condition()) return true;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error('Timeout waiting for condition');
  },

  generateTestUser(overrides = {}) {
    const timestamp = Date.now();
    return {
      email: `test-${timestamp}@test.com`,
      password: 'Test123!@#',
      firstName: 'Test',
      lastName: 'User',
      language: 'en',
      dataRegion: 'US',
      acceptTerms: true,
      ...overrides
    };
  },

  generateTestProspect(overrides = {}) {
    const timestamp = Date.now();
    return {
      email: `prospect-${timestamp}@company.com`,
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'CEO',
      company: {
        name: 'Test Company Inc',
        domain: 'testcompany.com',
        industry: 'Technology',
        size: 'medium',
        location: 'San Francisco, CA'
      },
      source: 'manual',
      ...overrides
    };
  },

  generateTestICP(overrides = {}) {
    return {
      name: 'Test ICP',
      description: 'Test Ideal Customer Profile',
      criteria: {
        industry: ['Technology', 'Software'],
        companySize: ['medium', 'large'],
        location: ['United States', 'Canada'],
        keywords: ['SaaS', 'B2B', 'Enterprise'],
        revenue: '10m_50m'
      },
      ...overrides
    };
  },

  async cleanupDatabase() {
    // This would connect to test DB and clean up test data
    // Implementation depends on your ORM/database setup
  }
};

// Clean up after all tests
afterAll(async () => {
  if (process.env.CLEANUP_TEST_DB === 'true') {
    await global.testUtils.cleanupDatabase();
  }
});
