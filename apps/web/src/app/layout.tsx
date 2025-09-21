import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Sales Agent - B2B Prospecting Platform',
  description: 'AI-powered B2B prospecting platform with intelligent qualification, personalized messaging, and CRM pipeline management',
  keywords: 'B2B sales, prospecting, AI qualification, CRM, email sequences',
  authors: [{ name: 'YoProbotics' }],
  creator: 'YoProbotics',
  publisher: 'YoProbotics',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://aisalesagent.com',
    siteName: 'AI Sales Agent',
    title: 'AI Sales Agent - B2B Prospecting Platform',
    description: 'AI-powered B2B prospecting platform',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Sales Agent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Sales Agent - B2B Prospecting Platform',
    description: 'AI-powered B2B prospecting platform',
    creator: '@yoprobotics',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}