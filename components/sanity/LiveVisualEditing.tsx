// LiveVisualEditing - Componente per Visual Editing + Auto-Refresh
'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { VisualEditing } from 'next-sanity'

// Questo componente abilita:
// 1. Visual Editing (click-to-edit sugli elementi)
// 2. Auto-refresh quando i contenuti cambiano in Sanity Studio

export default function LiveVisualEditing() {
  const router = useRouter()
  const lastRefreshRef = useRef<number>(0)

  // Funzione per refreshare la pagina (soft refresh di Next.js)
  // Con debounce per evitare refresh multipli
  const refresh = useCallback(() => {
    const now = Date.now()
    // Debounce: almeno 500ms tra un refresh e l'altro
    if (now - lastRefreshRef.current < 500) {
      return
    }
    lastRefreshRef.current = now
    console.log('[LiveVisualEditing] Refreshing page data...')
    router.refresh()
  }, [router])

  useEffect(() => {
    // Listener per messaggi dal parent iframe (Sanity Studio)
    const handleMessage = (event: MessageEvent) => {
      // Sanity Studio manda messaggi quando il contenuto cambia
      const data = event.data

      // Pattern 1: Messaggio di mutazione diretta
      if (data?.type === 'mutation' || data?.type === 'sanity/mutate') {
        console.log('[LiveVisualEditing] Mutation detected')
        setTimeout(refresh, 100)
        return
      }

      // Pattern 2: Messaggio di presentazione
      if (typeof data === 'object' && data !== null) {
        // Verifica se è un messaggio della presentazione Sanity
        if (
          'presentationId' in data ||
          'perspective' in data ||
          data.type?.startsWith?.('presentation/') ||
          data.type?.startsWith?.('visual-editing/')
        ) {
          // Non tutti i messaggi richiedono refresh
          // Solo quelli che indicano cambio dati
          if (
            data.type === 'presentation/refresh' ||
            data.type === 'visual-editing/refresh' ||
            data.action === 'update'
          ) {
            console.log('[LiveVisualEditing] Presentation refresh signal')
            setTimeout(refresh, 100)
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [refresh])

  // Refresh quando la finestra torna in focus (se siamo in iframe)
  useEffect(() => {
    // Solo se siamo in un iframe (presentazione Sanity)
    const isInIframe = window.self !== window.top

    if (!isInIframe) return

    const handleFocus = () => {
      console.log('[LiveVisualEditing] Window focused, refreshing...')
      refresh()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refresh])

  return <VisualEditing />
}
