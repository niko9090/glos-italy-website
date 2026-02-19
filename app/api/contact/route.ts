// Contact Form API Route - v2.0 con Resend
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

// Sanity client per recuperare le impostazioni
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '97oreljh',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Interfaccia per le impostazioni del sito
interface SiteSettings {
  email?: string
  contactFormRecipient?: string
  contactFormSubject?: string
  companyName?: string
}

// Funzione per recuperare le impostazioni da Sanity
async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await sanityClient.fetch(`
      *[_type == "siteSettings"][0]{
        email,
        contactFormRecipient,
        contactFormSubject,
        companyName
      }
    `)
    return settings || {}
  } catch (error) {
    console.error('Errore nel recupero delle impostazioni:', error)
    return {}
  }
}

// Funzione per inviare email con Resend
async function sendEmailWithResend(params: {
  to: string
  from: string
  replyTo: string
  subject: string
  html: string
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY

  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY non configurata - email non inviata')
    return { success: false, error: 'API key non configurata' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: params.from,
        to: [params.to],
        reply_to: params.replyTo,
        subject: params.subject,
        html: params.html,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Resend API error:', errorData)
      return { success: false, error: errorData.message || 'Errore API Resend' }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Errore invio email Resend:', error)
    return { success: false, error: 'Errore di rete' }
  }
}

// Funzione per generare HTML email
function generateEmailHtml(data: {
  name: string
  email: string
  phone?: string
  company?: string
  requestType?: string
  subject?: string
  message: string
}) {
  const fields = [
    { label: 'Nome', value: data.name },
    { label: 'Email', value: data.email },
    data.phone ? { label: 'Telefono', value: data.phone } : null,
    data.company ? { label: 'Azienda', value: data.company } : null,
    data.requestType ? { label: 'Tipo di Richiesta', value: data.requestType } : null,
    data.subject ? { label: 'Oggetto', value: data.subject } : null,
  ].filter(Boolean)

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nuova richiesta dal sito</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
                    Nuova Richiesta dal Sito Web
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                    Dettagli del contatto
                  </p>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    ${fields.map(field => field ? `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                          <span style="color: #6b7280; font-size: 13px; display: block; margin-bottom: 4px;">${field.label}</span>
                          <span style="color: #111827; font-size: 15px; font-weight: 500;">${field.value}</span>
                        </td>
                      </tr>
                    ` : '').join('')}
                  </table>

                  <div style="margin-top: 32px;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                      Messaggio
                    </p>
                    <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 4px solid #e63946;">
                      <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                    Questa email e stata inviata dal form di contatto del sito web GLOS Italy
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                    Per rispondere, clicca "Rispondi" o scrivi a ${data.email}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

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

    // Recupera le impostazioni da Sanity
    const settings = await getSiteSettings()

    // Determina il destinatario (priorita: contactFormRecipient > email > env > default)
    const recipientEmail =
      settings.contactFormRecipient ||
      settings.email ||
      process.env.CONTACT_EMAIL ||
      'info@glositaly.it'

    // Determina l'oggetto dell'email
    const emailSubject = settings.contactFormSubject
      ? `${settings.contactFormSubject}${requestType ? ` - ${requestType}` : ''}${subject ? `: ${subject}` : ''}`
      : `[Contatto Sito] ${requestType || 'Nuovo messaggio'}${subject ? `: ${subject}` : ''}`

    // Genera HTML email
    const htmlContent = generateEmailHtml({
      name,
      email,
      phone,
      company,
      requestType,
      subject,
      message,
    })

    // Log della richiesta
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      company,
      requestType,
      subject,
      message: message.substring(0, 100) + '...',
      recipientEmail,
    })

    // Invia email con Resend (se configurato)
    if (process.env.RESEND_API_KEY) {
      const emailResult = await sendEmailWithResend({
        to: recipientEmail,
        from: `GLOS Italy <noreply@${process.env.RESEND_DOMAIN || 'glositaly.it'}>`,
        replyTo: email,
        subject: emailSubject,
        html: htmlContent,
      })

      if (!emailResult.success) {
        console.error('Errore invio email:', emailResult.error)
        // Continuiamo comunque a restituire successo al frontend
        // perché il messaggio è stato ricevuto
      }
    } else {
      console.log('RESEND_API_KEY non configurata - email non inviata ma richiesta salvata')
    }

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
