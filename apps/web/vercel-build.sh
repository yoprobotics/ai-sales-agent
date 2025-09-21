#!/bin/bash

echo "🚀 Starting Vercel build for AI Sales Agent..."

# Skip Prisma generation if DATABASE_URL is not set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️ DATABASE_URL not set, skipping Prisma client generation"
    # Create a stub to prevent import errors
    mkdir -p node_modules/.prisma/client
    echo "module.exports = {}" > node_modules/.prisma/client/index.js
else
    echo "✅ DATABASE_URL found, generating Prisma client"
    npx prisma generate
fi

echo "🏗️ Building Next.js application..."
next build

echo "✅ Build completed successfully!"
