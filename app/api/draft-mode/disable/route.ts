// Disable Draft Mode
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // CORRETTO: draftMode() e' async in Next.js 14.x App Router
  const draft = await draftMode()
  draft.disable()

  const url = new URL(request.nextUrl)
  return NextResponse.redirect(new URL('/', url.origin))
}
