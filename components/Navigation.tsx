'use client'

import { motion } from 'framer-motion'
import { FileText, BookOpen, Shield, MessageCircle, Settings, Scale, User, FileText as LegalSummaries } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useState } from 'react'

const navigation = [
  { name: 'Home', href: '/', icon: null },
  { name: 'Document Analyzer', href: '/document-analyzer', icon: FileText },
  { name: 'Contract Analysis', href: '#contract', icon: Scale },
  { name: 'Term Explanation', href: '#terms', icon: BookOpen },
  { name: 'Compliance', href: '#compliance', icon: Shield },
  { name: 'Chat Assistant', href: '#chat', icon: MessageCircle },
  { name: 'Legal Summaries', href: '/legal-summaries', icon: LegalSummaries },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Navigation() {
  const { toneMode, privacyMode, setToneMode, setPrivacyMode } = useTheme()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="bg-aurora-primary shadow-lg border-b border-aurora-secondary sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-aurora-accent1 rounded-lg flex items-center justify-center">
              <span className="text-aurora-primary font-bold text-sm">⚖️</span>
            </div>
            <span className="font-semibold text-aurora-text text-xl">JuriSense</span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigation.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => scrollToSection(item.href)}
                className="flex items-center gap-2 text-aurora-text/80 hover:text-aurora-accent1 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-aurora-secondary/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span className="text-sm">{item.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 text-aurora-text/80 hover:text-aurora-accent1 transition-colors"
              aria-label="Open settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-aurora-secondary rounded-lg shadow-lg border border-aurora-accent1/20 p-4 z-50"
              >
                <h3 className="font-medium text-aurora-text mb-3">Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-aurora-text/80 mb-2">
                      Tone Mode
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setToneMode('formal')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          toneMode === 'formal'
                            ? 'bg-aurora-accent1 text-aurora-primary'
                            : 'bg-aurora-primary text-aurora-text/60 hover:bg-aurora-accent1/20 hover:text-aurora-accent1'
                        }`}
                      >
                        Formal
                      </button>
                      <button
                        onClick={() => setToneMode('casual')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          toneMode === 'casual'
                            ? 'bg-aurora-accent1 text-aurora-primary'
                            : 'bg-aurora-primary text-aurora-text/60 hover:bg-aurora-accent1/20 hover:text-aurora-accent1'
                        }`}
                      >
                        Casual 😊
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-aurora-text/80 mb-2">
                      Privacy Mode
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPrivacyMode('local')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          privacyMode === 'local'
                            ? 'bg-aurora-accent1 text-aurora-primary'
                            : 'bg-aurora-primary text-aurora-text/60 hover:bg-aurora-accent1/20 hover:text-aurora-accent1'
                        }`}
                      >
                        Local
                      </button>
                      <button
                        onClick={() => setPrivacyMode('cloud')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          privacyMode === 'cloud'
                            ? 'bg-aurora-accent1 text-aurora-primary'
                            : 'bg-aurora-primary text-aurora-text/60 hover:bg-aurora-accent1/20 hover:text-aurora-accent1'
                        }`}
                      >
                        Cloud
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}