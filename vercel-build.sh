#!/bin/bash

echo "🚀 Starting Vercel build process..."
echo "📦 Installing dependencies..."

# Install dependencies at root level if needed
npm install

# Navigate to web app directory
cd apps/web

echo "📦 Installing web app dependencies..."
npm install

echo "🔍 Checking Tailwind CSS installation..."
ls -la node_modules/tailwindcss || echo "⚠️ Tailwind CSS not found!"

echo "🎯 Generating Prisma Client..."
npx prisma generate

echo "🏗️ Building Next.js application..."
npm run build

echo "✨ Build complete!"
