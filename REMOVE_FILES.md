# Files to be removed for successful Vercel deployment

The following files have been identified as causing conflicts and should be removed:

## Files to Remove:

1. **`apps/web/vercel.json`**
   - Reason: Conflicts with root vercel.json configuration
   - Contains: `npx prisma generate && next build` which causes build errors

2. **`apps/web/postcss.config.mjs`**
   - Reason: Conflicts with postcss.config.js
   - Causes: Module resolution errors in Vercel

## How to Remove:

Run the cleanup script:
```bash
bash scripts/cleanup-conflicts.sh
```

Or manually:
```bash
rm -f apps/web/vercel.json
rm -f apps/web/postcss.config.mjs
```

## Verification:

After removal, these files should NOT exist:
- ❌ apps/web/vercel.json
- ❌ apps/web/postcss.config.mjs

These files SHOULD exist:
- ✅ vercel.json (root level only)
- ✅ apps/web/postcss.config.js (not .mjs)
