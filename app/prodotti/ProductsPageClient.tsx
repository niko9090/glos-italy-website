// Products Page Client Component - VETRINA SHOWCASE Design
// Pagina elegante senza sidebar, organizzata per categorie con sezioni full-width
'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { getTextValue } from '@/lib/utils/textHelpers'
import RichText from '@/components/RichText'
import type { Product, Category } from '@/lib/sanity/fetch'
import ProductBadges from '@/components/products/ProductBadges'
import { ArrowRight, Award, Cog, Shield, Wrench, Zap, Package } from 'lucide-react'

interface ProductsPageClientProps {
  products: Product[]
  categories: Category[]
  listinoPrezziPdfUrl?: string | null
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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
  }
}

const heroTextVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}

// Mapping categorie -> descrizioni e icone
const CATEGORY_INFO: Record<string, { description: string; icon: React.ElementType }> = {
  'blender': {
    description: 'Miscelatori professionali brevettati per la perfetta omogeneizzazione di vernici, smalti e pitture. Tecnologia Blender GLOS con sistema di miscelazione esclusivo.',
    icon: Cog
  },
  'policut': {
    description: 'Taglierine professionali di precisione per carta da parati, tessuti e materiali tecnici. Linea completa: Twin, Easy e Basic.',
    icon: Zap
  },
  'fiber-cut': {
    description: 'Sistemi di taglio specializzati per fibre minerali, lana di roccia e materiali isolanti. Massima precisione e sicurezza.',
    icon: Shield
  },
  'termolight': {
    description: 'Termoventilatori professionali per asciugatura rapida. Ideali per cantieri, verniciatura e applicazioni industriali.',
    icon: Wrench
  },
  'wash-station': {
    description: 'Stazioni di lavaggio professionali per attrezzi e rulli. Pulizia efficiente ed ecologica degli strumenti di lavoro.',
    icon: Award
  },
  'taglierine-manuali': {
    description: 'Taglierine manuali e accessori per il taglio preciso. Complementi essenziali per ogni colorificio.',
    icon: Wrench
  },
  'accessori': {
    description: 'Accessori e ricambi originali GL.OS per tutti i nostri macchinari. Qualita garantita Made in Italy.',
    icon: Package
  }
}

// Prodotti di punta (slug o nome parziale)
const FEATURED_PRODUCTS = ['blender-glos-bg2', 'policut-twin', 'fiber-cut', 'bg2']

