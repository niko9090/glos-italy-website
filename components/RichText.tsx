// Componente per renderizzare Rich Text da Sanity con formattazione ULTRA completa
'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'
import { CSSProperties } from 'react'
import { useLanguage } from '@/lib/context/LanguageContext'

// Tipi per i blocchi Portable Text
type PortableTextBlock = {
  _type: string
  _key?: string
  children?: any[]
  markDefs?: any[]
  style?: string
  listItem?: string
  level?: number
}

// Props del componente
interface RichTextProps {
  value: unknown
  className?: string
}

// ============================================
// MAPPE COLORI TESTO
// ============================================
const textColorMap: Record<string, string> = {
  black: 'text-gray-900',
  white: 'text-white',
  'gray-dark': 'text-gray-700',
  gray: 'text-gray-500',
  'gray-light': 'text-gray-400',
  primary: 'text-primary',
  'primary-dark': 'text-primary-dark',
  'primary-light': 'text-primary-light',
  red: 'text-red-600',
  'red-dark': 'text-red-800',
  orange: 'text-orange-500',
  yellow: 'text-yellow-500',
  green: 'text-green-600',
  'green-dark': 'text-green-800',
  lime: 'text-lime-500',
  cyan: 'text-cyan-500',
  sky: 'text-sky-500',
  purple: 'text-purple-600',
  'purple-dark': 'text-purple-800',
  pink: 'text-pink-500',
  'pink-hot': 'text-pink-600',
  brown: 'text-amber-700',
  gold: 'text-yellow-600',
  silver: 'text-gray-400',
  bronze: 'text-amber-600',
  diamond: 'text-cyan-400',
  rainbow: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent',
}

// ============================================
// MAPPE COLORI EVIDENZIAZIONE
// ============================================
const highlightColorMap: Record<string, string> = {
  yellow: 'bg-yellow-200',
  lightgreen: 'bg-green-200',
  lightblue: 'bg-blue-200',
  pink: 'bg-pink-200',
  lavender: 'bg-purple-200',
  peach: 'bg-orange-200',
  lightgray: 'bg-gray-200',
  lightred: 'bg-red-200',
  lightcyan: 'bg-cyan-200',
  beige: 'bg-amber-100',
  'gold-light': 'bg-yellow-100',
  'violet-light': 'bg-violet-200',
}

// ============================================
// MAPPE DIMENSIONI FONT
// ============================================
const fontSizeMap: Record<string, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  'base-sm': 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
  '8xl': 'text-8xl',
  '9xl': 'text-9xl',
}

// ============================================
// MAPPE FONT FAMILY
// ============================================
const fontFamilyMap: Record<string, string> = {
  default: '',
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  display: 'font-display',
  handwriting: 'font-handwriting',
}

// ============================================
// MAPPE FONT WEIGHT
// ============================================
const fontWeightMap: Record<string, string> = {
  '100': 'font-thin',
  '200': 'font-extralight',
  '300': 'font-light',
  '400': 'font-normal',
  '500': 'font-medium',
  '600': 'font-semibold',
  '700': 'font-bold',
  '800': 'font-extrabold',
  '900': 'font-black',
}

// ============================================
// MAPPE LETTER SPACING
// ============================================
const letterSpacingMap: Record<string, string> = {
  tighter: 'tracking-tighter',
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-wider',
  widest: 'tracking-widest',
}

// ============================================
// MAPPE LINE HEIGHT
// ============================================
const lineHeightMap: Record<string, string> = {
  none: 'leading-none',
  tight: 'leading-tight',
  snug: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
}

// ============================================
// MAPPE TEXT TRANSFORM
// ============================================
const textTransformMap: Record<string, string> = {
  none: '',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
  'small-caps': 'small-caps',
}

// ============================================
// MAPPE TEXT DECORATION
// ============================================
const textDecorationMap: Record<string, string> = {
  none: 'no-underline',
  underline: 'underline',
  'underline-wavy': 'underline decoration-wavy',
  'underline-double': 'underline decoration-double',
  'underline-dotted': 'underline decoration-dotted',
  'underline-dashed': 'underline decoration-dashed',
  overline: 'overline',
  'line-through': 'line-through',
}

