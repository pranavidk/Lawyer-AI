'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { SplashScreen } from '@/components/SplashScreen'
import { TypingEffect } from '@/components/TypingEffect'
import { DisclaimerPopup } from '@/components/DisclaimerPopup'
import { UploadContract } from '@/components/UploadContract'
import { ClauseList } from '@/components/ClauseList'
import { TermExplainer } from '@/components/TermExplainer'
import { ChatWidget } from '@/components/ChatWidget'
import { PageTransition } from '@/components/PageTransition'
import { useState } from 'react'

export default function Home() {
  const [documentAnalysis, setDocumentAnalysis] = useState<any>(null)
  const [showSplash, setShowSplash] = useState(true)

  const handleAnalysisComplete = (analysis: any) => {
    setDocumentAnalysis(analysis)
  }

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  return (
    <PageTransition className="min-h-screen dark:bg-aurora-primary light:bg-light-primary transition-colors duration-300">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Navigation />
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20"
        style={{
          background: 'linear-gradient(135deg, #0A0A1E 0%, #1B1B3A 50%, #0A0A1E 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold dark:text-aurora-text light:text-light-text mb-6 leading-[1.1]">
              JuriSense
              <span className="block bg-gradient-to-r from-aurora-accent1 to-aurora-accent2 bg-clip-text text-transparent leading-[1.1]">
                AI Legal Assistant
              </span>
            </h1>
            <div className="text-xl dark:text-aurora-text/80 light:text-light-text/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              <TypingEffect 
                text="Your AI Legal Companion — Simple, Smart, Secure"
                speed={80}
                className="font-medium"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('#document')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-aurora-accent1 to-aurora-accent2 text-aurora-primary rounded-xl font-semibold hover:shadow-lg hover:shadow-aurora-accent1/25 transition-all duration-300"
              >
                Analyze Document
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('#terms')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-aurora-secondary text-aurora-text rounded-xl font-semibold hover:bg-aurora-accent1/10 transition-all duration-300 border border-aurora-accent1/30"
              >
                Explain Terms
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>


      {/* Main Content Sections */}
      <div className="space-y-0 bg-aurora-primary">
        <UploadContract onAnalysisComplete={handleAnalysisComplete} />
        
        {documentAnalysis && (
          <section className="py-12 bg-aurora-secondary">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <ClauseList clauses={documentAnalysis.clauses || []} />
            </div>
          </section>
        )}

        <TermExplainer />
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-aurora-secondary border-t border-aurora-accent1/20 py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-aurora-accent1 rounded-lg flex items-center justify-center">
                <span className="text-aurora-primary font-bold text-sm">⚖️</span>
              </div>
              <span className="font-semibold text-xl text-aurora-text">JuriSense</span>
            </div>
            <p className="text-aurora-text/80 mb-6">
              AI-powered legal assistance for modern businesses and individuals
            </p>
            <div className="border-t border-aurora-accent1/20 pt-6">
              <p className="text-sm text-aurora-text/60">
                © 2024 JuriSense. This tool provides general information only and does not constitute legal advice.
              </p>
            </div>
          </div>
        </div>
      </motion.footer>

      <ChatWidget />
      <DisclaimerPopup />
    </PageTransition>
  )
}
