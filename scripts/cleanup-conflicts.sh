#!/bin/bash
# Clean up conflicting files for Vercel deployment

echo "🧹 Cleaning up conflicting files..."

# Remove conflicting files
rm -f apps/web/vercel.json
rm -f apps/web/postcss.config.mjs

echo "✅ Conflicting files removed"

# Create proper postcss config if needed
if [ ! -f "apps/web/postcss.config.js" ]; then
  cat > apps/web/postcss.config.js << 'EOF'
/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
  echo "✅ PostCSS config created"
fi

echo "🚀 Ready for deployment!"
