#!/bin/bash

echo "🚀 Starting Vercel build process..."
echo "📦 Installing dependencies..."

# Install dependencies at root level if needed
npm install

# Navigate to web app directory
cd apps/web

echo "📦 Installing web app dependencies..."
npm install

echo "🔍 Checking critical dependencies..."
echo "TypeScript version:"
npx tsc --version || echo "⚠️ TypeScript not found!"

echo "Tailwind CSS:"
ls -la node_modules/tailwindcss > /dev/null 2>&1 && echo "✅ Tailwind CSS installed" || echo "⚠️ Tailwind CSS not found!"

echo "🎯 Generating Prisma Client..."
npx prisma generate

echo "🏗️ Building Next.js application..."
npm run build

echo "✨ Build complete!"
