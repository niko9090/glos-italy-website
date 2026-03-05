// VARIANTE 2: Pattern geometrico industriale con mesh gradient
// Effetto: griglia tecnica animata + sfere gradient fluttuanti
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function ProductsHeroVariant2() {
  return (
    <section className="relative overflow-hidden min-h-[50vh] lg:min-h-[60vh] flex items-center">
      {/* Background base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f2744] to-[#1a365d]" />

      {/* Immagine di sfondo con bassa opacità */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-fluid-art.jpg"
          alt=""
          fill
          className="object-cover opacity-15 mix-blend-overlay"
          priority
        />
      </div>

      {/* Pattern griglia tecnica */}
      <div className="absolute inset-0 z-[1]">
        <svg className="w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Sfere gradient fluttuanti (mesh gradient effect) */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        {/* Sfera grande in alto a destra */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
            top: '-10%',
            right: '-5%',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Sfera media in basso a sinistra */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 70%)',
            bottom: '-15%',
            left: '-5%',
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* Sfera piccola centrale */}
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: ['-50%', '-48%', '-50%'],
            y: ['-50%', '-52%', '-50%'],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Linee diagonali decorative */}
      <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none">
        <motion.div
          className="absolute h-[1px] w-[200%] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"
          style={{ top: '30%', left: '-50%', transform: 'rotate(-15deg)' }}
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute h-[1px] w-[200%] bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent"
          style={{ top: '60%', left: '-50%', transform: 'rotate(-15deg)' }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Overlay per leggibilità */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/50 via-transparent to-[#0a1628]/30 z-[4]" />

      {/* Contenuto */}
      <div className="container-glos relative z-10 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.p
            className="text-cyan-300 uppercase tracking-widest text-sm font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Catalogo Completo
          </motion.p>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            style={{ textShadow: '0 4px 30px rgba(59, 130, 246, 0.3)' }}
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
        </motion.div>
      </div>

      {/* Border glow bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent z-[5]" />
    </section>
  )
}
