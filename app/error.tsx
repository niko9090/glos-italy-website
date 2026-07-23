'use client'

// Error boundary a livello di route/segmento.
// Cattura gli errori di rendering (es. dati Sanity malformati o timeout)
// evitando che una singola pagina/sezione faccia cadere l'intero sito.
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log lato client per diagnostica (visibile in console/monitoring)
    console.error('[GLOS] Errore di rendering:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Wordmark GLOS */}
        <div className="mb-8">
          <span className="text-4xl font-extrabold tracking-tight text-primary">
            GLOS
          </span>
          <span className="ml-1 text-4xl font-extrabold tracking-tight text-metal-700">
            Italy
          </span>
        </div>

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h1 className="mb-3 text-2xl md:text-3xl font-bold text-metal-900">
          Si è verificato un problema
        </h1>
        <p className="mb-8 text-metal-500">
          Non siamo riusciti a caricare correttamente questa sezione. Riprova tra
          qualche istante.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => reset()} className="btn-primary">
            Riprova
          </button>
          <a href="/" className="btn-secondary">
            Torna alla home
          </a>
        </div>
      </div>
    </div>
  )
}
