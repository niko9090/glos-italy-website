// Script per aggiornare i 4 tile della homepage in Sanity - Design professionale

const projectId = '97oreljh'
const dataset = 'production'
const token = 'skA1PF9CiGcxPjkXxpxCzCoxUErZKlzi4x8ajNyRqQMlHw9jhdusMoOORZZt4onZlUaVgBHKNKG2hxwe7OxeFcugABIPQDhgkU8pMoxTOcuOx8ePAclCdJuXxloTw1csZ0yrEWODDX9KwWjuYN6lFWPKTdIKtaS45a4sLk54QZySu1eewqEz'
const apiVersion = '2024-01-01'

// I nuovi contenuti per i 4 tile - SENZA EMOJI, design pulito
const newFeatures = [
  {
    _key: 'feature1',
    _type: 'featureItem',
    title: { it: 'Qualità Tecnica Certificata', en: 'Certified Technical Quality', es: 'Calidad Técnica Certificada' },
    description: {
      it: 'Standard elevati per prestazioni industriali. I nostri processi superano rigorosi Rub Out Test e il protocollo Mix Glos System, garantendo stabilità del colore e uniformità della miscela in ogni condizione.',
      en: 'High standards for industrial performance. Our processes exceed rigorous Rub Out Tests and the Mix Glos System protocol, ensuring color stability and mixture uniformity in every condition.',
      es: 'Estándares elevados para el rendimiento industrial. Nuestros procesos superan rigurosas pruebas Rub Out y el protocolo Mix Glos System, garantizando estabilidad del color y uniformidad de la mezcla.'
    },
    color: 'blue'
  },
  {
    _key: 'feature2',
    _type: 'featureItem',
    title: { it: 'Manifattura Made in Italy', en: 'Made in Italy Manufacturing', es: 'Manufactura Made in Italy' },
    description: {
      it: 'Design e produzione interamente locali. Progettiamo e costruiamo ogni componente in Italia. La filiera corta ci permette di controllare meticolosamente la qualità, offrendo soluzioni nate dalla tradizione meccanica italiana.',
      en: 'Entirely local design and production. We design and build every component in Italy. Our short supply chain allows meticulous quality control, offering solutions born from Italian mechanical tradition.',
      es: 'Diseño y producción enteramente locales. Diseñamos y construimos cada componente en Italia. La cadena corta nos permite un control meticuloso de la calidad, ofreciendo soluciones de la tradición mecánica italiana.'
    },
    color: 'green'
  },
  {
    _key: 'feature3',
    _type: 'featureItem',
    title: { it: 'Ricerca e Sviluppo', en: 'Research & Development', es: 'Investigación y Desarrollo' },
    description: {
      it: 'Tecnologia applicata alla colorimetria. La nostra ricerca è costante e finalizzata all\'evoluzione del settore. Sviluppiamo tecnologie innovative per ottimizzare la gestione del colore, riducendo sprechi e massimizzando la precisione.',
      en: 'Technology applied to colorimetry. Our research is constant and aimed at sector evolution. We develop innovative technologies to optimize color management, reducing waste and maximizing precision.',
      es: 'Tecnología aplicada a la colorimetría. Nuestra investigación es constante y orientada a la evolución del sector. Desarrollamos tecnologías innovadoras para optimizar la gestión del color, reduciendo desperdicios.'
    },
    color: 'purple'
  },
  {
    _key: 'feature4',
    _type: 'featureItem',
    title: { it: 'Garanzia Estesa 36 Mesi', en: 'Extended 36 Month Warranty', es: 'Garantía Extendida 36 Meses' },
    description: {
      it: 'La sicurezza del Blender GLOS BG2. Crediamo nella durabilità dei nostri prodotti. Per il Blender manuale GLOS BG2 offriamo garanzia fino a 36 mesi: un impegno concreto verso la continuità del tuo lavoro.',
      en: 'The security of GLOS BG2 Blender. We believe in product durability. For the GLOS BG2 manual Blender we offer up to 36 months warranty: a concrete commitment to your work continuity.',
      es: 'La seguridad del Blender GLOS BG2. Creemos en la durabilidad de nuestros productos. Para el Blender manual GLOS BG2 ofrecemos garantía de hasta 36 meses: un compromiso concreto con tu trabajo.'
    },
    color: 'orange'
  }
]

// Impostazioni della sezione - design professionale minimale
const sectionSettings = {
  layout: 'grid-4',
  iconPosition: 'hidden',
  cardStyle: 'shadow-md',
  backgroundColor: 'white',
  textAlign: 'left',
  gap: 'lg',
  animation: 'fade-up',
  hoverEffect: 'lift',
  paddingTop: 'lg',
  paddingBottom: 'lg'
}

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

    // 2. Trova la sezione features
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
      return
    }

    // 3. Aggiorna items e impostazioni della sezione
    const mutations = [
      {
        patch: {
          id: result._id,
          set: {
            [`sections[${featuresSectionIndex}].items`]: newFeatures,
            [`sections[${featuresSectionIndex}].layout`]: sectionSettings.layout,
            [`sections[${featuresSectionIndex}].iconPosition`]: sectionSettings.iconPosition,
            [`sections[${featuresSectionIndex}].cardStyle`]: sectionSettings.cardStyle,
            [`sections[${featuresSectionIndex}].backgroundColor`]: sectionSettings.backgroundColor,
            [`sections[${featuresSectionIndex}].textAlign`]: sectionSettings.textAlign,
            [`sections[${featuresSectionIndex}].gap`]: sectionSettings.gap,
            [`sections[${featuresSectionIndex}].animation`]: sectionSettings.animation,
            [`sections[${featuresSectionIndex}].hoverEffect`]: sectionSettings.hoverEffect,
            [`sections[${featuresSectionIndex}].paddingTop`]: sectionSettings.paddingTop,
            [`sections[${featuresSectionIndex}].paddingBottom`]: sectionSettings.paddingBottom
          }
        }
      }
    ]

    console.log('Aggiornamento in corso...')
    const mutationResult = await mutateSanity(mutations)

    console.log('Risultato:', JSON.stringify(mutationResult, null, 2))
    console.log('✅ Sezione homepage aggiornata con design professionale!')

  } catch (error) {
    console.error('Errore:', error)
  }
}

updateHomeFeatures()
