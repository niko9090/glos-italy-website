// Debug endpoint - RIMUOVERE DOPO IL DEBUG
import { NextResponse } from 'next/server'
import { draftMode } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  const draft = await draftMode()

  const config = {
    draftMode: draft.isEnabled,
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      NEXT_PUBLIC_SANITY_DATASET: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
      NEXT_PUBLIC_SANITY_API_VERSION: !!process.env.NEXT_PUBLIC_SANITY_API_VERSION,
      NEXT_PUBLIC_SANITY_STUDIO_URL: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'NOT SET',
      SANITY_API_TOKEN: !!process.env.SANITY_API_TOKEN,
      SANITY_API_TOKEN_LENGTH: process.env.SANITY_API_TOKEN?.length || 0,
      SANITY_REVALIDATE_SECRET: !!process.env.SANITY_REVALIDATE_SECRET,
    },
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(config)
}
