import { notFound } from 'next/navigation'
import fs from 'fs/promises'
import path from 'path'
import { marked } from 'marked'

// Map URL slugs to document filenames
const legalDocuments: Record<string, { file: string; title: string; titleFr: string }> = {
  'terms': { file: 'TERMS.md', title: 'Terms & Conditions', titleFr: 'Conditions Générales' },
  'privacy': { file: 'PRIVACY.md', title: 'Privacy Policy', titleFr: 'Politique de Confidentialité' },
  'disclaimer': { file: 'DISCLAIMER.md', title: 'Legal Disclaimer', titleFr: 'Avis Légal' },
  'contact': { file: 'CONTACT.md', title: 'Contact Information', titleFr: 'Informations de Contact' },
  'disclosure': { file: 'DISCLOSURE.md', title: 'Disclosure Statement', titleFr: 'Déclaration de Divulgation' },
  'subprocessors': { file: 'SUBPROCESSORS.md', title: 'Subprocessors', titleFr: 'Sous-traitants' },
  'cookies': { file: 'COOKIES.md', title: 'Cookie Policy', titleFr: 'Politique de Cookies' }
}

export default async function LegalPage({ params }: { params: { doc: string } }) {
  const docInfo = legalDocuments[params.doc]
  
  if (!docInfo) {
    notFound()
  }

  let content = ''
  const docPath = path.join(process.cwd(), '..', '..', 'docs', docInfo.file)
  
  try {
    const markdown = await fs.readFile(docPath, 'utf-8')
    content = marked(markdown)
  } catch (error) {
    // If file doesn't exist, create placeholder content
    content = `
      <h1>${docInfo.title}</h1>
      <p>This document is being prepared.</p>
      <hr />
      <h1>${docInfo.titleFr}</h1>
      <p>Ce document est en cours de préparation.</p>
    `
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        
        <div className="mt-12 pt-8 border-t">
          <a 
            href="/"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return Object.keys(legalDocuments).map((doc) => ({
    doc: doc,
  }))
}
