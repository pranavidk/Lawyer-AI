'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface AuroraSplashScreenProps {
  onComplete: () => void
}

export function AuroraSplashScreen({ onComplete }: AuroraSplashScreenProps) {
  const [showSplash, setShowSplash] = useState(true)
  const [currentLetter, setCurrentLetter] = useState(0)

  const text = "JuriSense"
  const catchphrase = "Your AI Legal Companion — Secure, Smart, Simple"

  useEffect(() => {
    // Animate letters one by one
    const letterInterval = setInterval(() => {
      setCurrentLetter(prev => {
        if (prev < text.length - 1) {
          return prev + 1
        } else {
          clearInterval(letterInterval)
          return prev
        }
      })
    }, 200)

    // Complete splash screen after all animations
    const completeTimer = setTimeout(() => {
      setShowSplash(false)
      setTimeout(onComplete, 500) // Wait for fade out
    }, 4000)

    return () => {
      clearInterval(letterInterval)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  if (!showSplash) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0A0A1E 0%, #1B1B3A 50%, #0A0A1E 100%)'
        }}
      >
        <div className="text-center">
          {/* Animated JuriSense Text */}
          <div className="flex justify-center mb-8">
            {text.split('').map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.5 }}
                animate={{
                  opacity: index <= currentLetter ? 1 : 0,
                  y: index <= currentLetter ? 0 : 50,
                  scale: index <= currentLetter ? 1 : 0.5
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: index * 0.1
                }}
                className="text-6xl md:text-8xl font-bold text-aurora-text mr-2"
                style={{
                  background: index <= currentLetter 
                    ? 'linear-gradient(45deg, #4CFFD9, #FF66A3)' 
                    : 'transparent',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: index <= currentLetter ? 'transparent' : '#E6E6FA'
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Catchphrase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: currentLetter >= text.length - 1 ? 1 : 0,
              y: currentLetter >= text.length - 1 ? 0 : 30
            }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-aurora-text/80 font-medium max-w-2xl mx-auto px-4"
          >
            {catchphrase}
          </motion.div>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentLetter >= text.length - 1 ? 1 : 0
            }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex justify-center mt-8 space-x-2"
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-aurora-accent1 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
            ))}
          </motion.div>

          {/* Aurora effect overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(76, 255, 217, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(255, 102, 163, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(76, 255, 217, 0.1) 0%, transparent 50%)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
