'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRightIcon, CheckIcon, SparklesIcon, ChartBarIcon, UsersIcon, EnvelopeIcon, GlobeAltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'AI-Powered Qualification',
    description: 'Automatically score and qualify prospects with transparent AI explanations',
    icon: SparklesIcon,
  },
  {
    name: 'Smart Email Sequences',
    description: 'Create personalized multi-step email campaigns with conditional logic',
    icon: EnvelopeIcon,
  },
  {
    name: 'Visual CRM Pipeline',
    description: 'Manage prospects through your sales pipeline with drag-and-drop simplicity',
    icon: ChartBarIcon,
  },
  {
    name: 'Multi-Language Support',
    description: 'Native French and English support for global B2B prospecting',
    icon: GlobeAltIcon,
  },
  {
    name: 'Team Collaboration',
    description: 'Work together with role-based access control and shared workspaces',
    icon: UsersIcon,
  },
  {
    name: 'Enterprise Security',
    description: 'GDPR, PIPEDA, and CCPA compliant with encryption and audit logs',
    icon: ShieldCheckIcon,
  },
]

const pricing = [
  {
    name: 'Starter',
    price: '$49',
    period: '/month',
    description: 'Perfect for small teams getting started',
    features: ['1 ICP', '200 prospects/month', '1 email sequence', 'Basic AI qualification', 'Email support'],
    cta: 'Start free trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$149',
    period: '/month',
    description: 'For growing sales teams',
    features: ['5 ICPs', '2,000 prospects/month', '10 email sequences', 'Advanced AI insights', 'Multi-channel outreach', 'Priority support'],
    cta: 'Start free trial',
    popular: true,
  },
  {
    name: 'Business',
    price: '$499',
    period: '/month',
    description: 'For enterprise sales organizations',
    features: ['Unlimited ICPs', 'Unlimited prospects', 'Unlimited sequences', 'CRM integrations', 'Custom AI models', 'Dedicated support', 'Team collaboration'],
    cta: 'Contact sales',
    popular: false,
  },
]

export default function HomePage() {
  const [language, setLanguage] = useState<'en' | 'fr'>('en')

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">AI Sales Agent</span>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                {language === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
              </button>
              <Link
                href="/login"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                {language === 'en' ? 'Sign In' : 'Connexion'}
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {language === 'en' ? 'Get Started' : 'Commencer'}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 animate-slide-up">
            {language === 'en' ? (
              <>Transform Your B2B Sales<br />with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI-Powered Prospecting</span></>
            ) : (
              <>Transformez Vos Ventes B2B<br />avec la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Prospection IA</span></>
            )}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto animate-fade-in">
            {language === 'en'
              ? 'Qualify prospects automatically, generate personalized messages, and manage your pipeline with AI-driven insights'
              : 'Qualifiez automatiquement vos prospects, générez des messages personnalisés et gérez votre pipeline avec des insights IA'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {language === 'en' ? 'Start Free Trial' : 'Essai Gratuit'}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {language === 'en' ? 'Watch Demo' : 'Voir la Démo'}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {language === 'en' ? 'Everything You Need to Scale B2B Sales' : 'Tout ce qu\'il faut pour développer vos ventes B2B'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {language === 'en' ? 'Powerful features designed for modern sales teams' : 'Des fonctionnalités puissantes conçues pour les équipes de vente modernes'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="p-6 rounded-lg border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {language === 'en' ? 'Simple, Transparent Pricing' : 'Tarification Simple et Transparente'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {language === 'en' ? 'Choose the plan that fits your needs' : 'Choisissez le plan qui correspond à vos besoins'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border ${plan.popular
                  ? 'border-blue-600 dark:border-blue-400 shadow-xl scale-105'
                  : 'border-slate-200 dark:border-slate-800'
                  } bg-white dark:bg-slate-900`}
              >
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                      {language === 'en' ? 'Most Popular' : 'Plus Populaire'}
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 ml-1">
                    {plan.period}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 px-4 rounded-md font-medium ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {language === 'en'
              ? 'Ready to Transform Your Sales Process?'
              : 'Prêt à Transformer Votre Processus de Vente?'}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {language === 'en'
              ? 'Join thousands of sales teams using AI to close more deals'
              : 'Rejoignez des milliers d\'équipes de vente utilisant l\'IA pour conclure plus de ventes'}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
          >
            {language === 'en' ? 'Start Your Free Trial' : 'Commencez Votre Essai Gratuit'}
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                {language === 'en' ? 'Product' : 'Produit'}
              </h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Pricing</Link></li>
                <li><Link href="/integrations" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                {language === 'en' ? 'Company' : 'Entreprise'}
              </h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">About</Link></li>
                <li><Link href="/blog" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                {language === 'en' ? 'Support' : 'Support'}
              </h3>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Documentation</Link></li>
                <li><Link href="/contact" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Contact</Link></li>
                <li><Link href="/status" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                {language === 'en' ? 'Legal' : 'Légal'}
              </h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Terms</Link></li>
                <li><Link href="/cookies" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              © 2024 YoProbotics. {language === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
