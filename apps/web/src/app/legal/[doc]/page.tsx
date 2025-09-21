import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'

// Simple markdown to HTML converter without external dependency
function convertMarkdownToHTML(markdown: string): string {
  let html = markdown
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
  
  // Lists - Fixed to avoid using /s flag
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>')
  // Instead of using /s flag, match list items more specifically
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (match) => {
    // Wrap consecutive list items in ul tags
    if (match.includes('<li>')) {
      return '<ul>' + match + '</ul>'
    }
    return match
  })
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>')
  html = '<p>' + html + '</p>'
  
  // Code blocks
  html = html.replace(/```([^`]*)```/g, '<pre class="bg-gray-100 p-4 rounded"><code>$1</code></pre>')
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
  
  return html
}

const legalDocs = {
  privacy: {
    title: 'Privacy Policy',
    file: 'PRIVACY.md'
  },
  terms: {
    title: 'Terms & Conditions',
    file: 'TERMS.md'
  },
  contact: {
    title: 'Contact Information',
    file: 'CONTACT.md'
  },
  disclaimer: {
    title: 'Legal Disclaimer',
    file: 'DISCLAIMER.md'
  },
  disclosure: {
    title: 'Disclosure Statement',
    file: 'DISCLOSURE.md'
  }
}

export async function generateStaticParams() {
  return Object.keys(legalDocs).map((doc) => ({
    doc
  }))
}

export default async function LegalDocPage({
  params
}: {
  params: { doc: string }
}) {
  const doc = legalDocs[params.doc as keyof typeof legalDocs]
  
  if (!doc) {
    notFound()
  }
  
  const docsPath = path.join(process.cwd(), '..', '..', 'docs')
  const filePath = path.join(docsPath, doc.file)
  
  let content = '# Document Not Found\n\nThe requested legal document is not available.'
  
  try {
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf-8')
    }
  } catch (error) {
    console.error('Error reading legal document:', error)
  }
  
  const htmlContent = convertMarkdownToHTML(content)
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{doc.title}</h1>
        <div 
          className="prose prose-lg max-w-none legal-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}