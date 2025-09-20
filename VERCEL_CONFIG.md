# 🚀 Configuration Vercel - AI Sales Agent

## Option 1: Root Directory Configuration (Recommandée)

Lors de la création du projet sur Vercel :

1. **Framework Preset**: Next.js
2. **Root Directory**: `apps/web`
3. **Build Command**: `npm run build` (auto-détecté)
4. **Output Directory**: `.next` (auto-détecté)
5. **Install Command**: `npm install` (auto-détecté)

## Option 2: Monorepo Configuration

Si vous gardez Root Directory vide, le `vercel.json` actuel devrait fonctionner :

```json
{
  "buildCommand": "cd apps/web && npm run build",
  "outputDirectory": "apps/web/.next", 
  "installCommand": "npm install && cd apps/web && npm install",
  "framework": "nextjs"
}
```

## Variables d'Environnement

Ajouter dans Vercel Dashboard > Settings > Environment Variables :

```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

## Recommandation

**Utilisez l'Option 1** : Plus simple et plus fiable.
1. Supprimer le projet Vercel actuel
2. Créer un nouveau projet 
3. Root Directory: `apps/web`
4. Framework: Next.js

Cela évitera les problèmes de monorepo et détectera automatiquement Next.js.