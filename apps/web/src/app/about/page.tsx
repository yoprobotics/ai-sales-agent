'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function AboutPage() {
  const [lang, setLang] = useState('en')

  const content = {
    en: {
      title: 'About AI Sales Agent',
      subtitle: 'Transforming B2B Sales with AI',
      intro: 'AI Sales Agent is a cutting-edge B2B prospecting platform that combines artificial intelligence with proven sales methodologies to help businesses scale their outreach efforts.',
      mission: {
        title: 'Our Mission',
        content: 'To democratize access to advanced AI sales tools, enabling SMBs to compete with enterprise-level sales organizations through intelligent automation and insights.'
      },
      values: {
        title: 'Our Values',
        items: [
          {
            title: 'Customer Success',
            desc: 'Your success is our success. We\'re committed to helping you achieve your sales goals.'
          },
          {
            title: 'Innovation',
            desc: 'Constantly pushing the boundaries of what\'s possible with AI in sales.'
          },
          {
            title: 'Transparency',
            desc: 'Open about our processes, pricing, and AI decision-making.'
          },
          {
            title: 'Security',
            desc: 'Your data protection is our top priority with enterprise-grade security.'
          }
        ]
      },
      team: {
        title: 'Built by YoProbotics',
        content: 'We\'re a team of engineers, data scientists, and sales experts passionate about using AI to enhance human productivity in sales and marketing.'
      },
      cta: 'Start Your Free Trial'
    },
    fr: {
      title: 'À propos d\'AI Sales Agent',
      subtitle: 'Transformer les ventes B2B avec l\'IA',
      intro: 'AI Sales Agent est une plateforme de prospection B2B de pointe qui combine l\'intelligence artificielle avec des méthodologies de vente éprouvées.',
      mission: {
        title: 'Notre Mission',
        content: 'Démocratiser l\'accès aux outils de vente IA avancés, permettant aux PME de rivaliser avec les organisations de vente d\'entreprise.'
      },
      values: {
        title: 'Nos Valeurs',
        items: [
          {
            title: 'Succès Client',
            desc: 'Votre succès est notre succès. Nous nous engageons à vous aider à atteindre vos objectifs.'
          },
          {
            title: 'Innovation',
            desc: 'Repousser constamment les limites du possible avec l\'IA dans les ventes.'
          },
          {
            title: 'Transparence',
            desc: 'Ouvert sur nos processus, tarifs et prise de décision IA.'
          },
          {
            title: 'Sécurité',
            desc: 'La protection de vos données est notre priorité avec une sécurité de niveau entreprise.'
          }
        ]
      },
      team: {
        title: 'Créé par YoProbotics',
        content: 'Nous sommes une équipe d\'ingénieurs, de scientifiques des données et d\'experts en vente passionnés par l\'utilisation de l\'IA.'
      },
      cta: 'Commencer l\'Essai Gratuit'
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
          margin-bottom: 32px;
        }
        .intro {
          font-size: 20px;
          line-height: 1.8;
          color: #374151;
          margin-bottom: 48px;
        }
        .section {
          margin-bottom: 48px;
        }
        .section h2 {
          font-size: 32px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 24px;
        }
        .section p {
          font-size: 18px;
          line-height: 1.8;
          color: #374151;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }
        .value-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .value-card h3 {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 12px;
        }
        .value-card p {
          color: #6b7280;
          line-height: 1.6;
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
          .intro {
            font-size: 18px;
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
          <h2>{t.mission.title}</h2>
          <p>{t.mission.content}</p>
        </div>

        <div className="section">
          <h2>{t.values.title}</h2>
          <div className="values-grid">
            {t.values.items.map((value, index) => (
              <div key={index} className="value-card">
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>{t.team.title}</h2>
          <p>{t.team.content}</p>
        </div>

        <Link href="/register" className="cta-button">
          {t.cta} →
        </Link>
      </div>
    </div>
  )
}
