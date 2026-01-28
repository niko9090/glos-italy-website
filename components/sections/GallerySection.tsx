// Gallery Section Component
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { urlFor } from '@/lib/sanity/client'
import { t, defaultLocale } from '@/lib/i18n'

interface GallerySectionProps {
  data: {
    title?: { it?: string; en?: string; es?: string }
    subtitle?: { it?: string; en?: string; es?: string }
    images?: Array<{
      _key: string
      asset: any
      alt?: { it?: string; en?: string; es?: string }
      caption?: { it?: string; en?: string; es?: string }
    }>
    layout?: 'grid' | 'masonry' | 'carousel'
  }
}

export default function GallerySection({ data }: GallerySectionProps) {
  const locale = defaultLocale
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goToPrev = () => {
    if (lightboxIndex !== null && data.images) {
      setLightboxIndex(lightboxIndex === 0 ? data.images.length - 1 : lightboxIndex - 1)
    }
  }

  const goToNext = () => {
    if (lightboxIndex !== null && data.images) {
      setLightboxIndex(lightboxIndex === data.images.length - 1 ? 0 : lightboxIndex + 1)
    }
  }

  return (
    <section className="section bg-white">
      <div className="container-glos">
        {/* Header */}
        {(data.title || data.subtitle) && (
          <div className="text-center mb-12">
            {data.title && (
              <h2 className="section-title mb-4">{t(data.title, locale)}</h2>
            )}
            {data.subtitle && (
              <p className="section-subtitle mx-auto">{t(data.subtitle, locale)}</p>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.images?.map((image, index) => (
            <motion.button
              key={image._key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => openLightbox(index)}
              className="relative aspect-square overflow-hidden rounded-lg group"
            >
              <Image
                src={urlFor(image).width(400).height(400).url()}
                alt={t(image.alt, locale) || ''}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            </motion.button>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxIndex !== null && data.images && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
              onClick={closeLightbox}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Navigation */}
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev() }}
                className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); goToNext() }}
                className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              {/* Image */}
              <div
                className="relative max-w-5xl max-h-[80vh] w-full h-full mx-8"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={urlFor(data.images[lightboxIndex]).width(1600).url()}
                  alt={t(data.images[lightboxIndex].alt, locale) || ''}
                  fill
                  className="object-contain"
                />

                {/* Caption */}
                {data.images[lightboxIndex].caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-center">
                      {t(data.images[lightboxIndex].caption, locale)}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
