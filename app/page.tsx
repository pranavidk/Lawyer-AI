'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { UploadContract } from '@/components/UploadContract'
import { ClauseList } from '@/components/ClauseList'
import { TermExplainer } from '@/components/TermExplainer'
import { ComplianceForm } from '@/components/ComplianceForm'
import { ChatWidget } from '@/components/ChatWidget'
import { useState } from 'react'

export default function Home() {
  const [contractAnalysis, setContractAnalysis] = useState<any>(null)

  const handleAnalysisComplete = (analysis: any) => {
    setContractAnalysis(analysis)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 bg-gradient-to-br from-primary-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Lawyer AI
              <span className="block text-primary-600">Legal Assistant</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              AI-powered legal assistance for contract analysis, term explanation, and compliance guidance. 
              Get plain-English explanations and actionable insights for your legal needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('#contract')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg"
              >
                Analyze Contract
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('#terms')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg border border-primary-200"
              >
                Explain Terms
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Legal Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three comprehensive features to help you navigate legal complexities with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Contract Analysis
              </h3>
              <p className="text-gray-600">
                Upload contracts and get highlighted clauses with severity ratings and plain-English explanations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Term Explanation
              </h3>
              <p className="text-gray-600">
                Get instant explanations of legal terms with examples and statutory references
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Compliance Check
              </h3>
              <p className="text-gray-600">
                Quick compliance scenarios for GST, IT Act, Employment, and Rental agreements
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Content Sections */}
      <div className="space-y-0">
        <UploadContract onAnalysisComplete={handleAnalysisComplete} />
        
        {contractAnalysis && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <ClauseList clauses={contractAnalysis.clauses || []} />
            </div>
          </section>
        )}

        <TermExplainer />
        <ComplianceForm />
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-900 text-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚖️</span>
              </div>
              <span className="font-semibold text-xl">Lawyer AI</span>
            </div>
            <p className="text-gray-400 mb-6">
              AI-powered legal assistance for modern businesses and individuals
            </p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-500">
                © 2024 Lawyer AI. This tool provides general information only and does not constitute legal advice.
              </p>
            </div>
          </div>
        </div>
      </motion.footer>

      <ChatWidget />
    </div>
  )
}
