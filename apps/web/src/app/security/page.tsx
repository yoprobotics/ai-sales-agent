'use client'

import Link from 'next/link'
import { useState } from 'react'

type Language = 'en' | 'fr'

export default function SecurityPage() {
  const [lang, setLang] = useState<Language>('en')

  const content = {
    en: {
      title: 'Security at AI Sales Agent',
      subtitle: 'Your data security is our top priority',
      sections: [
        {
          title: 'Enterprise-Grade Security',
          items: [
            'End-to-end encryption for all data in transit and at rest',
            'Regular security audits and penetration testing',
            'SOC 2 Type II compliance (in progress)',
            'ISO 27001 standards implementation'
          ]
        },
        {
          title: 'Data Protection',
          items: [
            'GDPR, CCPA, and PIPEDA compliant',
            'Data residency options (US, EU, Canada)',
            'Right to be forgotten and data portability',
            'Regular automated backups with point-in-time recovery'
          ]
        },
        {
          title: 'Access Control',
          items: [
            'Role-based access control (RBAC)',
            'Multi-factor authentication (MFA)',
            'Single Sign-On (SSO) support',
            'Comprehensive audit logs'
          ]
        },
        {
          title: 'Infrastructure Security',
          items: [
            'Hosted on AWS with 99.9% uptime SLA',
            'DDoS protection and rate limiting',
            'Web Application Firewall (WAF)',
            'Regular security patches and updates'
          ]
        }
      ]
    },
    fr: {
      title: 'Sécurité chez AI Sales Agent',
      subtitle: 'La sécurité de vos données est notre priorité absolue',
      sections: [
        {
          title: 'Sécurité de Niveau Entreprise',
          items: [
            'Chiffrement de bout en bout pour toutes les données',
            'Audits de sécurité et tests de pénétration réguliers',
            'Conformité SOC 2 Type II (en cours)',
            'Implémentation des standards ISO 27001'
          ]
        },
        {
          title: 'Protection des Données',
          items: [
            'Conforme RGPD, CCPA et PIPEDA',
            'Options de résidence des données (US, UE, Canada)',
            'Droit à l\'oubli et portabilité des données',
            'Sauvegardes automatisées régulières avec récupération ponctuelle'
          ]
        },
        {
          title: 'Contrôle d\'Accès',
          items: [
            'Contrôle d\'accès basé sur les rôles (RBAC)',
            'Authentification multi-facteurs (MFA)',
            'Support Single Sign-On (SSO)',
            'Journaux d\'audit complets'
          ]
        },
        {
          title: 'Sécurité de l\'Infrastructure',
          items: [
            'Hébergé sur AWS avec 99.9% de disponibilité',
            'Protection DDoS et limitation de débit',
            'Pare-feu d\'application Web (WAF)',
            'Correctifs de sécurité et mises à jour réguliers'
          ]
        }
      ]
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
          font-size: 20px;
          color: #6b7280;
          margin-bottom: 48px;
        }
        .security-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 32px;
        }
        .security-card {
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .security-card h2 {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 24px;
        }
        .security-list {
          list-style: none;
        }
        .security-list li {
          padding: 12px 0;
          display: flex;
          align-items: flex-start;
          color: #374151;
          line-height: 1.6;
        }
        .security-list li:before {
          content: '🔒';
          margin-right: 12px;
          flex-shrink: 0;
        }
        .cta-section {
          text-align: center;
          margin-top: 64px;
          padding: 48px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .cta-title {
          font-size: 28px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 16px;
        }
        .cta-desc {
          color: #6b7280;
          margin-bottom: 24px;
        }
        .cta-button {
          display: inline-block;
          padding: 14px 28px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: background 0.2s;
        }
        .cta-button:hover {
          background: #1d4ed8;
        }
        @media (max-width: 768px) {
          h1 {
            font-size: 36px;
          }
          .security-grid {
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
        
        <div className="security-grid">
          {t.sections.map((section, index) => (
            <div key={index} className="security-card">
              <h2>{section.title}</h2>
              <ul className="security-list">
                {section.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="cta-section">
          <h2 className="cta-title">
            {lang === 'en' 
              ? 'Questions About Security?'
              : 'Questions sur la Sécurité?'}
          </h2>
          <p className="cta-desc">
            {lang === 'en'
              ? 'Our security team is here to answer any questions'
              : 'Notre équipe de sécurité est là pour répondre à vos questions'}
          </p>
          <Link href="/contact" className="cta-button">
            {lang === 'en' ? 'Contact Security Team' : 'Contacter l\'Équipe Sécurité'}
          </Link>
        </div>
      </div>
    </div>
  )
}