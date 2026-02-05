// Stats Section Component - VERSIONE AVANZATA
'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { getSpacingClasses } from '@/lib/utils/spacing'
import RichText from '@/components/RichText'

interface StatItem {
  _key: string
  number?: string
  prefix?: string
  suffix?: string
  label?: unknown
  description?: unknown
  icon?: string
  iconImage?: any
  color?: 'default' | 'primary' | 'secondary' | 'green' | 'orange' | 'red'
  link?: string
}

interface StatsSectionProps {
  documentId?: string
  sectionKey?: string
  data: {
    // Content
    title?: unknown
    subtitle?: unknown
    description?: unknown
    // Items
    items?: StatItem[]
    // Layout
    layout?: 'grid' | 'row' | 'icons' | 'cards' | 'circular' | 'vertical' | 'timeline'
    columns?: number
    alignment?: 'left' | 'center' | 'right'
    iconPosition?: 'top' | 'left' | 'right' | 'background' | 'hidden'
    dividers?: boolean
    // Style
    backgroundColor?: 'white' | 'gray' | 'dark' | 'primary' | 'gradient-blue' | 'gradient-dark' | 'image'
    backgroundImage?: any
    backgroundOverlay?: number
    textColor?: 'auto' | 'white' | 'black' | 'primary'
    numberSize?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
    numberWeight?: 'normal' | 'medium' | 'bold' | 'extrabold'
    cardStyle?: 'none' | 'elevated' | 'bordered' | 'glass' | 'gradient'
    // Spacing
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string // legacy
    marginTop?: string
    marginBottom?: string
    // Animation
    countAnimation?: boolean
    countDuration?: number
    entranceAnimation?: 'none' | 'fade' | 'fade-up' | 'zoom' | 'stagger' | 'bounce'
    hoverAnimation?: 'none' | 'scale' | 'glow' | 'lift' | 'color'
    showDecorations?: boolean
  }
}

// Animated counter component with bounce finish effect
function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  animate = true,
  duration = 2000,
  onComplete,
}: {
  value: string
  prefix?: string
  suffix?: string
  animate?: boolean
  duration?: number
  onComplete?: () => void
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [displayValue, setDisplayValue] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Extract numeric value from string like "500" or "30"
  const targetNumber = parseInt(value?.replace(/[^0-9]/g, '') || '0', 10)
  const originalSuffix = value?.replace(/[0-9]/g, '') || ''

  useEffect(() => {
    if (!isInView || !animate) {
      setDisplayValue(targetNumber)
      setIsComplete(true)
      return
    }

    const startTime = Date.now()

    const animateCount = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic with slight overshoot for bounce effect
      const easeOutBack = 1 - Math.pow(1 - progress, 3) * (1 + 0.3 * (1 - progress))
      const current = Math.floor(targetNumber * Math.min(easeOutBack, 1))

      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animateCount)
      } else {
        setDisplayValue(targetNumber)
        setIsComplete(true)
        onComplete?.()
      }
    }

    requestAnimationFrame(animateCount)
  }, [isInView, targetNumber, animate, duration, onComplete])

  // Format number with locale separators (e.g., 18000 → 18.000)
  const formattedValue = displayValue.toLocaleString('it-IT')

  return (
    <motion.span
      ref={ref}
      className="tabular-nums inline-block"
      animate={isComplete ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {prefix}
      {formattedValue}
      {suffix || originalSuffix}
    </motion.span>
  )
}

