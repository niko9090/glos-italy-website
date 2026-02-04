// Strengths Section Component - Company strengths/key points display
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Shield,
  Zap,
  Award,
  Users,
  Globe,
  Wrench,
  Heart,
  Star,
  CheckCircle,
  Target,
  Lightbulb,
  TrendingUp,
  Clock,
  ThumbsUp,
  BadgeCheck,
  Sparkles,
} from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import { getSpacingClasses } from '@/lib/utils/spacing'
import RichText from '@/components/RichText'

// Icon mapping for Lucide icons
const lucideIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  zap: Zap,
  award: Award,
  users: Users,
  globe: Globe,
  wrench: Wrench,
  heart: Heart,
  star: Star,
  check: CheckCircle,
  target: Target,
  lightbulb: Lightbulb,
  trending: TrendingUp,
  clock: Clock,
  thumbsup: ThumbsUp,
  badge: BadgeCheck,
  sparkles: Sparkles,
}

interface StrengthItem {
  _key: string
  icon?: string
  lucideIcon?: string
  iconImage?: any
  title?: unknown
  description?: unknown
  highlight?: boolean
  color?: 'primary' | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan' | 'gold'
}

interface StrengthsSectionProps {
  data: {
    // Content
    eyebrow?: unknown
    title?: unknown
    subtitle?: unknown
    description?: unknown
    items?: StrengthItem[]
    // Layout
    layout?: 'grid-2' | 'grid-3' | 'grid-4' | 'list' | 'centered' | 'alternating'
    iconPosition?: 'top' | 'left' | 'inline'
    iconSize?: 'sm' | 'md' | 'lg' | 'xl'
    iconStyle?: 'simple' | 'filled' | 'outlined' | 'gradient' | 'circle'
    textAlign?: 'left' | 'center' | 'right'
    // Style
    backgroundColor?: 'white' | 'gray-light' | 'gray' | 'primary' | 'primary-light' | 'gradient-blue' | 'gradient-dark' | 'metal' | 'metal-dark'
    textColor?: 'auto' | 'dark' | 'light'
    cardStyle?: 'none' | 'elevated' | 'bordered' | 'glass' | 'gradient'
    // Decoration
    backgroundImage?: any
    backgroundImageOpacity?: number
    decorativeElements?: 'none' | 'circles' | 'grid' | 'waves' | 'geometric'
    // Spacing
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string
    marginTop?: string
    marginBottom?: string
    // Animation
    animation?: 'none' | 'fade' | 'fade-up' | 'stagger' | 'zoom'
    hoverEffect?: 'none' | 'lift' | 'glow' | 'scale'
  }
}

