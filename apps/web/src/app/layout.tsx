import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Sales Agent - B2B Prospecting Platform',
  description: 'AI-powered B2B prospecting platform with intelligent qualification',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
