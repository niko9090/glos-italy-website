// Sanity Client Configuration
import { createClient, type QueryOptions } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Configurazione base
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
export const token = process.env.SANITY_API_TOKEN

// URL dello Studio Sanity per visual editing
export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://glositalystudio.vercel.app'

// Client base condiviso
const baseClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disabilitato per garantire dati freschi
  perspective: 'published',
})

// Client per query pubbliche (senza stega)
export const client = baseClient

// Client per preview/draft mode (con token e stega)
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // No cache per vedere modifiche in tempo reale
  token,
  perspective: 'previewDrafts', // Usa previewDrafts invece di drafts per next-sanity v9
  stega: {
    enabled: true,
    studioUrl,
  },
})

// Seleziona client basato su modalita draft
export function getClient(isDraftMode = false) {
  return isDraftMode ? previewClient : client
}

// Helper per opzioni di fetch in base a draft mode
export function getFetchOptions(isDraftMode = false): QueryOptions {
  if (isDraftMode) {
    // In draft mode: no cache, sempre fresco
    return {
      next: { revalidate: 0 },
    }
  }
  // In produzione: revalidate ogni 60 secondi
  return {
    next: { revalidate: 60 },
  }
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