// ============================================
// MAPPA ICONE
// ============================================
const iconMap: Record<string, string> = {
  // Frecce
  'arrow-right': '→',
  'arrow-left': '←',
  'arrow-up': '↑',
  'arrow-down': '↓',
  'arrow-diagonal': '↗',
  'arrow-filled': '➜',
  'triangle-right': '▶',
  'triangle-left': '◀',
  // Check e status
  'check': '✓',
  'check-filled': '✔',
  'x': '✗',
  'x-filled': '✘',
  'warning': '⚠',
  'stop': '⛔',
  'info': 'ℹ',
  'question': '❓',
  'exclamation': '❗',
  // Stelle
  'star': '★',
  'star-empty': '☆',
  'star-4': '✦',
  'star-sparkle': '✧',
  'star-bright': '🌟',
  // Cuori
  'heart': '♥',
  'heart-empty': '♡',
  'heart-sparkle': '💖',
  // Forme
  'circle': '●',
  'circle-empty': '○',
  'square': '■',
  'square-empty': '□',
  'diamond': '◆',
  'diamond-empty': '◇',
  // Business
  'phone': '📞',
  'email': '✉',
  'location': '📍',
  'web': '🌐',
  'business': '💼',
  'calendar': '📅',
  'clock': '⏰',
  'money': '💰',
  'target': '🎯',
  'trophy': '🏆',
  // Tech
  'lightning': '⚡',
  'gear': '🔧',
  'lock': '🔒',
  'unlock': '🔓',
  'bell': '🔔',
  'bulb': '💡',
  'rocket': '🚀',
  'settings': '⚙️',
  // Social
  'like': '👍',
  'dislike': '👎',
  'user': '👤',
  'users': '👥',
  'chat': '💬',
  'megaphone': '📣',
  // Natura
  'sun': '☀',
  'moon': '🌙',
  'fire': '🔥',
  'drop': '💧',
  'leaf': '🌿',
  'flower': '🌸',
  // Simboli
  'copyright': '©',
  'registered': '®',
  'trademark': '™',
  'infinity': '∞',
  'section': '§',
  'paragraph': '¶',
  'dagger': '†',
  'double-dagger': '‡',
}

// Helper per ottenere valori colore CSS
const getColorValue = (color: string): string => {
  const colorValues: Record<string, string> = {
    black: '#1f2937',
    white: '#ffffff',
    'gray-dark': '#374151',
    gray: '#6b7280',
    'gray-light': '#9ca3af',
    primary: '#2563eb',
    'primary-dark': '#1d4ed8',
    'primary-light': '#60a5fa',
    red: '#dc2626',
    'red-dark': '#991b1b',
    orange: '#f97316',
    yellow: '#eab308',
    green: '#16a34a',
    'green-dark': '#166534',
    lime: '#84cc16',
    cyan: '#06b6d4',
    sky: '#0ea5e9',
    purple: '#9333ea',
    'purple-dark': '#6b21a8',
    pink: '#ec4899',
    'pink-hot': '#db2777',
    brown: '#b45309',
    gold: '#ca8a04',
    silver: '#9ca3af',
    bronze: '#d97706',
    diamond: '#22d3ee',
  }
  return colorValues[color] || color
}

