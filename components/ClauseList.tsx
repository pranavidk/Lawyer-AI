'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { AlertTriangle, CheckCircle, Info, Copy, Share2, ChevronDown, ChevronUp } from 'lucide-react'
import { useTheme } from './ThemeProvider'

interface Clause {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  explanation: string
  originalText: string
  suggestions?: string[]
}

interface ClauseListProps {
  clauses: Clause[]
}

export function ClauseList({ clauses }: ClauseListProps) {
  const { toneMode } = useTheme()
  const [expandedClause, setExpandedClause] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'medium':
        return <Info className="h-5 w-5 text-amber-600" />
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const copyToClipboard = async (text: string, clauseId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(clauseId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const shareClause = async (clause: Clause) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Contract Clause: ${clause.title}`,
          text: clause.explanation,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback to copying
      copyToClipboard(clause.explanation, clause.id)
    }
  }

  if (clauses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-gray-500">
          <p className="text-lg">
            {toneMode === 'casual' ? 'No clauses to show yet! 📝' : 'No clauses analyzed yet'}
          </p>
          <p className="text-sm mt-2">
            {toneMode === 'casual' 
              ? 'Upload a contract to get started! 🚀'
              : 'Upload a contract document to begin analysis'
            }
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {toneMode === 'casual' ? '📋 Analyzed Clauses' : 'Contract Analysis Results'}
        </h3>
        <p className="text-gray-600">
          {toneMode === 'casual' 
            ? `Found ${clauses.length} clause${clauses.length !== 1 ? 's' : ''} to review! 👀`
            : `${clauses.length} clause${clauses.length !== 1 ? 's' : ''} analyzed`
          }
        </p>
      </div>

      <AnimatePresence>
        {clauses.map((clause, index) => (
          <motion.div
            key={clause.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getSeverityIcon(clause.severity)}
                  <h4 className="text-lg font-semibold text-gray-900">
                    {clause.title}
                  </h4>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(clause.severity)}`}>
                    {clause.severity.toUpperCase()}
                  </span>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => copyToClipboard(clause.explanation, clause.id)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      aria-label="Copy explanation"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => shareClause(clause)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      aria-label="Share clause"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {clause.explanation}
                </p>
              </div>

              {clause.suggestions && clause.suggestions.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2">
                    {toneMode === 'casual' ? '💡 Suggestions' : 'Recommendations'}
                  </h5>
                  <ul className="space-y-1">
                    {clause.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-blue-800">
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
                className="mt-4 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {expandedClause === clause.id ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    {toneMode === 'casual' ? 'Hide original text 👆' : 'Hide original text'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    {toneMode === 'casual' ? 'Show original text 👇' : 'Show original text'}
                  </>
                )}
              </button>

              <AnimatePresence>
                {expandedClause === clause.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h6 className="font-medium text-gray-900 mb-2">
                        {toneMode === 'casual' ? '📜 Original Text' : 'Original Contract Text'}
                      </h6>
                      <p className="text-sm text-gray-700 font-mono leading-relaxed">
                        {clause.originalText}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {copiedId === clause.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-2 text-sm text-green-600 font-medium"
                >
                  {toneMode === 'casual' ? 'Copied! 📋' : 'Copied to clipboard'}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
