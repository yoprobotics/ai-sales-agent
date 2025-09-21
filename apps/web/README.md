# AI Sales Agent - Web Application

This is the main Next.js application for the AI Sales Agent platform.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Environment variables configured

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
app/
├── api/              # API routes
│   └── health/       # Health check endpoint
├── page.tsx          # Home page
├── layout.tsx        # Root layout
├── globals.css       # Global styles
└── not-found.tsx     # 404 page

components/           # React components
lib/                  # Utilities and helpers
prisma/              # Database schema
public/              # Static assets
```

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Deployment**: Vercel

## 📄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client

## 🔗 API Endpoints

- `GET /api/health` - Health check endpoint

## 🚢 Deployment

The application is configured for automatic deployment on Vercel. Push to the `main` branch to trigger a deployment.

## 📝 License

Proprietary - All rights reserved
