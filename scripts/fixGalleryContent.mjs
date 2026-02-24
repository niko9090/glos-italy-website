// Script per correggere il contenuto della sezione "Le nostre tecniche"

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

function generateKey() {
  return Math.random().toString(36).substring(2, 15)
}

async function fixGalleryContent() {
  try {
    console.log('Recuperando immagini dalla gallery del Blender (lavorazioni)...')

    // Le immagini della gallery del Blender mostrano le tecniche di lavorazione
    const { result: blender } = await fetchSanity(`*[_type == "product" && name == "Blender GL.OS"][0]{ gallery }`)

    if (!blender?.gallery || blender.gallery.length === 0) {
      console.error('Nessuna immagine trovata nella gallery del Blender!')
      return
    }

    // Creo le immagini con didascalie appropriate per le TECNICHE
    const techniquesCaptions = [
      {
        it: 'Miscelazione di precisione',
        en: 'Precision mixing',
        es: 'Mezcla de precisión'
      },
      {
        it: 'Dosaggio automatizzato',
        en: 'Automated dosing',
        es: 'Dosificación automatizada'
      },
      {
        it: 'Controllo qualità colore',
        en: 'Color quality control',
        es: 'Control de calidad del color'
      },
      {
        it: 'Calibrazione strumenti',
        en: 'Instrument calibration',
        es: 'Calibración de instrumentos'
      },
      {
        it: 'Processo di omogeneizzazione',
        en: 'Homogenization process',
        es: 'Proceso de homogeneización'
      },
      {
        it: 'Sistema di ricircolo',
        en: 'Recirculation system',
        es: 'Sistema de recirculación'
      },
      {
        it: 'Analisi spettrofotometrica',
        en: 'Spectrophotometric analysis',
        es: 'Análisis espectrofotométrico'
      }
    ]

    const galleryImages = blender.gallery.map((img, i) => ({
      _key: generateKey(),
      _type: 'image',
      asset: img.asset,
      caption: techniquesCaptions[i % techniquesCaptions.length],
      alt: techniquesCaptions[i % techniquesCaptions.length].it,
      category: 'Tecniche'
    }))

    console.log(`Preparate ${galleryImages.length} immagini con didascalie corrette`)

    // Trova l'ID della pagina home
    const { result: home } = await fetchSanity(`*[_type == "page" && slug.current == "home"][0]{ _id }`)

    if (!home) {
      console.error('Pagina home non trovata!')
      return
    }

    // Aggiorna la sezione
    const mutations = [
      {
        patch: {
          id: home._id,
          set: {
            'sections[4].images': galleryImages,
            'sections[4].title': {
              it: 'Le Nostre Tecniche',
              en: 'Our Techniques',
              es: 'Nuestras Técnicas'
            },
            'sections[4].subtitle': {
              it: 'Processi di lavorazione avanzati per risultati perfetti',
              en: 'Advanced processing techniques for perfect results',
              es: 'Técnicas de procesamiento avanzadas para resultados perfectos'
            },
            'sections[4].maxImages': 0
          }
        }
      }
    ]

    console.log('Aggiornamento contenuto gallery...')
    const mutationResult = await mutateSanity(mutations)
    console.log('Risultato:', JSON.stringify(mutationResult, null, 2))
    console.log(`\n✅ Gallery corretta con ${galleryImages.length} immagini di tecniche!`)

  } catch (error) {
    console.error('Errore:', error)
  }
}

fixGalleryContent()
