'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Award, Users, Wrench, Target, Shield, Lightbulb } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
}

const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
}

const values = [
  {
    icon: Target,
    title: 'Precisione',
    description: 'Ogni componente è progettato con tolleranze millimetriche per garantire prestazioni costanti.',
  },
  {
    icon: Shield,
    title: 'Affidabilità',
    description: 'Macchinari costruiti per durare nel tempo, con materiali di prima qualità certificati.',
  },
  {
    icon: Lightbulb,
    title: 'Innovazione',
    description: 'Ricerca continua per sviluppare soluzioni che anticipano le esigenze del mercato.',
  },
]

export default function ChiSiamoClient() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/industrial-precision.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/90 to-[#0f3460]/70" />

        <div className="container-glos py-20 md:py-28 relative z-10">
          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <p className="text-blue-300 uppercase tracking-widest text-sm font-semibold mb-4">
              La Nostra Storia
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              GL.OS: Ingegneria Meccanica e Innovazione{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Made in Italy
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Dal cuore della Motor Valley, progettiamo e produciamo macchinari
              che definiscono gli standard del settore.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-glos">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={fadeInLeft.initial}
              whileInView={fadeInLeft.animate}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  La Nostra Vision
                </h2>
              </div>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Nel cuore della <strong className="text-gray-900">Motor Valley</strong>, a Reggio Emilia,
                  nasce nel 2005 GL.OS - un&apos;azienda che trasforma l&apos;ingegneria meccanica in arte industriale.
                </p>
                <p>
                  Qui, dove <strong className="text-gray-900">Ferrari, Lamborghini e Ducati</strong> hanno
                  scritto la storia dell&apos;eccellenza italiana, GL.OS porta la stessa passione e precisione
                  nel settore delle vernici e dei rivestimenti.
                </p>
                <p>
                  Progettiamo e produciamo macchinari che non si limitano a funzionare:
                  <strong className="text-gray-900"> performano con l&apos;affidabilità</strong> che solo
                  il Made in Italy sa garantire.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">🇮🇹</div>
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">RE</div>
                </div>
                <span className="text-sm text-gray-500">Reggio Emilia, Italia</span>
              </div>
            </motion.div>

            {/* Images Grid */}
            <motion.div
              initial={fadeInRight.initial}
              whileInView={fadeInRight.animate}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/glos-blender.jpg"
                    alt="Blender GLOS"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/glos-blender-lavorazioni.jpg"
                    alt="Lavorazioni GLOS"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/products/blender-glos.jpg"
                    alt="Blender GLOS dettaglio"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/glos-blender-console.jpg"
                    alt="Console Blender"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-glos">
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">I Nostri Valori</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              I principi che guidano ogni nostra decisione, dalla progettazione alla produzione.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-glos">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={fadeInLeft.initial}
              whileInView={fadeInLeft.animate}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/products/blender-combinazione.jpg"
                  alt="Combinazione Blender GLOS"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 text-white">
                    <Award className="w-8 h-8" />
                    <div>
                      <div className="font-bold">Brevetti Registrati</div>
                      <div className="text-sm text-white/80">Innovazione protetta</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 max-w-[200px] hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Precisione</div>
                    <div className="text-sm text-gray-500">Industriale</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={fadeInRight.initial}
              whileInView={fadeInRight.animate}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Il Nostro Metodo
                </h2>
              </div>

              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Dietro ogni macchina GL.OS c&apos;è la visione di <strong className="text-gray-900">Leonardo Ceci</strong>,
                  ingegnere e fondatore che ha trasformato problemi industriali in soluzioni brevettate.
                </p>
                <p>
                  Dal <strong className="text-gray-900">Policut</strong> al <strong className="text-gray-900">Blender</strong>,
                  ogni prodotto nasce da un&apos;esigenza reale del mercato, sviluppata con rigore ingegneristico
                  e perfezionata attraverso anni di feedback dai professionisti del settore.
                </p>
              </div>

              {/* Features list */}
              <div className="mt-8 space-y-4">
                {[
                  'Progettazione interna con software CAD 3D',
                  'Prototipazione rapida e test sul campo',
                  'Materiali di alta qualità certificati',
                  'Assistenza tecnica dedicata',
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-[#003380] text-white">
        <div className="container-glos text-center">
          <motion.div
            initial={fadeInUp.initial}
            whileInView={fadeInUp.animate}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vuoi saperne di più?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Contattaci per una consulenza personalizzata o per richiedere un preventivo.
              Il nostro team è a tua disposizione.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contatti"
                className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Contattaci
              </Link>
              <a
                href="tel:+390522967690"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/20 transition-colors"
              >
                +39 0522 967690
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
