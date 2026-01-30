// Enable Draft Mode - Endpoint for Sanity Presentation Tool
// This endpoint is called by Sanity Studio to enable preview mode
import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client, token, studioUrl } from '@/lib/sanity/client'

// Validate token at startup (server-side only)
if (!token) {
  console.error(
    '[Draft Mode] CRITICAL: SANITY_API_TOKEN is not configured! ' +
      'Draft mode will not work without a valid API token. ' +
      'Please add SANITY_API_TOKEN to your environment variables.'
  )
}

// Configure the draft mode handler with authenticated client
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    token,
    // Enable stega for visual editing during draft mode
    stega: {
      enabled: true,
      studioUrl,
    },
  }),
})
