'use client'

import Link from 'next/link'
import { useState } from 'react'

type Language = 'en' | 'fr'

export default function ContactPage() {
  const [lang, setLang] = useState<Language>('en')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const content = {
    en: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our team',
      name: 'Name',
      email: 'Email',
      company: 'Company',
      message: 'Message',
      send: 'Send Message',
      info: {
        title: 'Other Ways to Reach Us',
        items: [
          { label: 'Email', value: 'support@aisalesagent.com' },
          { label: 'Sales', value: 'sales@aisalesagent.com' },
          { label: 'Support Hours', value: 'Monday-Friday, 9AM-6PM EST' }
        ]
      }
    },
    fr: {
      title: 'Nous Contacter',
      subtitle: 'Contactez notre équipe',
      name: 'Nom',
      email: 'Email',
      company: 'Entreprise',
      message: 'Message',
      send: 'Envoyer le Message',
      info: {
        title: 'Autres Moyens de Contact',
        items: [
          { label: 'Email', value: 'support@aisalesagent.com' },
          { label: 'Ventes', value: 'sales@aisalesagent.com' },
          { label: 'Heures de Support', value: 'Lundi-Vendredi, 9h-18h EST' }
        ]
      }
    }
  }

  const t = content[lang]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert(lang === 'en' ? 'Message sent!' : 'Message envoyé!')
  }

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
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 48px;
        }
        .form {
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .form-group {
          margin-bottom: 24px;
        }
        label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }
        input, textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: #2563eb;
        }
        textarea {
          min-height: 120px;
          resize: vertical;
        }
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .submit-btn:hover {
          background: #1d4ed8;
        }
        .info-section {
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .info-section h3 {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 24px;
        }
        .info-item {
          margin-bottom: 20px;
        }
        .info-label {
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 4px;
        }
        .info-value {
          color: #111827;
        }
        @media (max-width: 768px) {
          h1 {
            font-size: 36px;
          }
          .content-grid {
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
        
        <div className="content-grid">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t.name}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>{t.email}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>{t.company}</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>{t.message}</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">
              {t.send}
            </button>
          </form>
          
          <div className="info-section">
            <h3>{t.info.title}</h3>
            {t.info.items.map((item, index) => (
              <div key={index} className="info-item">
                <div className="info-label">{item.label}</div>
                <div className="info-value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}