'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLanguage } from '@/lib/context/LanguageContext'
import { X, MapPin, Phone, Mail, Globe, Award, Clock } from 'lucide-react'

// Fix per le icone Leaflet in Next.js - usa CDN
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

// Cache geocoding per evitare chiamate ripetute
const geocodeCache: Record<string, { lat: number; lng: number } | null> = {}

// Pulisce caratteri invisibili/zero-width dal testo
function cleanText(text: string): string {
  return text
    .replace(/[\u200B-\u200D\uFEFF\u2060\u00A0]/g, '') // Zero-width chars
    .replace(/\s+/g, ' ') // Multiple spaces
    .trim()
}

// Helper per fare una singola richiesta geocoding
async function fetchGeocode(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const encoded = encodeURIComponent(query)
    console.log('[Geocoding] Tentativo con query:', query)

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'GLOSItaly/1.0 (https://glositaly.vercel.app)',
          'Accept-Language': 'it'
        }
      }
    )

    if (!response.ok) {
      console.warn('[Geocoding] Risposta non OK:', response.status)
      return null
    }

    const data = await response.json()
    console.log('[Geocoding] Risposta per', query, ':', data.length > 0 ? 'TROVATO' : 'NON TROVATO')

    if (data && data.length > 0 && data[0].lat && data[0].lon) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
    return null
  } catch (error) {
    console.error('[Geocoding] Errore fetch:', error)
    return null
  }
}

// Funzione per geocodificare un indirizzo usando OpenStreetMap Nominatim
// Prova multiple strategie: indirizzo completo, solo città+paese, solo città
async function geocodeAddress(address: string, city: string, country?: string): Promise<{ lat: number; lng: number } | null> {
  // Pulisci i testi da caratteri invisibili
  const cleanAddress = cleanText(address || '')
  const cleanCity = cleanText(city || '')
  const cleanCountry = cleanText(country || 'Italia')

  // Genera una chiave cache unica
  const cacheKey = `${cleanAddress}|${cleanCity}|${cleanCountry}`

  // Controlla cache
  if (geocodeCache[cacheKey] !== undefined) {
    console.log('[Geocoding] Cache hit per:', cacheKey)
    return geocodeCache[cacheKey]
  }

  console.log('[Geocoding] Geocodifica per:', { address: cleanAddress, city: cleanCity, country: cleanCountry })

  // Strategia 1: Indirizzo completo (address, city, country)
  if (cleanAddress && cleanCity) {
    const fullQuery = [cleanAddress, cleanCity, cleanCountry].filter(Boolean).join(', ')
    const result = await fetchGeocode(fullQuery)
    if (result) {
      console.log('[Geocoding] SUCCESSO con indirizzo completo')
      geocodeCache[cacheKey] = result
      return result
    }
    // Piccolo delay per rispettare rate limits di Nominatim
    await new Promise(r => setTimeout(r, 300))
  }

  // Strategia 2: Solo città + paese
  if (cleanCity) {
    const cityQuery = [cleanCity, cleanCountry].filter(Boolean).join(', ')
    const result = await fetchGeocode(cityQuery)
    if (result) {
      console.log('[Geocoding] SUCCESSO con solo città + paese')
      geocodeCache[cacheKey] = result
      return result
    }
    await new Promise(r => setTimeout(r, 300))
  }

  // Strategia 3: Solo città (ultimo tentativo)
  if (cleanCity) {
    const result = await fetchGeocode(cleanCity)
    if (result) {
      console.log('[Geocoding] SUCCESSO con solo città')
      geocodeCache[cacheKey] = result
      return result
    }
  }

  console.warn('[Geocoding] FALLITO per:', { address: cleanAddress, city: cleanCity, country: cleanCountry })
  geocodeCache[cacheKey] = null
  return null
}

interface Dealer {
  _id: string
  name?: string
  type?: string
  description?: string
  city?: string
  address?: string
  country?: string
  phone?: string
  email?: string
  website?: string
  openingHours?: string
  youtubeVideo?: string
  location?: {
    lat?: number
    lng?: number
  }
  certifications?: string[]
}

// Estrae l'ID del video YouTube dall'URL
function getYouTubeId(url: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
  return match ? match[1] : null
}

interface DealersMapProps {
  dealers: Dealer[]
  selectedDealer?: Dealer | null
  onSelectDealer?: (dealer: Dealer) => void
}

