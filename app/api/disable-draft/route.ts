// Disable Draft Mode - Disattiva preview bozze
// Compatibile con Next.js 14.1.0 - draftMode() NON e' async
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Disattiva draft mode - NON usare await, draftMode() non e' async in Next.js 14.1
  draftMode().disable()

  // Redirect alla pagina specificata o home
  const searchParams = request.nextUrl.searchParams
  const redirectTo = searchParams.get('redirect') || '/'

  const url = new URL(redirectTo, request.nextUrl.origin)
  return NextResponse.redirect(url)
}
