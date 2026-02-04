// Features Section Component - VERSIONE AVANZATA
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import { getSpacingClasses } from '@/lib/utils/spacing'
import RichText from '@/components/RichText'

interface FeatureItem {
  _key: string
  icon?: string
  iconImage?: any
  title?: unknown
  description?: unknown
  link?: string
  color?: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan'
  badge?: unknown
}

interface FeaturesSectionProps {
  documentId?: string
  sectionKey?: string
  data: {
    // Content
    eyebrow?: unknown
    title?: unknown
    subtitle?: unknown
    description?: unknown
    items?: FeatureItem[]
    // Media
    showImage?: boolean
    image?: any
    imagePosition?: 'left' | 'right' | 'top' | 'bottom' | 'background'
    imageStyle?: 'normal' | 'rounded' | 'circle' | 'shadow' | 'border' | 'float'
    // Layout
    layout?: 'list' | 'grid-2' | 'grid-3' | 'grid-4' | 'cards' | 'cards-icons' | 'alternating' | 'centered' | 'sidebar' | 'inline' | 'timeline' | 'tabs'
    iconPosition?: 'top' | 'left' | 'right' | 'background' | 'hidden'
    iconSize?: 'sm' | 'md' | 'lg' | 'xl'
    textAlign?: 'left' | 'center' | 'right'
    contentWidth?: 'narrow' | 'normal' | 'wide' | 'full'
    gap?: 'sm' | 'md' | 'lg' | 'xl'
    // Style
    iconStyle?: 'simple' | 'filled' | 'outlined' | 'gradient' | 'circle-filled' | 'circle-outlined' | 'rounded-square'
    cardStyle?: 'none' | 'border' | 'shadow-sm' | 'shadow-md' | 'shadow-lg' | 'glass' | 'gradient' | 'colored'
    backgroundColor?: 'white' | 'gray-light' | 'gray' | 'black' | 'primary' | 'primary-light' | 'gradient-blue' | 'gradient-dark'
    textColor?: 'auto' | 'dark' | 'light'
    accentColor?: 'primary' | 'green' | 'purple' | 'orange' | 'red' | 'gradient'
    dividers?: boolean
    // Spacing
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string // legacy
    marginTop?: string
    marginBottom?: string
    // Animation
    animation?: 'none' | 'fade' | 'fade-up' | 'stagger' | 'zoom' | 'slide-left' | 'slide-right' | 'flip'
    hoverEffect?: 'none' | 'scale' | 'lift' | 'glow' | 'border-color' | 'bg-color' | 'icon-bounce'
    iconAnimation?: 'none' | 'pulse' | 'bounce' | 'spin' | 'shake'
    parallax?: boolean
    // CTA
    showCta?: boolean
    ctaText?: unknown
    ctaLink?: string
    ctaVariant?: 'primary' | 'secondary' | 'outline'
  }
}

