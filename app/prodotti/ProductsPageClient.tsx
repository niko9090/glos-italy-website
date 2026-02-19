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

// Prodotti di punta (ordinati per priorità - Blender PRIMO)
const FEATURED_PRODUCTS_PRIORITY = [
  'blender', // Blender GLOS BG2 - prodotto di punta principale
  'twin-120', // Policut Twin
  'fiber-cut', // Fiber Cut
  'termolight' // Termolight
]

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

  // Prodotti in evidenza (ordinati per priorità - Blender primo)
  const featuredProducts = useMemo(() => {
    const featured: Product[] = []

    // Prima aggiungi i prodotti nell'ordine di priorità definito
    FEATURED_PRODUCTS_PRIORITY.forEach(keyword => {
      const match = products.find(p => {
        const slug = p.slug?.current?.toLowerCase() || ''
        const name = getTextValue(p.name).toLowerCase()
        return (slug.includes(keyword) || name.includes(keyword)) &&
               !featured.some(f => f._id === p._id)
      })
      if (match) featured.push(match)
    })

    // Aggiungi altri prodotti con isFeatured se non già inclusi
    products.forEach(p => {
      if (p.isFeatured && !featured.some(f => f._id === p._id) && featured.length < 4) {
        featured.push(p)
      }
    })

    return featured.slice(0, 4)
  }, [products])

  // Helper per ottenere info categoria
  const getCategoryInfo = (categoryName: string) => {
    const nameLower = categoryName.toLowerCase()
    for (const [key, info] of Object.entries(CATEGORY_INFO)) {
      if (nameLower.includes(key)) return info
    }
    return { description: 'Macchinari professionali di alta qualità Made in Italy.', icon: Package }
  }

  return (
    <div className="min-h-screen bg-metal-50">
      {/* ========== HERO SECTION - FLUID PAINT ========== */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Immagine di sfondo fluida - vernice in movimento */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/abstract-fluid.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'hue-rotate(200deg) saturate(1.3) brightness(0.4)',
          }}
        />

        {/* Overlay gradient blu per unificare */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/90 via-[#0d2847]/70 to-[#1e3a5f]/80" />

        {/* Effetto fluido animato */}
        <motion.div
          className="absolute inset-0 opacity-50"
          animate={{
            scale: [1, 1.02, 1],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            backgroundImage: 'url(/images/paint-fluid-blue.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'hue-rotate(180deg) saturate(1.5) brightness(0.5)',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Gradient fluido sovrapposto */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 80%, rgba(30, 64, 175, 0.5) 0%, transparent 50%),
              radial-gradient(ellipse 60% 80% at 80% 20%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse 100% 50% at 50% 100%, rgba(15, 23, 42, 0.8) 0%, transparent 60%)
            `,
          }}
        />

        {/* Onde di luce animate - effetto vernice che si mescola */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          style={{
            background: `
              linear-gradient(45deg, transparent 30%, rgba(96, 165, 250, 0.15) 50%, transparent 70%),
              linear-gradient(-45deg, transparent 30%, rgba(147, 197, 253, 0.1) 50%, transparent 70%)
            `,
            backgroundSize: '400% 400%',
          }}
        />

        {/* Glow centrale morbido per il testo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-500/15 rounded-full blur-[150px]" />

        {/* CONTENUTO */}
        <div className="container-glos relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Titolo principale */}
            <motion.h1
              custom={0}
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
            >
              I Nostri{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
                Prodotti
              </span>
            </motion.h1>

            <motion.p
              custom={1}
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              className="text-lg md:text-xl lg:text-2xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
            >
              Macchinari professionali per colorifici e industria delle vernici.
              <br className="hidden md:block" />
              Qualità, precisione e affidabilità Made in Italy.
            </motion.p>
          </div>
        </div>

        {/* Fade bottom naturale */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-metal-50 to-transparent" />
      </section>

      {/* ========== PRODOTTI IN EVIDENZA ========== */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-metal-50 to-white relative overflow-hidden">
          {/* Decorazioni sfondo */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

          <div className="container-glos relative z-10">

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
            className={`py-16 md:py-20 lg:py-24 relative overflow-hidden ${
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
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
      <section className="relative py-16 md:py-20 overflow-hidden">
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Hai bisogno di informazioni?
            </h2>
            <p className="text-xl text-metal-300 mb-10 leading-relaxed">
              Contattaci per un preventivo personalizzato o per scoprire quale soluzione
              GL.OS è la più adatta alle tue esigenze.
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
              <span className="group-hover/cta:mr-2 transition-all duration-300">Scopri di più</span>
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
              <span className="group-hover:underline underline-offset-4">Scopri di più</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
