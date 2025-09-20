// Jest setup for API tests
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

// Load test environment variables
dotenv.config({ path: '../../.env.test' });

// Create test database client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Make prisma available globally in tests
global.prisma = prisma;

// Setup test database before all tests
beforeAll(async () => {
  // Run migrations
  // await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS public`;
  // Add any test-specific setup here
});

// Clean up after each test
afterEach(async () => {
  // Clean up test data in reverse order of dependencies
  const tablenames = [
    'Message',
    'Campaign',
    'EmailSequenceStep',
    'EmailSequence',
    'Activity',
    'Prospect',
    'ICP',
    'User',
  ];

  for (const tablename of tablenames) {
    try {
      await prisma[tablename.charAt(0).toLowerCase() + tablename.slice(1)].deleteMany({});
    } catch (error) {
      console.error(`Error cleaning ${tablename}:`, error);
    }
  }
});

// Disconnect after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Mock external services
jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    customers: {
      create: jest.fn().mockResolvedValue({ id: 'cus_test123' }),
      retrieve: jest.fn().mockResolvedValue({ id: 'cus_test123', email: 'test@example.com' }),
      update: jest.fn().mockResolvedValue({ id: 'cus_test123' }),
      del: jest.fn().mockResolvedValue({ deleted: true })
    },
    subscriptions: {
      create: jest.fn().mockResolvedValue({ 
        id: 'sub_test123',
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
      }),
      retrieve: jest.fn().mockResolvedValue({ id: 'sub_test123', status: 'active' }),
      update: jest.fn().mockResolvedValue({ id: 'sub_test123', status: 'active' }),
      cancel: jest.fn().mockResolvedValue({ id: 'sub_test123', status: 'canceled' })
    },
    webhooks: {
      constructEvent: jest.fn().mockImplementation((payload, sig, secret) => payload)
    }
  }))
}));

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue([{ statusCode: 202 }]),
  sendMultiple: jest.fn().mockResolvedValue([{ statusCode: 202 }])
}));

jest.mock('openai', () => ({
  __esModule: true,
  default: class OpenAI {
    constructor() {
      this.chat = {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{
              message: {
                content: JSON.stringify({
                  score: 85,
                  breakdown: {
                    budget: 90,
                    authority: 85,
                    need: 80,
                    timing: 85
                  },
                  explanation: 'High-quality prospect based on company size and industry match',
                  confidence: 0.92
                })
              }
            }],
            usage: {
              total_tokens: 150
            }
          })
        }
      };
    }
  }
}));
