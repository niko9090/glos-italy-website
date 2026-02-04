// Trust Badges Section - Qualità Certificata, Made in Italy, etc.
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Shield,
  Award,
  CheckCircle2,
  Leaf,
  Factory,
  Globe2,
  Clock,
  Users,
  Wrench,
  BadgeCheck,
  Medal,
  Star,
} from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import { getSpacingClasses } from '@/lib/utils/spacing'

// Icon mapping
const lucideIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  award: Award,
  check: CheckCircle2,
  leaf: Leaf,
  factory: Factory,
  globe: Globe2,
  clock: Clock,
  users: Users,
  wrench: Wrench,
  badge: BadgeCheck,
  medal: Medal,
  star: Star,
}

interface TrustBadge {
  _key: string
  icon?: string
  lucideIcon?: string
  iconImage?: any
  title?: unknown
  subtitle?: unknown
  highlight?: boolean
}

interface TrustBadgesSectionProps {
  data: {
    eyebrow?: unknown
    title?: unknown
    subtitle?: unknown
    badges?: TrustBadge[]
    layout?: 'horizontal' | 'grid' | 'stacked'
    style?: 'minimal' | 'cards' | 'industrial' | 'premium'
    backgroundColor?: 'white' | 'gray-light' | 'metal' | 'metal-dark' | 'gradient-blue' | 'gradient-dark'
    textColor?: 'auto' | 'dark' | 'light'
    showDecorations?: boolean
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string
    marginTop?: string
    marginBottom?: string
  }
}

