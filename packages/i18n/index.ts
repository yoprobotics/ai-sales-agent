export const languages = ['en', 'fr'] as const;
export type Language = typeof languages[number];

export const defaultLanguage: Language = 'en';

// Basic translations structure
export const translations = {
  en: {
    common: {
      welcome: 'Welcome',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
      dashboard: 'Dashboard',
      settings: 'Settings',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
    },
    auth: {
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      companyName: 'Company Name',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember me',
      loginSuccess: 'Successfully logged in',
      loginError: 'Invalid email or password',
      signupSuccess: 'Account created successfully',
      signupError: 'Failed to create account',
      logoutSuccess: 'Successfully logged out',
      resetPasswordSuccess: 'Password reset successfully',
      resetPasswordError: 'Failed to reset password',
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome back, {{name}}!',
      prospects: 'Prospects',
      campaigns: 'Campaigns',
      sequences: 'Sequences',
      analytics: 'Analytics',
      totalProspects: 'Total Prospects',
      qualifiedProspects: 'Qualified Prospects',
      emailsSent: 'Emails Sent',
      responseRate: 'Response Rate',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions',
      createICP: 'Create ICP',
      importProspects: 'Import Prospects',
      newSequence: 'New Sequence',
      viewReports: 'View Reports',
    },
    prospects: {
      title: 'Prospects',
      addProspect: 'Add Prospect',
      importCSV: 'Import CSV',
      exportData: 'Export Data',
      filters: 'Filters',
      score: 'Score',
      stage: 'Stage',
      company: 'Company',
      jobTitle: 'Job Title',
      lastContacted: 'Last Contacted',
      actions: 'Actions',
      qualify: 'Qualify',
      sendEmail: 'Send Email',
      addNote: 'Add Note',
      viewDetails: 'View Details',
      noProspects: 'No prospects found',
      stages: {
        new: 'New',
        contacted: 'Contacted',
        meeting: 'Meeting',
        negotiation: 'Negotiation',
        won: 'Won',
        lost: 'Lost',
      },
    },
    icp: {
      title: 'Ideal Customer Profiles',
      createICP: 'Create ICP',
      editICP: 'Edit ICP',
      deleteICP: 'Delete ICP',
      name: 'ICP Name',
      description: 'Description',
      criteria: 'Criteria',
      industry: 'Industry',
      companySize: 'Company Size',
      revenue: 'Revenue',
      location: 'Location',
      keywords: 'Keywords',
      technologies: 'Technologies',
      jobTitles: 'Job Titles',
      exclusions: 'Exclusions',
      active: 'Active',
      inactive: 'Inactive',
    },
    sequences: {
      title: 'Email Sequences',
      createSequence: 'Create Sequence',
      editSequence: 'Edit Sequence',
      deleteSequence: 'Delete Sequence',
      name: 'Sequence Name',
      steps: 'Steps',
      prospects: 'Prospects',
      performance: 'Performance',
      status: 'Status',
      active: 'Active',
      paused: 'Paused',
      draft: 'Draft',
      completed: 'Completed',
      openRate: 'Open Rate',
      clickRate: 'Click Rate',
      replyRate: 'Reply Rate',
    },
    billing: {
      title: 'Billing & Subscription',
      currentPlan: 'Current Plan',
      usage: 'Usage',
      invoices: 'Invoices',
      paymentMethod: 'Payment Method',
      updateCard: 'Update Card',
      upgradePlan: 'Upgrade Plan',
      cancelSubscription: 'Cancel Subscription',
      plans: {
        starter: 'Starter',
        pro: 'Pro',
        business: 'Business',
      },
      billingCycle: {
        monthly: 'Monthly',
        yearly: 'Yearly (Save 17%)',
      },
    },
    errors: {
      notFound: 'Page not found',
      unauthorized: 'Unauthorized access',
      serverError: 'Server error occurred',
      networkError: 'Network error',
      validationError: 'Validation error',
      somethingWentWrong: 'Something went wrong',
      tryAgain: 'Please try again',
    },
  },
  fr: {
    common: {
      welcome: 'Bienvenue',
      login: 'Connexion',
      signup: 'Inscription',
      logout: 'Déconnexion',
      dashboard: 'Tableau de bord',
      settings: 'Paramètres',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      add: 'Ajouter',
      search: 'Rechercher',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      close: 'Fermer',
    },
    auth: {
      email: 'Courriel',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      firstName: 'Prénom',
      lastName: 'Nom',
      companyName: 'Nom de l\'entreprise',
      forgotPassword: 'Mot de passe oublié?',
      rememberMe: 'Se souvenir de moi',
      loginSuccess: 'Connexion réussie',
      loginError: 'Courriel ou mot de passe invalide',
      signupSuccess: 'Compte créé avec succès',
      signupError: 'Échec de la création du compte',
      logoutSuccess: 'Déconnexion réussie',
      resetPasswordSuccess: 'Mot de passe réinitialisé avec succès',
      resetPasswordError: 'Échec de la réinitialisation du mot de passe',
    },
    dashboard: {
      title: 'Tableau de bord',
      welcome: 'Bon retour, {{name}}!',
      prospects: 'Prospects',
      campaigns: 'Campagnes',
      sequences: 'Séquences',
      analytics: 'Analyses',
      totalProspects: 'Total des prospects',
      qualifiedProspects: 'Prospects qualifiés',
      emailsSent: 'Courriels envoyés',
      responseRate: 'Taux de réponse',
      recentActivity: 'Activité récente',
      quickActions: 'Actions rapides',
      createICP: 'Créer un PCI',
      importProspects: 'Importer des prospects',
      newSequence: 'Nouvelle séquence',
      viewReports: 'Voir les rapports',
    },
    prospects: {
      title: 'Prospects',
      addProspect: 'Ajouter un prospect',
      importCSV: 'Importer CSV',
      exportData: 'Exporter les données',
      filters: 'Filtres',
      score: 'Score',
      stage: 'Étape',
      company: 'Entreprise',
      jobTitle: 'Titre du poste',
      lastContacted: 'Dernier contact',
      actions: 'Actions',
      qualify: 'Qualifier',
      sendEmail: 'Envoyer un courriel',
      addNote: 'Ajouter une note',
      viewDetails: 'Voir les détails',
      noProspects: 'Aucun prospect trouvé',
      stages: {
        new: 'Nouveau',
        contacted: 'Contacté',
        meeting: 'Rencontre',
        negotiation: 'Négociation',
        won: 'Gagné',
        lost: 'Perdu',
      },
    },
    icp: {
      title: 'Profils de Client Idéal',
      createICP: 'Créer un PCI',
      editICP: 'Modifier le PCI',
      deleteICP: 'Supprimer le PCI',
      name: 'Nom du PCI',
      description: 'Description',
      criteria: 'Critères',
      industry: 'Industrie',
      companySize: 'Taille de l\'entreprise',
      revenue: 'Revenus',
      location: 'Localisation',
      keywords: 'Mots-clés',
      technologies: 'Technologies',
      jobTitles: 'Titres de poste',
      exclusions: 'Exclusions',
      active: 'Actif',
      inactive: 'Inactif',
    },
    sequences: {
      title: 'Séquences de courriels',
      createSequence: 'Créer une séquence',
      editSequence: 'Modifier la séquence',
      deleteSequence: 'Supprimer la séquence',
      name: 'Nom de la séquence',
      steps: 'Étapes',
      prospects: 'Prospects',
      performance: 'Performance',
      status: 'Statut',
      active: 'Active',
      paused: 'En pause',
      draft: 'Brouillon',
      completed: 'Complétée',
      openRate: 'Taux d\'ouverture',
      clickRate: 'Taux de clic',
      replyRate: 'Taux de réponse',
    },
    billing: {
      title: 'Facturation et abonnement',
      currentPlan: 'Plan actuel',
      usage: 'Utilisation',
      invoices: 'Factures',
      paymentMethod: 'Méthode de paiement',
      updateCard: 'Mettre à jour la carte',
      upgradePlan: 'Améliorer le plan',
      cancelSubscription: 'Annuler l\'abonnement',
      plans: {
        starter: 'Démarrage',
        pro: 'Pro',
        business: 'Entreprise',
      },
      billingCycle: {
        monthly: 'Mensuel',
        yearly: 'Annuel (Économisez 17%)',
      },
    },
    errors: {
      notFound: 'Page non trouvée',
      unauthorized: 'Accès non autorisé',
      serverError: 'Erreur serveur',
      networkError: 'Erreur réseau',
      validationError: 'Erreur de validation',
      somethingWentWrong: 'Quelque chose s\'est mal passé',
      tryAgain: 'Veuillez réessayer',
    },
  },
};

// Helper function to get nested translation
export function getTranslation(
  language: Language,
  key: string,
  params?: Record<string, string>
): string {
  const keys = key.split('.');
  let translation: any = translations[language];
  
  for (const k of keys) {
    translation = translation?.[k];
    if (!translation) {
      // Fallback to English if translation not found
      translation = translations.en;
      for (const k of keys) {
        translation = translation?.[k];
      }
      break;
    }
  }
  
  if (typeof translation !== 'string') {
    return key; // Return key if translation not found
  }
  
  // Replace parameters
  if (params) {
    Object.keys(params).forEach((param) => {
      translation = translation.replace(`{{${param}}}`, params[param]);
    });
  }
  
  return translation;
}

// Date and number formatting
export function formatDate(date: Date, language: Language): string {
  const locale = language === 'fr' ? 'fr-CA' : 'en-CA';
  return new Intl.DateTimeFormat(locale).format(date);
}

export function formatCurrency(amount: number, language: Language): string {
  const locale = language === 'fr' ? 'fr-CA' : 'en-CA';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

export function formatNumber(number: number, language: Language): string {
  const locale = language === 'fr' ? 'fr-CA' : 'en-CA';
  return new Intl.NumberFormat(locale).format(number);
}
