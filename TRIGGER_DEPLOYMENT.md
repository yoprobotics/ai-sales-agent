# 🚀 Déclencher le Redéploiement sur Vercel

## Action Immédiate Requise

### Option 1: Redéploiement Automatique

Le push des derniers commits devrait déclencher automatiquement un nouveau déploiement sur Vercel.

**Vérifier sur** : https://vercel.com/yoprobotics/ai-sales-agent

### Option 2: Redéploiement Manuel

Si le déploiement automatique ne s'est pas déclenché :

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez le projet `ai-sales-agent`
3. Cliquez sur l'onglet "Deployments"
4. Cliquez sur les "..." du dernier déploiement
5. Sélectionnez "Redeploy"

### Option 3: Via Vercel CLI

```bash
# Installer Vercel CLI si nécessaire
npm i -g vercel

# Se connecter
vercel login

# Déclencher le déploiement
vercel --prod
```

## ✅ Vérifications Post-Déploiement

### 1. Page d'Accueil

- [ ] Ouvrir l'URL de production
- [ ] **DOIT** afficher la landing page complète avec :
  - Hero section "AI-Powered B2B Prospecting"
  - Switch langue FR/EN en haut à droite
  - 6 feature cards
  - 3 pricing plans
  - Footer avec liens légaux

**❌ NE DOIT PAS** afficher "Deployment Successful" simple

### 2. Navigation

- [ ] Cliquer sur "Login" → Page de connexion
- [ ] Cliquer sur "Start Free Trial" → Page d'inscription
- [ ] Switch FR/EN change la langue
- [ ] Liens du footer fonctionnent

### 3. Responsive

- [ ] Tester sur mobile (viewport < 768px)
- [ ] Menu adaptatif
- [ ] Cards empilées verticalement

## 🔍 Diagnostics si Problème

### Si encore "Deployment Successful"

1. **Vérifier les logs de build** sur Vercel
2. **Chercher** : "Using src/app" dans les logs
3. **Si absent** : Le mauvais dossier est utilisé

### Solution de Dernier Recours

1. Dans Vercel Settings :
   ```
   Build Command: cd apps/web && rm -rf app && npm run build
   Output Directory: apps/web/.next
   ```

2. Ajouter variable d'environnement :
   ```
   NEXT_PUBLIC_USE_SRC=true
   ```

## 📊 Résultats Attendus

### Page d'Accueil Correcte

```
┌─────────────────────────────────────┐
│  🚀 AI Sales Agent    [FR] [Login]  │
├─────────────────────────────────────┤
│                                     │
│     AI-Powered B2B Prospecting     │
│                                     │
│    [Start Free Trial] [Watch Demo]  │
│                                     │
├─────────────────────────────────────┤
│   ✨ AI Qualification              │
│   ✉️ Personalized Messaging        │
│   📊 Visual CRM Pipeline           │
│   ...                               │
├─────────────────────────────────────┤
│   Starter | Pro | Business         │
│    $49    $149    $499             │
├─────────────────────────────────────┤
│   Footer avec liens légaux         │
└─────────────────────────────────────┘
```

### ❌ Page Incorrecte (à éviter)

```
┌─────────────────────────────────────┐
│                                     │
│      🚀 AI Sales Agent             │
│     Deployment Successful!         │
│                                     │
└─────────────────────────────────────┘
```

## 🎯 Confirmation Finale

Une fois le déploiement réussi, vous devriez voir :

1. **Landing page complète** avec toutes les sections
2. **Navigation fonctionnelle** vers login/register
3. **Switch langue** FR/EN opérationnel
4. **Responsive design** sur tous les appareils
5. **Performances** : Lighthouse > 90

---

⏱️ **Temps estimé** : 2-3 minutes pour le redéploiement

📧 **Support** : En cas de problème persistant, ouvrir une issue sur GitHub