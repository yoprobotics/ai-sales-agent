import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Sales Agent - AI-Powered B2B Prospecting Platform',
  description: 'Qualify leads, generate personalized messages, and manage your pipeline with AI - all in one platform.',
  keywords: 'B2B sales, AI prospecting, lead qualification, email automation, CRM, sales pipeline',
  authors: [{ name: 'YoProbotics' }],
  openGraph: {
    title: 'AI Sales Agent - AI-Powered B2B Prospecting',
    description: 'Transform your B2B sales process with AI-powered prospecting and qualification',
    url: 'https://aisalesagent.com',
    siteName: 'AI Sales Agent',
    images: [
      {
        url: 'https://aisalesagent.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Sales Agent - AI-Powered B2B Prospecting',
    description: 'Transform your B2B sales process with AI',
    images: ['https://aisalesagent.com/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  )
}