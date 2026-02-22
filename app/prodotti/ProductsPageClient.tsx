// Products Page Client Component - Design con Bande Alternate e Specifiche Tecniche
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
import { ArrowRight, Zap, Shield, Wrench, Package, ChevronRight, Sparkles, Scissors, Wind, Droplets, Check, Gauge, Timer, Ruler, Weight, Thermometer, Volume2 } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

interface ProductsPageClientProps {
  products: Product[]
  categories: Category[]
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

// Info categorie con descrizioni estese e specifiche tecniche
const CATEGORY_INFO: Record<string, {
  description: string
  longDescription: string
  icon: React.ElementType
  features: string[]
  specs: { label: string; value: string; icon: React.ElementType }[]
  benefits: string[]
}> = {
  'blender': {
    description: 'Miscelatori professionali per vernici',
    longDescription: 'Il Blender GLOS BG2 rappresenta l\'eccellenza italiana nella miscelazione delle vernici. Con il sistema brevettato Mix GLOS System a rotazione alternata, garantisce una miscelazione perfetta senza inglobare aria, rivoluzionando il settore delle vernici e dei rivestimenti.',
    icon: Sparkles,
    features: ['Sistema brevettato Mix GLOS', 'Rotazione alternata a velocità variabile', 'Zero aria inglobata', 'Costruzione 100% italiana'],
    specs: [
      { label: 'Capacità', value: '150+ secchi/giorno', icon: Gauge },
      { label: 'Sistema', value: 'Mix GLOS System', icon: Sparkles },
      { label: 'Rotazione', value: 'Alternata brevettata', icon: Timer },
      { label: 'Risultato', value: 'Zero bolle d\'aria', icon: Check }
    ],
    benefits: ['Miscelazione omogenea garantita', 'Risparmio di tempo e materiale', 'Manutenzione minima', 'Assistenza tecnica dedicata']
  },
  'termo': {
    description: 'Termoventilatori professionali',
    longDescription: 'Termoventilatori industriali ad alta efficienza per asciugatura rapida in cantiere, riscaldamento di ambienti di lavoro e accelerazione dei processi di essiccazione. Potenti, affidabili e progettati per un uso intensivo.',
    icon: Wind,
    features: ['Motori brushless alta efficienza', 'Termostato regolabile', 'Protezione surriscaldamento', 'Struttura in acciaio verniciato'],
    specs: [
      { label: 'Potenza', value: 'Fino a 15kW', icon: Zap },
      { label: 'Portata aria', value: 'Fino a 1500 m³/h', icon: Wind },
      { label: 'Rumorosità', value: '<65 dB', icon: Volume2 },
      { label: 'Peso', value: 'Da 8 a 25 kg', icon: Weight }
    ],
    benefits: ['Asciugatura rapida', 'Consumi ridotti', 'Funzionamento silenzioso', 'Trasporto agevole']
  },
  'wash': {
    description: 'Stazioni di lavaggio eco-compatibili',
    longDescription: 'Wash Station GLOS: la soluzione ecologica e professionale per il lavaggio di rulli, pennelli, pistole e attrezzature per verniciatura. Sistema a circuito chiuso con filtrazione che riduce drasticamente i consumi d\'acqua e l\'impatto ambientale.',
    icon: Droplets,
    features: ['Sistema a circuito chiuso', 'Filtrazione multistadio', 'Vasca in acciaio inox', 'Pompa di ricircolo silenziosa'],
    specs: [
      { label: 'Capacità vasca', value: '30-50 litri', icon: Droplets },
      { label: 'Risparmio acqua', value: 'Fino al 90%', icon: Check },
      { label: 'Filtrazione', value: 'Multistadio', icon: Shield },
      { label: 'Materiale', value: 'Inox AISI 304', icon: Shield }
    ],
    benefits: ['Rispetto normative ambientali', 'Risparmio idrico garantito', 'Facilità di smaltimento', 'Lunga durata nel tempo']
  },
  'taglierine': {
    description: 'Taglierine professionali per isolanti',
    longDescription: 'La famiglia Taglierine GLOS comprende: Policut Basic, Policut Easy (a filo caldo per polistirene EPS/XPS e poliuretano) e Fiber Cut (per lana di roccia e fibre minerali). Soluzioni complete per il taglio professionale di tutti i materiali isolanti.',
    icon: Zap,
    features: ['Policut Basic e Easy (filo caldo)', 'Fiber Cut (fibre minerali)', 'Taglio senza polvere né residui', 'Struttura in alluminio anodizzato'],
    specs: [
      { label: 'Larghezza taglio', value: 'Fino a 1200mm', icon: Ruler },
      { label: 'Spessore max', value: 'Fino a 500mm', icon: Ruler },
      { label: 'Materiali', value: 'EPS, XPS, lana roccia', icon: Shield },
      { label: 'Alimentazione', value: '230V / 50Hz', icon: Zap }
    ],
    benefits: ['Taglio pulito senza sbavature', 'Adatte a tutti gli isolanti', 'Precisione millimetrica', 'Facile da trasportare']
  },
  'accessori': {
    description: 'Accessori e ricambi originali',
    longDescription: 'Gamma completa di accessori, ricambi originali e consumabili GLOS per garantire massima efficienza e durata dei vostri macchinari. Solo componenti originali per prestazioni sempre al top.',
    icon: Package,
    features: ['Ricambi 100% originali', 'Compatibilità garantita', 'Spedizione rapida', 'Assistenza tecnica'],
    specs: [
      { label: 'Fili ricambio', value: 'Tutti i modelli', icon: Zap },
      { label: 'Lame', value: 'Varie misure', icon: Scissors },
      { label: 'Filtri', value: 'Per Wash Station', icon: Shield },
      { label: 'Garanzia', value: '12 mesi', icon: Check }
    ],
    benefits: ['Prestazioni originali', 'Durata garantita', 'Installazione facile', 'Supporto tecnico']
  }
}

export default function ProductsPageClient({ products, categories }: ProductsPageClientProps) {
  const { language } = useLanguage()
  const listinoPdfUrl = `/api/download-listino?lang=${language}`

  // Trova il Blender
  const blenderProduct = useMemo(() => {
    return products.find(p => {
      const slug = p.slug?.current?.toLowerCase() || ''
      const name = getTextValue(p.name).toLowerCase()
      return slug.includes('blender') || name.includes('blender')
    })
  }, [products])

  // Raggruppa prodotti per categoria (escludendo Blender e Accessori)
  // NOTA: Policut viene unito dentro Taglierine (stessa famiglia)
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, { category: Category; products: Product[]; displayName: string }> = {}

    // Trova tutti i prodotti Policut/Taglierine per unirli
    const taglierineProducts: Product[] = []
    let taglierineCategory: Category | null = null

    categories.forEach(cat => {
      const catName = getTextValue(cat.name).toLowerCase()

      // Escludi: Blender (ha sezione dedicata), Accessori e Filo (nel listino), Miscelatori (duplicato Blender)
      if (catName.includes('blender') || catName.includes('accessori') || catName.includes('filo') || catName.includes('miscelatori')) {
        return
      }

      // Unisci Policut, Fiber Cut e Taglierine in un'unica categoria
      if (catName.includes('policut') || catName.includes('taglierine') || catName.includes('fiber')) {
        const catProducts = products.filter(p => p.category?._id === cat._id)
        taglierineProducts.push(...catProducts)
        if (!taglierineCategory || catName.includes('taglierine')) {
          taglierineCategory = cat
        }
      } else {
        grouped[cat._id] = {
          category: cat,
          products: products.filter(p => p.category?._id === cat._id),
          displayName: getTextValue(cat.name)
        }
      }
    })

    // Aggiungi la categoria Taglierine unificata
    if (taglierineCategory && taglierineProducts.length > 0) {
      grouped['taglierine-unified'] = {
        category: taglierineCategory,
        products: taglierineProducts,
        displayName: 'Taglierine'
      }
    }

    const order = ['taglierine', 'termo', 'wash']
    return Object.values(grouped)
      .filter(g => g.products.length > 0)
      .sort((a, b) => {
        const nameA = a.displayName.toLowerCase()
        const nameB = b.displayName.toLowerCase()
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
    return CATEGORY_INFO['accessori']
  }

  const blenderInfo = CATEGORY_INFO['blender']

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO - TITOLO PAGINA CON IMMAGINE ===== */}
      <section className="relative bg-gradient-to-br from-[#0a1628] via-[#0f2744] to-[#1a365d] overflow-hidden">
        {/* Immagine di sfondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/industrial-precision.jpg"
            alt="Macchinari di precisione"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/80 via-[#0f2744]/70 to-[#1a365d]/90" />
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
      </section>

      {/* ===== BLENDER GLOS - SEZIONE SPECIALE ===== */}
      <section className="relative bg-gradient-to-br from-[#0047AB] via-[#0055CC] to-[#0066EE] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="container-glos relative z-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Contenuto */}
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Blender GLOS
              </h2>
              <p className="text-2xl text-blue-200 font-medium mb-6">BG2</p>

