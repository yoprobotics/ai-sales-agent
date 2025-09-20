# 🚀 Quick Start Guide - AI Sales Agent

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **PostgreSQL** database (local or cloud)
- **Git** for version control
- **VS Code** (recommended) with suggested extensions

## ⚡ Quick Setup (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yoprobotics/ai-sales-agent.git
cd ai-sales-agent

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp apps/web/.env.example apps/web/.env.local

# Edit environment variables
code apps/web/.env.local
```

**Required Environment Variables:**

```env
# Database (use Neon, Supabase, or local PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/ai_sales_agent"

# JWT Secrets (generate secure random strings)
JWT_SECRET="your-32-character-secret-key"
JWT_REFRESH_SECRET="your-32-character-refresh-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Optional: Seed with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
# Start the application
npm run dev
```

🎉 **Your app is now running at [http://localhost:3000](http://localhost:3000)**

## 🔑 First Login

### Option 1: Register New Account
1. Go to [http://localhost:3000/register](http://localhost:3000/register)
2. Create your account
3. Login automatically redirects to dashboard

### Option 2: Seed Admin Account
```bash
# Create admin user (if seeding is implemented)
npm run db:seed:admin
```

## 🛠 Development Workflow

### Project Structure
```
ai-sales-agent/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Backend API (future)
├── packages/
│   ├── core/         # Shared types & schemas
│   ├── ingest/       # Data import & parsing
│   └── qualify/      # AI qualification (todo)
├── prisma/
│   └── schema.prisma # Database schema
└── docs/             # Documentation
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production build

# Database
npm run db:generate     # Generate Prisma client
npm run db:migrate      # Run migrations
npm run db:push         # Push schema changes
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database

# Code Quality
npm run lint            # Run ESLint
npm run typecheck       # TypeScript checking
npm run format          # Format with Prettier

# Testing
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
```

## 📁 Key Directories

### Frontend (`apps/web/src/`)
- `app/` - Next.js 14 App Router pages
- `components/` - Reusable React components
- `lib/` - Utilities (auth, db, etc.)
- `hooks/` - Custom React hooks

### Packages (`packages/`)
- `core/` - Shared TypeScript types and schemas
- `ingest/` - CSV parsing and data import logic

## 🎯 Next Steps

### Phase 1: MVP Features
- [x] ✅ Authentication system
- [x] ✅ Database schema
- [x] ✅ Basic dashboard
- [ ] 🔄 ICP creation
- [ ] 🔄 CSV import
- [ ] 🔄 AI qualification
- [ ] 🔄 Email sequences

### Phase 2: Advanced Features
- [ ] 📅 Stripe integration
- [ ] 📅 AI insights
- [ ] 📅 Multi-language (FR/EN)
- [ ] 📅 Team collaboration

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if PostgreSQL is running
psql --version

# Verify DATABASE_URL format
DATABASE_URL="postgresql://username:password@host:port/database"
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Prisma Issues**
```bash
# Reset Prisma client
npm run db:generate

# Reset database (⚠️ destroys data)
npx prisma migrate reset
```

### Environment Issues

**Missing JWT_SECRET**
```bash
# Generate secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

## 📚 Learning Resources

### Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Project Docs
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contributing

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "✨ Add new feature"

# Push and create PR
git push origin feature/your-feature-name
```

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow existing config
- **Prettier**: Auto-format on save
- **Commits**: Use conventional commits

### Testing
```bash
# Run tests before committing
npm run test
npm run typecheck
npm run lint
```

## 🆘 Getting Help

### Issues and Questions
1. Check existing [GitHub Issues](https://github.com/yoprobotics/ai-sales-agent/issues)
2. Search [Discussions](https://github.com/yoprobotics/ai-sales-agent/discussions)
3. Create new issue with detailed description

### Support Channels
- 📧 **Email**: dev@aisalesagent.com
- 💬 **Discord**: [Join our community](#)
- 📖 **Docs**: [docs.aisalesagent.com](#)

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment
1. Set environment variables on hosting platform
2. Run build: `npm run build`
3. Start: `npm run start`

---

**Happy coding! 🎉**

*For detailed development guidelines, see our [Development Guide](./docs/DEV_GUIDE.md)*
