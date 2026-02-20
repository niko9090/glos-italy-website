import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity/client'

// Query per ottenere i PDF del listino da siteSettings
const LISTINO_QUERY = `*[_type == "siteSettings"][0]{
  "pdfIt": listinoPrezziPdfIt.asset->url,
  "pdfEn": listinoPrezziPdfEn.asset->url,
  "pdfEs": listinoPrezziPdfEs.asset->url
}`

export async function GET(request: NextRequest) {
  try {
    // Ottieni la lingua dal query parameter
    const { searchParams } = new URL(request.url)
    const lang = searchParams.get('lang') || 'it'

    // Fetch PDF URLs da Sanity
    const data = await client.fetch(LISTINO_QUERY)

    if (!data) {
      return NextResponse.json(
        { error: 'Impostazioni sito non trovate' },
        { status: 404 }
      )
    }

    // Seleziona il PDF corretto in base alla lingua
    // Fallback: lingua richiesta -> inglese -> italiano -> qualsiasi disponibile
    let pdfUrl: string | null = null

    switch (lang) {
      case 'it':
        pdfUrl = data.pdfIt || data.pdfEn || data.pdfEs
        break
      case 'en':
        pdfUrl = data.pdfEn || data.pdfIt || data.pdfEs
        break
      case 'es':
        pdfUrl = data.pdfEs || data.pdfEn || data.pdfIt
        break
      default:
        pdfUrl = data.pdfEn || data.pdfIt || data.pdfEs
    }

    if (!pdfUrl) {
      return NextResponse.json(
        { error: 'Nessun listino PDF disponibile' },
        { status: 404 }
      )
    }

    // Redirect al PDF
    return NextResponse.redirect(pdfUrl)
  } catch (error) {
    console.error('Errore download listino:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero del listino' },
      { status: 500 }
    )
  }
}
