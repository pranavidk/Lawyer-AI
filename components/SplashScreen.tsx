'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500) // Wait for fade out animation
    }, 3000) // Show for 3 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  const letters = ['J', 'u', 'r', 'i', 'S', 'e', 'n', 's', 'e']

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #0A0A1E 0%, #1B1B3A 100%)'
          }}
        >
          <div className="text-center">
            {/* Animated Logo */}
            <div className="flex justify-center mb-8">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                  className="text-6xl md:text-8xl font-bold text-aurora-text"
                  style={{
                    textShadow: `0 0 20px #4CFFD9, 0 0 40px #4CFFD9, 0 0 60px #4CFFD9`
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Catchphrase */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-xl md:text-2xl text-aurora-text/80 font-light"
            >
              Your AI Legal Companion — Secure, Smart, Simple
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="mt-8 flex justify-center"
            >
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full bg-aurora-accent1"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
