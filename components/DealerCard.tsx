'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Phone, Mail, Award, Globe, Clock, Star, Play, ExternalLink } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { getTextValue } from '@/lib/utils/textHelpers'
import VideoModal from './VideoModal'

interface DealerCardProps {
  dealer: {
    _id: string
    name?: unknown
    type?: string
    description?: unknown
    logo?: unknown
    email?: string
    phone?: string
    website?: string
    openingHours?: string
    country?: string
    city?: string
    address?: unknown
    regions?: string[]
    certifications?: string[]
    youtubeVideo?: string
    isFeatured?: boolean
  }
  showFeatured?: boolean
}

// Helper per estrarre ID video YouTube
const getYouTubeId = (url: string) => {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
  return match ? match[1] : null
}

export default function DealerCard({ dealer, showFeatured = false }: DealerCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const youtubeId = getYouTubeId(dealer.youtubeVideo || '')
  const isFeatured = dealer.isFeatured && showFeatured
  const dealerName = getTextValue(dealer.name)

  return (
    <>
      <article className={`card p-6 relative ${isFeatured ? 'ring-2 ring-yellow-400 bg-yellow-50/30' : ''}`}>
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3" /> In Evidenza
          </div>
        )}

        <div className="flex items-start gap-4">
          {isValidImage(dealer.logo) && safeImageUrl(dealer.logo, 128, 128) ? (
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={safeImageUrl(dealer.logo, 128, 128)!}
                alt={String(dealerName || '')}
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
            <h3 className="text-lg font-semibold truncate">{dealerName}</h3>

            {/* Country & City */}
            <p className="text-sm text-gray-500">
              {[dealer.city, dealer.country].filter(Boolean).join(', ')}
            </p>

            {/* Certifications */}
            {dealer.certifications && dealer.certifications.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {dealer.certifications.map((cert: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
                  >
                    <Award className="w-3 h-3" />
                    {getTextValue(cert)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {dealer.description && (
          <p className="mt-4 text-sm text-gray-600 line-clamp-2">
            {getTextValue(dealer.description)}
          </p>
        )}

        {/* Address */}
        {dealer.address && (
          <div className="flex items-start gap-2 mt-4 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
            <span>{getTextValue(dealer.address)}</span>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-4 space-y-2">
          {dealer.phone && (
            <a
              href={`tel:${getTextValue(dealer.phone).replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              {getTextValue(dealer.phone)}
            </a>
          )}
          {dealer.email && (
            <a
              href={`mailto:${getTextValue(dealer.email)}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              {getTextValue(dealer.email)}
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

        {/* Opening Hours */}
        {dealer.openingHours && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{getTextValue(dealer.openingHours)}</span>
            </div>
          </div>
        )}

        {/* Regions */}
        {dealer.regions && dealer.regions.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Zone coperte:</p>
            <div className="flex flex-wrap gap-1">
              {dealer.regions.map((region: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {getTextValue(region)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Video YouTube Button */}
        {youtubeId && (
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={() => setIsVideoOpen(true)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Play className="w-5 h-5" />
              Guarda il Video
            </button>
          </div>
        )}
      </article>

      {/* Video Modal */}
      {youtubeId && (
        <VideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          youtubeId={youtubeId}
          title={dealerName}
        />
      )}
    </>
  )
}
