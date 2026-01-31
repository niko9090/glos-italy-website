// CTA Section Component
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface CTASectionProps {
  data: {
    title?: string
    subtitle?: string
    buttonText?: string
    buttonLink?: string
    phone?: string
    backgroundColor?: 'blue' | 'dark' | 'light'
  }
}

export default function CTASection({ data }: CTASectionProps) {
  const { t } = useLanguage()
  const bgClasses = {
    blue: 'bg-primary text-white',
    dark: 'bg-gray-900 text-white',
    light: 'bg-gray-100 text-gray-900',
  }

  const bgClass = bgClasses[data.backgroundColor || 'blue']

  return (
    <section className={`py-20 ${bgClass}`}>
      <div className="container-glos">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <RichText value={data.title} />
          </h2>

          <div className="text-xl mb-8 opacity-90">
            <RichText value={data.subtitle} />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {t(data.buttonText) && data.buttonLink && (
              <Link
                href={data.buttonLink}
                className="btn bg-white text-primary hover:bg-gray-100"
              >
                {t(data.buttonText)}
              </Link>
            )}
          </div>

          {data.phone && (
            <div className="mt-8">
              <a
                href={`tel:${t(data.phone).replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 text-lg font-medium"
              >
                <Phone className="w-5 h-5" />
                {t(data.phone)}
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
