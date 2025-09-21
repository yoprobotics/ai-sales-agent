# Vercel Deployment Instructions

## 🚀 Quick Deploy

The project is configured to deploy automatically on Vercel when you push to the main branch.

## 🔧 Manual Configuration

If you need to configure Vercel manually:

1. **Go to Vercel Dashboard**
   - Navigate to your project settings

2. **Environment Variables**
   
   Add the following environment variables in Settings > Environment Variables:

   ### Required Variables
   
   ```bash
   # Database (PostgreSQL - Use Neon or Supabase)
   DATABASE_URL=postgresql://username:password@host:5432/ai_sales_agent
   
   # JWT Secrets (Generate secure random strings)
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-chars
   ```
   
   ### Optional Variables (for full functionality)
   
   ```bash
   # Stripe (for payments)
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # SendGrid (for emails)
   SENDGRID_API_KEY=SG...
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   
   # OpenAI (for AI features)
   OPENAI_API_KEY=sk-...
   
   # Security
   ENCRYPTION_KEY=your-32-character-encryption-key
   ```

3. **Build Settings**
   
   The build settings are already configured in `vercel.json`:
   - Build Command: `bash vercel-build.sh`
   - Output Directory: `apps/web/.next`
   - Install Command: Handled by custom script

## 📝 Notes

- Tailwind CSS and all required dependencies are now in the `dependencies` section to ensure they're installed in production
- The custom build script (`vercel-build.sh`) handles Prisma generation
- Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser

## 🐛 Troubleshooting

### Build Fails with "Cannot find module 'tailwindcss'"
This issue has been fixed by:
1. Moving Tailwind CSS to dependencies (not devDependencies)
2. Using a custom build script that ensures all dependencies are installed

### Prisma Client Issues
The build script automatically generates the Prisma client during deployment.

### Environment Variables Not Working
- Ensure variables are set in Vercel Dashboard
- Restart the deployment after adding new variables
- Check that sensitive variables don't have `NEXT_PUBLIC_` prefix

## 📞 Support

If you encounter any issues, please open an issue on GitHub.
