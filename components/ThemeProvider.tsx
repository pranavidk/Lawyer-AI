'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type ToneMode = 'formal' | 'casual'
type PrivacyMode = 'local' | 'cloud'
type ThemeMode = 'dark' | 'light'

interface ThemeContextType {
  toneMode: ToneMode
  privacyMode: PrivacyMode
  themeMode: ThemeMode
  setToneMode: (mode: ToneMode) => void
  setPrivacyMode: (mode: PrivacyMode) => void
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [toneMode, setToneMode] = useState<ToneMode>('formal')
  const [privacyMode, setPrivacyMode] = useState<PrivacyMode>('local')
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark')

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedTone = localStorage.getItem('toneMode') as ToneMode
    const savedPrivacy = localStorage.getItem('privacyMode') as PrivacyMode
    const savedTheme = localStorage.getItem('themeMode') as ThemeMode
    
    if (savedTone) setToneMode(savedTone)
    if (savedPrivacy) setPrivacyMode(savedPrivacy)
    if (savedTheme) setThemeMode(savedTheme)
  }, [])

  useEffect(() => {
    // Save preferences to localStorage
    localStorage.setItem('toneMode', toneMode)
    localStorage.setItem('privacyMode', privacyMode)
    localStorage.setItem('themeMode', themeMode)
    
    // Apply theme to document
    if (themeMode === 'light') {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
  }, [toneMode, privacyMode, themeMode])

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{
      toneMode,
      privacyMode,
      themeMode,
      setToneMode,
      setPrivacyMode,
      setThemeMode,
      toggleTheme,
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
