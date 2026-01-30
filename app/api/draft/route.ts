// Draft Mode API - Attiva preview delle bozze per Sanity Presentation Tool
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Attiva draft mode
  const draft = await draftMode()
  draft.enable()

  // Ottieni il path dalla query string
  const searchParams = request.nextUrl.searchParams
  const redirectTo = searchParams.get('sanity-preview-pathname') || searchParams.get('redirect') || '/'

  // Costruisci URL assoluto per il redirect
  const url = new URL(redirectTo, request.nextUrl.origin)

  // Redirect alla pagina richiesta con status 307 per mantenere il metodo
  return NextResponse.redirect(url, { status: 307 })
}
