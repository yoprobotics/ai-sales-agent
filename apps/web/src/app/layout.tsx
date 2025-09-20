import './globals.css'

export const metadata = {
  title: 'AI Sales Agent',
  description: 'AI-powered B2B prospecting platform',
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