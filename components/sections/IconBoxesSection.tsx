// Icon Boxes Section Component
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'
import {
  MOTION,
  staggerContainer,
  tapScale,
} from '@/lib/animations/config'

interface IconBoxesSectionProps {
  data: {
    title?: unknown
    subtitle?: unknown
    boxes?: Array<{
      _key: string
      icon: string
      title?: unknown
      description?: unknown
      link?: string
      color?: string
    }>
    columns?: number
    boxStyle?: string
    iconSize?: string
    iconPosition?: string
    textAlign?: string
    hoverEffect?: string
    backgroundColor?: string
  }
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
}

const colorClasses: Record<string, { bg: string; text: string; hover: string }> = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', hover: 'group-hover:bg-primary group-hover:text-white' },
  secondary: { bg: 'bg-secondary/20', text: 'text-secondary', hover: 'group-hover:bg-secondary' },
  green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'group-hover:bg-green-500 group-hover:text-white' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'group-hover:bg-blue-500 group-hover:text-white' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'group-hover:bg-purple-500 group-hover:text-white' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'group-hover:bg-orange-500 group-hover:text-white' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-600', hover: 'group-hover:bg-pink-500 group-hover:text-white' },
}

const iconSizeClasses: Record<string, string> = {
  small: 'text-2xl',
  medium: 'text-3xl',
  large: 'text-4xl',
  xlarge: 'text-5xl',
}

// Varianti per titolo con animazione d'ingresso
const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION.DURATION.SLOW,
      ease: MOTION.EASE.OUT,
    },
  },
}

// Varianti per icona con effetto pulse/bounce su hover
const iconVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.15,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.95 },
}

// Varianti per box con hover lift + shadow
const boxVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: MOTION.SPRING.GENTLE,
  },
  hover: {
    y: -8,
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    transition: {
      duration: MOTION.DURATION.FAST,
      ease: MOTION.EASE.OUT,
    },
  },
  tap: tapScale,
}

export default function IconBoxesSection({ data }: IconBoxesSectionProps) {
  const { t } = useLanguage()
  const bgClass = bgClasses[data.backgroundColor || 'white']
  const textColor = data.backgroundColor?.includes('dark') ? 'text-white' : 'text-gray-900'
  const columns = data.columns || 3
  const iconSize = iconSizeClasses[data.iconSize || 'large']
  const textAlign = data.textAlign || 'center'

  if (!data.boxes || data.boxes.length === 0) return null

  const gridCols: Record<number, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
    6: 'md:grid-cols-3 lg:grid-cols-6',
  }

  const getBoxClasses = (style: string) => {
    switch (style) {
      case 'simple':
        return ''
      case 'card':
        return 'bg-white shadow-lg rounded-2xl'
      case 'bordered':
        return 'border border-gray-200 rounded-2xl'
      case 'filled':
        return 'bg-gray-50 rounded-2xl'
      case 'icon-centered':
        return 'bg-white shadow-lg rounded-2xl'
      default:
        return 'bg-white shadow-lg rounded-2xl'
    }
  }

  const getHoverClasses = (effect: string) => {
    switch (effect) {
      case 'none':
        return ''
      case 'lift':
        return 'hover:-translate-y-2 hover:shadow-xl'
      case 'scale':
        return 'hover:scale-105'
      case 'border-color':
        return 'hover:border-primary'
      case 'background':
        return 'hover:bg-primary/5'
      default:
        return 'hover:-translate-y-2 hover:shadow-xl'
    }
  }

  return (
    <section className={`section ${bgClass}`}>
      <div className="container-glos">
        {(data.title || data.subtitle) ? (
          <motion.div
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={MOTION.VIEWPORT.ONCE}
            className={`text-center mb-12 ${textColor}`}
          >
            {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
            {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
          </motion.div>
        ) : null}

        {/* Boxes Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={MOTION.VIEWPORT.ONCE}
          className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}
        >
          {data.boxes.map((box) => {
            const color = colorClasses[box.color || 'primary']
            const boxClasses = getBoxClasses(data.boxStyle || 'card')
            const hoverClasses = getHoverClasses(data.hoverEffect || 'lift')

            const content = (
              <motion.div
                variants={boxVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                whileTap="tap"
                viewport={MOTION.VIEWPORT.ONCE}
                className={`group p-6 cursor-pointer ${boxClasses} ${
                  textAlign?.includes('center') ? 'text-center' : 'text-left'
                } ${data.iconPosition?.includes('left') ? 'flex items-start gap-4' : ''}`}
              >
                {/* Icon */}
                <motion.div
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className={`${iconSize} ${
                    data.iconPosition?.includes('center') || data.boxStyle?.includes('icon-centered')
                      ? 'mx-auto mb-4'
                      : data.iconPosition?.includes('left')
                      ? 'flex-shrink-0'
                      : 'mb-4'
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${color.bg} ${color.text} ${color.hover} transition-all duration-300`}
                  >
                    {box.icon}
                  </span>
                </motion.div>

                {/* Text */}
                <div className={data.iconPosition?.includes('left') ? 'flex-1' : ''}>
                  <h3 className={`text-xl font-semibold mb-2 ${textColor} group-hover:text-primary transition-colors`}>
                    {t(box.title)}
                  </h3>
                  {box.description ? (
                    <p className="text-gray-600">{t(box.description)}</p>
                  ) : null}
                </div>
              </motion.div>
            )

            if (box.link) {
              return (
                <Link key={box._key} href={box.link} className="block">
                  {content}
                </Link>
              )
            }

            return <div key={box._key}>{content}</div>
          })}
        </motion.div>
      </div>
    </section>
  )
}
