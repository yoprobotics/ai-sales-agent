#!/bin/bash

echo "🚀 Starting Vercel build process..."

# Navigate to the web app directory
cd apps/web

echo "📦 Installing dependencies..."
npm install

echo "🔍 Checking Prisma installation..."
ls -la node_modules/.bin/ | grep prisma || echo "Prisma not found in node_modules/.bin/"

echo "🎯 Generating Prisma Client..."
npx prisma generate || echo "Failed to generate Prisma Client"

echo "🏗️ Building Next.js application..."
npm run build

echo "✨ Build complete!"
