'use client'

import { useState } from 'react'
import Link from 'next/link'

// Inline SVG icons to avoid import issues
const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

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
            icon: '🎯',
            title: 'Smart Qualification',
            description: 'AI-powered BANT scoring with transparent explanations'
          },
          {
            icon: '💬',
            title: 'Personalized Messaging',
            description: 'Generate context-aware emails in French and English'
          },
          {
            icon: '📊',
            title: 'Visual Pipeline',
            description: 'Manage prospects with a Kanban-style CRM interface'
          },
          {
            icon: '📧',
            title: 'Email Sequences',
            description: 'Automate follow-ups with conditional logic'
          },
          {
            icon: '🤖',
            title: 'AI Insights',
            description: 'Get recommendations to improve your campaigns'
          },
          {
            icon: '📈',
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
            icon: '🎯',
            title: 'Qualification Intelligente',
            description: 'Scoring BANT par IA avec explications transparentes'
          },
          {
            icon: '💬',
            title: 'Messages Personnalisés',
            description: 'Générez des emails contextuels en français et anglais'
          },
          {
            icon: '📊',
            title: 'Pipeline Visuel',
            description: 'Gérez vos prospects avec un CRM style Kanban'
          },
          {
            icon: '📧',
            title: 'Séquences Email',
            description: 'Automatisez les relances avec logique conditionnelle'
          },
          {
            icon: '🤖',
            title: 'Insights IA',
            description: 'Recevez des recommandations pour améliorer vos campagnes'
          },
          {
            icon: '📈',
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
      <header className="sticky top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">🚀 AI Sales Agent</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t.footer.features}
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t.footer.pricing}
              </a>
              <Link href="/legal" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t.footer.legal}
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                {language === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
              </button>
              <Link 
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                {t.hero.login}
              </Link>
              <Link 
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t.hero.cta_primary}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-block mb-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              v1.0.0 - MVP Ready
            </div>
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
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                {t.hero.cta_primary}
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
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
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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
                className={`bg-white rounded-xl shadow-sm border-2 ${
                  plan.popular ? 'border-blue-500 scale-105' : 'border-gray-200'
                } p-8 hover:shadow-xl transition-all relative`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold">${plan.price_monthly}</span>
                  <span className="text-gray-600 ml-2">/{t.pricing.monthly.toLowerCase()}</span>
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
                  className={`block text-center py-3 px-6 rounded-lg font-medium transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg'
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

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Sales Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of companies using AI to accelerate their B2B sales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Get Started Free
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              href="/api/health"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Check API Status
            </Link>
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
                <li><a href="#features" className="hover:text-white transition-colors">{t.footer.features}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t.footer.pricing}</a></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">{t.footer.documentation}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">{t.footer.company}</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white transition-colors">{t.footer.about}</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">{t.footer.blog}</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">{t.footer.careers}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2">
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">{t.footer.terms}</Link></li>
                <li><Link href="/legal/contact" className="hover:text-white transition-colors">{t.footer.contact}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">System Status</h4>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-400">All systems operational</span>
              </div>
              <Link 
                href="/api/health"
                className="text-sm hover:text-white transition-colors inline-flex items-center"
              >
                API Health Check →
              </Link>
              <div className="mt-4">
                <Link
                  href="https://github.com/yoprobotics/ai-sales-agent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors inline-flex items-center"
                >
                  View on GitHub →
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="mb-2">{t.footer.copyright}</p>
            <p className="text-sm text-gray-500">
              Built with Next.js 14, TypeScript, Tailwind CSS, and ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
