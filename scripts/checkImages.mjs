// Script per controllare le immagini in Sanity

const projectId = '97oreljh'
const dataset = 'production'
const apiVersion = '2024-01-01'

async function fetchSanity(query) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`
  const res = await fetch(url)
  return res.json()
}

async function checkImages() {
  console.log('Cercando immagini in Sanity...\n')

  // Immagini dai prodotti
  const productsQuery = '*[_type == "product" && defined(mainImage)] { _id, name, mainImage }'
  const { result: products } = await fetchSanity(productsQuery)

  console.log(`📦 Trovati ${products?.length || 0} prodotti con immagini:\n`)
  products?.forEach(p => {
    console.log(`  - ${p.name}: ${p.mainImage?.asset?._ref}`)
  })

  // Immagini dalla gallery esistente dei prodotti
  const galleryQuery = '*[_type == "product" && defined(gallery)] { _id, name, "galleryCount": count(gallery) }'
  const { result: galleries } = await fetchSanity(galleryQuery)

  console.log(`\n🖼️ Prodotti con gallery:\n`)
  galleries?.filter(g => g.galleryCount > 0).forEach(g => {
    console.log(`  - ${g.name}: ${g.galleryCount} immagini`)
  })
}

checkImages()
