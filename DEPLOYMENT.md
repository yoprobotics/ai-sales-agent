# 🚀 AI Sales Agent - Vercel Deployment Guide

## 📝 Prerequisites

Before deploying to Vercel, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Connected to your Vercel account
3. **PostgreSQL Database**: Neon, Supabase, or any PostgreSQL provider
4. **SendGrid Account**: For email functionality
5. **Stripe Account**: For payment processing (optional for MVP)
6. **OpenAI API Key**: For AI features (optional for MVP)

## 🛠️ Deployment Steps

### 1. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import `yoprobotics/ai-sales-agent` repository
4. Select the branch to deploy (usually `main`)

### 2. Configure Build Settings

Vercel should auto-detect the settings from `vercel.json`, but verify:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave empty)
- **Build Command**: `cd apps/web && npm install && npm run build`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `npm install`

### 3. Set Environment Variables

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

#### Required Variables

```bash
# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database_name

# Authentication
JWT_SECRET=generate-a-secure-32-character-secret
JWT_REFRESH_SECRET=generate-another-secure-32-character-secret

# Application
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

#### Email Configuration (Required for full functionality)

```bash
# SendGrid
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_REPLY_TO=support@yourdomain.com
```

#### Payment Processing (Optional for MVP)

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

#### AI Features (Optional for MVP)

```bash
# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key
```

### 4. Deploy

1. Click **"Deploy"** button
2. Wait for the build to complete (usually 2-3 minutes)
3. Vercel will provide you with a deployment URL

## 🔧 Post-Deployment Setup

### 1. Database Migrations

After first deployment, run database migrations:

```bash
# Connect to your project
vercel link

# Run migrations in production
vercel env pull .env.production
npx prisma migrate deploy --schema=apps/web/prisma/schema.prisma
```

### 2. Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 3. Set up Webhooks

#### Stripe Webhooks (if using payments)
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select events to listen for
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET` env var

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Build Fails with Module Not Found

**Error**: `Module not found: Can't resolve '@package/name'`

**Solution**: 
- Ensure all dependencies are listed in `package.json`
- Check that internal packages are properly linked
- Clear cache: `vercel --force`

#### PostCSS/Tailwind Errors

**Error**: `Cannot find module 'tailwindcss'`

**Solution**:
- Verify `tailwindcss` and `autoprefixer` are in `devDependencies`
- Check that `postcss.config.mjs` exists
- Ensure `tailwind.config.js` is properly configured

#### Database Connection Issues

**Error**: `Can't reach database server`

**Solution**:
- Verify `DATABASE_URL` is correctly formatted
- Check database allows connections from Vercel IPs
- Ensure SSL mode is configured if required

#### Environment Variables Not Working

**Solution**:
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Redeploy after adding/changing environment variables
- Check variable names match exactly (case-sensitive)

## 🚀 Performance Optimization

### Recommended Settings

1. **Enable Caching**: Use Vercel Edge Cache for static assets
2. **Image Optimization**: Use Next.js Image component
3. **Code Splitting**: Implement dynamic imports for large components
4. **Database Pooling**: Use connection pooling for PostgreSQL

### Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Set up Sentry (optional)
3. **Performance Monitoring**: Use Vercel Speed Insights

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

## 🆘 Support

If you encounter issues:

1. Check the [build logs](https://vercel.com/dashboard) in Vercel Dashboard
2. Review this troubleshooting guide
3. Create an issue in the [GitHub repository](https://github.com/yoprobotics/ai-sales-agent/issues)
4. Contact support at support@aisalesagent.com

---

**Last Updated**: September 2025
**Version**: 1.0.0
