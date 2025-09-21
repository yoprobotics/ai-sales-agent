#!/bin/bash

echo "🚀 Starting Vercel build process..."

# Navigate to web app directory
cd apps/web

echo "📦 Installing ALL dependencies (including devDependencies)..."
# Force installation of all dependencies including devDependencies
npm install --production=false

echo "🔍 Checking Tailwind CSS installation..."
ls -la node_modules/.bin/tailwindcss || echo "⚠️ Tailwind CSS not found!"

echo "🔍 Checking PostCSS installation..."  
ls -la node_modules/.bin/postcss || echo "⚠️ PostCSS not found!"

echo "🎯 Generating Prisma Client..."
npx prisma generate

echo "🏗️ Building Next.js application..."
npm run build

echo "✨ Build complete!"
