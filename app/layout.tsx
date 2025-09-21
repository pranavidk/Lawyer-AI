import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Disclaimer } from '@/components/Disclaimer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lawyer AI - Indian Legal Assistant',
  description: 'AI-powered legal assistant for contract analysis, term explanation, and compliance guidance',
  keywords: ['legal', 'AI', 'contract', 'compliance', 'India', 'law'],
  authors: [{ name: 'Lawyer AI Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <ThemeProvider>
          <Disclaimer />
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
