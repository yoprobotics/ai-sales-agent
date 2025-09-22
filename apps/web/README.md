# AI Sales Agent - Setup Instructions 🚀

## Phase 1: Configuration rapide

### Prérequis
- Node.js 18+ 
- PostgreSQL (local ou cloud via Neon/Supabase)
- Compte Vercel pour le déploiement

### 1. Configuration locale

```bash
# Clone le repository
git clone https://github.com/yoprobotics/ai-sales-agent.git
cd ai-sales-agent

# Installation des dépendances
npm install

# Configuration de l'environnement
cd apps/web
cp .env.example .env.local
# Éditer .env.local avec vos valeurs
```

### 2. Configuration de la base de données

```bash
# Dans apps/web/
npx prisma generate
npx prisma db push

# Optionnel: Voir la DB dans Prisma Studio
npx prisma studio
```

### 3. Lancement en développement

```bash
# Depuis la racine du projet
npm run dev

# L'application sera disponible sur http://localhost:3000
```

## Configuration Vercel

### Variables d'environnement requises

Dans votre dashboard Vercel, ajoutez ces variables :

```env
DATABASE_URL=postgresql://[votre-url-de-connexion]
JWT_SECRET=[générer-une-clé-secrète-de-32-caractères]
NEXT_PUBLIC_APP_URL=https://[votre-domaine].vercel.app
NODE_ENV=production
```

### Variables optionnelles (Phase 2+)

```env
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# SendGrid
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@votredomaine.com

# OpenAI
OPENAI_API_KEY=sk-...
```

## Structure du projet

```
ai-sales-agent/
├── apps/
│   └── web/           # Application Next.js principale
├── packages/
│   ├── core/          # Types et utilitaires partagés
│   ├── ingest/        # Import et parsing de données
│   └── qualify/       # Moteur de qualification IA
└── docs/              # Documentation
```

## Fonctionnalités Phase 1 ✅

- [x] Authentification JWT sécurisée
- [x] Création et connexion de compte
- [x] Schéma Prisma complet
- [x] Structure monorepo modulaire
- [x] Configuration CI/CD
- [x] Pages légales (Privacy, Terms)
- [ ] Dashboard utilisateur (en cours)
- [ ] Import CSV de prospects (en cours)
- [ ] Qualification IA (en cours)

## Commandes utiles

```bash
# Development
npm run dev          # Lance tous les serveurs
npm run build        # Build de production
npm run lint         # Vérification du code
npm run typecheck    # Vérification TypeScript

# Base de données
npm run db:generate  # Génère le client Prisma
npm run db:push      # Applique le schéma à la DB
npm run db:studio    # Interface graphique DB

# Tests
npm run test         # Lance les tests
```

## Dépannage

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est lancé
- Vérifiez l'URL de connexion dans `.env.local`
- Pour Neon/Supabase, vérifiez que l'IP est autorisée

### Erreur de build TypeScript
- Exécutez `npm run typecheck` pour identifier les erreurs
- Assurez-vous que `npx prisma generate` a été exécuté

### Erreur de déploiement Vercel
- Vérifiez que toutes les variables d'environnement sont configurées
- Consultez les logs de build dans le dashboard Vercel

## Support

Pour toute question ou problème :
- Créez une issue sur GitHub
- Email : support@aisalesagent.com

---

**Version**: 0.1.1 (MVP Phase 1)  
**Dernière mise à jour**: Septembre 2025