export default function StatsSection({ data, documentId, sectionKey }: StatsSectionProps) {
  const { t } = useLanguage()

  // Background classes
  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    gray: 'bg-gray-100',
    dark: 'bg-gray-900',
    primary: 'bg-primary',
    'gradient-blue': 'bg-gradient-to-br from-primary via-primary-dark to-blue-900',
    'gradient-dark': 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
    'metal': 'metal-gradient',
    'metal-dark': 'metal-dark',
    'metal-brushed': 'metal-brushed',
    'metal-chrome': 'metal-chrome',
    image: '',
  }

  // Text color classes based on background
  const getTextColor = () => {
    if (data.textColor?.includes('white')) return 'text-white'
    if (data.textColor?.includes('black')) return 'text-gray-900'
    if (data.textColor?.includes('primary')) return 'text-primary'
    // Auto
    const darkBgs = ['dark', 'primary', 'gradient-blue', 'gradient-dark', 'metal-dark', 'image']
    const lightBgs = ['white', 'gray', 'metal', 'metal-brushed', 'metal-chrome']
    if (lightBgs.includes(data.backgroundColor || '')) return 'text-gray-900'
    return darkBgs.includes(data.backgroundColor || 'primary') ? 'text-white' : 'text-gray-900'
  }

  // Number size classes
  const numberSizeClasses: Record<string, string> = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-4xl md:text-5xl',
    xl: 'text-5xl md:text-6xl',
    xxl: 'text-6xl md:text-7xl',
  }

  // Number weight classes
  const numberWeightClasses: Record<string, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  }

  // Padding classes
  const paddingClasses: Record<string, string> = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-24 md:py-32',
  }

  // Grid columns based on layout
  const getGridClasses = () => {
    const cols = data.columns || 4
    const layout = data.layout || 'grid'

    if (layout?.includes('row')) return 'flex flex-wrap justify-center gap-8 md:gap-16'
    if (layout?.includes('vertical')) return 'flex flex-col gap-8 max-w-2xl mx-auto'
    if (layout?.includes('timeline')) return 'flex flex-col gap-6 max-w-3xl mx-auto'

    const colClasses: Record<number, string> = {
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-2 md:grid-cols-5',
      0: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', // Auto
    }
    return `grid ${colClasses[cols] || colClasses[4]} gap-5 md:gap-6`
  }

  // Card style classes (padding/rounding handled by container)
  const cardStyleClasses: Record<string, string> = {
    none: '',
    elevated: 'bg-white/10 backdrop-blur-sm shadow-lg',
    bordered: 'border-2 border-current/20',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10',
    gradient: 'bg-gradient-to-br from-white/10 to-white/5',
    metal: 'card-metal',
  }

  // Color accent classes
  const colorClasses: Record<string, string> = {
    default: '',
    primary: 'text-primary',
    secondary: 'text-secondary',
    green: 'text-green-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
  }

  // Animation variants
  const getContainerVariants = () => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: data.entranceAnimation?.includes('stagger') ? 0.15 : 0,
        delayChildren: 0.1,
      },
    },
  })

  const getItemVariants = () => {
    switch (data.entranceAnimation) {
      case 'none':
        return { hidden: {}, visible: {} }
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } },
        }
      case 'zoom':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        }
      case 'bounce':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 200, damping: 10 },
          },
        }
      default: // fade-up or stagger
        return {
          hidden: { opacity: 0, y: 30, scale: 0.9 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 100, damping: 12 },
          },
        }
    }
  }

  // Hover animation classes
  const hoverClasses: Record<string, string> = {
    none: '',
    scale: 'hover:scale-110 transition-transform duration-300',
    glow: 'hover:shadow-xl hover:shadow-current/20 transition-shadow duration-300',
    lift: 'hover:-translate-y-2 transition-transform duration-300',
    color: 'hover:text-primary transition-colors duration-300',
  }

  const backgroundColor = data.backgroundColor || 'primary'
  const textColor = getTextColor()
  const backgroundUrl = isValidImage(data.backgroundImage)
    ? safeImageUrl(data.backgroundImage, 1920)
    : null

  return (
    <section data-sanity-edit-target className={`relative overflow-hidden ${getSpacingClasses(data)} ${bgClasses[backgroundColor]} ${textColor}`}>
      {/* Background Image */}
      {backgroundColor?.includes('image') && backgroundUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundUrl}
            alt=""
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: (data.backgroundOverlay ?? 70) / 100 }}
          />
        </div>
      )}

      {/* Decorazioni sottili */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        {/* Large ambient glow */}
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      {/* Extra decorations when enabled */}
      {data.showDecorations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-10 left-[8%] w-40 h-40 rounded-full bg-white/[0.03]"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-10 right-[10%] w-28 h-28 rounded-full bg-white/[0.03]"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          />
        </div>
      )}

      <div className="container-glos relative z-10">
        {/* Header */}
        {!!(data.title || data.subtitle || data.description) && (
          <div className={`mb-16 ${data.alignment?.includes('left') ? 'text-left' : data.alignment?.includes('right') ? 'text-right' : 'text-center'}`}>
            {!!data.title && (
              <h2 className="section-title mb-3">
                <RichText value={data.title} />
              </h2>
            )}
            {/* Decorative accent line under title */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="w-8 h-px bg-current opacity-30" />
              <div className="w-2 h-2 rounded-full bg-current opacity-40" />
              <div className="w-8 h-px bg-current opacity-30" />
            </div>
            {!!data.subtitle && (
              <div className="text-xl opacity-80 mb-4">
                <RichText value={data.subtitle} />
              </div>
            )}
            {!!data.description && (
              <div className="max-w-2xl mx-auto opacity-70">
                <RichText value={data.description} />
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <motion.div
          variants={getContainerVariants()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className={getGridClasses()}
        >
          {data.items?.map((stat, index) => {
            const statContent = (
              <>
                {/* Icon */}
                {!data.iconPosition?.includes('hidden') && (stat.icon || stat.iconImage) && (
                  <div className={`mb-4 ${
                    data.iconPosition?.includes('left') ? 'inline-block mr-4 align-middle' :
                    data.iconPosition?.includes('right') ? 'inline-block ml-4 align-middle float-right' :
                    data.iconPosition?.includes('background') ? 'absolute inset-0 flex items-center justify-center opacity-10 text-8xl' :
                    'flex justify-center'
                  }`}>
                    {stat.iconImage && isValidImage(stat.iconImage) ? (
                      <Image
                        src={safeImageUrl(stat.iconImage, 64) || ''}
                        alt=""
                        width={48}
                        height={48}
                        className="inline-block"
                      />
                    ) : stat.icon ? (
                      <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-3xl shadow-lg group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                        {stat.icon}
                      </span>
                    ) : null}
                  </div>
                )}

                {/* Number */}
                <div className="relative mb-3">
                  <div
                    className={`${numberSizeClasses[data.numberSize || 'xl']} ${numberWeightClasses[data.numberWeight || 'bold']} leading-none`}
                    style={{ textShadow: '0 2px 20px rgba(255,255,255,0.15)' }}
                  >
                    <AnimatedNumber
                      value={stat.number || '0'}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      animate={data.countAnimation !== false}
                      duration={data.countDuration || 2000}
                    />
                  </div>
                </div>

                {/* Label */}
                {!!stat.label && (
                  <div className="text-sm md:text-base font-medium opacity-75 leading-snug max-w-[200px] mx-auto">
                    <RichText value={stat.label} />
                  </div>
                )}

                {/* Description */}
                {!!stat.description && (
                  <div className="text-xs opacity-50 mt-2 leading-relaxed">
                    {String(t(stat.description) || '')}
                  </div>
                )}
              </>
            )

            return (
              <motion.div
                key={stat._key}
                variants={getItemVariants()}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  transition: { type: 'spring', stiffness: 300, damping: 20 }
                }}
                className={`group text-center ${cardStyleClasses[data.cardStyle || 'glass']} cursor-pointer relative overflow-hidden rounded-2xl p-8`}
              >
                {/* Gradient border glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:w-3/4 transition-all duration-500 rounded-full" />
                {stat.link ? (
                  <Link href={stat.link} className="block relative z-10">
                    {statContent}
                  </Link>
                ) : (
                  <div className="block relative z-10">
                    {statContent}
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Dividers between items */}
        {data.dividers && data.layout?.includes('row') && (
          <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-around pointer-events-none">
            {data.items?.slice(0, -1).map((_, i) => (
              <div key={i} className="w-px h-20 bg-current opacity-20" />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
