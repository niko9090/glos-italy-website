'use client'

import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLanguage } from '@/lib/context/LanguageContext'

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

// Google Maps API Key (stessa usata in EmbedSection)
const GOOGLE_MAPS_API_KEY = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'

// Cache geocoding per evitare chiamate ripetute
const geocodeCache: Record<string, { lat: number; lng: number } | null> = {}

// Funzione per geocodificare un indirizzo
async function geocodeAddress(address: string, city: string, country?: string): Promise<{ lat: number; lng: number } | null> {
  const fullAddress = [address, city, country || 'Italia'].filter(Boolean).join(', ')

  // Controlla cache
  if (geocodeCache[fullAddress] !== undefined) {
    return geocodeCache[fullAddress]
  }

  try {
    const encoded = encodeURIComponent(fullAddress)
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${GOOGLE_MAPS_API_KEY}`
    )
    const data = await response.json()

    if (data.status === 'OK' && data.results?.[0]?.geometry?.location) {
      const location = data.results[0].geometry.location
      const result = { lat: location.lat, lng: location.lng }
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
  city?: string
  address?: string
  country?: string
  phone?: string
  email?: string
  location?: {
    lat?: number
    lng?: number
  }
  certifications?: string[]
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

  useEffect(() => {
    setIsMounted(true)
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

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-96 rounded-2xl z-0"
      scrollWheelZoom={true}
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
              click: () => onSelectDealer?.(dealer),
            }}
          >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-semibold text-gray-900 mb-1">{t(dealer.name)}</h3>

              {t(dealer.type) && (
                <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded mb-2">
                  {t(dealer.type) === 'distributore' ? 'Distributore' :
                   t(dealer.type) === 'agente' ? 'Agente' : 'Rivenditore'}
                </span>
              )}

              {t(dealer.city) && (
                <p className="text-sm text-gray-600 mb-1">{t(dealer.city)}</p>
              )}

              {t(dealer.address) && (
                <p className="text-sm text-gray-500 mb-2">{t(dealer.address)}</p>
              )}

              {dealer.certifications && dealer.certifications.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {dealer.certifications.map((cert, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded"
                    >
                      {t(cert)}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-1 pt-2 border-t">
                {t(dealer.phone) && (
                  <a
                    href={`tel:${t(dealer.phone).replace(/\s/g, '')}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {t(dealer.phone)}
                  </a>
                )}
                {t(dealer.email) && (
                  <a
                    href={`mailto:${t(dealer.email)}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {t(dealer.email)}
                  </a>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
        )
      })}
    </MapContainer>
  )
}
