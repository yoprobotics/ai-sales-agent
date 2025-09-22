'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function IntegrationsPage() {
  const [lang, setLang] = useState('en')

  const integrations = {
    en: [
      {
        name: 'HubSpot',
        category: 'CRM',
        description: 'Sync prospects and activities with HubSpot CRM',
        status: 'Available',
        icon: '🔗'
      },
      {
        name: 'Salesforce',
        category: 'CRM',
        description: 'Two-way sync with Salesforce leads and opportunities',
        status: 'Available',
        icon: '☁️'
      },
      {
        name: 'Gmail',
        category: 'Email',
        description: 'Send emails and sync conversations with Gmail',
        status: 'Available',
        icon: '📧'
      },
      {
        name: 'Outlook',
        category: 'Email',
        description: 'Connect with Microsoft Outlook for email automation',
        status: 'Available',
        icon: '📨'
      },
      {
        name: 'Slack',
        category: 'Communication',
        description: 'Get notifications and updates in Slack',
        status: 'Available',
        icon: '💬'
      },
      {
        name: 'Zapier',
        category: 'Automation',
        description: 'Connect with 5000+ apps through Zapier',
        status: 'Available',
        icon: '⚡'
      },
      {
        name: 'LinkedIn Sales Navigator',
        category: 'Prospecting',
        description: 'Import leads from LinkedIn Sales Navigator',
        status: 'Coming Soon',
        icon: '💼'
      },
      {
        name: 'Clearbit',
        category: 'Data Enrichment',
        description: 'Enrich prospect data with Clearbit',
        status: 'Coming Soon',
        icon: '🔍'
      }
    ],
    fr: [
      {
        name: 'HubSpot',
        category: 'CRM',
        description: 'Synchronisez prospects et activités avec HubSpot CRM',
        status: 'Disponible',
        icon: '🔗'
      },
      {
        name: 'Salesforce',
        category: 'CRM',
        description: 'Synchronisation bidirectionnelle avec Salesforce',
        status: 'Disponible',
        icon: '☁️'
      },
      {
        name: 'Gmail',
        category: 'Email',
        description: 'Envoyez des emails et synchronisez avec Gmail',
        status: 'Disponible',
        icon: '📧'
      },
      {
        name: 'Outlook',
        category: 'Email',
        description: 'Connectez-vous à Microsoft Outlook',
        status: 'Disponible',
        icon: '📨'
      },
      {
        name: 'Slack',
        category: 'Communication',
        description: 'Recevez des notifications dans Slack',
        status: 'Disponible',
        icon: '💬'
      },
      {
        name: 'Zapier',
        category: 'Automatisation',
        description: 'Connectez 5000+ applications via Zapier',
        status: 'Disponible',
        icon: '⚡'
      },
      {
        name: 'LinkedIn Sales Navigator',
        category: 'Prospection',
        description: 'Importez des leads depuis LinkedIn Sales Navigator',
        status: 'Bientôt',
        icon: '💼'
      },
      {
        name: 'Clearbit',
        category: 'Enrichissement',
        description: 'Enrichissez les données avec Clearbit',
        status: 'Bientôt',
        icon: '🔍'
      }
    ]
  }

  const t = integrations[lang]

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
          margin-bottom: 48px;
        }
        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .integration-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.3s;
        }
        .integration-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .integration-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .integration-icon {
          font-size: 32px;
        }
        .integration-status {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .status-available {
          background: #d1fae5;
          color: #065f46;
        }
        .status-coming {
          background: #fed7aa;
          color: #9a3412;
        }
        .integration-name {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }
        .integration-category {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 12px;
        }
        .integration-desc {
          color: #374151;
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
          .integrations-grid {
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
        
        <h1>
          {lang === 'en' ? 'Integrations' : 'Intégrations'}
        </h1>
        <p className="subtitle">
          {lang === 'en' 
            ? 'Connect AI Sales Agent with your favorite tools'
            : 'Connectez AI Sales Agent avec vos outils préférés'}
        </p>
        
        <div className="integrations-grid">
          {t.map((integration, index) => (
            <div key={index} className="integration-card">
              <div className="integration-header">
                <span className="integration-icon">{integration.icon}</span>
                <span className={`integration-status ${integration.status === 'Available' || integration.status === 'Disponible' ? 'status-available' : 'status-coming'}`}>
                  {integration.status}
                </span>
              </div>
              <h3 className="integration-name">{integration.name}</h3>
              <p className="integration-category">{integration.category}</p>
              <p className="integration-desc">{integration.description}</p>
            </div>
          ))}
        </div>
        
        <div className="cta-section">
          <Link href="/register" className="cta-button">
            {lang === 'en' ? 'Start Your Free Trial →' : 'Commencer Votre Essai Gratuit →'}
          </Link>
        </div>
      </div>
    </div>
  )
}