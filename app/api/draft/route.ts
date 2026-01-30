// Draft Mode API - DEPRECATO: Redirect ai nuovi endpoint
// Usa /api/draft-mode/enable per abilitare il draft mode
// Usa /api/draft-mode/disable per disabilitarlo
import { NextRequest, NextResponse } from 'next/server'

// Questo endpoint e' mantenuto per backward compatibility
// Reindirizza al nuovo endpoint che usa defineEnableDraftMode
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // Passa tutti i query params al nuovo endpoint
  const newUrl = new URL('/api/draft-mode/enable', request.nextUrl.origin)
  searchParams.forEach((value, key) => {
    newUrl.searchParams.set(key, value)
  })

  return NextResponse.redirect(newUrl, { status: 307 })
}

export async function POST(request: NextRequest) {
  return GET(request)
}
