'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Settings, Check } from 'lucide-react'

type CookieConsent = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  timestamp: number
}

const COOKIE_CONSENT_KEY = 'glos-cookie-consent'

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
    timestamp: 0,
  })

  useEffect(() => {
    // Check if consent was already given
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent) as CookieConsent
        setConsent(parsed)
        // Don't show banner if consent was given
        setShowBanner(false)
      } catch {
        // Invalid consent, show banner
        setShowBanner(true)
      }
    } else {
      // No consent saved, show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithTimestamp = {
      ...newConsent,
      timestamp: Date.now(),
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentWithTimestamp))
    setConsent(consentWithTimestamp)
    setShowBanner(false)
    setShowSettings(false)

    // Dispatch event for analytics scripts to listen to
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consentWithTimestamp }))
  }

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    })
  }

  const acceptNecessary = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    })
  }

  const savePreferences = () => {
    saveConsent(consent)
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      >
        <div className="container-glos">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-4xl mx-auto">
            {/* Main Banner */}
            {!showSettings ? (
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Utilizziamo i cookie
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Questo sito utilizza cookie tecnici necessari al funzionamento e cookie analitici
                      per migliorare la tua esperienza. Puoi accettare tutti i cookie o personalizzare
                      le tue preferenze.{' '}
                      <Link href="/cookie" className="text-primary hover:underline">
                        Scopri di più
                      </Link>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={acceptAll}
                        className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Accetta tutti
                      </button>
                      <button
                        onClick={acceptNecessary}
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Solo necessari
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-6 py-2.5 text-gray-600 font-medium hover:text-gray-900 transition-colors flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Personalizza
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={acceptNecessary}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Chiudi"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Settings Panel */
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Preferenze Cookie
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Chiudi impostazioni"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Necessary Cookies */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">Cookie Necessari</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Sempre attivi
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Essenziali per il funzionamento del sito. Non possono essere disattivati.
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-not-allowed">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Cookie Analitici</h4>
                      <p className="text-sm text-gray-600">
                        Ci aiutano a capire come i visitatori interagiscono con il sito,
                        raccogliendo informazioni in forma anonima.
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <button
                        onClick={() => setConsent(prev => ({ ...prev, analytics: !prev.analytics }))}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          consent.analytics ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                            consent.analytics ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Cookie di Marketing</h4>
                      <p className="text-sm text-gray-600">
                        Utilizzati per tracciare i visitatori e mostrare annunci pertinenti.
                        Attualmente non utilizziamo cookie di marketing.
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <button
                        onClick={() => setConsent(prev => ({ ...prev, marketing: !prev.marketing }))}
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          consent.marketing ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                            consent.marketing ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={savePreferences}
                    className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Salva preferenze
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Accetta tutti
                  </button>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Per maggiori informazioni, consulta la nostra{' '}
                  <Link href="/cookie" className="text-primary hover:underline">Cookie Policy</Link>
                  {' '}e la{' '}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