export default function DealersMap({ dealers, selectedDealer, onSelectDealer }: DealersMapProps) {
  const { t } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)
  const [geocodedDealers, setGeocodedDealers] = useState<Record<string, { lat: number; lng: number }>>({})
  const [failedGeocode, setFailedGeocode] = useState<string[]>([]) // IDs dei dealer non geocodificati
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [modalDealer, setModalDealer] = useState<Dealer | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Chiudi modal con ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalDealer(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Geocodifica automatica per dealer senza coordinate
  useEffect(() => {
    const dealersNeedingGeocode = dealers.filter(
      (d) => (!d.location?.lat || !d.location?.lng) && (d.city || d.address)
    )

    if (dealersNeedingGeocode.length === 0) return

    setIsGeocoding(true)
    setFailedGeocode([])

    console.log('[DealersMap] Dealer da geocodificare:', dealersNeedingGeocode.map(d => ({
      name: d.name,
      city: d.city,
      address: d.address,
      country: d.country
    })))

    const geocodeAll = async () => {
      const results: Record<string, { lat: number; lng: number }> = {}
      const failed: string[] = []

      for (const dealer of dealersNeedingGeocode) {
        const address = dealer.address || ''
        const city = dealer.city || ''
        const country = dealer.country

        console.log(`[DealersMap] Geocoding "${dealer.name}"...`)

        if (city) {
          const coords = await geocodeAddress(address, city, country)
          if (coords) {
            console.log(`[DealersMap] "${dealer.name}" geocodificato:`, coords)
            results[dealer._id] = coords
          } else {
            console.warn(`[DealersMap] "${dealer.name}" NON geocodificato!`)
            failed.push(dealer._id)
          }
        } else {
          console.warn(`[DealersMap] "${dealer.name}" - manca la città!`)
          failed.push(dealer._id)
        }

        // Delay tra le richieste per rispettare rate limits
        await new Promise(r => setTimeout(r, 500))
      }

      setGeocodedDealers(results)
      setFailedGeocode(failed)
      setIsGeocoding(false)

      console.log('[DealersMap] Geocoding completato:', {
        successi: Object.keys(results).length,
        falliti: failed.length
      })
    }

    geocodeAll()
  }, [dealers])

  // Placeholder durante il caricamento
  if (!isMounted) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-500">Caricamento mappa...</p>
        </div>
      </div>
    )
  }

  // Centro Italia - zoom 5 per vedere tutta l'Italia
  const italyCenter: [number, number] = [42.5, 12.5]
  const defaultZoom = 5

  // Combina dealer con coordinate e dealer geocodificati
  const dealersWithLocation = dealers.filter((d) => {
    // Ha coordinate salvate
    if (d.location?.lat && d.location?.lng) return true
    // Ha coordinate geocodificate
    if (geocodedDealers[d._id]) return true
    return false
  })

  // Log rivenditori senza coordinate per debug
  const dealersWithoutLocation = dealers.filter((d) => {
    if (d.location?.lat && d.location?.lng) return false
    if (geocodedDealers[d._id]) return false
    return true
  })

  if (!isGeocoding && dealersWithoutLocation.length > 0) {
    console.warn('Rivenditori senza coordinate sulla mappa:', dealersWithoutLocation.map(d => ({
      name: d.name,
      city: d.city,
      address: d.address,
      hasLocation: !!d.location,
    })))
  }

  // Se c'e un dealer selezionato con coordinate, centra su di esso
  const getSelectedDealerCoords = () => {
    if (selectedDealer?.location?.lat && selectedDealer?.location?.lng) {
      return { lat: selectedDealer.location.lat, lng: selectedDealer.location.lng }
    }
    if (selectedDealer && geocodedDealers[selectedDealer._id]) {
      return geocodedDealers[selectedDealer._id]
    }
    return null
  }

  const selectedCoords = getSelectedDealerCoords()
  const center: [number, number] = selectedCoords
    ? [selectedCoords.lat, selectedCoords.lng]
    : italyCenter
  const zoom = selectedCoords ? 12 : defaultZoom

  const youtubeId = modalDealer?.youtubeVideo ? getYouTubeId(modalDealer.youtubeVideo) : null

  // Trova i nomi dei dealer non geocodificati per mostrarli
  const failedDealerNames = dealers
    .filter(d => failedGeocode.includes(d._id))
    .map(d => d.name || 'Sconosciuto')

  return (
    <>
      {/* Indicatore caricamento geocoding */}
      {isGeocoding && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          Localizzazione rivenditori in corso...
        </div>
      )}

      {/* Avviso dealer non trovati sulla mappa */}
      {!isGeocoding && failedDealerNames.length > 0 && (
        <div className="mb-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-amber-800 font-medium">
                {failedDealerNames.length === 1
                  ? 'Un rivenditore non appare sulla mappa'
                  : `${failedDealerNames.length} rivenditori non appaiono sulla mappa`}
              </p>
              <p className="text-amber-600 text-xs mt-1">
                Non è stato possibile localizzare: {failedDealerNames.join(', ')}.
                Verificare l'indirizzo o inserire le coordinate manuali in Sanity.
              </p>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-96 rounded-2xl z-0"
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          disableClusteringAtZoom={7}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          iconCreateFunction={(cluster: L.MarkerCluster) => {
            const count = cluster.getChildCount()
            let size = 'small'
            if (count > 10) size = 'medium'
            if (count > 25) size = 'large'

            const sizeClasses: Record<string, { className: string; iconSize: [number, number] }> = {
              small: { className: 'marker-cluster-small', iconSize: [40, 40] },
              medium: { className: 'marker-cluster-medium', iconSize: [50, 50] },
              large: { className: 'marker-cluster-large', iconSize: [60, 60] },
            }

            return L.divIcon({
              html: `<div class="cluster-icon">${count}</div>`,
              className: `custom-cluster-icon ${sizeClasses[size].className}`,
              iconSize: sizeClasses[size].iconSize,
            })
          }}
        >
          {dealersWithLocation.map((dealer) => {
            // Usa coordinate salvate o geocodificate
            const coords = (dealer.location?.lat && dealer.location?.lng)
              ? { lat: dealer.location.lat, lng: dealer.location.lng }
              : geocodedDealers[dealer._id]

            if (!coords) return null

            return (
              <Marker
                key={dealer._id}
                position={[coords.lat, coords.lng]}
                eventHandlers={{
                  click: () => {
                    setModalDealer(dealer)
                    onSelectDealer?.(dealer)
                  },
                }}
              />
            )
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Modal Rivenditore - Centrato nella pagina */}
      {modalDealer && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setModalDealer(null)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header compatto */}
            <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white rounded-t-xl z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{t(modalDealer.name)}</h2>
                {modalDealer.type && (
                  <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                    {modalDealer.type === 'distributore' ? 'Distributore' :
                     modalDealer.type === 'agente' ? 'Agente' : 'Rivenditore'}
                  </span>
                )}
              </div>
              <button
                onClick={() => setModalDealer(null)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video YouTube */}
            {youtubeId && (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&cc_load_policy=1&cc_lang_pref=en&hl=en`}
                  title={`Video ${modalDealer.name}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Dettagli Rivenditore - Compatti */}
            <div className="p-4 space-y-3">
              {/* Descrizione */}
              {modalDealer.description && (
                <p className="text-sm text-gray-600">{t(modalDealer.description)}</p>
              )}

              {/* Certificazioni */}
              {modalDealer.certifications && modalDealer.certifications.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {modalDealer.certifications.map((cert, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
                    >
                      <Award className="w-3 h-3" />
                      {t(cert)}
                    </span>
                  ))}
                </div>
              )}

              {/* Info compatte */}
              <div className="space-y-2 text-sm">
                {/* Indirizzo */}
                {(modalDealer.address || modalDealer.city) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-gray-600">
                      {[modalDealer.address, modalDealer.city, modalDealer.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                {/* Telefono */}
                {modalDealer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <a
                      href={`tel:${t(modalDealer.phone).replace(/\s/g, '')}`}
                      className="text-primary hover:underline"
                    >
                      {t(modalDealer.phone)}
                    </a>
                  </div>
                )}

                {/* Email */}
                {modalDealer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                    <a
                      href={`mailto:${t(modalDealer.email)}`}
                      className="text-primary hover:underline"
                    >
                      {t(modalDealer.email)}
                    </a>
                  </div>
                )}

                {/* Sito Web */}
                {modalDealer.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary flex-shrink-0" />
                    <a
                      href={modalDealer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visita il sito
                    </a>
                  </div>
                )}

                {/* Orari */}
                {modalDealer.openingHours && (
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 whitespace-pre-line">{t(modalDealer.openingHours)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
