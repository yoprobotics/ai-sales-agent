#!/bin/bash

# Vercel Deployment Preparation Script
# This script prepares the repository for successful Vercel deployment

echo "🚀 Preparing AI Sales Agent for Vercel Deployment"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Step 1: Clean conflicting files
echo -e "\n${YELLOW}Step 1: Cleaning conflicting files...${NC}"

# Remove conflicting vercel.json from apps/web if it exists
if [ -f "apps/web/vercel.json" ]; then
    rm -f apps/web/vercel.json
    echo -e "${GREEN}✓${NC} Removed apps/web/vercel.json"
else
    echo -e "${GREEN}✓${NC} No conflicting vercel.json found"
fi

# Remove conflicting postcss.config.mjs if it exists
if [ -f "apps/web/postcss.config.mjs" ]; then
    rm -f apps/web/postcss.config.mjs
    echo -e "${GREEN}✓${NC} Removed apps/web/postcss.config.mjs"
else
    echo -e "${GREEN}✓${NC} No conflicting postcss.config.mjs found"
fi

# Step 2: Ensure correct PostCSS configuration
echo -e "\n${YELLOW}Step 2: Setting up PostCSS configuration...${NC}"

cat > apps/web/postcss.config.js << 'EOF'
/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

echo -e "${GREEN}✓${NC} PostCSS configuration updated"

# Step 3: Install dependencies
echo -e "\n${YELLOW}Step 3: Installing dependencies...${NC}"

cd apps/web
npm install
cd ../..

echo -e "${GREEN}✓${NC} Dependencies installed"

# Step 4: Generate Prisma client
echo -e "\n${YELLOW}Step 4: Generating Prisma client...${NC}"

cd apps/web
npx prisma generate
cd ../..

echo -e "${GREEN}✓${NC} Prisma client generated"

# Step 5: Test build locally
echo -e "\n${YELLOW}Step 5: Testing build locally...${NC}"

cd apps/web
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Build successful!"
else
    echo -e "${RED}✗${NC} Build failed. Please check the errors above."
    exit 1
fi

cd ../..

# Step 6: Git operations
echo -e "\n${YELLOW}Step 6: Preparing Git repository...${NC}"

# Add changes
git add -A

# Commit if there are changes
if ! git diff --cached --quiet; then
    git commit -m "fix: Prepare for Vercel deployment - clean conflicting files"
    echo -e "${GREEN}✓${NC} Changes committed"
else
    echo -e "${GREEN}✓${NC} No changes to commit"
fi

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Repository is ready for Vercel deployment!${NC}"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Vercel will automatically deploy"
echo ""
echo "Required environment variables in Vercel:"
echo "  - DATABASE_URL"
echo "  - JWT_SECRET"
echo "  - JWT_REFRESH_SECRET"
echo "  - NEXT_PUBLIC_APP_URL"
echo ""
