// VARIANTE 1: Due immagini fuse orizzontalmente (stile homepage)
// Effetto: texture vernice sinistra + fluida destra con fusione centrale
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function ProductsHeroVariant1() {
  return (
    <section className="relative overflow-hidden min-h-[50vh] lg:min-h-[60vh] flex items-center">
      {/* Background: Due immagini fuse */}
      <div className="absolute inset-0 z-0">
        {/* Immagine sinistra - texture blu scuro */}
        <div className="absolute inset-0 w-1/2 left-0">
          <Image
            src="/images/hero-blue-texture-left.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          {/* Gradiente fusione verso destra */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a1628]" />
        </div>

        {/* Immagine destra - vernice fluida */}
        <div className="absolute inset-0 w-1/2 right-0 left-auto">
          <Image
            src="/images/hero-blue-texture-right.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          {/* Gradiente fusione verso sinistra */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0a1628]" />
        </div>

        {/* Overlay centrale per fusione armoniosa */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a1628]/60 to-transparent" />

        {/* Overlay generale per leggibilità testo */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/70 via-[#0a1628]/50 to-[#0a1628]/80" />
      </div>

      {/* Particelle decorative animate */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white/5"
            style={{
              width: `${30 + i * 20}px`,
              height: `${30 + i * 20}px`,
              left: `${15 + i * 18}%`,
              top: `${25 + i * 12}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Contenuto */}
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.4)' }}
          >
            I Nostri Prodotti
          </h1>
          <p className="text-xl text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
            Macchinari di precisione progettati e costruiti in Italia.
            Qualità, innovazione e affidabilità dal 2005.
          </p>
        </motion.div>
      </div>

      {/* Linea decorativa animata in basso */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent z-[2]"
        animate={{ scaleX: [0, 1, 0], x: ['-100%', '0%', '100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </section>
  )
}
