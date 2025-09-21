# AI Sales Agent - Web Application

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x
- PostgreSQL database
- npm 10.x or higher

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run postinstall

# Run development server
npm run dev
```

## 📦 Deployment to Vercel

### Vercel Configuration

1. **Framework Preset**: Next.js
2. **Root Directory**: `apps/web`
3. **Build Command**: `npm run build` (or leave blank for auto-detect)
4. **Output Directory**: `.next` (or leave blank for auto-detect)
5. **Install Command**: `npm install` (or leave blank for auto-detect)
6. **Node Version**: 20.x

### Environment Variables

Set the following environment variables in Vercel:

```env
# Required
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Optional (for full features)
STRIPE_SECRET_KEY=sk_...
SENDGRID_API_KEY=SG...
OPENAI_API_KEY=sk-...
```

### Database Setup

1. Create a PostgreSQL database (Neon, Supabase, or any provider)
2. Set the `DATABASE_URL` in Vercel environment variables
3. The schema will be automatically created on first deployment

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Notes

- The app uses Prisma for database management
- Authentication is handled via JWT tokens
- UI components use Radix UI and Tailwind CSS
- State management with React Query and Zustand

## 🐛 Troubleshooting

### Build Errors on Vercel

1. Ensure Node.js version is set to 20.x
2. Check that `DATABASE_URL` is properly configured
3. Verify all required dependencies are in `package.json`
4. Use `npm install` instead of other package managers

### Database Connection Issues

1. Verify `DATABASE_URL` format: `postgresql://user:password@host:5432/dbname?sslmode=require`
2. Ensure database is accessible from Vercel IPs
3. Check SSL mode settings for your database provider

## 📄 License

Proprietary - All Rights Reserved
