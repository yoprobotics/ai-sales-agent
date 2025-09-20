import { z } from 'zod';

/**
 * Environment variables validation schema
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // JWT Secrets
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  
  // Encryption
  ENCRYPTION_KEY: z.string().length(32, 'ENCRYPTION_KEY must be exactly 32 characters'),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'Invalid Stripe secret key'),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_', 'Invalid Stripe publishable key'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_', 'Invalid Stripe webhook secret'),
  
  // SendGrid
  SENDGRID_API_KEY: z.string().startsWith('SG.', 'Invalid SendGrid API key'),
  SENDGRID_FROM_EMAIL: z.string().email('Invalid SendGrid from email'),
  SENDGRID_WEBHOOK_SECRET: z.string().optional(),
  
  // OpenAI
  OPENAI_API_KEY: z.string().startsWith('sk-', 'Invalid OpenAI API key'),
  
  // App Configuration
  APP_BASE_URL: z.string().url('Invalid APP_BASE_URL'),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  
  // Admin
  ADMIN_EMAIL: z.string().email('Invalid ADMIN_EMAIL'),
  
  // Storage (Optional)
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  S3_BUCKET_NAME: z.string().optional(),
});

/**
 * Validated environment variables
 */
let env: z.infer<typeof envSchema>;

/**
 * Validate environment variables at startup
 */
export function validateEnv() {
  try {
    env = envSchema.parse(process.env);
    
    // Additional runtime checks
    validateSecrets();
    
    console.log('✅ Environment variables validated successfully');
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error('❌ Environment validation error:', error);
    }
    
    // Exit process in production, continue in development with warning
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    throw error;
  }
}

/**
 * Additional validation for sensitive values
 */
function validateSecrets() {
  const secrets = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'ENCRYPTION_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'SENDGRID_API_KEY',
  ];
  
  secrets.forEach(secret => {
    const value = process.env[secret];
    if (value) {
      // Check for placeholder values
      if (value.includes('your-') || value.includes('change-this') || value === 'test') {
        throw new Error(`${secret} contains a placeholder value. Please set a secure value.`);
      }
      
      // Check for common weak values
      const weakValues = ['secret', 'password', '12345', 'admin', 'test123'];
      if (weakValues.some(weak => value.toLowerCase().includes(weak))) {
        throw new Error(`${secret} appears to be a weak value. Please use a strong, random value.`);
      }
    }
  });
  
  // Ensure different values for JWT secrets
  if (process.env.JWT_SECRET === process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be different values');
  }
}

/**
 * Get validated environment variables
 * Call this after validateEnv() has been run
 */
export function getEnv() {
  if (!env) {
    throw new Error('Environment not validated. Call validateEnv() first.');
  }
  return env;
}

/**
 * Type-safe environment variable access
 */
export const config = new Proxy({} as z.infer<typeof envSchema>, {
  get: (target, prop) => {
    if (!env) {
      validateEnv();
    }
    return env[prop as keyof typeof env];
  },
});

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in test environment
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Log sanitized environment info (for debugging)
 */
export function logEnvironmentInfo() {
  console.log('Environment Info:');
  console.log(`  - NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`  - Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
  console.log(`  - Stripe: ${process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`  - SendGrid: ${process.env.SENDGRID_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`  - OpenAI: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`  - App URL: ${process.env.APP_BASE_URL || 'Not set'}`);
}

// Auto-validate on import in production
if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  validateEnv();
}

export default config;
