// Middleware per permettere iframe da Sanity Studio e visual editing
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Rimuovi X-Frame-Options per permettere iframe
  // (delete e' piu affidabile di set(''))
  response.headers.delete('X-Frame-Options')

  // CSP che permette iframe da Sanity Studio
  // frame-ancestors controlla CHI puo includere questa pagina in iframe
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://*.sanity.studio https://glositalystudio.vercel.app https://*.vercel.app"
  )

  // Headers aggiuntivi per CORS e visual editing
  const origin = request.headers.get('origin')
  if (origin) {
    // Permetti richieste cross-origin da Sanity Studio
    const allowedOrigins = [
      'https://glositalystudio.vercel.app',
      'https://glositaly.sanity.studio',
    ]
    if (allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', '')))) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }
  }

  return response
}

export const config = {
  // Applica a tutte le route eccetto assets statici
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
