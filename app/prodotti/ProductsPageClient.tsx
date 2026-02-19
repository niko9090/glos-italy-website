// Products Page Client Component - Design Professionale
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
import { ArrowRight, Zap, Shield, Wrench, Package, ChevronRight } from 'lucide-react'

interface ProductsPageClientProps {
  products: Product[]
  categories: Category[]
  listinoPrezziPdfUrl?: string | null
}

// Animazioni fluide
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

// Info categorie
const CATEGORY_INFO: Record<string, { description: string; icon: React.ElementType }> = {
  'policut': { description: 'Taglierine professionali a filo caldo per pannelli isolanti.', icon: Zap },
  'fiber-cut': { description: 'Taglio specializzato per fibre minerali e lana di roccia.', icon: Shield },
  'termolight': { description: 'Termoventilatori professionali per asciugatura rapida.', icon: Wrench },
  'wash-station': { description: 'Stazioni di lavaggio eco-compatibili.', icon: Wrench },
  'taglierine-manuali': { description: 'Taglierine manuali per taglio di precisione.', icon: Wrench },
  'accessori': { description: 'Accessori e ricambi originali.', icon: Package }
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

  // Raggruppa prodotti per categoria (escludendo Blender)
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, { category: Category; products: Product[] }> = {}
    categories.forEach(cat => {
      const catName = getTextValue(cat.name).toLowerCase()
      if (!catName.includes('blender')) {
        grouped[cat._id] = { category: cat, products: products.filter(p => p.category?._id === cat._id) }
      }
    })
    const order = ['policut', 'fiber', 'termo', 'wash', 'taglierine', 'accessori']
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
    return { description: 'Macchinari professionali Made in Italy.', icon: Package }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ===== BLENDER GLOS - HERO PRINCIPALE ===== */}
      <section className="relative bg-gradient-to-b from-[#0a1628] via-[#0f2744] to-[#1a365d] overflow-hidden">
        {/* Sfondo decorativo */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-blue-500/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[60%] bg-gradient-to-tr from-primary/20 to-transparent" />
        </div>

        <div className="container-glos relative z-10">
          <div className="grid lg:grid-cols-2 min-h-[85vh] items-center gap-8 lg:gap-16 py-16 lg:py-0">

            {/* Colonna Sinistra - Contenuto */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Blender GLOS
                <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-blue-300 mt-2">
                  BG2
                </span>
              </h1>

              <p className="text-lg md:text-xl text-blue-100/90 leading-relaxed mb-8 max-w-xl">
                Il miscelatore professionale progettato e costruito in Italia che ha
                rivoluzionato l'industria delle vernici. Dotato del sistema brevettato
                <strong className="text-white"> Mix GLOS System</strong> con rotazione
                alternata a velocità variabile per una miscelazione perfetta,
                senza inglobare aria.
              </p>

              {/* Caratteristiche tecniche */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { label: 'Capacità', value: '150+ secchi/giorno' },
                  { label: 'Sistema', value: 'Mix GLOS System' },
                  { label: 'Rotazione', value: 'Alternata brevettata' },
                  { label: 'Risultato', value: 'Zero aria inglobata' },
                ].map((spec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                  >
                    <span className="text-blue-400 text-sm font-medium">{spec.label}</span>
                    <p className="text-white font-semibold mt-1">{spec.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href={blenderProduct ? `/prodotti/${blenderProduct.slug?.current}` : '/contatti'}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a1628] font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Scopri tutti i dettagli
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contatti"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Richiedi preventivo
                </Link>
              </motion.div>
            </motion.div>

            {/* Colonna Destra - Immagini */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2 relative"
            >
              {/* Immagine principale Blender */}
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-primary/20 rounded-3xl blur-3xl" />
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                  {blenderProduct && isValidImage(blenderProduct.mainImage) ? (
                    <Image
                      src={safeImageUrl(blenderProduct.mainImage, 600, 600)!}
                      alt="Blender GLOS BG2"
                      width={600}
                      height={600}
                      className="w-full h-auto object-contain drop-shadow-2xl"
                      priority
                    />
                  ) : (
                    <Image
                      src="/images/glos-blender.jpg"
                      alt="Blender GLOS BG2"
                      width={600}
                      height={600}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  )}
                </div>

                {/* Card Mix GLOS System - posizionata in basso a destra */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-6 -right-6 lg:bottom-4 lg:-right-12 w-48 lg:w-56"
                >
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="relative h-28 lg:h-32">
                      <Image
                        src="/images/mix-glos-system.jpg"
                        alt="Mix GLOS System"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3 bg-gradient-to-r from-primary to-blue-600">
                      <p className="text-white text-xs font-bold">MIX GLOS SYSTEM</p>
                      <p className="text-blue-100 text-[10px]">Tecnologia brevettata</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Transizione */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ===== ALTRE CATEGORIE PRODOTTI ===== */}
      {productsByCategory.map((group, groupIndex) => {
        const categoryName = getTextValue(group.category.name)
        const categoryInfo = getCategoryInfo(categoryName)
        const CategoryIcon = categoryInfo.icon
        const isAlt = groupIndex % 2 === 1

        return (
          <section
            key={group.category._id}
            className={`py-20 lg:py-28 ${isAlt ? 'bg-gray-50' : 'bg-white'}`}
          >
            <div className="container-glos">
              {/* Header */}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary/10">
                    <CategoryIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {categoryName}
                    </h2>
                    <p className="text-gray-600 mt-1">{categoryInfo.description}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {group.products.length} prodott{group.products.length === 1 ? 'o' : 'i'}
                </span>
              </motion.div>

              {/* Grid prodotti */}
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
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

      {/* ===== CTA FINALE ===== */}
      <section className="py-20 bg-gradient-to-br from-primary via-blue-700 to-blue-900">
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
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
function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article
      variants={fadeIn}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
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
            Dettagli <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
