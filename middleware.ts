// Middleware per permettere iframe da Sanity Studio
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Crea una nuova response con headers modificati
  const requestHeaders = new Headers(request.headers)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Sovrascrive X-Frame-Options con valore vuoto (effettivamente lo disabilita)
  response.headers.set('X-Frame-Options', '')

  // Imposta CSP per permettere iframe da Sanity Studio
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://*.sanity.studio https://glositalystudio.vercel.app"
  )

  return response
}

export const config = {
  // Applica a tutte le route
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
