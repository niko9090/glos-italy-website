import { NextRequest, NextResponse } from 'next/server'

// PDF listino locale (fallback se Sanity non ha i file)
const LOCAL_PDF = '/documents/GLOS-listino-it.pdf'

export async function GET(request: NextRequest) {
  // Costruisci URL assoluto per il redirect
  const baseUrl = request.nextUrl.origin
  const pdfUrl = `${baseUrl}${LOCAL_PDF}`

  return NextResponse.redirect(pdfUrl)
}
