// Environment variables validation and typing

interface EnvironmentVariables {
  // Database
  DATABASE_URL: string
  
  // Authentication
  JWT_SECRET: string
  JWT_REFRESH_SECRET?: string
  
  // Stripe
  STRIPE_SECRET_KEY: string
  STRIPE_PUBLISHABLE_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  
  // SendGrid
  SENDGRID_API_KEY: string
  SENDGRID_FROM_EMAIL?: string
  
  // OpenAI
  OPENAI_API_KEY: string
  
  // AWS/S3 (optional)
  AWS_ACCESS_KEY_ID?: string
  AWS_SECRET_ACCESS_KEY?: string
  AWS_REGION?: string
  S3_BUCKET_NAME?: string
  
  // App
  NEXT_PUBLIC_APP_URL: string
  NODE_ENV: 'development' | 'test' | 'production'
  
  // Other
  ENCRYPTION_KEY?: string
}

function getEnvVar(key: keyof EnvironmentVariables): string {
  const value = process.env[key]
  
  // In production, all required env vars must be set
  if (process.env.NODE_ENV === 'production' && !value) {
    const requiredVars: (keyof EnvironmentVariables)[] = [
      'DATABASE_URL',
      'JWT_SECRET',
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLISHABLE_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'SENDGRID_API_KEY',
      'OPENAI_API_KEY',
      'NEXT_PUBLIC_APP_URL',
    ]
    
    if (requiredVars.includes(key)) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  }
  
  return value || ''
}

export const env: EnvironmentVariables = {
  // Database
  DATABASE_URL: getEnvVar('DATABASE_URL') || 'postgresql://postgres:postgres@localhost:5432/ai_sales_agent',
  
  // Authentication
  JWT_SECRET: getEnvVar('JWT_SECRET') || 'your-secret-key-change-in-production',
  JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET'),
  
  // Stripe
  STRIPE_SECRET_KEY: getEnvVar('STRIPE_SECRET_KEY') || 'sk_test_placeholder',
  STRIPE_PUBLISHABLE_KEY: getEnvVar('STRIPE_PUBLISHABLE_KEY') || 'pk_test_placeholder',
  STRIPE_WEBHOOK_SECRET: getEnvVar('STRIPE_WEBHOOK_SECRET') || 'whsec_placeholder',
  
  // SendGrid
  SENDGRID_API_KEY: getEnvVar('SENDGRID_API_KEY') || 'SG.placeholder',
  SENDGRID_FROM_EMAIL: getEnvVar('SENDGRID_FROM_EMAIL') || 'noreply@example.com',
  
  // OpenAI
  OPENAI_API_KEY: getEnvVar('OPENAI_API_KEY') || 'sk-placeholder',
  
  // AWS/S3
  AWS_ACCESS_KEY_ID: getEnvVar('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: getEnvVar('AWS_SECRET_ACCESS_KEY'),
  AWS_REGION: getEnvVar('AWS_REGION') || 'us-east-1',
  S3_BUCKET_NAME: getEnvVar('S3_BUCKET_NAME'),
  
  // App
  NEXT_PUBLIC_APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000',
  NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'test' | 'production',
  
  // Other
  ENCRYPTION_KEY: getEnvVar('ENCRYPTION_KEY'),
}

export default env
