// Products Section Component
'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, PanInfo } from 'framer-motion'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import type { Product } from '@/lib/sanity/fetch'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type LayoutType = 'grid' | 'list' | 'carousel'

interface ProductsSectionProps {
  documentId?: string
  sectionKey?: string
  data: {
    title?: string
    subtitle?: string
    showFeatured?: boolean
    limit?: number
    layout?: LayoutType
    buttonText?: string
    buttonLink?: string
  }
  products?: Product[]
}

// Animation variants for stagger effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

// Shimmer placeholder component
function ImagePlaceholder() {
  return (
    <div className="absolute inset-0 skeleton-shimmer" />
  )
}

export default function ProductsSection({ data, products, documentId, sectionKey }: ProductsSectionProps) {
  const { t } = useLanguage()
  const displayProducts = products?.slice(0, data.limit || 6) || []
  const layout = data.layout || 'grid'

  return (
    <section data-sanity-edit-target className="section bg-white">
      <div className="container-glos">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">
            <RichText value={data.title} />
          </h2>

          <div className="section-subtitle mx-auto">
            <RichText value={data.subtitle} />
          </div>
        </div>

        {/* Products Layout - Grid, List or Carousel */}
        {layout === 'grid' && (
          <GridLayout products={displayProducts} />
        )}

        {layout === 'list' && (
          <ListLayout products={displayProducts} />
        )}

        {layout === 'carousel' && (
          <CarouselLayout products={displayProducts} />
        )}

        {/* CTA Button */}
        {data.buttonText && data.buttonLink && (
          <div className="text-center mt-12">
            <Link href={data.buttonLink} className="btn-primary">
              {String(t(data.buttonText) || '')}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

// === GRID LAYOUT ===
function GridLayout({ products }: { products: Product[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} variant="grid" />
      ))}
    </motion.div>
  )
}

// === LIST LAYOUT ===
function ListLayout({ products }: { products: Product[] }) {
  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} variant="list" />
      ))}
    </motion.div>
  )
}

// === CAROUSEL LAYOUT ===
function CarouselLayout({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [width, setWidth] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Calculate items per view based on screen width
  const getItemsPerView = () => {
    if (width < 640) return 1
    if (width < 1024) return 2
    return 3
  }

  const itemsPerView = getItemsPerView()
  const maxIndex = Math.max(0, products.length - itemsPerView)

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setWidth(carouselRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x > threshold) {
      goToPrevious()
    } else if (info.offset.x < -threshold) {
      goToNext()
    }
  }

  // Calculate card width based on items per view
  const gap = 32 // 2rem = 32px (gap-8)
  const cardWidth = width > 0 ? (width - gap * (itemsPerView - 1)) / itemsPerView : 0

  return (
    <div ref={carouselRef} className="relative">
      {/* Navigation Buttons */}
      <div className="hidden sm:flex absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Precedente"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="hidden sm:flex absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={goToNext}
          disabled={currentIndex >= maxIndex}
          className="p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Successivo"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Carousel Container */}
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-8"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          animate={{
            x: -(currentIndex * (cardWidth + gap))
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              className="flex-shrink-0"
              style={{ width: cardWidth > 0 ? cardWidth : '100%' }}
            >
              <ProductCard product={product} variant="carousel" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Vai alla slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile swipe hint */}
      <p className="text-center text-sm text-gray-400 mt-4 sm:hidden">
        Scorri per vedere altri prodotti
      </p>
    </div>
  )
}

// Separate ProductCard component for better organization
type CardVariant = 'grid' | 'list' | 'carousel'

function ProductCard({ product, variant = 'grid' }: { product: Product; variant?: CardVariant }) {
  const { t } = useLanguage()
  const [imageLoaded, setImageLoaded] = useState(false)

  // List layout - horizontal card
  if (variant === 'list') {
    return (
      <motion.article
        variants={cardVariants}
        whileHover={{
          x: 8,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
        className="card group cursor-pointer"
      >
        <Link href={`/prodotti/${product.slug?.current}`} className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-64 md:w-80 flex-shrink-0 aspect-[4/3] sm:aspect-auto sm:h-48 md:h-56 overflow-hidden">
            {!imageLoaded && <ImagePlaceholder />}

            {isValidImage(product.mainImage) && safeImageUrl(product.mainImage, 400, 300) ? (
              <Image
                src={safeImageUrl(product.mainImage, 400, 300)!}
                alt={String(product.name || '')}
                fill
                className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            ) : null}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {product.isNew && (
                <span className="px-2 py-1 bg-accent text-white text-xs font-medium rounded-full shadow-md">
                  Nuovo
                </span>
              )}
              {product.isFeatured && (
                <span className="px-2 py-1 bg-secondary text-gray-900 text-xs font-medium rounded-full shadow-md">
                  In Evidenza
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center">
            {product.category && (
              <span className="text-sm text-primary font-medium">
                {product.category.name}
              </span>
            )}

            <h3 className="text-xl md:text-2xl font-semibold mt-1 mb-3 group-hover:text-primary transition-colors duration-300">
              {String(t(product.name) || '')}
            </h3>

            <div className="text-gray-600 line-clamp-3 sm:line-clamp-4">
              <RichText value={product.shortDescription} />
            </div>

            <div className="mt-4">
              <span className="inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                Scopri di piu
                <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-1 transition-all" />
              </span>
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  // Grid and Carousel layout - vertical card (same structure)
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -8,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="card group cursor-pointer h-full"
    >
      <Link href={`/prodotti/${product.slug?.current}`} className="flex flex-col h-full">
        {/* Image with zoom effect */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Shimmer placeholder */}
          {!imageLoaded && <ImagePlaceholder />}

          {isValidImage(product.mainImage) && safeImageUrl(product.mainImage, 600, 450) ? (
            <Image
              src={safeImageUrl(product.mainImage, 600, 450)!}
              alt={String(product.name || '')}
              fill
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : null}

          {/* Badges with bounce-subtle animation */}
          <div className="absolute top-4 left-4 flex gap-2">
            {product.isNew && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-accent text-white text-sm font-medium rounded-full shadow-lg"
                style={{ animation: 'bounce-subtle 2s ease-in-out infinite' }}
              >
                Nuovo
              </motion.span>
            )}
            {product.isFeatured && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="px-3 py-1 bg-secondary text-gray-900 text-sm font-medium rounded-full shadow-lg"
                style={{ animation: 'bounce-subtle 2s ease-in-out infinite 0.3s' }}
              >
                In Evidenza
              </motion.span>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {product.category && (
            <span className="text-sm text-primary font-medium">
              {product.category.name}
            </span>
          )}

          <h3 className="text-xl font-semibold mt-1 mb-2 group-hover:text-primary transition-colors duration-300">
            {String(t(product.name) || '')}
          </h3>

          <div className="text-gray-600 line-clamp-2 flex-1">
            <RichText value={product.shortDescription} />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
