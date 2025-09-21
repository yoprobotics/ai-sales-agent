# 🚨 URGENT: Vercel Build Fix Required

## Problem
There's a conflict between:
- ❌ `src/pages/api/webhooks/stripe.ts` (old Pages Router)
- ✅ `src/app/api/webhooks/stripe/route.ts` (new App Router)

## Solution

### Option 1: Manual Fix (Recommended)
```bash
# In your local repository
cd apps/web/src
rm -rf pages/
git add .
git commit -m "fix: Remove conflicting pages folder"
git push origin main
```

### Option 2: Run Fix Script
```bash
# From repository root
chmod +x scripts/fix-vercel-conflict.sh
./scripts/fix-vercel-conflict.sh
git add .
git commit -m "fix: Remove conflicting pages folder"
git push origin main
```

## Why This Happened

Next.js 14 with App Router doesn't allow mixing:
- `/pages/api/*` (old format)
- `/app/api/*` (new format)

We're using App Router exclusively, so the `/pages` folder must be removed.

## After Fixing

1. Push the changes to GitHub
2. Vercel will automatically rebuild
3. Build should succeed ✅

## Verification

Ensure only these API routes exist:
```
apps/web/src/app/api/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   ├── me/route.ts
│   ├── refresh/route.ts
│   └── register/route.ts
├── health/route.ts
└── webhooks/
    └── stripe/route.ts
```

NO `pages/` folder should exist!