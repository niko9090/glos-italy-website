// Script per migliorare il banner CTA blu

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

async function updateCtaBanner() {
  try {
    console.log('Cercando la pagina home e le sezioni CTA...')
    const { result } = await fetchSanity(`*[_type == "page" && slug.current == "home"][0]{ _id, sections }`)

    if (!result) {
      console.error('Pagina home non trovata!')
      return
    }

    // Trova tutte le sezioni CTA
    const sections = result.sections || []
    let ctaSectionIndex = -1

    for (let i = 0; i < sections.length; i++) {
      console.log(`${i}: ${sections[i]._type}`)
      if (sections[i]._type === 'ctaSection') {
        ctaSectionIndex = i
        console.log(`  -> CTA trovata all'indice ${i}`)
      }
    }

    if (ctaSectionIndex === -1) {
      console.error('Sezione CTA non trovata!')
      return
    }

    // Aggiorna la sezione CTA con design premium
    const mutations = [
      {
        patch: {
          id: result._id,
          set: {
            [`sections[${ctaSectionIndex}].eyebrow`]: {
              it: 'Inizia Oggi',
              en: 'Start Today',
              es: 'Empieza Hoy'
            },
            [`sections[${ctaSectionIndex}].title`]: {
              it: 'Pronto a migliorare la tua produzione?',
              en: 'Ready to improve your production?',
              es: '¿Listo para mejorar tu producción?'
            },
            [`sections[${ctaSectionIndex}].subtitle`]: {
              it: 'Il nostro team è a disposizione per una consulenza personalizzata sulle tue esigenze',
              en: 'Our team is available for a personalized consultation on your needs',
              es: 'Nuestro equipo está disponible para una consulta personalizada sobre tus necesidades'
            },
            [`sections[${ctaSectionIndex}].buttons`]: [
              {
                _key: 'btn1',
                _type: 'ctaButton',
                text: { it: 'Richiedi una Consulenza', en: 'Request a Consultation', es: 'Solicita una Consulta' },
                link: '/contatti',
                variant: 'white',
                size: 'lg',
                icon: 'arrow-right',
                iconPosition: 'right'
              }
            ],
            [`sections[${ctaSectionIndex}].backgroundType`]: 'gradient',
            [`sections[${ctaSectionIndex}].backgroundColor`]: 'gradient-blue',
            [`sections[${ctaSectionIndex}].layout`]: 'centered',
            [`sections[${ctaSectionIndex}].size`]: 'full',
            [`sections[${ctaSectionIndex}].fullWidth`]: true,
            [`sections[${ctaSectionIndex}].contentWidth`]: 'narrow',
            [`sections[${ctaSectionIndex}].paddingTop`]: 'xl',
            [`sections[${ctaSectionIndex}].paddingBottom`]: 'xl',
            [`sections[${ctaSectionIndex}].titleSize`]: 'xl',
            [`sections[${ctaSectionIndex}].textColor`]: 'white',
            [`sections[${ctaSectionIndex}].showDecorations`]: true,
            [`sections[${ctaSectionIndex}].animation`]: 'fade-up'
          }
        }
      }
    ]

    console.log('Aggiornamento CTA...')
    const mutationResult = await mutateSanity(mutations)
    console.log('✅ Banner CTA aggiornato!')

  } catch (error) {
    console.error('Errore:', error)
  }
}

updateCtaBanner()
