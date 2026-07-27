// Site Promo (annuncio popup) - letto dal singleton Sanity `sitePromo`,
// gestito dal gestionale (Sito > Promo). Il sito lo mostra come popup all'apertura.
import { client } from './client'

export interface SitePromo {
  enabled?: boolean
  title?: string
  body?: string
  image?: unknown
  productName?: string
  productCode?: string
  fullPrice?: number
  discountType?: string
  discountPercent?: number
  promoPrice?: number
  quantity?: number
  availability?: string
  deliveryTime?: string
  ctaLabel?: string
  ctaUrl?: string
  startDate?: string
  endDate?: string
  _updatedAt?: string
}

// Legge la promo dal CMS (documento pubblicato). Fail-safe: qualunque errore
// (timeout/rate-limit) ritorna null e il sito resta senza popup, senza cadere.
export async function getSitePromo(): Promise<SitePromo | null> {
  try {
    return await client.fetch<SitePromo | null>(
      `*[_id == "sitePromo"][0]{
        enabled, title, body, image,
        productName, productCode,
        fullPrice, discountType, discountPercent, promoPrice,
        quantity, availability, deliveryTime,
        ctaLabel, ctaUrl, startDate, endDate, _updatedAt
      }`
    )
  } catch {
    return null
  }
}
