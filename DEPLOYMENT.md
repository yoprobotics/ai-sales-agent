# 🚀 Deployment Guide - AI Sales Agent

## Prerequisites

- Vercel account
- PostgreSQL database (Neon recommended)
- GitHub repository connected to Vercel

## Environment Variables Setup

### Required Variables for Production

1. **Database**
```bash
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

2. **JWT Authentication**
```bash
JWT_SECRET="generate-a-secure-32-char-string"
JWT_REFRESH_SECRET="generate-another-secure-32-char-string"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

3. **Application**
```bash
NODE_ENV="production"
APP_BASE_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

4. **Encryption**
```bash
ENCRYPTION_KEY="generate-32-character-key"
SESSION_SECRET="generate-32-character-session-key"
```

## Vercel Deployment Steps

### 1. Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import `yoprobotics/ai-sales-agent` repository
4. Select the `main` branch

### 2. Configure Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `.` (leave empty)
- **Build Command**: `cd apps/web && npm install && npm run build`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `npm install`

### 3. Add Environment Variables

1. Go to Project Settings → Environment Variables
2. Add all required variables from `.env.example`
3. Make sure to use production values
4. Click "Save"

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete (~3-5 minutes)
3. Test the deployment URL

## Post-Deployment Checklist

- [ ] Test health endpoint: `https://your-domain.vercel.app/api/health`
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test dashboard access
- [ ] Check browser console for errors
- [ ] Verify database connectivity
- [ ] Check logs in Vercel dashboard

## Database Setup (Neon)

1. Create account at [Neon](https://neon.tech)
2. Create new project
3. Copy connection string
4. Run migrations:

```bash
# In local environment with production DATABASE_URL
export DATABASE_URL="your-neon-connection-string"
cd apps/web
npx prisma migrate deploy
```

## Monitoring

- **Health Check**: `/api/health`
- **Logs**: Vercel Dashboard → Functions → Logs
- **Analytics**: Vercel Dashboard → Analytics
- **Database**: Neon Dashboard

## Troubleshooting

### Build Errors

1. Check Vercel build logs
2. Ensure all dependencies are in `package.json`
3. Verify Node version compatibility

### Runtime Errors

1. Check function logs in Vercel dashboard
2. Verify all environment variables are set
3. Check database connectivity

### Database Issues

1. Verify `DATABASE_URL` includes `?sslmode=require`
2. Check Neon dashboard for connection limits
3. Run `prisma generate` if schema changed

## Security Checklist

- [ ] All sensitive keys are in environment variables
- [ ] JWT secrets are strong and unique
- [ ] Database uses SSL
- [ ] Security headers are configured
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured

## Support

For deployment issues:
1. Check Vercel status page
2. Review deployment logs
3. Contact support with deployment ID