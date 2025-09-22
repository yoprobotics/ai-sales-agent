'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PrivacyPage() {
  const [lang, setLang] = useState<'en' | 'fr'>('en')

  const content = {
    en: {
      title: 'Privacy Policy',
      subtitle: 'Last updated: January 2025',
      intro: 'AI Sales Agent ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.',
      sections: [
        {
          title: '1. Information We Collect',
          content: 'We collect personal information you provide directly to us, such as when you create an account, use our services, or contact us. This may include name, email address, company information, and payment details.'
        },
        {
          title: '2. How We Use Your Information',
          content: 'We use your information to provide and improve our services, process transactions, communicate with you, and comply with legal obligations.'
        },
        {
          title: '3. Data Security',
          content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          title: '4. Data Retention',
          content: 'We retain your information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your data at any time.'
        },
        {
          title: '5. Your Rights (GDPR/CCPA/PIPEDA)',
          content: 'You have the right to access, update, delete, or port your personal data. You can also object to processing and request restriction of processing.'
        },
        {
          title: '6. Contact Us',
          content: 'If you have questions about this Privacy Policy, please contact us at privacy@aisalesagent.com'
        }
      ]
    },
    fr: {
      title: 'Politique de Confidentialité',
      subtitle: 'Dernière mise à jour : Janvier 2025',
      intro: 'AI Sales Agent ("nous") s\'engage à protéger votre vie privée. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.',
      sections: [
        {
          title: '1. Informations Collectées',
          content: 'Nous collectons les informations personnelles que vous nous fournissez directement, comme lors de la création d\'un compte ou l\'utilisation de nos services.'
        },
        {
          title: '2. Utilisation des Informations',
          content: 'Nous utilisons vos informations pour fournir et améliorer nos services, traiter les transactions et communiquer avec vous.'
        },
        {
          title: '3. Sécurité des Données',
          content: 'Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos informations personnelles.'
        },
        {
          title: '4. Conservation des Données',
          content: 'Nous conservons vos informations aussi longtemps que nécessaire pour fournir nos services. Vous pouvez demander la suppression de vos données.'
        },
        {
          title: '5. Vos Droits (RGPD/LCAP/PIPEDA)',
          content: 'Vous avez le droit d\'accéder, mettre à jour, supprimer ou porter vos données personnelles.'
        },
        {
          title: '6. Nous Contacter',
          content: 'Pour toute question sur cette politique, contactez-nous à privacy@aisalesagent.com'
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