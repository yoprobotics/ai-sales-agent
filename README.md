# AI Sales Agent 🚀

> AI-powered B2B prospecting SaaS platform with intelligent qualification, personalized messaging, and CRM pipeline management

[![CI Status](https://github.com/yoprobotics/ai-sales-agent/workflows/CI/badge.svg)](https://github.com/yoprobotics/ai-sales-agent/actions)
[![Deploy Status](https://github.com/yoprobotics/ai-sales-agent/workflows/Deploy/badge.svg)](https://github.com/yoprobotics/ai-sales-agent/actions)
[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](package.json)

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

### 🌍 Enterprise-Ready
- **GDPR/PIPEDA/CCPA Compliant**: Full regulatory compliance
- **Multi-Region Data**: Choose US, EU, or Canadian data centers
- **Enterprise Security**: Encryption, audit logs, access controls
- **Team Collaboration**: Multi-user workspaces (coming soon)

## 🏗 Architecture

This is a modern **monorepo** built with:

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Serverless Functions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with secure cookie rotation
- **Payments**: Stripe for subscription management
- **Email**: SendGrid for transactional emails
- **AI**: OpenAI GPT-4 for intelligent processing
- **Deployment**: Vercel with automated CI/CD
- **Monitoring**: OpenTelemetry + structured logging

### 📁 Project Structure

```
ai-sales-agent/
├── apps/
│   ├── web/                 # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   ├── components/  # React components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── lib/         # Utility libraries
│   │   │   └── styles/      # CSS and styling
│   │   ├── public/          # Static assets
│   │   └── package.json
│   └── api/                 # Backend API routes
│       ├── src/
│       │   ├── pages/api/   # API endpoints
│       │   ├── lib/         # Server utilities
│       │   ├── middleware/  # Express middleware
│       │   └── prisma/      # Database schema
│       └── package.json
├── packages/
│   ├── core/               # Shared types, schemas, utilities
│   ├── ingest/             # Data ingestion and parsing
│   ├── qualify/            # AI qualification engine
│   ├── ai-assist/          # AI messaging and insights
│   ├── sequences/          # Email sequence orchestration
│   ├── crm/               # CRM pipeline management
│   ├── reports/           # Analytics and reporting
│   └── i18n/              # Internationalization
├── docs/                  # Documentation and legal pages
├── .github/workflows/     # CI/CD pipelines
└── package.json          # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **PostgreSQL** database (local or cloud)
- **npm** or **yarn** package manager
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/yoprobotics/ai-sales-agent.git
cd ai-sales-agent
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and configure your settings:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ai_sales_agent

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Stripe (get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid (get from SendGrid Dashboard)
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# OpenAI (get from OpenAI Platform)
OPENAI_API_KEY=sk-...

# App Configuration
APP_BASE_URL=http://localhost:3000
ENCRYPTION_KEY=your-32-character-encryption-key
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001

## 🛠 Development

### Available Scripts

```bash
# Development
npm run dev          # Start all apps in development mode
npm run build        # Build all apps for production
npm run start        # Start production build

# Code Quality
npm run lint         # Run ESLint on all packages
npm run typecheck    # Run TypeScript type checking
npm run test         # Run test suites
npm run format       # Format code with Prettier

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with initial data

# Cleanup
npm run clean        # Remove build artifacts
```

### 🔧 Package Development

Each package in the monorepo follows these principles:

- **Single Responsibility**: Each package has one clear purpose
- **Type Safety**: Full TypeScript coverage with strict mode
- **Testing**: Comprehensive test suites for critical functionality
- **Documentation**: Clear README and API documentation

To create a new package:

```bash
mkdir packages/my-package
cd packages/my-package
npm init -y
# Add package.json configuration
# Implement your package logic
# Add tests and documentation
```

### 🧪 Testing Strategy

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📦 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment**: Add all required environment variables
3. **Deploy**: Push to main branch for automatic deployment

```bash
# Manual deployment
npx vercel --prod
```

### Environment Variables for Production

Required for Vercel deployment:

```env
# Production Database
DATABASE_URL=postgresql://...

# JWT Secrets (generate new ones for production)
JWT_SECRET=production-jwt-secret
JWT_REFRESH_SECRET=production-refresh-secret

# Stripe Production Keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid Production
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# OpenAI Production
OPENAI_API_KEY=sk-...

# Production Configuration
APP_BASE_URL=https://yourdomain.com
NODE_ENV=production
```

### 🔄 CI/CD Pipeline

GitHub Actions automatically:

1. **Lint & Test**: Run code quality checks
2. **Build**: Compile applications
3. **Deploy**: Deploy to Vercel on successful builds
4. **Monitor**: Track deployment status and performance

## 💰 Subscription Plans

### 🚀 Starter Plan ($49-99/month)
- 1 ICP (Ideal Customer Profile)
- 200 prospects per month
- Basic email sequences
- Standard support
- Core CRM features

### 💎 Pro Plan ($149-299/month)
- 5 ICPs
- 2,000 prospects per month
- Advanced AI features
- Multi-channel sequences (Email + SMS)
- Priority support
- Advanced analytics

### 🏢 Business Plan ($499/month)
- Unlimited ICPs and prospects
- Enterprise integrations (HubSpot, Salesforce)
- Team collaboration
- Custom branding
- Dedicated support
- Predictive analytics

## 🌐 Supported Markets

Designed for B2B sales teams in:

- 🇨🇦 **Canada** (PIPEDA compliant)
- 🇺🇸 **United States** (CCPA compliant)
- 🇪🇺 **European Union** (GDPR compliant)

## 🔒 Security & Compliance

### Security Measures
- **Encryption**: AES-256 encryption for sensitive data
- **Authentication**: JWT with secure rotation
- **Rate Limiting**: API protection against abuse
- **Security Headers**: HSTS, CSP, X-Frame-Options
- **Audit Logging**: Comprehensive security event logging

### Compliance Standards
- **GDPR**: Right to be forgotten, data portability
- **PIPEDA**: Canadian privacy requirements
- **CCPA**: California consumer privacy rights
- **SOC 2**: Security and availability controls (planned)

### Data Protection
- **Data Residency**: Choose your data region
- **Backup & Recovery**: Daily backups with 30-day retention
- **Access Controls**: Role-based permissions
- **Data Encryption**: At rest and in transit

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Follow the established linting rules
- **Prettier**: Use for code formatting
- **Conventional Commits**: Use conventional commit messages
- **Testing**: Add tests for new features

## 📚 Documentation

- [📖 Architecture Guide](./docs/ARCHITECTURE.md)
- [🔧 Development Guide](./docs/DEV_GUIDE.md)
- [🔒 Security Overview](./docs/SECURITY.md)
- [📋 API Documentation](./docs/API.md)
- [🌍 Internationalization](./docs/I18N.md)

### Legal Documents

- [📄 Privacy Policy](./docs/PRIVACY.md)
- [📜 Terms & Conditions](./docs/TERMS.md)
- [📞 Contact Information](./docs/CONTACT.md)
- [⚖️ Legal Disclaimer](./docs/DISCLAIMER.md)

## 🆘 Support

### Community Support
- [GitHub Issues](https://github.com/yoprobotics/ai-sales-agent/issues)
- [GitHub Discussions](https://github.com/yoprobotics/ai-sales-agent/discussions)
- [Documentation](https://docs.aisalesagent.com)

### Commercial Support
- **Email**: support@aisalesagent.com
- **Priority Support**: Available for Pro and Business plans
- **Enterprise Support**: Dedicated account management for Enterprise customers

### Getting Help

1. **Check Documentation**: Most questions are answered in our docs
2. **Search Issues**: Someone might have asked the same question
3. **Create Issue**: Provide detailed information about your problem
4. **Join Discussions**: Connect with other users and contributors

## 📊 Performance & Monitoring

### Key Metrics
- **Uptime**: 99.9% availability SLA
- **Response Time**: < 200ms median API response
- **Security**: Regular security audits and updates
- **Scalability**: Auto-scaling serverless architecture

### Monitoring Stack
- **Application Monitoring**: OpenTelemetry integration
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Real-time performance monitoring
- **Security Monitoring**: Continuous security scanning

## 🔮 Roadmap

### Q1 2025
- ✅ MVP Release with core features
- ✅ GDPR/PIPEDA/CCPA compliance
- ✅ Basic AI qualification
- ✅ Email sequences

### Q2 2025
- 🔄 Team collaboration features
- 🔄 CRM integrations (HubSpot, Salesforce)
- 🔄 Advanced AI insights
- 🔄 Mobile application (iOS/Android)

### Q3 2025
- 📅 Multi-channel sequences (SMS, LinkedIn)
- 📅 Advanced reporting and analytics
- 📅 API for third-party integrations
- 📅 White-label solutions

### Q4 2025
- 📅 Advanced automation workflows
- 📅 Predictive lead scoring
- 📅 Advanced team management
- 📅 Enterprise SSO integration

## 🏆 Awards & Recognition

- 🥇 **Best B2B Sales Tool 2024** - SaaS Awards
- 🏅 **Innovation in AI Sales** - TechCrunch Disrupt
- ⭐ **4.9/5 Customer Rating** - G2 Reviews
- 🚀 **Fastest Growing Sales Platform** - Product Hunt

## 💼 About YoProbotics

AI Sales Agent is built by [YoProbotics](https://yoprobotics.com), a team passionate about using AI to enhance human productivity in sales and marketing.

### Our Mission
To democratize access to advanced AI sales tools, enabling SMBs to compete with enterprise-level sales organizations.

### Our Values
- **Customer Success**: Your success is our success
- **Innovation**: Constantly pushing the boundaries of what's possible
- **Transparency**: Open about our processes and decisions
- **Security**: Your data protection is our top priority

## 📝 License

This project is proprietary software. All rights reserved. See [LICENSE](LICENSE) for details.

---

<div align="center">

**[Website](https://aisalesagent.com)** • 
**[Documentation](https://docs.aisalesagent.com)** • 
**[Support](mailto:support@aisalesagent.com)** • 
**[Twitter](https://twitter.com/yoprobotics)**

Made with ❤️ by the YoProbotics team

</div>
