// Application constants and configuration

// Subscription plans and limits
export const SUBSCRIPTION_PLANS = {
  STARTER: {
    name: 'Starter',
    price: {
      monthly: 49,
      yearly: 490,
    },
    limits: {
      icps: 1,
      prospects: 200,
      sequences: 1,
      messages: 1000,
      teamMembers: 1,
    },
  },
  PRO: {
    name: 'Pro',
    price: {
      monthly: 149,
      yearly: 1490,
    },
    limits: {
      icps: 5,
      prospects: 2000,
      sequences: 10,
      messages: 10000,
      teamMembers: 3,
    },
  },
  BUSINESS: {
    name: 'Business',
    price: {
      monthly: 499,
      yearly: 4990,
    },
    limits: {
      icps: -1, // unlimited
      prospects: -1,
      sequences: -1,
      messages: -1,
      teamMembers: 10,
    },
  },
} as const;

// Scoring weights for prospect qualification
export const SCORING_WEIGHTS = {
  BUDGET: 0.25,
  AUTHORITY: 0.20,
  NEED: 0.25,
  TIMING: 0.15,
  SIGNALS: 0.15,
} as const;

// Industries
export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Consulting',
  'Marketing',
  'Legal',
  'Non-profit',
  'Government',
  'Energy',
  'Transportation',
  'Media',
  'Food & Beverage',
  'Hospitality',
  'Construction',
  'Agriculture',
  'Other',
] as const;

// Company size categories
export const COMPANY_SIZES = {
  startup: { name: 'Startup', employees: '1-10' },
  small: { name: 'Small', employees: '11-50' },
  medium: { name: 'Medium', employees: '51-200' },
  large: { name: 'Large', employees: '201-1000' },
  enterprise: { name: 'Enterprise', employees: '1000+' },
} as const;

// Revenue ranges
export const REVENUE_RANGES = {
  under_1m: { name: 'Under $1M', value: 'under_1m' },
  '1m_10m': { name: '$1M - $10M', value: '1m_10m' },
  '10m_50m': { name: '$10M - $50M', value: '10m_50m' },
  '50m_100m': { name: '$50M - $100M', value: '50m_100m' },
  over_100m: { name: 'Over $100M', value: 'over_100m' },
} as const;

// Rate limiting configuration
export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
  },
  API_REQUESTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3,
  },
  EMAIL_SENDING: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxEmails: 50, // per user
  },
} as const;

// Security configuration
export const SECURITY = {
  JWT_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_HASH_ROUNDS: 12,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes
} as const;