# 🚀 AI Sales Agent - Setup Guide

## 📋 Prerequisites

- Node.js 20+ 
- PostgreSQL database
- npm or yarn
- Git

## 🔧 Initial Setup

### 1. Clone the repository

```bash
git clone https://github.com/yoprobotics/ai-sales-agent.git
cd ai-sales-agent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

#### Required variables:

```env
# Database (use Neon or Supabase for production)
DATABASE_URL="postgresql://user:password@localhost:5432/ai_sales_agent"

# JWT Secrets (generate secure random strings)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-32-characters"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## 🔑 Test Credentials

After seeding the database, you can login with:

- **Admin**: admin@aisalesagent.com / AdminPassword123!
- **Demo**: demo@aisalesagent.com / DemoPassword123!

## 📦 Database Management

### Common commands:

```bash
# Open Prisma Studio (GUI for database)
npm run db:studio

# Reset database (warning: deletes all data)
npm run db:reset

# Create a new migration
prisma migrate dev --name your_migration_name

# Deploy migrations to production
prisma migrate deploy
```

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial setup"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import the GitHub repository
3. Configure environment variables
4. Deploy!

### 3. Production Database

For production, use a managed PostgreSQL service:

- **Neon**: [neon.tech](https://neon.tech) (recommended)
- **Supabase**: [supabase.com](https://supabase.com)
- **PlanetScale**: [planetscale.com](https://planetscale.com)

## 🔒 Security Checklist

- [ ] Generate strong JWT secrets
- [ ] Set up HTTPS in production
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set secure cookie flags
- [ ] Implement CSRF protection
- [ ] Regular security audits

## 📚 Next Steps

1. **Configure Stripe** for payments
2. **Set up SendGrid** for emails
3. **Add OpenAI API key** for AI features
4. **Configure S3** for file storage
5. **Set up monitoring** (Sentry, LogRocket)

## 🆘 Troubleshooting

### Database connection issues

```bash
# Test database connection
prisma db pull

# Check DATABASE_URL format
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

### Build errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Prisma issues

```bash
# Regenerate Prisma client
npm run db:generate

# Reset Prisma
rm -rf node_modules/.prisma
npm install
```

## 📞 Support

For help, check:
- [Documentation](./docs/)
- [GitHub Issues](https://github.com/yoprobotics/ai-sales-agent/issues)
- Email: support@aisalesagent.com