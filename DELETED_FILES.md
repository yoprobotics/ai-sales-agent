# FIX: Remove empty/invalid JSON files

The following files have been deleted because they were empty and causing "Invalid JSON" errors:
- apps/web/vercel.json (was empty)
- apps/web/postcss.config.mjs (was empty)
- apps/web/vercel.json.bak (backup file not needed)

These files are NOT needed for deployment because:
- The root vercel.json handles all configuration
- We use postcss.config.js (not .mjs)
