'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

// Simple translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    'dashboard.welcome': 'Welcome back, {name}!',
    'dashboard.subtitle': 'Here\'s what\'s happening with your prospects today.',
    'dashboard.timeRange.7d': 'Last 7 days',
    'dashboard.timeRange.30d': 'Last 30 days',
    'dashboard.timeRange.90d': 'Last 90 days',
    'dashboard.stats.totalProspects': 'Total Prospects',
    'dashboard.stats.qualifiedProspects': 'Qualified Prospects',
    'dashboard.stats.emailsSent': 'Emails Sent',
    'dashboard.stats.responseRate': 'Response Rate',
    'dashboard.vsLastWeek': 'vs last week',
    'dashboard.quickActions.createICP': 'Create ICP',
    'dashboard.quickActions.createICPDesc': 'Define your ideal customer profile',
    'dashboard.quickActions.importProspects': 'Import Prospects',
    'dashboard.quickActions.importProspectsDesc': 'Upload CSV or scrape URLs',
    'dashboard.quickActions.createSequence': 'Create Sequence',
    'dashboard.quickActions.createSequenceDesc': 'Build email campaigns',
    'dashboard.quickActions.viewReports': 'View Reports',
    'dashboard.quickActions.viewReportsDesc': 'Analytics and insights',
    'dashboard.charts.prospectTrends': 'Prospect Trends',
    'dashboard.performance.title': 'Performance Metrics',
    'dashboard.insights.title': 'AI Insights',
    'dashboard.activity.title': 'Recent Activity',
    'common.viewDetails': 'View Details',
  },
  fr: {
    'dashboard.welcome': 'Bon retour, {name}!',
    'dashboard.subtitle': 'Voici ce qui se passe avec vos prospects aujourd\'hui.',
    'dashboard.timeRange.7d': '7 derniers jours',
    'dashboard.timeRange.30d': '30 derniers jours',
    'dashboard.timeRange.90d': '90 derniers jours',
    'dashboard.stats.totalProspects': 'Prospects Total',
    'dashboard.stats.qualifiedProspects': 'Prospects Qualifiés',
    'dashboard.stats.emailsSent': 'Emails Envoyés',
    'dashboard.stats.responseRate': 'Taux de Réponse',
    'dashboard.vsLastWeek': 'vs semaine dernière',
    'dashboard.quickActions.createICP': 'Créer ICP',
    'dashboard.quickActions.createICPDesc': 'Définir votre profil client idéal',
    'dashboard.quickActions.importProspects': 'Importer Prospects',
    'dashboard.quickActions.importProspectsDesc': 'Télécharger CSV ou scraper URLs',
    'dashboard.quickActions.createSequence': 'Créer Séquence',
    'dashboard.quickActions.createSequenceDesc': 'Créer campagnes email',
    'dashboard.quickActions.viewReports': 'Voir Rapports',
    'dashboard.quickActions.viewReportsDesc': 'Analyses et insights',
    'dashboard.charts.prospectTrends': 'Tendances Prospects',
    'dashboard.performance.title': 'Métriques de Performance',
    'dashboard.insights.title': 'Insights IA',
    'dashboard.activity.title': 'Activité Récente',
    'common.viewDetails': 'Voir Détails',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, params?: Record<string, string>): string => {
    let text = translations[language][key] || translations['en'][key] || key;

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value);
      });
    }

    return text;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}