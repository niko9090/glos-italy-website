// Middleware per permettere iframe da Sanity Studio
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Rimuove X-Frame-Options per permettere embedding da Sanity Studio
  response.headers.delete('X-Frame-Options')

  // Imposta CSP per permettere solo domini specifici
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://*.sanity.studio https://glositalystudio.vercel.app"
  )

  return response
}

export const config = {
  matcher: '/:path*',
}
