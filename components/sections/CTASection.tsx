// CTA Section Component
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { getTextValue } from '@/lib/utils/textHelpers'

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
          {getTextValue(data.title) && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {getTextValue(data.title)}
            </h2>
          )}

          {getTextValue(data.subtitle) && (
            <p className="text-xl mb-8 opacity-90">
              {getTextValue(data.subtitle)}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            {getTextValue(data.buttonText) && data.buttonLink && (
              <Link
                href={data.buttonLink}
                className="btn bg-white text-primary hover:bg-gray-100"
              >
                {getTextValue(data.buttonText)}
              </Link>
            )}
          </div>

          {data.phone && (
            <div className="mt-8">
              <a
                href={`tel:${data.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 text-lg font-medium"
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
