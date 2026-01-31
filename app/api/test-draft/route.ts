// Test endpoint per verificare se i draft e stega funzionano
import { NextResponse } from 'next/server'
import { draftMode } from 'next/headers'
import { createClient } from 'next-sanity'

export const dynamic = 'force-dynamic'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'https://glositalystudio.vercel.app'

export async function GET() {
  const draft = await draftMode()

  // Client CON stega
  const clientWithStega = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
    perspective: 'drafts',
    stega: {
      enabled: true,
      studioUrl,
    },
  })

  // Fetch hero section title con stega
  const query = `*[_type == "page" && slug.current == "home"][0]{
    title,
    _id,
    "heroTitle": sections[0].title,
    "heroSubtitle": sections[0].subtitle
  }`

  const result = await clientWithStega.fetch(query)

  // Check if stega markers are present (they contain special unicode chars)
  const heroTitleRaw = result?.heroTitle
  const hasStegaMarkers = typeof heroTitleRaw === 'string' &&
    (heroTitleRaw.includes('\u0000') || heroTitleRaw.length !== heroTitleRaw.replace(/[\u0000-\u001F]/g, '').length)

  return NextResponse.json({
    draftModeEnabled: draft.isEnabled,
    tokenConfigured: !!token,
    studioUrl,
    hasStegaMarkers,
    heroTitleLength: heroTitleRaw?.length,
    heroTitleCleanLength: typeof heroTitleRaw === 'string' ? heroTitleRaw.replace(/[\u0000-\u001F]/g, '').length : null,
    result,
  })
}
