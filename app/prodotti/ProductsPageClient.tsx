// Products Page Client Component - Modern Metallic Design
'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { getTextValue } from '@/lib/utils/textHelpers'
import RichText from '@/components/RichText'
import type { Product, Category } from '@/lib/sanity/fetch'
import ProductBadges from '@/components/products/ProductBadges'
import { Package, Filter, Grid3X3, LayoutList, ArrowRight } from 'lucide-react'

interface ProductsPageClientProps {
  products: Product[]
  categories: Category[]
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
}

const heroVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
}

export default function ProductsPageClient({ products, categories }: ProductsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products
    return products.filter(p => p.category?._id === selectedCategory)
  }, [products, selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-b from-metal-100 via-white to-metal-50">
      {/* Hero Section with Metallic Gradient */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-br from-metal-800 via-metal-700 to-metal-900 py-20 md:py-28"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-metal-500/20 rounded-full blur-3xl" />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="container-glos relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6"
            >
              <Package className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-white/90">Catalogo Prodotti</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              I Nostri{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">
                Prodotti
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-metal-300 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Macchinari di precisione Made in Italy per colorifici e industria.
              Qualita, innovazione e affidabilita dal 1980.
            </motion.p>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-metal-100 to-transparent" />
      </motion.section>

      {/* Filters and Controls */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-metal-200 shadow-sm">
        <div className="container-glos py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <Filter className="w-4 h-4 text-metal-500 flex-shrink-0" />
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  !selectedCategory
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-metal-100 text-metal-600 hover:bg-metal-200'
                }`}
              >
                Tutti ({products.length})
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category._id
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-metal-100 text-metal-600 hover:bg-metal-200'
                  }`}
                >
                  {getTextValue(category.name)} ({category.productCount || 0})
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-metal-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white shadow text-primary'
                    : 'text-metal-500 hover:text-metal-700'
                }`}
                aria-label="Vista griglia"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow text-primary'
                    : 'text-metal-500 hover:text-metal-700'
                }`}
                aria-label="Vista lista"
              >
                <LayoutList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="section">
        <div className="container-glos">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory || 'all'}
              className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'flex flex-col gap-6'
              }
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Package className="w-16 h-16 mx-auto text-metal-300 mb-4" />
              <h3 className="text-xl font-semibold text-metal-700 mb-2">
                Nessun prodotto trovato
              </h3>
              <p className="text-metal-500">
                Non ci sono prodotti in questa categoria al momento.
              </p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="mt-4 btn-primary"
              >
                Mostra tutti i prodotti
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-metal-800 to-metal-900">
        <div className="container-glos text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Non trovi quello che cerchi?
            </h2>
            <p className="text-metal-300 text-lg mb-8 max-w-2xl mx-auto">
              Contattaci per soluzioni personalizzate o per ricevere maggiori informazioni sui nostri macchinari.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contatti" className="btn-primary">
                Richiedi Informazioni
              </Link>
              <Link href="/listino-prezzi" className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20">
                Scarica Listino Prezzi
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Product Card Component
function ProductCard({ product, viewMode }: { product: Product; viewMode: 'grid' | 'list' }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  if (viewMode === 'list') {
    return (
      <motion.article
        variants={cardVariants}
        className="group bg-white rounded-2xl overflow-hidden border border-metal-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
      >
        <Link href={`/prodotti/${product.slug?.current}`} className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-72 md:w-80 flex-shrink-0 aspect-[4/3] sm:aspect-auto sm:h-56 overflow-hidden bg-gradient-to-br from-metal-100 to-metal-200">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-metal-200 animate-pulse" />
            )}
            {isValidImage(product.mainImage) && safeImageUrl(product.mainImage, 400, 300) ? (
              <Image
                src={safeImageUrl(product.mainImage, 400, 300)!}
                alt={String(product.name || '')}
                fill
                className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            ) : null}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-metal-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badges */}
            <div className="absolute top-4 left-4">
              <ProductBadges
                isNew={product.isNew}
                isFeatured={product.isFeatured}
                badges={product.badges}
                customBadge={product.customBadge}
                size="sm"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-center">
            {product.category && (
              <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                {getTextValue(product.category.name)}
              </span>
            )}

            <h2 className="text-xl md:text-2xl font-bold text-metal-800 mb-3 group-hover:text-primary transition-colors duration-300">
              {getTextValue(product.name)}
            </h2>

            <div className="text-metal-600 line-clamp-2 mb-4">
              <RichText value={product.shortDescription} />
            </div>

            <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
              Scopri di piu
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  // Grid View
  return (
    <motion.article
      variants={cardVariants}
      className="group bg-white rounded-2xl overflow-hidden border border-metal-200 hover:border-primary/30 transition-all duration-500"
      whileHover={{
        y: -8,
        boxShadow: '0 25px 50px -12px rgba(0, 71, 171, 0.15)',
      }}
    >
      <Link href={`/prodotti/${product.slug?.current}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-metal-100 to-metal-200">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-metal-200 animate-pulse" />
          )}
          {isValidImage(product.mainImage) && safeImageUrl(product.mainImage, 600, 450) ? (
            <Image
              src={safeImageUrl(product.mainImage, 600, 450)!}
              alt={String(product.name || '')}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : null}

          {/* Hover Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-metal-900/70 via-metal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* View CTA on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <span className="px-6 py-3 bg-white text-metal-800 font-semibold rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              Visualizza
            </span>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4">
            <ProductBadges
              isNew={product.isNew}
              isFeatured={product.isFeatured}
              badges={product.badges}
              customBadge={product.customBadge}
              size="sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {product.category && (
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {getTextValue(product.category.name)}
            </span>
          )}

          <h2 className="text-xl font-bold text-metal-800 mt-1 mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {getTextValue(product.name)}
          </h2>

          <div className="text-metal-600 line-clamp-2 text-sm">
            <RichText value={product.shortDescription} />
          </div>

          {/* Bottom border accent */}
          <div className="mt-4 pt-4 border-t border-metal-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-metal-500">Dettagli prodotto</span>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
