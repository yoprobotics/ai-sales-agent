export const APP_NAME = 'AI Sales Agent';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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
];

export const COMPANY_SIZES = [
  { value: 'STARTUP', label: 'Startup (1-10)' },
  { value: 'SMALL', label: 'Small (11-50)' },
  { value: 'MEDIUM', label: 'Medium (51-200)' },
  { value: 'LARGE', label: 'Large (201-1000)' },
  { value: 'ENTERPRISE', label: 'Enterprise (1000+)' },
];

export const PROSPECT_STAGES = [
  { value: 'NEW', label: 'New', color: 'bg-gray-500' },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-blue-500' },
  { value: 'MEETING', label: 'Meeting', color: 'bg-yellow-500' },
  { value: 'NEGOTIATION', label: 'Negotiation', color: 'bg-purple-500' },
  { value: 'WON', label: 'Won', color: 'bg-green-500' },
  { value: 'LOST', label: 'Lost', color: 'bg-red-500' },
];