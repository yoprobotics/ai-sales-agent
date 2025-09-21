import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Sales Agent - B2B Prospecting Platform',
  description: 'AI-powered B2B prospecting platform with intelligent qualification, personalized messaging, and CRM pipeline management',
  keywords: 'B2B, sales, prospecting, AI, CRM, pipeline, qualification',
  authors: [{ name: 'YoProbotics' }],
  creator: 'YoProbotics',
  publisher: 'YoProbotics',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'AI Sales Agent',
    description: 'AI-powered B2B prospecting platform',
    siteName: 'AI Sales Agent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Sales Agent',
    description: 'AI-powered B2B prospecting platform',
    creator: '@yoprobotics',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>🚀</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  )
}
