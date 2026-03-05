// Script per centrare il titolo della hero section

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

async function centerHeroTitle() {
  try {
    console.log('Cercando la pagina home...')

    const { result: home } = await fetchSanity(`*[_type == "page" && slug.current == "home"][0]{ _id }`)

    if (!home) {
      console.error('Pagina home non trovata!')
      return
    }

    console.log('ID pagina home:', home._id)

    // Centro il titolo della heroSection (sections[0])
    const mutations = [
      {
        patch: {
          id: home._id,
          set: {
            'sections[0].contentPosition': 'center',
            'sections[0].textAlign': 'center'
          }
        }
      }
    ]

    console.log('Aggiornamento in corso...')
    const result = await mutateSanity(mutations)
    console.log('Risultato:', JSON.stringify(result, null, 2))

    if (result.results?.[0]?.operation === 'update') {
      console.log('\n✅ Titolo centrato con successo!')
    } else {
      console.log('\n⚠️ Verifica il risultato')
    }

  } catch (error) {
    console.error('Errore:', error)
  }
}

centerHeroTitle()
