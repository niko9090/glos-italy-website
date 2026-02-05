// CTA Section Component - VERSIONE AVANZATA
'use client'

import { useRef, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Phone, Mail, ArrowRight, MessageCircle, Check } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { sl, cs } from '@/lib/utils/stegaSafe'
import { useLanguage } from '@/lib/context/LanguageContext'
import { getSpacingClasses } from '@/lib/utils/spacing'
import RichText from '@/components/RichText'

interface CTAButton {
  _key: string
  text?: unknown
  link?: string
  variant?: 'primary' | 'secondary' | 'white' | 'dark' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: string
  iconPosition?: 'left' | 'right'
}

interface Highlight {
  _key: string
  icon?: string
  text?: unknown
}

interface CTASectionProps {
  documentId?: string
  sectionKey?: string
  data: {
    // Content
    eyebrow?: unknown
    title?: unknown
    subtitle?: unknown
    description?: unknown
    highlights?: Highlight[]
    badge?: {
      text?: unknown
      color?: 'red' | 'green' | 'yellow' | 'blue' | 'purple'
    }
    // Buttons
    buttons?: CTAButton[]
    buttonText?: unknown // Legacy
    buttonLink?: string // Legacy
    // Contact
    showContactInfo?: boolean
    phone?: string
    email?: string
    whatsapp?: string
    // Media
    backgroundType?: 'solid' | 'gradient' | 'image' | 'video' | 'pattern'
    backgroundColor?: string
    gradient?: string
    gradientDirection?: string
    backgroundImage?: any
    overlayOpacity?: number
    decorativeImage?: any
    decorativeImagePosition?: 'left' | 'right' | 'background'
    pattern?: string
    // Layout
    layout?: 'centered' | 'left' | 'right' | 'split' | 'with-image' | 'minimal' | 'floating-card'
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    fullWidth?: boolean
    contentWidth?: 'narrow' | 'normal' | 'wide'
    // Spacing
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string // legacy
    marginTop?: string
    marginBottom?: string
    // Style
    textColor?: 'auto' | 'white' | 'black'
    titleSize?: 'normal' | 'large' | 'xl' | 'xxl'
    borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    shadow?: 'none' | 'sm' | 'md' | 'lg'
    showDecorations?: boolean
    // Animation
    animation?: 'none' | 'fade' | 'fade-up' | 'zoom' | 'slide-left' | 'slide-right'
    backgroundAnimation?: 'none' | 'gradient' | 'pulse' | 'parallax' | 'particles'
    buttonAnimation?: 'none' | 'pulse' | 'bounce' | 'glow' | 'shake'
    // Countdown
    showCountdown?: boolean
    countdownDate?: string
    countdownLabel?: unknown
  }
}

