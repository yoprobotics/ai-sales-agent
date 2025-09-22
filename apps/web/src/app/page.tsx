'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRightIcon, CheckIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'fr'>('en')
  
  const translations = {
    en: {
      hero: {
        title: 'AI Sales Agent',
        subtitle: 'Transform your B2B prospecting with AI-powered automation',
        description: 'Define your ideal customer profile, import prospects, and let AI qualify and personalize your outreach at scale.',
        cta_primary: 'Start Free Trial',
        cta_secondary: 'View Demo',
        login: 'Login'
      },
      features: {
        title: 'Everything you need to scale your B2B sales',
        items: [
          {
            title: 'Smart Qualification',
            description: 'AI-powered BANT scoring with transparent explanations'
          },
          {
            title: 'Personalized Messaging',
            description: 'Generate context-aware emails in French and English'
          },
          {
            title: 'Visual Pipeline',
            description: 'Manage prospects with a Kanban-style CRM interface'
          },
          {
            title: 'Email Sequences',
            description: 'Automate follow-ups with conditional logic'
          },
          {
            title: 'AI Insights',
            description: 'Get recommendations to improve your campaigns'
          },
          {
            title: 'Analytics Dashboard',
            description: 'Track performance with real-time metrics'
          }
        ]
      },
      pricing: {
        title: 'Simple, transparent pricing',
        subtitle: 'Choose the plan that fits your business',
        monthly: 'Monthly',
        yearly: 'Yearly',
        save: 'Save 17%',
        plans: [
          {
            name: 'Starter',
            price_monthly: 49,
            price_yearly: 490,
            description: 'Perfect for small teams getting started',
            features: [
              '1 ICP profile',
              '200 prospects/month',
              '1 email sequence',
              'Basic AI qualification',
              'Email support'
            ]
          },
          {
            name: 'Pro',
            price_monthly: 149,
            price_yearly: 1490,
            description: 'For growing teams ready to scale',
            popular: true,
            features: [
              '5 ICP profiles',
              '2,000 prospects/month',
              '10 email sequences',
              'Advanced AI features',
              'Multi-channel outreach',
              'Priority support'
            ]
          },
          {
            name: 'Business',
            price_monthly: 499,
            price_yearly: 4990,
            description: 'Enterprise-grade features for large teams',
            features: [
              'Unlimited ICPs',
              'Unlimited prospects',
              'Unlimited sequences',
              'CRM integrations',
              'Custom AI training',
              'Dedicated support'
            ]
          }
        ]
      },
      footer: {
        product: 'Product',
        features: 'Features',
        pricing: 'Pricing',
        documentation: 'Documentation',
        legal: 'Legal',
        privacy: 'Privacy Policy',
        terms: 'Terms & Conditions',
        contact: 'Contact',
        company: 'Company',
        about: 'About Us',
        blog: 'Blog',
        careers: 'Careers',
        copyright: '© 2025 YoProbotics. All rights reserved.'
      }
    },
    fr: {
      hero: {
        title: 'AI Sales Agent',
        subtitle: 'Transformez votre prospection B2B avec l\'IA',
        description: 'Définissez votre profil client idéal, importez vos prospects et laissez l\'IA qualifier et personnaliser vos messages à grande échelle.',
        cta_primary: 'Essai Gratuit',
        cta_secondary: 'Voir la Démo',
        login: 'Connexion'
      },
      features: {
        title: 'Tout pour développer vos ventes B2B',
        items: [
          {
            title: 'Qualification Intelligente',
            description: 'Scoring BANT par IA avec explications transparentes'
          },
          {
            title: 'Messages Personnalisés',
            description: 'Générez des emails contextuels en français et anglais'
          },
          {
            title: 'Pipeline Visuel',
            description: 'Gérez vos prospects avec un CRM style Kanban'
          },
          {
            title: 'Séquences Email',
            description: 'Automatisez les relances avec logique conditionnelle'
          },
          {
            title: 'Insights IA',
            description: 'Recevez des recommandations pour améliorer vos campagnes'
          },
          {
            title: 'Tableau de Bord',
            description: 'Suivez vos performances en temps réel'
          }
        ]
      },
      pricing: {
        title: 'Tarifs simples et transparents',
        subtitle: 'Choisissez le plan adapté à votre entreprise',
        monthly: 'Mensuel',
        yearly: 'Annuel',
        save: 'Économisez 17%',
        plans: [
          {
            name: 'Starter',
            price_monthly: 49,
            price_yearly: 490,
            description: 'Parfait pour les petites équipes',
            features: [
              '1 profil ICP',
              '200 prospects/mois',
              '1 séquence email',
              'Qualification IA de base',
              'Support email'
            ]
          },
          {
            name: 'Pro',
            price_monthly: 149,
            price_yearly: 1490,
            description: 'Pour les équipes en croissance',
            popular: true,
            features: [
              '5 profils ICP',
              '2 000 prospects/mois',
              '10 séquences email',
              'IA avancée',
              'Multi-canal',
              'Support prioritaire'
            ]
          },
          {
            name: 'Business',
            price_monthly: 499,
            price_yearly: 4990,
            description: 'Fonctionnalités entreprise',
            features: [
              'ICP illimités',
              'Prospects illimités',
              'Séquences illimitées',
              'Intégrations CRM',
              'IA personnalisée',
              'Support dédié'
            ]
          }
        ]
      },
      footer: {
        product: 'Produit',
        features: 'Fonctionnalités',
        pricing: 'Tarifs',
        documentation: 'Documentation',
        legal: 'Légal',
        privacy: 'Politique de confidentialité',
        terms: 'Conditions générales',
        contact: 'Contact',
        company: 'Entreprise',
        about: 'À propos',
        blog: 'Blog',
        careers: 'Carrières',
        copyright: '© 2025 YoProbotics. Tous droits réservés.'
      }
    }
  }

  const t = translations[language]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">🚀 AI Sales Agent</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                {t.footer.features}
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                {t.footer.pricing}
              </Link>
              <Link href="/legal" className="text-gray-600 hover:text-gray-900">
                {t.footer.legal}
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {language === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
              </button>
              <Link 
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                {t.hero.login}
              </Link>
              <Link 
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.hero.cta_primary}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              {t.hero.subtitle}
            </p>
            <p className="text-lg text-gray-500 mb-8 max-w-3xl mx-auto">
              {t.hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.hero.cta_primary}
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors"
              >
                {t.hero.cta_secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {t.features.title}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.items.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-xl text-gray-600">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.pricing.plans.map((plan, index) => (
              <div 
                key={index}
                className={`bg-white rounded-lg shadow-sm border-2 ${
                  plan.popular ? 'border-blue-500' : 'border-gray-200'
                } p-8 hover:shadow-lg transition-shadow relative`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    Popular
                  </span>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price_monthly}</span>
                  <span className="text-gray-600">/{t.pricing.monthly.toLowerCase()}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/register"
                  className={`block text-center py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t.hero.cta_primary}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">{t.footer.product}</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="hover:text-white">{t.footer.features}</Link></li>
                <li><Link href="#pricing" className="hover:text-white">{t.footer.pricing}</Link></li>
                <li><Link href="/docs" className="hover:text-white">{t.footer.documentation}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">{t.footer.company}</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white">{t.footer.about}</Link></li>
                <li><Link href="/blog" className="hover:text-white">{t.footer.blog}</Link></li>
                <li><Link href="/careers" className="hover:text-white">{t.footer.careers}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2">
                <li><Link href="/legal/privacy" className="hover:text-white">{t.footer.privacy}</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white">{t.footer.terms}</Link></li>
                <li><Link href="/legal/contact" className="hover:text-white">{t.footer.contact}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Status</h4>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span>All systems operational</span>
              </div>
              <Link 
                href="/api/health"
                className="text-sm hover:text-white"
              >
                API Health Check
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
