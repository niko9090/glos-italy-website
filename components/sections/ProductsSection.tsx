// Products Section Component
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import type { Product } from '@/lib/sanity/fetch'
import { getTextValue } from '@/lib/utils/textHelpers'
import RichText from '@/components/RichText'

interface ProductsSectionProps {
  data: {
    title?: string
    subtitle?: string
    showFeatured?: boolean
    limit?: number
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

export default function ProductsSection({ data, products }: ProductsSectionProps) {
  const displayProducts = products?.slice(0, data.limit || 6) || []

  return (
    <section className="section bg-white">
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

        {/* Products Grid with Stagger Animation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>

        {/* CTA Button */}
        {data.buttonText && data.buttonLink && (
          <div className="text-center mt-12">
            <Link href={data.buttonLink} className="btn-primary">
              {getTextValue(data.buttonText)}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

// Separate ProductCard component for better organization
function ProductCard({ product }: { product: Product }) {
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
        <div className="p-6">
          {product.category && (
            <span className="text-sm text-primary font-medium">
              {product.category.name}
            </span>
          )}

          <h3 className="text-xl font-semibold mt-1 mb-2 group-hover:text-primary transition-colors duration-300">
            {getTextValue(product.name)}
          </h3>

          <div className="text-gray-600 line-clamp-2">
            <RichText value={product.shortDescription} />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