export default function FeaturesSection({ data, documentId, sectionKey }: FeaturesSectionProps) {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax for the image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])

  // Background classes
  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    'gray-light': 'bg-gray-50',
    gray: 'bg-gray-100',
    black: 'bg-gray-900',
    primary: 'bg-primary',
    'primary-light': 'bg-blue-50',
    'gradient-blue': 'bg-gradient-to-br from-primary via-primary-dark to-blue-900',
    'gradient-dark': 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
    'metal': 'metal-gradient',
    'metal-dark': 'metal-dark',
    'metal-brushed': 'metal-brushed',
    'metal-chrome': 'metal-chrome',
  }

  // Text color
  const getTextColor = () => {
    if (data.textColor?.includes('dark')) return 'text-gray-900'
    if (data.textColor?.includes('light')) return 'text-white'
    const darkBgs = ['black', 'primary', 'gradient-blue', 'gradient-dark', 'metal-dark']
    const lightBgs = ['white', 'gray-light', 'gray', 'primary-light', 'metal', 'metal-brushed', 'metal-chrome']
    if (lightBgs.includes(data.backgroundColor || 'white')) return 'text-gray-900'
    return darkBgs.includes(data.backgroundColor || 'white') ? 'text-white' : 'text-gray-900'
  }

  // Padding classes
  const paddingClasses: Record<string, string> = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-24 md:py-32',
  }

  // Gap classes
  const gapClasses: Record<string, string> = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  }

  // Icon size classes
  const iconSizeClasses: Record<string, string> = {
    sm: 'w-8 h-8 text-2xl',
    md: 'w-10 h-10 text-3xl',
    lg: 'w-12 h-12 text-4xl',
    xl: 'w-16 h-16 text-5xl',
  }

  // Icon style classes
  const getIconStyleClasses = (color: string = 'default') => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      default: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-500' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-500' },
      cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-500' },
    }
    const colors = colorMap[color] || colorMap.default

    switch (data.iconStyle) {
      case 'simple':
        return colors.text
      case 'filled':
        return `${colors.bg} ${colors.text} p-2`
      case 'outlined':
        return `border-2 ${colors.border} ${colors.text} p-2`
      case 'gradient':
        return 'bg-gradient-to-br from-primary to-blue-600 text-white p-2'
      case 'circle-filled':
        return `${colors.bg} ${colors.text} p-3 rounded-full`
      case 'circle-outlined':
        return `border-2 ${colors.border} ${colors.text} p-3 rounded-full`
      case 'rounded-square':
        return `${colors.bg} ${colors.text} p-3 rounded-xl`
      default:
        return `${colors.bg} ${colors.text} p-3 rounded-lg`
    }
  }

  // Card style classes - enhanced with modern effects
  const cardStyleClasses: Record<string, string> = {
    none: '',
    border: 'border border-gray-200 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300',
    'shadow-sm': 'shadow-sm rounded-2xl p-8 bg-white hover:shadow-lg transition-all duration-300',
    'shadow-md': 'shadow-md rounded-2xl p-8 bg-white hover:shadow-xl transition-all duration-300',
    'shadow-lg': 'shadow-lg rounded-2xl p-8 bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300',
    glass: 'bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/15 hover:border-white/30 hover:shadow-[0_16px_48px_rgba(0,71,171,0.15)] transition-all duration-300',
    gradient: 'bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-8 border border-white/10 hover:from-white/20 hover:to-white/10 transition-all duration-300',
    colored: 'bg-primary/5 rounded-2xl p-8 hover:bg-primary/10 transition-all duration-300',
    metal: 'card-metal rounded-2xl p-8',
  }

  // Hover effect classes
  const hoverEffectClasses: Record<string, string> = {
    none: '',
    scale: 'hover:scale-105 transition-transform duration-300',
    lift: 'hover:-translate-y-2 transition-transform duration-300',
    glow: 'hover:shadow-xl hover:shadow-primary/20 transition-shadow duration-300',
    'border-color': 'hover:border-primary transition-colors duration-300',
    'bg-color': 'hover:bg-primary/5 transition-colors duration-300',
    'icon-bounce': 'group',
  }

  // Layout classes
  const getLayoutClasses = () => {
    const layout = data.layout || 'grid-3'
    if (layout?.includes('list')) return 'flex flex-col'
    if (layout?.includes('grid-2')) return 'grid grid-cols-1 md:grid-cols-2'
    if (layout?.includes('grid-4')) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    if (layout?.includes('grid-3')) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    if (layout?.includes('cards')) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    if (layout?.includes('alternating')) return 'flex flex-col'
    if (layout?.includes('centered')) return 'flex flex-col max-w-2xl mx-auto'
    if (layout?.includes('sidebar')) return 'grid grid-cols-1 lg:grid-cols-3'
    if (layout?.includes('inline')) return 'flex flex-wrap justify-center'
    if (layout?.includes('timeline')) return 'flex flex-col max-w-3xl mx-auto'
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: data.animation?.includes('stagger') ? 0.12 : 0,
        delayChildren: 0.1,
      },
    },
  }

  const getItemVariants = () => {
    switch (data.animation) {
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
      case 'slide-left':
        return {
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        }
      case 'slide-right':
        return {
          hidden: { opacity: 0, x: 30 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        }
      case 'flip':
        return {
          hidden: { opacity: 0, rotateY: -90 },
          visible: { opacity: 1, rotateY: 0, transition: { duration: 0.6 } },
        }
      default: // fade-up or stagger
        return {
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 15 },
          },
        }
    }
  }

  // Content width classes
  const contentWidthClasses: Record<string, string> = {
    narrow: 'max-w-4xl mx-auto',
    normal: 'max-w-6xl mx-auto',
    wide: 'max-w-7xl mx-auto',
    full: '',
  }

  // CTA variant classes
  const ctaVariantClasses: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn border-2 border-primary text-primary hover:bg-primary hover:text-white',
  }

  const backgroundColor = data.backgroundColor || 'gray-light'
  const textColor = getTextColor()
  const layout = data.layout || 'grid-3'
  const imageUrl = isValidImage(data.image) ? safeImageUrl(data.image, 800, 600) : null
  const showImage = data.showImage && imageUrl

  // Determine if layout should be split with image
  const isSplitLayout = showImage && ['left', 'right'].includes(data.imagePosition || 'right')

  return (
    <section
      data-sanity-edit-target
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
            className={`mb-12 ${data.textAlign?.includes('left') ? 'text-left' : data.textAlign?.includes('right') ? 'text-right' : 'text-center'}`}
          >
            {!!data.eyebrow && (
              <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-primary">
                {String(t(data.eyebrow) || '')}
              </p>
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

        {/* Main Content */}
        <div className={isSplitLayout ? 'grid lg:grid-cols-2 gap-12 items-center' : contentWidthClasses[data.contentWidth || 'normal']}>
          {/* Image (left position) */}
          {showImage && data.imagePosition?.includes('left') && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-1 lg:order-none"
            >
              <motion.div
                style={data.parallax ? { y: imageY, scale: imageScale } : undefined}
                className={`relative aspect-[4/3] overflow-hidden ${
                  data.imageStyle?.includes('rounded') ? 'rounded-2xl' :
                  data.imageStyle?.includes('circle') ? 'rounded-full aspect-square' :
                  data.imageStyle?.includes('shadow') ? 'rounded-2xl shadow-2xl' :
                  data.imageStyle?.includes('border') ? 'rounded-2xl border-4 border-primary/20' :
                  data.imageStyle?.includes('float') ? 'rounded-2xl shadow-2xl transform rotate-2' :
                  'rounded-2xl'
                }`}
              >
                <Image
                  src={imageUrl!}
                  alt=""
                  fill
                  className="object-cover"
                />
              </motion.div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary/20 rounded-full -z-10" />
            </motion.div>
          )}

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className={`${getLayoutClasses()} ${gapClasses[data.gap || 'lg']}`}
          >
            {data.items?.map((item, index) => {
              const wrapperClassName = `block ${
                data.iconPosition?.includes('left') ? 'flex items-start gap-4' :
                data.iconPosition?.includes('right') ? 'flex items-start gap-4 flex-row-reverse' :
                ''
              }`

              const itemContent = (
                <>
                  {/* Timeline dot */}
                  {layout?.includes('timeline') && (
                    <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white" />
                  )}

                  {/* Icon */}
                  {!data.iconPosition?.includes('hidden') && (item.icon || item.iconImage) && (
                    <div className={`flex-shrink-0 ${
                      data.iconPosition?.includes('top') ? 'mb-4' : ''
                    } ${data.iconPosition?.includes('background') ? 'absolute right-4 top-4 opacity-10 text-6xl' : ''}`}>
                      {item.iconImage && isValidImage(item.iconImage) ? (
                        <div className={iconSizeClasses[data.iconSize || 'lg']}>
                          <Image
                            src={safeImageUrl(item.iconImage, 64) || ''}
                            alt=""
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                      ) : item.icon ? (
                        <div className={`${getIconStyleClasses(item.color)} ${iconSizeClasses[data.iconSize || 'lg']} flex items-center justify-center ${
                          data.hoverEffect?.includes('icon-bounce') ? 'group-hover:animate-bounce' : ''
                        } ${data.iconAnimation?.includes('pulse') ? 'animate-pulse' : ''} ${
                          data.iconAnimation?.includes('bounce') ? 'animate-bounce' : ''
                        }`}>
                          {item.icon}
                        </div>
                      ) : (
                        <div className={`${getIconStyleClasses(item.color)} ${iconSizeClasses[data.iconSize || 'lg']} flex items-center justify-center`}>
                          <Check className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className={`flex-1 ${data.textAlign?.includes('center') && data.iconPosition?.includes('top') ? 'text-center' : ''}`}>
                    {/* Badge */}
                    {!!item.badge && (
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-2">
                        {String(t(item.badge) || '')}
                      </span>
                    )}

                    {/* Title */}
                    {!!item.title && (
                      <h3 className={`text-lg font-semibold mb-2 ${item.link ? 'group-hover:text-primary transition-colors' : ''}`}>
                        {String(t(item.title) || '')}
                      </h3>
                    )}

                    {/* Description */}
                    {!!item.description && (
                      <p className="text-sm opacity-70 leading-relaxed">
                        {String(t(item.description) || '')}
                      </p>
                    )}

                    {/* Link arrow */}
                    {item.link && (
                      <div className="mt-3 flex items-center gap-1 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Scopri di più</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </>
              )

              return (
                <motion.div
                  key={item._key}
                  variants={getItemVariants()}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    boxShadow: '0 25px 50px -12px rgba(0, 71, 171, 0.25)',
                    transition: { duration: 0.3, ease: 'easeOut' }
                  }}
                  className={`${cardStyleClasses[data.cardStyle || 'shadow-md']} ${hoverEffectClasses[data.hoverEffect || 'none']} ${
                    layout?.includes('alternating') && index % 2 === 1 ? 'md:flex-row-reverse' : ''
                  } ${layout?.includes('timeline') ? 'relative pl-8 border-l-2 border-primary/30' : ''} cursor-pointer`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {item.link ? (
                    <Link href={item.link} className={wrapperClassName}>
                      {itemContent}
                    </Link>
                  ) : (
                    <div className={wrapperClassName}>
                      {itemContent}
                    </div>
                  )}

                  {/* Divider */}
                  {data.dividers && index < (data.items?.length || 0) - 1 && layout?.includes('list') && (
                    <div className="border-b border-gray-200 mt-6" />
                  )}
                </motion.div>
              )
            })}
          </motion.div>

          {/* Image (right position) */}
          {showImage && data.imagePosition?.includes('right') && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <motion.div
                style={data.parallax ? { y: imageY, scale: imageScale } : undefined}
                className={`relative aspect-[4/3] overflow-hidden ${
                  data.imageStyle?.includes('rounded') ? 'rounded-2xl' :
                  data.imageStyle?.includes('circle') ? 'rounded-full aspect-square' :
                  data.imageStyle?.includes('shadow') ? 'rounded-2xl shadow-2xl' :
                  data.imageStyle?.includes('border') ? 'rounded-2xl border-4 border-primary/20' :
                  data.imageStyle?.includes('float') ? 'rounded-2xl shadow-2xl transform -rotate-2' :
                  'rounded-2xl'
                }`}
              >
                <Image
                  src={imageUrl!}
                  alt=""
                  fill
                  className="object-cover"
                />
              </motion.div>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary/20 rounded-full -z-10" />
            </motion.div>
          )}
        </div>

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
              className={`inline-flex items-center gap-2 ${ctaVariantClasses[data.ctaVariant || 'primary']}`}
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
