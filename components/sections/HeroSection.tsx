// Hero Section Component
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { urlFor } from '@/lib/sanity/client'
import { ArrowRight, ChevronDown } from 'lucide-react'

interface HeroSectionProps {
  data: {
    title?: string
    subtitle?: string
    buttonText?: string
    buttonLink?: string
    backgroundImage?: any
  }
}

export default function HeroSection({ data }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const backgroundUrl = data.backgroundImage
    ? urlFor(data.backgroundImage).width(1920).quality(85).url()
    : null

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Background */}
      {backgroundUrl && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <Image
            src={backgroundUrl}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </motion.div>
      )}

      {!backgroundUrl && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-primary-dark to-gray-900" />
      )}

      {/* Content */}
      <motion.div
        className="container-glos relative z-10 py-20"
        style={{ opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {data.title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {data.title}
            </h1>
          )}

          {data.subtitle && (
            <p className="text-xl md:text-2xl text-white/90 mb-10">
              {data.subtitle}
            </p>
          )}

          {data.buttonText && data.buttonLink && (
            <Link
              href={data.buttonLink}
              className="btn-primary inline-flex items-center gap-2"
            >
              {data.buttonText}
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/60"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.div>
    </section>
  )
}
