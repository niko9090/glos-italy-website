// Script per aggiornare lo slogan in Sanity

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

async function updateSlogan() {
  try {
    // Trova siteSettings
    const settings = await fetchSanity(`*[_type == "siteSettings"][0]`)

    if (!settings) {
      console.log('SiteSettings non trovato')
      return
    }

    console.log('SiteSettings trovato:', settings._id)
    console.log('Slogan attuale:', settings.slogan || settings.tagline || 'non definito')

    // Aggiorna lo slogan
    const result = await mutateSanity([
      {
        patch: {
          id: settings._id,
          set: {
            slogan: "Soluzioni meccaniche per l'eccellenza industriale.",
            tagline: "Soluzioni meccaniche per l'eccellenza industriale."
          }
        }
      }
    ])

    console.log('Risultato:', JSON.stringify(result, null, 2))
    console.log('Slogan aggiornato con successo!')
  } catch (error) {
    console.error('Errore:', error)
  }
}

updateSlogan()
