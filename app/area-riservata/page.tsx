import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ShieldCheck, Check, Globe, ArrowLeft, Clock } from 'lucide-react'
import { client } from '@/lib/sanity/client'

export const metadata: Metadata = {
  title: 'Area Riservata - GLOS Italy',
  description: 'Area riservata ai clienti GLOS Italy. Presto disponibile.',
  // Finché è in "coming soon" non va indicizzata.
  robots: { index: false, follow: false },
}

// Lo stato dell'interruttore può cambiare dal gestionale: niente cache statica.
export const dynamic = 'force-dynamic'

// Portale clienti (gestionale). Sovrascrivibile da Sanity quando si va online.
const DEFAULT_PORTAL_URL = 'https://gestionale.glos-hub.org/portale/login'

const FEATURES = [
  'Progettazione e produzione su misura',
  'Lavori a progetto, soluzioni chiavi in mano',
  'Automazione industriale e controllo di processo',
  'Assistenza dedicata dopo la consegna',
]

interface ReservedAreaConfig {
  enabled?: boolean
  url?: string
}

export default async function AreaRiservataPage() {
  // Legge l'interruttore dal CMS. Se il CMS non risponde, resta in "coming soon"
  // (non reindirizzare mai per errore).
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

  // Interruttore SPENTO -> stessa card del portale, ma con il "presto disponibile".
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-metal-50 via-white to-primary/5">
      <div className="w-full max-w-[62rem] grid lg:grid-cols-[1.05fr_1fr] rounded-[1.75rem] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] ring-1 ring-metal-200/70 bg-white">

        {/* ═══════════ Pannello identità GLOS (come nel portale) ═══════════ */}
        <div className="relative hidden lg:flex flex-col justify-between p-8 text-white overflow-hidden bg-gradient-to-br from-primary-light via-primary to-primary-dark">
          {/* griglia "blueprint" */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          {/* bagliori */}
          <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 w-80 h-80 rounded-full bg-black/10 blur-3xl" />
          {/* wordmark in filigrana */}
          <div className="pointer-events-none absolute -bottom-6 -right-3 select-none text-[7rem] leading-none font-black tracking-tighter text-white/[0.10]">
            GLOS
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm ring-1 ring-white/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Area riservata clienti
            </span>
            <div className="mt-5 text-3xl font-extrabold tracking-tight">
              GLOS <span className="font-semibold text-white/80">Italy</span>
            </div>
            <p className="mt-5 text-xl font-semibold leading-snug max-w-sm">
              Soluzioni meccaniche per l&apos;eccellenza industriale
            </p>
            <p className="mt-2 text-sm text-white/85 max-w-sm leading-relaxed">
              Dal cuore della Motor Valley progettiamo e produciamo macchinari su misura:
              ogni impianto è un lavoro a progetto, cucito sulle esigenze del cliente.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-2 text-sm mt-6">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </span>
                <span className="text-white/95">{f}</span>
              </div>
            ))}
          </div>

          <div className="relative flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/85 pt-5 mt-6 border-t border-white/15">
            <a href="https://glos.it" target="_blank" rel="noopener" className="hover:text-white inline-flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> glos.it
            </a>
            <span className="text-white/30">·</span>
            <a href="mailto:info@glos.it" className="hover:text-white">info@glos.it</a>
            <span className="text-white/30">·</span>
            <a href="tel:+390522967690" className="hover:text-white">+39 0522 967690</a>
          </div>
        </div>

        {/* ═══════════ Pannello "coming soon" (al posto del form) ═══════════ */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6 lg:hidden text-2xl font-extrabold tracking-tight text-primary">
            GLOS <span className="text-metal-700">Italy</span>
          </div>

          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <Clock className="w-3.5 h-3.5" /> Presto disponibile
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-metal-900">Area Riservata</h1>
          <p className="mt-3 text-metal-500 leading-relaxed max-w-sm">
            Stiamo preparando la tua area clienti riservata: documenti, progetti, assistenza
            e molto altro in un unico posto. Sarà disponibile qui a breve.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Torna al sito
            </Link>
            <Link href="/contatti" className="btn-secondary inline-flex items-center justify-center">
              Contattaci
            </Link>
          </div>

          <div className="mt-8 pt-5 border-t border-metal-100">
            <p className="text-xs text-metal-400">
              Sei già cliente e ti serve assistenza? Scrivi a{' '}
              <a href="mailto:tech@glos.it" className="text-primary hover:underline">tech@glos.it</a>{' '}
              o chiama{' '}
              <a href="tel:+390522967690" className="text-primary hover:underline">+39 0522 967690</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
