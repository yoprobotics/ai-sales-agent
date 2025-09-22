'use client'

import Link from 'next/link'
import { useState } from 'react'

type Language = 'en' | 'fr'

export default function CareersPage() {
  const [lang, setLang] = useState<Language>('en')

  const content = {
    en: {
      title: 'Join Our Team',
      subtitle: 'Help us transform B2B sales with AI',
      intro: 'We\'re building the future of sales automation and looking for talented individuals to join our mission.',
      positions: [
        {
          title: 'Senior Full Stack Engineer',
          location: 'Remote',
          type: 'Full-time',
          description: 'Build and scale our AI-powered sales platform using Next.js, TypeScript, and Python.'
        },
        {
          title: 'AI/ML Engineer',
          location: 'Remote',
          type: 'Full-time',
          description: 'Develop and improve our AI models for prospect qualification and message generation.'
        },
        {
          title: 'Customer Success Manager',
          location: 'Remote',
          type: 'Full-time',
          description: 'Help our customers achieve their sales goals and provide exceptional support.'
        }
      ],
      benefits: {
        title: 'Benefits & Perks',
        items: [
          'Competitive salary and equity',
          'Fully remote work',
          'Flexible hours',
          'Health, dental, and vision insurance',
          'Learning & development budget',
          'Annual company retreats'
        ]
      },
      cta: 'View Open Positions'
    },
    fr: {
      title: 'Rejoignez Notre Équipe',
      subtitle: 'Aidez-nous à transformer les ventes B2B avec l\'IA',
      intro: 'Nous construisons l\'avenir de l\'automatisation des ventes et recherchons des talents pour rejoindre notre mission.',
      positions: [
        {
          title: 'Ingénieur Full Stack Senior',
          location: 'Télétravail',
          type: 'Temps plein',
          description: 'Construire et faire évoluer notre plateforme de vente alimentée par l\'IA.'
        },
        {
          title: 'Ingénieur IA/ML',
          location: 'Télétravail',
          type: 'Temps plein',
          description: 'Développer et améliorer nos modèles IA pour la qualification et la génération de messages.'
        },
        {
          title: 'Responsable Succès Client',
          location: 'Télétravail',
          type: 'Temps plein',
          description: 'Aider nos clients à atteindre leurs objectifs de vente et fournir un support exceptionnel.'
        }
      ],
      benefits: {
        title: 'Avantages et Bénéfices',
        items: [
          'Salaire compétitif et actions',
          'Travail entièrement à distance',
          'Horaires flexibles',
          'Assurance santé complète',
          'Budget formation et développement',
          'Retraites d\'entreprise annuelles'
        ]
      },
      cta: 'Voir les Postes Ouverts'
    }
  }

  const t = content[lang]

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <style jsx>{`
        .container {
          max-width: 1000px;
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
          margin-bottom: 12px;
        }
        .subtitle {
          font-size: 24px;
          color: #2563eb;
          margin-bottom: 16px;
        }
        .intro {
          font-size: 18px;
          color: #6b7280;
          margin-bottom: 48px;
        }
        .section {
          margin-bottom: 48px;
        }
        .section-title {
          font-size: 28px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 24px;
        }
        .positions-list {
          display: grid;
          gap: 24px;
        }
        .position-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.3s;
          cursor: pointer;
        }
        .position-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }
        .position-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }
        .position-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
        }
        .position-meta span {
          color: #6b7280;
          font-size: 14px;
        }
        .position-desc {
          color: #374151;
          line-height: 1.6;
        }
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .benefit-item {
          display: flex;
          align-items: flex-start;
          color: #374151;
        }
        .benefit-item:before {
          content: '✅';
          margin-right: 12px;
          flex-shrink: 0;
        }
        .cta-button {
          display: inline-block;
          margin-top: 32px;
          padding: 16px 32px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 18px;
          transition: background 0.2s;
        }
        .cta-button:hover {
          background: #1d4ed8;
        }
        @media (max-width: 768px) {
          h1 {
            font-size: 36px;
          }
          .subtitle {
            font-size: 20px;
          }
          .benefits-grid {
            grid-template-columns: 1fr;
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
        
        <h1>{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>
        <p className="intro">{t.intro}</p>
        
        <div className="section">
          <h2 className="section-title">
            {lang === 'en' ? 'Open Positions' : 'Postes Ouverts'}
          </h2>
          <div className="positions-list">
            {t.positions.map((position, index) => (
              <div key={index} className="position-card">
                <h3 className="position-title">{position.title}</h3>
                <div className="position-meta">
                  <span>📍 {position.location}</span>
                  <span>⏰ {position.type}</span>
                </div>
                <p className="position-desc">{position.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="section">
          <h2 className="section-title">{t.benefits.title}</h2>
          <div className="benefits-grid">
            {t.benefits.items.map((benefit, index) => (
              <div key={index} className="benefit-item">
                {benefit}
              </div>
            ))}
          </div>
        </div>
        
        <Link href="/contact" className="cta-button">
          {t.cta} →
        </Link>
      </div>
    </div>
  )
}