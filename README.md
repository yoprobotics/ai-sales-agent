# 🚀 AI Sales Agent - B2B Prospecting SaaS Platform

> AI-powered B2B prospecting platform with intelligent qualification, personalized messaging, and CRM pipeline management

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyoprobotics%2Fai-sales-agent)
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

## 🏗 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Serverless Functions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with secure cookie rotation
- **Payments**: Stripe for subscription management
- **Email**: SendGrid for transactional emails
- **AI**: OpenAI GPT-4 for intelligent processing
- **Deployment**: Vercel with automated CI/CD

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yoprobotics/ai-sales-agent.git
cd ai-sales-agent
```

### 2. Install Dependencies

```bash
cd apps/web
npm install
```

### 3. Environment Setup

```bash
cp .env.example .env.local
```

Configure your environment variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ai_sales_agent

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# SendGrid
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# OpenAI
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## 📦 Deployment

### Deploy to Vercel

1. Click the "Deploy with Vercel" button above
2. Configure environment variables in Vercel dashboard
3. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

## 💰 Subscription Plans

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

## 🌐 Supported Markets

- 🇨🇦 **Canada** (PIPEDA compliant)
- 🇺🇸 **United States** (CCPA compliant)
- 🇪🇺 **European Union** (GDPR compliant)

## 🔒 Security & Compliance

- **Encryption**: AES-256 encryption for sensitive data
- **Authentication**: JWT with secure rotation
- **Rate Limiting**: API protection against abuse
- **GDPR**: Right to be forgotten, data portability
- **PIPEDA**: Canadian privacy requirements
- **CCPA**: California consumer privacy rights

## 📚 Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Privacy Policy](./docs/PRIVACY.md)
- [Terms & Conditions](./docs/TERMS.md)

## 🆘 Support

- **Email**: support@aisalesagent.com
- **Documentation**: [docs.aisalesagent.com](https://docs.aisalesagent.com)
- **GitHub Issues**: [Report bugs](https://github.com/yoprobotics/ai-sales-agent/issues)

## 🔮 Roadmap

### Q1 2025 ✅
- MVP Release
- Core features
- GDPR/PIPEDA/CCPA compliance

### Q2 2025 🔄
- Team collaboration
- CRM integrations (HubSpot, Salesforce)
- Advanced AI insights
- Mobile application

### Q3 2025 📅
- Multi-channel sequences
- Advanced reporting
- API for integrations
- White-label solutions

## 💼 About YoProbotics

AI Sales Agent is built by [YoProbotics](https://yoprobotics.com), a team passionate about using AI to enhance human productivity in sales and marketing.

## 📝 License

This project is proprietary software. All rights reserved.

---

<div align="center">

Made with ❤️ by the YoProbotics team

</div>
