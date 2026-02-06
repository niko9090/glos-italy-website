'use client'

import { useEffect } from 'react'

interface TawkToChatProps {
  propertyId?: string
  widgetId?: string
}

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>
    Tawk_LoadStart?: Date
  }
}

export function TawkToChat({ propertyId, widgetId }: TawkToChatProps) {
  useEffect(() => {
    // Non caricare se mancano le credenziali
    if (!propertyId || !widgetId) {
      console.log('Tawk.to: propertyId o widgetId mancanti')
      return
    }

    // Evita doppio caricamento
    if (document.getElementById('tawkto-script')) {
      return
    }

    // Inizializza Tawk API
    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_LoadStart = new Date()

    // Crea e inserisci lo script
    const script = document.createElement('script')
    script.id = 'tawkto-script'
    script.async = true
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')

    document.head.appendChild(script)

    // Cleanup
    return () => {
      const existingScript = document.getElementById('tawkto-script')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [propertyId, widgetId])

  return null // Il widget viene iniettato da Tawk.to
}
