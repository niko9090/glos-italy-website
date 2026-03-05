// Script per aggiornare i dealers - rimuove esempi e aggiunge San Marino Vernici

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

async function updateDealers() {
  try {
    console.log('Eliminando dealer di esempio...')

    // IDs dei dealer di esempio da eliminare
    const dealersToDelete = [
      'af5c2fe6-c73b-4348-8a9e-575c41d6a3ce', // nino l'imbianchino
      'fd72653f-adbc-4a9c-b750-aeb308c979d8'  // franco pittura
    ]

    const deleteMutations = dealersToDelete.map(id => ({
      delete: { id }
    }))

    const deleteResult = await mutateSanity(deleteMutations)
    console.log('Dealer eliminati:', deleteResult.results?.length || 0)

    console.log('\nCreando nuovo dealer: San Marino Vernici...')

    // Coordinate di Dogana, San Marino (circa)
    const sanMarinoCoords = {
      lat: 43.9636,
      lng: 12.4530
    }

    const createMutation = [
      {
        create: {
          _type: 'dealer',
          name: 'San Marino Vernici',
          address: 'Via A. Canova 54',
          city: 'Dogana',
          country: 'Altro', // San Marino non è nella lista, usiamo "Altro"
          isActive: true,
          isFeatured: true,
          type: 'rivenditore',
          location: sanMarinoCoords,
          description: 'Rivenditore autorizzato GLOS a San Marino',
          certifications: ['Autorizzato']
        }
      }
    ]

    const createResult = await mutateSanity(createMutation)
    console.log('Dealer creato:', JSON.stringify(createResult, null, 2))

    if (createResult.results?.[0]?.operation === 'create') {
      console.log('\n✅ San Marino Vernici aggiunto con successo!')
      console.log('ID:', createResult.results[0].id)
    }

  } catch (error) {
    console.error('Errore:', error)
  }
}

updateDealers()
