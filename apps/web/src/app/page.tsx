'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [lang, setLang] = useState('en')

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const features = [
    {
      icon: '✨',
      title: 'AI-Powered Qualification',
      titleFr: 'Qualification par IA',
      description: 'BANT scoring with transparent explanations',
      descriptionFr: 'Score BANT avec explications transparentes',
    },
    {
      icon: '✉️',
      title: 'Personalized Messaging',
      titleFr: 'Messages Personnalisés',
      description: 'Generate emails in French and English',
      descriptionFr: 'Générez des emails en français et anglais',
    },
    {
      icon: '📊',
      title: 'Visual CRM Pipeline',
      titleFr: 'Pipeline CRM Visuel',
      description: 'Kanban-style prospect management',
      descriptionFr: 'Gestion des prospects style Kanban',
    },
    {
      icon: '👥',
      title: 'ICP Definition',
      titleFr: 'Définition ICP',
      description: 'Define your ideal customer profile',
      descriptionFr: 'Définissez votre profil client idéal',
    },
    {
      icon: '🌍',
      title: 'Multi-Region Compliance',
      titleFr: 'Conformité Multi-Régions',
      description: 'GDPR, PIPEDA, CCPA compliant',
      descriptionFr: 'Conforme RGPD, PIPEDA, CCPA',
    },
    {
      icon: '🔐',
      title: 'Enterprise Security',
      titleFr: 'Sécurité Enterprise',
      description: 'Bank-level encryption and security',
      descriptionFr: 'Chiffrement et sécurité bancaire',
    },
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
        'Email support',
      ],
      featuresFr: [
        '1 ICP (Profil Client Idéal)',
        '200 prospects/mois',
        '1 séquence email',
        'Qualification IA de base',
        'Support email',
      ],
      cta: 'Start Free Trial',
      ctaFr: 'Essai Gratuit',
      popular: false,
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
        'Keyword watching',
      ],
      featuresFr: [
        '5 ICPs',
        '2 000 prospects/mois',
        'Séquences multi-canal',
        'Fonctions IA avancées',
        'Support prioritaire',
        'Veille mots-clés',
      ],
      cta: 'Start Free Trial',
      ctaFr: 'Essai Gratuit',
      popular: true,
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
        'API access',
      ],
      featuresFr: [
        'ICPs illimités',
        'Prospects illimités',
        'Intégrations CRM',
        'Analyses prédictives',
        'Marque personnalisée',
        'Support dédié',
        'Accès API',
      ],
      cta: 'Contact Sales',
      ctaFr: 'Contactez-nous',
      popular: false,
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)' }}>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .nav {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 0;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
          font-size: 20px;
          font-weight: bold;
          color: #111827;
        }
        .nav-buttons {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .btn {
          padding: 8px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          font-size: 14px;
        }
        .btn-primary {
          background: #2563eb;
          color: white;
        }
        .btn-primary:hover {
          background: #1d4ed8;
        }
        .btn-secondary {
          background: transparent;
          color: #374151;
        }
        .btn-secondary:hover {
          background: #f3f4f6;
        }
        .hero {
          padding: 80px 0 64px;
          text-align: center;
        }
        .hero h1 {
          font-size: 48px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 24px;
          line-height: 1.2;
        }
        .hero p {
          font-size: 20px;
          color: #6b7280;
          margin-bottom: 32px;
          max-width: 768px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .btn-lg {
          padding: 16px 32px;
          font-size: 18px;
        }
        .features-section {
          padding: 64px 0;
        }
        .section-title {
          text-align: center;
          font-size: 30px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 48px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
        }
        .feature-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          transition: all 0.3s;
        }
        .feature-card:hover {
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          transform: translateY(-4px);
        }
        .feature-icon {
          font-size: 32px;
          margin-bottom: 16px;
        }
        .feature-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #111827;
        }
        .feature-desc {
          color: #6b7280;
          line-height: 1.5;
        }
        .pricing-section {
          padding: 64px 0;
          background: white;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
          margin-top: 48px;
        }
        .pricing-card {
          position: relative;
          border-radius: 12px;
          padding: 32px;
          transition: all 0.3s;
        }
        .pricing-card.standard {
          background: white;
          border: 2px solid #e5e7eb;
        }
        .pricing-card.popular {
          background: #2563eb;
          color: white;
          transform: scale(1.05);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.3);
        }
        .popular-badge {
          position: absolute;
          top: -16px;
          left: 50%;
          transform: translateX(-50%);
          background: #f97316;
          color: white;
          padding: 4px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .plan-name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .plan-price {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 24px;
        }
        .plan-price span {
          font-size: 18px;
          font-weight: normal;
          opacity: 0.8;
        }
        .plan-features {
          list-style: none;
          margin-bottom: 32px;
        }
        .plan-features li {
          padding: 8px 0;
          display: flex;
          align-items: flex-start;
        }
        .plan-features li:before {
          content: '✓';
          margin-right: 8px;
          color: #10b981;
          font-weight: bold;
        }
        .pricing-card.popular .plan-features li:before {
          color: #a5f3fc;
        }
        .cta-section {
          padding: 80px 0;
          text-align: center;
        }
        .cta-title {
          font-size: 30px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 16px;
        }
        .cta-desc {
          font-size: 20px;
          color: #6b7280;
          margin-bottom: 32px;
        }
        .cta-note {
          margin-top: 16px;
          font-size: 14px;
          color: #9ca3af;
        }
        .footer {
          background: #111827;
          color: white;
          padding: 48px 0;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 32px;
          margin-bottom: 32px;
        }
        .footer-section h4 {
          margin-bottom: 16px;
          font-size: 16px;
          font-weight: 600;
        }
        .footer-links {
          list-style: none;
        }
        .footer-links li {
          margin-bottom: 8px;
        }
        .footer-links a {
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links a:hover {
          color: white;
        }
        .footer-bottom {
          border-top: 1px solid #374151;
          padding-top: 32px;
          text-align: center;
          color: #9ca3af;
        }
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 36px;
          }
          .hero p {
            font-size: 18px;
          }
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          .features-grid,
          .pricing-grid {
            grid-template-columns: 1fr;
          }
          .pricing-card.popular {
            transform: none;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <span style={{ marginRight: '8px' }}>🚀</span>
              AI Sales Agent
            </div>
            
            <div className="nav-buttons">
              <button
                onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
                className="btn btn-secondary"
              >
                {lang === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
              </button>
              
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn btn-primary">
                  {lang === 'en' ? 'Dashboard' : 'Tableau de bord'}
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn btn-secondary">
                    {lang === 'en' ? 'Login' : 'Connexion'}
                  </Link>
                  <Link href="/register" className="btn btn-primary">
                    {lang === 'en' ? 'Start Free Trial' : 'Essai Gratuit'}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>
            {lang === 'en' 
              ? 'AI-Powered B2B Prospecting' 
              : 'Prospection B2B par IA'}
          </h1>
          <p>
            {lang === 'en'
              ? 'Qualify leads, generate personalized messages, and manage your pipeline with AI - all in one platform.'
              : 'Qualifiez vos prospects, générez des messages personnalisés et gérez votre pipeline avec l\'IA - tout en une plateforme.'}
          </p>
          <div className="hero-buttons">
            <Link href="/register" className="btn btn-primary btn-lg">
              {lang === 'en' ? 'Start 14-Day Free Trial →' : 'Essai Gratuit 14 Jours →'}
            </Link>
            <Link href="#demo" className="btn btn-secondary btn-lg">
              {lang === 'en' ? 'Watch Demo' : 'Voir la Démo'}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">
            {lang === 'en' ? 'Everything You Need to Scale' : 'Tout Pour Développer Vos Ventes'}
          </h2>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">
                  {lang === 'en' ? feature.title : feature.titleFr}
                </h3>
                <p className="feature-desc">
                  {lang === 'en' ? feature.description : feature.descriptionFr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-section">
        <div className="container">
          <h2 className="section-title">
            {lang === 'en' ? 'Simple, Transparent Pricing' : 'Tarification Simple et Transparente'}
          </h2>
          
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`pricing-card ${plan.popular ? 'popular' : 'standard'}`}
              >
                {plan.popular && (
                  <span className="popular-badge">
                    {lang === 'en' ? 'MOST POPULAR' : 'LE PLUS POPULAIRE'}
                  </span>
                )}
                
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  {lang === 'en' ? plan.price : plan.priceFr}
                  <span>/{lang === 'en' ? 'month' : 'mois'}</span>
                </div>
                
                <ul className="plan-features">
                  {(lang === 'en' ? plan.features : plan.featuresFr).map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                
                <Link
                  href="/register"
                  className="btn btn-primary"
                  style={{ 
                    width: '100%', 
                    textAlign: 'center',
                    background: plan.popular ? 'white' : '#2563eb',
                    color: plan.popular ? '#2563eb' : 'white'
                  }}
                >
                  {lang === 'en' ? plan.cta : plan.ctaFr}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">
            {lang === 'en' 
              ? 'Ready to Transform Your Sales Process?'
              : 'Prêt à Transformer Votre Processus de Vente?'}
          </h2>
          <p className="cta-desc">
            {lang === 'en'
              ? 'Join thousands of businesses using AI to scale their B2B sales'
              : 'Rejoignez des milliers d\'entreprises utilisant l\'IA pour développer leurs ventes B2B'}
          </p>
          <Link href="/register" className="btn btn-primary btn-lg">
            {lang === 'en' ? 'Start Your Free Trial →' : 'Commencer Votre Essai Gratuit →'}
          </Link>
          <p className="cta-note">
            {lang === 'en' 
              ? 'No credit card required • 14-day free trial • Cancel anytime'
              : 'Sans carte de crédit • Essai de 14 jours • Annulez à tout moment'}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '24px', marginRight: '8px' }}>🚀</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>AI Sales Agent</span>
              </div>
              <p style={{ color: '#9ca3af' }}>
                {lang === 'en' 
                  ? 'AI-powered B2B prospecting platform'
                  : 'Plateforme de prospection B2B par IA'}
              </p>
            </div>
            
            <div className="footer-section">
              <h4>{lang === 'en' ? 'Product' : 'Produit'}</h4>
              <ul className="footer-links">
                <li><Link href="/features">{lang === 'en' ? 'Features' : 'Fonctionnalités'}</Link></li>
                <li><Link href="/pricing">{lang === 'en' ? 'Pricing' : 'Tarifs'}</Link></li>
                <li><Link href="/integrations">{lang === 'en' ? 'Integrations' : 'Intégrations'}</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>{lang === 'en' ? 'Company' : 'Entreprise'}</h4>
              <ul className="footer-links">
                <li><Link href="/about">{lang === 'en' ? 'About' : 'À propos'}</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/careers">{lang === 'en' ? 'Careers' : 'Carrières'}</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>{lang === 'en' ? 'Legal' : 'Légal'}</h4>
              <ul className="footer-links">
                <li><Link href="/privacy">{lang === 'en' ? 'Privacy Policy' : 'Confidentialité'}</Link></li>
                <li><Link href="/terms">{lang === 'en' ? 'Terms' : 'Conditions'}</Link></li>
                <li><Link href="/security">{lang === 'en' ? 'Security' : 'Sécurité'}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2025 YoProbotics. {lang === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
