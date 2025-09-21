'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'fr';

interface IntlContextValue {
  locale: Language;
  setLocale: (locale: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const IntlContext = createContext<IntlContextValue | undefined>(undefined);

export const translations = {
  en: {
    'app.name': 'AI Sales Agent',
    'auth.login': 'Log in',
    'auth.register': 'Sign up',
    'auth.logout': 'Log out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.companyName': 'Company Name',
    'auth.acceptTerms': 'I accept the terms and conditions',
    'auth.forgotPassword': 'Forgot password?',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back, {{name}}!',
    'dashboard.prospects': 'Prospects',
    'dashboard.campaigns': 'Campaigns',
    'dashboard.sequences': 'Sequences',
    'dashboard.analytics': 'Analytics',
    'prospects.title': 'Prospects',
    'prospects.new': 'New Prospect',
    'prospects.import': 'Import CSV',
    'prospects.export': 'Export',
    'prospects.stage.new': 'New',
    'prospects.stage.contacted': 'Contacted',
    'prospects.stage.meeting': 'Meeting',
    'prospects.stage.negotiation': 'Negotiation',
    'prospects.stage.won': 'Won',
    'prospects.stage.lost': 'Lost',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
  },
  fr: {
    'app.name': 'AI Sales Agent',
    'auth.login': 'Se connecter',
    'auth.register': "S'inscrire",
    'auth.logout': 'Déconnexion',
    'auth.email': 'Courriel',
    'auth.password': 'Mot de passe',
    'auth.firstName': 'Prénom',
    'auth.lastName': 'Nom de famille',
    'auth.companyName': "Nom de l'entreprise",
    'auth.acceptTerms': "J'accepte les conditions d'utilisation",
    'auth.forgotPassword': 'Mot de passe oublié?',
    'auth.alreadyHaveAccount': 'Vous avez déjà un compte?',
    'auth.dontHaveAccount': "Vous n'avez pas de compte?",
    'dashboard.title': 'Tableau de bord',
    'dashboard.welcome': 'Bon retour, {{name}}!',
    'dashboard.prospects': 'Prospects',
    'dashboard.campaigns': 'Campagnes',
    'dashboard.sequences': 'Séquences',
    'dashboard.analytics': 'Analyses',
    'prospects.title': 'Prospects',
    'prospects.new': 'Nouveau Prospect',
    'prospects.import': 'Importer CSV',
    'prospects.export': 'Exporter',
    'prospects.stage.new': 'Nouveau',
    'prospects.stage.contacted': 'Contacté',
    'prospects.stage.meeting': 'Rendez-vous',
    'prospects.stage.negotiation': 'Négociation',
    'prospects.stage.won': 'Gagné',
    'prospects.stage.lost': 'Perdu',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.success': 'Succès!',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
  },
};

export function IntlProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Language>('en');

  useEffect(() => {
    // Load locale from localStorage or browser settings
    const savedLocale = localStorage.getItem('locale') as Language;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'fr')) {
      setLocale(savedLocale);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'fr') {
        setLocale('fr');
      }
    }
  }, []);

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[locale][key as keyof typeof translations['en']] || key;
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{{${paramKey}}}`, paramValue);
      });
    }
    
    return translation;
  };

  const updateLocale = (newLocale: Language) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <IntlContext.Provider value={{ locale, setLocale: updateLocale, t }}>
      {children}
    </IntlContext.Provider>
  );
}

export function useIntl() {
  const context = useContext(IntlContext);
  if (!context) {
    throw new Error('useIntl must be used within IntlProvider');
  }
  return context;
}