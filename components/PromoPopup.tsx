'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import type { SitePromo } from '@/lib/sanity/promo'

// Popup promozionale mostrato all'apertura del sito, UNA VOLTA PER SESSIONE.
// I dati arrivano dal gestionale (Sito > Promo) tramite il singleton Sanity `sitePromo`.
// Il layout monta questo componente solo quando la promo è attiva (enabled).
// La finestra temporale (start/end) e il "già visto in questa sessione" sono gestiti qui.

const SEEN_KEY = 'glos_promo_seen'

function formatEuro(n: number): string {
  return new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

export default function PromoPopup({ promo }: { promo: SitePromo }) {
  const [show, setShow] = useState(false)

  // Firma della promo: se cambia (nuovo contenuto/aggiornamento) il popup si ripresenta
  // anche nella stessa sessione a chi l'aveva già chiuso.
  const signature = promo._updatedAt || promo.title || 'promo'

  useEffect(() => {
    // Finestra temporale (facoltativa): non mostrare fuori dal periodo impostato.
    const now = new Date()
    if (promo.startDate && new Date(promo.startDate) > now) return
    if (promo.endDate && new Date(promo.endDate + 'T23:59:59') < now) return

    try {
      if (sessionStorage.getItem(SEEN_KEY) === signature) return
    } catch {
      // sessionStorage non disponibile: mostra comunque una volta.
    }

    const timer = setTimeout(() => setShow(true), 900)
    return () => clearTimeout(timer)
  }, [promo.startDate, promo.endDate, signature])

  // Blocca lo scroll del body mentre il popup è aperto.
  useEffect(() => {
    if (!show) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [show])

  // Chiusura con ESC.
  useEffect(() => {
    if (!show) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [show])

  const close = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, signature)
    } catch {
      /* ignora */
    }
    setShow(false)
  }

  if (!show) return null

  const imageUrl = isValidImage(promo.image) ? safeImageUrl(promo.image, 720) : null
  const hasFullPrice = typeof promo.fullPrice === 'number'
  const hasPromoPrice = typeof promo.promoPrice === 'number'
  const showStrike =
    hasFullPrice && hasPromoPrice && (promo.promoPrice as number) < (promo.fullPrice as number)
  const bigPrice = hasPromoPrice ? (promo.promoPrice as number) : hasFullPrice ? (promo.fullPrice as number) : null
  const percent =
    typeof promo.discountPercent === 'number' && promo.discountPercent > 0
      ? Math.round(promo.discountPercent)
      : null
  const ctaExternal = !!promo.ctaUrl && /^https?:\/\//i.test(promo.ctaUrl)

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={promo.title || 'Promozione'}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_.2s_ease-out]">
        <button
          onClick={close}
          aria-label="Chiudi"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 shadow flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {imageUrl && (
          <div className="relative w-full h-48 bg-gray-100">
            <Image src={imageUrl} alt={promo.productName || promo.title || ''} fill className="object-cover" />
            {percent && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                -{percent}%
              </span>
            )}
          </div>
        )}

        <div className="p-6">
          {promo.title && <h2 className="text-2xl font-bold text-gray-900">{promo.title}</h2>}
          {promo.body && <p className="mt-2 text-gray-600">{promo.body}</p>}

          {(promo.productName || promo.productCode) && (
            <p className="mt-4 text-gray-800">
              <span className="font-semibold">{promo.productName}</span>
              {promo.productCode && <span className="ml-2 text-sm text-gray-400">{promo.productCode}</span>}
            </p>
          )}

          {bigPrice !== null && (
            <div className="mt-3 flex items-end gap-3">
              {showStrike && (
                <span className="text-gray-400 line-through">{formatEuro(promo.fullPrice as number)} €</span>
              )}
              <span className="text-3xl font-extrabold text-green-600">{formatEuro(bigPrice)} €</span>
              {!imageUrl && percent && (
                <span className="mb-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  -{percent}%
                </span>
              )}
            </div>
          )}

          <p className="mt-3 text-sm">
            {promo.availability === 'order' ? (
              <span className="inline-flex items-center gap-1.5 text-amber-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Su ordinazione
                {promo.deliveryTime ? ` — consegna in ${promo.deliveryTime}` : ''}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Pronta consegna
                {typeof promo.quantity === 'number' ? ` — ${promo.quantity} disponibili` : ''}
              </span>
            )}
          </p>

          {promo.ctaLabel && promo.ctaUrl && (
            <a
              href={promo.ctaUrl}
              target={ctaExternal ? '_blank' : undefined}
              rel={ctaExternal ? 'noopener noreferrer' : undefined}
              onClick={close}
              className="mt-5 block w-full text-center px-5 py-3 bg-primary hover:opacity-90 text-white font-semibold rounded-lg transition-opacity"
            >
              {promo.ctaLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
