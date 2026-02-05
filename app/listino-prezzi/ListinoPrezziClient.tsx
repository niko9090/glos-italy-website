'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MOTION, fadeInUp } from '@/lib/animations/config'

// ======================================================
// DATA - Extracted from GLOS official catalog PDF
// ======================================================

interface Product {
  code: string
  name: string
  description?: string
  price: number
  specs?: { label: string; value: string }[]
  badge?: string
}

interface Category {
  id: string
  name: string
  subtitle: string
  products: Product[]
  note?: string
}

const categories: Category[] = [
  {
    id: 'twin',
    name: 'Policut Twin',
    subtitle: 'Serie Gamma - Taglierine autoportanti professionali',
    products: [
      {
        code: 'TWIN 120-20',
        name: 'Policut Twin 120/20',
        description: 'Taglierina autoportante prof. in alluminio e inox, taglio a 45° sx/dx, scanalature, diagonale. Profondita 20cm.',
        price: 1299,
        specs: [
          { label: 'Misura max. taglio', value: '1320 mm' },
          { label: 'Profondita taglio', value: '210 mm' },
          { label: 'Macchina chiusa', value: '1570x600x205 mm' },
          { label: 'Peso', value: '14 kg' },
        ],
        badge: 'Top di Gamma',
      },
      {
        code: 'TWIN 120-30',
        name: 'Policut Twin 120/30',
        description: 'Taglierina autoportante prof. in alluminio e inox, taglio a 45° sx/dx, scanalature, diagonale. Profondita 30cm.',
        price: 1299,
        specs: [
          { label: 'Misura max. taglio', value: '1320 mm' },
          { label: 'Profondita taglio', value: '310 mm' },
          { label: 'Macchina chiusa', value: '1570x700x205 mm' },
          { label: 'Peso', value: '14 kg' },
        ],
        badge: 'Top di Gamma',
      },
    ],
  },
  {
    id: 'easy',
    name: 'Policut Easy',
    subtitle: 'Serie Gamma - Taglierine da ponteggio professionali',
    products: [
      {
        code: 'EASY 120-20',
        name: 'Policut Easy 1200/20',
        description: 'Top di gamma: produttivita e tagli di grande dimensione. Sostegno autoportante, utilizzo anche in appoggio.',
        price: 995,
        specs: [
          { label: 'Misura max. taglio', value: '1320 mm' },
          { label: 'Profondita taglio', value: '210 mm' },
          { label: 'Macchina chiusa', value: '1570x600x205 mm' },
          { label: 'Peso', value: '14 kg' },
        ],
      },
      {
        code: 'EASY 120-30',
        name: 'Policut Easy 1200/30',
        description: 'Top di gamma: produttivita e tagli di grande dimensione. Profondita 30cm.',
        price: 995,
        specs: [
          { label: 'Misura max. taglio', value: '1320 mm' },
          { label: 'Profondita taglio', value: '310 mm' },
        ],
      },
      {
        code: 'EASY 100-20',
        name: 'Policut Easy 1000/20',
        description: 'Il giusto compromesso in cantiere: leggerezza e produttivita. Tagli perfetti su pannelli grandi.',
        price: 975,
        specs: [
          { label: 'Misura max. taglio', value: '1110 mm' },
          { label: 'Profondita taglio', value: '210 mm' },
        ],
      },
      {
        code: 'EASY 100-30',
        name: 'Policut Easy 1000/30',
        description: 'Il giusto compromesso in cantiere: leggerezza e produttivita. Profondita 30cm.',
        price: 975,
        specs: [
          { label: 'Misura max. taglio', value: '1110 mm' },
          { label: 'Profondita taglio', value: '310 mm' },
        ],
      },
      {
        code: 'EASY 70-20',
        name: 'Policut Easy 700/20',
        description: 'La piu compatta e leggera della gamma Easy. Ideale per ponteggi alti o luoghi scomodi.',
        price: 945,
        specs: [
          { label: 'Misura max. taglio', value: '645 mm' },
          { label: 'Profondita taglio', value: '210 mm' },
        ],
      },
      {
        code: 'EASY 70-30',
        name: 'Policut Easy 700/30',
        description: 'La piu compatta e leggera della gamma Easy. Profondita 30cm.',
        price: 945,
        specs: [
          { label: 'Misura max. taglio', value: '645 mm' },
          { label: 'Profondita taglio', value: '310 mm' },
        ],
      },
    ],
  },
  {
    id: 'basic',
    name: 'Policut Basic',
    subtitle: 'Serie Basic - Taglierine autoportanti con trasformatore a bordo',
    products: [
      {
        code: 'TWINBASIC 120SCC',
        name: 'Twin Basic 1200 SCC',
        description: 'Taglierina autoportante con trasformatore a bordo a servizio continuo. Cavalletto regolabile, goniometri di precisione.',
        price: 998,
        specs: [
          { label: 'Misura max. taglio', value: '1320 mm' },
          { label: 'Profondita taglio', value: '330 mm' },
          { label: 'Macchina chiusa', value: '1660x635x200 mm' },
          { label: 'Peso', value: '15,5 kg' },
        ],
      },
      {
        code: 'TWINBASIC 120S',
        name: 'Twin Basic 1200 S',
        description: 'Taglierina autoportante serie Basic 1200mm.',
        price: 880,
        specs: [
          { label: 'Misura max. taglio', value: '1320 mm' },
          { label: 'Profondita taglio', value: '330 mm' },
        ],
      },
      {
        code: 'TWINBASIC 100SCC',
        name: 'Twin Basic 1000 SCC',
        description: 'Taglierina autoportante con trasformatore a bordo a servizio continuo, formato 1000mm.',
        price: 928,
        specs: [
          { label: 'Misura max. taglio', value: '1095 mm' },
          { label: 'Profondita taglio', value: '330 mm' },
          { label: 'Macchina chiusa', value: '1430x635x200 mm' },
          { label: 'Peso', value: '14,5 kg' },
        ],
      },
      {
        code: 'TWINBASIC 100S',
        name: 'Twin Basic 1000 S',
        description: 'Taglierina autoportante serie Basic 1000mm.',
        price: 803,
      },
      {
        code: 'EASYBASIC 120CC',
        name: 'Easy Basic 1200 CC',
        description: 'Il giusto compromesso in cantiere: leggerezza e produttivita. Con cavo continuo.',
        price: 888,
        specs: [
          { label: 'Misura max. taglio', value: '1110 mm' },
          { label: 'Profondita taglio', value: '210-310 mm' },
        ],
      },
      {
        code: 'EASYBASIC 120',
        name: 'Easy Basic 1200',
        description: 'Macchina professionale facile da trasportare, tutti i tipi di taglio.',
        price: 763,
      },
      {
        code: 'EASYBASIC 100CC',
        name: 'Easy Basic 1000 CC',
        description: 'Macchina professionale compatta con cavo continuo. Ideale per ponteggio.',
        price: 844,
        specs: [
          { label: 'Misura max. taglio', value: '1095 mm' },
          { label: 'Profondita taglio', value: '330 mm' },
        ],
      },
      {
        code: 'EASYBASIC 100',
        name: 'Easy Basic 1000',
        description: 'Macchina professionale compatta per ponteggio.',
        price: 719,
      },
      {
        code: 'EASYBASIC 70',
        name: 'Easy Basic 700',
        description: 'La soluzione piu compatta per tagli seriali su ponteggi.',
        price: 695,
        specs: [
          { label: 'Misura max. taglio', value: '640 mm' },
          { label: 'Profondita taglio', value: '330 mm' },
        ],
      },
    ],
  },
  {
    id: 'manuali',
    name: 'Taglierine Manuali',
    subtitle: 'Minicut e Hot Knife - Per tagli di precisione e lavori speciali',
    products: [
      {
        code: 'MINICUT',
        name: 'Minicut (con trasformatore)',
        description: 'Taglierina manuale per tagli di precisione. Ideale per sottotrave, spallette e piccoli lavori. Impugnatura ergonomica, appoggio in plexiglass.',
        price: 336,
        specs: [
          { label: 'Spessore di taglio', value: '200/360 mm' },
          { label: 'Profondita', value: '400 mm' },
        ],
      },
      {
        code: 'MINICUT S/T',
        name: 'Minicut (senza trasformatore)',
        description: 'Taglierina manuale senza trasformatore. Compatibile con trasformatore universale GLOS.',
        price: 260,
      },
      {
        code: 'BISELLATRICE',
        name: 'Hot Knife - Coltello a Caldo',
        description: 'Coltello a caldo ad intermittenza (30s ON / 50s OFF). Con valigetta, lame, slitta inox. Per tagli da 0° a 90°.',
        price: 209,
        specs: [
          { label: 'Alimentazione', value: '230V - 50/60Hz' },
          { label: 'Potenza', value: '130W' },
          { label: 'Lama', value: '150 mm (taglio utile)' },
        ],
      },
    ],
  },
  {
    id: 'fibercut',
    name: 'Fiber Cut',
    subtitle: 'Taglierina professionale per fibre minerali e lane di vetro',
    products: [
      {
        code: 'FIBERCUT 120-20',
        name: 'Fiber Cut 1200/20',
        description: 'Taglierina innovativa per pannelli in fibre minerali, lane di vetro ed espansi. Sistema a ganascia, barra bloccalastra, arco di taglio.',
        price: 1299,
        specs: [
          { label: 'Misura max. taglio', value: '1280 mm' },
          { label: 'Profondita taglio', value: '235 mm' },
          { label: 'Dimensioni', value: '1750x416x200 mm' },
          { label: 'Peso', value: '21 kg' },
        ],
        badge: 'Novita',
      },
    ],
  },
  {
    id: 'termolight',
    name: 'Termolight',
    subtitle: 'Termoventilatore professionale per imbianchini e decoratori',
    products: [
      {
        code: 'TMLIGHT',
        name: 'Termolight (con cavalletto)',
        description: 'Termoventilatore professionale per asciugatura rapida. 1600 m3/h, ricicla aria 22 volte/ora. 2 lampade professionali, centralina umidita.',
        price: 495,
        specs: [
          { label: 'Potenza', value: '2025 W' },
          { label: 'Metri cubi/h', value: '1600' },
          { label: 'Kilo calorie', value: '1800' },
          { label: 'Alimentazione', value: '220/230V 50Hz' },
          { label: 'Peso', value: '5 kg' },
        ],
      },
      {
        code: 'TMLIGHT S/C',
        name: 'Termolight (senza cavalletto)',
        description: 'Termoventilatore professionale senza cavalletto di sostegno.',
        price: 410,
      },
    ],
  },
  {
    id: 'blender',
    name: 'Blender GLOS',
    subtitle: 'Miscelatore professionale brevettato per vernici ad acqua',
    note: 'Prezzo su richiesta - Contattaci per un preventivo personalizzato',
    products: [
      {
        code: 'BLENDER GLOS',
        name: 'Blender GLOS',
        description: 'Miscelatore professionale a colonna con tecnologia brevettata Mix Glos System. Rotazione alternata a velocita variabile. Non ingloba aria. Fino a 150 secchi/giorno.',
        price: 0,
        specs: [
          { label: 'Alimentazione', value: '230V / 50-60Hz' },
          { label: 'Aria compressa', value: '350 L/min' },
          { label: 'Potenza standard', value: '0,55 kW (1400 rpm)' },
          { label: 'Potenza ovali', value: '0,75 kW (2800 rpm)' },
          { label: 'Dimensioni', value: '1750x500x1000 mm' },
          { label: 'Peso', value: '120 kg' },
          { label: 'Contenitori', value: 'Plastica / Metallo / Tondi / Ovali' },
          { label: 'Capacita max', value: '14 L / 25 kg' },
        ],
        badge: 'Brevettato',
      },
    ],
  },
  {
    id: 'washstation',
    name: 'Wash Station',
    subtitle: 'Stazione di lavaggio eco-compatibile per materiali ad acqua',
    note: 'Prezzo su richiesta - Contattaci per un preventivo personalizzato',
    products: [
      {
        code: 'WASH STATION',
        name: 'GLOS Wash Station',
        description: 'Stazione di lavaggio rapida, sicura e facile da usare. Eco-compatibile, ideale per pulitura di oggetti a contatto con materiali a base acquosa.',
        price: 0,
        specs: [
          { label: 'Ingombro', value: 'H.1460 - \u00d8570 - P 415 mm' },
          { label: 'Peso', value: '35 kg' },
          { label: 'Capienza H2O', value: '30 litri' },
          { label: 'Funzionamento', value: 'Manuale' },
          { label: 'Alimentazione', value: 'Aria compressa 350 L/min' },
        ],
        badge: 'Eco',
      },
    ],
  },
  {
    id: 'accessori',
    name: 'Accessori e Ricambi',
    subtitle: 'Componenti, ricambi e accessori per tutti i prodotti GLOS',
    products: [
      {
        code: 'TRASFORMATORE',
        name: 'Trasformatore universale',
        description: 'Trasformatore universale per taglierine Policut.',
        price: 143,
      },
      {
        code: 'CAVABASIC',
        name: 'Cavalletto Serie Basic',
        description: 'Cavalletto smontabile per taglierine Serie Basic.',
        price: 179,
      },
      {
        code: 'CAVALLETTO',
        name: 'Cavalletto Termolight',
        description: 'Cavalletto di sostegno per termolampada Termolight.',
        price: 159,
      },
      {
        code: 'FIBERLAMA 40',
        name: 'Coltello Fiber Cut',
        description: 'Coltello per lane minerali, ricambio per Fiber Cut.',
        price: 61.3,
      },
      {
        code: 'PICCHIO12',
        name: 'Picchio 12',
        description: 'Scrostatore ad aghi con attacco universale SDS. Per ferro, calcestruzzo, marmo e legno.',
        price: 135,
      },
      {
        code: 'PICCHIO19',
        name: 'Picchio 19',
        description: 'Scrostatore ad aghi grande, attacco universale SDS.',
        price: 243,
      },
      {
        code: 'PICCHIO12R',
        name: 'Ricambio Picchio 12',
        description: 'Aghi di ricambio per Picchio 12.',
        price: 44.7,
      },
      {
        code: 'PICCHIO19R',
        name: 'Ricambio Picchio 19',
        description: 'Aghi di ricambio per Picchio 19.',
        price: 58,
      },
      {
        code: 'BISELLO1',
        name: 'Slitta inox per incassi e tracce',
        description: 'Accessorio Hot Knife per incassi e tracce su EPS.',
        price: 119,
      },
      {
        code: 'BISELLO2',
        name: 'Slitta inox per fori ciechi',
        description: 'Accessorio Hot Knife per fori ciechi su EPS.',
        price: 88,
      },
      {
        code: 'BISELKIT2',
        name: 'Kit elettrodi incassi/tracce',
        description: 'Set elettrodi per Hot Knife, incassi e tracce.',
        price: 29,
      },
      {
        code: 'BISELKIT3',
        name: 'Kit elettrodi fori ciechi',
        description: 'Set elettrodi per Hot Knife, fori ciechi.',
        price: 21,
      },
      {
        code: 'BISELAMA 150',
        name: 'Lama di ricambio 150mm',
        description: 'Lama di ricambio per Hot Knife 150mm.',
        price: 36,
      },
      {
        code: 'BISELAMA 200',
        name: 'Lama di ricambio 200mm',
        description: 'Lama di ricambio per Hot Knife 200mm.',
        price: 47,
      },
    ],
  },
  {
    id: 'filo',
    name: 'Filo di Ricambio',
    subtitle: 'Filo di ricambio per tutte le taglierine Policut',
    products: [
      {
        code: 'FILO 1200 / FILO 1000',
        name: 'Filo per Policut 1200 e 1000 (prima serie)',
        description: 'Filo di ricambio per Policut 1200 e 1000 prima serie.',
        price: 12.1,
      },
      {
        code: 'FILO 1200 GAMMA',
        name: 'Filo per Twin Gamma / Easy 1000/1200 (seconda serie)',
        description: 'Filo di ricambio per Twin Gamma, Gamma Easy 1000 e 1200.',
        price: 12.1,
      },
      {
        code: 'FILO DELTA',
        name: 'Filo per Twin Basic / Easy Basic (terza serie)',
        description: 'Filo di ricambio per Twin Basic, Easy Basic 1200, Policut 1200, Easy 1000.',
        price: 12.1,
      },
      {
        code: 'BOB FIL.08MT20',
        name: 'Bobina filo 20 metri',
        description: 'Bobina filo di ricambio diam. 0,8 e 0,6 per taglierine, 20 metri.',
        price: 66,
      },
      {
        code: 'BOB FIL.08MT30',
        name: 'Bobina filo 30 metri',
        description: 'Bobina filo di ricambio diam. 0,8 e 0,6 per taglierine, 30 metri.',
        price: 77,
      },
    ],
  },
]

