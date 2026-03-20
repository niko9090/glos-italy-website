// Contact Form API Route - v3.0 con Formspree
import { NextRequest, NextResponse } from 'next/server'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnjgrpqn'

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
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      )
    }

    // Prepara i dati per Formspree
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

    // Invia a Formspree
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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

    console.log('Contact form submission sent to Formspree:', {
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
