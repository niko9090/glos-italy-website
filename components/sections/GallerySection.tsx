// Gallery Section Component - VERSIONE AVANZATA
'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, Filter, Search } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { sl, cs } from '@/lib/utils/stegaSafe'
import { useLanguage } from '@/lib/context/LanguageContext'
import { getSpacingClasses } from '@/lib/utils/spacing'
import RichText from '@/components/RichText'

interface GalleryImage {
  _key: string
  asset: any
  caption?: unknown
  alt?: string
  category?: string
  featured?: boolean
  link?: string
}

interface GallerySectionProps {
  documentId?: string
  sectionKey?: string
  data: {
    // Content
    title?: unknown
    subtitle?: unknown
    description?: unknown
    images?: GalleryImage[]
    // Spacing
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string // legacy
    marginTop?: string
    marginBottom?: string
    // Layout
    layout?: 'grid' | 'masonry' | 'carousel' | 'justified' | 'collage' | 'featured-grid' | 'circular'
    columns?: number
    columnsMobile?: number
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    aspectRatio?: 'original' | 'square' | 'landscape' | 'landscape-4-3' | 'portrait' | 'portrait-tall'
    maxImages?: number
    showMoreButton?: boolean
    // Style
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    shadow?: 'none' | 'sm' | 'md' | 'lg'
    border?: 'none' | 'thin' | 'normal' | 'decorative'
    imageFilter?: 'none' | 'grayscale' | 'sepia' | 'saturate' | 'contrast'
    backgroundColor?: 'white' | 'gray-light' | 'gray' | 'black' | 'primary'
    showCaptions?: 'never' | 'always' | 'hover' | 'hover-slide'
    // Interaction
    enableLightbox?: boolean
    lightboxStyle?: 'classic' | 'minimal' | 'thumbnails' | 'fullscreen'
    hoverEffect?: 'none' | 'zoom' | 'zoom-bright' | 'lift' | 'overlay' | 'overlay-color' | 'tilt' | 'glitch'
    animation?: 'none' | 'fade' | 'fade-stagger' | 'zoom' | 'slide-up' | 'scale-rotate'
    enableFilters?: boolean
    filterStyle?: 'buttons' | 'pills' | 'tabs' | 'dropdown'
    enableSearch?: boolean
  }
}

