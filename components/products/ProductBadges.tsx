'use client'

import { motion } from 'framer-motion'

interface ProductBadgesProps {
  isNew?: boolean
  isFeatured?: boolean
  badges?: string[]
  customBadge?: {
    text?: string
    color?: string
  }
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Configurazione badge predefiniti
const BADGE_CONFIG: Record<string, { label: string; bgColor: string; textColor: string; icon?: string }> = {
  bestseller: {
    label: 'Bestseller',
    bgColor: 'bg-amber-500',
    textColor: 'text-white',
    icon: '🏆',
  },
  offerta: {
    label: 'Offerta',
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    icon: '🏷️',
  },
  promo: {
    label: 'Promo',
    bgColor: 'bg-orange-500',
    textColor: 'text-white',
    icon: '💥',
  },
  esaurito: {
    label: 'Esaurito',
    bgColor: 'bg-gray-500',
    textColor: 'text-white',
    icon: '⛔',
  },
  'in-arrivo': {
    label: 'In Arrivo',
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    icon: '🚀',
  },
  limitato: {
    label: 'Edizione Limitata',
    bgColor: 'bg-purple-600',
    textColor: 'text-white',
    icon: '💎',
  },
  consigliato: {
    label: 'Consigliato',
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    icon: '👍',
  },
  'made-italy': {
    label: 'Made in Italy',
    bgColor: 'bg-gradient-to-r from-green-600 via-white to-red-600',
    textColor: 'text-gray-900',
    icon: '🇮🇹',
  },
  garanzia: {
    label: 'Garanzia Estesa',
    bgColor: 'bg-teal-500',
    textColor: 'text-white',
    icon: '🛡️',
  },
  eco: {
    label: 'Eco-Friendly',
    bgColor: 'bg-emerald-500',
    textColor: 'text-white',
    icon: '🌱',
  },
}

// Colori per badge personalizzato
const CUSTOM_COLORS: Record<string, { bg: string; text: string }> = {
  primary: { bg: 'bg-primary', text: 'text-white' },
  red: { bg: 'bg-red-500', text: 'text-white' },
  green: { bg: 'bg-green-500', text: 'text-white' },
  yellow: { bg: 'bg-yellow-400', text: 'text-gray-900' },
  orange: { bg: 'bg-orange-500', text: 'text-white' },
  purple: { bg: 'bg-purple-600', text: 'text-white' },
  gray: { bg: 'bg-gray-500', text: 'text-white' },
  black: { bg: 'bg-gray-900', text: 'text-white' },
}

// Dimensioni badge
const SIZES = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
  lg: 'text-sm px-3 py-1.5',
}

export default function ProductBadges({
  isNew,
  isFeatured,
  badges = [],
  customBadge,
  size = 'md',
  className = '',
}: ProductBadgesProps) {
  const allBadges: Array<{ key: string; label: string; bgColor: string; textColor: string; icon?: string }> = []

  // Badge "Nuovo"
  if (isNew) {
    allBadges.push({
      key: 'new',
      label: 'Nuovo',
      bgColor: 'bg-emerald-500',
      textColor: 'text-white',
      icon: '✨',
    })
  }

  // Badge "In Evidenza"
  if (isFeatured) {
    allBadges.push({
      key: 'featured',
      label: 'In Evidenza',
      bgColor: 'bg-yellow-400',
      textColor: 'text-yellow-900',
      icon: '⭐',
    })
  }

  // Badge predefiniti
  badges.forEach((badge) => {
    const config = BADGE_CONFIG[badge]
    if (config) {
      allBadges.push({
        key: badge,
        ...config,
      })
    }
  })

  // Badge personalizzato
  if (customBadge?.text) {
    const colors = CUSTOM_COLORS[customBadge.color || 'primary']
    allBadges.push({
      key: 'custom',
      label: customBadge.text,
      bgColor: colors.bg,
      textColor: colors.text,
    })
  }

  if (allBadges.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {allBadges.map((badge, index) => (
        <motion.span
          key={badge.key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`
            inline-flex items-center gap-1 rounded-full font-semibold
            ${badge.bgColor} ${badge.textColor} ${SIZES[size]}
            shadow-sm
          `}
        >
          {badge.icon && <span className="text-[0.9em]">{badge.icon}</span>}
          {badge.label}
        </motion.span>
      ))}
    </div>
  )
}
