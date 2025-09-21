#!/bin/bash

echo "🚀 Starting Vercel build process..."
echo "📦 Installing root dependencies..."

# Install root dependencies
npm install

# Navigate to web app directory
cd apps/web

echo "📦 Installing web app dependencies..."
npm install

echo "🔍 Checking critical dependencies..."
echo "Node version:"
node --version

echo "NPM version:"
npm --version

echo "TypeScript version:"
npx tsc --version || echo "⚠️ TypeScript not found!"

echo "Next.js version:"
npx next --version || echo "⚠️ Next.js not found!"

echo "Tailwind CSS:"
ls -la node_modules/tailwindcss > /dev/null 2>&1 && echo "✅ Tailwind CSS installed" || echo "⚠️ Tailwind CSS not found!"

echo "Prisma:"
ls -la node_modules/prisma > /dev/null 2>&1 && echo "✅ Prisma installed" || echo "⚠️ Prisma not found!"

echo "🎯 Generating Prisma Client..."
npx prisma generate

echo "🏗️ Building Next.js application..."
npm run build

echo "✨ Build complete!"