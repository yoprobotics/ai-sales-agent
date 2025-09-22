# 🚀 AI Sales Agent - B2B Prospecting Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyoprobotics%2Fai-sales-agent)
[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)

> AI-powered B2B prospecting platform with intelligent qualification, personalized messaging, and CRM pipeline management

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

- Node.js 18+ (20+ recommended)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yoprobotics/ai-sales-agent.git
cd ai-sales-agent
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your configuration
```

4. Set up the database:
```bash
cd apps/web
npm run prisma:generate
npm run prisma:migrate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📦 Deployment

### Deploy to Vercel

1. Click the "Deploy with Vercel" button above
2. Configure environment variables in Vercel Dashboard:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Secure random string
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `OPENAI_API_KEY`: Your OpenAI API key

3. Deploy!

## 🏗 Architecture

This is a monorepo containing:

- `apps/web` - Next.js 14 frontend application
- `apps/api` - API routes and backend logic
- `packages/core` - Shared types and utilities
- `packages/ingest` - Data ingestion and parsing
- `packages/qualify` - AI qualification engine
- `packages/ai-assist` - AI messaging and insights
- `packages/sequences` - Email sequence orchestration
- `packages/crm` - CRM pipeline management
- `packages/reports` - Analytics and reporting

## 💰 Subscription Plans

- **Starter** ($49-99/month): 1 ICP, 200 prospects/month
- **Pro** ($149-299/month): 5 ICPs, 2,000 prospects/month, multi-channel
- **Business** ($499/month): Unlimited everything, CRM integrations

## 🌐 Supported Markets

- 🇨🇦 Canada (PIPEDA compliant)
- 🇺🇸 United States (CCPA compliant)
- 🇪🇺 European Union (GDPR compliant)

## 🔒 Security & Compliance

- End-to-end encryption
- GDPR/PIPEDA/CCPA compliant
- SOC 2 Type II (in progress)
- Regular security audits
- Data residency options

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📝 License

Proprietary software. All rights reserved. See [LICENSE](LICENSE) for details.

## 💼 About YoProbotics

Built with ❤️ by [YoProbotics](https://yoprobotics.com) - Using AI to enhance human productivity in sales and marketing.

---

**[Website](https://aisalesagent.com)** • 
**[Documentation](https://docs.aisalesagent.com)** • 
**[Support](mailto:support@aisalesagent.com)**