export default function ProductsPageClient({ products, categories, listinoPrezziPdfUrl }: ProductsPageClientProps) {
  const listinoPdfUrl = listinoPrezziPdfUrl || '/listino-glos.pdf'

  // Raggruppa prodotti per categoria
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, { category: Category; products: Product[] }> = {}

    categories.forEach(cat => {
      grouped[cat._id] = {
        category: cat,
        products: products.filter(p => p.category?._id === cat._id)
      }
    })

    // Ordina le categorie per priorita (Blender prima, poi Policut, ecc.)
    const priorityOrder = ['blender', 'policut', 'fiber', 'termo', 'wash', 'taglierine', 'accessori']

    return Object.values(grouped)
      .filter(g => g.products.length > 0)
      .sort((a, b) => {
        const nameA = getTextValue(a.category.name).toLowerCase()
        const nameB = getTextValue(b.category.name).toLowerCase()
        const indexA = priorityOrder.findIndex(p => nameA.includes(p))
        const indexB = priorityOrder.findIndex(p => nameB.includes(p))
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
      })
  }, [products, categories])

  // Prodotti in evidenza
  const featuredProducts = useMemo(() => {
    return products.filter(p => {
      const slug = p.slug?.current?.toLowerCase() || ''
      const name = getTextValue(p.name).toLowerCase()
      return p.isFeatured || FEATURED_PRODUCTS.some(fp => slug.includes(fp) || name.includes(fp))
    }).slice(0, 4)
  }, [products])

  // Helper per ottenere info categoria
  const getCategoryInfo = (categoryName: string) => {
    const nameLower = categoryName.toLowerCase()
    for (const [key, info] of Object.entries(CATEGORY_INFO)) {
      if (nameLower.includes(key)) return info
    }
    return { description: 'Macchinari professionali di alta qualita Made in Italy.', icon: Package }
  }

  return (
    <div className="min-h-screen bg-metal-50">
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background con gradient industriale premium */}
        <div className="absolute inset-0 bg-gradient-to-br from-metal-900 via-metal-800 to-metal-900" />

        {/* Pattern overlay sottile */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        {/* Elementi decorativi */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-blue-500/10 via-transparent to-transparent opacity-40 blur-3xl" />

        {/* Linee decorative geometriche */}
        <div className="absolute top-20 left-10 w-px h-40 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        <div className="absolute top-40 left-20 w-px h-60 bg-gradient-to-b from-transparent via-metal-500/20 to-transparent" />
        <div className="absolute bottom-20 right-10 w-px h-40 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-40 right-20 w-px h-60 bg-gradient-to-b from-transparent via-metal-500/20 to-transparent" />

        <div className="container-glos relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              custom={0}
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-metal-300 text-sm font-medium tracking-wide">
                Tecnologia Italiana dal 2005
              </span>
            </motion.div>

            {/* Titolo principale */}
            <motion.h1
              custom={1}
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Macchinari di{' '}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary">
                  Precisione
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              className="text-xl md:text-2xl text-metal-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              GL.OS progetta e produce macchinari professionali per l&apos;industria delle vernici.
              Blender GLOS, taglierine e attrezzature di qualita superiore.
            </motion.p>

            {/* Caratteristiche chiave */}
            <motion.div
              custom={3}
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap justify-center gap-x-10 gap-y-4"
            >
              {[
                { icon: Award, text: 'Made in Italy' },
                { icon: Shield, text: 'Tecnologia Brevettata' },
                { icon: Wrench, text: 'Assistenza Dedicata' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-metal-400 group">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-metal-50 to-transparent" />
      </section>

      {/* ========== PRODOTTI IN EVIDENZA ========== */}
      {featuredProducts.length > 0 && (
        <section className="py-20 md:py-28 bg-gradient-to-b from-metal-50 to-white relative overflow-hidden">
          {/* Decorazioni sfondo */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

          <div className="container-glos relative z-10">
            {/* Header sezione */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                IN EVIDENZA
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-metal-800 mb-4">
                Prodotti di Punta
              </h2>
              <p className="text-xl text-metal-600 max-w-2xl mx-auto">
                I nostri macchinari piu richiesti, scelti da colorifici e professionisti in tutta Italia
              </p>
            </motion.div>

            {/* Grid prodotti in evidenza */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {featuredProducts.map((product, index) => (
                <FeaturedProductCard key={product._id} product={product} index={index} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ========== SEZIONI PER CATEGORIA ========== */}
      {productsByCategory.map((group, groupIndex) => {
        const categoryName = getTextValue(group.category.name)
        const categoryInfo = getCategoryInfo(categoryName)
        const CategoryIcon = categoryInfo.icon
        const isEven = groupIndex % 2 === 0

        return (
          <section
            key={group.category._id}
            className={`py-20 md:py-28 relative overflow-hidden ${
              isEven
                ? 'bg-white'
                : 'bg-gradient-to-br from-metal-100 via-metal-50 to-white'
            }`}
          >
            {/* Decorazioni per sezioni alternate */}
            {!isEven && (
              <>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-metal-300/10 rounded-full blur-3xl" />
              </>
            )}

            <div className="container-glos relative z-10">
              {/* Header categoria */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="mb-14"
              >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div className="max-w-2xl">
                    {/* Icon e titolo */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/25">
                        <CategoryIcon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-metal-800">
                        {categoryName}
                      </h2>
                    </div>
                    <p className="text-lg text-metal-600 leading-relaxed">
                      {categoryInfo.description}
                    </p>
                  </div>

                  {/* Badge conteggio */}
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-metal-100 text-metal-700 font-medium">
                      <Package className="w-4 h-4" />
                      {group.products.length} prodott{group.products.length === 1 ? 'o' : 'i'}
                    </span>
                  </div>
                </div>

                {/* Linea decorativa */}
                <div className="mt-8 h-px bg-gradient-to-r from-primary/50 via-metal-200 to-transparent" />
              </motion.div>

              {/* Grid prodotti categoria */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              >
                {group.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </motion.div>
            </div>
          </section>
        )
      })}

      {/* ========== CTA FINALE ========== */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-metal-800 via-metal-900 to-metal-800" />

        {/* Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 20L20 0v20H0zm20 0h20L20 40V20z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />

        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />

        <div className="container-glos relative z-10">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Hai bisogno di informazioni?
            </h2>
            <p className="text-xl text-metal-300 mb-10 leading-relaxed">
              Contattaci per un preventivo personalizzato o per scoprire quale soluzione
              GL.OS e la piu adatta alle tue esigenze.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contatti"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                Richiedi Informazioni
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={listinoPdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300"
              >
                <Package className="w-5 h-5" />
                Scarica Listino Prezzi
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// ========== COMPONENTE CARD PRODOTTO IN EVIDENZA ==========
function FeaturedProductCard({ product, index }: { product: Product; index: number }) {
  const isLarge = index < 2

  return (
    <motion.article
      variants={cardVariants}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-metal-200 hover:border-primary/30 transition-all duration-500 ${
        isLarge ? 'md:col-span-1' : ''
      }`}
      whileHover={{
        y: -8,
        boxShadow: '0 25px 60px -12px rgba(0, 71, 171, 0.2)',
      }}
    >
      <Link href={`/prodotti/${product.slug?.current}`} className="block">
        {/* Layout orizzontale per card grandi */}
        <div className={`flex ${isLarge ? 'flex-col lg:flex-row' : 'flex-col'}`}>
          {/* Immagine */}
          <div className={`relative overflow-hidden bg-gradient-to-br from-metal-50 to-metal-100 ${
            isLarge ? 'lg:w-1/2 aspect-[4/3] lg:aspect-auto' : 'aspect-[4/3]'
          }`}>
            {isValidImage(product.mainImage) && safeImageUrl(product.mainImage, 600, 450) ? (
              <Image
                src={safeImageUrl(product.mainImage, 600, 450)!}
                alt={String(product.name || '')}
                fill
                className="object-contain p-6 transition-all duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-24 h-24 text-metal-300" />
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badges */}
            <div className="absolute top-4 left-4 z-10">
              <ProductBadges
                isNew={product.isNew}
                isFeatured={product.isFeatured}
                badges={product.badges}
                customBadge={product.customBadge}
                size="md"
              />
            </div>
          </div>

          {/* Content */}
          <div className={`p-6 lg:p-8 flex flex-col justify-center ${isLarge ? 'lg:w-1/2' : ''}`}>
            {product.category && (
              <span className="inline-block text-xs font-bold text-primary uppercase tracking-wider mb-3">
                {getTextValue(product.category.name)}
              </span>
            )}

            <h3 className="text-2xl lg:text-3xl font-bold text-metal-800 mb-4 group-hover:text-primary transition-colors duration-300">
              {getTextValue(product.name)}
            </h3>

            <div className="text-metal-600 line-clamp-3 leading-relaxed mb-6">
              <RichText value={product.shortDescription} />
            </div>

            <div className="flex items-center text-primary font-semibold group/cta">
              <span className="group-hover/cta:mr-2 transition-all duration-300">Scopri di piu</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

// ========== COMPONENTE CARD PRODOTTO STANDARD ==========
function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article
      variants={cardVariants}
      className="group relative bg-white rounded-2xl overflow-hidden border border-metal-200 hover:border-primary/30 transition-all duration-500 h-full flex flex-col"
      whileHover={{
        y: -6,
        boxShadow: '0 20px 40px -12px rgba(0, 71, 171, 0.15)',
      }}
    >
      <Link href={`/prodotti/${product.slug?.current}`} className="flex flex-col h-full">
        {/* Immagine */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-metal-50 to-metal-100">
          {isValidImage(product.mainImage) && safeImageUrl(product.mainImage, 400, 300) ? (
            <Image
              src={safeImageUrl(product.mainImage, 400, 300)!}
              alt={String(product.name || '')}
              fill
              className="object-contain p-4 transition-all duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-16 h-16 text-metal-300" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10">
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
        <div className="p-5 flex flex-col flex-grow">
          {product.category && (
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              {getTextValue(product.category.name)}
            </span>
          )}

          <h3 className="text-lg font-bold text-metal-800 mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {getTextValue(product.name)}
          </h3>

          <div className="text-metal-600 text-sm line-clamp-2 leading-relaxed flex-grow mb-4">
            <RichText value={product.shortDescription} />
          </div>

          {/* CTA */}
          <div className="mt-auto pt-4 border-t border-metal-100">
            <div className="flex items-center justify-between text-primary font-medium text-sm">
              <span className="group-hover:underline underline-offset-4">Scopri di piu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
