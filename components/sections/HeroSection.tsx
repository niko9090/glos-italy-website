// Hero Section Component
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity/client'
import { t, defaultLocale } from '@/lib/i18n'

interface HeroSectionProps {
  data: {
    title?: { it?: string; en?: string; es?: string }
    subtitle?: { it?: string; en?: string; es?: string }
    backgroundImage?: any
    primaryButton?: {
      text?: { it?: string; en?: string; es?: string }
      link?: string
    }
    secondaryButton?: {
      text?: { it?: string; en?: string; es?: string }
      link?: string
    }
    layout?: 'centered' | 'left' | 'split'
  }
}

export default function HeroSection({ data }: HeroSectionProps) {
  const locale = defaultLocale
  const title = t(data.title, locale)
  const subtitle = t(data.subtitle, locale)
  const primaryButtonText = t(data.primaryButton?.text, locale)
  const secondaryButtonText = t(data.secondaryButton?.text, locale)

  const backgroundUrl = data.backgroundImage
    ? urlFor(data.backgroundImage).width(1920).quality(85).url()
    : null

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Image */}
      {backgroundUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundUrl}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        </div>
      )}

      {/* Fallback gradient background */}
      {!backgroundUrl && (
        <div className="absolute inset-0 bg-gradient-primary z-0" />
      )}

      {/* Content */}
      <div className="container-glos relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`max-w-3xl ${
            data.layout === 'centered' ? 'mx-auto text-center' : ''
          }`}
        >
          {title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Buttons */}
          <div className={`flex gap-4 flex-wrap ${
            data.layout === 'centered' ? 'justify-center' : ''
          }`}>
            {primaryButtonText && data.primaryButton?.link && (
              <Link href={data.primaryButton.link} className="btn-primary">
                {primaryButtonText}
              </Link>
            )}

            {secondaryButtonText && data.secondaryButton?.link && (
              <Link
                href={data.secondaryButton.link}
                className="btn bg-white/10 text-white border-2 border-white hover:bg-white hover:text-primary"
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
