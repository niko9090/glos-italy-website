// Script per aggiornare il numero di telefono in Sanity

const projectId = '97oreljh'
const dataset = 'production'
const token = 'skA1PF9CiGcxPjkXxpxCzCoxUErZKlzi4x8ajNyRqQMlHw9jhdusMoOORZZt4onZlUaVgBHKNKG2hxwe7OxeFcugABIPQDhgkU8pMoxTOcuOx8ePAclCdJuXxloTw1csZ0yrEWODDX9KwWjuYN6lFWPKTdIKtaS45a4sLk54QZySu1eewqEz'
const apiVersion = '2024-01-01'

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

async function updatePhone() {
  try {
    const result = await mutateSanity([
      {
        patch: {
          id: 'siteSettings',
          set: {
            phone: '+39 0522 967690'
          }
        }
      }
    ])

    console.log('Risultato:', JSON.stringify(result, null, 2))
    console.log('Telefono aggiornato: +39 0522 967690')
  } catch (error) {
    console.error('Errore:', error)
  }
}

updatePhone()
