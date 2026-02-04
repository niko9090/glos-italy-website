// Data Fetching Layer - React 18 / Next.js 14 compatible
// Replaces defineLive (which requires React 19) with a safe wrapper
// that handles draftMode gracefully during build and at runtime
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
const token = process.env.SANITY_API_TOKEN
const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://glositalystudio.vercel.app'

// Published client - for normal page rendering
const publishedClient = createClient({
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

// Preview client - for draft mode (authenticated, no CDN, stega enabled)
const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  perspective: 'previewDrafts',
  stega: {
    enabled: true,
    studioUrl,
  },
})

// Safe draftMode check - returns false during build/static generation
async function isDraftMode(): Promise<boolean> {
  try {
    const { draftMode } = await import('next/headers')
    const dm = await draftMode()
    return dm.isEnabled
  } catch {
    return false
  }
}

// sanityFetch - returns { data } for compatibility with fetch.ts
export async function sanityFetch<T = any>({
  query,
  params = {},
}: {
  query: string
  params?: Record<string, any>
}): Promise<{ data: T }> {
  const isDraft = await isDraftMode()
  const client = isDraft ? previewClient : publishedClient
  const data = await client.fetch<T>(query, params)
  return { data }
}

// SanityLive - no-op component for React 18
// Real SanityLive requires defineLive from next-sanity v10+ (React 19)
// Visual editing overlays are handled by VisualEditing from next-sanity
export function SanityLive() {
  return null
}
