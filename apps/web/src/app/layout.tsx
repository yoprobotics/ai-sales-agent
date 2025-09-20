import './globals.css'
import Footer from '@/components/layout/footer'

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
      <body className="min-h-screen flex flex-col">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}