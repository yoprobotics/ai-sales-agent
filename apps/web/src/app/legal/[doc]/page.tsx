import { notFound } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'
import { marked } from 'marked'

// Map URL slugs to document filenames
const legalDocuments: Record<string, { file: string; title: string; titleFr: string }> = {
  'terms': { 
    file: 'TERMS.md', 
    title: 'Terms & Conditions',
    titleFr: 'Conditions générales d\'utilisation'
  },
  'privacy': { 
    file: 'PRIVACY.md', 
    title: 'Privacy Policy',
    titleFr: 'Politique de confidentialité'
  },
  'cookies': { 
    file: 'COOKIES.md', 
    title: 'Cookie Policy',
    titleFr: 'Politique relative aux cookies'
  },
  'dpa': { 
    file: 'DPA.md', 
    title: 'Data Processing Agreement',
    titleFr: 'Accord de traitement des données'
  },
  'disclaimer': { 
    file: 'DISCLAIMER.md', 
    title: 'Legal Disclaimer',
    titleFr: 'Avis de non-responsabilité'
  },
  'disclosure': { 
    file: 'DISCLOSURE.md', 
    title: 'Disclosure Statement',
    titleFr: 'Déclaration de divulgation'
  },
  'contact': { 
    file: 'CONTACT.md', 
    title: 'Contact Information',
    titleFr: 'Informations de contact'
  },
  'subprocessors': { 
    file: 'SUBPROCESSORS.md', 
    title: 'Subprocessors List',
    titleFr: 'Liste des sous-traitants'
  },
}

export async function generateStaticParams() {
  return Object.keys(legalDocuments).map((doc) => ({
    doc,
  }))
}

export async function generateMetadata({ params }: { params: { doc: string } }) {
  const docInfo = legalDocuments[params.doc]
  
  if (!docInfo) {
    return {
      title: 'Page Not Found - AI Sales Agent',
    }
  }

  return {
    title: `${docInfo.title} - AI Sales Agent`,
    description: `Read our ${docInfo.title} to understand how AI Sales Agent operates.`,
  }
}

export default async function LegalDocumentPage({ 
  params 
}: { 
  params: { doc: string } 
}) {
  const docInfo = legalDocuments[params.doc]
  
  if (!docInfo) {
    notFound()
  }

  try {
    // Read the markdown file from the docs directory
    const filePath = path.join(process.cwd(), '..', '..', 'docs', docInfo.file)
    const fileContent = await fs.readFile(filePath, 'utf8')
    
    // Convert markdown to HTML
    const htmlContent = marked(fileContent)

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-gray-700">Home</a>
              <span>/</span>
              <a href="/legal" className="hover:text-gray-700">Legal</a>
              <span>/</span>
              <span className="text-gray-900">{docInfo.title}</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900">
              {docInfo.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* Language Toggle */}
            <div className="mb-8 flex items-center justify-end space-x-2">
              <span className="text-sm text-gray-500">Language:</span>
              <button 
                className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                onClick={() => {
                  const frSection = document.getElementById('fr-section')
                  const enSection = document.getElementById('en-section')
                  if (frSection && enSection) {
                    if (frSection.style.display === 'none') {
                      frSection.style.display = 'block'
                      enSection.style.display = 'none'
                    } else {
                      frSection.style.display = 'none'
                      enSection.style.display = 'block'
                    }
                  }
                }}
              >
                Toggle FR/EN
              </button>
            </div>

            {/* Legal document content */}
            <div 
              className="prose prose-lg max-w-none legal-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Print/Download Options */}
            <div className="mt-12 pt-8 border-t flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>Last updated: December 2024</p>
                <p>Document ID: {docInfo.file.replace('.md', '')}</p>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => window.print()}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  🖨️ Print
                </button>
                <a 
                  href={`https://raw.githubusercontent.com/yoprobotics/ai-sales-agent/main/docs/${docInfo.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  📄 View Source
                </a>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Questions about this document?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Our legal team is here to help clarify any questions you may have.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <a 
                href="mailto:legal@aisalesagent.com"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                📧 legal@aisalesagent.com
              </a>
              <a 
                href="mailto:privacy@aisalesagent.com"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                🔒 privacy@aisalesagent.com
              </a>
              <a 
                href="mailto:dpo@aisalesagent.com"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                🛡️ dpo@aisalesagent.com
              </a>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .legal-content h2 {
            @apply text-2xl font-bold mt-8 mb-4 text-gray-900;
          }
          .legal-content h3 {
            @apply text-xl font-semibold mt-6 mb-3 text-gray-800;
          }
          .legal-content h4 {
            @apply text-lg font-semibold mt-4 mb-2 text-gray-700;
          }
          .legal-content p {
            @apply mb-4 text-gray-600 leading-relaxed;
          }
          .legal-content ul {
            @apply list-disc pl-6 mb-4 space-y-2;
          }
          .legal-content ol {
            @apply list-decimal pl-6 mb-4 space-y-2;
          }
          .legal-content li {
            @apply text-gray-600;
          }
          .legal-content table {
            @apply w-full border-collapse mb-6;
          }
          .legal-content th {
            @apply bg-gray-50 border border-gray-200 px-4 py-2 text-left font-semibold;
          }
          .legal-content td {
            @apply border border-gray-200 px-4 py-2;
          }
          .legal-content blockquote {
            @apply border-l-4 border-blue-500 pl-4 italic my-4;
          }
          .legal-content code {
            @apply bg-gray-100 px-2 py-1 rounded text-sm;
          }
          .legal-content hr {
            @apply my-8 border-gray-300;
          }
          .legal-content a {
            @apply text-blue-600 hover:text-blue-700 underline;
          }
        `}</style>
      </div>
    )
  } catch (error) {
    console.error('Error loading legal document:', error)
    notFound()
  }
}