# 🚀 Vercel Deployment - Use Root Directory Method

## ⚠️ Important: Delete vercel.json

The `vercel.json` at root level should be deleted when using Root Directory method.

## ✅ Correct Vercel Configuration:

1. **Framework**: Next.js
2. **Root Directory**: `apps/web` ⭐ 
3. **Build Command**: Auto-detected (`npm run build`)
4. **Output Directory**: Auto-detected (`.next`)
5. **Install Command**: Auto-detected (`npm install`)

## 🗑️ Remove vercel.json

When using Root Directory = `apps/web`, Vercel will treat the `apps/web` folder as a standalone Next.js project and auto-detect all settings.

The `vercel.json` at root level causes conflicts.