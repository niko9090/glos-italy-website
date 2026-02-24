// Script per popolare la gallery "Le nostre tecniche" con le immagini dei prodotti

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

function generateKey() {
  return Math.random().toString(36).substring(2, 15)
}

async function populateGallery() {
  try {
    console.log('Recuperando immagini dai prodotti...')

    // Ottieni le immagini gallery del Blender GL.OS (ha 7 immagini)
    const { result: blender } = await fetchSanity(`*[_type == "product" && name == "Blender GL.OS"][0]{ gallery }`)

    // Ottieni le immagini gallery del Policut Twin
    const { result: policut } = await fetchSanity(`*[_type == "product" && name == "Policut Twin 20/30"][0]{ gallery }`)

    // Ottieni le immagini principali di altri prodotti
    const { result: products } = await fetchSanity(`*[_type == "product" && defined(mainImage)] | order(sortOrder asc)[0...6] { name, mainImage }`)

    // Raccogli le immagini per la gallery
    const galleryImages = []

    // Aggiungi alcune immagini dalla gallery del Blender
    if (blender?.gallery) {
      blender.gallery.slice(0, 4).forEach((img, i) => {
        galleryImages.push({
          _key: generateKey(),
          _type: 'image',
          asset: img.asset,
          caption: {
            it: 'Blender GL.OS - Tecnologia di miscelazione',
            en: 'Blender GL.OS - Mixing Technology',
            es: 'Blender GL.OS - Tecnología de mezclado'
          },
          alt: `Blender GL.OS immagine ${i + 1}`,
          category: 'Blender'
        })
      })
    }

    // Aggiungi immagini dalla gallery del Policut Twin
    if (policut?.gallery) {
      policut.gallery.slice(0, 2).forEach((img, i) => {
        galleryImages.push({
          _key: generateKey(),
          _type: 'image',
          asset: img.asset,
          caption: {
            it: 'Policut Twin - Taglierina di precisione',
            en: 'Policut Twin - Precision Cutter',
            es: 'Policut Twin - Cortadora de precisión'
          },
          alt: `Policut Twin immagine ${i + 1}`,
          category: 'Policut'
        })
      })
    }

    // Aggiungi immagini principali dei prodotti
    products?.forEach(product => {
      if (product.mainImage?.asset) {
        const name = typeof product.name === 'object' ? (product.name.it || product.name.en) : product.name
        galleryImages.push({
          _key: generateKey(),
          _type: 'image',
          asset: product.mainImage.asset,
          caption: {
            it: name || 'Prodotto GLOS',
            en: name || 'GLOS Product',
            es: name || 'Producto GLOS'
          },
          alt: name || 'Prodotto GLOS',
          category: 'Prodotti'
        })
      }
    })

    console.log(`Trovate ${galleryImages.length} immagini da aggiungere`)

    if (galleryImages.length === 0) {
      console.error('Nessuna immagine trovata!')
      return
    }

    // Trova l'ID della pagina home
    const { result: home } = await fetchSanity(`*[_type == "page" && slug.current == "home"][0]{ _id }`)

    if (!home) {
      console.error('Pagina home non trovata!')
      return
    }

    // Aggiorna la sezione gallery con le nuove immagini
    const mutations = [
      {
        patch: {
          id: home._id,
          set: {
            'sections[4].images': galleryImages,
            'sections[4].maxImages': 0  // Mostra tutte le immagini
          }
        }
      }
    ]

    console.log('Aggiornamento gallery con le immagini...')
    const mutationResult = await mutateSanity(mutations)
    console.log('Risultato:', JSON.stringify(mutationResult, null, 2))
    console.log(`\n✅ Gallery aggiornata con ${galleryImages.length} immagini!`)

  } catch (error) {
    console.error('Errore:', error)
  }
}

populateGallery()
