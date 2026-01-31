// Hero Section Component - VERSIONE AVANZATA
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { ArrowRight, ChevronDown, Play, Download, Phone, Mail } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface HeroButton {
  _key: string
  text?: unknown
  link?: string
  variant?: 'primary' | 'secondary' | 'white' | 'ghost'
  icon?: string
  iconPosition?: 'left' | 'right'
}

interface FloatingElement {
  _key: string
  type?: 'circle' | 'square' | 'blob' | 'line'
  size?: 'sm' | 'md' | 'lg'
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  color?: 'primary' | 'secondary' | 'white' | 'black'
  opacity?: number
  animated?: boolean
}

interface HeroSectionProps {
  data: {
    // Content
    eyebrow?: unknown
    title?: unknown
    subtitle?: unknown
    // Buttons
    buttons?: HeroButton[]
    buttonText?: unknown // Legacy
    buttonLink?: string // Legacy
    // Media
    backgroundType?: 'image' | 'video' | 'gradient' | 'solid'
    backgroundImage?: any
    backgroundVideo?: any
    backgroundGradient?: string
    backgroundColor?: string
    overlayType?: 'none' | 'dark' | 'gradient-left' | 'gradient-right' | 'gradient-bottom' | 'vignette'
    overlayOpacity?: number
    // Layout
    height?: 'auto' | 'medium' | 'large' | 'full' | 'custom'
    customHeight?: number
    contentPosition?: 'center' | 'left' | 'right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
    textAlign?: 'left' | 'center' | 'right'
    contentWidth?: 'narrow' | 'medium' | 'wide' | 'full'
    // Style
    titleSize?: 'normal' | 'large' | 'xl' | 'xxl'
    textColor?: 'white' | 'black' | 'auto'
    animation?: 'none' | 'fade' | 'slide-up' | 'slide-left' | 'zoom' | 'typewriter'
    parallax?: boolean
    // Advanced
    showScrollIndicator?: boolean
    scrollIndicatorText?: unknown
    badge?: {
      text?: unknown
      color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple'
    }
    floatingElements?: FloatingElement[]
  }
}

