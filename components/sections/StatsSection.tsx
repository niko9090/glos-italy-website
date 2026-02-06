// Stats Section Component - Design pulito e professionale
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { getSpacingClasses } from '@/lib/utils/spacing'
import { sl } from '@/lib/utils/stegaSafe'
import RichText from '@/components/RichText'
import { Check, Award, Users, Clock, Shield, Star, Wrench, Factory } from 'lucide-react'

interface StatItem {
  _key: string
  number?: string
  prefix?: string
  suffix?: string
  label?: unknown
  description?: unknown
  icon?: string
  iconImage?: any
  color?: 'default' | 'primary' | 'secondary' | 'green' | 'orange' | 'red'
  link?: string
}

interface StatsSectionProps {
  documentId?: string
  sectionKey?: string
  data: {
    title?: unknown
    subtitle?: unknown
    description?: unknown
    items?: StatItem[]
    layout?: 'grid' | 'row' | 'icons' | 'cards' | 'circular' | 'vertical' | 'timeline'
    columns?: number
    alignment?: 'left' | 'center' | 'right'
    iconPosition?: 'top' | 'left' | 'right' | 'background' | 'hidden'
    dividers?: boolean
    backgroundColor?: 'white' | 'gray' | 'dark' | 'primary' | 'gradient-blue' | 'gradient-dark' | 'image'
    backgroundImage?: any
    backgroundOverlay?: number
    textColor?: 'auto' | 'white' | 'black' | 'primary'
    numberSize?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
    numberWeight?: 'normal' | 'medium' | 'bold' | 'extrabold'
    cardStyle?: 'none' | 'elevated' | 'bordered' | 'glass' | 'gradient'
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string
    marginTop?: string
    marginBottom?: string
    countAnimation?: boolean
    countDuration?: number
    entranceAnimation?: 'none' | 'fade' | 'fade-up' | 'zoom' | 'stagger' | 'bounce'
    hoverAnimation?: 'none' | 'scale' | 'glow' | 'lift' | 'color'
    showDecorations?: boolean
  }
}

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  check: Check,
  award: Award,
  users: Users,
  clock: Clock,
  shield: Shield,
  star: Star,
  wrench: Wrench,
  factory: Factory,
}

// Format stat text: "500" + "Clienti" → "Oltre 500 clienti"
function formatStatText(number?: string, label?: string, prefix?: string, suffix?: string): string {
  if (!number && !label) return ''

  const num = number || ''
  const lab = label?.toLowerCase() || ''
  const pre = prefix || ''
  const suf = suffix || ''

  // If label contains the number context, just use label
  if (lab.includes('anni') || lab.includes('year')) {
    return `${pre}${num}${suf} ${lab}`
  }

  return `${pre}${num}${suf} ${lab}`.trim()
}

export default function StatsSection({ data }: StatsSectionProps) {
  const { t } = useLanguage()

  // Background classes
  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    dark: 'bg-gray-900',
    primary: 'bg-[#0047AB]',
    'gradient-blue': 'bg-gradient-to-r from-[#0047AB] to-[#003580]',
    'gradient-dark': 'bg-gradient-to-r from-gray-800 to-gray-900',
    image: '',
  }

  const isDark = ['dark', 'primary', 'gradient-blue', 'gradient-dark', 'image'].includes(data.backgroundColor || 'primary')
  const textColor = isDark ? 'text-white' : 'text-gray-900'
  const mutedColor = isDark ? 'text-white/70' : 'text-gray-600'
  const cardBg = isDark ? 'bg-white/10' : 'bg-white'
  const cardBorder = isDark ? 'border-white/20' : 'border-gray-200'
  const iconColor = isDark ? 'text-white' : 'text-[#0047AB]'

  const backgroundUrl = isValidImage(data.backgroundImage)
    ? safeImageUrl(data.backgroundImage, 1920)
    : null

  const items = data.items || []

  return (
    <section
      data-sanity-edit-target
      className={`relative overflow-hidden ${getSpacingClasses(data)} ${sl(bgClasses, data.backgroundColor, 'primary')} ${textColor}`}
    >
      {/* Background Image */}
      {data.backgroundColor === 'image' && backgroundUrl && (
        <div className="absolute inset-0 z-0">
          <Image src={backgroundUrl} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-black" style={{ opacity: (data.backgroundOverlay ?? 70) / 100 }} />
        </div>
      )}

      <div className="container-glos relative z-10">
        {/* Header */}
        {(data.title || data.subtitle) && (
          <div className="text-center mb-12">
            {data.title && (
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                <RichText value={data.title} />
              </h2>
            )}
            {data.subtitle && (
              <p className={`text-lg ${mutedColor}`}>
                <RichText value={data.subtitle} />
              </p>
            )}
          </div>
        )}

        {/* Stats as Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {items.map((stat, index) => {
            const labelText = typeof stat.label === 'string'
              ? stat.label
              : t(stat.label) || ''

            // Build the display text
            const displayParts: string[] = []
            if (stat.prefix) displayParts.push(stat.prefix)
            if (stat.number) displayParts.push(stat.number)
            if (stat.suffix) displayParts.push(stat.suffix)

            const numberPart = displayParts.join('')
            const hasNumber = !!stat.number

            const content = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`
                  flex items-center gap-3 px-5 py-3 rounded-full
                  ${cardBg} border ${cardBorder}
                  backdrop-blur-sm
                  transition-all duration-300
                  hover:scale-105 hover:shadow-lg
                  ${stat.link ? 'cursor-pointer' : ''}
                `}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 ${iconColor}`}>
                  {stat.iconImage && isValidImage(stat.iconImage) ? (
                    <Image
                      src={safeImageUrl(stat.iconImage, 48) || ''}
                      alt=""
                      width={24}
                      height={24}
                    />
                  ) : (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  )}
                </div>

                {/* Text */}
                <span className="text-sm md:text-base font-medium whitespace-nowrap">
                  {hasNumber && (
                    <span className="font-bold">{numberPart}</span>
                  )}
                  {hasNumber && labelText && ' '}
                  {labelText}
                </span>
              </motion.div>
            )

            return stat.link ? (
              <Link key={stat._key} href={stat.link}>
                {content}
              </Link>
            ) : (
              <div key={stat._key}>
                {content}
              </div>
            )
          })}
        </div>

        {/* Description */}
        {data.description && (
          <div className={`text-center mt-8 ${mutedColor} max-w-2xl mx-auto`}>
            <RichText value={data.description} />
          </div>
        )}
      </div>
    </section>
  )
}
