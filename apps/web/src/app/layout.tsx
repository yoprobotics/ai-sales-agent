import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Sales Agent - B2B Prospecting Platform',
  description: 'AI-powered B2B prospecting platform with intelligent qualification, personalized messaging, and CRM pipeline management',
  keywords: 'B2B, sales, prospecting, AI, CRM, email automation',
  authors: [{ name: 'YoProbotics' }],
  openGraph: {
    title: 'AI Sales Agent',
    description: 'Transform your B2B prospecting with AI',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
