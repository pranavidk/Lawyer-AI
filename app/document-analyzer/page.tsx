'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { FileText, Upload, Search, AlertCircle } from 'lucide-react'

export default function DocumentAnalyzer() {
  return (
    <div className="min-h-screen bg-aurora-primary">
      <Navigation />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-aurora-accent1 to-aurora-accent2 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-aurora-primary" />
            </div>
            <h1 className="text-4xl font-bold text-aurora-text mb-4">
              Document Analyzer
            </h1>
            <p className="text-xl text-aurora-text/80 max-w-2xl mx-auto">
              Upload and analyze any legal document with AI-powered insights and comprehensive analysis
            </p>
          </div>

          <div className="bg-aurora-secondary rounded-2xl p-8 border border-aurora-accent1/20">
            <div className="text-center py-12">
              <Upload className="h-16 w-16 text-aurora-accent1 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-aurora-text mb-4">
                Coming Soon
              </h3>
              <p className="text-aurora-text/80 mb-6">
                This feature is currently under development. It will allow you to upload and analyze various legal documents with advanced AI capabilities.
              </p>
              <div className="flex items-center justify-center gap-2 text-aurora-accent1">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">Backend integration in progress</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