// ============================================
// STILI OMBRA TESTO
// ============================================
const getTextShadowStyle = (shadow: string, color?: string): CSSProperties => {
  const baseColor = color ? getColorValue(color) : 'rgba(0,0,0,0.3)'

  const shadows: Record<string, string> = {
    none: 'none',
    sm: `1px 1px 2px ${baseColor}`,
    md: `2px 2px 4px ${baseColor}`,
    lg: `3px 3px 6px ${baseColor}`,
    xl: `4px 4px 8px ${baseColor}`,
    'neon-blue': '0 0 10px #00f, 0 0 20px #00f, 0 0 30px #00f',
    'neon-green': '0 0 10px #0f0, 0 0 20px #0f0, 0 0 30px #0f0',
    'neon-pink': '0 0 10px #f0f, 0 0 20px #f0f, 0 0 30px #f0f',
    'neon-gold': '0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700',
    'neon-red': '0 0 10px #f00, 0 0 20px #f00, 0 0 30px #f00',
    'neon-purple': '0 0 10px #a855f7, 0 0 20px #a855f7, 0 0 30px #a855f7',
    'glow-white': '0 0 10px #fff, 0 0 20px #fff, 0 0 40px #fff',
    long: `4px 4px 0 ${baseColor}, 8px 8px 0 rgba(0,0,0,0.1)`,
    '3d': `1px 1px 0 #ccc, 2px 2px 0 #c9c9c9, 3px 3px 0 #bbb, 4px 4px 0 #b9b9b9, 5px 5px 0 #aaa`,
    retro: `3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000`,
    inset: `inset 2px 2px 4px rgba(0,0,0,0.3)`,
  }

  return { textShadow: shadows[shadow] || 'none' }
}

// ============================================
// STILI GRADIENTE TESTO
// ============================================
const getTextGradientStyle = (gradient: string): CSSProperties => {
  const gradients: Record<string, string> = {
    none: '',
    sunset: 'linear-gradient(90deg, #f97316, #ec4899)',
    ocean: 'linear-gradient(90deg, #2563eb, #06b6d4)',
    forest: 'linear-gradient(90deg, #16a34a, #10b981)',
    fire: 'linear-gradient(90deg, #dc2626, #f97316)',
    aurora: 'linear-gradient(90deg, #9333ea, #ec4899)',
    gold: 'linear-gradient(90deg, #fbbf24, #f97316)',
    silver: 'linear-gradient(90deg, #d1d5db, #f3f4f6)',
    rainbow: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #8b5cf6)',
    night: 'linear-gradient(90deg, #1e3a8a, #7c3aed)',
    candy: 'linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4)',
    electric: 'linear-gradient(90deg, #eab308, #22c55e)',
    dark: 'linear-gradient(90deg, #4b5563, #1f2937)',
    ice: 'linear-gradient(90deg, #ffffff, #67e8f9)',
    citrus: 'linear-gradient(90deg, #f97316, #facc15)',
    grape: 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
    sakura: 'linear-gradient(90deg, #f9a8d4, #fce7f3)',
  }

  if (!gradient || gradient === 'none') return {}

  return {
    backgroundImage: gradients[gradient],
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  } as CSSProperties
}

// ============================================
// ANIMAZIONI
// ============================================
const getAnimationClass = (animation: string, duration: string = 'normal', delay: string = '0', repeat: string = 'once'): string => {
  if (!animation || animation === 'none') return ''

  const durationMap: Record<string, string> = {
    fast: 'duration-300',
    normal: 'duration-500',
    slow: 'duration-1000',
    slower: 'duration-2000',
  }

  const delayMap: Record<string, string> = {
    '0': 'delay-0',
    '200': 'delay-200',
    '500': 'delay-500',
    '1000': 'delay-1000',
    '2000': 'delay-2000',
  }

  const animationMap: Record<string, string> = {
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'slide-down': 'animate-slide-down',
    'slide-left': 'animate-slide-left',
    'slide-right': 'animate-slide-right',
    'zoom-in': 'animate-zoom-in',
    'zoom-out': 'animate-zoom-out',
    flip: 'animate-flip',
    bounce: 'animate-bounce',
    rotate: 'animate-spin',
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    typewriter: 'animate-typewriter',
    draw: 'animate-draw',
    glitter: 'animate-glitter',
    shake: 'animate-shake',
    float: 'animate-float',
    pop: 'animate-scale-in',
    focus: 'animate-pulse',
  }

  const repeatClass = repeat === 'infinite' ? 'animate-infinite' : ''

  return `${animationMap[animation] || ''} ${durationMap[duration] || ''} ${delayMap[delay] || ''} ${repeatClass}`.trim()
}

