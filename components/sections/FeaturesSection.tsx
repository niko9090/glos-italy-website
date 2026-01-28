// Features Section Component
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Check, Star, Shield, Award, Zap, Heart } from 'lucide-react'
import { urlFor } from '@/lib/sanity/client'
import { t, defaultLocale } from '@/lib/i18n'

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  check: Check,
  star: Star,
  shield: Shield,
  award: Award,
  zap: Zap,
  heart: Heart,
}

interface FeaturesSectionProps {
  data: {
    sectionLabel?: { it?: string; en?: string; es?: string }
    title?: { it?: string; en?: string; es?: string }
    subtitle?: { it?: string; en?: string; es?: string }
    image?: any
    items?: Array<{
      _key: string
      icon?: string
      title?: { it?: string; en?: string; es?: string }
      description?: { it?: string; en?: string; es?: string }
    }>
  }
}

export default function FeaturesSection({ data }: FeaturesSectionProps) {
  const locale = defaultLocale

  return (
    <section className="section bg-gray-50">
      <div className="container-glos">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          {data.image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src={urlFor(data.image).width(800).height(600).url()}
                alt=""
                fill
                className="object-cover"
              />
            </motion.div>
          )}

          {/* Content */}
          <div>
            {data.sectionLabel && (
              <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                {t(data.sectionLabel, locale)}
              </span>
            )}

            {data.title && (
              <h2 className="section-title mb-4">{t(data.title, locale)}</h2>
            )}

            {data.subtitle && (
              <p className="section-subtitle mb-8">{t(data.subtitle, locale)}</p>
            )}

            {/* Features List */}
            <div className="space-y-6">
              {data.items?.map((item, index) => {
                const Icon = iconMap[item.icon || 'check'] || Check

                return (
                  <motion.div
                    key={item._key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {t(item.title, locale)}
                      </h3>
                      <p className="text-gray-600">
                        {t(item.description, locale)}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