export default function StrengthsSection({ data }: StrengthsSectionProps) {
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
    metal: 'bg-gradient-to-b from-metal-100 via-metal-50 to-white',
    'metal-dark': 'bg-gradient-to-b from-metal-800 via-metal-700 to-metal-900',
  }

  // Text color determination
  const getTextColor = () => {
    if (data.textColor === 'dark') return 'text-gray-900'
    if (data.textColor === 'light') return 'text-white'
    const darkBgs = ['primary', 'gradient-blue', 'gradient-dark', 'metal-dark']
    return darkBgs.includes(data.backgroundColor || 'white') ? 'text-white' : 'text-gray-900'
  }

  // Color accent mapping
  const colorAccents: Record<string, { bg: string; text: string; gradient: string; glow: string }> = {
    primary: { bg: 'bg-primary/10', text: 'text-primary', gradient: 'from-primary to-blue-600', glow: 'rgba(0, 71, 171, 0.4)' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-700', glow: 'rgba(59, 130, 246, 0.4)' },
    green: { bg: 'bg-green-100', text: 'text-green-600', gradient: 'from-green-500 to-green-700', glow: 'rgba(34, 197, 94, 0.4)' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', gradient: 'from-purple-500 to-purple-700', glow: 'rgba(168, 85, 247, 0.4)' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600', gradient: 'from-orange-500 to-orange-700', glow: 'rgba(249, 115, 22, 0.4)' },
    red: { bg: 'bg-red-100', text: 'text-red-600', gradient: 'from-red-500 to-red-700', glow: 'rgba(239, 68, 68, 0.4)' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', gradient: 'from-cyan-500 to-cyan-700', glow: 'rgba(6, 182, 212, 0.4)' },
    gold: { bg: 'bg-yellow-100', text: 'text-yellow-600', gradient: 'from-yellow-500 to-amber-600', glow: 'rgba(234, 179, 8, 0.4)' },
  }

  // Icon size classes
  const iconSizeClasses: Record<string, { wrapper: string; icon: string }> = {
    sm: { wrapper: 'w-10 h-10', icon: 'w-5 h-5' },
    md: { wrapper: 'w-14 h-14', icon: 'w-7 h-7' },
    lg: { wrapper: 'w-18 h-18', icon: 'w-9 h-9' },
    xl: { wrapper: 'w-24 h-24', icon: 'w-12 h-12' },
  }

  // Get icon style classes
  const getIconStyleClasses = (color: string = 'primary') => {
    const accent = colorAccents[color] || colorAccents.primary
    const size = iconSizeClasses[data.iconSize || 'lg']

    switch (data.iconStyle) {
      case 'simple':
        return `${size.wrapper} ${accent.text} flex items-center justify-center`
      case 'outlined':
        return `${size.wrapper} border-2 ${accent.text} border-current rounded-xl flex items-center justify-center`
      case 'gradient':
        return `${size.wrapper} bg-gradient-to-br ${accent.gradient} text-white rounded-xl flex items-center justify-center shadow-lg`
      case 'circle':
        return `${size.wrapper} ${accent.bg} ${accent.text} rounded-full flex items-center justify-center`
      default: // filled
        return `${size.wrapper} ${accent.bg} ${accent.text} rounded-xl flex items-center justify-center`
    }
  }

  // Layout grid classes
  const getLayoutClasses = () => {
    switch (data.layout) {
      case 'grid-2':
        return 'grid grid-cols-1 md:grid-cols-2 gap-8'
      case 'grid-4':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
      case 'list':
        return 'flex flex-col gap-6 max-w-3xl mx-auto'
      case 'centered':
        return 'flex flex-col gap-8 max-w-2xl mx-auto items-center'
      case 'alternating':
        return 'flex flex-col gap-8 max-w-4xl mx-auto'
      default: // grid-3
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
    }
  }

  // Card style classes
  const getCardClasses = () => {
    const baseClasses = 'relative rounded-2xl transition-all duration-300'

    switch (data.cardStyle) {
      case 'elevated':
        return `${baseClasses} bg-white p-6 lg:p-8 shadow-lg hover:shadow-2xl`
      case 'bordered':
        return `${baseClasses} bg-white p-6 lg:p-8 border-2 border-gray-200 hover:border-primary`
      case 'glass':
        return `${baseClasses} bg-white/10 backdrop-blur-xl p-6 lg:p-8 border border-white/20 hover:bg-white/15`
      case 'gradient':
        return `${baseClasses} bg-gradient-to-br from-white/15 to-white/5 p-6 lg:p-8 border border-white/10`
      default: // none
        return `${baseClasses} p-4`
    }
  }

  // Hover animation
  const getHoverAnimation = (color: string = 'primary') => {
    const accent = colorAccents[color] || colorAccents.primary

    switch (data.hoverEffect) {
      case 'lift':
        return {
          y: -8,
          transition: { duration: 0.3 },
        }
      case 'glow':
        return {
          boxShadow: `0 0 40px ${accent.glow}`,
          transition: { duration: 0.3 },
        }
      case 'scale':
        return {
          scale: 1.03,
          transition: { duration: 0.3 },
        }
      default:
        return {}
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
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  }

  const backgroundColor = data.backgroundColor || 'white'
  const textColor = getTextColor()
  const isDarkBg = ['primary', 'gradient-blue', 'gradient-dark', 'metal-dark'].includes(backgroundColor)

  // Render icon
  const renderIcon = (item: StrengthItem) => {
    const iconSize = iconSizeClasses[data.iconSize || 'lg']

    // Custom image icon
    if (item.iconImage && isValidImage(item.iconImage)) {
      return (
        <div className={`${iconSize.wrapper} relative`}>
          <Image
            src={safeImageUrl(item.iconImage, 96) || ''}
            alt=""
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
      )
    }

    // Lucide icon
    if (item.lucideIcon && lucideIcons[item.lucideIcon]) {
      const LucideIcon = lucideIcons[item.lucideIcon]
      return (
        <div className={getIconStyleClasses(item.color)}>
          <LucideIcon className={iconSize.icon} />
        </div>
      )
    }

    // Emoji icon
    if (item.icon) {
      return (
        <div className={`${getIconStyleClasses(item.color)} text-3xl lg:text-4xl`}>
          {item.icon}
        </div>
      )
    }

    return null
  }

  // Decorative elements renderer
  const renderDecorativeElements = () => {
    switch (data.decorativeElements) {
      case 'circles':
        return (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
          </>
        )
      case 'grid':
        return (
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(0,71,171,.15) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,71,171,.15) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        )
      case 'waves':
        return (
          <svg className="absolute bottom-0 left-0 w-full h-32 opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        )
      case 'geometric':
        return (
          <>
            <div className="absolute top-20 left-10 w-16 h-16 border-2 border-primary/20 rotate-45" />
            <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-primary/10 rounded-full" />
            <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-primary/10 rotate-12" />
            <div className="absolute bottom-1/3 left-1/5 w-12 h-12 border border-primary/15 rounded-lg rotate-6" />
          </>
        )
      default:
        return null
    }
  }

  return (
    <section
      ref={sectionRef}
      className={`${getSpacingClasses(data)} ${bgClasses[backgroundColor]} ${textColor} overflow-hidden relative`}
    >
      {/* Background Image */}
      {data.backgroundImage && isValidImage(data.backgroundImage) && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${safeImageUrl(data.backgroundImage, 1920)})`,
            opacity: (data.backgroundImageOpacity || 10) / 100,
          }}
        />
      )}

      {/* Decorative Elements */}
      {data.decorativeElements && data.decorativeElements !== 'none' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {renderDecorativeElements()}
        </div>
      )}

      <div className="container-glos relative z-10">
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
              <p className={`text-sm font-semibold tracking-widest uppercase mb-4 ${isDarkBg ? 'text-white/80' : 'text-primary'}`}>
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

        {/* Strengths Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className={getLayoutClasses()}
        >
          {data.items?.map((item, index) => {
            const isAlternate = data.layout === 'alternating' && index % 2 === 1

            return (
              <motion.div
                key={item._key}
                variants={itemVariants}
                whileHover={getHoverAnimation(item.color)}
                className={`
                  ${getCardClasses()}
                  ${item.highlight ? 'ring-2 ring-primary ring-offset-2' : ''}
                  ${data.iconPosition === 'left' || data.iconPosition === 'inline' ? 'flex items-start gap-4' : ''}
                  ${isAlternate ? 'md:flex-row-reverse' : ''}
                `}
              >
                {/* Icon */}
                {renderIcon(item) && (
                  <div
                    className={`
                      flex-shrink-0
                      ${data.iconPosition === 'top' ? 'mb-4' : ''}
                      ${data.textAlign === 'center' && data.iconPosition === 'top' ? 'mx-auto' : ''}
                    `}
                  >
                    {renderIcon(item)}
                  </div>
                )}

                {/* Content */}
                <div
                  className={`
                    flex-1
                    ${data.textAlign === 'center' && data.iconPosition !== 'left' ? 'text-center' : ''}
                  `}
                >
                  {!!item.title && (
                    <h3 className="text-lg lg:text-xl font-semibold mb-2">
                      {String(t(item.title) || '')}
                    </h3>
                  )}
                  {!!item.description && (
                    <p className={`text-sm lg:text-base ${isDarkBg ? 'text-white/70' : 'text-gray-600'} leading-relaxed`}>
                      {String(t(item.description) || '')}
                    </p>
                  )}
                </div>

                {/* Highlight indicator */}
                {item.highlight && (
                  <div className="absolute -top-2 -right-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs">
                      <Star className="w-3 h-3 fill-current" />
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
