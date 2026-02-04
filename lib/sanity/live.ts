// Live Data Layer - next-sanity v12
// Uses defineLive for automatic live updates and stega encoding
import { defineLive } from 'next-sanity/live'
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://glositalystudio.vercel.app',
  },
})

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_TOKEN,
  browserToken: process.env.SANITY_API_TOKEN,
})