export default function CTASection({ data, documentId, sectionKey }: CTASectionProps) {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', data.backgroundAnimation?.includes('parallax') ? '20%' : '0%'])

  // Background classes based on type
  const getBackgroundClasses = () => {
    const bgType = data.backgroundType || 'gradient'

    if (bgType?.includes('solid')) {
      const solidColors: Record<string, string> = {
        primary: 'bg-primary',
        'primary-dark': 'bg-blue-900',
        black: 'bg-black',
        'gray-dark': 'bg-gray-800',
        white: 'bg-white',
        green: 'bg-green-600',
        red: 'bg-red-600',
        purple: 'bg-purple-600',
        orange: 'bg-orange-600',
      }
      return sl(solidColors, data.backgroundColor, 'primary')
    }

    if (bgType?.includes('gradient')) {
      const gradients: Record<string, string> = {
        'blue-dark': 'bg-gradient-to-r from-primary via-primary-dark to-blue-900',
        'blue-purple': 'bg-gradient-to-r from-blue-600 via-purple-600 to-purple-900',
        'green-blue': 'bg-gradient-to-r from-green-500 via-teal-600 to-blue-700',
        'orange-pink': 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600',
        'purple-pink': 'bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500',
        'black-blue': 'bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900',
        'black-gray': 'bg-gradient-to-r from-gray-800 via-gray-900 to-black',
        'metal': 'metal-gradient',
        'metal-dark': 'metal-dark',
        'metal-chrome': 'metal-chrome',
        'radial-blue': 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600 via-blue-800 to-gray-900',
        'radial-purple': 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600 via-purple-800 to-gray-900',
        'animated-blue': 'gradient-animated bg-gradient-to-r from-primary via-blue-600 to-primary-dark',
        'animated-purple': 'gradient-animated bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600',
      }
      const direction = data.gradientDirection || 'to-r'
      let gradientClass = sl(gradients, data.gradient, 'blue-dark')
      if (direction !== 'to-r' && !gradientClass.includes('radial') && !gradientClass.includes('animated')) {
        gradientClass = gradientClass.replace('to-r', direction)
      }
      return gradientClass
    }

    if (bgType?.includes('pattern')) {
      return 'bg-primary'
    }

    return ''
  }

  // Text color based on background
  const getTextColor = () => {
    if (data.textColor?.includes('white')) return 'text-white'
    if (data.textColor?.includes('black')) return 'text-gray-900'

    // Auto - check background
    const lightBgs = ['white']
    const bgColor = data.backgroundColor || ''
    return lightBgs.includes(bgColor) ? 'text-gray-900' : 'text-white'
  }

  // Size classes
  const sizeClasses: Record<string, string> = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20',
    xl: 'py-28',
    full: 'min-h-screen flex items-center',
  }

  // Padding classes
  const paddingClasses: Record<string, string> = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-20',
    xl: 'py-28',
  }

  // Content width classes
  const contentWidthClasses: Record<string, string> = {
    narrow: 'max-w-xl',
    normal: 'max-w-3xl',
    wide: 'max-w-5xl',
  }

  // Title size classes
  const titleSizeClasses: Record<string, string> = {
    normal: 'text-2xl md:text-3xl',
    large: 'text-3xl md:text-4xl',
    xl: 'text-4xl md:text-5xl',
    xxl: 'text-5xl md:text-6xl',
  }

  // Border radius classes
  const borderRadiusClasses: Record<string, string> = {
    none: '',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
  }

  // Shadow classes
  const shadowClasses: Record<string, string> = {
    none: '',
    sm: 'shadow-lg',
    md: 'shadow-xl',
    lg: 'shadow-2xl',
  }

  // Animation variants
  const getAnimationVariants = () => {
    switch (cs(data.animation)) {
      case 'none':
        return { initial: {}, animate: {} }
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.6 } },
        }
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
        }
      case 'slide-left':
        return {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
        }
      case 'slide-right':
        return {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
        }
      default: // fade-up
        return {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }
    }
  }

  // Button animation classes
  const buttonAnimationClasses: Record<string, string> = {
    none: '',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    glow: 'shadow-lg shadow-white/25 hover:shadow-white/50',
    shake: 'hover:animate-[shake_0.5s_ease-in-out]',
  }

  // Button variant classes
  const buttonVariantClasses: Record<string, string> = {
    primary: 'bg-white text-primary hover:bg-gray-100',
    secondary: 'border-2 border-white text-white hover:bg-white hover:text-gray-900',
    white: 'bg-white text-gray-900 hover:bg-gray-100',
    dark: 'bg-gray-900 text-white hover:bg-gray-800',
    ghost: 'text-white hover:bg-white/10 border border-white/30',
    gradient: 'bg-gradient-to-r from-white to-gray-100 text-primary hover:from-gray-100 hover:to-white',
  }

  // Button size classes
  const buttonSizeClasses: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  }

  // Badge color classes
  const badgeColorClasses: Record<string, string> = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  }

  // Icon mapping
  const getIcon = (iconName?: string): ReactNode => {
    switch (cs(iconName)) {
      case 'arrow-right':
      case '→':
        return <ArrowRight className="w-5 h-5" />
      case 'phone':
      case '📞':
        return <Phone className="w-5 h-5" />
      case 'email':
      case '✉️':
        return <Mail className="w-5 h-5" />
      case 'whatsapp':
      case '💬':
        return <MessageCircle className="w-5 h-5" />
      default:
        return iconName ? <span>{iconName}</span> : <ArrowRight className="w-5 h-5" />
    }
  }

  const backgroundUrl = isValidImage(data.backgroundImage) ? safeImageUrl(data.backgroundImage, 1920) : null
  const decorativeUrl = isValidImage(data.decorativeImage) ? safeImageUrl(data.decorativeImage, 800) : null

  const layout = data.layout || 'centered'
  const textColor = getTextColor()
  const animationVariants = getAnimationVariants()

  // Merge legacy button with new buttons array
  const buttons = data.buttons?.length
    ? data.buttons
    : data.buttonText && data.buttonLink
    ? [{ _key: 'legacy', text: data.buttonText, link: data.buttonLink, variant: 'primary' as const }]
    : []

  // Layout specific classes
  const getLayoutClasses = () => {
    if (layout?.includes('left') && !layout?.includes('slide')) return 'text-left items-start'
    if (layout?.includes('right') && !layout?.includes('slide')) return 'text-right items-end'
    if (layout?.includes('split')) return 'text-left'
    if (layout?.includes('minimal')) return 'text-center items-center'
    if (layout?.includes('floating-card')) return 'text-center items-center'
    return 'text-center items-center'
  }

  return (
    <section
      data-sanity-edit-target
      ref={sectionRef}
      className={`relative overflow-hidden ${
        data.fullWidth !== false ? '' : 'container-glos my-8'
      } ${data.size ? sl(sizeClasses, data.size, 'md') : getSpacingClasses(data)} ${
        data.fullWidth !== false ? getBackgroundClasses() : ''
      } ${textColor} ${sl(borderRadiusClasses, data.borderRadius, 'none')} ${sl(shadowClasses, data.shadow, 'none')}`}
    >
      {/* Background Image/Video */}
      {data.backgroundType?.includes('image') && backgroundUrl && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: parallaxY }}
        >
          <Image
            src={backgroundUrl}
            alt=""
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: (data.overlayOpacity ?? 50) / 100 }}
          />
        </motion.div>
      )}

      {/* Gradient Background (when not full width) */}
      {data.fullWidth === false && (
        <div className={`absolute inset-0 ${getBackgroundClasses()} ${sl(borderRadiusClasses, data.borderRadius, 'none')}`} />
      )}

      {/* SEMPRE VISIBILE: Particelle animate */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`cta-particle-${i}`}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${15 + i * 10}px`,
              height: `${15 + i * 10}px`,
              left: `${15 + i * 18}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
        {/* Linea luminosa animata */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Decorations */}
      {data.showDecorations && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </>
      )}

      {/* Pattern overlay */}
      {data.backgroundType?.includes('pattern') && data.pattern && (
        <div className={`absolute inset-0 opacity-10 ${
          data.pattern?.includes('dots') ? 'bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:20px_20px]' :
          data.pattern?.includes('grid') ? 'bg-[linear-gradient(to_right,_white_1px,_transparent_1px),_linear-gradient(to_bottom,_white_1px,_transparent_1px)] bg-[size:40px_40px]' :
          data.pattern?.includes('diagonal') ? 'bg-[repeating-linear-gradient(45deg,_transparent,_transparent_10px,_white_10px,_white_11px)]' :
          ''
        }`} />
      )}

      <div className={`container-glos relative z-10 ${layout?.includes('split') ? 'grid md:grid-cols-2 gap-12 items-center' : ''}`}>
        <motion.div
          {...animationVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className={`flex flex-col ${getLayoutClasses()} ${!layout?.includes('split') ? sl(contentWidthClasses, data.contentWidth, 'normal') : ''} ${layout?.includes('centered') || layout?.includes('minimal') ? 'mx-auto' : ''}`}
        >
          {/* Badge */}
          {!!data.badge?.text && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`inline-block px-4 py-1 rounded-full text-white text-sm font-semibold mb-4 ${
                sl(badgeColorClasses, data.badge.color, 'blue')
              }`}
            >
              {String(t(data.badge.text) || '')}
            </motion.span>
          )}

          {/* Eyebrow */}
          {!!data.eyebrow && (
            <p className="text-sm font-semibold tracking-widest uppercase mb-4 opacity-80">
              {String(t(data.eyebrow) || '')}
            </p>
          )}

          {/* Title */}
          <h2 className={`font-bold mb-4 ${sl(titleSizeClasses, data.titleSize, 'large')}`}>
            <RichText value={data.title} />
          </h2>

          {/* Subtitle */}
          {!!data.subtitle && (
            <div className="text-xl mb-4 opacity-90">
              <RichText value={data.subtitle} />
            </div>
          )}

          {/* Description */}
          {!!data.description && (
            <p className="mb-6 opacity-80">
              {String(t(data.description) || '')}
            </p>
          )}

          {/* Highlights */}
          {data.highlights && data.highlights.length > 0 && (
            <div className={`flex flex-wrap gap-4 mb-8 ${layout?.includes('centered') ? 'justify-center' : ''}`}>
              {data.highlights.map((highlight) => (
                <div key={highlight._key} className="flex items-center gap-2">
                  <span className="text-lg">{highlight.icon ? String(highlight.icon) : <Check className="w-5 h-5" />}</span>
                  <span className="text-sm">{String(t(highlight.text) || '')}</span>
                </div>
              ))}
            </div>
          )}

          {/* Buttons con glow effect */}
          {buttons.length > 0 && (
            <div className={`flex flex-wrap gap-4 ${layout?.includes('centered') || layout?.includes('minimal') ? 'justify-center' : layout?.includes('right') && !layout?.includes('slide') ? 'justify-end' : 'justify-start'}`}>
              {buttons.map((button, index) => (
                <motion.div
                  key={button._key}
                  whileHover={{
                    scale: 1.08,
                    boxShadow: index === 0
                      ? '0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.3)'
                      : '0 0 25px rgba(255,255,255,0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-lg"
                >
                  <Link
                    href={button.link || '#'}
                    className={`inline-flex items-center gap-2 rounded-lg font-semibold transition-all duration-300 ${
                      sl(buttonVariantClasses, button.variant, 'primary')
                    } ${sl(buttonSizeClasses, button.size, 'lg')} ${
                      index === 0 ? `${sl(buttonAnimationClasses, data.buttonAnimation, 'none')} shadow-lg shadow-white/30` : ''
                    }`}
                  >
                    {button.iconPosition === 'left' && button.icon ? getIcon(button.icon) : null}
                    {String(t(button.text) || '')}
                    {(button.iconPosition !== 'left' || !button.icon) && (
                      index === 0 ? getIcon(button.icon || 'arrow-right') : (button.icon ? getIcon(button.icon) : null)
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Contact Info */}
          {data.showContactInfo && (data.phone || data.email || data.whatsapp) && (
            <div className={`flex flex-wrap gap-6 mt-8 ${layout?.includes('centered') ? 'justify-center' : ''}`}>
              {data.phone && (
                <a
                  href={`tel:${data.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Phone className="w-5 h-5" />
                  <span>{data.phone}</span>
                </a>
              )}
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Mail className="w-5 h-5" />
                  <span>{data.email}</span>
                </a>
              )}
              {data.whatsapp && (
                <a
                  href={`https://wa.me/${data.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          )}
        </motion.div>

        {/* Decorative Image (for split layout) */}
        {layout?.includes('split') && decorativeUrl && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square md:aspect-auto md:h-[400px]"
          >
            <Image
              src={decorativeUrl}
              alt=""
              fill
              className="object-contain"
            />
          </motion.div>
        )}
      </div>

      {/* Decorative Image (positioned absolutely) */}
      {!layout?.includes('split') && decorativeUrl && data.decorativeImagePosition && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`absolute z-5 ${
            data.decorativeImagePosition?.includes('left') ? 'left-0 top-1/2 -translate-y-1/2 w-1/3' :
            data.decorativeImagePosition?.includes('right') ? 'right-0 top-1/2 -translate-y-1/2 w-1/3' :
            'inset-0 opacity-20'
          }`}
        >
          <Image
            src={decorativeUrl}
            alt=""
            fill
            className="object-contain"
          />
        </motion.div>
      )}
    </section>
  )
}
