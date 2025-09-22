import { useState, useCallback } from 'react'

export type Language = 'en' | 'fr'

interface I18nHook {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, any>) => string
}

const translations = {
  en: {
    'auth.login': 'Sign In',
    'auth.register': 'Sign Up',
    'auth.logout': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.company': 'Company',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember me',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.termsAgree': 'I agree to the Terms and Conditions',
    
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back, {name}',
    'dashboard.prospects': 'Prospects',
    'dashboard.qualified': 'Qualified',
    'dashboard.sequences': 'Active Sequences',
    'dashboard.emailsSent': 'Emails Sent',
    
    'nav.dashboard': 'Dashboard',
    'nav.prospects': 'Prospects',
    'nav.sequences': 'Sequences',
    'nav.campaigns': 'Campaigns',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
  },
  fr: {
    'auth.login': 'Connexion',
    'auth.register': 'Inscription',
    'auth.logout': 'Déconnexion',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.firstName': 'Prénom',
    'auth.lastName': 'Nom',
    'auth.company': 'Entreprise',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    'auth.rememberMe': 'Se souvenir de moi',
    'auth.alreadyHaveAccount': 'Vous avez déjà un compte ?',
    'auth.dontHaveAccount': "Vous n'avez pas de compte ?",
    'auth.termsAgree': "J'accepte les conditions d'utilisation",
    
    'dashboard.title': 'Tableau de bord',
    'dashboard.welcome': 'Bon retour, {name}',
    'dashboard.prospects': 'Prospects',
    'dashboard.qualified': 'Qualifiés',
    'dashboard.sequences': 'Séquences actives',
    'dashboard.emailsSent': 'Emails envoyés',
    
    'nav.dashboard': 'Tableau de bord',
    'nav.prospects': 'Prospects',
    'nav.sequences': 'Séquences',
    'nav.campaigns': 'Campagnes',
    'nav.analytics': 'Analytiques',
    'nav.settings': 'Paramètres',
    
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.create': 'Créer',
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.success': 'Succès !',
  },
}

export function useI18n(): I18nHook {
  const [language, setLanguage] = useState<Language>('en')
  
  const t = useCallback((key: string, params?: Record<string, any>): string => {
    const text = translations[language][key as keyof typeof translations['en']] || key
    
    if (!params) return text
    
    // Replace parameters in text
    let result = text
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`{${key}}`, String(value))
    })
    
    return result
  }, [language])
  
  return {
    language,
    setLanguage,
    t,
  }
}

export default useI18n
