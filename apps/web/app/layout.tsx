import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Sales Agent - B2B Prospecting Platform',
  description: 'AI-powered B2B prospecting platform with intelligent qualification, personalized messaging, and CRM pipeline management',
  keywords: 'B2B sales, prospecting, AI qualification, email automation, CRM, sales pipeline',
  authors: [{ name: 'YoProbotics' }],
  creator: 'YoProbotics',
  publisher: 'YoProbotics',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://ai-sales-agent.vercel.app',
    title: 'AI Sales Agent - B2B Prospecting Platform',
    description: 'Transform your B2B sales with AI-powered prospecting',
    siteName: 'AI Sales Agent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Sales Agent - B2B Prospecting Platform',
    description: 'Transform your B2B sales with AI-powered prospecting',
    creator: '@yoprobotics',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          {children}
        </div>
      </body>
    </html>
  )
}
