// Icon Boxes Section Component
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { getTextValue } from '@/lib/utils/textHelpers'
import RichText from '@/components/RichText'

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function IconBoxesSection({ data }: IconBoxesSectionProps) {
  const bgClass = bgClasses[data.backgroundColor || 'white']
  const textColor = data.backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'
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
        {/* Header */}
        {(data.title || data.subtitle) && (
          <div className={`text-center mb-12 ${textColor}`}>
            {data.title && <h2 className="section-title mb-4"><RichText value={data.title} /></h2>}
            {data.subtitle && <div className="section-subtitle"><RichText value={data.subtitle} /></div>}
          </div>
        )}

        {/* Boxes Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}
        >
          {data.boxes.map((box) => {
            const color = colorClasses[box.color || 'primary']
            const boxClasses = getBoxClasses(data.boxStyle || 'card')
            const hoverClasses = getHoverClasses(data.hoverEffect || 'lift')

            const content = (
              <motion.div
                variants={itemVariants}
                className={`group p-6 transition-all duration-300 ${boxClasses} ${hoverClasses} ${
                  textAlign === 'center' ? 'text-center' : 'text-left'
                } ${data.iconPosition === 'left' ? 'flex items-start gap-4' : ''}`}
              >
                {/* Icon */}
                <div
                  className={`${iconSize} ${
                    data.iconPosition === 'center' || data.boxStyle === 'icon-centered'
                      ? 'mx-auto mb-4'
                      : data.iconPosition === 'left'
                      ? 'flex-shrink-0'
                      : 'mb-4'
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${color.bg} ${color.text} ${color.hover} transition-all duration-300`}
                  >
                    {box.icon}
                  </span>
                </div>

                {/* Text */}
                <div className={data.iconPosition === 'left' ? 'flex-1' : ''}>
                  <h3 className={`text-xl font-semibold mb-2 ${textColor} group-hover:text-primary transition-colors`}>
                    {getTextValue(box.title)}
                  </h3>
                  {box.description && (
                    <p className="text-gray-600">{getTextValue(box.description)}</p>
                  )}
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
