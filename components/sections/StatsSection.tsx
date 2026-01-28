// Stats Section Component with Animated Counters
'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
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

// Animated counter component
function AnimatedNumber({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [displayValue, setDisplayValue] = useState(0)

  // Extract numeric value and suffix from string like "500+" or "30"
  const numericMatch = value?.match(/^(\d+)(.*)$/)
  const targetNumber = numericMatch ? parseInt(numericMatch[1], 10) : 0
  const valueSuffix = numericMatch ? numericMatch[2] : suffix

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(targetNumber * easeOut)

      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(targetNumber)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, targetNumber])

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}
      {valueSuffix}
    </span>
  )
}

export default function StatsSection({ data }: StatsSectionProps) {
  const locale = defaultLocale

  const bgClasses = {
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
    blue: 'bg-primary text-white',
  }

  const bgClass = bgClasses[data.backgroundColor as keyof typeof bgClasses] || bgClasses.light

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <section className={`section ${bgClass} overflow-hidden`}>
      <div className="container-glos">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {data.items?.map((stat) => (
            <motion.div
              key={stat._key}
              variants={itemVariants}
              className="text-center group"
            >
              {/* Number with glow effect */}
              <div className="relative">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 transition-transform duration-300 group-hover:scale-110">
                  <AnimatedNumber value={stat.number || '0'} />
                </div>
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />
              </div>

              {/* Label */}
              <div className="text-lg md:text-xl font-semibold mb-1 opacity-90">
                {t(stat.label, locale)}
              </div>

              {/* Description */}
              {stat.description && (
                <div className="text-sm opacity-70 max-w-[200px] mx-auto">
                  {t(stat.description, locale)}
                </div>
              )}

              {/* Decorative underline */}
              <div className="mt-4 mx-auto w-12 h-1 bg-current opacity-30 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
