// Contact Form API Route - v5.0
// I lead del form vengono scritti come documento `siteLead` su Sanity (il CMS
// che il gestionale GL.OS gia' interroga): il gestionale li importa poi nel suo
// modulo Lead via polling. Questo evita di esporre il gestionale su Internet.
// Fallback automatico a Formspree se la scrittura su Sanity non e' disponibile,
// cosi' nessun messaggio va perso.
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/lib/sanity/client'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnjgrpqn'

// Token Sanity con permessi di SCRITTURA (ruolo Editor), solo server-side.
// Va impostato nelle Environment Variables di Vercel. Se assente, si usa Formspree.
const SANITY_WRITE_TOKEN = process.env.SANITY_WRITE_TOKEN

const writeClient = SANITY_WRITE_TOKEN
  ? createClient({ projectId, dataset, apiVersion, token: SANITY_WRITE_TOKEN, useCdn: false })
  : null

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
    }

    // Messaggio arricchito con tipo richiesta / oggetto, per non perdere contesto.
    const fullMessage = [
      requestType ? `Tipo richiesta: ${requestType}` : '',
      subject ? `Oggetto: ${subject}` : '',
      message,
    ]
      .filter(Boolean)
      .join('\n')

    // 1) Scrivi il lead come documento `siteLead` su Sanity. Il gestionale lo importa.
    if (writeClient) {
      try {
        await writeClient.create({
          _type: 'siteLead',
          name,
          email,
          phone: phone || '',
          company: company || '',
          message: fullMessage,
          source: `sito-contatti${requestType ? '/' + requestType : ''}`,
          receivedAt: new Date().toISOString(),
          imported: false,
        })

        console.log('Lead scritto su Sanity (siteLead):', { name, email, requestType })
        return NextResponse.json({
          success: true,
          message: 'Messaggio inviato con successo',
        })
      } catch (err) {
        console.error('Scrittura Sanity fallita, fallback a Formspree:', err)
      }
    }

    // 2) Fallback (o default se SANITY_WRITE_TOKEN non e' configurato): Formspree.
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
