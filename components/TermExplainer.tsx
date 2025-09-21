'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Search, BookOpen, Share2, Copy, Loader2, AlertCircle } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { apiService } from '@/lib/api'

interface TermExplanation {
  term: string
  definition: string
  summary: string
  example: string
  statutoryReferences: string[]
}

export function TermExplainer() {
  const { toneMode, privacyMode } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [explanation, setExplanation] = useState<TermExplanation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsLoading(true)
    setError(null)
    setExplanation(null)

    try {
      const result = await apiService.explainTerm(searchTerm.trim(), {
        privacy: privacyMode,
        tone: toneMode
      })
      setExplanation(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to explain term')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const shareExplanation = async () => {
    if (!explanation) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Legal Term: ${explanation.term}`,
          text: explanation.summary,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      copyToClipboard(explanation.summary)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-12"
      id="terms"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {toneMode === 'casual' ? '📚 Legal Term Explainer' : 'Legal Term Explanation'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {toneMode === 'casual' 
              ? 'Confused by legal jargon? We\'ll explain it in plain English! 🤓'
              : 'Get plain-English explanations of legal terms with examples and statutory references.'
            }
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
        >
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={toneMode === 'casual' 
                  ? 'Type a legal term (e.g., "indemnity", "force majeure")...'
                  : 'Enter legal term or phrase to explain'
                }
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !searchTerm.trim()}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
                ) : (
                  <Search className="h-5 w-5 text-primary-600" />
                )}
              </button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </motion.div>
          )}

          <AnimatePresence>
            {explanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-primary-600" />
                    {explanation.term}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(explanation.summary)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      aria-label="Copy summary"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={shareExplanation}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      aria-label="Share explanation"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      {toneMode === 'casual' ? '📖 Plain English Definition' : 'Definition'}
                    </h4>
                    <p className="text-blue-800 leading-relaxed">
                      {explanation.definition}
                    </p>
                  </div>

                  <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      {toneMode === 'casual' ? '📱 Social Media Summary' : 'One-Line Summary'}
                    </h4>
                    <p className="text-green-800 leading-relaxed font-medium">
                      {explanation.summary}
                    </p>
                  </div>

                  <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                      {toneMode === 'casual' ? '🇮🇳 Indian Context Example' : 'Example (Indian Context)'}
                    </h4>
                    <p className="text-amber-800 leading-relaxed">
                      {explanation.example}
                    </p>
                  </div>

                  {explanation.statutoryReferences.length > 0 && (
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        {toneMode === 'casual' ? '📜 Legal References' : 'Statutory References'}
                      </h4>
                      <ul className="space-y-2">
                        {explanation.statutoryReferences.map((ref, index) => (
                          <li key={index} className="text-gray-700 text-sm">
                            • {ref}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {copied && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center text-green-600 font-medium"
                  >
                    {toneMode === 'casual' ? 'Copied to clipboard! 📋' : 'Copied to clipboard'}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  )
}
