// CTA Section Component
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { urlFor } from '@/lib/sanity/client'
import { t, defaultLocale } from '@/lib/i18n'

interface CTASectionProps {
  data: {
    title?: { it?: string; en?: string; es?: string }
    subtitle?: { it?: string; en?: string; es?: string }
    primaryButton?: {
      text?: { it?: string; en?: string; es?: string }
      link?: string
    }
    secondaryButton?: {
      text?: { it?: string; en?: string; es?: string }
      link?: string
    }
    phone?: string
    backgroundImage?: any
    backgroundColor?: 'blue' | 'dark' | 'light' | 'gradient'
  }
}

export default function CTASection({ data }: CTASectionProps) {
  const locale = defaultLocale

  const bgClasses = {
    blue: 'bg-primary text-white',
    dark: 'bg-gray-900 text-white',
    light: 'bg-gray-100 text-gray-900',
    gradient: 'bg-gradient-to-r from-primary to-primary-light text-white',
  }

  const bgClass = bgClasses[data.backgroundColor || 'blue']
  const hasBackgroundImage = !!data.backgroundImage

  return (
    <section className={`relative py-20 overflow-hidden ${!hasBackgroundImage ? bgClass : ''}`}>
      {/* Background Image */}
      {hasBackgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={urlFor(data.backgroundImage).width(1920).url()}
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-primary/80 z-0" />
        </>
      )}

      <div className="container-glos relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          {data.title && (
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${hasBackgroundImage ? 'text-white' : ''}`}>
              {t(data.title, locale)}
            </h2>
          )}

          {data.subtitle && (
            <p className={`text-xl mb-8 opacity-90 ${hasBackgroundImage ? 'text-white' : ''}`}>
              {t(data.subtitle, locale)}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {data.primaryButton?.text && data.primaryButton?.link && (
              <Link
                href={data.primaryButton.link}
                className="btn bg-white text-primary hover:bg-gray-100"
              >
                {t(data.primaryButton.text, locale)}
              </Link>
            )}

            {data.secondaryButton?.text && data.secondaryButton?.link && (
              <Link
                href={data.secondaryButton.link}
                className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
              >
                {t(data.secondaryButton.text, locale)}
              </Link>
            )}
          </div>

          {/* Phone */}
          {data.phone && (
            <div className="mt-8">
              <a
                href={`tel:${data.phone.replace(/\s/g, '')}`}
                className={`inline-flex items-center gap-2 text-lg font-medium ${hasBackgroundImage ? 'text-white' : ''}`}
              >
                <Phone className="w-5 h-5" />
                {data.phone}
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
