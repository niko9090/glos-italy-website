// Disable Draft Mode
// This endpoint disables preview mode and redirects to the homepage
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // draftMode() is async in Next.js 14.x App Router
    const draft = await draftMode()
    draft.disable()

    // Get the redirect URL from query params, or default to homepage
    const { searchParams } = request.nextUrl
    const redirectTo = searchParams.get('redirect') || '/'

    // Validate redirect URL to prevent open redirect vulnerabilities
    // Only allow relative paths or same-origin URLs
    const redirectUrl = redirectTo.startsWith('/') ? redirectTo : '/'

    return NextResponse.redirect(new URL(redirectUrl, request.nextUrl.origin))
  } catch (error) {
    console.error('[Draft Mode] Error disabling draft mode:', error)

    // Still try to redirect even if disabling fails
    return NextResponse.redirect(new URL('/', request.nextUrl.origin))
  }
}
