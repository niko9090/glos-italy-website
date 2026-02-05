// API Route per inviare messaggi chat a Telegram
import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function POST(request: NextRequest) {
  try {
    // Verifica configurazione
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Telegram non configurato: mancano TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID')
      return NextResponse.json(
        { error: 'Servizio chat non configurato' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { message, name, phone } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Messaggio richiesto' },
        { status: 400 }
      )
    }

    // Formatta il messaggio per Telegram
    const timestamp = new Date().toLocaleString('it-IT', {
      timeZone: 'Europe/Rome',
      dateStyle: 'short',
      timeStyle: 'short',
    })

    let telegramMessage = `💬 *Nuovo messaggio dal sito*\n\n`
    telegramMessage += `📅 ${timestamp}\n`
    if (name) telegramMessage += `👤 Nome: ${name}\n`
    if (phone) telegramMessage += `📱 Tel: ${phone}\n`
    telegramMessage += `\n💬 Messaggio:\n${message.trim()}`

    // Invia a Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'Markdown',
      }),
    })

    const result = await response.json()

    if (!response.ok || !result.ok) {
      console.error('Errore Telegram:', result)
      return NextResponse.json(
        { error: 'Errore invio messaggio' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore API chat:', error)
    return NextResponse.json(
      { error: 'Errore interno' },
      { status: 500 }
    )
  }
}
