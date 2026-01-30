// Enable Draft Mode - Endpoint per Sanity Presentation Tool
import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client, token, studioUrl } from '@/lib/sanity/client'

// Verifica che il token sia presente
if (!token) {
  console.error('[Draft Mode] SANITY_API_TOKEN non configurato!')
}

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    token,
    // Abilita stega per visual editing durante draft mode
    stega: {
      enabled: true,
      studioUrl,
    },
  }),
})
