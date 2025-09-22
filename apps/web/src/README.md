# 📁 Structure src/app

## ✅ Ceci est la BONNE structure

Ce dossier `src/app` contient l'implémentation complète de l'application AI Sales Agent.

## Pages Principales

### `/` - Landing Page
- Hero section bilingue (FR/EN)
- Présentation des fonctionnalités
- Plans de tarification
- Call-to-action
- Footer avec liens légaux

### `/login` - Connexion
- Formulaire de connexion sécurisé
- Validation avec Zod
- JWT authentication
- Redirection vers dashboard

### `/register` - Inscription
- Formulaire d'inscription complet
- Validation forte des mots de passe
- Sélection région de données (GDPR/PIPEDA/CCPA)
- Acceptation des CGU

### `/dashboard` - Tableau de Bord
- Vue d'ensemble des métriques
- Graphiques de performance
- Insights IA
- Navigation principale

### `/legal/*` - Pages Légales
- Privacy Policy (FR/EN)
- Terms & Conditions (FR/EN)
- Contact
- Disclaimer

## API Routes

- `/api/auth/login` - Authentification
- `/api/auth/register` - Inscription
- `/api/auth/logout` - Déconnexion
- `/api/auth/refresh` - Refresh token
- `/api/dashboard/stats` - Statistiques dashboard
- `/api/health` - Health check

## Components

### UI Components
- Button, Card, Badge
- Form, Input, Select
- Dialog, Toast
- Loading states

### Dashboard Components
- Overview
- ProspectChart
- PerformanceMetrics
- AIInsights
- RecentActivity

### Auth Components
- LoginForm
- RegisterForm
- AuthGuard

## Hooks

- `useAuth` - Gestion authentification
- `useI18n` - Internationalisation
- `useToast` - Notifications
- `useForm` - Gestion formulaires

## Lib

- `auth.ts` - JWT & session management
- `api.ts` - API client
- `prisma.ts` - Database client
- `validation.ts` - Schémas Zod
- `utils.ts` - Utilitaires

## Middleware

- Protection des routes `/dashboard/*`
- Redirection si non authentifié
- Headers de sécurité
- Rate limiting

---

⚠️ **Important** : Ne pas créer de dossier `app` à la racine de `apps/web`. Toujours utiliser `src/app`.