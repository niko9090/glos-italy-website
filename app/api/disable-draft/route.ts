// Disable Draft Mode - Disattiva preview bozze
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Disattiva draft mode
  draftMode().disable()

  // Redirect alla pagina specificata o home
  const redirectTo = searchParams.get('redirect') || '/'
  redirect(redirectTo)
}
