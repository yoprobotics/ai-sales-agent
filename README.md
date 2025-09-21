# AI Sales Agent 🚀

> AI-powered B2B prospecting SaaS platform with intelligent qualification, personalized messaging, and CRM pipeline management

[![CI Status](https://github.com/yoprobotics/ai-sales-agent/workflows/CI/badge.svg)](https://github.com/yoprobotics/ai-sales-agent/actions)
[![Deploy Status](https://img.shields.io/badge/deploy-vercel-black)](https://ai-sales-agent.vercel.app)
[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-green.svg)](package.json)

## ✨ Features

### 🎯 Smart Prospect Qualification
- **AI-Powered BANT Scoring**: Budget, Authority, Need, Timing analysis
- **Transparent Explanations**: Understand why prospects are qualified
- **Signal Detection**: Identify buying intent indicators
- **Confidence Scoring**: Know how reliable each qualification is

### 💬 Personalized Messaging
- **AI Message Generation**: Context-aware email and DM creation
- **Multi-Language Support**: Native French and English support
- **Template Library**: Pre-built templates for common scenarios
- **Brand Voice Adaptation**: Maintain consistent tone across messages

### 📧 Sequence Orchestration
- **Multi-Step Sequences**: Up to 10 steps with conditional logic
- **Smart Timing**: Optimal send times based on prospect behavior
- **A/B Testing**: Test different approaches automatically
- **Response Handling**: Automatic sequence stopping on replies

### 📊 Visual CRM Pipeline
- **Kanban-Style Interface**: Drag-and-drop prospect management
- **Custom Stages**: Define your sales process stages
- **Activity Tracking**: Log calls, meetings, and notes
- **Automated Reminders**: Never miss a follow-up

### 🤖 AI Insights & Analytics
- **Performance Dashboards**: Real-time metrics and KPIs
- **Predictive Analytics**: Forecast pipeline outcomes
- **Recommendation Engine**: AI-powered improvement suggestions
- **Custom Reports**: Generate insights tailored to your needs

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (required by Vercel)
- **PostgreSQL** database (local or cloud)
- **npm** package manager
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/yoprobotics/ai-sales-agent.git
cd ai-sales-agent
```

### 2. Install Dependencies

```bash
npm install
cd apps/web && npm install
```

### 3. Environment Setup

```bash
cd apps/web
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database (Required)
DATABASE_URL=postgresql://username:password@localhost:5432/ai_sales_agent

# Authentication (Required)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Application (Required)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

```bash
# Generate Prisma client
cd apps/web
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed initial data (optional)
npx prisma db seed
```

### 5. Start Development Server

```bash
cd apps/web
npm run dev
```

The application will be available at http://localhost:3000

## 🛠 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma generate  # Generate Prisma client
npx prisma migrate dev # Run migrations
npx prisma studio    # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
npx tsc --noEmit     # Type checking
```

### Project Structure

```
ai-sales-agent/
├── apps/
│   └── web/                 # Next.js frontend application
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── components/  # React components
│       │   ├── lib/         # Utilities and helpers
│       │   └── styles/      # Global styles
│       ├── prisma/          # Database schema
│       └── public/          # Static assets
├── packages/                # Shared packages (future)
├── docs/                    # Documentation
└── .github/workflows/       # CI/CD pipelines
```

## 📦 Deployment

### Vercel Deployment (Recommended)

1. **Fork/Clone this repository**
2. **Connect to Vercel**: Import your GitHub repository
3. **Configure environment variables** in Vercel Dashboard
4. **Deploy**: Push to main branch for automatic deployment

### Required Environment Variables for Production

```env
DATABASE_URL=postgresql://...
JWT_SECRET=production-jwt-secret-min-32-chars
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🔧 Troubleshooting

### Build Errors

If you encounter build errors:

1. **Ensure Prisma client is generated**:
   ```bash
   cd apps/web && npx prisma generate
   ```

2. **Check environment variables**:
   - DATABASE_URL must be valid PostgreSQL connection string
   - JWT_SECRET must be at least 32 characters

3. **Clear caches**:
   ```bash
   rm -rf .next node_modules
   npm install
   ```

### 404 Errors on Vercel

- Ensure `vercel.json` is properly configured
- Check that outputDirectory points to `apps/web/.next`
- Verify framework is set to `nextjs`

## 💰 Subscription Plans (Coming Soon)

### 🚀 Starter Plan ($49-99/month)
- 1 ICP (Ideal Customer Profile)
- 200 prospects per month
- Basic email sequences
- Standard support

### 💎 Pro Plan ($149-299/month)
- 5 ICPs
- 2,000 prospects per month
- Advanced AI features
- Multi-channel sequences
- Priority support

### 🏢 Business Plan ($499/month)
- Unlimited ICPs and prospects
- Enterprise integrations
- Team collaboration
- Custom branding
- Dedicated support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📚 Documentation

- [📖 Architecture Guide](./docs/ARCHITECTURE.md)
- [🔒 Security Overview](./docs/SECURITY.md)
- [📋 API Documentation](./docs/API.md)
- [🌍 Internationalization](./docs/I18N.md)

## 🆘 Support

### Community Support
- [GitHub Issues](https://github.com/yoprobotics/ai-sales-agent/issues)
- [GitHub Discussions](https://github.com/yoprobotics/ai-sales-agent/discussions)

## 📝 License

This project is proprietary software. All rights reserved.

---

<div align="center">

**[Live Demo](https://ai-sales-agent.vercel.app)** • 
**[Documentation](https://github.com/yoprobotics/ai-sales-agent/tree/main/docs)** • 
**[Report Bug](https://github.com/yoprobotics/ai-sales-agent/issues)**

Made with ❤️ by the YoProbotics team

</div>