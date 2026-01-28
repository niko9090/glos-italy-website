// Products Section Component
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity/client'
import { t, defaultLocale } from '@/lib/i18n'
import type { Product } from '@/lib/sanity/fetch'

interface ProductsSectionProps {
  data: {
    sectionLabel?: { it?: string; en?: string; es?: string }
    title?: { it?: string; en?: string; es?: string }
    subtitle?: { it?: string; en?: string; es?: string }
    showFeatured?: boolean
    limit?: number
    ctaButton?: {
      text?: { it?: string; en?: string; es?: string }
      link?: string
    }
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

export default function ProductsSection({ data, products }: ProductsSectionProps) {
  const locale = defaultLocale
  const displayProducts = products?.slice(0, data.limit || 6) || []

  return (
    <section className="section bg-white">
      <div className="container-glos">
        {/* Header */}
        <div className="text-center mb-12">
          {data.sectionLabel && (
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {t(data.sectionLabel, locale)}
            </span>
          )}

          {data.title && (
            <h2 className="section-title mb-4">{t(data.title, locale)}</h2>
          )}

          {data.subtitle && (
            <p className="section-subtitle mx-auto">{t(data.subtitle, locale)}</p>
          )}
        </div>

        {/* Products Grid with Stagger Animation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} locale={locale} />
          ))}
        </motion.div>

        {/* CTA Button */}
        {data.ctaButton?.text && data.ctaButton?.link && (
          <div className="text-center mt-12">
            <Link href={data.ctaButton.link} className="btn-primary">
              {t(data.ctaButton.text, locale)}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

// Separate ProductCard component for better organization
function ProductCard({ product, locale }: { product: Product; locale: string }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -8,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className="card group cursor-pointer"
    >
      <Link href={`/prodotti/${product.slug?.current}`}>
        {/* Image with zoom effect */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Shimmer placeholder */}
          {!imageLoaded && <ImagePlaceholder />}

          {product.mainImage && (
            <Image
              src={urlFor(product.mainImage).width(600).height(450).url()}
              alt={t(product.name, locale) || ''}
              fill
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          )}

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
        <div className="p-6">
          {product.category && (
            <span className="text-sm text-primary font-medium">
              {t(product.category.name, locale)}
            </span>
          )}

          <h3 className="text-xl font-semibold mt-1 mb-2 group-hover:text-primary transition-colors duration-300">
            {t(product.name, locale)}
          </h3>

          {product.shortDescription && (
            <p className="text-gray-600 line-clamp-2">
              {t(product.shortDescription, locale)}
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  )
}
