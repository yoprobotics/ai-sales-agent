'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function FeaturesPage() {
  const [lang, setLang] = useState('en')

  const features = {
    en: [
      {
        category: 'AI-Powered Prospecting',
        items: [
          {
            title: 'BANT Qualification',
            desc: 'Automatically score prospects based on Budget, Authority, Need, and Timing'
          },
          {
            title: 'Transparent Explanations',
            desc: 'Understand exactly why each prospect received their qualification score'
          },
          {
            title: 'Signal Detection',
            desc: 'Identify buying signals and intent from prospect behavior and data'
          }
        ]
      },
      {
        category: 'Intelligent Messaging',
        items: [
          {
            title: 'Personalized Email Generation',
            desc: 'AI creates unique, contextual messages for each prospect'
          },
          {
            title: 'Multi-Language Support',
            desc: 'Generate messages in English and French with native fluency'
          },
          {
            title: 'Tone Adaptation',
            desc: 'Adjust messaging tone based on industry and prospect profile'
          }
        ]
      },
      {
        category: 'CRM & Pipeline',
        items: [
          {
            title: 'Visual Pipeline Management',
            desc: 'Kanban-style board to track prospects through your sales process'
          },
          {
            title: 'Automated Follow-ups',
            desc: 'Never miss a follow-up with intelligent reminder system'
          },
          {
            title: 'Activity Tracking',
            desc: 'Log calls, meetings, and interactions automatically'
          }
        ]
      }
    ],
    fr: [
      {
        category: 'Prospection par IA',
        items: [
          {
            title: 'Qualification BANT',
            desc: 'Notation automatique basée sur Budget, Autorité, Besoin et Timing'
          },
          {
            title: 'Explications Transparentes',
            desc: 'Comprenez exactement pourquoi chaque prospect a reçu son score'
          },
          {
            title: 'Détection de Signaux',
            desc: "Identifiez les signaux d'achat et l'intention des prospects"
          }
        ]
      },
      {
        category: 'Messages Intelligents',
        items: [
          {
            title: "Génération d'Emails Personnalisés",
            desc: "L'IA crée des messages uniques et contextuels pour chaque prospect"
          },
          {
            title: 'Support Multi-Langues',
            desc: 'Générez des messages en anglais et français avec fluidité native'
          },
          {
            title: 'Adaptation du Ton',
            desc: "Ajustez le ton selon l'industrie et le profil du prospect"
          }
        ]
      },
      {
        category: 'CRM & Pipeline',
        items: [
          {
            title: 'Gestion Visuelle du Pipeline',
            desc: 'Tableau Kanban pour suivre les prospects dans votre processus'
          },
          {
            title: 'Suivis Automatisés',
            desc: 'Ne manquez jamais un suivi avec le système de rappels intelligent'
          },
          {
            title: "Suivi d'Activités",
            desc: 'Enregistrez appels, réunions et interactions automatiquement'
          }
        ]
      }
    ]
  }

  const t = features[lang]

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
          margin-bottom: 64px;
        }
        .features-section {
          margin-bottom: 64px;
        }
        .category-title {
          font-size: 32px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 32px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }
        .feature-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .feature-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 12px;
        }
        .feature-desc {
          color: #6b7280;
          line-height: 1.6;
        }
        .cta-section {
          text-align: center;
          margin-top: 64px;
        }
        .cta-button {
          display: inline-block;
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
          .category-title {
            font-size: 24px;
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
          {lang === 'en' ? 'Powerful Features for B2B Sales' : 'Fonctionnalités Puissantes pour Ventes B2B'}
        </h1>
        <p className="subtitle">
          {lang === 'en' 
            ? 'Everything you need to scale your B2B prospecting'
            : 'Tout ce dont vous avez besoin pour développer votre prospection B2B'}
        </p>
        
        {t.map((section, sectionIndex) => (
          <div key={sectionIndex} className="features-section">
            <h2 className="category-title">{section.category}</h2>
            <div className="features-grid">
              {section.items.map((feature, index) => (
                <div key={index} className="feature-card">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="cta-section">
          <Link href="/register" className="cta-button">
            {lang === 'en' ? 'Start Your Free Trial →' : 'Commencer Votre Essai Gratuit →'}
          </Link>
        </div>
      </div>
    </div>
  )
}