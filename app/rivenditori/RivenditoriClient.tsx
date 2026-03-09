'use client'

import Image from 'next/image'
import { MapPin, Star, Quote } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useTranslations } from '@/lib/context/LanguageContext'
import DealersMap from '@/components/DealersMapWrapper'

interface Dealer {
  _id: string
  name: string
  description?: string
  logo?: any
  address?: string
  city?: string
  country?: string
  phone?: string
  email?: string
  location?: { lat: number; lng: number }
  isFeatured?: boolean
}

interface Testimonial {
  _id: string
  author?: string
  role?: string
  company?: string
  quote?: string
  rating?: number
  avatar?: any
}

interface RivenditoriClientProps {
  dealers: Dealer[]
  testimonials: Testimonial[]
}

export default function RivenditoriClient({ dealers, testimonials }: RivenditoriClientProps) {
  const { t } = useTranslations()

  const dealersWithCoords = dealers.filter((d) =>
    (d.location?.lat && d.location?.lng) || d.city || d.address
  )

  const countriesCount = new Set(dealers.map(d => d.country || 'Italia').filter(Boolean)).size

  return (
    <div className="section">
      <div className="container-glos">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title mb-4">{t('community.title')}</h1>
          <p className="section-subtitle mx-auto">
            {t('community.subtitle')}
          </p>
          {dealers.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {t('community.presentIn', { count: countriesCount })}
            </p>
          )}
        </div>

        {/* Mappa Interattiva */}
        {dealersWithCoords.length > 0 ? (
          <div className="mb-12">
            <DealersMap dealers={dealers} />
            <p className="text-sm text-gray-500 text-center mt-2">
              {t('community.clickMarkers')}
            </p>
          </div>
        ) : dealers.length > 0 ? (
          <div className="mb-12 bg-gray-100 rounded-2xl p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {t('community.noCoordinates')}
              <br />
              {t('community.mapComingSoon')}
            </p>
          </div>
        ) : null}

        {/* Recensioni Clienti */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Quote className="w-6 h-6 text-primary" /> {t('community.whatTheySay')}
          </h2>
          {testimonials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  {/* Rating */}
                  {testimonial.rating && (
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Quote */}
                  <blockquote className="text-gray-700 mb-4 italic">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {isValidImage(testimonial.avatar) && safeImageUrl(testimonial.avatar, 48, 48) && (
                      <Image
                        src={safeImageUrl(testimonial.avatar, 48, 48)!}
                        alt={testimonial.author || ''}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      {(testimonial.role || testimonial.company) && (
                        <p className="text-sm text-gray-500">
                          {testimonial.role}
                          {testimonial.role && testimonial.company && ' - '}
                          {testimonial.company}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <Quote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {t('community.reviewsComingSoon')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
