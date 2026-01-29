// Draft Mode API - Attiva preview delle bozze per Sanity Presentation Tool
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Attiva draft mode
  const draft = draftMode()
  draft.enable()

  // Ottieni il path dalla query string
  const searchParams = request.nextUrl.searchParams
  const redirectTo = searchParams.get('sanity-preview-pathname') || searchParams.get('redirect') || '/'

  // Redirect alla pagina richiesta
  redirect(redirectTo)
}
