// Stats Section Component
'use client'

import { motion } from 'framer-motion'
import { t, defaultLocale } from '@/lib/i18n'

interface StatsSectionProps {
  data: {
    items?: Array<{
      _key: string
      number?: string
      label?: { it?: string; en?: string; es?: string }
      description?: { it?: string; en?: string; es?: string }
    }>
    backgroundColor?: string
  }
}

export default function StatsSection({ data }: StatsSectionProps) {
  const locale = defaultLocale

  const bgClasses = {
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
    blue: 'bg-primary text-white',
  }

  const bgClass = bgClasses[data.backgroundColor as keyof typeof bgClasses] || bgClasses.light

  return (
    <section className={`section ${bgClass}`}>
      <div className="container-glos">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.items?.map((stat, index) => (
            <motion.div
              key={stat._key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-medium mb-1">
                {t(stat.label, locale)}
              </div>
              {stat.description && (
                <div className="text-sm opacity-75">
                  {t(stat.description, locale)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
