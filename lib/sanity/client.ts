// Sanity Client Configuration
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Configurazione base
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
export const token = process.env.SANITY_API_TOKEN

// URL dello Studio Sanity per visual editing
export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://glositalystudio.vercel.app'

// Client base - usato per tutte le query
// La configurazione stega viene passata al momento della fetch
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDN per produzione, disabilitato durante draft mode
  perspective: 'published',
  stega: {
    // Stega abilitato ma controllato a runtime via fetch options
    studioUrl,
  },
})

// Helper per eseguire query con configurazione corretta per draft mode
// Questo permette di abilitare stega dinamicamente quando serve
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  isDraftMode = false
): Promise<T> {
  return client.fetch<T>(
    query,
    params,
    isDraftMode
      ? {
          // In draft mode: niente CDN, perspective drafts, stega abilitato
          perspective: 'drafts',
          useCdn: false,
          stega: true,
          token,
        }
      : {
          // Produzione: CDN abilitato, perspective published, niente stega
          perspective: 'published',
          useCdn: true,
          stega: false,
        }
  )
}

// Seleziona client configurato per draft mode (backward compatibility)
export function getClient(isDraftMode = false) {
  if (isDraftMode) {
    return client.withConfig({
      perspective: 'drafts',
      useCdn: false,
      token,
    })
  }
  return client
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
