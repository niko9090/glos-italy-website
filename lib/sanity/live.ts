// Data Fetching Layer - React 19 / Next.js 15
// Uses defineLive from next-sanity for live content and visual editing
import { defineLive } from 'next-sanity'
import { client, token } from './client'

// defineLive provides:
// - sanityFetch: server-side data fetching with automatic draft/published switching
// - SanityLive: client component for live content updates in the browser
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})
