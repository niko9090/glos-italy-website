// Draft Mode API - Attiva preview delle bozze per Sanity Presentation Tool
// Compatibile con @sanity/presentation v1.12+ e next-sanity v9.8+
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // Attiva draft mode - in Next.js 14.1 draftMode() non e' async
  draftMode().enable()

  // Ottieni il path dalla query string
  // Sanity Presentation tool usa 'sanity-preview-pathname'
  const redirectTo = searchParams.get('sanity-preview-pathname') || searchParams.get('redirect') || '/'

  // Costruisci URL assoluto per il redirect
  const url = new URL(redirectTo, request.nextUrl.origin)

  // Redirect con status 307 per mantenere il metodo HTTP
  const response = NextResponse.redirect(url, { status: 307 })

  // Headers per permettere l'embedding in iframe da Sanity Studio
  // Rimuoviamo X-Frame-Options che blocca gli iframe
  response.headers.delete('X-Frame-Options')

  return response
}

// Supporta anche POST per compatibilita
export async function POST(request: NextRequest) {
  return GET(request)
}
