// Products Page Client Component - WOW SHOWCASE Design
// Focus sul Blender GLOS come prodotto hero, design professionale e innovativo
'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { getTextValue } from '@/lib/utils/textHelpers'
import RichText from '@/components/RichText'
import type { Product, Category } from '@/lib/sanity/fetch'
import ProductBadges from '@/components/products/ProductBadges'
import { ArrowRight, Award, Cog, Shield, Wrench, Zap, Package, CheckCircle2, Sparkles, Play } from 'lucide-react'

interface ProductsPageClientProps {
  products: Product[]
  categories: Category[]
  listinoPrezziPdfUrl?: string | null
}

// Animation variants ottimizzate per effetto WOW
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -8,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
}

// Info categorie
const CATEGORY_INFO: Record<string, { description: string; icon: React.ElementType }> = {
  'policut': {
    description: 'Taglierine professionali di precisione per pannelli isolanti. Tecnologia a filo caldo per tagli netti e puliti.',
    icon: Zap
  },
  'fiber-cut': {
    description: 'Sistemi di taglio specializzati per fibre minerali e lana di roccia.',
    icon: Shield
  },
  'termolight': {
    description: 'Termoventilatori professionali per asciugatura rapida in cantiere.',
    icon: Wrench
  },
  'wash-station': {
    description: 'Stazioni di lavaggio eco-compatibili per attrezzi e rulli.',
    icon: Award
  },
  'taglierine-manuali': {
    description: 'Taglierine manuali e accessori per il taglio di precisione.',
    icon: Wrench
  },
  'accessori': {
    description: 'Accessori e ricambi originali GL.OS.',
    icon: Package
  }
}

