// Application constants

export const APP_NAME = 'AI Sales Agent'
export const APP_DESCRIPTION = 'AI-powered B2B prospecting platform'

// Plans
export const PLANS = {
  STARTER: {
    name: 'Starter',
    price: 49,
    limits: {
      prospects: 200,
      icps: 1,
      sequences: 1,
      messages: 1000
    }
  },
  PRO: {
    name: 'Pro', 
    price: 149,
    limits: {
      prospects: 2000,
      icps: 5,
      sequences: 10,
      messages: 10000
    }
  },
  BUSINESS: {
    name: 'Business',
    price: 499,
    limits: {
      prospects: -1, // unlimited
      icps: -1,
      sequences: -1,
      messages: -1
    }
  }
} as const

// User roles
export const USER_ROLES = {
  CLIENT: 'CLIENT',
  ADMIN: 'ADMIN',
  TEAM_MEMBER: 'TEAM_MEMBER',
  TEAM_OWNER: 'TEAM_OWNER'
} as const

// Data regions
export const DATA_REGIONS = {
  US: 'United States',
  EU: 'European Union',
  CA: 'Canada'
} as const

// Languages
export const LANGUAGES = {
  en: 'English',
  fr: 'Français'
} as const

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh'
  },
  PROSPECTS: {
    LIST: '/api/prospects',
    CREATE: '/api/prospects',
    UPDATE: '/api/prospects/:id',
    DELETE: '/api/prospects/:id',
    IMPORT: '/api/prospects/import'
  },
  EMAIL: {
    SEND: '/api/email/send',
    STATS: '/api/email/stats'
  }
} as const

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'access-token',
  REFRESH_TOKEN: 'refresh-token',
  SESSION: 'session'
} as const

// Token expiry times
export const TOKEN_EXPIRY = {
  ACCESS: '15m',
  REFRESH: '7d'
} as const