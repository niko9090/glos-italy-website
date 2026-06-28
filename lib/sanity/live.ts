// Data Fetching Layer - React 19 / Next.js 15
// Branch ANTEPRIMA: legge SEMPRE le bozze (previewDrafts), senza stega/overlay.
// Il sito reale (branch main) resta su 'published' e non è toccato.
import { createClient, defineLive } from 'next-sanity'
import { client as publishedClient, token, projectId, dataset, apiVersion } from './client'

// Client di anteprima: bozze sovrapposte ai pubblicati, niente CDN, niente stega.
const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts',
  token,
  stega: { enabled: false },
})

// defineLive resta per esportare SanityLive (live updates nel browser).
const live = defineLive({
  client: publishedClient,
  serverToken: token,
  browserToken: token,
})

export const SanityLive = live.SanityLive

// In anteprima tutte le query passano dal previewClient (bozze).
export async function sanityFetch(opts: { query: string; params?: Record<string, unknown> }) {
  const data = await previewClient.fetch(opts.query, opts.params || {})
  return { data }
}
