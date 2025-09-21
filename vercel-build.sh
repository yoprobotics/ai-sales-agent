#!/bin/bash

echo "🚀 Starting Vercel build process..."
echo "📦 Installing dependencies..."

# Install dependencies at root level if needed
npm install

# Navigate to web app directory
echo "🔍 Checking Prisma installation..."
ls -la node_modules/.bin/prisma || echo "Prisma not in root"

echo "🎯 Generating Prisma Client..."
cd apps/web
npx prisma generate

echo "🏗️ Building Next.js application..."
npm run build

echo "✨ Build complete!"
