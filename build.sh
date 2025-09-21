#!/bin/bash

echo "🚀 Starting Vercel build process..."

# Navigate to the web app directory
cd apps/web

echo "📦 Installing dependencies..."
npm install

echo "🔍 Verifying Prisma installation..."
if command -v prisma &> /dev/null; then
    echo "✅ Prisma CLI found directly"
    prisma generate
else
    echo "⚠️ Prisma not in PATH, using npx..."
    npx prisma generate
fi

echo "🏗️ Building Next.js application..."
npm run build

echo "✨ Build complete!"
