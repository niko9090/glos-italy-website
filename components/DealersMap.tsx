'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getTextValue } from '@/lib/utils/textHelpers'

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

interface Dealer {
  _id: string
  name?: string
  type?: string
  city?: string
  address?: string
  phone?: string
  email?: string
  location?: {
    lat: number
    lng: number
  }
  certifications?: string[]
}

interface DealersMapProps {
  dealers: Dealer[]
  selectedDealer?: Dealer | null
  onSelectDealer?: (dealer: Dealer) => void
}

export default function DealersMap({ dealers, selectedDealer, onSelectDealer }: DealersMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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

  // Filtra dealer con coordinate valide
  const dealersWithLocation = dealers.filter(
    (d) => d.location?.lat && d.location?.lng
  )

  // Se c'e un dealer selezionato con coordinate, centra su di esso
  const center: [number, number] = selectedDealer?.location
    ? [selectedDealer.location.lat, selectedDealer.location.lng]
    : italyCenter
  const zoom = selectedDealer?.location ? 12 : defaultZoom

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

      {dealersWithLocation.map((dealer) => (
        <Marker
          key={dealer._id}
          position={[dealer.location!.lat, dealer.location!.lng]}
          eventHandlers={{
            click: () => onSelectDealer?.(dealer),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-semibold text-gray-900 mb-1">{getTextValue(dealer.name)}</h3>

              {getTextValue(dealer.type) && (
                <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded mb-2">
                  {getTextValue(dealer.type) === 'distributore' ? 'Distributore' :
                   getTextValue(dealer.type) === 'agente' ? 'Agente' : 'Rivenditore'}
                </span>
              )}

              {getTextValue(dealer.city) && (
                <p className="text-sm text-gray-600 mb-1">{getTextValue(dealer.city)}</p>
              )}

              {getTextValue(dealer.address) && (
                <p className="text-sm text-gray-500 mb-2">{getTextValue(dealer.address)}</p>
              )}

              {dealer.certifications && dealer.certifications.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {dealer.certifications.map((cert, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded"
                    >
                      {getTextValue(cert)}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-1 pt-2 border-t">
                {getTextValue(dealer.phone) && (
                  <a
                    href={`tel:${getTextValue(dealer.phone).replace(/\s/g, '')}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {getTextValue(dealer.phone)}
                  </a>
                )}
                {getTextValue(dealer.email) && (
                  <a
                    href={`mailto:${getTextValue(dealer.email)}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {getTextValue(dealer.email)}
                  </a>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
