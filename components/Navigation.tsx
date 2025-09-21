'use client'

import { motion } from 'framer-motion'
<<<<<<< HEAD
import { FileText, Moon, Sun } from 'lucide-react'
=======
import { FileText, BookOpen, Shield, MessageCircle, Settings } from 'lucide-react'
>>>>>>> parent of 4d8d5b0 (cursorv2)
import { useTheme } from './ThemeProvider'
import { useState } from 'react'

const navigation = [
<<<<<<< HEAD
  { name: 'Home', href: '/', icon: null },
  { name: 'Document Analyzer', href: '/document-analyzer', icon: FileText },
  { name: 'JuriSense AI', href: '/jurisense-ai', icon: null },
=======
  { name: 'Contract Analysis', href: '#contract', icon: FileText },
  { name: 'Term Explanation', href: '#terms', icon: BookOpen },
  { name: 'Compliance', href: '#compliance', icon: Shield },
>>>>>>> parent of 4d8d5b0 (cursorv2)
]

export function Navigation() {
  const { themeMode, toggleTheme } = useTheme()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleNavigation = (href: string) => {
    setIsNavigating(true)
    
    // Paint-fill animation
    setTimeout(() => {
      if (href.startsWith('#')) {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        // For future routing implementation
        console.log('Navigate to:', href)
      }
      setIsNavigating(false)
    }, 500)
  }

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <>
      {/* Paint-fill animation overlay */}
      {isNavigating && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1, opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-aurora-accent1 to-aurora-accent2"
          style={{ borderRadius: '50%', transformOrigin: 'center' }}
        />
      )}
      
      <nav className="dark:bg-aurora-primary light:bg-white shadow-lg border-b dark:border-aurora-secondary light:border-gray-200 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 dark:bg-aurora-accent1 light:bg-light-accent1 rounded-lg flex items-center justify-center">
                <span className="dark:text-aurora-primary light:text-white font-bold text-sm">⚖️</span>
              </div>
              <span className="font-semibold dark:text-aurora-text light:text-light-text text-xl">JuriSense</span>
            </motion.div>
=======
    <nav className="bg-aurora-primary shadow-lg border-b border-aurora-secondary sticky top-0 z-40">
=======
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
>>>>>>> parent of 4d8d5b0 (cursorv2)
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚖️</span>
            </div>
            <span className="font-semibold text-gray-900">Lawyer AI</span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(item.href)}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </motion.button>
            ))}
          </div>

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Open settings"
            >
              <Settings className="h-5 w-5" />
            </button>
<<<<<<< HEAD
          </div>
>>>>>>> parent of 0aa0bd5 (cursorv3)

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNavigation(item.href)}
                  className="flex items-center gap-2 dark:text-aurora-text/80 light:text-light-text/80 hover:dark:text-aurora-accent1 hover:light:text-light-accent1 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:dark:bg-aurora-secondary/50 hover:light:bg-gray-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span className="text-sm">{item.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Dark/Light Mode Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 dark:text-aurora-text/80 light:text-light-text/80 hover:dark:text-aurora-accent1 hover:light:text-light-accent1 transition-colors rounded-lg hover:dark:bg-aurora-secondary/50 hover:light:bg-gray-100"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {themeMode === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.button>
=======

            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
              >
                <h3 className="font-medium text-gray-900 mb-3">Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tone Mode
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setToneMode('formal')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          toneMode === 'formal'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Formal
                      </button>
                      <button
                        onClick={() => setToneMode('casual')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          toneMode === 'casual'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Casual 😊
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Privacy Mode
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPrivacyMode('local')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          privacyMode === 'local'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Local
                      </button>
                      <button
                        onClick={() => setPrivacyMode('cloud')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          privacyMode === 'cloud'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Cloud
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
>>>>>>> parent of 4d8d5b0 (cursorv2)
          </div>
        </div>
      </nav>
    </>
  )
}
