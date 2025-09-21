# 🚀 Guide de Déploiement Vercel

## Configuration Vercel (Web Dashboard)

### 1. Créer un nouveau projet sur Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "New Project"
3. Importer le repository `yoprobotics/ai-sales-agent`

### 2. Configuration du projet

#### Settings généraux :
```
- Framework Preset: Next.js
- Root Directory: apps/web  ⭐ IMPORTANT
- Node.js Version: 20.x
```

#### Build & Output Settings :
```
- Build Command: npm run build (auto-détecté)
- Output Directory: .next (auto-détecté)
- Install Command: npm install (auto-détecté)
```

### 3. Variables d'environnement

Ajouter les variables suivantes dans Vercel Dashboard :

```bash
# Database (Neon/Supabase)
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-production-secret-key-32chars

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid
SENDGRID_API_KEY=SG...

# OpenAI
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

## Dépannage

### Erreur : JSON5 parsing error
**Solution** : S'assurer que `.vercel/project.json` n'existe pas ou n'est pas vide.

### Erreur : Prisma Client not found
**Solution** : Le postinstall script devrait générer automatiquement le client Prisma.

### Erreur : Build failed
**Solution** : Vérifier les logs de build dans Vercel et s'assurer que toutes les variables d'environnement sont configurées.

## Commandes locales

```bash
# Test du build local
npm install
cd apps/web
npm run build

# Test avec les variables d'environnement
cp apps/web/.env.example apps/web/.env.local
# Éditer .env.local avec vos valeurs
npm run dev
```