              <p className="text-lg text-blue-100 leading-relaxed mb-8">
                {blenderInfo.longDescription}
              </p>

              {/* Specifiche Tecniche in Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {blenderInfo.specs.map((spec, i) => {
                  const SpecIcon = spec.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <SpecIcon className="w-4 h-4 text-blue-300" />
                        <span className="text-blue-300 text-sm font-medium">{spec.label}</span>
                      </div>
                      <p className="text-white font-bold">{spec.value}</p>
                    </motion.div>
                  )
                })}
              </div>

              {/* Vantaggi */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-blue-200 uppercase tracking-wide mb-4">Vantaggi Principali</h4>
                <div className="grid grid-cols-2 gap-2">
                  {blenderInfo.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-blue-100">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href={blenderProduct ? `/prodotti/${blenderProduct.slug?.current}` : '/contatti'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
                >
                  Scopri tutti i dettagli
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contatti"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                >
                  Richiedi preventivo
                </Link>
              </div>
            </motion.div>

            {/* Immagine Blender */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  {blenderProduct && isValidImage(blenderProduct.mainImage) ? (
                    <Image
                      src={safeImageUrl(blenderProduct.mainImage, 600, 600)!}
                      alt="Blender GLOS BG2"
                      width={600}
                      height={600}
                      className="w-full h-auto object-contain"
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

                {/* Card Mix GLOS System */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-6 -right-6 lg:bottom-8 lg:-right-8 w-48 lg:w-56"
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

        {/* Onda separatore */}
        <div className="absolute -bottom-px left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[60px] block">
            <path d="M0 60L48 52.5C96 45 192 30 288 22.5C384 15 480 15 576 20C672 25 768 35 864 40C960 45 1056 45 1152 42.5C1248 40 1344 35 1392 32.5L1440 30V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ===== ALTRE CATEGORIE PRODOTTI - BANDE ALTERNATE ===== */}
      {productsByCategory.map((group, groupIndex) => {
        const categoryName = group.displayName || getTextValue(group.category.name)
        const categoryInfo = getCategoryInfo(categoryName)
        const CategoryIcon = categoryInfo.icon
        const isBlue = groupIndex % 2 === 1 // Alterna partendo da bianco dopo Blender

        return (
          <section
            key={group.category._id}
            className={`relative overflow-hidden ${
              isBlue
                ? 'bg-gradient-to-br from-[#0047AB] via-[#0055CC] to-[#0066EE] text-white'
                : 'bg-white text-gray-900'
            }`}
          >
            {isBlue && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
              </div>
            )}

            <div className="container-glos relative z-10 py-16 lg:py-24">
              {/* Header Categoria - Layout ottimizzato per mobile */}
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-12">
                {/* Titolo + Badge - Sempre per primo */}
                <motion.div
                  variants={groupIndex % 2 === 0 ? slideInLeft : slideInRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`order-1 ${groupIndex % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 ${
                    isBlue ? 'bg-white/10 backdrop-blur-sm' : 'bg-primary/10'
                  }`}>
                    <CategoryIcon className={`w-5 h-5 ${isBlue ? 'text-blue-200' : 'text-primary'}`} />
                    <span className={`text-sm font-semibold ${isBlue ? 'text-blue-100' : 'text-primary'}`}>
                      {group.products.length} prodott{group.products.length === 1 ? 'o' : 'i'}
                    </span>
                  </div>

                  <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-4 ${
                    isBlue ? 'text-white' : 'text-gray-900'
                  }`}>
                    {categoryName}
                  </h2>

                  {/* Descrizione - nascosta su mobile, visibile su desktop */}
                  <div className="hidden lg:block">
                    <p className={`text-lg leading-relaxed mb-6 ${
                      isBlue ? 'text-blue-100' : 'text-gray-600'
                    }`}>
                      {categoryInfo.longDescription}
                    </p>

                    {/* Caratteristiche Principali */}
                    <div className="mb-6">
                      <h4 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${
                        isBlue ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        Caratteristiche Principali
                      </h4>
                      <div className="space-y-2">
                        {categoryInfo.features.map((feature, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-3 ${
                              isBlue ? 'text-blue-100' : 'text-gray-700'
                            }`}
                          >
                            <Check className={`w-5 h-5 flex-shrink-0 ${isBlue ? 'text-green-400' : 'text-green-600'}`} />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vantaggi */}
                    <div>
                      <h4 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${
                        isBlue ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        Vantaggi
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {categoryInfo.benefits.map((benefit, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-2 text-sm ${
                              isBlue ? 'text-blue-100' : 'text-gray-600'
                            }`}
                          >
                            <ChevronRight className={`w-4 h-4 ${isBlue ? 'text-blue-300' : 'text-primary'}`} />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Immagine - Subito dopo il titolo su mobile */}
                <motion.div
                  variants={groupIndex % 2 === 0 ? slideInRight : slideInLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`order-2 w-full ${groupIndex % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  {/* Immagine categoria */}
                  {group.products[0] && isValidImage(group.products[0].mainImage) && (
                    <div className={`relative rounded-2xl overflow-hidden mb-6 ${
                      isBlue ? 'bg-white/10 backdrop-blur-sm p-6' : 'bg-gray-50 p-6'
                    }`}>
                      <Image
                        src={safeImageUrl(group.products[0].mainImage, 500, 400)!}
                        alt={categoryName}
                        width={500}
                        height={400}
                        className="w-full h-auto object-contain mx-auto max-h-[280px]"
                      />
                    </div>
                  )}

                  {/* Specifiche Tecniche */}
                  <div className="grid grid-cols-2 gap-3">
                    {categoryInfo.specs.map((spec, i) => {
                      const SpecIcon = spec.icon
                      return (
                        <div
                          key={i}
                          className={`rounded-xl p-4 ${
                            isBlue
                              ? 'bg-white/10 backdrop-blur-sm border border-white/20'
                              : 'bg-gray-50 border border-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <SpecIcon className={`w-4 h-4 ${isBlue ? 'text-blue-300' : 'text-primary'}`} />
                            <span className={`text-xs font-medium ${isBlue ? 'text-blue-200' : 'text-gray-500'}`}>
                              {spec.label}
                            </span>
                          </div>
                          <p className={`font-bold ${isBlue ? 'text-white' : 'text-gray-900'}`}>
                            {spec.value}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Descrizione + Caratteristiche - Solo su mobile, dopo l'immagine */}
                <div className={`order-3 lg:hidden ${isBlue ? 'text-white' : 'text-gray-900'}`}>
                  <p className={`text-base leading-relaxed mb-6 ${
                    isBlue ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {categoryInfo.longDescription}
                  </p>

                  {/* Caratteristiche Principali Mobile */}
                  <div className="mb-6">
                    <h4 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${
                      isBlue ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      Caratteristiche Principali
                    </h4>
                    <div className="space-y-2">
                      {categoryInfo.features.map((feature, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-3 ${
                            isBlue ? 'text-blue-100' : 'text-gray-700'
                          }`}
                        >
                          <Check className={`w-5 h-5 flex-shrink-0 ${isBlue ? 'text-green-400' : 'text-green-600'}`} />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vantaggi Mobile */}
                  <div>
                    <h4 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${
                      isBlue ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      Vantaggi
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {categoryInfo.benefits.map((benefit, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 text-sm ${
                            isBlue ? 'text-blue-100' : 'text-gray-600'
                          }`}
                        >
                          <ChevronRight className={`w-4 h-4 ${isBlue ? 'text-blue-300' : 'text-primary'}`} />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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

            {/* Separatore ondulato */}
            {isBlue && groupIndex < productsByCategory.length - 1 && (
              <div className="absolute -bottom-px left-0 right-0 overflow-hidden">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[60px] block">
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
