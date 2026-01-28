// Contact Form API Route
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

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

    // Send email using Resend (or other provider)
    // Uncomment and configure when ready
    /*
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'GLOS Italy <noreply@glositaly.it>',
      to: process.env.CONTACT_EMAIL || 'info@glositaly.it',
      replyTo: email,
      subject: `[Contatto Sito] ${subject || 'Nuovo messaggio'}`,
      html: `
        <h2>Nuovo messaggio dal sito</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Oggetto:</strong> ${subject || 'Non specificato'}</p>
        <p><strong>Messaggio:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })
    */

    // For now, just log and return success
    console.log('Contact form submission:', { name, email, subject, message })

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
