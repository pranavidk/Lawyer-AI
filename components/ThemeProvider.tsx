'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type ToneMode = 'formal' | 'casual'
type PrivacyMode = 'local' | 'cloud'

interface ThemeContextType {
  toneMode: ToneMode
  privacyMode: PrivacyMode
  setToneMode: (mode: ToneMode) => void
  setPrivacyMode: (mode: PrivacyMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [toneMode, setToneMode] = useState<ToneMode>('formal')
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>('local')

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedTone = localStorage.getItem('toneMode') as ToneMode
    const savedPrivacy = localStorage.getItem('privacyMode') as PrivacyMode
    
    if (savedTone) setToneMode(savedTone)
    if (savedPrivacy) setPrivacyMode(savedPrivacy)
  }, [])

  useEffect(() => {
    // Save preferences to localStorage
    localStorage.setItem('toneMode', toneMode)
    localStorage.setItem('privacyMode', privacyMode)
  }, [toneMode, privacyMode])

  return (
    <ThemeContext.Provider value={{
      toneMode,
      privacyMode,
      setToneMode,
      setPrivacyMode,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
