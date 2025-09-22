'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { 
  SparklesIcon, 
  ChartBarIcon, 
  EnvelopeIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid'

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Qualification',
      titleFr: 'Qualification par IA',
      description: 'BANT scoring with transparent explanations',
      descriptionFr: 'Score BANT avec explications transparentes',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: EnvelopeIcon,
      title: 'Personalized Messaging',
      titleFr: 'Messages Personnalisés',
      description: 'Generate emails in French and English',
      descriptionFr: 'Générez des emails en français et anglais',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: ChartBarIcon,
      title: 'Visual CRM Pipeline',
      titleFr: 'Pipeline CRM Visuel',
      description: 'Kanban-style prospect management',
      descriptionFr: 'Gestion des prospects style Kanban',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: UserGroupIcon,
      title: 'ICP Definition',
      titleFr: 'Définition ICP',
      description: 'Define your ideal customer profile',
      descriptionFr: 'Définissez votre profil client idéal',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      icon: GlobeAltIcon,
      title: 'Multi-Region Compliance',
      titleFr: 'Conformité Multi-Régions',
      description: 'GDPR, PIPEDA, CCPA compliant',
      descriptionFr: 'Conforme RGPD, PIPEDA, CCPA',
      color: 'text-indigo-600 bg-indigo-100'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Enterprise Security',
      titleFr: 'Sécurité Enterprise',
      description: 'Bank-level encryption and security',
      descriptionFr: 'Chiffrement et sécurité bancaire',
      color: 'text-red-600 bg-red-100'
    }
  ]

  const plans = [
    {
      name: 'Starter',
      price: '$49',
      priceFr: '49$',
      features: [
        '1 ICP (Ideal Customer Profile)',
        '200 prospects/month',
        '1 email sequence',
        'Basic AI qualification',
        'Email support'
      ],
      featuresFr: [
        '1 ICP (Profil Client Idéal)',
        '200 prospects/mois',
        '1 séquence email',
        'Qualification IA de base',
        'Support email'
      ],
      cta: 'Start Free Trial',
      ctaFr: 'Essai Gratuit',
      popular: false
    },
    {
      name: 'Pro',
      price: '$149',
      priceFr: '149$',
      features: [
        '5 ICPs',
        '2,000 prospects/month',
        'Multi-channel sequences',
        'Advanced AI features',
        'Priority support',
        'Keyword watching'
      ],
      featuresFr: [
        '5 ICPs',
        '2 000 prospects/mois',
        'Séquences multi-canal',
        'Fonctions IA avancées',
        'Support prioritaire',
        'Veille mots-clés'
      ],
      cta: 'Start Free Trial',
      ctaFr: 'Essai Gratuit',
      popular: true
    },
    {
      name: 'Business',
      price: '$499',
      priceFr: '499$',
      features: [
        'Unlimited ICPs',
        'Unlimited prospects',
        'CRM integrations',
        'Predictive analytics',
        'Custom branding',
        'Dedicated support',
        'API access'
      ],
      featuresFr: [
        'ICPs illimités',
        'Prospects illimités',
        'Intégrations CRM',
        'Analyses prédictives',
        'Marque personnalisée',
        'Support dédié',
        'Accès API'
      ],
      cta: 'Contact Sales',
      ctaFr: 'Contactez-nous',
      popular: false
    }
  ]

  const [lang, setLang] = useState('en')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl">🚀</span>
              <span className="ml-2 text-xl font-bold text-gray-900">AI Sales Agent</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {lang === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
              </button>
              
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {lang === 'en' ? 'Dashboard' : 'Tableau de bord'}
                </Link>
              ) : (
                <div className="flex space-x-3">
                  <Link
                    href="/login"
                    className="text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    {lang === 'en' ? 'Login' : 'Connexion'}
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {lang === 'en' ? 'Start Free Trial' : 'Essai Gratuit'}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {lang === 'en' 
              ? 'AI-Powered B2B Prospecting' 
              : 'Prospection B2B par IA'}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {lang === 'en'
              ? 'Qualify leads, generate personalized messages, and manage your pipeline with AI - all in one platform.'
              : 'Qualifiez vos prospects, générez des messages personnalisés et gérez votre pipeline avec l\'IA - tout en une plateforme.'}
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition flex items-center"
            >
              {lang === 'en' ? 'Start 14-Day Free Trial' : 'Essai Gratuit 14 Jours'}
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#demo"
              className="bg-white text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition"
            >
              {lang === 'en' ? 'Watch Demo' : 'Voir la Démo'}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {lang === 'en' ? 'Everything You Need to Scale' : 'Tout Pour Développer Vos Ventes'}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
                <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {lang === 'en' ? feature.title : feature.titleFr}
                </h3>
                <p className="text-gray-600">
                  {lang === 'en' ? feature.description : feature.descriptionFr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            {lang === 'en' ? 'Simple, Transparent Pricing' : 'Tarification Simple et Transparente'}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {lang === 'en' 
              ? 'Choose the plan that fits your business needs'
              : 'Choisissez le plan adapté à vos besoins'}
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative rounded-xl p-8 ${
                  plan.popular 
                    ? 'bg-blue-600 text-white shadow-2xl scale-105' 
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {lang === 'en' ? 'MOST POPULAR' : 'LE PLUS POPULAIRE'}
                  </span>
                )}
                
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className={`text-4xl font-bold mb-6 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {lang === 'en' ? plan.price : plan.priceFr}
                  <span className={`text-lg font-normal ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                    /{lang === 'en' ? 'month' : 'mois'}
                  </span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {(lang === 'en' ? plan.features : plan.featuresFr).map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircleIcon className={`h-5 w-5 mr-2 mt-0.5 ${plan.popular ? 'text-blue-200' : 'text-green-500'}`} />
                      <span className={plan.popular ? 'text-white' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href="/register"
                  className={`block text-center py-3 px-6 rounded-lg font-medium transition ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {lang === 'en' ? plan.cta : plan.ctaFr}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {lang === 'en' 
              ? 'Ready to Transform Your Sales Process?'
              : 'Prêt à Transformer Votre Processus de Vente?'}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {lang === 'en'
              ? 'Join thousands of businesses using AI to scale their B2B sales'
              : 'Rejoignez des milliers d\'entreprises utilisant l\'IA pour développer leurs ventes B2B'}
          </p>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition inline-flex items-center"
          >
            {lang === 'en' ? 'Start Your Free Trial' : 'Commencer Votre Essai Gratuit'}
            <ChevronRightIcon className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            {lang === 'en' 
              ? 'No credit card required • 14-day free trial • Cancel anytime'
              : 'Sans carte de crédit • Essai de 14 jours • Annulez à tout moment'}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-2xl">🚀</span>
              <span className="ml-2 text-xl font-bold">AI Sales Agent</span>
            </div>
            <p className="text-gray-400">
              {lang === 'en' 
                ? 'AI-powered B2B prospecting platform'
                : 'Plateforme de prospection B2B par IA'}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{lang === 'en' ? 'Product' : 'Produit'}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/features" className="hover:text-white">
                {lang === 'en' ? 'Features' : 'Fonctionnalités'}
              </Link></li>
              <li><Link href="/pricing" className="hover:text-white">
                {lang === 'en' ? 'Pricing' : 'Tarifs'}
              </Link></li>
              <li><Link href="/integrations" className="hover:text-white">
                {lang === 'en' ? 'Integrations' : 'Intégrations'}
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{lang === 'en' ? 'Company' : 'Entreprise'}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">
                {lang === 'en' ? 'About' : 'À propos'}
              </Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-white">
                {lang === 'en' ? 'Careers' : 'Carrières'}
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">{lang === 'en' ? 'Legal' : 'Légal'}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white">
                {lang === 'en' ? 'Privacy Policy' : 'Confidentialité'}
              </Link></li>
              <li><Link href="/terms" className="hover:text-white">
                {lang === 'en' ? 'Terms' : 'Conditions'}
              </Link></li>
              <li><Link href="/security" className="hover:text-white">
                {lang === 'en' ? 'Security' : 'Sécurité'}
              </Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2025 YoProbotics. {lang === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}</p>
        </div>
      </footer>
    </div>
  )
}