export default function GallerySection({ data, documentId, sectionKey }: GallerySectionProps) {
  const { t } = useLanguage()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [[page, direction], setPage] = useState([0, 0])
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  // Filter valid images
  const validImages = useMemo(() => {
    return data.images?.filter(img => isValidImage(img)) || []
  }, [data.images])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>()
    validImages.forEach(img => {
      if (img.category) cats.add(img.category)
    })
    return ['all', ...Array.from(cats)]
  }, [validImages])

  // Filter and search images
  const filteredImages = useMemo(() => {
    let result = validImages

    if (activeFilter !== 'all') {
      result = result.filter(img => img.category === activeFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(img =>
        t(img.caption)?.toLowerCase().includes(query) ||
        img.category?.toLowerCase().includes(query)
      )
    }

    return result
  }, [validImages, activeFilter, searchQuery, t])

  // Limit displayed images
  const displayedImages = useMemo(() => {
    if (!data.maxImages || data.maxImages === 0 || showAll) {
      return filteredImages
    }
    return filteredImages.slice(0, data.maxImages)
  }, [filteredImages, data.maxImages, showAll])

  const openLightbox = (index: number) => {
    if (data.enableLightbox === false) return
    setLightboxIndex(index)
    setPage([index, 0])
  }

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const paginate = useCallback((newDirection: number) => {
    if (lightboxIndex === null) return
    const newIndex = lightboxIndex + newDirection
    const wrappedIndex = newIndex < 0
      ? displayedImages.length - 1
      : newIndex >= displayedImages.length
        ? 0
        : newIndex
    setLightboxIndex(wrappedIndex)
    setPage([wrappedIndex, newDirection])
  }, [lightboxIndex, displayedImages.length])

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
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  // Background classes
  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    'gray-light': 'bg-gray-50',
    gray: 'bg-gray-100',
    black: 'bg-gray-900',
    primary: 'bg-primary',
  }

  // Gap classes
  const gapClasses: Record<string, string> = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  // Rounded classes
  const roundedClasses: Record<string, string> = {
    none: '',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  }

  // Shadow classes
  const shadowClasses: Record<string, string> = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  }

  // Aspect ratio classes
  const aspectClasses: Record<string, string> = {
    original: '',
    square: 'aspect-square',
    landscape: 'aspect-video',
    'landscape-4-3': 'aspect-[4/3]',
    portrait: 'aspect-[3/4]',
    'portrait-tall': 'aspect-[9/16]',
  }

  // Filter classes
  const filterClasses: Record<string, string> = {
    none: '',
    grayscale: 'grayscale hover:grayscale-0 transition-all',
    sepia: 'sepia hover:sepia-0 transition-all',
    saturate: 'saturate-150',
    contrast: 'contrast-125',
  }

  // Grid columns based on layout
  const getGridClasses = () => {
    const cols = data.columns || 4
    const colsMobile = data.columnsMobile || 2
    const layout = data.layout || 'grid'

    if (layout?.includes('carousel')) return 'flex overflow-x-auto snap-x snap-mandatory'
    if (layout?.includes('masonry')) return `columns-${colsMobile} md:columns-${cols} space-y-${data.gap || 'md'}`

    const colClasses: Record<string, string> = {
      '1': 'grid-cols-1',
      '2': `grid-cols-${colsMobile} md:grid-cols-2`,
      '3': `grid-cols-${colsMobile} md:grid-cols-3`,
      '4': `grid-cols-${colsMobile} md:grid-cols-4`,
      '5': `grid-cols-${colsMobile} md:grid-cols-5`,
      '6': `grid-cols-${colsMobile} md:grid-cols-6`,
    }
    return `grid ${sl(colClasses, String(cols), '4')}`
  }

  // Hover effect classes
  const getHoverClasses = () => {
    switch (cs(data.hoverEffect)) {
      case 'zoom':
        return 'group-hover:scale-110 transition-transform duration-500'
      case 'zoom-bright':
        return 'group-hover:scale-110 group-hover:brightness-110 transition-all duration-500'
      case 'lift':
        return ''
      case 'overlay':
        return ''
      case 'overlay-color':
        return ''
      case 'tilt':
        return ''
      default:
        return 'group-hover:scale-105 transition-transform duration-500'
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: data.animation?.includes('fade-stagger') ? 0.08 : 0,
        delayChildren: 0.1,
      },
    },
  }

  const getItemVariants = () => {
    switch (cs(data.animation)) {
      case 'none':
        return { hidden: {}, visible: {} }
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } },
        }
      case 'zoom':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        }
      case 'slide-up':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }
      case 'scale-rotate':
        return {
          hidden: { opacity: 0, scale: 0.8, rotate: -5 },
          visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 100 } },
        }
      default: // fade-stagger
        return {
          hidden: { opacity: 0, scale: 0.9, y: 20 },
          visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
        }
    }
  }

  const lightboxVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  }

  const imageSlideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { x: { type: 'spring', stiffness: 300, damping: 30 } } },
    exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
  }

  const backgroundColor = data.backgroundColor || 'white'
  const darkBg = ['black', 'primary'].includes(backgroundColor)

  return (
    <section data-sanity-edit-target className={`${getSpacingClasses(data)} ${sl(bgClasses, data.backgroundColor, 'white')} overflow-hidden`}>
      <div className="container-glos">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-center mb-12 ${darkBg ? 'text-white' : ''}`}
        >
          {!!data.title && (
            <h2 className="section-title mb-4">
              <RichText value={data.title} />
            </h2>
          )}
          {!!data.subtitle && (
            <div className="section-subtitle mx-auto">
              <RichText value={data.subtitle} />
            </div>
          )}
          {!!data.description && (
            <div className="max-w-2xl mx-auto mt-4 opacity-70">
              <RichText value={data.description} />
            </div>
          )}
        </motion.div>

        {/* Filters and Search */}
        {(data.enableFilters || data.enableSearch) && (
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {/* Category Filters */}
            {data.enableFilters && categories.length > 1 && (
              <div className={`flex flex-wrap justify-center gap-2 ${
                data.filterStyle?.includes('tabs') ? 'border-b border-gray-200' :
                data.filterStyle?.includes('dropdown') ? '' : ''
              }`}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-4 py-2 font-medium transition-all ${
                      data.filterStyle?.includes('pills')
                        ? `rounded-full ${activeFilter === cat ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`
                        : data.filterStyle?.includes('tabs')
                        ? `border-b-2 ${activeFilter === cat ? 'border-primary text-primary' : 'border-transparent hover:border-gray-300'}`
                        : `rounded-lg ${activeFilter === cat ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`
                    }`}
                  >
                    {cat === 'all' ? 'Tutti' : cat}
                  </button>
                ))}
              </div>
            )}

            {/* Search */}
            {data.enableSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}
          </div>
        )}

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className={`${getGridClasses()} ${sl(gapClasses, data.gap, 'md')}`}
        >
          {displayedImages.map((image, index) => {
            const ImageWrapper = image.link && !data.enableLightbox ? Link : 'button'
            const wrapperProps = image.link && !data.enableLightbox
              ? { href: image.link }
              : { onClick: () => openLightbox(index) }

            return (
              <motion.div
                key={image._key}
                variants={getItemVariants()}
                whileHover={data.hoverEffect?.includes('lift') ? { y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' } : undefined}
                className={`group relative overflow-hidden ${sl(roundedClasses, data.rounded, 'md')} ${sl(shadowClasses, data.shadow, 'none')} ${
                  data.border?.includes('thin') ? 'ring-1 ring-gray-200' :
                  data.border?.includes('normal') ? 'ring-2 ring-gray-200' :
                  data.border?.includes('decorative') ? 'ring-2 ring-primary/30' : ''
                } ${image.featured ? 'md:col-span-2 md:row-span-2' : ''} ${
                  data.layout?.includes('carousel') ? 'flex-shrink-0 w-80 snap-center' : ''
                } ${data.layout?.includes('masonry') ? 'break-inside-avoid mb-4' : ''}`}
              >
                <ImageWrapper
                  {...(wrapperProps as any)}
                  className={`block relative ${sl(aspectClasses, data.aspectRatio, 'square')} ${data.layout?.includes('masonry') ? 'w-full' : 'w-full h-full'}`}
                >
                  <Image
                    src={safeImageUrl(image, 600, 600)!}
                    alt={image.alt || t(image.caption) || ''}
                    fill
                    className={`object-cover ${getHoverClasses()} ${sl(filterClasses, data.imageFilter, 'none')}`}
                  />

                  {/* Hover Overlay */}
                  {(data.hoverEffect?.includes('overlay') || data.enableLightbox) && (
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center ${
                      data.hoverEffect?.includes('overlay-color') ? 'bg-primary/60' : 'bg-black/40'
                    }`}>
                      <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-full"
                      >
                        <ZoomIn className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>
                  )}

                  {/* Caption */}
                  {!!image.caption && !data.showCaptions?.includes('never') && (
                    <div className={`absolute bottom-0 left-0 right-0 p-4 ${
                      data.showCaptions?.includes('always')
                        ? 'bg-gradient-to-t from-black/70 to-transparent'
                        : data.showCaptions?.includes('hover') && !data.showCaptions?.includes('hover-slide')
                        ? 'bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'
                        : 'bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform'
                    }`}>
                      <p className="text-white text-sm">{String(t(image.caption) || '')}</p>
                    </div>
                  )}
                </ImageWrapper>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Show More Button */}
        {data.showMoreButton && data.maxImages && data.maxImages > 0 && filteredImages.length > data.maxImages && !showAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="btn-primary"
            >
              Mostra Tutto ({filteredImages.length - data.maxImages} altre)
            </button>
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxIndex !== null && displayedImages.length > 0 && (
            <motion.div
              variants={lightboxVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`fixed inset-0 z-50 flex items-center justify-center ${
                data.lightboxStyle?.includes('minimal') ? 'bg-white' : 'bg-black/95'
              }`}
              onClick={closeLightbox}
              role="dialog"
              aria-modal="true"
              aria-label={`Visualizzatore immagini - Immagine ${lightboxIndex + 1} di ${displayedImages.length}`}
            >
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                onClick={closeLightbox}
                className={`absolute top-4 right-4 p-3 rounded-full z-10 focus-ring ${
                  data.lightboxStyle?.includes('minimal')
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                }`}
                aria-label="Chiudi galleria"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </motion.button>

              {/* Counter */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium ${
                  data.lightboxStyle?.includes('minimal')
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-white/10 backdrop-blur-sm text-white'
                }`}
              >
                {lightboxIndex + 1} / {displayedImages.length}
              </motion.div>

              {/* Navigation */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1, x: -5 }}
                onClick={(e) => { e.stopPropagation(); paginate(-1) }}
                className={`absolute left-4 p-3 rounded-full z-10 focus-ring ${
                  data.lightboxStyle?.includes('minimal')
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                }`}
                aria-label="Immagine precedente"
              >
                <ChevronLeft className="w-8 h-8" aria-hidden="true" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1, x: 5 }}
                onClick={(e) => { e.stopPropagation(); paginate(1) }}
                className={`absolute right-4 p-3 rounded-full z-10 focus-ring ${
                  data.lightboxStyle?.includes('minimal')
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20'
                }`}
                aria-label="Immagine successiva"
              >
                <ChevronRight className="w-8 h-8" aria-hidden="true" />
              </motion.button>

              {/* Image */}
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
                    src={safeImageUrl(displayedImages[lightboxIndex], 1600)!}
                    alt={displayedImages[lightboxIndex].alt || t(displayedImages[lightboxIndex].caption) || ''}
                    fill
                    className="object-contain"
                  />

                  {/* Caption */}
                  {!!displayedImages[lightboxIndex].caption && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`absolute bottom-0 left-0 right-0 p-6 ${
                        data.lightboxStyle?.includes('minimal')
                          ? 'bg-white text-gray-800'
                          : 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'
                      }`}
                    >
                      <p className={`text-center text-lg ${data.lightboxStyle?.includes('minimal') ? '' : 'text-white'}`}>
                        {String(t(displayedImages[lightboxIndex].caption) || '')}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Thumbnails (if enabled) */}
              {data.lightboxStyle?.includes('thumbnails') && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full" role="group" aria-label="Miniature immagini">
                  {displayedImages.slice(0, 7).map((img, idx) => (
                    <motion.button
                      key={img._key}
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setLightboxIndex(idx)
                        setPage([idx, idx > lightboxIndex ? 1 : -1])
                      }}
                      className={`relative w-10 h-10 rounded-lg overflow-hidden transition-all focus-ring-white ${
                        lightboxIndex === idx ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`Vai all'immagine ${idx + 1} di ${displayedImages.length}`}
                      aria-current={lightboxIndex === idx ? 'true' : undefined}
                    >
                      <Image
                        src={safeImageUrl(img, 80, 80)!}
                        alt=""
                        fill
                        className="object-cover"
                        aria-hidden="true"
                      />
                    </motion.button>
                  ))}
                  {displayedImages.length > 7 && (
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs" aria-hidden="true">
                      +{displayedImages.length - 7}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
