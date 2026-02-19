// Products Page Client Component - Modern Metallic Design with Sidebar Layout
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
import { Package, Filter, ArrowRight, ChevronRight, Layers } from 'lucide-react'

interface ProductsPageClientProps {
  products: Product[]
  categories: Category[]
  listinoPrezziPdfUrl?: string | null
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 }
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

const sidebarItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  }
}

export default function ProductsPageClient({ products, categories, listinoPrezziPdfUrl }: ProductsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // URL del listino prezzi PDF (da Sanity o placeholder)
  const listinoPdfUrl = listinoPrezziPdfUrl || '/listino-glos.pdf'

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products
    return products.filter(p => p.category?._id === selectedCategory)
  }, [products, selectedCategory])

  // Get selected category name for display
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) return 'Tutti i prodotti'
    const cat = categories.find(c => c._id === selectedCategory)
    return cat ? getTextValue(cat.name) : 'Tutti i prodotti'
  }, [selectedCategory, categories])

  return (
    <div className="min-h-screen bg-gradient-to-b from-metal-100 via-white to-metal-50">
      {/* Hero Section with Metallic Gradient */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-br from-metal-800 via-metal-700 to-metal-900 py-12 md:py-16 lg:py-20"
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
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
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
              Qualità, innovazione e affidabilità dal 1980.
            </motion.p>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-metal-100 to-transparent" />
      </motion.section>

      {/* Mobile Filters - Shown only on mobile/tablet */}
      <section className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-metal-200 shadow-sm">
        <div className="container-glos py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
        </div>
      </section>

      {/* Main Content: Sidebar + Products Grid */}
      <section className="section">
        <div className="container-glos">
          <div className="flex gap-8">
            {/* Sidebar - Desktop Only */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                <motion.div
                  className="bg-white rounded-2xl border border-metal-200 shadow-lg shadow-metal-200/50 overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {/* Sidebar Header */}
                  <div className="bg-gradient-to-r from-metal-800 to-metal-700 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Layers className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Categorie</h3>
                        <p className="text-xs text-metal-300">{categories.length} categorie disponibili</p>
                      </div>
                    </div>
                  </div>

                  {/* Category List */}
                  <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                    <nav className="p-3">
                      {/* All Products Option */}
                      <motion.button
                        variants={sidebarItemVariants}
                        initial="hidden"
                        animate="visible"
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group mb-1 ${
                          !selectedCategory
                            ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/25'
                            : 'text-metal-700 hover:bg-metal-50'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full transition-all ${
                          !selectedCategory
                            ? 'bg-white scale-125'
                            : 'bg-metal-300 group-hover:bg-primary'
                        }`} />
                        <span className="flex-1 font-medium">Tutti i prodotti</span>
                        <span className={`text-sm px-2 py-0.5 rounded-full ${
                          !selectedCategory
                            ? 'bg-white/20 text-white'
                            : 'bg-metal-100 text-metal-500'
                        }`}>
                          {products.length}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          !selectedCategory ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'
                        }`} />
                      </motion.button>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-metal-200 to-transparent my-3" />

                      {/* Categories */}
                      {categories.map((category, index) => (
                        <motion.button
                          key={category._id}
                          variants={sidebarItemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedCategory(category._id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group mb-1 ${
                            selectedCategory === category._id
                              ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/25'
                              : 'text-metal-700 hover:bg-metal-50'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full transition-all ${
                            selectedCategory === category._id
                              ? 'bg-white scale-125'
                              : 'bg-metal-300 group-hover:bg-primary'
                          }`} />
                          <span className="flex-1 font-medium truncate">
                            {getTextValue(category.name)}
                          </span>
                          <span className={`text-sm px-2 py-0.5 rounded-full ${
                            selectedCategory === category._id
                              ? 'bg-white/20 text-white'
                              : 'bg-metal-100 text-metal-500'
                          }`}>
                            {category.productCount || 0}
                          </span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${
                            selectedCategory === category._id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'
                          }`} />
                        </motion.button>
                      ))}
                    </nav>
                  </div>

                  {/* Sidebar Footer */}
                  <div className="p-4 border-t border-metal-100 bg-metal-50/50">
                    <a
                      href={listinoPdfUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-metal-700 to-metal-800 text-white text-sm font-medium rounded-xl hover:from-metal-800 hover:to-metal-900 transition-all shadow-md hover:shadow-lg"
                    >
                      <Package className="w-4 h-4" />
                      Scarica Listino PDF
                    </a>
                  </div>
                </motion.div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div>
                  <h2 className="text-xl font-bold text-metal-800">
                    {selectedCategoryName}
                  </h2>
                  <p className="text-sm text-metal-500">
                    {filteredProducts.length} prodott{filteredProducts.length === 1 ? 'o' : 'i'} trovati
                  </p>
                </div>
              </motion.div>

              {/* Products Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory || 'all'}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
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
                  <p className="text-metal-500 mb-4">
                    Non ci sono prodotti in questa categoria al momento.
                  </p>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="btn-primary"
                  >
                    Mostra tutti i prodotti
                  </button>
                </motion.div>
              )}
            </div>
          </div>
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
              <a
                href={listinoPdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20"
              >
                Scarica Listino Prezzi
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Product Card Component - Grid View Only
function ProductCard({ product }: { product: Product }) {
  const [imageLoaded, setImageLoaded] = useState(false)

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
        <div className="p-5">
          {product.category && (
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {getTextValue(product.category.name)}
            </span>
          )}

          <h2 className="text-lg font-bold text-metal-800 mt-1 mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-1">
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
