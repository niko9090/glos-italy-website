// Script per aggiornare i 4 tile della homepage in Sanity

const projectId = '97oreljh'
const dataset = 'production'
const token = 'skA1PF9CiGcxPjkXxpxCzCoxUErZKlzi4x8ajNyRqQMlHw9jhdusMoOORZZt4onZlUaVgBHKNKG2hxwe7OxeFcugABIPQDhgkU8pMoxTOcuOx8ePAclCdJuXxloTw1csZ0yrEWODDX9KwWjuYN6lFWPKTdIKtaS45a4sLk54QZySu1eewqEz'
const apiVersion = '2024-01-01'

// I nuovi contenuti per i 4 tile
const newFeatures = [
  {
    _key: 'feature1',
    icon: '🏆',
    title: { it: 'Qualità Tecnica Certificata', en: 'Certified Technical Quality', es: 'Calidad Técnica Certificada' },
    subtitle: { it: 'Eccellenza Certificata (Mix & Resistenza)', en: 'Certified Excellence (Mix & Resistance)', es: 'Excelencia Certificada (Mix & Resistencia)' },
    description: {
      it: 'Non solo promesse, ma certezze documentate: i nostri processi superano rigorosi Rub Out Test e il protocollo Mix Glos System, garantendo stabilità del colore e uniformità della miscela in ogni condizione.',
      en: 'Not just promises, but documented certainties: our processes exceed rigorous Rub Out Tests and the Mix Glos System protocol, ensuring color stability and mixture uniformity in every condition.',
      es: 'No solo promesas, sino certezas documentadas: nuestros procesos superan rigurosas pruebas Rub Out y el protocolo Mix Glos System, garantizando estabilidad del color y uniformidad de la mezcla en cualquier condición.'
    }
  },
  {
    _key: 'feature2',
    icon: '🇮🇹',
    title: { it: 'Manifattura Made in Italy', en: 'Made in Italy Manufacturing', es: 'Manufactura Made in Italy' },
    subtitle: { it: 'Cuore Italiano, Visione Globale', en: 'Italian Heart, Global Vision', es: 'Corazón Italiano, Visión Global' },
    description: {
      it: 'Progettiamo e costruiamo ogni componente in Italia. La nostra filiera corta ci permette di controllare meticolosamente la qualità dei materiali, offrendo soluzioni robuste nate dalla vera tradizione meccanica italiana.',
      en: 'We design and build every component in Italy. Our short supply chain allows us to meticulously control material quality, offering robust solutions born from true Italian mechanical tradition.',
      es: 'Diseñamos y construimos cada componente en Italia. Nuestra cadena de suministro corta nos permite controlar meticulosamente la calidad de los materiales, ofreciendo soluciones robustas nacidas de la verdadera tradición mecánica italiana.'
    }
  },
  {
    _key: 'feature3',
    icon: '🔬',
    title: { it: 'Ricerca e Sviluppo per l\'Industria', en: 'Research & Development for Industry', es: 'Investigación y Desarrollo para la Industria' },
    subtitle: { it: 'Innovazione nel Colore', en: 'Innovation in Color', es: 'Innovación en Color' },
    description: {
      it: 'La nostra ricerca è costante e finalizzata all\'evoluzione del settore. Sviluppiamo tecnologie innovative per ottimizzare la gestione del colore, riducendo gli sprechi e massimizzando la precisione per l\'industria moderna.',
      en: 'Our research is constant and aimed at sector evolution. We develop innovative technologies to optimize color management, reducing waste and maximizing precision for modern industry.',
      es: 'Nuestra investigación es constante y orientada a la evolución del sector. Desarrollamos tecnologías innovadoras para optimizar la gestión del color, reduciendo desperdicios y maximizando la precisión para la industria moderna.'
    }
  },
  {
    _key: 'feature4',
    icon: '🛡️',
    title: { it: 'Garanzia Fino a 36 Mesi', en: 'Up to 36 Months Warranty', es: 'Garantía Hasta 36 Meses' },
    subtitle: { it: 'Affidabilità Estesa', en: 'Extended Reliability', es: 'Fiabilidad Extendida' },
    description: {
      it: 'Crediamo nella durabilità dei nostri prodotti. Per il nostro prodotto di punta, il Blender manuale GLOS BG2, offriamo un\'estensione di garanzia fino a 36 mesi: un impegno concreto verso la continuità del tuo lavoro.',
      en: 'We believe in the durability of our products. For our flagship product, the GLOS BG2 manual Blender, we offer warranty extension up to 36 months: a concrete commitment to your work continuity.',
      es: 'Creemos en la durabilidad de nuestros productos. Para nuestro producto estrella, el Blender manual GLOS BG2, ofrecemos una extensión de garantía de hasta 36 meses: un compromiso concreto con la continuidad de tu trabajo.'
    }
  }
]

async function fetchSanity(query) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
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

async function updateHomeFeatures() {
  try {
    // 1. Trova la pagina home
    console.log('Cercando la pagina home...')
    const { result } = await fetchSanity(`*[_type == "page" && slug.current == "home"][0]{ _id, sections }`)

    if (!result) {
      console.error('Pagina home non trovata!')
      return
    }

    console.log('Pagina home trovata:', result._id)
    console.log('Sezioni:', result.sections?.length || 0)

    // 2. Trova la sezione features (di solito è la seconda dopo l'hero)
    const sections = result.sections || []
    let featuresSectionIndex = -1

    for (let i = 0; i < sections.length; i++) {
      if (sections[i]._type === 'featuresSection') {
        featuresSectionIndex = i
        console.log(`Sezione features trovata all'indice ${i}`)
        break
      }
    }

    if (featuresSectionIndex === -1) {
      console.error('Sezione features non trovata!')
      console.log('Tipi di sezioni presenti:', sections.map(s => s._type))
      return
    }

    // 3. Aggiorna i feature items
    const patchPath = `sections[${featuresSectionIndex}].items`

    const mutations = [
      {
        patch: {
          id: result._id,
          set: {
            [patchPath]: newFeatures
          }
        }
      }
    ]

    console.log('Aggiornamento in corso...')
    const mutationResult = await mutateSanity(mutations)

    console.log('Risultato:', JSON.stringify(mutationResult, null, 2))
    console.log('✅ Tile homepage aggiornati con successo!')

  } catch (error) {
    console.error('Errore:', error)
  }
}

updateHomeFeatures()
