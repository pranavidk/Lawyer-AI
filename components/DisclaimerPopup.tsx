'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export function DisclaimerPopup() {
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showDrip, setShowDrip] = useState(false)

  useEffect(() => {
    // Show for 10 seconds, then minimize
    const timer = setTimeout(() => {
      setIsMinimized(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setShowDrip(true)
    setTimeout(() => {
      setIsVisible(false)
    }, 1000)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main popup */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: isMinimized ? 0.3 : 1,
              x: isMinimized ? window.innerWidth - 200 : 0,
              y: isMinimized ? window.innerHeight - 100 : 0
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed z-50 ${
              isMinimized 
                ? 'bottom-4 right-4 w-48 h-16' 
                : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-w-md'
            }`}
          >
            <div className="bg-aurora-secondary rounded-2xl shadow-2xl border border-aurora-accent1/20 p-4">
              {!isMinimized ? (
                <>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-aurora-text mb-2">
                        ⚠️ Not Legal Advice
                      </h3>
                      <p className="text-sm text-aurora-text/80 leading-relaxed">
                        This tool provides general information only and does not constitute legal advice. 
                        Always consult with a qualified legal professional for specific legal matters.
                      </p>
                    </div>
                    <button
                      onClick={handleDismiss}
                      className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                      aria-label="Dismiss disclaimer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-aurora-text font-medium">
                    Not Legal Advice
                  </span>
                  <button
                    onClick={handleDismiss}
                    className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Dismiss disclaimer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Paint drip animation */}
          {showDrip && (
            <motion.div
              initial={{ scaleY: 0, y: 0 }}
              animate={{ scaleY: 1, y: 20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="fixed bottom-4 right-4 w-2 h-20 bg-gradient-to-b from-aurora-accent1 to-aurora-accent2 z-40"
              style={{ transformOrigin: 'top' }}
            />
          )}
        </>
      )}
    </AnimatePresence>
  )
}
