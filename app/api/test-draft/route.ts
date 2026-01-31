// Test endpoint per verificare se i draft vengono fetchati
import { NextResponse } from 'next/server'
import { draftMode } from 'next/headers'
import { createClient } from 'next-sanity'

export const dynamic = 'force-dynamic'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

export async function GET() {
  const draft = await draftMode()

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: draft.isEnabled ? token : undefined,
    perspective: draft.isEnabled ? 'drafts' : 'published',
  })

  // Fetch home page title
  const query = `*[_type == "page" && slug.current == "home"][0]{title, _id}`
  const result = await client.fetch(query)

  return NextResponse.json({
    draftModeEnabled: draft.isEnabled,
    tokenConfigured: !!token,
    tokenLength: token?.length || 0,
    perspective: draft.isEnabled ? 'drafts' : 'published',
    result,
  })
}
