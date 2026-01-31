// Text + Image Section Component
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface TextImageSectionProps {
  data: {
    eyebrow?: unknown
    title?: unknown
    content?: unknown
    buttons?: Array<{
      _key: string
      text?: unknown
      link?: string
      variant?: string
      icon?: string
    }>
    image?: any
    imageShape?: string
    imageShadow?: string
    imageBorder?: string
    imagePosition?: string
    imageSize?: string
    verticalAlign?: string
    contentWidth?: string
    backgroundColor?: string
    paddingY?: string
    animation?: string
  }
}

// Background colors
const bgClasses: Record<string, string> = {
  white: 'bg-white',
  'gray-light': 'bg-gray-50',
  gray: 'bg-gray-200',
  primary: 'bg-primary text-white',
  'primary-light': 'bg-blue-50',
  black: 'bg-gray-900 text-white',
  'gradient-blue': 'bg-gradient-to-br from-primary to-blue-700 text-white',
}

// Padding
const paddingClasses: Record<string, string> = {
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32',
}

// Image sizes
const imageSizeClasses: Record<string, string> = {
  small: 'lg:w-[30%]',
  medium: 'lg:w-[40%]',
  large: 'lg:w-[50%]',
  xlarge: 'lg:w-[60%]',
}

// Image shapes
const imageShapeClasses: Record<string, string> = {
  rectangle: 'rounded-lg',
  square: 'rounded-lg aspect-square',
  rounded: 'rounded-2xl',
  circle: 'rounded-full aspect-square',
  blob: 'rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]',
}

// Image shadows
const imageShadowClasses: Record<string, string> = {
  none: '',
  sm: 'shadow-md',
  md: 'shadow-lg',
  lg: 'shadow-xl',
  xl: 'shadow-2xl',
}

// Image borders
const imageBorderClasses: Record<string, string> = {
  none: '',
  thin: 'ring-2 ring-gray-200',
  medium: 'ring-4 ring-gray-200',
  decorative: 'ring-4 ring-primary/30',
}

// Vertical alignment
const verticalAlignClasses: Record<string, string> = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
}

// Content width
const contentWidthClasses: Record<string, string> = {
  normal: 'max-w-6xl',
  wide: 'max-w-7xl',
  full: 'max-w-full',
}

// Button variants
const buttonVariantClasses: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary border-2 border-current',
  ghost: 'bg-transparent hover:bg-gray-100 text-current px-6 py-3 rounded-lg transition-colors',
  link: 'text-primary hover:underline inline-flex items-center gap-2',
}

// Animation variants
const getAnimationVariants = (animation: string | undefined) => {
  if (!animation || animation === 'none') {
    return {
      initial: {},
      whileInView: {},
      transition: { duration: 0 },
    }
  }

  const variants: Record<string, any> = {
    fade: {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      transition: { duration: 0.6 },
    },
    'slide-left': {
      initial: { opacity: 0, x: -60 },
      whileInView: { opacity: 1, x: 0 },
      transition: { duration: 0.6 },
    },
    'slide-right': {
      initial: { opacity: 0, x: 60 },
      whileInView: { opacity: 1, x: 0 },
      transition: { duration: 0.6 },
    },
    zoom: {
      initial: { opacity: 0, scale: 0.9 },
      whileInView: { opacity: 1, scale: 1 },
      transition: { duration: 0.6 },
    },
  }

  return variants[animation] || variants.fade
}

export default function TextImageSection({ data }: TextImageSectionProps) {
  const { t } = useLanguage()

  // Get classes from data
  const bgClass = bgClasses[data.backgroundColor || 'white']
  const paddingClass = paddingClasses[data.paddingY || 'lg']
  const imageSize = imageSizeClasses[data.imageSize || 'medium']
  const imageShape = imageShapeClasses[data.imageShape || 'rectangle']
  const imageShadow = imageShadowClasses[data.imageShadow || 'md']
  const imageBorder = imageBorderClasses[data.imageBorder || 'none']
  const verticalAlign = verticalAlignClasses[data.verticalAlign || 'center']
  const contentWidth = contentWidthClasses[data.contentWidth || 'normal']
  const imagePosition = data.imagePosition || 'right'

  // Determine text color based on background
  const isDark = ['primary', 'black', 'gradient-blue'].includes(data.backgroundColor || '')
  const textColor = isDark ? 'text-white' : 'text-gray-900'
  const subtextColor = isDark ? 'text-white/80' : 'text-gray-600'

  // Get animation settings
  const anim = getAnimationVariants(data.animation)

  // Image component
  const imageContent = isValidImage(data.image) ? (
    <motion.div
      initial={anim.initial}
      whileInView={anim.whileInView}
      viewport={{ once: true }}
      transition={{ ...anim.transition, delay: 0.1 }}
      className={`relative ${imageSize} flex-shrink-0`}
    >
      <div className={`relative overflow-hidden ${imageShape} ${imageShadow} ${imageBorder}`}>
        <div className={`relative ${data.imageShape === 'square' || data.imageShape === 'circle' ? 'aspect-square' : 'aspect-[4/3]'}`}>
          <Image
            src={safeImageUrl(data.image, 800, 600)!}
            alt={(data.image as any)?.alt || ''}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </motion.div>
  ) : null

  // Text content
  const textContent = (
    <motion.div
      initial={anim.initial}
      whileInView={anim.whileInView}
      viewport={{ once: true }}
      transition={anim.transition}
      className={`flex-1 ${textColor}`}
    >
      {/* Eyebrow */}
      {data.eyebrow ? (
        <div className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-white/70' : 'text-primary'}`}>
          {t(data.eyebrow)}
        </div>
      ) : null}

      {/* Title */}
      {data.title ? (
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          <RichText value={data.title} />
        </h2>
      ) : null}

      {/* Content */}
      {data.content ? (
        <div className={`prose prose-lg max-w-none mb-8 ${subtextColor}`}>
          <RichText value={data.content} />
        </div>
      ) : null}

      {/* Buttons */}
      {data.buttons && data.buttons.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {data.buttons.map((button) => {
            const buttonClass = buttonVariantClasses[button.variant || 'primary']
            const buttonText = t(button.text)

            if (!buttonText || !button.link) return null

            return (
              <Link
                key={button._key}
                href={button.link}
                className={buttonClass}
              >
                {buttonText}
                {button.variant === 'link' && <ArrowRight className="w-4 h-4" />}
              </Link>
            )
          })}
        </div>
      ) : null}
    </motion.div>
  )

  return (
    <section className={`${paddingClass} ${bgClass}`}>
      <div className={`container-glos mx-auto ${contentWidth}`}>
        <div className={`flex flex-col lg:flex-row gap-8 lg:gap-12 ${verticalAlign} ${
          imagePosition === 'left' ? 'lg:flex-row-reverse' : ''
        }`}>
          {textContent}
          {imageContent}
        </div>
      </div>
    </section>
  )
}
