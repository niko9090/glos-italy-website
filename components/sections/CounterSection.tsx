// Counter Section Component - Animated counters that count up when scrolled into view
'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'
import {
  MOTION,
  staggerContainer,
  staggerItem,
  fadeInUp,
} from '@/lib/animations/config'
import * as LucideIcons from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

interface LocalizedString {
  it?: string
  en?: string
  es?: string
}

interface CounterItem {
  _key: string
  number: number
  prefix?: string
  suffix?: string
  label: LocalizedString
  icon?: string
  color?: string
}

interface CounterSectionData {
  _type: 'counterSection'
  title?: LocalizedString
  subtitle?: LocalizedString
  counters?: CounterItem[]
  layout?: 'row' | 'grid-2' | 'grid-3' | 'grid-4'
  backgroundColor?: string
  textColor?: 'light' | 'dark'
  paddingY?: 'none' | 'small' | 'medium' | 'large'
  animationDuration?: number
}

interface CounterSectionProps {
  documentId?: string
  sectionKey?: string
  data: CounterSectionData
}

// ============================================================================
// Custom Hook: useCountUp
// ============================================================================

function useCountUp(
  target: number,
  duration: number = 2000,
  isInView: boolean = false
): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) {
      setCount(0)
      return
    }

    const startTime = Date.now()
    let animationFrame: number

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(target * easeOut)

      setCount(currentValue)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [target, duration, isInView])

  return count
}

// ============================================================================
// Utility: Get Lucide Icon Component
// ============================================================================

function getLucideIcon(iconName?: string): React.ComponentType<{ className?: string }> | null {
  if (!iconName) return null

  // Convert icon name formats: "trending-up" -> "TrendingUp", "users" -> "Users"
  const pascalCase = iconName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')

  // Cast through unknown to avoid TypeScript error with lucide-react exports
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>
  const IconComponent = icons[pascalCase]

  // Verify it's a valid component (function) before returning
  if (typeof IconComponent === 'function') {
    return IconComponent
  }
  return null
}

// ============================================================================
// Animated Counter Component
// ============================================================================

interface AnimatedCounterProps {
  number: number
  prefix?: string
  suffix?: string
  duration: number
  isInView: boolean
}

function AnimatedCounter({ number, prefix, suffix, duration, isInView }: AnimatedCounterProps) {
  const count = useCountUp(number, duration, isInView)

  return (
    <span className="tabular-nums">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

// ============================================================================
// Single Counter Item Component
// ============================================================================

interface CounterItemComponentProps {
  counter: CounterItem
  duration: number
  isInView: boolean
  textColorClass: string
  lang: string
}

function CounterItemComponent({
  counter,
  duration,
  isInView,
  textColorClass,
  lang,
}: CounterItemComponentProps) {
  const IconComponent = getLucideIcon(counter.icon)
  const label = counter.label?.[lang as keyof LocalizedString] || counter.label?.it || ''

  // Color classes for icon background
  const colorClasses: Record<string, { bg: string; text: string }> = {
    primary: { bg: 'bg-primary/10', text: 'text-primary' },
    secondary: { bg: 'bg-secondary/20', text: 'text-secondary' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
  }

  const iconColor = colorClasses[counter.color || 'primary'] || colorClasses.primary

  return (
    <motion.div
      variants={staggerItem}
      className="group text-center"
    >
      {/* Icon */}
      {IconComponent && (
        <motion.div
          className="mb-4 inline-flex"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <span
            className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${iconColor.bg} ${iconColor.text} transition-all duration-300 group-hover:scale-110`}
          >
            <IconComponent className="w-8 h-8" />
          </span>
        </motion.div>
      )}

      {/* Number */}
      <div className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-2 ${textColorClass}`}>
        <AnimatedCounter
          number={counter.number}
          prefix={counter.prefix}
          suffix={counter.suffix}
          duration={duration}
          isInView={isInView}
        />
      </div>

      {/* Label */}
      {label && (
        <p className={`text-base md:text-lg opacity-80 ${textColorClass}`}>
          {label}
        </p>
      )}

      {/* Decorative underline on hover */}
      <div className="mt-4 mx-auto w-12 h-1 bg-current opacity-30 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function CounterSection({ data, documentId, sectionKey }: CounterSectionProps) {
  const { language } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // Get localized text values
  const getLocalizedText = (value?: LocalizedString): string => {
    if (!value) return ''
    return value[language as keyof LocalizedString] || value.it || ''
  }

  const title = getLocalizedText(data.title)
  const subtitle = getLocalizedText(data.subtitle)

  // Animation duration - schema stores seconds (e.g. 2), convert to ms
  const animationDuration = data.animationDuration
    ? data.animationDuration <= 10 ? data.animationDuration * 1000 : data.animationDuration
    : 2000

  // Background classes
  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    gray: 'bg-gray-100',
    dark: 'bg-gray-900',
    primary: 'bg-primary',
    'gradient-blue': 'bg-gradient-to-br from-primary via-primary-dark to-blue-900',
    'gradient-dark': 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
  }

  // Text color based on background or explicit setting
  const getTextColorClass = (): string => {
    if (data.textColor === 'light') return 'text-white'
    if (data.textColor === 'dark') return 'text-gray-900'
    // Auto-detect based on background
    const darkBgs = ['dark', 'primary', 'gradient-blue', 'gradient-dark']
    return darkBgs.includes(data.backgroundColor || 'white') ? 'text-white' : 'text-gray-900'
  }

  // Padding classes
  const paddingClasses: Record<string, string> = {
    none: 'py-0',
    small: 'py-8 md:py-12',
    medium: 'py-12 md:py-16',
    large: 'py-16 md:py-24',
  }

  // Layout/grid classes
  const layoutClasses: Record<string, string> = {
    row: 'flex flex-wrap justify-center gap-8 md:gap-16',
    'grid-2': 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12',
    'grid-3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12',
    'grid-4': 'grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12',
  }

  const bgClass = bgClasses[data.backgroundColor || 'white'] || 'bg-white'
  const textColorClass = getTextColorClass()
  const paddingClass = paddingClasses[data.paddingY || 'large']
  const layoutClass = layoutClasses[data.layout || 'grid-4']

  // Container animation variants with stagger
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: MOTION.STAGGER.NORMAL,
          delayChildren: 0.2,
        },
      },
    }),
    []
  )

  // Don't render if no counters
  if (!data.counters || data.counters.length === 0) {
    return null
  }

  return (
    <section
      data-sanity-edit-target
      ref={sectionRef}
      className={`relative overflow-hidden ${paddingClass} ${bgClass}`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-current opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-current opacity-5 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="container-glos relative z-10">
        {/* Section Header */}
        {(title || subtitle) && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={MOTION.VIEWPORT.ONCE}
            transition={{
              duration: MOTION.DURATION.SLOW,
              ease: MOTION.EASE.OUT,
            }}
            className="text-center mb-12"
          >
            {title && (
              <h2 className={`section-title mb-4 ${textColorClass}`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`text-xl opacity-80 max-w-2xl mx-auto ${textColorClass}`}>
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Counters Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={MOTION.VIEWPORT.ONCE}
          className={layoutClass}
        >
          {data.counters.map((counter) => (
            <CounterItemComponent
              key={counter._key}
              counter={counter}
              duration={animationDuration}
              isInView={isInView}
              textColorClass={textColorClass}
              lang={language}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
