'use client'

// Global error boundary: sostituisce COMPLETAMENTE il root layout quando
// l'errore avviene nel layout stesso (deve fornire <html> e <body> propri).
// Usa stili inline perche' i CSS/le classi del layout potrebbero non essere disponibili.
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GLOS] Errore globale:', error)
  }, [error])

  return (
    <html lang="it">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          color: '#171717',
          fontFamily:
            "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: '2rem 1rem',
        }}
      >
        <div style={{ maxWidth: '32rem', width: '100%', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <span
              style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: '#0047AB',
              }}
            >
              GLOS
            </span>
            <span
              style={{
                marginLeft: '0.25rem',
                fontSize: '2.25rem',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: '#404040',
              }}
            >
              Italy
            </span>
          </div>

          <h1
            style={{
              margin: '0 0 0.75rem',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#0a0a0a',
            }}
          >
            Si è verificato un problema
          </h1>
          <p style={{ margin: '0 0 2rem', color: '#737373' }}>
            Il sito ha riscontrato un errore imprevisto. Riprova tra qualche
            istante.
          </p>

          <button
            onClick={() => reset()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '44px',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: '#0047AB',
              color: '#ffffff',
              fontWeight: 500,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Riprova
          </button>
        </div>
      </body>
    </html>
  )
}
