#!/bin/bash

# Script to fix Vercel build conflict
# Remove pages/api folder that conflicts with app/api

echo "🔧 Fixing Vercel build conflict..."

# Navigate to web app
cd apps/web/src

# Remove the conflicting pages folder
if [ -d "pages" ]; then
    echo "❌ Removing conflicting pages folder..."
    rm -rf pages
    echo "✅ Pages folder removed"
else
    echo "✅ No pages folder found - already clean"
fi

# Create a marker file to indicate the fix has been applied
touch .pages-removed-marker

echo "✅ Conflict fixed! Ready for Vercel deployment"
echo ""
echo "📝 Next steps:"
echo "1. Commit these changes"
echo "2. Push to main branch"
echo "3. Re-deploy on Vercel"