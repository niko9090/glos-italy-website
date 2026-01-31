// Language Selector Component
'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Globe } from 'lucide-react'
import { useLanguage, LANGUAGES, type Language } from '@/lib/context/LanguageContext'

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'flags-only'
  className?: string
}

export default function LanguageSelector({ variant = 'default', className = '' }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentLang = LANGUAGES.find(l => l.id === language) || LANGUAGES[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  if (variant === 'flags-only') {
    return (
      <div className={`flex gap-1 ${className}`}>
        {LANGUAGES.map(lang => (
          <button
            key={lang.id}
            onClick={() => handleSelect(lang.id)}
            className={`p-1.5 rounded-md transition-all ${
              language === lang.id
                ? 'bg-primary/10 scale-110'
                : 'hover:bg-gray-100 opacity-60 hover:opacity-100'
            }`}
            title={lang.label}
          >
            <span className="text-lg">{lang.flag}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          variant === 'compact'
            ? 'hover:bg-gray-100'
            : 'bg-gray-100 hover:bg-gray-200'
        }`}
      >
        {variant === 'compact' ? (
          <Globe className="w-4 h-4 text-gray-600" />
        ) : (
          <span className="text-lg">{currentLang.flag}</span>
        )}
        <span className="text-sm font-medium text-gray-700">
          {variant === 'compact' ? currentLang.id.toUpperCase() : currentLang.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 min-w-[150px]"
          >
            {LANGUAGES.map(lang => (
              <button
                key={lang.id}
                onClick={() => handleSelect(lang.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  language === lang.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
