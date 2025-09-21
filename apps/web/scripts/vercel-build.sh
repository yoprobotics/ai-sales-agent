#!/bin/bash

echo "🚀 Starting Vercel build for AI Sales Agent..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are we in apps/web?"
    exit 1
fi

echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit --no-fund || npm install

# Only generate Prisma client if DATABASE_URL is set
if [ ! -z "$DATABASE_URL" ]; then
    echo "🔧 Generating Prisma client..."
    npx prisma generate
else
    echo "⚠️  DATABASE_URL not set, skipping Prisma generation"
    # Create a minimal Prisma client stub
    mkdir -p node_modules/.prisma/client
    echo "module.exports = {}" > node_modules/.prisma/client/index.js
fi

echo "🏗️  Building Next.js application..."
next build

echo "✅ Build completed successfully!"
