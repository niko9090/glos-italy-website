// Stats Section Component - VERSIONE AVANZATA
'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
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
    paddingY?: 'sm' | 'md' | 'lg' | 'xl'
    // Animation
    countAnimation?: boolean
    countDuration?: number
    entranceAnimation?: 'none' | 'fade' | 'fade-up' | 'zoom' | 'stagger' | 'bounce'
    hoverAnimation?: 'none' | 'scale' | 'glow' | 'lift' | 'color'
    showDecorations?: boolean
  }
}

// Animated counter component
function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  animate = true,
  duration = 2000
}: {
  value: string
  prefix?: string
  suffix?: string
  animate?: boolean
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [displayValue, setDisplayValue] = useState(0)

  // Extract numeric value from string like "500" or "30"
  const targetNumber = parseInt(value?.replace(/[^0-9]/g, '') || '0', 10)
  const originalSuffix = value?.replace(/[0-9]/g, '') || ''

  useEffect(() => {
    if (!isInView || !animate) {
      setDisplayValue(targetNumber)
      return
    }

    const startTime = Date.now()

    const animateCount = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(targetNumber * easeOut)

      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(animateCount)
      } else {
        setDisplayValue(targetNumber)
      }
    }

    requestAnimationFrame(animateCount)
  }, [isInView, targetNumber, animate, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {displayValue}
      {suffix || originalSuffix}
    </span>
  )
}

export default function StatsSection({ data }: StatsSectionProps) {
  const { t } = useLanguage()

  // Background classes
  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    gray: 'bg-gray-100',
    dark: 'bg-gray-900',
    primary: 'bg-primary',
    'gradient-blue': 'bg-gradient-to-br from-primary via-primary-dark to-blue-900',
    'gradient-dark': 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
    image: '',
  }

  // Text color classes based on background
  const getTextColor = () => {
    if (data.textColor === 'white') return 'text-white'
    if (data.textColor === 'black') return 'text-gray-900'
    if (data.textColor === 'primary') return 'text-primary'
    // Auto
    const darkBgs = ['dark', 'primary', 'gradient-blue', 'gradient-dark', 'image']
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

    if (layout === 'row') return 'flex flex-wrap justify-center gap-8 md:gap-16'
    if (layout === 'vertical') return 'flex flex-col gap-8 max-w-2xl mx-auto'
    if (layout === 'timeline') return 'flex flex-col gap-6 max-w-3xl mx-auto'

    const colClasses: Record<number, string> = {
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-3',
      4: 'grid-cols-2 md:grid-cols-4',
      5: 'grid-cols-2 md:grid-cols-5',
      0: 'grid-cols-2 md:grid-cols-4', // Auto
    }
    return `grid ${colClasses[cols] || colClasses[4]} gap-8 md:gap-12`
  }

  // Card style classes
  const cardStyleClasses: Record<string, string> = {
    none: '',
    elevated: 'bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg',
    bordered: 'border-2 border-current/20 rounded-2xl p-6',
    glass: 'bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10',
    gradient: 'bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6',
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
        staggerChildren: data.entranceAnimation === 'stagger' ? 0.15 : 0,
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
    <section className={`relative overflow-hidden ${paddingClasses[data.paddingY || 'lg']} ${bgClasses[backgroundColor]} ${textColor}`}>
      {/* Background Image */}
      {backgroundColor === 'image' && backgroundUrl && (
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

      {/* Decorations */}
      {data.showDecorations && (
        <>
          <div className="absolute top-0 left-0 w-64 h-64 bg-current opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-current opacity-5 rounded-full translate-x-1/2 translate-y-1/2" />
        </>
      )}

      <div className="container-glos relative z-10">
        {/* Header */}
        {(data.title || data.subtitle || data.description) && (
          <div className={`mb-12 ${data.alignment === 'left' ? 'text-left' : data.alignment === 'right' ? 'text-right' : 'text-center'}`}>
            {data.title && (
              <h2 className="section-title mb-4">
                <RichText value={data.title} />
              </h2>
            )}
            {data.subtitle && (
              <div className="text-xl opacity-80 mb-4">
                <RichText value={data.subtitle} />
              </div>
            )}
            {data.description && (
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
            const StatWrapper = stat.link ? Link : 'div'
            const wrapperProps = stat.link ? { href: stat.link } : {}

            return (
              <motion.div
                key={stat._key}
                variants={getItemVariants()}
                className={`group ${data.alignment || 'center'} ${cardStyleClasses[data.cardStyle || 'none']} ${hoverClasses[data.hoverAnimation || 'scale']}`}
              >
                <StatWrapper {...wrapperProps} className="block">
                  {/* Icon */}
                  {data.iconPosition !== 'hidden' && (stat.icon || stat.iconImage) && (
                    <div className={`mb-3 ${
                      data.iconPosition === 'left' ? 'inline-block mr-4 align-middle' :
                      data.iconPosition === 'right' ? 'inline-block ml-4 align-middle float-right' :
                      data.iconPosition === 'background' ? 'absolute inset-0 flex items-center justify-center opacity-10 text-8xl' :
                      'block text-center'
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
                        <span className="text-4xl">{stat.icon}</span>
                      ) : null}
                    </div>
                  )}

                  {/* Number */}
                  <div className={`relative ${colorClasses[stat.color || 'default']}`}>
                    <div className={`${numberSizeClasses[data.numberSize || 'xl']} ${numberWeightClasses[data.numberWeight || 'bold']} mb-3`}>
                      <AnimatedNumber
                        value={stat.number || '0'}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        animate={data.countAnimation !== false}
                        duration={data.countDuration || 2000}
                      />
                    </div>
                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />
                  </div>

                  {/* Label */}
                  {stat.label && (
                    <div className="text-lg md:text-xl font-semibold mb-1 opacity-90">
                      <RichText value={stat.label} />
                    </div>
                  )}

                  {/* Description */}
                  {stat.description && (
                    <div className="text-sm opacity-70 mt-2">
                      {t(stat.description)}
                    </div>
                  )}

                  {/* Decorative underline */}
                  <div className="mt-4 mx-auto w-12 h-1 bg-current opacity-30 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </StatWrapper>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Dividers between items */}
        {data.dividers && data.layout === 'row' && (
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