export default function HeroSection({ data }: HeroSectionProps) {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax effect
  const shouldParallax = data.parallax !== false
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', shouldParallax ? '30%' : '0%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, shouldParallax ? 0 : 1])

  // Height classes
  const heightClasses: Record<string, string> = {
    auto: 'min-h-[60vh]',
    medium: 'min-h-[70vh]',
    large: 'min-h-[85vh]',
    full: 'min-h-screen',
    custom: '',
  }

  // Content position classes
  const positionClasses: Record<string, string> = {
    center: 'items-center justify-center text-center',
    left: 'items-center justify-start text-left',
    right: 'items-center justify-end text-right',
    'bottom-left': 'items-end justify-start text-left pb-20',
    'bottom-center': 'items-end justify-center text-center pb-20',
    'bottom-right': 'items-end justify-end text-right pb-20',
  }

  // Content width classes
  const widthClasses: Record<string, string> = {
    narrow: 'max-w-xl',
    medium: 'max-w-3xl',
    wide: 'max-w-5xl',
    full: 'max-w-none',
  }

  // Title size classes
  const titleSizeClasses: Record<string, string> = {
    normal: 'text-3xl md:text-4xl lg:text-5xl',
    large: 'text-4xl md:text-5xl lg:text-6xl',
    xl: 'text-5xl md:text-6xl lg:text-7xl',
    xxl: 'text-6xl md:text-7xl lg:text-8xl',
  }

  // Text color classes
  const textColorClasses: Record<string, string> = {
    white: 'text-white',
    black: 'text-gray-900',
    auto: 'text-white', // Default for backgrounds
  }

  // Overlay classes - usa includes() per gestire caratteri stega
  const getOverlayClass = () => {
    const opacity = data.overlayOpacity ?? 50
    const opacityValue = opacity / 100
    const overlayType = data.overlayType || ''

    if (overlayType.includes('none')) {
      return ''
    }
    if (overlayType.includes('dark') && !overlayType.includes('gradient')) {
      return `bg-black/${Math.round(opacityValue * 100)}`
    }
    if (overlayType.includes('gradient-left')) {
      return `bg-gradient-to-r from-black/${Math.round(opacityValue * 100)} via-black/${Math.round(opacityValue * 50)} to-transparent`
    }
    if (overlayType.includes('gradient-right')) {
      return `bg-gradient-to-l from-black/${Math.round(opacityValue * 100)} via-black/${Math.round(opacityValue * 50)} to-transparent`
    }
    if (overlayType.includes('gradient-bottom')) {
      return `bg-gradient-to-t from-black/${Math.round(opacityValue * 100)} via-black/${Math.round(opacityValue * 50)} to-transparent`
    }
    if (overlayType.includes('vignette')) {
      return 'bg-radial-vignette'
    }
    // Default
    return `bg-gradient-to-r from-black/80 via-black/50 to-transparent`
  }

  // Gradient backgrounds
  const gradientClasses: Record<string, string> = {
    'blue-dark': 'bg-gradient-to-br from-primary via-primary-dark to-gray-900',
    'blue-purple': 'bg-gradient-to-br from-blue-600 via-purple-600 to-purple-900',
    'green-blue': 'bg-gradient-to-br from-green-500 via-teal-600 to-blue-700',
    'orange-pink': 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
    'black-gray': 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
    'radial-blue': 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600 via-blue-800 to-gray-900',
  }

  // Solid background colors
  const solidBgClasses: Record<string, string> = {
    primary: 'bg-primary',
    'dark-blue': 'bg-blue-900',
    black: 'bg-black',
    'gray-dark': 'bg-gray-800',
  }

  // Animation variants
  const getAnimationVariants = () => {
    switch (data.animation) {
      case 'none':
        return { initial: {}, animate: {} }
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.8 } },
        }
      case 'slide-up':
        return {
          initial: { opacity: 0, y: 60 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }
      case 'slide-left':
        return {
          initial: { opacity: 0, x: -60 },
          animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
        }
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
        }
      default:
        return {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }
    }
  }

  // Badge color classes
  const badgeColorClasses: Record<string, string> = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  }

  // Button variant classes
  const buttonVariantClasses: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary border-2 border-white text-white hover:bg-white hover:text-gray-900',
    white: 'bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors',
    ghost: 'text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors border border-white/30',
  }

  // Get icon component
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'arrow-right':
      case '→':
        return <ArrowRight className="w-5 h-5" />
      case 'play':
      case '▶':
        return <Play className="w-5 h-5" />
      case 'download':
        return <Download className="w-5 h-5" />
      case 'phone':
      case '📞':
        return <Phone className="w-5 h-5" />
      case 'email':
      case '✉️':
        return <Mail className="w-5 h-5" />
      default:
        return iconName ? <span>{iconName}</span> : <ArrowRight className="w-5 h-5" />
    }
  }

  // Helper per ottenere il gradiente - usa includes() per caratteri stega
  const getGradientBackground = (gradient?: string): string => {
    if (!gradient) return 'linear-gradient(to bottom right, #0047AB, #003380, #111827)'

    // Blu
    if (gradient.includes('blue-dark')) return 'linear-gradient(to bottom right, #0047AB, #003380, #111827)'
    if (gradient.includes('blue-purple')) return 'linear-gradient(to bottom right, #2563eb, #9333ea, #581c87)'
    if (gradient.includes('cyan-blue')) return 'linear-gradient(to bottom right, #06b6d4, #3b82f6, #1e40af)'
    if (gradient.includes('indigo-purple')) return 'linear-gradient(to bottom right, #6366f1, #a855f7, #7c3aed)'
    if (gradient.includes('navy-blue')) return 'linear-gradient(to bottom right, #1e3a8a, #2563eb, #3b82f6)'
    if (gradient.includes('radial-blue')) return 'radial-gradient(ellipse at center, #2563eb, #1e40af, #111827)'

    // Verde
    if (gradient.includes('green-blue')) return 'linear-gradient(to bottom right, #22c55e, #0d9488, #1d4ed8)'
    if (gradient.includes('green-yellow')) return 'linear-gradient(to bottom right, #22c55e, #84cc16, #eab308)'
    if (gradient.includes('teal-green')) return 'linear-gradient(to bottom right, #14b8a6, #10b981, #059669)'
    if (gradient.includes('emerald-cyan')) return 'linear-gradient(to bottom right, #10b981, #06b6d4, #0891b2)'

    // Rosso/Arancione
    if (gradient.includes('red-orange')) return 'linear-gradient(to bottom right, #ef4444, #f97316, #fbbf24)'
    if (gradient.includes('red-pink')) return 'linear-gradient(to bottom right, #ef4444, #ec4899, #f472b6)'
    if (gradient.includes('orange-pink')) return 'linear-gradient(to bottom right, #f97316, #ec4899, #9333ea)'
    if (gradient.includes('gold-orange')) return 'linear-gradient(to bottom right, #fbbf24, #f59e0b, #f97316)'
    if (gradient.includes('peach-pink')) return 'linear-gradient(to bottom right, #fdba74, #fb7185, #f472b6)'

    // Viola/Rosa
    if (gradient.includes('purple-blue')) return 'linear-gradient(to bottom right, #a855f7, #6366f1, #3b82f6)'
    if (gradient.includes('pink-purple')) return 'linear-gradient(to bottom right, #ec4899, #a855f7, #7c3aed)'
    if (gradient.includes('magenta-purple')) return 'linear-gradient(to bottom right, #e879f9, #c026d3, #9333ea)'
    if (gradient.includes('lavender-pink')) return 'linear-gradient(to bottom right, #c4b5fd, #f0abfc, #f9a8d4)'

    // Scuri
    if (gradient.includes('black-gray')) return 'linear-gradient(to bottom right, #111827, #1f2937, #000000)'
    if (gradient.includes('black-blue')) return 'linear-gradient(to bottom right, #000000, #1e3a8a, #1e40af)'
    if (gradient.includes('black-purple')) return 'linear-gradient(to bottom right, #000000, #581c87, #7c3aed)'
    if (gradient.includes('charcoal-gray')) return 'linear-gradient(to bottom right, #374151, #4b5563, #6b7280)'

    // Temi speciali
    if (gradient.includes('sunset')) return 'linear-gradient(to bottom right, #f97316, #ef4444, #be123c, #581c87)'
    if (gradient.includes('ocean')) return 'linear-gradient(to bottom right, #06b6d4, #0284c7, #1e40af, #1e3a8a)'
    if (gradient.includes('forest')) return 'linear-gradient(to bottom right, #166534, #15803d, #14532d, #052e16)'
    if (gradient.includes('fire')) return 'linear-gradient(to bottom right, #fbbf24, #f97316, #ef4444, #b91c1c)'
    if (gradient.includes('night')) return 'linear-gradient(to bottom right, #0f172a, #1e1b4b, #312e81, #1e3a8a)'
    if (gradient.includes('aurora')) return 'linear-gradient(to bottom right, #22c55e, #06b6d4, #a855f7, #ec4899)'
    if (gradient.includes('dawn')) return 'linear-gradient(to bottom right, #fef3c7, #fcd34d, #f97316, #be123c)'
    if (gradient.includes('grape')) return 'linear-gradient(to bottom right, #7c3aed, #6d28d9, #5b21b6, #4c1d95)'

    // Default
    return 'linear-gradient(to bottom right, #0047AB, #003380, #111827)'
  }

  // Helper per ottenere il colore solido - usa includes() per caratteri stega
  const getSolidBackground = (color?: string): string => {
    if (!color) return '#0047AB'

    // Blu
    if (color.includes('primary')) return '#0047AB'
    if (color.includes('dark-blue')) return '#1e3a8a'
    if (color.includes('navy')) return '#1e3a5f'
    if (color.includes('sky-blue')) return '#0ea5e9'
    if (color.includes('cyan')) return '#06b6d4'
    if (color.includes('indigo')) return '#6366f1'

    // Verde
    if (color.includes('dark-green')) return '#166534'
    if (color.includes('green')) return '#22c55e'
    if (color.includes('teal')) return '#14b8a6'
    if (color.includes('emerald')) return '#10b981'
    if (color.includes('lime')) return '#84cc16'

    // Rosso/Arancione
    if (color.includes('dark-red')) return '#991b1b'
    if (color.includes('red')) return '#ef4444'
    if (color.includes('bordeaux')) return '#7f1d1d'
    if (color.includes('orange')) return '#f97316'
    if (color.includes('amber')) return '#f59e0b'

    // Viola/Rosa
    if (color.includes('dark-purple')) return '#581c87'
    if (color.includes('purple')) return '#a855f7'
    if (color.includes('magenta')) return '#e879f9'
    if (color.includes('dark-pink')) return '#be185d'
    if (color.includes('pink')) return '#ec4899'
    if (color.includes('fuchsia')) return '#d946ef'

    // Neutri
    if (color.includes('black')) return '#000000'
    if (color.includes('gray-dark')) return '#1f2937'
    if (color.includes('gray')) return '#6b7280'
    if (color.includes('charcoal')) return '#374151'
    if (color.includes('dark-brown')) return '#78350f'
    if (color.includes('brown')) return '#a16207'

    // Altri
    if (color.includes('yellow')) return '#eab308'
    if (color.includes('gold')) return '#fbbf24'
    if (color.includes('white')) return '#ffffff'
    if (color.includes('cream')) return '#fef3c7'

    // Default
    return '#0047AB'
  }

  const backgroundUrl = isValidImage(data.backgroundImage)
    ? safeImageUrl(data.backgroundImage, 1920)
    : null

  const height = data.height || 'large'
  const position = data.contentPosition || 'left'
  const width = data.contentWidth || 'medium'
  const titleSize = data.titleSize || 'large'
  const textColor = data.textColor || 'white'
  const showScroll = data.showScrollIndicator !== false
  const backgroundType = data.backgroundType || 'image'
  const animationVariants = getAnimationVariants()

  // Merge legacy button with new buttons array
  const buttons = data.buttons?.length
    ? data.buttons
    : data.buttonText && data.buttonLink
    ? [{ _key: 'legacy', text: data.buttonText, link: data.buttonLink, variant: 'primary' as const }]
    : []

  return (
    <section
      ref={containerRef}
      className={`relative flex overflow-hidden ${heightClasses[height]} ${positionClasses[position]}`}
      style={height === 'custom' && data.customHeight ? { minHeight: `${data.customHeight}px` } : undefined}
    >
      {/* Background based on type - usa includes() per caratteri stega */}
      {backgroundType?.includes('image') && backgroundUrl && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <Image
            src={backgroundUrl}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className={`absolute inset-0 ${getOverlayClass()}`} />
        </motion.div>
      )}

      {/* Gradient background - usa includes() per gestire caratteri stega */}
      {backgroundType?.includes('gradient') && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            background: getGradientBackground(data.backgroundGradient)
          }}
        />
      )}

      {/* Solid background - usa includes() per gestire caratteri stega */}
      {backgroundType?.includes('solid') && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            backgroundColor: getSolidBackground(data.backgroundColor)
          }}
        />
      )}

      {/* Default gradient if image selected but no image uploaded */}
      {backgroundType?.includes('image') && !backgroundUrl && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            background: 'linear-gradient(to bottom right, #0047AB, #003380, #111827)'
          }}
        />
      )}

      {/* Floating decorative elements */}
      {data.floatingElements?.map((element) => (
        <motion.div
          key={element._key}
          className={`absolute z-5 ${
            element.position === 'top-left' ? 'top-10 left-10' :
            element.position === 'top-right' ? 'top-10 right-10' :
            element.position === 'bottom-left' ? 'bottom-10 left-10' :
            'bottom-10 right-10'
          } ${
            element.size === 'sm' ? 'w-20 h-20' :
            element.size === 'lg' ? 'w-40 h-40' :
            'w-32 h-32'
          } ${
            element.type === 'circle' ? 'rounded-full' :
            element.type === 'square' ? 'rounded-lg' :
            element.type === 'blob' ? 'rounded-[40%_60%_70%_30%/40%_50%_60%_50%]' :
            'h-1 w-32'
          } ${
            element.color === 'white' ? 'bg-white' :
            element.color === 'black' ? 'bg-black' :
            element.color === 'secondary' ? 'bg-secondary' :
            'bg-primary'
          }`}
          style={{ opacity: (element.opacity ?? 20) / 100 }}
          animate={element.animated ? {
            y: [0, -20, 0],
            rotate: element.type === 'blob' ? [0, 5, -5, 0] : 0,
          } : undefined}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Content */}
      <motion.div
        className={`container-glos relative z-10 py-20 flex flex-col ${
          position.includes('center') ? 'items-center' :
          position.includes('right') ? 'items-end' :
          'items-start'
        }`}
        style={{ opacity: contentOpacity }}
      >
        <motion.div
          {...animationVariants}
          className={`${widthClasses[width]} ${textColorClasses[textColor]}`}
        >
          {/* Badge */}
          {!!data.badge?.text && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`inline-block px-4 py-1 rounded-full text-white text-sm font-semibold mb-4 ${
                badgeColorClasses[data.badge.color || 'blue']
              }`}
            >
              {t(data.badge.text)}
            </motion.div>
          )}

          {/* Eyebrow */}
          {!!data.eyebrow && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base font-semibold tracking-widest uppercase mb-4 opacity-80"
            >
              {t(data.eyebrow)}
            </motion.p>
          )}

          {/* Title */}
          <h1 className={`font-bold mb-6 ${titleSizeClasses[titleSize]}`}>
            <RichText value={data.title} />
          </h1>

          {/* Subtitle */}
          {!!data.subtitle && (
            <div className="text-xl md:text-2xl mb-10 opacity-90">
              <RichText value={data.subtitle} />
            </div>
          )}

          {/* Buttons */}
          {buttons.length > 0 && (
            <div className={`flex flex-wrap gap-4 ${
              position.includes('center') ? 'justify-center' :
              position.includes('right') ? 'justify-end' :
              'justify-start'
            }`}>
              {buttons.map((button, index) => (
                <Link
                  key={button._key}
                  href={button.link || '#'}
                  className={`inline-flex items-center gap-2 ${
                    buttonVariantClasses[button.variant || 'primary']
                  }`}
                >
                  {button.iconPosition === 'left' && button.icon && getIcon(button.icon)}
                  {t(button.text)}
                  {(button.iconPosition !== 'left' || !button.icon) && (
                    index === 0 ? getIcon(button.icon || 'arrow-right') : button.icon && getIcon(button.icon)
                  )}
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      {showScroll && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {!!data.scrollIndicatorText && (
            <p className={`text-sm mb-2 opacity-60 ${textColorClasses[textColor]}`}>
              {t(data.scrollIndicatorText)}
            </p>
          )}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`opacity-60 ${textColorClasses[textColor]}`}
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
