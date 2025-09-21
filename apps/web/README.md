# AI Sales Agent - Web Application

## 🚀 Deployment Status

This application is deployed on Vercel.

## 📋 Environment Variables

Required for production:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
ENCRYPTION_KEY=...
SESSION_SECRET=...
APP_BASE_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

## 📦 Build

```bash
npm run build
```

## 🔧 Troubleshooting

### Module not found errors
Make sure all imports use local paths (`@/lib/...`) instead of monorepo packages (`@ai-sales-agent/...`).

### Database connection
Ensure `DATABASE_URL` includes `?sslmode=require` for production databases.