'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  const legalLinks = [
    { href: '/legal/terms', label: 'Terms & Conditions', labelFr: 'Conditions générales' },
    { href: '/legal/privacy', label: 'Privacy Policy', labelFr: 'Confidentialité' },
    { href: '/legal/cookies', label: 'Cookie Policy', labelFr: 'Cookies' },
    { href: '/legal/dpa', label: 'Data Processing', labelFr: 'Traitement des données' },
    { href: '/legal/disclaimer', label: 'Disclaimer', labelFr: 'Avis' },
    { href: '/legal/disclosure', label: 'Disclosure', labelFr: 'Divulgation' },
  ]

  const companyLinks = [
    { href: '/about', label: 'About Us', labelFr: 'À propos' },
    { href: '/legal/contact', label: 'Contact', labelFr: 'Contact' },
    { href: '/legal/subprocessors', label: 'Subprocessors', labelFr: 'Sous-traitants' },
    { href: 'https://status.aisalesagent.com', label: 'Status', labelFr: 'Statut', external: true },
  ]

  const resourceLinks = [
    { href: '/docs', label: 'Documentation', labelFr: 'Documentation' },
    { href: '/api', label: 'API', labelFr: 'API' },
    { href: '/blog', label: 'Blog', labelFr: 'Blog' },
    { href: '/support', label: 'Support', labelFr: 'Support' },
  ]

  const socialLinks = [
    { href: 'https://github.com/yoprobotics', label: 'GitHub', icon: '🐙' },
    { href: 'https://linkedin.com/company/aisalesagent', label: 'LinkedIn', icon: '💼' },
    { href: 'https://twitter.com/aisalesagent', label: 'Twitter', icon: '🐦' },
  ]

  // Don't show footer on auth pages
  if (pathname?.startsWith('/auth')) {
    return null
  }

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">AI Sales Agent</h3>
            <p className="text-sm text-gray-400 mb-4">
              AI-powered B2B prospecting platform with intelligent qualification and personalized messaging.
            </p>
            <p className="text-xs text-gray-500">
              © {currentYear} YoProbotics Inc. All rights reserved.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a 
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-white transition-colors inline-flex items-center"
                    >
                      {link.label}
                      <span className="ml-1 text-xs">↗</span>
                    </a>
                  ) : (
                    <Link 
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 mb-6">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:opacity-80 transition-opacity"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 sm:mb-0">
              <span className="text-xs text-gray-500">Compliance:</span>
              <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">GDPR</span>
              <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">CCPA</span>
              <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">PIPEDA</span>
              <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">SOC 2</span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Data Region:</span>
              <select 
                className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-700"
                defaultValue="US"
              >
                <option value="US">🇺🇸 United States</option>
                <option value="EU">🇪🇺 European Union</option>
                <option value="CA">🇨🇦 Canada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Security Issue? Contact us immediately:{' '}
            <a 
              href="mailto:security@aisalesagent.com" 
              className="text-red-400 hover:text-red-300"
            >
              security@aisalesagent.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}