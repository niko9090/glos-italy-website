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

  // Overlay classes
  const getOverlayClass = () => {
    const opacity = data.overlayOpacity ?? 50
    const opacityValue = opacity / 100

    switch (data.overlayType) {
      case 'none':
        return ''
      case 'dark':
        return `bg-black/${Math.round(opacityValue * 100)}`
      case 'gradient-left':
        return `bg-gradient-to-r from-black/${Math.round(opacityValue * 100)} via-black/${Math.round(opacityValue * 50)} to-transparent`
      case 'gradient-right':
        return `bg-gradient-to-l from-black/${Math.round(opacityValue * 100)} via-black/${Math.round(opacityValue * 50)} to-transparent`
      case 'gradient-bottom':
        return `bg-gradient-to-t from-black/${Math.round(opacityValue * 100)} via-black/${Math.round(opacityValue * 50)} to-transparent`
      case 'vignette':
        return 'bg-radial-vignette'
      default:
        return `bg-gradient-to-r from-black/80 via-black/50 to-transparent`
    }
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
      {/* Background based on type */}
      {backgroundType === 'image' && backgroundUrl && (
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

      {/* Gradient background */}
      {backgroundType === 'gradient' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            background: data.backgroundGradient === 'blue-purple'
              ? 'linear-gradient(to bottom right, #2563eb, #9333ea, #581c87)'
              : data.backgroundGradient === 'green-blue'
              ? 'linear-gradient(to bottom right, #22c55e, #0d9488, #1d4ed8)'
              : data.backgroundGradient === 'orange-pink'
              ? 'linear-gradient(to bottom right, #f97316, #ec4899, #9333ea)'
              : data.backgroundGradient === 'black-gray'
              ? 'linear-gradient(to bottom right, #111827, #1f2937, #000000)'
              : data.backgroundGradient === 'radial-blue'
              ? 'radial-gradient(ellipse at center, #2563eb, #1e40af, #111827)'
              : 'linear-gradient(to bottom right, #0047AB, #003380, #111827)'
          }}
        />
      )}

      {/* Solid background */}
      {backgroundType === 'solid' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            backgroundColor: data.backgroundColor === 'dark-blue'
              ? '#1e3a8a'
              : data.backgroundColor === 'black'
              ? '#000000'
              : data.backgroundColor === 'gray-dark'
              ? '#1f2937'
              : '#0047AB'
          }}
        />
      )}

      {/* Default gradient if image selected but no image uploaded */}
      {backgroundType === 'image' && !backgroundUrl && (
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
