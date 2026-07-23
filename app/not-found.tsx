// Pagina 404 branded. Renderizzata dentro il root layout (header/footer presenti).
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pagina non trovata - GLOS Italy',
  description: 'La pagina che stai cercando non esiste o è stata spostata.',
}

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white px-4 py-16">
      <div className="max-w-lg w-full text-center">
        <div className="mb-6">
          <span className="text-4xl font-extrabold tracking-tight text-primary">
            GLOS
          </span>
          <span className="ml-1 text-4xl font-extrabold tracking-tight text-metal-700">
            Italy
          </span>
        </div>

        <p className="mb-2 text-6xl md:text-7xl font-extrabold text-primary/20">
          404
        </p>
        <h1 className="mb-3 text-2xl md:text-3xl font-bold text-metal-900">
          Pagina non trovata
        </h1>
        <p className="mb-8 text-metal-500">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            Torna alla home
          </Link>
          <Link href="/prodotti" className="btn-secondary">
            Vedi i prodotti
          </Link>
        </div>
      </div>
    </div>
  )
}