// ============================================
// STILI OUTLINE TESTO
// ============================================
const getTextOutlineStyle = (width: string, color: string): CSSProperties => {
  const colorValue = getColorValue(color)
  const widthValues: Record<string, string> = {
    thin: '1px',
    medium: '2px',
    thick: '3px',
  }
  const w = widthValues[width] || '1px'

  return {
    WebkitTextStroke: `${w} ${colorValue}`,
  } as CSSProperties
}

// ============================================
// BADGE STYLES
// ============================================
const getBadgeClass = (variant: string, rounded: boolean = false): string => {
  const roundedClass = rounded ? 'rounded-full' : 'rounded'
  const variants: Record<string, string> = {
    default: `bg-gray-200 text-gray-800 px-2 py-0.5 ${roundedClass} text-sm`,
    primary: `bg-primary text-white px-2 py-0.5 ${roundedClass} text-sm`,
    success: `bg-green-500 text-white px-2 py-0.5 ${roundedClass} text-sm`,
    warning: `bg-orange-500 text-white px-2 py-0.5 ${roundedClass} text-sm`,
    danger: `bg-red-500 text-white px-2 py-0.5 ${roundedClass} text-sm`,
    info: `bg-cyan-500 text-white px-2 py-0.5 ${roundedClass} text-sm`,
    purple: `bg-purple-500 text-white px-2 py-0.5 ${roundedClass} text-sm`,
    pink: `bg-pink-500 text-white px-2 py-0.5 ${roundedClass} text-sm`,
    outline: `border border-gray-400 text-gray-700 px-2 py-0.5 ${roundedClass} text-sm`,
    gradient: `bg-gradient-to-r from-primary to-cyan-500 text-white px-2 py-0.5 ${roundedClass} text-sm`,
  }
  return variants[variant] || variants.default
}

// ============================================
// BUTTON STYLES
// ============================================
const getButtonClass = (variant: string, size: string = 'md'): string => {
  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }
  const variants: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-primary/10',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }
  return `inline-block ${sizeClasses[size] || sizeClasses.md} ${variants[variant] || variants.primary} rounded-lg font-medium transition-colors cursor-pointer`
}

