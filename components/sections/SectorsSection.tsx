// Sectors Section Component - Grid of industry sectors
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import { getSpacingClasses } from '@/lib/utils/spacing'
import RichText from '@/components/RichText'

interface SectorItem {
  _key: string
  icon?: string
  iconImage?: any
  title?: unknown
  description?: unknown
  slug?: { current: string }
  image?: any
  color?: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan' | 'gold'
}

interface SectorsSectionProps {
  data: {
    // Content
    eyebrow?: unknown
    title?: unknown
    subtitle?: unknown
    description?: unknown
    items?: SectorItem[]
    // Layout
    layout?: 'grid-2' | 'grid-3' | 'grid-4' | 'cards' | 'featured'
    cardStyle?: 'minimal' | 'elevated' | 'glass' | 'gradient' | 'bordered'
    iconSize?: 'sm' | 'md' | 'lg' | 'xl'
    showImage?: boolean
    showDescription?: boolean
    textAlign?: 'left' | 'center' | 'right'
    // Style
    backgroundColor?: 'white' | 'gray-light' | 'gray' | 'primary' | 'primary-light' | 'gradient-blue' | 'gradient-dark'
    textColor?: 'auto' | 'dark' | 'light'
    // Spacing
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string
    marginTop?: string
    marginBottom?: string
    // Animation
    animation?: 'none' | 'fade' | 'fade-up' | 'stagger' | 'zoom' | 'slide'
    hoverEffect?: 'none' | 'scale' | 'lift' | 'glow' | 'tilt'
    // CTA
    showCta?: boolean
    ctaText?: unknown
    ctaLink?: string
  }
}

