// Map Section Component - Interactive map with custom markers
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import nextDynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Globe, ExternalLink, Award, Clock, Star, Play } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { MOTION, fadeInUp, staggerContainer, staggerItem } from '@/lib/animations/config'
import RichText from '@/components/RichText'
import { getSpacingClasses } from '@/lib/utils/spacing'
import { sl } from '@/lib/utils/stegaSafe'

// Dynamic import for Leaflet (no SSR)
const DealersMap = nextDynamic(() => import('@/components/DealersMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center min-h-[300px]">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-gray-500">Caricamento mappa...</p>
      </div>
    </div>
  ),
})

// Custom Map component for custom markers and single-location
const CustomMap = nextDynamic(
  () => import('react-leaflet').then((mod) => {
    // Import leaflet CSS
    require('leaflet/dist/leaflet.css')

    const { MapContainer, TileLayer, Marker, Popup } = mod
    const L = require('leaflet')

    // Fix for Leaflet icons in Next.js
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

    // Create colored marker icon
    const createColoredIcon = (color?: string) => {
      const markerColor = color || '#e63946'
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: ${markerColor};
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      })
    }

    return function CustomMapComponent({
      markers,
      center,
      zoom,
      height,
      lang,
      t
    }: {
      markers: CustomMarker[]
      center: [number, number]
      zoom: number
      height: string
      lang: string
      t: (value: unknown) => string
    }) {
      return (
        <MapContainer
          center={center}
          zoom={zoom}
          className={`w-full rounded-2xl z-0 ${height}`}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((marker) => {
            const title = marker.title?.[lang as keyof typeof marker.title] || marker.title?.it || ''
            const description = marker.description?.[lang as keyof typeof marker.description] || marker.description?.it || ''

            return (
              <Marker
                key={marker._key}
                position={[marker.lat, marker.lng]}
                icon={createColoredIcon(marker.color)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    {marker.icon && <span className="text-2xl mb-2 block">{marker.icon}</span>}
                    <h3 className="font-semibold text-lg mb-1">{title}</h3>
                    {description && <p className="text-sm text-gray-600 mb-2">{description}</p>}
                    {marker.link && (
                      <a
                        href={marker.link}
                        target={marker.link.startsWith('http') ? '_blank' : undefined}
                        rel={marker.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                      >
                        Scopri di più
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      )
    }
  }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-500">Caricamento mappa...</p>
        </div>
      </div>
    ),
  }
)

// Types
interface LocalizedString {
  it?: string
  en?: string
  es?: string
}

interface CustomMarker {
  _key: string
  title: LocalizedString
  description?: LocalizedString
  lat: number
  lng: number
  icon?: string
  color?: string
  link?: string
}

interface Dealer {
  _id: string
  name?: string
  type?: string
  description?: string
  logo?: unknown
  email?: string
  phone?: string
  website?: string
  openingHours?: string
  country?: string
  city?: string
  address?: string
  location?: {
    lat: number
    lng: number
  }
  regions?: string[]
  certifications?: string[]
  youtubeVideo?: string
  isFeatured?: boolean
}

interface MapSectionProps {
  documentId?: string
  sectionKey?: string
  data: {
    _type: 'mapSection'
    title?: LocalizedString
    subtitle?: LocalizedString
    mapType?: 'dealers' | 'custom' | 'single-location'
    centerLat?: number
    centerLng?: number
    zoom?: number
    markers?: CustomMarker[]
    height?: 'small' | 'medium' | 'large' | 'full'
    showDealersList?: boolean
    backgroundColor?: string
    paddingY?: 'none' | 'small' | 'medium' | 'large'
    paddingTop?: string
    paddingBottom?: string
    marginTop?: string
    marginBottom?: string
  }
  dealers?: Dealer[]
}

// Helper to get YouTube video ID
function getYouTubeId(url: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
  return match ? match[1] : null
}

export default function MapSection({ data, dealers = [], documentId, sectionKey }: MapSectionProps) {
  const { language, t } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Get localized text
  const getText = (value: LocalizedString | undefined): string => {
    if (!value) return ''
    return value[language as keyof LocalizedString] || value.it || ''
  }

  // Height classes
  const heightClasses: Record<string, string> = {
    small: 'h-[300px]',
    medium: 'h-[400px]',
    large: 'h-[500px]',
    full: 'h-screen',
  }

  // Background classes (fixed: use CSS classes instead of inline style with symbolic names)
  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    'gray-light': 'bg-gray-50',
    gray: 'bg-gray-100',
    primary: 'bg-primary',
    black: 'bg-gray-900',
  }
  const bgClass = sl(bgClasses, data.backgroundColor, 'white')

  // Default center (Italy)
  const defaultCenter: [number, number] = [42.5, 12.5]
  const center: [number, number] = [
    data.centerLat ?? defaultCenter[0],
    data.centerLng ?? defaultCenter[1],
  ]
  const zoom = data.zoom ?? 6

  const mapHeight = sl(heightClasses, data.height, 'medium')

  // Filter dealers with location data
  const dealersWithLocation = dealers.filter(
    (d) => (d.location?.lat && d.location?.lng) || d.city || d.address
  )

  // Dealer Card Component
  const DealerCard = ({ dealer }: { dealer: Dealer }) => {
    const youtubeId = dealer.youtubeVideo ? getYouTubeId(dealer.youtubeVideo) : null

    return (
      <motion.article
        variants={staggerItem}
        className={`card p-6 relative ${dealer.isFeatured ? 'ring-2 ring-yellow-400 bg-yellow-50/30' : ''}`}
      >
        {dealer.isFeatured && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3" /> In Evidenza
          </div>
        )}

        <div className="flex items-start gap-4">
          {isValidImage(dealer.logo) && safeImageUrl(dealer.logo, 128, 128) ? (
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={safeImageUrl(dealer.logo, 128, 128)!}
                alt={String(dealer.name || '')}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">
                {dealer.type === 'distributore' ? '🏭' : dealer.type === 'agente' ? '👤' : '🏪'}
              </span>
            </div>
          )}
          <div className="flex-grow min-w-0">
            <h3 className="text-lg font-semibold truncate">{String(t(dealer.name) || '')}</h3>
            <p className="text-sm text-gray-500">
              {[dealer.city, dealer.country].filter(Boolean).join(', ')}
            </p>

            {dealer.certifications && dealer.certifications.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {dealer.certifications.map((cert: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
                  >
                    <Award className="w-3 h-3" />
                    {String(t(cert) || '')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {dealer.description && (
          <p className="mt-4 text-sm text-gray-600 line-clamp-2">{String(t(dealer.description) || '')}</p>
        )}

        {dealer.address && (
          <div className="flex items-start gap-2 mt-4 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
            <span>{String(t(dealer.address) || '')}</span>
          </div>
        )}

        <div className="mt-4 space-y-2">
          {dealer.phone && (
            <a
              href={`tel:${String(t(dealer.phone) || '').replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              {String(t(dealer.phone) || '')}
            </a>
          )}
          {dealer.email && (
            <a
              href={`mailto:${String(t(dealer.email) || '')}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              {String(t(dealer.email) || '')}
            </a>
          )}
          {dealer.website && (
            <a
              href={dealer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <Globe className="w-4 h-4" />
              Visita il sito web
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {dealer.openingHours && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{String(t(dealer.openingHours) || '')}</span>
            </div>
          </div>
        )}

        {dealer.regions && dealer.regions.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Zone coperte:</p>
            <div className="flex flex-wrap gap-1">
              {dealer.regions.map((region: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {String(t(region) || '')}
                </span>
              ))}
            </div>
          </div>
        )}

        {youtubeId && (
          <div className="mt-4 pt-4 border-t">
            <a
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Play className="w-5 h-5" />
              Guarda il Video
            </a>
          </div>
        )}
      </motion.article>
    )
  }

  // Section for grouping dealers
  const DealerSection = ({
    title,
    emoji,
    sectionDealers,
  }: {
    title: string
    emoji: string
    sectionDealers: Dealer[]
  }) => {
    if (sectionDealers.length === 0) return null

    return (
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span>{emoji}</span> {title}
          <span className="text-sm font-normal text-gray-500">({sectionDealers.length})</span>
        </h3>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sectionDealers.map((dealer) => (
            <DealerCard key={dealer._id} dealer={dealer} />
          ))}
        </motion.div>
      </div>
    )
  }

  return (
    <section
      data-sanity-edit-target
      className={`${getSpacingClasses(data)} ${bgClass} relative overflow-hidden`}
    >
      <div className="container-glos">
        {/* Header */}
        {(data.title || data.subtitle) && (
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.animate}
            viewport={MOTION.VIEWPORT.ONCE}
            transition={{ duration: MOTION.DURATION.SLOW }}
            className="text-center mb-12"
          >
            {data.title && (
              <h2 className="section-title mb-4">{getText(data.title)}</h2>
            )}
            {data.subtitle && (
              <p className="section-subtitle">{getText(data.subtitle)}</p>
            )}
          </motion.div>
        )}

        {/* Map */}
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.animate}
          viewport={MOTION.VIEWPORT.ONCE}
          transition={{ duration: MOTION.DURATION.SLOW, delay: 0.1 }}
          className="mb-8"
        >
          {data.mapType === 'dealers' ? (
            // Use DealersMap for dealers
            dealersWithLocation.length > 0 ? (
              <div className={mapHeight}>
                <DealersMap dealers={dealers} />
              </div>
            ) : (
              <div className={`${mapHeight} bg-gray-100 rounded-2xl flex items-center justify-center`}>
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Nessun rivenditore con coordinate disponibili.
                  </p>
                </div>
              </div>
            )
          ) : data.mapType === 'custom' || data.mapType === 'single-location' ? (
            // Use CustomMap for custom markers or single location
            isMounted && data.markers && data.markers.length > 0 ? (
              <CustomMap
                markers={data.markers}
                center={center}
                zoom={zoom}
                height={mapHeight}
                lang={language}
                t={t}
              />
            ) : isMounted ? (
              <div className={`${mapHeight} bg-gray-100 rounded-2xl flex items-center justify-center`}>
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Nessun marker configurato per questa mappa.
                  </p>
                </div>
              </div>
            ) : null
          ) : null}

          {data.mapType === 'dealers' && dealersWithLocation.length > 0 && (
            <p className="text-sm text-gray-500 text-center mt-2">
              Clicca sui marker per vedere i dettagli del rivenditore
            </p>
          )}
        </motion.div>

        {/* Dealers List (only for dealers mapType with showDealersList) */}
        {data.mapType === 'dealers' && data.showDealersList && dealers.length > 0 && (
          <div className="mt-12">
            {/* Featured Dealers */}
            {dealers.filter((d) => d.isFeatured).length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" /> Partner in Evidenza
                  <span className="text-sm font-normal text-gray-500">
                    ({dealers.filter((d) => d.isFeatured).length})
                  </span>
                </h3>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {dealers
                    .filter((d) => d.isFeatured)
                    .map((dealer) => (
                      <DealerCard key={dealer._id} dealer={dealer} />
                    ))}
                </motion.div>
              </div>
            )}

            {/* Dealers by type */}
            <DealerSection
              title="Distributori"
              emoji="🏭"
              sectionDealers={dealers.filter((d) => !d.isFeatured && d.type === 'distributore')}
            />
            <DealerSection
              title="Rivenditori"
              emoji="🏪"
              sectionDealers={dealers.filter((d) => !d.isFeatured && d.type === 'rivenditore')}
            />
            <DealerSection
              title="Agenti"
              emoji="👤"
              sectionDealers={dealers.filter((d) => !d.isFeatured && d.type === 'agente')}
            />
          </div>
        )}
      </div>
    </section>
  )
}
