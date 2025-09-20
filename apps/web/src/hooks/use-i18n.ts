'use client';

import { useEffect, useState } from 'react';
import { Language, getTranslation, formatDate, formatCurrency, formatNumber } from '@/packages/i18n';

export function useI18n() {
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get language from cookie or browser
    const cookieLanguage = document.cookie
      .split('; ')
      .find((row) => row.startsWith('language='))
      ?.split('=')[1] as Language | undefined;

    if (cookieLanguage && ['en', 'fr'].includes(cookieLanguage)) {
      setLanguage(cookieLanguage);
    } else {
      // Detect from browser
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      setLanguage(browserLang === 'fr' ? 'fr' : 'en');
    }
    
    setIsLoading(false);
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // Set cookie
    document.cookie = `language=${newLanguage}; path=/; max-age=31536000; SameSite=Lax`;
    // Reload to apply new language
    window.location.reload();
  };

  const t = (key: string, params?: Record<string, string>) => {
    return getTranslation(language, key, params);
  };

  const formatters = {
    date: (date: Date) => formatDate(date, language),
    currency: (amount: number) => formatCurrency(amount, language),
    number: (number: number) => formatNumber(number, language),
  };

  return {
    language,
    setLanguage: changeLanguage,
    t,
    isLoading,
    ...formatters,
  };
}
