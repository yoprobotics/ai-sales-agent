'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function TermsPage() {
  const [lang, setLang] = useState('en')

  const content = {
    en: {
      title: 'Terms & Conditions',
      subtitle: 'Last updated: January 2025',
      intro: 'By accessing or using AI Sales Agent, you agree to be bound by these Terms and Conditions.',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: 'By using our service, you accept these terms in full. If you disagree with any part, you may not use our service.'
        },
        {
          title: '2. Description of Service',
          content: 'AI Sales Agent is a B2B prospecting platform that provides AI-powered lead qualification, personalized messaging, and CRM pipeline management.'
        },
        {
          title: '3. User Accounts',
          content: 'You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use.'
        },
        {
          title: '4. Acceptable Use',
          content: 'You agree to use the service only for lawful purposes and in accordance with these Terms. You may not use the service for spam or harassment.'
        },
        {
          title: '5. Subscription and Billing',
          content: 'Subscriptions are billed in advance on a monthly or annual basis. Fees are non-refundable except as required by law.'
        },
        {
          title: '6. Limitation of Liability',
          content: 'THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT OR CONSEQUENTIAL DAMAGES.'
        },
        {
          title: '7. Contact Information',
          content: 'For questions about these Terms, please contact us at legal@aisalesagent.com'
        }
      ]
    },
    fr: {
      title: 'Conditions Générales',
      subtitle: 'Dernière mise à jour : Janvier 2025',
      intro: 'En accédant ou en utilisant AI Sales Agent, vous acceptez d\'être lié par ces Conditions Générales.',
      sections: [
        {
          title: '1. Acceptation des Conditions',
          content: 'En utilisant notre service, vous acceptez ces conditions dans leur intégralité.'
        },
        {
          title: '2. Description du Service',
          content: 'AI Sales Agent est une plateforme de prospection B2B offrant qualification par IA, messages personnalisés et gestion de pipeline CRM.'
        },
        {
          title: '3. Comptes Utilisateur',
          content: 'Vous êtes responsable de la confidentialité de votre compte et mot de passe.'
        },
        {
          title: '4. Utilisation Acceptable',
          content: 'Vous acceptez d\'utiliser le service uniquement à des fins légales. L\'utilisation pour spam ou harcèlement est interdite.'
        },
        {
          title: '5. Abonnement et Facturation',
          content: 'Les abonnements sont facturés à l\'avance mensuellement ou annuellement. Les frais ne sont pas remboursables sauf si requis par la loi.'
        },
        {
          title: '6. Limitation de Responsabilité',
          content: 'LE SERVICE EST FOURNI "TEL QUEL" SANS GARANTIE. NOUS NE SERONS PAS RESPONSABLES DE DOMMAGES INDIRECTS.'
        },
        {
          title: '7. Contact',
          content: 'Pour toute question sur ces Conditions, contactez-nous à legal@aisalesagent.com'
        }
      ]
    }
  }

  const t = content[lang]

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <style jsx>{`
        .container {
          max-width: 800px;
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
          font-size: 36px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 12px;
        }
        .subtitle {
          color: #6b7280;
          margin-bottom: 32px;
        }
        .intro {
          font-size: 18px;
          line-height: 1.8;
          color: #374151;
          margin-bottom: 48px;
        }
        .section {
          margin-bottom: 40px;
        }
        .section h2 {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }
        .section p {
          line-height: 1.8;
          color: #374151;
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
        
        {t.sections.map((section, index) => (
          <div key={index} className="section">
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
