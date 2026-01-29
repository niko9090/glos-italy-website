// Sanity Client Configuration
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Configurazione base
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
export const token = process.env.SANITY_API_TOKEN

// Client per query (senza token - dati pubblici)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Cache CDN per performance
  perspective: 'published', // Solo contenuti pubblicati
})

// Client per preview/draft mode (con token - vede bozze)
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // No cache per vedere modifiche in tempo reale
  token,
  perspective: 'drafts', // Vede sia bozze che pubblicati (rinominato da 'previewDrafts')
  stega: {
    enabled: true, // Abilita visual editing overlays
    studioUrl: '/studio', // URL relativo di Sanity Studio
  },
})

// Seleziona client basato su modalita draft
export function getClient(isDraftMode = false) {
  return isDraftMode ? previewClient : client
}

// Builder per URL immagini
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Helper per immagini responsive
export function getImageUrl(
  source: SanityImageSource,
  width?: number,
  height?: number
) {
  let imageBuilder = builder.image(source).auto('format').fit('max')

  if (width) {
    imageBuilder = imageBuilder.width(width)
  }
  if (height) {
    imageBuilder = imageBuilder.height(height)
  }

  return imageBuilder.url()
}

// Helper per immagini con blur placeholder
export async function getImageWithBlur(source: SanityImageSource) {
  const url = urlFor(source).width(1200).url()
  const blurUrl = urlFor(source).width(24).blur(10).url()

  return {
    url,
    blurDataURL: blurUrl,
  }
}
