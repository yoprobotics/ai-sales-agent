# 🚨 FIX CRITIQUE - Désactivation de Turbo

## Problème Identifié

Vercel détecte automatiquement Turbo et essaie de build depuis la racine du monorepo :
```
> Detected Turbo. Adjusting default settings...
Running "install" command: `npm install --prefix=../..`
```

Cela cause :
- Installation de dépendances inutiles (puppeteer, crypto, etc.)
- Build depuis la mauvaise directory
- Timeout ou échec du build

## Solution Appliquée

### 1. Désactivation de Turbo
- ✅ `turbo.json` → `turbo.json.disabled`
- ✅ `package.json` (root) → `package.json.disabled`

### 2. Package.json minimal à la racine
```json
{
  "name": "ai-sales-agent-root",
  "version": "1.0.0",
  "private": true,
  "description": "Root package - DO NOT USE FOR BUILD"
}
```

### 3. .vercelignore ajouté
Ignore tout sauf `apps/web` pour éviter la détection monorepo.

### 4. Configuration explicite dans apps/web
- `vercel.json` avec config Next.js explicite
- `package.json` autonome

## Résultat Attendu

Vercel devrait maintenant :
1. ✅ NE PAS détecter Turbo
2. ✅ Traiter `apps/web` comme projet standalone
3. ✅ Installer uniquement les dépendances de `apps/web`
4. ✅ Build en < 2 minutes

## Réactivation Future

Pour réactiver Turbo après le déploiement réussi :
```bash
mv turbo.json.disabled turbo.json
mv package.json.disabled package.json.original
# Puis configurer Vercel pour supporter Turbo correctement
```
