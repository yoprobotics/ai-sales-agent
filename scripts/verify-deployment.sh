#!/bin/bash

# AI Sales Agent - Pre-deployment Check Script
# This script verifies that all required files and configurations are in place

echo "🔍 AI Sales Agent - Pre-deployment Verification"
echo "=============================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for issues
ISSUES=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2 - File missing: $1"
        ISSUES=$((ISSUES + 1))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2 - Directory missing: $1"
        ISSUES=$((ISSUES + 1))
    fi
}

# Function to check if package is in package.json
check_package() {
    if grep -q "\"$1\"" "$2"; then
        echo -e "${GREEN}✓${NC} Package: $1"
    else
        echo -e "${RED}✗${NC} Package missing: $1 in $2"
        ISSUES=$((ISSUES + 1))
    fi
}

echo ""
echo "1. Checking project structure..."
echo "---------------------------------"
check_dir "apps/web" "Web application directory"
check_dir "apps/web/src" "Source directory"
check_dir "apps/web/src/app" "App directory (Next.js 13+)"
check_dir "apps/web/prisma" "Prisma directory"

echo ""
echo "2. Checking configuration files..."
echo "-----------------------------------"
check_file "apps/web/package.json" "Web package.json"
check_file "apps/web/next.config.js" "Next.js configuration"
check_file "apps/web/tailwind.config.js" "Tailwind configuration"
check_file "apps/web/postcss.config.mjs" "PostCSS configuration"
check_file "apps/web/tsconfig.json" "TypeScript configuration"
check_file "apps/web/prisma/schema.prisma" "Prisma schema"
check_file "vercel.json" "Vercel configuration"
check_file ".nvmrc" "Node version specification"
check_file ".env.example" "Environment variables template"

echo ""
echo "3. Checking critical dependencies..."
echo "-------------------------------------"
cd apps/web
check_package "next" "package.json"
check_package "react" "package.json"
check_package "react-dom" "package.json"
check_package "@prisma/client" "package.json"
check_package "tailwindcss" "package.json"
check_package "autoprefixer" "package.json"
check_package "postcss" "package.json"
check_package "@sendgrid/mail" "package.json"
check_package "stripe" "package.json"
cd ../..

echo ""
echo "4. Checking build capability..."
echo "--------------------------------"
cd apps/web
if npm run build --dry-run > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build script is configured"
else
    echo -e "${RED}✗${NC} Build script not found or misconfigured"
    ISSUES=$((ISSUES + 1))
fi
cd ../..

echo ""
echo "5. Checking environment variables..."
echo "-------------------------------------"
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} Environment template exists"
    echo -e "${YELLOW}!${NC} Remember to set these in Vercel Dashboard:"
    echo "   - DATABASE_URL"
    echo "   - JWT_SECRET"
    echo "   - JWT_REFRESH_SECRET"
    echo "   - NEXT_PUBLIC_APP_URL"
    echo "   - SENDGRID_API_KEY (for emails)"
    echo "   - STRIPE_SECRET_KEY (for payments)"
    echo "   - OPENAI_API_KEY (for AI features)"
else
    echo -e "${RED}✗${NC} .env.example missing - deployment will lack guidance"
    ISSUES=$((ISSUES + 1))
fi

echo ""
echo "=============================================="
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for deployment.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Push changes to GitHub: git push origin main"
    echo "2. Go to Vercel Dashboard"
    echo "3. Import repository and configure environment variables"
    echo "4. Deploy!"
    exit 0
else
    echo -e "${RED}❌ Found $ISSUES issue(s) that need to be fixed.${NC}"
    echo ""
    echo "Please fix the issues above before deploying."
    exit 1
fi