export default function SectorsSection({ data }: SectorsSectionProps) {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  // Background classes
  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    'gray-light': 'bg-gray-50',
    gray: 'bg-gray-100',
    primary: 'bg-primary',
    'primary-light': 'bg-blue-50',
    'gradient-blue': 'bg-gradient-to-br from-primary via-primary-dark to-blue-900',
    'gradient-dark': 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
  }

  // Text color determination
  const getTextColor = () => {
    if (data.textColor === 'dark') return 'text-gray-900'
    if (data.textColor === 'light') return 'text-white'
    const darkBgs = ['primary', 'gradient-blue', 'gradient-dark']
    return darkBgs.includes(data.backgroundColor || 'white') ? 'text-white' : 'text-gray-900'
  }

  // Color accent mapping
  const colorAccents: Record<string, { bg: string; glow: string; border: string }> = {
    default: { bg: 'bg-primary/10', glow: 'rgba(0, 71, 171, 0.4)', border: 'border-primary/30' },
    blue: { bg: 'bg-blue-100', glow: 'rgba(59, 130, 246, 0.4)', border: 'border-blue-300' },
    green: { bg: 'bg-green-100', glow: 'rgba(34, 197, 94, 0.4)', border: 'border-green-300' },
    purple: { bg: 'bg-purple-100', glow: 'rgba(168, 85, 247, 0.4)', border: 'border-purple-300' },
    orange: { bg: 'bg-orange-100', glow: 'rgba(249, 115, 22, 0.4)', border: 'border-orange-300' },
    red: { bg: 'bg-red-100', glow: 'rgba(239, 68, 68, 0.4)', border: 'border-red-300' },
    cyan: { bg: 'bg-cyan-100', glow: 'rgba(6, 182, 212, 0.4)', border: 'border-cyan-300' },
    gold: { bg: 'bg-yellow-100', glow: 'rgba(234, 179, 8, 0.4)', border: 'border-yellow-300' },
  }

  // Icon size classes
  const iconSizeClasses: Record<string, string> = {
    sm: 'w-10 h-10 text-2xl',
    md: 'w-14 h-14 text-3xl',
    lg: 'w-18 h-18 text-4xl',
    xl: 'w-24 h-24 text-5xl',
  }

  // Layout grid classes
  const getLayoutClasses = () => {
    switch (data.layout) {
      case 'grid-2':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8'
      case 'grid-4':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
      case 'featured':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
      case 'cards':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
      default: // grid-3
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
    }
  }

  // Card style classes
  const getCardClasses = (color: string = 'default') => {
    const accent = colorAccents[color] || colorAccents.default
    const baseClasses = 'relative rounded-2xl p-6 lg:p-8 transition-all duration-300 group cursor-pointer'

    switch (data.cardStyle) {
      case 'minimal':
        return `${baseClasses} hover:bg-gray-50`
      case 'elevated':
        return `${baseClasses} bg-white shadow-lg hover:shadow-2xl hover:shadow-primary/10`
      case 'glass':
        return `${baseClasses} bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:border-white/30`
      case 'gradient':
        return `${baseClasses} bg-gradient-to-br from-white/15 to-white/5 border border-white/10 hover:from-white/20 hover:to-white/10`
      case 'bordered':
        return `${baseClasses} bg-white border-2 ${accent.border} hover:border-primary`
      default:
        return `${baseClasses} bg-white shadow-md hover:shadow-xl hover:-translate-y-2`
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: data.animation === 'stagger' ? 0.1 : 0,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: data.animation === 'fade-up' || data.animation === 'stagger' ? 30 : 0,
      scale: data.animation === 'zoom' ? 0.9 : 1,
      x: data.animation === 'slide' ? -30 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  }

  // Hover animation based on effect type
  const getHoverAnimation = (color: string = 'default') => {
    const accent = colorAccents[color] || colorAccents.default

    switch (data.hoverEffect) {
      case 'scale':
        return {
          scale: 1.05,
          transition: { duration: 0.3 },
        }
      case 'lift':
        return {
          y: -12,
          boxShadow: '0 25px 50px -12px rgba(0, 71, 171, 0.25)',
          transition: { duration: 0.3 },
        }
      case 'glow':
        return {
          boxShadow: `0 0 40px ${accent.glow}`,
          transition: { duration: 0.3 },
        }
      case 'tilt':
        return {
          rotateY: -5,
          rotateX: 5,
          scale: 1.02,
          transition: { duration: 0.3 },
        }
      default:
        return {}
    }
  }

  const backgroundColor = data.backgroundColor || 'gray-light'
  const textColor = getTextColor()

  return (
    <section
      ref={sectionRef}
      className={`${getSpacingClasses(data)} ${bgClasses[backgroundColor]} ${textColor} overflow-hidden`}
    >
      <div className="container-glos">
        {/* Header */}
        {!!(data.eyebrow || data.title || data.subtitle || data.description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`mb-12 lg:mb-16 ${
              data.textAlign === 'left' ? 'text-left' : data.textAlign === 'right' ? 'text-right' : 'text-center'
            }`}
          >
            {!!data.eyebrow && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-sm font-semibold tracking-widest uppercase mb-4 text-primary"
              >
                {String(t(data.eyebrow) || '')}
              </motion.p>
            )}
            {!!data.title && (
              <h2 className="section-title mb-4">
                <RichText value={data.title} />
              </h2>
            )}
            {!!data.subtitle && (
              <div className="section-subtitle mb-4">
                <RichText value={data.subtitle} />
              </div>
            )}
            {!!data.description && (
              <div className="max-w-2xl mx-auto opacity-70">
                <RichText value={data.description} />
              </div>
            )}
          </motion.div>
        )}

        {/* Sectors Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className={getLayoutClasses()}
        >
          {data.items?.map((sector, index) => {
            const accent = colorAccents[sector.color || 'default'] || colorAccents.default
            const sectorSlug = sector.slug?.current
            const imageUrl = data.showImage && isValidImage(sector.image) ? safeImageUrl(sector.image, 400, 300) : null

            const CardContent = (
              <>
                {/* Background Image (if enabled) */}
                {imageUrl && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className={`relative z-10 ${imageUrl ? 'text-white' : ''}`}>
                  {/* Icon */}
                  {(sector.icon || sector.iconImage) && (
                    <div className="mb-4">
                      {sector.iconImage && isValidImage(sector.iconImage) ? (
                        <div className={`${iconSizeClasses[data.iconSize || 'lg']} relative`}>
                          <Image
                            src={safeImageUrl(sector.iconImage, 96) || ''}
                            alt=""
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        </div>
                      ) : sector.icon ? (
                        <div
                          className={`
                            ${iconSizeClasses[data.iconSize || 'lg']}
                            ${imageUrl ? 'bg-white/20 backdrop-blur-sm' : accent.bg}
                            rounded-2xl flex items-center justify-center
                            group-hover:scale-110 transition-transform duration-300
                          `}
                        >
                          {sector.icon}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Title */}
                  {!!sector.title && (
                    <h3 className="text-xl lg:text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {String(t(sector.title) || '')}
                    </h3>
                  )}

                  {/* Description */}
                  {data.showDescription !== false && !!sector.description && (
                    <p className={`text-sm lg:text-base ${imageUrl ? 'text-white/80' : 'text-gray-600'} line-clamp-3`}>
                      {String(t(sector.description) || '')}
                    </p>
                  )}

                  {/* Arrow indicator */}
                  {sectorSlug && (
                    <div className="mt-4 flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm">Scopri di piu</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </div>

                {/* Decorative glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 30px ${accent.glow}`,
                  }}
                />
              </>
            )

            return (
              <motion.div
                key={sector._key}
                variants={itemVariants}
                whileHover={getHoverAnimation(sector.color)}
                className={getCardClasses(sector.color)}
                style={{
                  transformStyle: data.hoverEffect === 'tilt' ? 'preserve-3d' : undefined,
                  perspective: data.hoverEffect === 'tilt' ? '1000px' : undefined,
                }}
              >
                {sectorSlug ? (
                  <Link href={`/settori/${sectorSlug}`} className="block">
                    {CardContent}
                  </Link>
                ) : (
                  CardContent
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA Button */}
        {data.showCta && !!data.ctaText && data.ctaLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              href={data.ctaLink}
              className="inline-flex items-center gap-2 btn-primary"
            >
              {String(t(data.ctaText) || '')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
