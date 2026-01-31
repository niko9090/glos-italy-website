// Gallery Section Component with Enhanced Animations
'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { urlFor, isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface GallerySectionProps {
  data: {
    title?: string
    subtitle?: unknown
    images?: Array<{
      _key: string
      asset: any
      caption?: string
    }>
  }
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const thumbnailVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

const lightboxVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

const imageSlideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
}

const counterVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export default function GallerySection({ data }: GallerySectionProps) {
  const { t } = useLanguage()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [[page, direction], setPage] = useState([0, 0])

  // Filter out invalid images (missing asset reference)
  const validImages = data.images?.filter(img => isValidImage(img)) || []

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setPage([index, 0])
  }

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const paginate = useCallback((newDirection: number) => {
    if (lightboxIndex !== null && validImages) {
      const newIndex = lightboxIndex + newDirection
      const wrappedIndex = newIndex < 0
        ? validImages.length - 1
        : newIndex >= validImages.length
          ? 0
          : newIndex
      setLightboxIndex(wrappedIndex)
      setPage([wrappedIndex, newDirection])
    }
  }, [lightboxIndex, validImages])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') paginate(-1)
      if (e.key === 'ArrowRight') paginate(1)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, closeLightbox, paginate])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxIndex])

  return (
    <section className="section bg-white overflow-hidden">
      <div className="container-glos">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-4">
            <RichText value={data.title} />
          </h2>
          <div className="section-subtitle mx-auto">
            <RichText value={data.subtitle} />
          </div>
        </motion.div>

        {/* Grid with stagger animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {validImages?.map((image, index) => (
            <motion.button
              key={image._key}
              variants={thumbnailVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 30px rgba(0, 71, 171, 0.2)',
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openLightbox(index)}
              className="relative aspect-square overflow-hidden rounded-xl group
                         ring-2 ring-transparent hover:ring-primary/50 transition-all duration-300"
            >
              <Image
                src={safeImageUrl(image, 400, 400)!}
                alt={t(image.caption)}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0
                              opacity-0 group-hover:opacity-100 transition-all duration-300
                              flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full"
                >
                  <ZoomIn className="w-6 h-6 text-white" />
                </motion.div>
              </div>

              {/* Caption preview on hover */}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent
                                translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm truncate">
                    {t(image.caption)}
                  </p>
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxIndex !== null && validImages && (
            <motion.div
              variants={lightboxVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
              onClick={closeLightbox}
            >
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full
                           text-white/80 hover:text-white hover:bg-white/20 transition-all z-10"
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Counter with fade animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  variants={counterVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm
                             rounded-full text-white text-sm font-medium"
                >
                  {lightboxIndex + 1} di {validImages.length}
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); paginate(-1) }}
                className="absolute left-4 p-3 bg-white/10 backdrop-blur-sm rounded-full
                           text-white/80 hover:text-white hover:bg-white/20 transition-all z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); paginate(1) }}
                className="absolute right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full
                           text-white/80 hover:text-white hover:bg-white/20 transition-all z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </motion.button>

              {/* Image with slide transition */}
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={imageSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative max-w-5xl max-h-[80vh] w-full h-full mx-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={safeImageUrl(validImages[lightboxIndex], 1600)!}
                    alt={t(validImages[lightboxIndex].caption)}
                    fill
                    className="object-contain"
                  />

                  {/* Caption with slide-up animation */}
                  {validImages[lightboxIndex].caption && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                    >
                      <p className="text-white text-center text-lg">
                        {t(validImages[lightboxIndex].caption)}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Thumbnail strip */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full">
                {validImages.slice(0, 7).map((img, idx) => (
                  <motion.button
                    key={img._key}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightboxIndex(idx)
                      setPage([idx, idx > lightboxIndex ? 1 : -1])
                    }}
                    className={`relative w-10 h-10 rounded-lg overflow-hidden transition-all duration-300
                               ${lightboxIndex === idx ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <Image
                      src={safeImageUrl(img, 80, 80)!}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </motion.button>
                ))}
                {validImages.length > 7 && (
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs">
                    +{validImages.length - 7}
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
