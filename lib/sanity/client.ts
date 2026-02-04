// Sanity Client Configuration - v3.0.0
// Data fetching is now handled by live.ts (defineLive)
// This file only exports: config values, client instance, and image utilities
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

// Client base - used for image URL builder and draft-mode enable endpoint
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    enabled: false,
    studioUrl,
  },
})

// ===========================================
// IMAGE URL BUILDER
// ===========================================

const builder = imageUrlBuilder(client)

/**
 * Check if a Sanity image source is valid and can be resolved to a URL.
 * Returns false for null, undefined, or objects without asset reference.
 */
export function isValidImage(source: unknown): source is SanityImageSource {
  if (!source || typeof source !== 'object') return false

  const img = source as Record<string, unknown>

  // Check for asset reference (most common case)
  if (img.asset && typeof img.asset === 'object') {
    const asset = img.asset as Record<string, unknown>
    // Must have _ref or _id
    return Boolean(asset._ref || asset._id)
  }

  // Check for direct asset reference
  if (img._ref || img._id) return true

  // Check for asset URL directly
  if (typeof img.url === 'string') return true

  return false
}

/**
 * Returns an image URL builder for Sanity images.
 * Chain methods like .width(), .height(), .format() before calling .url()
 *
 * NOTE: Always check isValidImage() before calling this, or use getImageUrl() which handles invalid images.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Safely get image URL, returning null for invalid images.
 * Use this instead of urlFor().url() when you're not sure if the image is valid.
 */
export function safeImageUrl(
  source: unknown,
  width?: number,
  height?: number
): string | null {
  if (!isValidImage(source)) {
    return null
  }

  try {
    let imageBuilder = builder.image(source).auto('format').fit('max')

    if (width) {
      imageBuilder = imageBuilder.width(width)
    }
    if (height) {
      imageBuilder = imageBuilder.height(height)
    }

    return imageBuilder.url()
  } catch (error) {
    console.warn('[safeImageUrl] Failed to generate image URL:', error)
    return null
  }
}

/**
 * Get optimized image URL with optional dimensions.
 * Automatically applies format optimization and max fit.
 * Returns empty string if image is invalid.
 */
export function getImageUrl(
  source: SanityImageSource | unknown,
  width?: number,
  height?: number
): string {
  const url = safeImageUrl(source, width, height)
  return url || ''
}

/**
 * Get image URL with blur placeholder for Next.js Image component.
 * Returns both the full URL and a tiny blurred version for placeholder.
 * Returns null values if image is invalid.
 */
export function getImageWithBlur(source: SanityImageSource | unknown) {
  if (!isValidImage(source)) {
    return {
      url: null,
      blurDataURL: null,
    }
  }

  try {
    const url = urlFor(source).width(1200).auto('format').url()
    const blurDataURL = urlFor(source).width(24).blur(10).url()

    return {
      url,
      blurDataURL,
    }
  } catch (error) {
    console.warn('[getImageWithBlur] Failed to generate image URLs:', error)
    return {
      url: null,
      blurDataURL: null,
    }
  }
}

// ===========================================
// FILE URL BUILDER (for videos and other files)
// ===========================================

/**
 * Check if a Sanity file source is valid.
 */
export function isValidFile(source: unknown): boolean {
  if (!source || typeof source !== 'object') return false

  const file = source as Record<string, unknown>

  // Check for asset reference
  if (file.asset && typeof file.asset === 'object') {
    const asset = file.asset as Record<string, unknown>
    return Boolean(asset._ref || asset._id)
  }

  return Boolean(file._ref || file._id)
}

/**
 * Get the URL for a Sanity file (video, PDF, etc.)
 * Files are stored at: https://cdn.sanity.io/files/{projectId}/{dataset}/{assetId}.{extension}
 */
export function getFileUrl(source: unknown): string | null {
  if (!source || typeof source !== 'object') return null

  const file = source as Record<string, unknown>

  // Get the asset reference
  let assetRef: string | null = null

  if (file.asset && typeof file.asset === 'object') {
    const asset = file.asset as Record<string, unknown>
    assetRef = (asset._ref as string) || (asset._id as string) || null
  } else {
    assetRef = (file._ref as string) || (file._id as string) || null
  }

  if (!assetRef) return null

  // Parse the asset reference: file-{assetId}-{extension}
  // Example: file-abc123-mp4 -> abc123.mp4
  const match = assetRef.match(/^file-([a-zA-Z0-9]+)-([a-zA-Z0-9]+)$/)
  if (!match) {
    // Try alternative format or direct URL
    if (typeof (file as any).url === 'string') {
      return (file as any).url
    }
    return null
  }

  const [, assetId, extension] = match
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}.${extension}`
}

