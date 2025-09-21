#!/bin/bash

# ====================================================================
# SCRIPT DE NETTOYAGE AUTOMATIQUE POUR DEPLOIEMENT VERCEL
# ====================================================================

echo "🔧 Nettoyage automatique du repository pour déploiement Vercel"
echo "=============================================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Nettoyer les fichiers volumineux de l'historique Git
echo -e "\n${YELLOW}Étape 1: Nettoyage de l'historique Git${NC}"

# Vérifier si node_modules est dans l'historique
if git ls-files | grep -q "node_modules"; then
    echo -e "${RED}⚠️ node_modules détecté dans Git!${NC}"
    git rm -r --cached node_modules 2>/dev/null || true
    echo -e "${GREEN}✓${NC} node_modules retiré de Git"
fi

# 2. Réinitialiser sur l'état distant propre
echo -e "\n${YELLOW}Étape 2: Synchronisation avec GitHub${NC}"
git fetch origin main
git reset --hard origin/main
echo -e "${GREEN}✓${NC} Synchronisé avec GitHub"

# 3. Supprimer les fichiers conflictuels
echo -e "\n${YELLOW}Étape 3: Suppression des fichiers conflictuels${NC}"
rm -f apps/web/vercel.json
rm -f apps/web/postcss.config.mjs
rm -f apps/web/vercel.json.bak
echo -e "${GREEN}✓${NC} Fichiers conflictuels supprimés"

# 4. S'assurer que .gitignore est correct
echo -e "\n${YELLOW}Étape 4: Mise à jour de .gitignore${NC}"
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# Typescript
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db
EOF

echo -e "${GREEN}✓${NC} .gitignore mis à jour"

# 5. S'assurer que postcss.config.js est correct
echo -e "\n${YELLOW}Étape 5: Configuration PostCSS${NC}"
cat > apps/web/postcss.config.js << 'EOF'
/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
echo -e "${GREEN}✓${NC} PostCSS configuré correctement"

# 6. Committer les changements
echo -e "\n${YELLOW}Étape 6: Commit des changements${NC}"
git add -A
git commit -m "fix: Clean repository for Vercel deployment - remove conflicting files and node_modules" || echo "Aucun changement à committer"

# 7. Pousser vers GitHub
echo -e "\n${YELLOW}Étape 7: Push vers GitHub${NC}"
git push origin main --force-with-lease

echo ""
echo "=============================================================="
echo -e "${GREEN}✅ Nettoyage terminé avec succès!${NC}"
echo ""
echo "Le repository est maintenant prêt pour le déploiement Vercel."
echo ""
echo "Vérifiez votre dashboard Vercel : https://vercel.com/dashboard"
echo ""
