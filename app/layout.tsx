import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Disclaimer } from '@/components/Disclaimer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JuriSense - AI Legal Assistant',
  description: 'Your AI legal companion for contract analysis, term explanation, and compliance guidance. Secure, Smart, Simple.',
  keywords: ['legal', 'AI', 'contract', 'compliance', 'India', 'law', 'JuriSense', 'legal assistant'],
  authors: [{ name: 'JuriSense Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-aurora-primary text-aurora-text antialiased`}>
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
