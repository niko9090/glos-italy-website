'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
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

// Funzione per geocodificare un indirizzo usando OpenStreetMap Nominatim (gratuito, no CORS)
async function geocodeAddress(address: string, city: string, country?: string): Promise<{ lat: number; lng: number } | null> {
  // Pulisci i testi da caratteri invisibili
  const cleanAddress = cleanText(address || '')
  const cleanCity = cleanText(city || '')
  const cleanCountry = cleanText(country || 'Italia')

  const fullAddress = [cleanAddress, cleanCity, cleanCountry].filter(Boolean).join(', ')

  // Controlla cache
  if (geocodeCache[fullAddress] !== undefined) {
    return geocodeCache[fullAddress]
  }

  try {
    const encoded = encodeURIComponent(fullAddress)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1`,
      {
        headers: {
          'User-Agent': 'GLOSItaly/1.0 (https://glositaly.vercel.app)'
        }
      }
    )
    const data = await response.json()

    if (data && data.length > 0 && data[0].lat && data[0].lon) {
      const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      geocodeCache[fullAddress] = result
      return result
    }

    geocodeCache[fullAddress] = null
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    geocodeCache[fullAddress] = null
    return null
  }
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

    const geocodeAll = async () => {
      const results: Record<string, { lat: number; lng: number }> = {}

      for (const dealer of dealersNeedingGeocode) {
        const address = dealer.address || ''
        const city = dealer.city || ''
        const country = dealer.country

        if (city) {
          const coords = await geocodeAddress(address, city, country)
          if (coords) {
            results[dealer._id] = coords
          }
        }
      }

      setGeocodedDealers(results)
      setIsGeocoding(false)
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

  // Centro Italia
  const italyCenter: [number, number] = [42.5, 12.5]
  const defaultZoom = 6

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

  return (
    <>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-96 rounded-2xl z-0"
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

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
      </MapContainer>

      {/* Modal Rivenditore */}
      {modalDealer && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setModalDealer(null)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
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
