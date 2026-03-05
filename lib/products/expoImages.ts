// EXPO Images mapping per prodotti
// Le immagini EXPO sostituiscono le vecchie immagini Sanity

const policut1000Images = [
  '/images/products/policut-basic-1000/frontale.jpg',
  '/images/products/policut-basic-1000/laterale.jpg',
  '/images/products/policut-basic-1000/dettaglio-lama.jpg',
  '/images/products/policut-basic-1000/in-uso.jpg',
]

const policut1200Images = [
  '/images/products/policut-basic-1200/laterale-guida.jpg',
  '/images/products/policut-basic-1200/frontale.jpg',
]

const twinSImages = [
  '/images/products/policut-twin-s/frontale-guida.jpg',
  '/images/products/policut-twin-s/laterale.jpg',
  '/images/products/policut-twin-s/frontale-compatto.jpg',
]

const policut1000EasyImages = [
  '/images/products/policut-easy-1000/laterale.jpg',
  '/images/products/policut-easy-1000/frontale-lama.jpg',
  '/images/products/policut-easy-1000/in-uso.jpg',
]

const policut1200EasyImages = [
  '/images/products/policut-easy-1200/frontale.jpg',
]

const washStationImages = [
  '/images/products/wash-station/frontale.jpg',
  '/images/products/wash-station/angolare.jpg',
  '/images/products/wash-station/posteriore-pedale.jpg',
  '/images/products/wash-station/pannello-comandi.jpg',
  '/images/products/wash-station/cupola-aperta.jpg',
  '/images/products/wash-station/dettaglio-comandi.jpg',
  '/images/products/wash-station/dettaglio-logo.jpg',
  '/images/products/wash-station/dall-alto.jpg',
  '/images/products/wash-station/interno-vasca.jpg',
]

const termolightImages = [
  '/images/products/termolight/frontale.jpg',
  '/images/products/termolight/dettaglio-comandi.jpg',
  '/images/products/termolight/laterale-etichetta.jpg',
]

// Mapping slug prodotto -> immagini EXPO
export const productExpoGallery: Record<string, string[]> = {
  // Easy Basic (Policut Basic)
  'easy-basic-700': policut1000Images,
  'easy-basic-1000': policut1000Images,
  'easy-basic-1000-cc': policut1000Images,
  'easy-basic-1200': policut1200Images,
  'easy-basic-1200-cc': policut1200Images,
  // Twin Basic (Policut Twin S)
  'twin-basic-1000-s': twinSImages,
  'twin-basic-1000-scc': twinSImages,
  'twin-basic-1200-s': twinSImages,
  'twin-basic-1200-scc': twinSImages,
  // Policut Twin
  'policut-twin-120-20': twinSImages,
  'policut-twin-120-30': twinSImages,
  'policut-twin-20-30': twinSImages,
  // Policut Easy 1000
  'policut-easy-1000': policut1000EasyImages,
  'policut-easy-1000-20': policut1000EasyImages,
  'policut-easy-1000-30': policut1000EasyImages,
  // Policut Easy 1200
  'policut-easy-1200-20': policut1200EasyImages,
  'policut-easy-1200-30': policut1200EasyImages,
  'policut-easy-basic-1200': policut1200EasyImages,
  'policut-easy-light-1200': policut1200EasyImages,
  // Policut Easy 700
  'policut-easy-700-20': policut1000EasyImages,
  'policut-easy-700-30': policut1000EasyImages,
  // Wash Station
  'glos-wash-station': washStationImages,
  // Termolight
  'termolight-con-cavalletto': termolightImages,
  'termolight-senza-cavalletto': termolightImages,
}

/**
 * Ottiene la prima immagine EXPO per un prodotto (per thumbnail/listing)
 * @param slug - slug del prodotto
 * @returns path immagine o null se non disponibile
 */
export function getExpoThumbnail(slug: string): string | null {
  const images = productExpoGallery[slug]
  return images && images.length > 0 ? images[0] : null
}

/**
 * Ottiene tutte le immagini EXPO per un prodotto
 * @param slug - slug del prodotto
 * @returns array di path immagini (vuoto se non disponibili)
 */
export function getExpoImages(slug: string): string[] {
  return productExpoGallery[slug] || []
}
