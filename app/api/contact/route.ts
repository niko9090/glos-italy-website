// Contact Form API Route - v4.2: Formspree + inoltro lead al gestionale GL.OS
import { NextRequest, NextResponse } from 'next/server'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnjgrpqn'

// Endpoint del gestionale che riceve i lead (server-to-server, secret nel path).
// Richiede la env SITE_LEAD_SECRET su Vercel = stesso valore del gestionale.
const GESTIONALE_BASE = 'https://gestionale.glos-hub.org'

// Inoltra il lead al gestionale. Best-effort: non fa mai fallire la submit utente
// (se il gestionale non risponde, il messaggio resta comunque su Formspree).
async function inoltraAlGestionale(payload: {
  name: string; email: string; phone?: string; company?: string
  requestType?: string; subject?: string; message: string
}) {
  const secret = process.env.SITE_LEAD_SECRET
  if (!secret) return
  const message = payload.subject ? `[${payload.subject}] ${payload.message}` : payload.message
  try {
    await fetch(`${GESTIONALE_BASE}/webhooks/lead/${secret}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phone: payload.phone || '',
        company: payload.company || '',
        interest: payload.requestType || '',
        message,
        source: 'sito',
      }),
      cache: 'no-store',
    })
  } catch (error) {
    console.error('Inoltro lead al gestionale fallito (non bloccante):', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, requestType, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Nome, email e messaggio sono obbligatori' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
    }

    const formData = {
      name, email,
      phone: phone || '', company: company || '',
      requestType: requestType || '', subject: subject || '', message,
      _subject: `[Contatto Sito GLOS] ${requestType || 'Nuovo messaggio'}${subject ? `: ${subject}` : ''}`,
    }

    const [formspreeResult] = await Promise.allSettled([
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData),
      }),
      inoltraAlGestionale({ name, email, phone, company, requestType, subject, message }),
    ])

    if (formspreeResult.status === 'rejected' || !formspreeResult.value.ok) {
      if (formspreeResult.status === 'fulfilled') {
        const errorData = await formspreeResult.value.json().catch(() => ({}))
        console.error('Formspree error:', errorData)
      } else {
        console.error('Formspree error:', formspreeResult.reason)
      }
      return NextResponse.json({ error: 'Errore durante l\'invio del messaggio' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Messaggio inviato con successo' })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Errore durante l\'invio del messaggio' }, { status: 500 })
  }
}
