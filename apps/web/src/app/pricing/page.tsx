'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PricingPage() {
  const [lang, setLang] = useState('en')
  const [billing, setBilling] = useState('monthly')

  const plans = {
    en: [
      {
        name: 'Starter',
        monthly: 49,
        yearly: 490,
        features: [
          '1 ICP (Ideal Customer Profile)',
          '200 prospects per month',
          '1 email sequence',
          'Basic AI qualification',
          'Email support',
          'CSV import',
          'Basic analytics'
        ],
        cta: 'Start Free Trial',
        popular: false
      },
      {
        name: 'Pro',
        monthly: 149,
        yearly: 1490,
        features: [
          '5 ICPs',
          '2,000 prospects per month',
          '10 email sequences',
          'Advanced AI features',
          'Multi-channel outreach',
          'Priority support',
          'API access',
          'Custom integrations',
          'Advanced analytics'
        ],
        cta: 'Start Free Trial',
        popular: true
      },
      {
        name: 'Business',
        monthly: 499,
        yearly: 4990,
        features: [
          'Unlimited ICPs',
          'Unlimited prospects',
          'Unlimited sequences',
          'Enterprise AI features',
          'CRM integrations',
          'Custom AI models',
          'Dedicated support',
          'Custom branding',
          'Team collaboration',
          'Predictive analytics'
        ],
        cta: 'Contact Sales',
        popular: false
      }
    ],
    fr: [
      {
        name: 'Starter',
        monthly: 49,
        yearly: 490,
        features: [
          '1 ICP (Profil Client Idéal)',
          '200 prospects par mois',
          '1 séquence email',
          'Qualification IA de base',
          'Support email',
          'Import CSV',
          'Analyses de base'
        ],
        cta: 'Essai Gratuit',
        popular: false
      },
      {
        name: 'Pro',
        monthly: 149,
        yearly: 1490,
        features: [
          '5 ICPs',
          '2 000 prospects par mois',
          '10 séquences email',
          'Fonctionnalités IA avancées',
          'Approche multi-canal',
          'Support prioritaire',
          'Accès API',
          'Intégrations personnalisées',
          'Analyses avancées'
        ],
        cta: 'Essai Gratuit',
        popular: true
      },
      {
        name: 'Business',
        monthly: 499,
        yearly: 4990,
        features: [
          'ICPs illimités',
          'Prospects illimités',
          'Séquences illimitées',
          'IA entreprise',
          'Intégrations CRM',
          'Modèles IA personnalisés',
          'Support dédié',
          'Marque personnalisée',
          'Collaboration équipe',
          'Analyses prédictives'
        ],
        cta: 'Contacter les ventes',
        popular: false
      }
    ]
  }

  const currentPlans = plans[lang]

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 24px;
        }
        .back-link:hover {
          text-decoration: underline;
        }
        .lang-switcher {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }
        h1 {
          font-size: 48px;
          font-weight: bold;
          color: #111827;
          text-align: center;
          margin-bottom: 12px;
        }
        .subtitle {
          font-size: 20px;
          color: #6b7280;
          text-align: center;
          margin-bottom: 32px;
        }
        .billing-toggle {
          display: flex;
          justify-content: center;
          margin-bottom: 48px;
        }
        .toggle-button {
          padding: 12px 24px;
          background: white;
          border: 2px solid #e5e7eb;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        .toggle-button:first-child {
          border-radius: 8px 0 0 8px;
        }
        .toggle-button:last-child {
          border-radius: 0 8px 8px 0;
        }
        .toggle-button.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }
        .plan-card {
          position: relative;
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.3s;
        }
        .plan-card.popular {
          transform: scale(1.05);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
          border: 2px solid #2563eb;
        }
        .popular-badge {
          position: absolute;
          top: -12px;
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
          color: #111827;
          margin-bottom: 16px;
        }
        .plan-price {
          font-size: 48px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 8px;
        }
        .plan-price span {
          font-size: 20px;
          color: #6b7280;
        }
        .plan-period {
          color: #6b7280;
          margin-bottom: 32px;
        }
        .plan-features {
          list-style: none;
          margin-bottom: 32px;
        }
        .plan-features li {
          padding: 8px 0;
          display: flex;
          align-items: flex-start;
          color: #374151;
        }
        .plan-features li:before {
          content: '✓';
          margin-right: 12px;
          color: #10b981;
          font-weight: bold;
        }
        .plan-cta {
          width: 100%;
          padding: 14px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          display: block;
          transition: background 0.2s;
        }
        .plan-cta:hover {
          background: #1d4ed8;
        }
        .plan-card.popular .plan-cta {
          background: #111827;
        }
        .plan-card.popular .plan-cta:hover {
          background: #000;
        }
        @media (max-width: 768px) {
          h1 {
            font-size: 36px;
          }
          .plans-grid {
            grid-template-columns: 1fr;
          }
          .plan-card.popular {
            transform: none;
          }
        }
      `}</style>

      <button onClick={() => setLang(lang === 'en' ? 'fr' : 'en')} className="lang-switcher">
        {lang === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
      </button>

      <div className="container">
        <Link href="/" className="back-link">
          ← {lang === 'en' ? 'Back to Home' : 'Retour à l\'accueil'}
        </Link>
        
        <h1>
          {lang === 'en' ? 'Choose Your Plan' : 'Choisissez Votre Plan'}
        </h1>
        <p className="subtitle">
          {lang === 'en' 
            ? 'Start with a 14-day free trial. No credit card required.'
            : 'Commencez avec un essai gratuit de 14 jours. Sans carte de crédit.'}
        </p>
        
        <div className="billing-toggle">
          <button
            className={`toggle-button ${billing === 'monthly' ? 'active' : ''}`}
            onClick={() => setBilling('monthly')}
          >
            {lang === 'en' ? 'Monthly' : 'Mensuel'}
          </button>
          <button
            className={`toggle-button ${billing === 'yearly' ? 'active' : ''}`}
            onClick={() => setBilling('yearly')}
          >
            {lang === 'en' ? 'Yearly (Save 17%)' : 'Annuel (Économisez 17%)'}
          </button>
        </div>
        
        <div className="plans-grid">
          {currentPlans.map((plan, index) => (
            <div key={index} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && (
                <span className="popular-badge">
                  {lang === 'en' ? 'MOST POPULAR' : 'LE PLUS POPULAIRE'}
                </span>
              )}
              
              <h2 className="plan-name">{plan.name}</h2>
              <div className="plan-price">
                ${billing === 'monthly' ? plan.monthly : plan.yearly}
                <span>/{lang === 'en' ? (billing === 'monthly' ? 'mo' : 'yr') : (billing === 'monthly' ? 'mois' : 'an')}</span>
              </div>
              <div className="plan-period">
                {lang === 'en' 
                  ? (billing === 'yearly' ? 'Billed annually' : 'Billed monthly')
                  : (billing === 'yearly' ? 'Facturé annuellement' : 'Facturé mensuellement')}
              </div>
              
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              
              <Link href="/register" className="plan-cta">
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}