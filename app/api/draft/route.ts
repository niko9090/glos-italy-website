// Draft Mode API - Attiva preview delle bozze per Sanity Presentation Tool
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Ottieni il path dalla query string
  const path = searchParams.get('sanity-preview-pathname') || '/'

  // Attiva draft mode (permette di vedere le bozze)
  draftMode().enable()

  // Redirect alla pagina richiesta
  redirect(path)
}
