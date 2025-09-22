'use client'

import { useCallback } from 'react'

// Simple i18n hook for bilingual support (FR/EN)
// This is a placeholder - in production, use next-i18next or similar
export function useI18n() {
  // Default to English for now
  const locale = 'en'
  
  // Translation function
  const t = useCallback((key: string, params?: Record<string, any>) => {
    // Simple translation map for demo
    const translations: Record<string, string> = {
      // Dashboard
      'dashboard.welcome': 'Welcome back, {name}!',
      'dashboard.subtitle': 'Here\'s what\'s happening with your prospects today.',
      'dashboard.vsLastWeek': 'vs last week',
      
      // Time ranges
      'dashboard.timeRange.7d': 'Last 7 days',
      'dashboard.timeRange.30d': 'Last 30 days', 
      'dashboard.timeRange.90d': 'Last 90 days',
      
      // Stats
      'dashboard.stats.totalProspects': 'Total Prospects',
      'dashboard.stats.qualifiedProspects': 'Qualified Prospects',
      'dashboard.stats.emailsSent': 'Emails Sent',
      'dashboard.stats.responseRate': 'Response Rate',
      
      // Quick Actions
      'dashboard.quickActions.createICP': 'Create ICP',
      'dashboard.quickActions.createICPDesc': 'Define your ideal customer profile',
      'dashboard.quickActions.importProspects': 'Import Prospects', 
      'dashboard.quickActions.importProspectsDesc': 'Upload CSV or scrape URLs',
      'dashboard.quickActions.createSequence': 'Create Sequence',
      'dashboard.quickActions.createSequenceDesc': 'Build email sequences',
      'dashboard.quickActions.viewReports': 'View Reports',
      'dashboard.quickActions.viewReportsDesc': 'Analytics and insights',
      
      // Charts
      'dashboard.charts.prospectTrends': 'Prospect Trends',
      'dashboard.performance.title': 'Performance Metrics',
      'dashboard.insights.title': 'AI Insights',
      'dashboard.activity.title': 'Recent Activity',
      
      // Common
      'common.viewDetails': 'View Details',
      'common.loading': 'Loading...',
      'common.error': 'An error occurred',
    }
    
    let translation = translations[key] || key
    
    // Replace parameters
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param])
      })
    }
    
    return translation
  }, [locale])
  
  // Locale change function
  const changeLocale = useCallback((newLocale: 'en' | 'fr') => {
    // In production, this would update the locale state
    console.log('Changing locale to:', newLocale)
  }, [])
  
  return {
    t,
    locale,
    changeLocale,
  }
}