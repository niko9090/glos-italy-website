// Language Context - Gestione lingua corrente
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'it' | 'en' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (value: unknown) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: 'it', label: 'Italiano', flag: '🇮🇹' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
]

export { LANGUAGES }

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('it')

  // Load saved language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('glos-language') as Language | null
    if (saved && ['it', 'en', 'es'].includes(saved)) {
      setLanguageState(saved)
    } else {
      // Try to detect from browser
      const browserLang = navigator.language.slice(0, 2)
      if (['it', 'en', 'es'].includes(browserLang)) {
        setLanguageState(browserLang as Language)
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('glos-language', lang)
    // Update html lang attribute
    document.documentElement.lang = lang
  }

  // Translation function
  const t = (value: unknown): string => {
    if (!value) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'number') return String(value)
    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>
      // Multilingual object {it, en, es}
      if ('it' in obj || 'en' in obj || 'es' in obj) {
        // Return current language, fallback to Italian, then English
        const result = obj[language] || obj.it || obj.en || obj.es || ''
        return String(result)
      }
      // Address object
      if ('street' in obj || 'city' in obj) {
        const addr = obj as { street?: string; city?: string; province?: string; postalCode?: string; country?: string }
        return [addr.street, addr.city, addr.province, addr.postalCode, addr.country]
          .filter(Boolean)
          .join(', ')
      }
    }
    return ''
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Hook semplificato per la traduzione
export function useTranslation() {
  const { t, language } = useLanguage()
  return { t, language }
}
