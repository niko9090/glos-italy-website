// Script per aggiornare i 4 tile della homepage - Design premium

const projectId = '97oreljh'
const dataset = 'production'
const token = 'skA1PF9CiGcxPjkXxpxCzCoxUErZKlzi4x8ajNyRqQMlHw9jhdusMoOORZZt4onZlUaVgBHKNKG2hxwe7OxeFcugABIPQDhgkU8pMoxTOcuOx8ePAclCdJuXxloTw1csZ0yrEWODDX9KwWjuYN6lFWPKTdIKtaS45a4sLk54QZySu1eewqEz'
const apiVersion = '2024-01-01'

// I nuovi contenuti - con badge numerici per enfasi
const newFeatures = [
  {
    _key: 'feature1',
    _type: 'featureItem',
    badge: { it: '01', en: '01', es: '01' },
    title: { it: 'Qualità Tecnica Certificata', en: 'Certified Technical Quality', es: 'Calidad Técnica Certificada' },
    description: {
      it: 'I nostri processi superano rigorosi Rub Out Test e il protocollo Mix Glos System, garantendo stabilità del colore e uniformità della miscela in ogni condizione operativa.',
      en: 'Our processes exceed rigorous Rub Out Tests and the Mix Glos System protocol, ensuring color stability and mixture uniformity in every operating condition.',
      es: 'Nuestros procesos superan rigurosas pruebas Rub Out y el protocolo Mix Glos System, garantizando estabilidad del color y uniformidad de la mezcla.'
    },
    color: 'blue'
  },
  {
    _key: 'feature2',
    _type: 'featureItem',
    badge: { it: '02', en: '02', es: '02' },
    title: { it: 'Manifattura Made in Italy', en: 'Made in Italy Manufacturing', es: 'Manufactura Made in Italy' },
    description: {
      it: 'Progettiamo e costruiamo ogni componente in Italia. La filiera corta ci permette di controllare meticolosamente la qualità dei materiali e garantire soluzioni di eccellenza.',
      en: 'We design and build every component in Italy. Our short supply chain allows meticulous quality control and guarantees solutions of excellence.',
      es: 'Diseñamos y construimos cada componente en Italia. La cadena corta nos permite un control meticuloso de la calidad y garantizar soluciones de excelencia.'
    },
    color: 'green'
  },
  {
    _key: 'feature3',
    _type: 'featureItem',
    badge: { it: '03', en: '03', es: '03' },
    title: { it: 'Ricerca e Sviluppo', en: 'Research & Development', es: 'Investigación y Desarrollo' },
    description: {
      it: 'Sviluppiamo tecnologie innovative per ottimizzare la gestione del colore nell\'industria moderna, riducendo gli sprechi e massimizzando la precisione di ogni lavorazione.',
      en: 'We develop innovative technologies to optimize color management in modern industry, reducing waste and maximizing precision in every process.',
      es: 'Desarrollamos tecnologías innovadoras para optimizar la gestión del color en la industria moderna, reduciendo desperdicios y maximizando la precisión.'
    },
    color: 'purple'
  },
  {
    _key: 'feature4',
    _type: 'featureItem',
    badge: { it: '04', en: '04', es: '04' },
    title: { it: 'Garanzia Estesa 36 Mesi', en: 'Extended 36 Month Warranty', es: 'Garantía Extendida 36 Meses' },
    description: {
      it: 'Per il nostro prodotto di punta, il Blender GLOS BG2, offriamo garanzia fino a 36 mesi: un impegno concreto verso la continuità e l\'affidabilità del tuo lavoro.',
      en: 'For our flagship product, the GLOS BG2 Blender, we offer up to 36 months warranty: a concrete commitment to the continuity and reliability of your work.',
      es: 'Para nuestro producto estrella, el Blender GLOS BG2, ofrecemos garantía de hasta 36 meses: un compromiso concreto con la continuidad de tu trabajo.'
    },
    color: 'orange'
  }
]

// Impostazioni sezione - layout 2x2 più grande e impattante
const sectionSettings = {
  eyebrow: { it: 'Perché scegliere GLOS', en: 'Why choose GLOS', es: 'Por qué elegir GLOS' },
  title: { it: 'Eccellenza industriale dal 2005', en: 'Industrial excellence since 2005', es: 'Excelencia industrial desde 2005' },
  subtitle: { it: 'Quattro pilastri che definiscono il nostro impegno verso la qualità e l\'innovazione', en: 'Four pillars that define our commitment to quality and innovation', es: 'Cuatro pilares que definen nuestro compromiso con la calidad y la innovación' },
  layout: 'grid-2',
  iconPosition: 'hidden',
  cardStyle: 'border',
  backgroundColor: 'gray-light',
  textAlign: 'left',
  gap: 'xl',
  animation: 'stagger',
  hoverEffect: 'lift',
  paddingTop: 'xl',
  paddingBottom: 'xl'
}

async function fetchSanity(query) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
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
    console.log('Cercando la pagina home...')
    const { result } = await fetchSanity(`*[_type == "page" && slug.current == "home"][0]{ _id, sections }`)

    if (!result) {
      console.error('Pagina home non trovata!')
      return
    }

    console.log('Pagina home trovata:', result._id)

    const sections = result.sections || []
    let featuresSectionIndex = -1

    for (let i = 0; i < sections.length; i++) {
      if (sections[i]._type === 'featuresSection') {
        featuresSectionIndex = i
        break
      }
    }

    if (featuresSectionIndex === -1) {
      console.error('Sezione features non trovata!')
      return
    }

    console.log(`Sezione features all'indice ${featuresSectionIndex}`)

    const mutations = [
      {
        patch: {
          id: result._id,
          set: {
            [`sections[${featuresSectionIndex}].eyebrow`]: sectionSettings.eyebrow,
            [`sections[${featuresSectionIndex}].title`]: sectionSettings.title,
            [`sections[${featuresSectionIndex}].subtitle`]: sectionSettings.subtitle,
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
    console.log('✅ Homepage aggiornata con design premium!')

  } catch (error) {
    console.error('Errore:', error)
  }
}

updateHomeFeatures()
