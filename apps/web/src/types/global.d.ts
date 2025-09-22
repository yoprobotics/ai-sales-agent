// Global type definitions

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      DATABASE_URL: string
      JWT_SECRET: string
      JWT_REFRESH_SECRET?: string
      NEXT_PUBLIC_APP_URL: string
      STRIPE_SECRET_KEY: string
      STRIPE_PUBLISHABLE_KEY: string
      STRIPE_WEBHOOK_SECRET: string
      SENDGRID_API_KEY: string
      SENDGRID_FROM_EMAIL?: string
      OPENAI_API_KEY: string
      AWS_ACCESS_KEY_ID?: string
      AWS_SECRET_ACCESS_KEY?: string
      AWS_REGION?: string
      S3_BUCKET_NAME?: string
      ENCRYPTION_KEY?: string
    }
  }
}

export {}
