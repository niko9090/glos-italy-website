// Sanity Client Configuration
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// ===========================================
// CONFIGURATION - Environment Variables
// ===========================================

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

// Token for authenticated requests (server-side only, never expose to client)
export const token = process.env.SANITY_API_TOKEN

// Studio URL for visual editing - MUST match your Sanity Studio deployment
export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://glositalystudio.vercel.app'

// Validation: ensure required env vars are present
if (!projectId) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable. ' +
      'Please add it to your .env.local file.'
  )
}

// ===========================================
// SANITY CLIENT - Base Configuration
// ===========================================

// Client base - used for all queries
// Stega is disabled by default, enabled dynamically in draft mode via fetch options
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDN for production, disabled during draft mode
  perspective: 'published',
  // Stega configuration - CRITICAL for Visual Editing
  stega: {
    enabled: false, // Disabled by default, enabled dynamically in draft mode
    studioUrl,
    // Logger only in development for debugging
    logger: process.env.NODE_ENV === 'development' ? console : undefined,
  },
})

// ===========================================
// SANITY FETCH - Main Data Fetching Function
// ===========================================

/**
 * Fetch data from Sanity with proper configuration for draft/published mode.
 *
 * In Draft Mode:
 * - Uses 'drafts' perspective to show unpublished content
 * - Disables CDN for fresh data
 * - Enables stega for Visual Editing click-to-edit
 * - Uses token for authenticated access
 *
 * In Production:
 * - Uses 'published' perspective for only published content
 * - DISABLES CDN to ensure fresh data after revalidation
 * - Uses cache tags for granular invalidation via webhook
 * - Disables stega (no visual editing metadata)
 *
 * @param tags - Optional cache tags for granular revalidation (e.g., ['page', 'product'])
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  isDraftMode = false,
  tags?: string[]
): Promise<T> {
  // Debug logging in development
  if (isDraftMode && process.env.NODE_ENV === 'development') {
    console.log('[sanityFetch] Draft mode enabled - using drafts perspective with stega')
  }

  // Validate token is available for draft mode
  if (isDraftMode && !token) {
    console.warn(
      '[sanityFetch] Draft mode requested but SANITY_API_TOKEN is not set. ' +
        'Draft content may not load correctly.'
    )
  }

  return client.fetch<T>(
    query,
    params,
    isDraftMode
      ? {
          // Draft mode configuration
          perspective: 'drafts',
          useCdn: false,
          stega: true, // CRITICAL: enables Visual Editing
          token,
          // No caching for real-time preview
          next: { revalidate: 0 },
        }
      : {
          // Production configuration
          perspective: 'published',
          // CRITICO: useCdn: false per garantire dati freschi dopo revalidation
          // Il CDN di Sanity ha cache separata che non si invalida con revalidatePath/revalidateTag
          useCdn: false,
          stega: false,
          // Cache configuration for on-demand revalidation
          next: {
            // Tags for granular invalidation via revalidateTag()
            tags: tags || ['sanity'],
            // Fallback revalidation after 60 seconds (ISR)
            revalidate: 60,
          },
        }
  )
}

// ===========================================
// GET CLIENT - Returns configured client instance
// ===========================================

/**
 * Returns a Sanity client configured for the given mode.
 * Use this when you need a client instance (e.g., for useLiveQuery).
 *
 * Prefer sanityFetch() for most data fetching needs.
 */
export function getClient(isDraftMode = false) {
  if (isDraftMode) {
    return client.withConfig({
      perspective: 'drafts',
      useCdn: false,
      token,
      stega: {
        enabled: true,
        studioUrl,
      },
    })
  }
  return client
}

// ===========================================
// IMAGE URL BUILDER
// ===========================================

const builder = imageUrlBuilder(client)

/**
 * Returns an image URL builder for Sanity images.
 * Chain methods like .width(), .height(), .format() before calling .url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Get optimized image URL with optional dimensions.
 * Automatically applies format optimization and max fit.
 */
export function getImageUrl(
  source: SanityImageSource,
  width?: number,
  height?: number
): string {
  let imageBuilder = builder.image(source).auto('format').fit('max')

  if (width) {
    imageBuilder = imageBuilder.width(width)
  }
  if (height) {
    imageBuilder = imageBuilder.height(height)
  }

  return imageBuilder.url()
}

/**
 * Get image URL with blur placeholder for Next.js Image component.
 * Returns both the full URL and a tiny blurred version for placeholder.
 */
export function getImageWithBlur(source: SanityImageSource) {
  const url = urlFor(source).width(1200).auto('format').url()
  const blurDataURL = urlFor(source).width(24).blur(10).url()

  return {
    url,
    blurDataURL,
  }
}
