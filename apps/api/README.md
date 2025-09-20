# AI Sales Agent - API

This is the backend API for the AI Sales Agent platform, built with Next.js API routes and Prisma ORM.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- npm or yarn

### Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
```bash
# Copy the example file
cp ../../.env.example .env.local

# Edit .env.local with your database credentials
DATABASE_URL="postgresql://user:password@localhost:5432/ai_sales_agent"
```

3. **Setup database**
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

4. **Start development server**
```bash
npm run dev
# API will be available at http://localhost:3001
```

## 📁 Project Structure

```
apps/api/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── lib/
│   └── prisma.ts        # Database client and utilities
├── pages/
│   └── api/            # API endpoints
│       ├── auth/       # Authentication endpoints
│       ├── users/      # User management
│       ├── prospects/  # Prospect endpoints
│       ├── icps/       # ICP endpoints
│       ├── sequences/  # Email sequences
│       ├── campaigns/  # Campaign management
│       └── webhooks/   # External webhooks
└── middleware/
    ├── auth.ts         # JWT authentication
    ├── cors.ts         # CORS configuration
    └── rate-limit.ts   # Rate limiting
```

## 🗄️ Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Create migration
npm run db:migrate

# Deploy migrations (production)
npm run db:migrate:prod

# Push schema without migration
npm run db:push

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed

# Reset database
npm run db:reset
```

## 🔐 Authentication

The API uses JWT tokens for authentication:

- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens are stored in httpOnly cookies
- RBAC with roles: CLIENT, ADMIN, TEAM_MEMBER, TEAM_OWNER

## 📊 Database Schema

Key models:
- **User**: Authentication and user management
- **Organisation**: Multi-tenant support
- **ICP**: Ideal Customer Profiles
- **Prospect**: Lead management with AI scoring
- **EmailSequence**: Multi-step email campaigns
- **Campaign**: Outreach campaign tracking
- **Subscription**: Billing and plan management

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test suite
npm run test:auth
npm run test:api
```

## 📝 API Documentation

API endpoints are documented with OpenAPI/Swagger (coming soon).

### Key Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

- `GET /api/prospects` - List prospects
- `POST /api/prospects` - Create prospect
- `GET /api/prospects/:id` - Get prospect details
- `PUT /api/prospects/:id` - Update prospect
- `DELETE /api/prospects/:id` - Soft delete prospect

- `GET /api/icps` - List ICPs
- `POST /api/icps` - Create ICP
- `GET /api/icps/:id` - Get ICP details
- `PUT /api/icps/:id` - Update ICP

- `POST /api/sequences` - Create email sequence
- `POST /api/campaigns` - Create campaign
- `POST /api/messages` - Send message

## 🚀 Deployment

The API is deployed to Vercel as serverless functions.

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 🔧 Environment Variables

See `.env.example` for all required environment variables.

Critical variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `STRIPE_SECRET_KEY` - Stripe API key
- `SENDGRID_API_KEY` - SendGrid API key
- `OPENAI_API_KEY` - OpenAI API key

## 📄 License

Proprietary - All rights reserved