// ======================================================
// NAVIGATION ITEMS (sidebar)
// ======================================================

const navItems = categories.map((cat) => ({
  id: cat.id,
  label: cat.name,
  count: cat.products.length,
}))

// ======================================================
// FORMAT HELPERS
// ======================================================

function formatPrice(price: number): string {
  if (price === 0) return 'Su richiesta'
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price)
}

// ======================================================
// COMPONENT
// ======================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: MOTION.STAGGER.FAST },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: MOTION.DURATION.NORMAL } },
}

export default function ListinoPrezziClient() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredCategories = activeCategory
    ? categories.filter((c) => c.id === activeCategory)
    : categories

  const scrollToCategory = (id: string) => {
    setActiveCategory(null)
    setTimeout(() => {
      const el = document.getElementById(`cat-${id}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container-glos py-16 md:py-24 relative z-10">
          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ duration: MOTION.DURATION.SLOW }}
            className="text-center max-w-4xl mx-auto"
          >
            <p className="text-blue-300 uppercase tracking-widest text-sm font-semibold mb-4">
              Catalogo Ufficiale GLOS
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Listino Prezzi
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Tutti i prodotti GLOS con specifiche tecniche e prezzi.
              Attrezzature professionali Made in Italy per edilizia, industria e settore del colore.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                Prezzi IVA esclusa
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                Trasporto escluso
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                Porto franco da 500,00
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NAVIGATION BAR */}
      <div className="sticky top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-glos">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === null
                  ? 'bg-[#0047AB] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tutti
            </button>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  activeCategory === item.id
                    ? setActiveCategory(null)
                    : setActiveCategory(item.id)
                }
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === item.id
                    ? 'bg-[#0047AB] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CATALOG CONTENT */}
      <div className="bg-gray-50 min-h-screen">
        <div className="container-glos py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* SIDEBAR - Desktop only */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 bg-white rounded-xl shadow-md p-6 space-y-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Categorie
                </h3>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToCategory(item.id)}
                    className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-sm hover:bg-blue-50 hover:text-[#0047AB] transition-colors group"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-gray-400 group-hover:text-[#0047AB]">
                      {item.count}
                    </span>
                  </button>
                ))}
                <hr className="my-4" />
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Prezzi al pezzo, IVA e trasporto esclusi.</p>
                  <p>Porto franco da &euro; 500,00 netti.</p>
                  <p>Sotto &euro; 500: contributo trasporto &euro; 15,00.</p>
                </div>
                <hr className="my-4" />
                <Link
                  href="/contatti"
                  className="block w-full text-center px-4 py-3 bg-[#0047AB] text-white rounded-lg text-sm font-semibold hover:bg-[#003380] transition-colors"
                >
                  Richiedi Preventivo
                </Link>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="lg:col-span-3 space-y-12">
              {filteredCategories.map((category) => (
                <motion.section
                  key={category.id}
                  id={`cat-${category.id}`}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="scroll-mt-24"
                >
                  {/* Category Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                      {category.name}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {category.subtitle}
                    </p>
                    {category.note && (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                        {category.note}
                      </div>
                    )}
                  </div>

                  {/* Products Grid */}
                  <div className="space-y-4">
                    {category.products.map((product) => (
                      <motion.div
                        key={product.code}
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-5 md:p-6">
                          {/* Product Header */}
                          <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg font-bold text-gray-900">
                                  {product.name}
                                </h3>
                                {product.badge && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                    {product.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 font-mono mt-0.5">
                                Cod. {product.code}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {product.price > 0 ? (
                                <p className="text-2xl font-bold text-[#0047AB]">
                                  {formatPrice(product.price)}
                                </p>
                              ) : (
                                <Link
                                  href="/contatti"
                                  className="inline-flex items-center gap-1 px-4 py-2 bg-[#0047AB] text-white rounded-lg text-sm font-semibold hover:bg-[#003380] transition-colors"
                                >
                                  Richiedi Prezzo
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          {product.description && (
                            <p className="text-sm text-gray-600 mb-4">
                              {product.description}
                            </p>
                          )}

                          {/* Specs */}
                          {product.specs && product.specs.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {product.specs.map((spec) => (
                                <div
                                  key={spec.label}
                                  className="bg-gray-50 rounded-lg px-3 py-2"
                                >
                                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                                    {spec.label}
                                  </p>
                                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                    {spec.value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ))}

              {/* CONDITIONS */}
              <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Condizioni di Vendita
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Prezzi</h3>
                    <p>
                      Tutti i prezzi di listino si intendono al pezzo, IVA e
                      trasporto esclusi.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Trasporto
                    </h3>
                    <p>
                      Porto franco da &euro; 500,00 netti. Per importi inferiori:
                      contributo trasporto &euro; 15,00.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Merce difettosa
                    </h3>
                    <p>
                      Qualsiasi difetto o mancanza deve essere comunicato per
                      iscritto entro 8 giorni dalla consegna.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Pagamenti
                    </h3>
                    <p>
                      In caso di ritardo si applicano interessi di mora (D.Lgs.
                      231/02). Le merci restano di proprieta del fornitore fino a
                      totale pagamento.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    GL.OS Srl - Via Basilicata, 16 - 42028 Poviglio (RE) - Italia
                    | Tel. +39 0522 967690 | info@glos.it | C.F./P.IVA
                    02915060350
                  </p>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>

      {/* CTA BOTTOM */}
      <section className="bg-gradient-to-r from-[#0047AB] to-[#003380] text-white py-16">
        <div className="container-glos text-center">
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.animate}
            viewport={{ once: true }}
            transition={{ duration: MOTION.DURATION.SLOW }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hai bisogno di un preventivo personalizzato?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Contattaci per offerte su grandi quantita, configurazioni speciali
              o per richiedere il prezzo di Blender GLOS e Wash Station.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contatti"
                className="px-8 py-4 bg-white text-[#0047AB] rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Contattaci
              </Link>
              <a
                href="tel:+390522967690"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-lg font-bold text-lg hover:bg-white/20 transition-colors"
              >
                +39 0522 967690
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