export default function TrustBadgesSection({ data }: TrustBadgesSectionProps) {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    'gray-light': 'bg-gray-50',
    metal: 'bg-gradient-to-b from-metal-100 via-metal-50 to-white',
    'metal-dark': 'bg-gradient-to-br from-metal-800 via-metal-700 to-metal-900',
    'gradient-blue': 'bg-gradient-to-br from-primary via-primary-dark to-blue-900',
    'gradient-dark': 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
  }

  const backgroundColor = data.backgroundColor || 'white'
  const isDarkBg = ['metal-dark', 'gradient-blue', 'gradient-dark'].includes(backgroundColor)

  const getTextColor = () => {
    if (data.textColor === 'dark') return 'text-gray-900'
    if (data.textColor === 'light') return 'text-white'
    return isDarkBg ? 'text-white' : 'text-gray-900'
  }

  const textColor = getTextColor()

  // Render badge icon
  const renderIcon = (badge: TrustBadge, size: string = 'w-8 h-8') => {
    if (badge.iconImage && isValidImage(badge.iconImage)) {
      return (
        <Image
          src={safeImageUrl(badge.iconImage, 96) || ''}
          alt=""
          width={48}
          height={48}
          className="object-contain"
        />
      )
    }

    if (badge.lucideIcon && lucideIcons[badge.lucideIcon]) {
      const LucideIcon = lucideIcons[badge.lucideIcon]
      return <LucideIcon className={size} />
    }

    if (badge.icon) {
      return <span className="text-3xl">{badge.icon}</span>
    }

    return <Award className={size} />
  }

  // Render based on style
  const renderBadges = () => {
    const style = data.style || 'industrial'
    const layout = data.layout || 'horizontal'

    switch (style) {
      case 'minimal':
        return renderMinimalStyle(layout)
      case 'cards':
        return renderCardsStyle(layout)
      case 'premium':
        return renderPremiumStyle(layout)
      default: // industrial
        return renderIndustrialStyle(layout)
    }
  }

  // Minimal style - clean, simple
  const renderMinimalStyle = (layout: string) => {
    const layoutClasses = layout === 'grid'
      ? 'grid grid-cols-2 md:grid-cols-4 gap-8'
      : layout === 'stacked'
      ? 'flex flex-col gap-4 max-w-md mx-auto'
      : 'flex flex-wrap justify-center gap-8 md:gap-12'

    return (
      <div className={layoutClasses}>
        {data.badges?.map((badge, index) => (
          <motion.div
            key={badge._key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 ${layout === 'stacked' ? 'justify-start' : 'justify-center'}`}
          >
            <div className={`${isDarkBg ? 'text-white/80' : 'text-primary'}`}>
              {renderIcon(badge, 'w-6 h-6')}
            </div>
            <div>
              <p className="font-semibold text-sm">{String(t(badge.title) || '')}</p>
              {!!badge.subtitle && (
                <p className={`text-xs ${isDarkBg ? 'text-white/60' : 'text-gray-500'}`}>
                  {String(t(badge.subtitle) || '')}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  // Cards style - elevated cards with shadows
  const renderCardsStyle = (layout: string) => {
    const layoutClasses = layout === 'grid'
      ? 'grid grid-cols-2 md:grid-cols-4 gap-6'
      : 'flex flex-wrap justify-center gap-6'

    return (
      <div className={layoutClasses}>
        {data.badges?.map((badge, index) => (
          <motion.div
            key={badge._key}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`
              p-6 rounded-xl text-center
              ${isDarkBg
                ? 'bg-white/10 backdrop-blur-sm border border-white/20'
                : 'bg-white shadow-lg border border-gray-100'
              }
              ${badge.highlight ? 'ring-2 ring-primary ring-offset-2' : ''}
            `}
          >
            <div className={`mx-auto mb-3 ${isDarkBg ? 'text-white' : 'text-primary'}`}>
              {renderIcon(badge, 'w-10 h-10')}
            </div>
            <p className="font-bold text-sm mb-1">{String(t(badge.title) || '')}</p>
            {!!badge.subtitle && (
              <p className={`text-xs ${isDarkBg ? 'text-white/60' : 'text-gray-500'}`}>
                {String(t(badge.subtitle) || '')}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    )
  }

  // Industrial style - metal/steel look
  const renderIndustrialStyle = (layout: string) => {
    const layoutClasses = layout === 'grid'
      ? 'grid grid-cols-2 lg:grid-cols-4 gap-6'
      : 'flex flex-wrap justify-center gap-6 lg:gap-8'

    return (
      <div className={layoutClasses}>
        {data.badges?.map((badge, index) => (
          <motion.div
            key={badge._key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.05 }}
            className={`
              relative group
              ${layout === 'horizontal' ? 'flex-1 min-w-[200px] max-w-[280px]' : ''}
            `}
          >
            {/* Background with industrial effect */}
            <div className={`
              relative p-6 rounded-xl text-center overflow-hidden
              ${isDarkBg
                ? 'bg-gradient-to-br from-white/15 to-white/5 border border-white/20'
                : 'bg-gradient-to-br from-metal-100 to-metal-50 border border-metal-200'
              }
              before:absolute before:inset-0 before:bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.1)_50%,transparent_60%)]
              before:opacity-0 group-hover:before:opacity-100 before:transition-opacity
            `}>
              {/* Metal shine effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon with glow */}
                <div className={`
                  mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center
                  ${isDarkBg
                    ? 'bg-gradient-to-br from-white/20 to-white/5 text-white shadow-lg shadow-white/10'
                    : 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/30'
                  }
                  ${badge.highlight ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent' : ''}
                `}>
                  {renderIcon(badge, 'w-8 h-8')}
                </div>

                <h3 className="font-bold text-base mb-1">{String(t(badge.title) || '')}</h3>
                {!!badge.subtitle && (
                  <p className={`text-sm ${isDarkBg ? 'text-white/60' : 'text-metal-500'}`}>
                    {String(t(badge.subtitle) || '')}
                  </p>
                )}
              </div>

              {/* Corner accent */}
              <div className={`
                absolute -bottom-1 -right-1 w-8 h-8
                ${isDarkBg ? 'bg-white/10' : 'bg-primary/10'}
                transform rotate-45
              `} />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  // Premium style - luxury gold accents
  const renderPremiumStyle = (layout: string) => {
    const layoutClasses = layout === 'grid'
      ? 'grid grid-cols-2 lg:grid-cols-4 gap-8'
      : 'flex flex-wrap justify-center gap-8 lg:gap-12'

    return (
      <div className={layoutClasses}>
        {data.badges?.map((badge, index) => (
          <motion.div
            key={badge._key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className="text-center group"
          >
            {/* Hexagon icon container */}
            <div className="relative mx-auto mb-4 w-20 h-20">
              <div className={`
                absolute inset-0
                ${isDarkBg
                  ? 'bg-gradient-to-br from-yellow-400/30 to-amber-600/30'
                  : 'bg-gradient-to-br from-yellow-400 to-amber-500'
                }
                clip-path-hexagon
                group-hover:scale-110 transition-transform duration-300
              `} />
              <div className={`
                absolute inset-1 flex items-center justify-center
                ${isDarkBg
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-yellow-400'
                  : 'bg-white text-amber-600'
                }
                clip-path-hexagon
              `}>
                {renderIcon(badge, 'w-8 h-8')}
              </div>
            </div>

            <h3 className={`font-bold text-sm mb-1 ${isDarkBg ? 'text-yellow-400' : 'text-gray-900'}`}>
              {String(t(badge.title) || '')}
            </h3>
            {!!badge.subtitle && (
              <p className={`text-xs ${isDarkBg ? 'text-white/50' : 'text-gray-500'}`}>
                {String(t(badge.subtitle) || '')}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <section
      ref={sectionRef}
      className={`${getSpacingClasses(data)} ${bgClasses[backgroundColor]} ${textColor} overflow-hidden relative`}
    >
      {/* Decorative background elements */}
      {data.showDecorations && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl ${isDarkBg ? 'bg-white/5' : 'bg-primary/5'}`} />
          <div className={`absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl ${isDarkBg ? 'bg-white/5' : 'bg-blue-500/5'}`} />
        </div>
      )}

      <div className="container-glos relative z-10">
        {/* Header */}
        {!!(data.eyebrow || data.title || data.subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 lg:mb-14"
          >
            {!!data.eyebrow && (
              <p className={`text-sm font-semibold tracking-widest uppercase mb-3 ${isDarkBg ? 'text-white/70' : 'text-primary'}`}>
                {String(t(data.eyebrow) || '')}
              </p>
            )}
            {!!data.title && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                {String(t(data.title) || '')}
              </h2>
            )}
            {!!data.subtitle && (
              <p className={`text-base md:text-lg max-w-2xl mx-auto ${isDarkBg ? 'text-white/70' : 'text-gray-600'}`}>
                {String(t(data.subtitle) || '')}
              </p>
            )}
          </motion.div>
        )}

        {/* Badges */}
        {renderBadges()}
      </div>

      {/* Add hexagon clip path style */}
      <style jsx global>{`
        .clip-path-hexagon {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </section>
  )
}
