// Script per migliorare la sezione "Le nostre tecniche" con layout marquee

const projectId = '97oreljh'
const dataset = 'production'
const token = 'skA1PF9CiGcxPjkXxpxCzCoxUErZKlzi4x8ajNyRqQMlHw9jhdusMoOORZZt4onZlUaVgBHKNKG2hxwe7OxeFcugABIPQDhgkU8pMoxTOcuOx8ePAclCdJuXxloTw1csZ0yrEWODDX9KwWjuYN6lFWPKTdIKtaS45a4sLk54QZySu1eewqEz'
const apiVersion = '2024-01-01'

async function fetchSanity(query) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  return res.json()
}

async function mutateSanity(mutations) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ mutations })
  })
  return res.json()
}

async function updateGallerySection() {
  try {
    console.log('Cercando la pagina home e la sezione gallery...')
    const { result } = await fetchSanity(`*[_type == "page" && slug.current == "home"][0]{ _id, sections }`)

    if (!result) {
      console.error('Pagina home non trovata!')
      return
    }

    // Trova la sezione gallery (Le nostre tecniche)
    const sections = result.sections || []
    let gallerySectionIndex = -1

    for (let i = 0; i < sections.length; i++) {
      console.log(`${i}: ${sections[i]._type}`)
      if (sections[i]._type === 'gallerySection') {
        gallerySectionIndex = i
        console.log(`  -> Gallery trovata all'indice ${i}`)
      }
    }

    if (gallerySectionIndex === -1) {
      console.error('Sezione Gallery non trovata!')
      return
    }

    // Aggiorna la sezione gallery con layout marquee
    const mutations = [
      {
        patch: {
          id: result._id,
          set: {
            // Titolo migliorato
            [`sections[${gallerySectionIndex}].title`]: {
              it: 'Le Nostre Tecniche',
              en: 'Our Techniques',
              es: 'Nuestras Técnicas'
            },
            // Sottotitolo
            [`sections[${gallerySectionIndex}].subtitle`]: {
              it: 'Precisione artigianale e tecnologia avanzata per risultati eccezionali',
              en: 'Artisan precision and advanced technology for exceptional results',
              es: 'Precisión artesanal y tecnología avanzada para resultados excepcionales'
            },
            // Layout marquee
            [`sections[${gallerySectionIndex}].layout`]: 'marquee',
            [`sections[${gallerySectionIndex}].marqueeSpeed`]: 'slow',
            [`sections[${gallerySectionIndex}].marqueeDirection`]: 'left',
            // Stile
            [`sections[${gallerySectionIndex}].rounded`]: 'lg',
            [`sections[${gallerySectionIndex}].shadow`]: 'md',
            [`sections[${gallerySectionIndex}].hoverEffect`]: 'zoom-bright',
            [`sections[${gallerySectionIndex}].showCaptions`]: 'hover-slide',
            [`sections[${gallerySectionIndex}].enableLightbox`]: true,
            [`sections[${gallerySectionIndex}].lightboxStyle`]: 'thumbnails',
            [`sections[${gallerySectionIndex}].backgroundColor`]: 'gray-light',
            [`sections[${gallerySectionIndex}].paddingTop`]: 'xl',
            [`sections[${gallerySectionIndex}].paddingBottom`]: 'xl'
          }
        }
      }
    ]

    console.log('Aggiornamento sezione gallery...')
    const mutationResult = await mutateSanity(mutations)
    console.log('Risultato:', JSON.stringify(mutationResult, null, 2))
    console.log('✅ Sezione "Le nostre tecniche" aggiornata con layout marquee!')
    console.log('')
    console.log('📋 Configurazione:')
    console.log('   Layout: Marquee (scorrimento continuo)')
    console.log('   Velocità: Lenta')
    console.log('   Direzione: Sinistra')
    console.log('   Stile: Bordi arrotondati, ombre medie')
    console.log('   Hover: Zoom + brighten')
    console.log('   Didascalie: Slide up on hover')
    console.log('')
    console.log('⚠️  NOTA: Aggiungi le immagini direttamente da Sanity Studio')
    console.log('   1. Vai su https://glositalystudio.vercel.app')
    console.log('   2. Apri la pagina Home')
    console.log('   3. Trova la sezione "Le nostre tecniche"')
    console.log('   4. Aggiungi le foto dei prodotti nella tab "Immagini"')

  } catch (error) {
    console.error('Errore:', error)
  }
}

updateGallerySection()
