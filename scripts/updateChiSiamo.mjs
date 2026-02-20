// Script per aggiornare la pagina Chi Siamo in Sanity
// Usa fetch diretto invece di @sanity/client

const projectId = '97oreljh'
const dataset = 'production'
const token = 'skA1PF9CiGcxPjkXxpxCzCoxUErZKlzi4x8ajNyRqQMlHw9jhdusMoOORZZt4onZlUaVgBHKNKG2hxwe7OxeFcugABIPQDhgkU8pMoxTOcuOx8ePAclCdJuXxloTw1csZ0yrEWODDX9KwWjuYN6lFWPKTdIKtaS45a4sLk54QZySu1eewqEz'
const apiVersion = '2024-01-01'

async function fetchSanity(query) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  return data.result
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

async function updateChiSiamo() {
  try {
    // Trova la pagina Chi Siamo
    const page = await fetchSanity(`*[_type == "page" && slug.current == "chi-siamo"][0]`)

    if (!page) {
      console.log('Pagina Chi Siamo non trovata')
      return
    }

    console.log('Pagina trovata:', page._id)

    const newSections = [
      {
        _type: 'heroSection',
        _key: 'hero-chi-siamo',
        title: 'GL.OS: Ingegneria Meccanica e Innovazione Made in Italy.',
        subtitle: 'Scopri la nostra storia e la nostra visione',
        backgroundType: 'gradient',
      },
      {
        _type: 'richTextSection',
        _key: 'vision-section',
        title: 'La Nostra Vision',
        content: [
          {
            _type: 'block',
            _key: 'vision-p1',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'vision-span1',
                text: "Nel cuore della Motor Valley, a Reggio Emilia, nasce nel 2005 GL.OS - un'azienda che trasforma l'ingegneria meccanica in arte industriale. Qui, dove Ferrari, Lamborghini e Ducati hanno scritto la storia dell'eccellenza italiana, GL.OS porta la stessa passione e precisione nel settore delle vernici e dei rivestimenti.",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'vision-p2',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'vision-span2',
                text: "Progettiamo e produciamo macchinari che non si limitano a funzionare: performano con l'affidabilità che solo il Made in Italy sa garantire.",
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
      },
      {
        _type: 'statsSection',
        _key: 'stats-section',
        title: 'I Nostri Numeri',
        stats: [
          { _type: 'stat', _key: 'stat-1', number: '20+', label: 'Anni di Esperienza', description: 'Due decenni di innovazione continua' },
          { _type: 'stat', _key: 'stat-2', number: '12.000+', label: 'Policut Vendute', description: 'Taglierine di precisione in tutto il mondo' },
          { _type: 'stat', _key: 'stat-3', number: '250+', label: 'Blender BG2', description: 'Miscelatori ad alte prestazioni' },
          { _type: 'stat', _key: 'stat-4', number: '8.000+', label: 'Thermolight', description: 'Sistemi di illuminazione industriale' },
          { _type: 'stat', _key: 'stat-5', number: '100%', label: 'Made in Italy', description: 'Progettazione e produzione italiana' },
        ],
      },
      {
        _type: 'richTextSection',
        _key: 'method-section',
        title: 'Il Nostro Metodo',
        content: [
          {
            _type: 'block',
            _key: 'method-p1',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'method-span1',
                text: "Dietro ogni macchina GL.OS c'è la visione di Leonardo Ceci, ingegnere e fondatore che ha trasformato problemi industriali in soluzioni brevettate.",
                marks: [],
              },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'method-p2',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'method-span2',
                text: "Dal Policut al Blender, ogni prodotto nasce da un'esigenza reale del mercato, sviluppata con rigore ingegneristico e perfezionata attraverso anni di feedback dai professionisti del settore.",
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
      },
    ]

    // Aggiorna la pagina
    const result = await mutateSanity([
      {
        patch: {
          id: page._id,
          set: { sections: newSections }
        }
      }
    ])

    console.log('Risultato:', JSON.stringify(result, null, 2))
    console.log('Pagina Chi Siamo aggiornata con successo!')
  } catch (error) {
    console.error('Errore:', error)
  }
}

updateChiSiamo()
