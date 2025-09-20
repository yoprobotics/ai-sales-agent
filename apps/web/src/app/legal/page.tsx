import Link from 'next/link'

export default function LegalIndexPage() {
  const legalDocuments = [
    {
      category: 'Core Legal Documents',
      categoryFr: 'Documents juridiques principaux',
      docs: [
        {
          slug: 'terms',
          title: 'Terms & Conditions',
          titleFr: 'Conditions générales d\'utilisation',
          description: 'Our terms of service governing the use of AI Sales Agent platform',
          descriptionFr: 'Nos conditions de service régissant l\'utilisation de la plateforme AI Sales Agent',
          icon: '📜'
        },
        {
          slug: 'privacy',
          title: 'Privacy Policy',
          titleFr: 'Politique de confidentialité',
          description: 'How we collect, use, and protect your personal information',
          descriptionFr: 'Comment nous collectons, utilisons et protégeons vos informations personnelles',
          icon: '🔒'
        },
        {
          slug: 'cookies',
          title: 'Cookie Policy',
          titleFr: 'Politique relative aux cookies',
          description: 'Information about cookies and tracking technologies we use',
          descriptionFr: 'Informations sur les cookies et technologies de suivi que nous utilisons',
          icon: '🍪'
        },
      ]
    },
    {
      category: 'Data & Compliance',
      categoryFr: 'Données et conformité',
      docs: [
        {
          slug: 'dpa',
          title: 'Data Processing Agreement',
          titleFr: 'Accord de traitement des données',
          description: 'Agreement for processing personal data in compliance with GDPR/CCPA/PIPEDA',
          descriptionFr: 'Accord pour le traitement des données personnelles conformément au RGPD/CCPA/PIPEDA',
          icon: '📊'
        },
        {
          slug: 'subprocessors',
          title: 'Subprocessors List',
          titleFr: 'Liste des sous-traitants',
          description: 'Third-party services we use to process your data',
          descriptionFr: 'Services tiers que nous utilisons pour traiter vos données',
          icon: '🤝'
        },
      ]
    },
    {
      category: 'Disclosures & Information',
      categoryFr: 'Divulgations et informations',
      docs: [
        {
          slug: 'disclaimer',
          title: 'Legal Disclaimer',
          titleFr: 'Avis de non-responsabilité',
          description: 'Important disclaimers about our service and AI-generated content',
          descriptionFr: 'Avis importants concernant notre service et le contenu généré par IA',
          icon: '⚠️'
        },
        {
          slug: 'disclosure',
          title: 'Disclosure Statement',
          titleFr: 'Déclaration de divulgation',
          description: 'Transparency disclosures about our business and practices',
          descriptionFr: 'Divulgations de transparence sur notre entreprise et nos pratiques',
          icon: '📢'
        },
        {
          slug: 'contact',
          title: 'Contact Information',
          titleFr: 'Informations de contact',
          description: 'How to reach us for legal, privacy, and support matters',
          descriptionFr: 'Comment nous contacter pour questions juridiques, confidentialité et support',
          icon: '📧'
        },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-gray-700">Home</a>
            <span>/</span>
            <span className="text-gray-900">Legal</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900">Legal Center</h1>
          <p className="mt-4 text-lg text-gray-600">
            Access all legal documents, policies, and compliance information for AI Sales Agent
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <span className="font-semibold text-blue-900">Quick Links:</span>
              <a href="#gdpr" className="text-blue-600 hover:text-blue-700">GDPR</a>
              <a href="#ccpa" className="text-blue-600 hover:text-blue-700">CCPA</a>
              <a href="#pipeda" className="text-blue-600 hover:text-blue-700">PIPEDA</a>
              <a href="/legal/dpa" className="text-blue-600 hover:text-blue-700">DPA</a>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>🌍</span>
              <span>Available in English and French</span>
            </div>
          </div>
        </div>
      </div>

      {/* Document Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {legalDocuments.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {category.category}
              <span className="text-lg font-normal text-gray-500 ml-3">
                {category.categoryFr}
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.docs.map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/legal/${doc.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">{doc.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {doc.description}
                      </p>
                      <span className="text-sm text-blue-600 hover:text-blue-700">
                        Read document →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Badges */}
      <div className="bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Compliance & Certifications
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 mb-2">
                <span className="text-4xl">🇪🇺</span>
              </div>
              <h3 className="font-semibold">GDPR Compliant</h3>
              <p className="text-sm text-gray-600 mt-1">European Union</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 mb-2">
                <span className="text-4xl">🇺🇸</span>
              </div>
              <h3 className="font-semibold">CCPA Compliant</h3>
              <p className="text-sm text-gray-600 mt-1">California, USA</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 mb-2">
                <span className="text-4xl">🇨🇦</span>
              </div>
              <h3 className="font-semibold">PIPEDA Compliant</h3>
              <p className="text-sm text-gray-600 mt-1">Canada</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 mb-2">
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className="font-semibold">SOC 2 Type II</h3>
              <p className="text-sm text-gray-600 mt-1">Security Certified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need Legal Assistance?</h2>
            <p className="text-blue-100 mb-8">
              Our legal and compliance teams are here to help with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <a 
                href="mailto:legal@aisalesagent.com"
                className="inline-flex items-center space-x-2 text-white hover:text-blue-200"
              >
                <span>📧</span>
                <span>legal@aisalesagent.com</span>
              </a>
              <a 
                href="mailto:privacy@aisalesagent.com"
                className="inline-flex items-center space-x-2 text-white hover:text-blue-200"
              >
                <span>🔒</span>
                <span>privacy@aisalesagent.com</span>
              </a>
              <a 
                href="mailto:dpo@aisalesagent.com"
                className="inline-flex items-center space-x-2 text-white hover:text-blue-200"
              >
                <span>🛡️</span>
                <span>dpo@aisalesagent.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}