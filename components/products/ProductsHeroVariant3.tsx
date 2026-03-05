// VARIANTE 3: Split diagonale con due texture e particelle metalliche
// Effetto: divisione angolata + dots metallici fluttuanti + riflessi
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function ProductsHeroVariant3() {
  return (
    <section className="relative overflow-hidden min-h-[50vh] lg:min-h-[60vh] flex items-center">
      {/* Background: Split diagonale */}
      <div className="absolute inset-0 z-0">
        {/* Parte sinistra - texture marble gold */}
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 65% 0, 45% 100%, 0 100%)' }}>
          <Image
            src="/images/hero-marble-gold.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/85 to-[#0a1628]/70" />
        </div>

        {/* Parte destra - fluid art */}
        <div className="absolute inset-0" style={{ clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 40% 100%)' }}>
          <Image
            src="/images/hero-fluid-art.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-[#0a1628]/80 to-[#0a1628]/60" />
        </div>

        {/* Linea diagonale di separazione con glow */}
        <motion.div
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(105deg, transparent 49.5%, rgba(59,130,246,0.3) 49.5%, rgba(59,130,246,0.3) 50.5%, transparent 50.5%)',
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Overlay gradiente unificante */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/40 via-transparent to-[#0a1628]/60 z-[2]" />

      {/* Particelle metalliche fluttuanti */}
      <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${4 + (i % 4) * 2}px`,
              height: `${4 + (i % 4) * 2}px`,
              left: `${8 + i * 8}%`,
              top: `${15 + (i % 5) * 18}%`,
              background: i % 3 === 0
                ? 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)'
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0.2) 50%, transparent 100%)'
                : 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, rgba(251,191,36,0.1) 50%, transparent 100%)',
              boxShadow: i % 3 === 0
                ? '0 0 10px rgba(255,255,255,0.3)'
                : i % 3 === 1
                ? '0 0 8px rgba(59,130,246,0.4)'
                : '0 0 6px rgba(251,191,36,0.3)',
            }}
            animate={{
              y: [0, -15 - (i % 3) * 5, 0],
              x: [0, (i % 2 === 0 ? 5 : -5), 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + (i % 4),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Riflessi luminosi che si muovono */}
      <div className="absolute inset-0 z-[4] overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          }}
          animate={{
            x: ['10%', '80%', '10%'],
            y: ['20%', '60%', '20%'],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[200px] h-[200px] rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)',
          }}
          animate={{
            x: ['70%', '20%', '70%'],
            y: ['60%', '30%', '60%'],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </div>

      {/* Contenuto */}
      <div className="container-glos relative z-10 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-200 uppercase tracking-widest text-xs font-semibold">
              Catalogo Completo
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            style={{
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.5), 0 0 60px rgba(59, 130, 246, 0.2)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            I Nostri Prodotti
          </motion.h1>

          <motion.p
            className="text-xl text-blue-100/90 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Macchinari di precisione progettati e costruiti in Italia.
            Qualità, innovazione e affidabilità dal 2005.
          </motion.p>

          {/* Indicatori decorativi */}
          <motion.div
            className="flex justify-center gap-3 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-12 h-1 rounded-full ${i === 1 ? 'bg-blue-400' : 'bg-white/20'}`}
                animate={i === 1 ? { opacity: [0.6, 1, 0.6] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Border glow animato */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] z-[5]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), rgba(251,191,36,0.3), rgba(59,130,246,0.5), transparent)',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
    </section>
  )
}
