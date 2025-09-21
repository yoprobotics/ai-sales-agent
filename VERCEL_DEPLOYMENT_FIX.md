# 🚨 INSTRUCTIONS CRITIQUES - DÉPLOIEMENT VERCEL

## ✅ Actions Immédiates Requises

### 1. FUSIONNER LA PR #4
- **[Cliquer ici pour fusionner la PR #4](https://github.com/yoprobotics/ai-sales-agent/pull/4)**
- Cette PR contient une version MINIMALE de l'application qui FONCTIONNERA

### 2. Configuration Vercel (IMPORTANT)

Dans le dashboard Vercel, vérifier que :

```
Root Directory: apps/web
Framework: Auto-detect (Next.js)
```

**NE PAS MODIFIER** les autres paramètres.

### 3. Variables d'Environnement

Pour l'instant, ajouter SEULEMENT :

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://[votre-domaine].vercel.app
```

**NE PAS AJOUTER** DATABASE_URL ou autres variables pour le moment.

### 4. Redéployer

Après avoir fusionné la PR :
1. Aller dans Vercel Dashboard
2. Cliquer sur "Redeploy"
3. Choisir la branche `main`
4. Attendre le déploiement (devrait prendre < 2 minutes)

## 🎯 Résultat Attendu

Vous devriez voir :
- ✅ Build réussi en < 60 secondes
- ✅ Page d'accueil avec "AI Sales Agent" 
- ✅ API endpoint `/api/test` fonctionnel

## 🔄 Prochaines Étapes (APRÈS déploiement réussi)

Une fois que le site est en ligne, nous pourrons progressivement ajouter :

1. **Phase 1** - Styling
   - Tailwind CSS
   - Composants UI

2. **Phase 2** - Base de données
   - Prisma
   - PostgreSQL
   - Migrations

3. **Phase 3** - Auth
   - JWT
   - Middleware
   - Protection routes

4. **Phase 4** - Fonctionnalités
   - Dashboard
   - Import CSV
   - IA

## ❓ Si le build échoue encore

1. **Vérifier les logs** dans Vercel
2. **Copier l'erreur exacte**
3. **Me la communiquer** pour analyse

## 📝 Note Importante

Cette approche "from scratch" est LA SEULE façon de garantir un déploiement fonctionnel. Une fois la base stable, nous reconstruirons tout progressivement.

---

**FUSIONNER LA PR #4 MAINTENANT** 👉 https://github.com/yoprobotics/ai-sales-agent/pull/4
