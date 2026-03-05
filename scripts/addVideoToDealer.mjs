// Script per aggiungere il video al dealer San Marino Vernici

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

async function addVideoToDealer() {
  try {
    console.log('Cercando San Marino Vernici...')

    const { result: dealer } = await fetchSanity(`*[_type == "dealer" && name == "San Marino Vernici"][0]{ _id }`)

    if (!dealer) {
      console.error('Dealer non trovato!')
      return
    }

    console.log('ID dealer:', dealer._id)

    const mutations = [
      {
        patch: {
          id: dealer._id,
          set: {
            localVideoPath: '/videos/san-marino-vernici.mp4'
          }
        }
      }
    ]

    console.log('Aggiungendo video...')
    const result = await mutateSanity(mutations)
    console.log('Risultato:', JSON.stringify(result, null, 2))

    if (result.results?.[0]?.operation === 'update') {
      console.log('\n✅ Video aggiunto con successo!')
    }

  } catch (error) {
    console.error('Errore:', error)
  }
}

addVideoToDealer()
