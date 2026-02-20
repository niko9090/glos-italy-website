// Products Page Client Component - Design con Bande Alternate
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
import { ArrowRight, Zap, Shield, Wrench, Package, ChevronRight, Sparkles, Scissors, Wind, Droplets } from 'lucide-react'

interface ProductsPageClientProps {
  products: Product[]
  categories: Category[]
  listinoPrezziPdfUrl?: string | null
}

// Animazioni
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
}

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
}

// Info categorie con descrizioni estese
const CATEGORY_INFO: Record<string, {
  description: string
  longDescription: string
  icon: React.ElementType
  features: string[]
}> = {
  'blender': {
    description: 'Miscelatori professionali per vernici',
    longDescription: 'Il Blender GLOS BG2 rappresenta l\'eccellenza italiana nella miscelazione delle vernici. Con il sistema brevettato Mix GLOS System, garantisce una miscelazione perfetta senza inglobare aria, rivoluzionando il settore.',
    icon: Sparkles,
    features: ['Sistema brevettato', 'Made in Italy', 'Zero aria inglobata', '150+ secchi/giorno']
  },
  'policut': {
    description: 'Taglierine professionali a filo caldo',
    longDescription: 'Le taglierine Policut sono progettate per il taglio preciso di pannelli isolanti in polistirene e poliuretano. Tecnologia a filo caldo per tagli netti e senza residui, ideali per cantieri e laboratori.',
    icon: Zap,
    features: ['Filo caldo di precisione', 'Taglio netto', 'Per pannelli isolanti', 'Uso professionale']
  },
  'fiber': {
    description: 'Taglio specializzato per fibre minerali',
    longDescription: 'Soluzioni dedicate al taglio di lana di roccia e fibre minerali. Macchine robuste e affidabili per lavorazioni industriali con la massima sicurezza operativa.',
    icon: Shield,
    features: ['Per lana di roccia', 'Alta sicurezza', 'Uso industriale', 'Robustezza garantita']
  },
  'termo': {
    description: 'Termoventilatori professionali',
    longDescription: 'Termoventilatori ad alta efficienza per asciugatura rapida in cantiere. Potenti, silenziosi e progettati per un uso intensivo in ambienti professionali.',
    icon: Wind,
    features: ['Asciugatura rapida', 'Alta efficienza', 'Silenziosità', 'Uso intensivo']
  },
  'wash': {
    description: 'Stazioni di lavaggio eco-compatibili',
    longDescription: 'Wash Station GLOS: la soluzione ecologica per il lavaggio di rulli, pennelli e attrezzature. Sistema a circuito chiuso che riduce gli sprechi e rispetta l\'ambiente.',
    icon: Droplets,
    features: ['Eco-compatibile', 'Circuito chiuso', 'Zero sprechi', 'Rispetto ambiente']
  },
  'taglierine': {
    description: 'Taglierine manuali di precisione',
    longDescription: 'Taglierine manuali per il taglio di precisione su misura. Strumenti essenziali per il professionista che richiede flessibilità e controllo totale.',
    icon: Scissors,
    features: ['Taglio su misura', 'Controllo manuale', 'Flessibilità', 'Precisione']
  },
  'accessori': {
    description: 'Accessori e ricambi originali',
    longDescription: 'Gamma completa di accessori e ricambi originali GLOS per mantenere le vostre macchine sempre efficienti. Qualità garantita e compatibilità perfetta.',
    icon: Package,
    features: ['Ricambi originali', 'Qualità garantita', 'Compatibilità', 'Lunga durata']
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

  // Raggruppa prodotti per categoria
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, { category: Category; products: Product[] }> = {}
    categories.forEach(cat => {
      const catName = getTextValue(cat.name).toLowerCase()
      // Include tutte le categorie
      grouped[cat._id] = { category: cat, products: products.filter(p => p.category?._id === cat._id) }
    })
    const order = ['blender', 'policut', 'fiber', 'termo', 'wash', 'taglierine', 'accessori']
    return Object.values(grouped)
      .filter(g => g.products.length > 0)
      .sort((a, b) => {
        const nameA = getTextValue(a.category.name).toLowerCase()
        const nameB = getTextValue(b.category.name).toLowerCase()
        const iA = order.findIndex(p => nameA.includes(p))
        const iB = order.findIndex(p => nameB.includes(p))
        return (iA === -1 ? 999 : iA) - (iB === -1 ? 999 : iB)
      })
  }, [products, categories])

  const getCategoryInfo = (name: string) => {
    const lower = name.toLowerCase()
    for (const [key, info] of Object.entries(CATEGORY_INFO)) {
      if (lower.includes(key)) return info
    }
    return {
      description: 'Macchinari professionali Made in Italy.',
      longDescription: 'Prodotti di qualità progettati e costruiti in Italia per soddisfare le esigenze dei professionisti più esigenti.',
      icon: Package,
      features: ['Made in Italy', 'Qualità professionale', 'Assistenza dedicata', 'Garanzia']
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO - TITOLO PAGINA ===== */}
      <section className="relative bg-gradient-to-br from-[#0a1628] via-[#0f2744] to-[#1a365d] overflow-hidden">
        {/* Pattern decorativo */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container-glos relative z-10 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-blue-300 uppercase tracking-widest text-sm font-semibold mb-4">
              Catalogo Completo
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              I Nostri Prodotti
            </h1>
            <p className="text-xl text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
              Macchinari di precisione progettati e costruiti in Italia.
              Qualità, innovazione e affidabilità dal 2005.
            </p>
          </motion.div>
        </div>

        {/* Onda decorativa bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ===== CATEGORIE PRODOTTI - BANDE ALTERNATE ===== */}
      {productsByCategory.map((group, groupIndex) => {
        const categoryName = getTextValue(group.category.name)
        const categoryInfo = getCategoryInfo(categoryName)
        const CategoryIcon = categoryInfo.icon
        const isBlue = groupIndex % 2 === 0

        return (
          <section
            key={group.category._id}
            className={`relative overflow-hidden ${
              isBlue
                ? 'bg-gradient-to-br from-[#0047AB] via-[#0055CC] to-[#0066EE] text-white'
                : 'bg-white text-gray-900'
            }`}
          >
            {/* Pattern sfondo per sezioni blu */}
            {isBlue && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
              </div>
            )}

            <div className="container-glos relative z-10 py-16 lg:py-24">
              {/* Header Categoria */}
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12">
                {/* Info Categoria */}
                <motion.div
                  variants={groupIndex % 2 === 0 ? slideInLeft : slideInRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={groupIndex % 2 === 1 ? 'lg:order-2' : ''}
                >
                  <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 ${
                    isBlue ? 'bg-white/10 backdrop-blur-sm' : 'bg-primary/10'
                  }`}>
                    <CategoryIcon className={`w-5 h-5 ${isBlue ? 'text-blue-200' : 'text-primary'}`} />
                    <span className={`text-sm font-semibold ${isBlue ? 'text-blue-100' : 'text-primary'}`}>
                      {group.products.length} prodott{group.products.length === 1 ? 'o' : 'i'}
                    </span>
                  </div>

                  <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
                    isBlue ? 'text-white' : 'text-gray-900'
                  }`}>
                    {categoryName}
                  </h2>

                  <p className={`text-lg leading-relaxed mb-6 ${
                    isBlue ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {categoryInfo.longDescription}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3">
                    {categoryInfo.features.map((feature, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-sm ${
                          isBlue ? 'text-blue-100' : 'text-gray-600'
                        }`}
                      >
                        <ChevronRight className={`w-4 h-4 ${isBlue ? 'text-blue-300' : 'text-primary'}`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Immagine rappresentativa (primo prodotto della categoria) */}
                <motion.div
                  variants={groupIndex % 2 === 0 ? slideInRight : slideInLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={groupIndex % 2 === 1 ? 'lg:order-1' : ''}
                >
                  {group.products[0] && isValidImage(group.products[0].mainImage) && (
                    <div className={`relative rounded-2xl overflow-hidden ${
                      isBlue ? 'bg-white/10 backdrop-blur-sm p-8' : 'bg-gray-50 p-8'
                    }`}>
                      <Image
                        src={safeImageUrl(group.products[0].mainImage, 500, 400)!}
                        alt={categoryName}
                        width={500}
                        height={400}
                        className="w-full h-auto object-contain mx-auto max-h-[300px]"
                      />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Grid Prodotti */}
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {group.products.map((product) => (
                  <ProductCard key={product._id} product={product} isOnBlue={isBlue} />
                ))}
              </motion.div>
            </div>

            {/* Separatore ondulato per sezioni blu */}
            {isBlue && groupIndex < productsByCategory.length - 1 && (
              <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                  <path d="M0 60L48 52.5C96 45 192 30 288 22.5C384 15 480 15 576 20C672 25 768 35 864 40C960 45 1056 45 1152 42.5C1248 40 1344 35 1392 32.5L1440 30V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="white"/>
                </svg>
              </div>
            )}
          </section>
        )
      })}

      {/* ===== CTA FINALE ===== */}
      <section className="py-20 bg-gradient-to-br from-[#0a1628] via-[#0f2744] to-[#1a365d]">
        <div className="container-glos">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Vuoi saperne di più?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contattaci per una consulenza personalizzata sui nostri macchinari.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contatti"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Contattaci ora
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a
                href={listinoPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Scarica listino prezzi
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Card Prodotto
function ProductCard({ product, isOnBlue }: { product: Product; isOnBlue: boolean }) {
  return (
    <motion.article
      variants={fadeIn}
      className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
        isOnBlue
          ? 'bg-white shadow-lg hover:shadow-2xl'
          : 'bg-white shadow-sm hover:shadow-xl border border-gray-100'
      }`}
    >
      <Link href={`/prodotti/${product.slug?.current}`} className="block">
        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
          {isValidImage(product.mainImage) && safeImageUrl(product.mainImage, 400, 300) ? (
            <Image
              src={safeImageUrl(product.mainImage, 400, 300)!}
              alt={getTextValue(product.name)}
              fill
              className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-300" />
            </div>
          )}
          <ProductBadges
            isNew={product.isNew}
            isFeatured={product.isFeatured}
            badges={product.badges}
            customBadge={product.customBadge}
            size="sm"
          />
        </div>
        <div className="p-5">
          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {getTextValue(product.name)}
          </h3>
          <div className="text-sm text-gray-600 line-clamp-2 mb-4">
            <RichText value={product.shortDescription} />
          </div>
          <span className="inline-flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
            Scopri di più <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
