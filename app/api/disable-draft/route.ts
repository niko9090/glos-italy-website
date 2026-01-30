// Disable Draft Mode - Disattiva preview bozze
// CORRETTO: draftMode() e' async in Next.js 14.2+
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // CORRETTO: draftMode() e' async in Next.js 14.x App Router
  const draft = await draftMode()
  draft.disable()

  // Redirect alla pagina specificata o home
  const searchParams = request.nextUrl.searchParams
  const redirectTo = searchParams.get('redirect') || '/'

  const url = new URL(redirectTo, request.nextUrl.origin)
  return NextResponse.redirect(url)
}
