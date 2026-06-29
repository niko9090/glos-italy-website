// Contact Form API Route - v4.0
// Invio dei contatti al gestionale GLOS (modulo Lead) con FALLBACK automatico a
// Formspree: se il gestionale risponde correttamente lo usiamo (sostituisce
// Formspree); se non e' configurato o non raggiungibile, ripieghiamo su Formspree
// cosi' nessun messaggio va perso.
import { NextRequest, NextResponse } from 'next/server'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnjgrpqn'

// URL COMPLETO del webhook lead del gestionale, secret incluso nel path, es.
// https://gestionale.glos.it/webhooks/lead/<SECRET>
// Va impostata nelle Environment Variables di Vercel (server-side, mai esposta al browser).
// Se assente, il form continua a funzionare via Formspree.
const GESTIONALE_LEAD_URL = process.env.GESTIONALE_LEAD_URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, requestType, subject, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nome, email e messaggio sono obbligatori' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
    }

    // Messaggio arricchito con tipo richiesta / oggetto, per non perdere contesto
    // (il gestionale salva il messaggio nelle note del lead).
    const fullMessage = [
      requestType ? `Tipo richiesta: ${requestType}` : '',
      subject ? `Oggetto: ${subject}` : '',
      message,
    ]
      .filter(Boolean)
      .join('\n')

    // 1) Prova il gestionale GLOS (se configurato). Se va a buon fine, NON usiamo Formspree.
    if (GESTIONALE_LEAD_URL) {
      try {
        const res = await fetch(GESTIONALE_LEAD_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone: phone || '',
            company: company || '',
            message: fullMessage,
            source: `sito-contatti${requestType ? '/' + requestType : ''}`,
            website: '', // honeypot anti-spam: deve restare vuoto
          }),
          // Non restare appesi se il gestionale non risponde: poi si ripiega su Formspree.
          signal: AbortSignal.timeout(8000),
        })

        if (res.ok) {
          console.log('Lead inviato al gestionale GLOS:', { name, email, requestType })
          return NextResponse.json({
            success: true,
            message: 'Messaggio inviato con successo',
          })
        }

        console.error('Gestionale lead error, fallback a Formspree. Status:', res.status)
      } catch (err) {
        console.error('Gestionale lead non raggiungibile, fallback a Formspree:', err)
      }
    }

    // 2) Fallback (o default se il gestionale non e' configurato): Formspree.
    const formData = {
      name,
      email,
      phone: phone || '',
      company: company || '',
      requestType: requestType || '',
      subject: subject || '',
      message,
      _subject: `[Contatto Sito GLOS] ${requestType || 'Nuovo messaggio'}${subject ? `: ${subject}` : ''}`,
    }

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Formspree error:', errorData)
      return NextResponse.json(
        { error: 'Errore durante l\'invio del messaggio' },
        { status: 500 }
      )
    }

    console.log('Contact form submission sent to Formspree (fallback):', {
      name,
      email,
      requestType,
    })

    return NextResponse.json({
      success: true,
      message: 'Messaggio inviato con successo',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'invio del messaggio' },
      { status: 500 }
    )
  }
}