// ============================================
// COMPONENTI PORTABLE TEXT
// ============================================
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
    lead: ({ children }) => <p className="text-xl md:text-2xl text-gray-600 mb-6 leading-relaxed">{children}</p>,
    hero: ({ children }) => <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">{children}</h1>,
    display: ({ children }) => <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none">{children}</h1>,
    h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-bold mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl md:text-4xl font-bold mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl md:text-3xl font-semibold mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl md:text-2xl font-semibold mb-2">{children}</h4>,
    h5: ({ children }) => <h5 className="text-lg md:text-xl font-semibold mb-2">{children}</h5>,
    h6: ({ children }) => <h6 className="text-base md:text-lg font-semibold mb-2">{children}</h6>,
    subtitle: ({ children }) => <p className="text-lg md:text-xl text-gray-500 mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-gray-600">
        {children}
      </blockquote>
    ),
    'blockquote-large': ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-6 italic my-6 text-xl text-gray-600">
        {children}
      </blockquote>
    ),
    callout: ({ children }) => (
      <div className="bg-blue-50 border-l-4 border-primary p-4 my-4 rounded-r">
        <span className="mr-2">ℹ️</span>{children}
      </div>
    ),
    'callout-success': ({ children }) => (
      <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4 rounded-r">
        <span className="mr-2">✅</span>{children}
      </div>
    ),
    'callout-warning': ({ children }) => (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4 rounded-r">
        <span className="mr-2">⚠️</span>{children}
      </div>
    ),
    'callout-error': ({ children }) => (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-r">
        <span className="mr-2">❌</span>{children}
      </div>
    ),
    caption: ({ children }) => <p className="text-sm text-gray-500 italic mb-2">{children}</p>,
    small: ({ children }) => <p className="text-sm text-gray-600 mb-2">{children}</p>,
    'code-block': ({ children }) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm">
        <code>{children}</code>
      </pre>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
    check: ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
    'check-red': ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
    arrow: ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
    'arrow-green': ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
    star: ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
    'star-blue': ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
    heart: ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
    'dot-blue': ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
    'dot-green': ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
    'dot-red': ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
    diamond: ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
    lightning: ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
    fire: ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
    rocket: ({ children }) => <ul className="pl-6 mb-4 space-y-1 list-none">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
    check: ({ children }) => <li className="flex items-start gap-2"><span className="text-green-500">✓</span>{children}</li>,
    'check-red': ({ children }) => <li className="flex items-start gap-2"><span className="text-red-500">✗</span>{children}</li>,
    arrow: ({ children }) => <li className="flex items-start gap-2"><span className="text-primary">→</span>{children}</li>,
    'arrow-green': ({ children }) => <li className="flex items-start gap-2"><span className="text-green-500">➜</span>{children}</li>,
    star: ({ children }) => <li className="flex items-start gap-2"><span className="text-yellow-500">★</span>{children}</li>,
    'star-blue': ({ children }) => <li className="flex items-start gap-2"><span className="text-primary">★</span>{children}</li>,
    heart: ({ children }) => <li className="flex items-start gap-2"><span className="text-red-500">♥</span>{children}</li>,
    'dot-blue': ({ children }) => <li className="flex items-start gap-2"><span className="text-primary">●</span>{children}</li>,
    'dot-green': ({ children }) => <li className="flex items-start gap-2"><span className="text-green-500">●</span>{children}</li>,
    'dot-red': ({ children }) => <li className="flex items-start gap-2"><span className="text-red-500">●</span>{children}</li>,
    diamond: ({ children }) => <li className="flex items-start gap-2"><span className="text-purple-500">◆</span>{children}</li>,
    lightning: ({ children }) => <li className="flex items-start gap-2"><span className="text-yellow-500">⚡</span>{children}</li>,
    fire: ({ children }) => <li className="flex items-start gap-2"><span>🔥</span>{children}</li>,
    rocket: ({ children }) => <li className="flex items-start gap-2"><span>🚀</span>{children}</li>,
  },
  marks: {
    // Decoratori base
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    'strike-through': ({ children }) => <span className="line-through">{children}</span>,
    code: ({ children }) => (
      <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm">{children}</code>
    ),
    sup: ({ children }) => <sup className="text-xs">{children}</sup>,
    sub: ({ children }) => <sub className="text-xs">{children}</sub>,
    mark: ({ children }) => <mark className="bg-yellow-300 px-0.5">{children}</mark>,
    'small-text': ({ children }) => <small className="text-sm">{children}</small>,
    abbr: ({ children }) => <abbr className="underline decoration-dotted cursor-help">{children}</abbr>,
    kbd: ({ children }) => (
      <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 font-mono text-sm shadow-sm">
        {children}
      </kbd>
    ),

    // Link
    link: ({ children, value }) => {
      const href = value?.href || '#'
      const target = value?.openInNewTab ? '_blank' : undefined
      const rel = value?.openInNewTab ? 'noopener noreferrer' : undefined

      if (href.startsWith('/')) {
        return (
          <Link href={href} className="text-primary hover:underline">
            {children}
          </Link>
        )
      }

      return (
        <a href={href} target={target} rel={rel} className="text-primary hover:underline">
          {children}
        </a>
      )
    },

    // Icona inline
    inlineIcon: ({ children, value }) => {
      const icon = iconMap[value?.icon] || value?.icon || ''
      const colorClass = textColorMap[value?.color] || ''
      const sizeMap: Record<string, string> = {
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      }
      const sizeClass = sizeMap[value?.size] || 'text-base'
      return <span className={`${colorClass} ${sizeClass} inline-flex items-center`}>{icon}{children}</span>
    },

    // Colore testo
    textColor: ({ children, value }) => {
      const colorClass = textColorMap[value?.color] || ''
      return <span className={colorClass}>{children}</span>
    },

    // Evidenziazione
    highlight: ({ children, value }) => {
      const colorClass = highlightColorMap[value?.color] || 'bg-yellow-200'
      return <span className={`${colorClass} px-1 rounded`}>{children}</span>
    },

    // Dimensione font
    fontSize: ({ children, value }) => {
      const sizeClass = fontSizeMap[value?.size] || ''
      return <span className={sizeClass}>{children}</span>
    },

    // Font family
    fontFamily: ({ children, value }) => {
      const familyClass = fontFamilyMap[value?.family] || ''
      return <span className={familyClass}>{children}</span>
    },

    // Font weight
    fontWeight: ({ children, value }) => {
      const weightClass = fontWeightMap[value?.weight] || ''
      return <span className={weightClass}>{children}</span>
    },

    // Letter spacing
    letterSpacing: ({ children, value }) => {
      const spacingClass = letterSpacingMap[value?.spacing] || ''
      return <span className={spacingClass}>{children}</span>
    },

    // Line height
    lineHeight: ({ children, value }) => {
      const heightClass = lineHeightMap[value?.height] || ''
      return <span className={`inline-block ${heightClass}`}>{children}</span>
    },

    // Allineamento
    textAlign: ({ children, value }) => {
      const alignClass = value?.align ? `text-${value.align}` : ''
      return <span className={`block ${alignClass}`}>{children}</span>
    },

    // Trasformazione
    textTransform: ({ children, value }) => {
      const transformClass = textTransformMap[value?.transform] || ''
      return <span className={transformClass}>{children}</span>
    },

    // Decorazione
    textDecoration: ({ children, value }) => {
      const decorationClass = textDecorationMap[value?.decoration] || ''
      const colorStyle = value?.color ? { textDecorationColor: getColorValue(value.color) } : {}
      return <span className={decorationClass} style={colorStyle}>{children}</span>
    },

    // Ombra testo
    textShadow: ({ children, value }) => {
      const style = getTextShadowStyle(value?.shadow, value?.color)
      return <span style={style}>{children}</span>
    },

    // Gradiente testo
    textGradient: ({ children, value }) => {
      const style = getTextGradientStyle(value?.gradient)
      return <span style={style}>{children}</span>
    },

    // Animazione
    textAnimation: ({ children, value }) => {
      const animationClass = getAnimationClass(value?.animation, value?.duration, value?.delay, value?.repeat)
      return <span className={animationClass}>{children}</span>
    },

    // Outline testo
    textOutline: ({ children, value }) => {
      const style = getTextOutlineStyle(value?.width, value?.color)
      return <span style={style}>{children}</span>
    },

    // Badge
    badge: ({ children, value }) => {
      const badgeClass = getBadgeClass(value?.variant, value?.rounded)
      return <span className={badgeClass}>{children}</span>
    },

    // Button style
    buttonStyle: ({ children, value }) => {
      const buttonClass = getButtonClass(value?.variant, value?.size)
      return <span className={buttonClass}>{children}</span>
    },

    // Tooltip
    tooltip: ({ children, value }) => {
      return (
        <span className="relative group cursor-help">
          {children}
          <span className={`
            absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100
            transition-opacity duration-200 bg-gray-900 text-white text-sm px-2 py-1 rounded
            whitespace-nowrap
            ${value?.position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-1' : ''}
            ${value?.position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-1' : ''}
            ${value?.position === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-1' : ''}
            ${value?.position === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-1' : ''}
          `}>
            {value?.text}
          </span>
        </span>
      )
    },

    // Bordo inline
    inlineBorder: ({ children, value }) => {
      const borderStyle = value?.style || 'solid'
      const color = getColorValue(value?.color || 'gray')
      const rounded = value?.rounded ? 'rounded' : ''
      return (
        <span
          className={`inline-block px-2 py-0.5 ${rounded}`}
          style={{ border: `1px ${borderStyle} ${color}` }}
        >
          {children}
        </span>
      )
    },
  },

  // Tipi custom (blocco stilizzato)
  types: {
    styledBlock: ({ value }: { value: any }) => {
      const bgClasses: Record<string, string> = {
        none: '',
        white: 'bg-white',
        'gray-light': 'bg-gray-100',
        gray: 'bg-gray-300',
        black: 'bg-gray-900 text-white',
        primary: 'bg-primary text-white',
        'primary-light': 'bg-blue-100',
        green: 'bg-green-500 text-white',
        red: 'bg-red-500 text-white',
        yellow: 'bg-yellow-200',
        orange: 'bg-orange-500 text-white',
        purple: 'bg-purple-500 text-white',
        pink: 'bg-pink-500 text-white',
        cyan: 'bg-cyan-500 text-white',
        'gradient-h': 'bg-gradient-to-r from-primary to-cyan-500 text-white',
        'gradient-v': 'bg-gradient-to-b from-primary to-cyan-500 text-white',
        'gradient-d': 'bg-gradient-to-br from-primary to-cyan-500 text-white',
        glass: 'bg-white/30 backdrop-blur-md',
      }

      const borderClasses: Record<string, string> = {
        none: '',
        thin: 'border',
        medium: 'border-2',
        thick: 'border-4',
        left: 'border-l-4',
        right: 'border-r-4',
        top: 'border-t-4',
        bottom: 'border-b-4',
        rounded: 'border-2 rounded-lg',
        pill: 'border-2 rounded-full',
        dashed: 'border-2 border-dashed',
        dotted: 'border-2 border-dotted',
      }

      const shadowClasses: Record<string, string> = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        inner: 'shadow-inner',
        colored: 'shadow-lg shadow-primary/30',
        neon: 'shadow-lg shadow-primary/50',
      }

      const paddingClasses: Record<string, string> = {
        none: '',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
        '2xl': 'p-12',
      }

      const alignClasses: Record<string, string> = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      }

      const bgClass = bgClasses[value.background] || ''
      const borderClass = borderClasses[value.border] || ''
      const shadowClass = shadowClasses[value.shadow] || ''
      const paddingClass = paddingClasses[value.padding] || 'p-4'
      const alignClass = alignClasses[value.textAlign] || ''
      const animationClass = getAnimationClass(value.animation)

      // Gradiente custom
      let gradientStyle: CSSProperties = {}
      if (value.backgroundGradient?.from && value.backgroundGradient?.to) {
        const fromColor = getColorValue(value.backgroundGradient.from)
        const toColor = getColorValue(value.backgroundGradient.to)
        const directions: Record<string, string> = {
          'to-r': '90deg',
          'to-l': '270deg',
          'to-b': '180deg',
          'to-t': '0deg',
          'to-br': '135deg',
          'to-bl': '225deg',
        }
        const dir = directions[value.backgroundGradient.direction] || '90deg'
        gradientStyle = { background: `linear-gradient(${dir}, ${fromColor}, ${toColor})` }
      }

      // Border color
      const borderColorStyle: CSSProperties = value.borderColor
        ? { borderColor: getColorValue(value.borderColor) }
        : {}

      return (
        <div
          className={`my-4 ${bgClass} ${borderClass} ${shadowClass} ${paddingClass} ${alignClass} ${animationClass}`.trim()}
          style={{ ...gradientStyle, ...borderColorStyle }}
        >
          {value.content && <PortableText value={value.content} components={components} />}
        </div>
      )
    },
  },
}

// Estrae il contenuto dalla struttura multilingua
function extractContent(value: unknown, language: 'it' | 'en' | 'es' = 'it'): PortableTextBlock[] | string | null {
  if (!value) return null

  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    // Usa la lingua corrente, poi fallback a italiano, poi inglese
    const content = obj[language] || obj.it || obj.en || obj.es

    if (Array.isArray(content)) {
      return content as PortableTextBlock[]
    }

    if (typeof content === 'string') {
      return content
    }
  }

  return null
}

export default function RichText({ value, className = '' }: RichTextProps) {
  const { language } = useLanguage()
  const content = extractContent(value, language)

  if (!content) {
    return null
  }

  if (typeof content === 'string') {
    return <p className={className}>{content}</p>
  }

  return (
    <div className={className}>
      <PortableText value={content} components={components} />
    </div>
  )
}

export function RichTextInline({ value, className = '' }: RichTextProps) {
  const { language } = useLanguage()
  const content = extractContent(value, language)

  if (!content) {
    return null
  }

  if (typeof content === 'string') {
    return <span className={className}>{content}</span>
  }

  return (
    <span className={className}>
      <PortableText value={content} components={components} />
    </span>
  )
}
