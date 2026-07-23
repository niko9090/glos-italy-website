import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Lock } from 'lucide-react'
import { client } from '@/lib/sanity/client'

export const metadata: Metadata = {
  title: 'Area Riservata - GLOS Italy',
  description: 'Area riservata ai clienti GLOS Italy. Presto disponibile.',
  // Finché è in "coming soon" non va indicizzata.
  robots: { index: false, follow: false },
}

// Non usare cache statica: lo stato dell'interruttore può cambiare dal gestionale.
export const dynamic = 'force-dynamic'

// Portale clienti (gestionale). Sovrascrivibile da Sanity quando si va online.
const DEFAULT_PORTAL_URL = 'https://gestionale.glos-hub.org/portale/login'

interface ReservedAreaConfig {
  enabled?: boolean
  url?: string
}

export default async function AreaRiservataPage() {
  // Legge l'interruttore dal CMS. Se il CMS non risponde, resta in "coming soon"
  // (mai reindirizzare per errore).
  let cfg: ReservedAreaConfig | null = null
  try {
    cfg = await client.fetch<ReservedAreaConfig>(
      `*[_type == "siteSettings"][0]{ "enabled": reservedAreaEnabled, "url": reservedAreaUrl }`
    )
  } catch {
    cfg = null
  }

  // Interruttore ACCESO -> reindirizza al portale clienti del gestionale.
  if (cfg?.enabled) {
    redirect(cfg.url || DEFAULT_PORTAL_URL)
  }

  // Interruttore SPENTO -> pagina "presto disponibile".
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-16">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8">
          <span className="text-4xl font-extrabold tracking-tight text-primary">GLOS</span>
          <span className="ml-1 text-4xl font-extrabold tracking-tight text-metal-700">Italy</span>
        </div>

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-9 w-9 text-primary" />
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          Area Riservata
        </p>
        <h1 className="mb-4 text-3xl md:text-4xl font-bold text-metal-900">
          Presto disponibile
        </h1>
        <p className="mb-8 text-metal-500 leading-relaxed">
          Stiamo preparando la tua area clienti riservata.
          <br className="hidden sm:block" />
          Sarà disponibile qui a breve.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            Torna alla home
          </Link>
          <Link href="/contatti" className="btn-secondary">
            Contattaci
          </Link>
        </div>
      </div>
    </div>
  )
}
