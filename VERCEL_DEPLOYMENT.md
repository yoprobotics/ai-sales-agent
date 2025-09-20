# 🚀 Guide de Déploiement Vercel - AI Sales Agent

## ✅ Corrections Apportées

Les problèmes de déploiement suivants ont été corrigés :

### 1. Configuration Vercel (`vercel.json`)
- ✅ Configuration monorepo corrigée
- ✅ Chemin vers l'app web spécifié correctly
- ✅ Configuration des fonctions API mise à jour

### 2. Dépendances (`apps/web/package.json`)
- ✅ Ajout de Tailwind CSS et dépendances manquantes
- ✅ Scripts de build optimisés
- ✅ Types TypeScript inclus

### 3. Configuration TypeScript
- ✅ `tsconfig.json` ajouté avec chemins d'alias
- ✅ `next-env.d.ts` pour les types Next.js
- ✅ Configuration compatible avec Next.js 14

### 4. Configuration PostCSS
- ✅ `postcss.config.js` pour Tailwind CSS
- ✅ Autoprefixer configuré

### 5. Variables d'Environnement
- ✅ `.env.example` avec toutes les variables nécessaires

## 🔧 Instructions de Déploiement

### 1. Connecter le Repository à Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "New Project"
3. Importer le repository `yoprobotics/ai-sales-agent`

### 2. Configuration Vercel

#### Framework Preset
- Framework: **Next.js**
- Root Directory: **Laissez vide** (détection automatique via vercel.json)

#### Build & Output Settings
- Build Command: `npm run build:web` (défini automatiquement)
- Output Directory: `apps/web/.next` (défini automatiquement)
- Install Command: `npm install` (défini automatiquement)

#### Variables d'Environnement

Ajouter ces variables dans les settings Vercel :

```bash
# Base de données (utiliser Neon ou Supabase)
DATABASE_URL=postgresql://user:password@host:5432/ai_sales_agent

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid
SENDGRID_API_KEY=SG....

# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production

# OpenAI
OPENAI_API_KEY=sk-...
```

### 3. Déploiement

1. Cliquer sur **"Deploy"**
2. Le build devrait maintenant réussir ✅

### 4. Configuration Domaine (Optionnel)

1. Aller dans Project Settings > Domains
2. Ajouter votre domaine custom
3. Configurer les DNS selon les instructions Vercel

## 🛠️ Développement Local

```bash
# Installation
npm install

# Démarrage en mode dev
npm run dev

# Build local (test)
npm run build:web
```

## 📝 Notes Importantes

- ✅ **Monorepo**: Configuration Vercel optimisée pour la structure monorepo
- ✅ **TypeScript**: Configuration complète avec types et aliases
- ✅ **Tailwind CSS**: Configuration et build optimisés
- ✅ **Next.js 14**: App Router avec RSC (React Server Components)
- ✅ **Variables d'env**: Template complet fourni

## 🔍 Dépannage

Si le déploiement échoue encore :

1. Vérifier les logs de build dans Vercel Dashboard
2. S'assurer que toutes les variables d'environnement sont configurées
3. Vérifier que la base de données est accessible depuis Vercel

## 🚀 Prêt pour le Déploiement !

Tous les fichiers de configuration ont été corrigés. Vous pouvez maintenant déployer sur Vercel sans erreurs de build JSON.