export default function ProductsPageClient({ products, categories, listinoPrezziPdfUrl }: ProductsPageClientProps) {
  const listinoPdfUrl = listinoPrezziPdfUrl || '/listino-glos.pdf'

  // Trova il Blender
  const blenderProduct = useMemo(() => {
    return products.find(p => {
      const slug = p.slug?.current?.toLowerCase() || ''
      const name = getTextValue(p.name).toLowerCase()
      return slug.includes('blender') || name.includes('blender')
    })
  }, [products])

  // Raggruppa prodotti per categoria (escludendo Blender che ha sezione dedicata)
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, { category: Category; products: Product[] }> = {}

    categories.forEach(cat => {
      const catName = getTextValue(cat.name).toLowerCase()
      // Escludi la categoria Blender
      if (!catName.includes('blender')) {
        grouped[cat._id] = {
          category: cat,
          products: products.filter(p => p.category?._id === cat._id)
        }
      }
    })

    const priorityOrder = ['policut', 'fiber', 'termo', 'wash', 'taglierine', 'accessori']

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

  const getCategoryInfo = (categoryName: string) => {
    const nameLower = categoryName.toLowerCase()
    for (const [key, info] of Object.entries(CATEGORY_INFO)) {
      if (nameLower.includes(key)) return info
    }
    return { description: 'Macchinari professionali Made in Italy.', icon: Package }
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ========== HERO COMPATTO ========== */}
      <section className="relative min-h-[45vh] flex items-center bg-gradient-to-br from-[#0a1628] via-[#0f2744] to-[#0a1628]">
        {/* Elementi decorativi animati */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        {/* Griglia sottile */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="container-glos relative z-10 py-16">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Tecnologia{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400">
                Made in Italy
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-200/80 max-w-2xl mx-auto">
              Macchinari professionali per l'industria delle vernici.
              Innovazione, qualità e affidabilità dal 2005.
            </p>
          </motion.div>
        </div>

        {/* Transizione fluida */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ========== BLENDER GLOS - SEZIONE HERO PRODOTTO ========== */}
      <section className="relative py-20 lg:py-28 bg-white">
        {/* Decorazioni sfondo */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-blue-50 to-transparent opacity-70" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-primary/5 to-transparent" />

        <div className="container-glos relative z-10">
          {/* Header sezione */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Prodotto di Punta
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-metal-900 mb-4">
              Blender <span className="text-primary">GLOS</span>
            </h2>
            <p className="text-xl text-metal-600 max-w-3xl mx-auto">
              Il miscelatore professionale che ha rivoluzionato l'industria delle vernici.
              Tecnologia brevettata per risultati impeccabili.
            </p>
          </motion.div>

          {/* Layout principale Blender */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
            {/* Colonna Immagine */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-metal-100 to-metal-50 shadow-2xl shadow-metal-300/30">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10" />

                {blenderProduct && isValidImage(blenderProduct.mainImage) ? (
                  <Image
                    src={safeImageUrl(blenderProduct.mainImage, 800, 800)!}
                    alt="Blender GLOS BG2"
                    fill
                    className="object-contain p-8 hover:scale-105 transition-transform duration-700"
                    priority
                  />
                ) : (
                  <Image
                    src="/images/glos-blender.jpg"
                    alt="Blender GLOS BG2"
                    fill
                    className="object-contain p-8"
                    priority
                  />
                )}

                {/* Badge angolo */}
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-full shadow-lg">
                    <Award className="w-4 h-4" />
                    Brevettato
                  </span>
                </div>
              </div>

              {/* Elementi decorativi fluttuanti */}
              <motion.div
                className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            {/* Colonna Contenuto */}
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-metal-900 mb-6">
                Miscelazione Perfetta,{' '}
                <span className="text-primary">Zero Compromessi</span>
              </h3>

              <p className="text-lg text-metal-600 leading-relaxed mb-8">
                Il Blender GLOS BG2 rappresenta l'eccellenza nella miscelazione professionale.
                Progettato e costruito interamente in Italia, utilizza il nostro esclusivo
                <strong className="text-metal-800"> Mix GLOS System</strong> con rotazione alternata
                che garantisce una miscelazione perfetta senza inglobare aria.
              </p>

              {/* Punti di forza */}
              <div className="space-y-4 mb-10">
                {[
                  { text: 'Tecnologia brevettata Mix GLOS System', highlight: true },
                  { text: 'Nessuna aria inglobata nel prodotto finale' },
                  { text: 'Velocità variabile per ogni tipo di vernice' },
                  { text: 'Oltre 150 secchi al giorno di capacità' },
                  { text: 'Costruzione robusta per uso intensivo' },
                ].map((point, i) => (
                  <motion.div
                    key={i}
                    className={`flex items-center gap-3 ${point.highlight ? 'text-primary font-semibold' : 'text-metal-700'}`}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${point.highlight ? 'text-primary' : 'text-green-500'}`} />
                    <span>{point.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href={blenderProduct ? `/prodotti/${blenderProduct.slug?.current}` : '/prodotti'}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1"
                >
                  Scopri il Blender GLOS
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contatti"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-metal-100 hover:bg-metal-200 text-metal-800 font-semibold rounded-xl transition-all duration-300"
                >
                  Richiedi Preventivo
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Mix GLOS System - Feature di spicco */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-[#0a1628] via-[#0f2744] to-[#1a365d] rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Pattern sfondo */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />

            <div className="relative grid md:grid-cols-2 gap-8 p-8 lg:p-12">
              {/* Immagine Mix GLOS System */}
              <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden bg-white/10">
                <Image
                  src="/images/mix-glos-system.jpg"
                  alt="Mix GLOS System - Sistema di miscelazione brevettato"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                    <Play className="w-4 h-4" />
                    Mix GLOS System in azione
                  </span>
                </div>
              </div>

              {/* Contenuto */}
              <div className="flex flex-col justify-center">
                <span className="inline-flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-4">
                  <Cog className="w-4 h-4" />
                  TECNOLOGIA ESCLUSIVA
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Mix GLOS System
                </h3>
                <p className="text-blue-100/80 text-lg leading-relaxed mb-6">
                  Il cuore tecnologico del nostro Blender. Un sistema di rotazione alternata
                  a velocità variabile che miscela vernici, smalti e pitture in modo perfetto,
                  eliminando completamente il problema dell'aria inglobata.
                </p>
                <ul className="space-y-3 text-blue-100/90">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    Rotazione alternata brevettata
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    Vernice pronta all'uso senza attese
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    Adatto a tutti i tipi di contenitori
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== SEPARATORE VISIVO ========== */}
      <div className="relative h-32 bg-gradient-to-b from-white via-metal-50 to-metal-100">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
          <motion.div
            className="w-px h-16 bg-gradient-to-b from-transparent via-primary/50 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
          />
        </div>
      </div>

      {/* ========== ALTRE CATEGORIE PRODOTTI ========== */}
      {productsByCategory.map((group, groupIndex) => {
        const categoryName = getTextValue(group.category.name)
        const categoryInfo = getCategoryInfo(categoryName)
        const CategoryIcon = categoryInfo.icon
        const isEven = groupIndex % 2 === 0

        return (
          <section
            key={group.category._id}
            className={`py-16 lg:py-24 relative overflow-hidden ${
              isEven ? 'bg-metal-100' : 'bg-white'
            }`}
          >
            {/* Decorazioni */}
            <div className={`absolute top-0 ${isEven ? 'right-0' : 'left-0'} w-96 h-96 bg-primary/5 rounded-full blur-3xl`} />

            <div className="container-glos relative z-10">
              {/* Header categoria */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-primary text-white shadow-lg shadow-primary/25">
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-metal-900">
                        {categoryName}
                      </h2>
                    </div>
                    <p className="text-metal-600 max-w-xl">
                      {categoryInfo.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-metal-600 font-medium text-sm">
                    {group.products.length} prodott{group.products.length === 1 ? 'o' : 'i'}
                  </span>
                </div>
              </motion.div>

              {/* Grid prodotti */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0047AB] to-[#003380]" />

        {/* Elementi decorativi */}
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"
          animate={{ scale: [1.3, 1, 1.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="container-glos relative z-10">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Pronti a fare la differenza?
            </h2>
            <p className="text-xl text-blue-100/90 mb-10">
              Contattaci per scoprire come i nostri macchinari possono
              migliorare la produttività della tua attività.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contatti"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-blue-50 text-primary font-bold rounded-xl shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Richiedi Informazioni
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={listinoPdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition-all duration-300"
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

// ========== COMPONENTE CARD PRODOTTO ==========
function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article
      variants={scaleIn}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-metal-200/50 hover:shadow-xl hover:shadow-primary/20 transition-all duration-500"
    >
      <motion.div variants={cardHover}>
        <Link href={`/prodotti/${product.slug?.current}`} className="block">
          {/* Immagine */}
          <div className="relative aspect-[4/3] bg-gradient-to-br from-metal-50 to-white overflow-hidden">
            {isValidImage(product.mainImage) && safeImageUrl(product.mainImage, 400, 300) ? (
              <Image
                src={safeImageUrl(product.mainImage, 400, 300)!}
                alt={String(product.name || '')}
                fill
                className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-16 h-16 text-metal-300" />
              </div>
            )}

            {/* Overlay hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
          <div className="p-5">
            <h3 className="text-lg font-bold text-metal-900 mb-2 group-hover:text-primary transition-colors">
              {getTextValue(product.name)}
            </h3>

            <div className="text-metal-600 text-sm line-clamp-2 leading-relaxed mb-4">
              <RichText value={product.shortDescription} />
            </div>

            <div className="flex items-center text-primary font-semibold text-sm">
              <span>Scopri di più</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.article>
  )
}
