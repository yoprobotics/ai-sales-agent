# Vercel Deployment Guide

## 🚀 Deployment Fix Applied

This pull request fixes the Vercel deployment issues by:

1. **Moving `prisma` from devDependencies to dependencies** - Vercel doesn't install devDependencies in production builds
2. **Adding `.env.example`** - Template for required environment variables
3. **Updating `next.config.mjs`** - Proper configuration for Prisma and build settings

## 📝 Required Environment Variables in Vercel

You must configure these environment variables in your Vercel dashboard:

### Essential Variables (Required)

```env
DATABASE_URL="postgresql://user:password@host:5432/ai_sales_agent?sslmode=require"
JWT_SECRET="[generate with: openssl rand -hex 32]"
JWT_REFRESH_SECRET="[generate with: openssl rand -hex 32]"
```

⚠️ **IMPORTANT**: Replace the JWT secrets you're currently using with new secure ones generated using `openssl rand -hex 32`

### Optional Variables (Can be added later)

```env
# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# SendGrid (for emails)
SENDGRID_API_KEY="SG..."
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"

# OpenAI (for AI features)
OPENAI_API_KEY="sk-..."

# App Configuration
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
NODE_ENV="production"
ENCRYPTION_KEY="[32 characters]"
```

## 🗄️ Database Setup

### Option 1: Neon (Recommended for Vercel)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it to `DATABASE_URL` in Vercel

### Option 2: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Add it to `DATABASE_URL` in Vercel

## 🔧 Vercel Configuration Steps

1. **Go to your Vercel Dashboard**
2. **Select your project** → Settings → Environment Variables
3. **Add the required variables** listed above
4. **Redeploy** your application

## ✅ Verification

After deployment, verify:
- Build logs show "Prisma Client generated successfully"
- No "prisma: command not found" errors
- Application loads without database connection errors

## 🔒 Security Notes

1. **JWT Secrets**: The current JWT secrets in your deployment should be replaced with secure random strings
2. **Database**: Ensure SSL mode is enabled (`?sslmode=require` in connection string)
3. **Environment**: Use different secrets for development and production

## 📚 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Neon PostgreSQL](https://neon.tech/docs/introduction)
