// Middleware per permettere iframe da Sanity Studio e visual editing
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Lista esplicita delle origini permesse per CORS
const ALLOWED_ORIGINS = [
  'https://glositalystudio.vercel.app',
  'https://glositaly.sanity.studio',
  'https://glositaly.it',
  'https://www.glositaly.it',
  'https://glositaly.vercel.app',
]

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Rimuovi X-Frame-Options per permettere iframe
  response.headers.delete('X-Frame-Options')

  // CSP che permette iframe da Sanity Studio
  // frame-ancestors controlla CHI puo includere questa pagina in iframe
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://*.sanity.studio https://glositalystudio.vercel.app https://*.vercel.app https://glositaly.it https://www.glositaly.it"
  )

  // Headers CORS per visual editing
  const origin = request.headers.get('origin')

  if (origin) {
    // Verifica esatta dell'origine (non usare includes per sicurezza)
    const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin) ||
      origin.endsWith('.sanity.studio') ||
      origin.endsWith('.vercel.app')

    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    }
  }

  // Gestione preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    })
  }

  return response
}

export const config = {
  // Applica a tutte le route eccetto assets statici
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
