// Text + Image Section Component
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { getTextValue } from '@/lib/utils/textHelpers'
import RichText from '@/components/RichText'

interface TextImageSectionProps {
  data: {
    title?: unknown
    subtitle?: unknown
    content?: unknown
    image?: any
    imagePosition?: string
    imageSize?: string
    imageShape?: string
    imageShadow?: string
    imageBorder?: boolean
    imageAnimation?: string
    buttonText?: unknown
    buttonLink?: string
    secondaryButtonText?: unknown
    secondaryButtonLink?: string
    backgroundColor?: string
    verticalPadding?: string
  }
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
  primary: 'bg-primary',
  gradient: 'bg-gradient-to-br from-primary/10 to-secondary/10',
}

const paddingClasses: Record<string, string> = {
  small: 'py-8 md:py-12',
  medium: 'py-12 md:py-20',
  large: 'py-20 md:py-32',
}

const imageSizeClasses: Record<string, string> = {
  small: 'lg:w-1/3',
  medium: 'lg:w-1/2',
  large: 'lg:w-2/3',
}

const imageShapeClasses: Record<string, string> = {
  square: 'rounded-none',
  rounded: 'rounded-2xl',
  circle: 'rounded-full',
  blob: 'rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]',
}

const imageShadowClasses: Record<string, string> = {
  none: '',
  small: 'shadow-lg',
  medium: 'shadow-xl',
  large: 'shadow-2xl',
}

export default function TextImageSection({ data }: TextImageSectionProps) {
  const bgClass = bgClasses[data.backgroundColor || 'white']
  const paddingClass = paddingClasses[data.verticalPadding || 'medium']
  const textColor = data.backgroundColor === 'dark' || data.backgroundColor === 'primary' ? 'text-white' : 'text-gray-900'
  const imagePosition = data.imagePosition || 'right'
  const imageSize = imageSizeClasses[data.imageSize || 'medium']
  const imageShape = imageShapeClasses[data.imageShape || 'rounded']
  const imageShadow = imageShadowClasses[data.imageShadow || 'medium']

  const imageContent = isValidImage(data.image) ? (
    <motion.div
      initial={{ opacity: 0, x: imagePosition === 'left' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative ${imageSize} flex-shrink-0`}
    >
      <motion.div
        whileHover={
          data.imageAnimation === 'zoom'
            ? { scale: 1.05 }
            : data.imageAnimation === 'tilt'
            ? { rotateY: 5, rotateX: 5 }
            : undefined
        }
        className={`relative aspect-[4/3] overflow-hidden ${imageShape} ${imageShadow} ${
          data.imageBorder ? 'ring-4 ring-primary/20' : ''
        }`}
      >
        <Image
          src={safeImageUrl(data.image, 800, 600)!}
          alt=""
          fill
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  ) : null

  const textContent = (
    <motion.div
      initial={{ opacity: 0, x: imagePosition === 'left' ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`flex-1 ${textColor}`}
    >
      {data.title ? (
        <h2 className="section-title mb-4">
          <RichText value={data.title} />
        </h2>
      ) : null}
      {data.subtitle ? (
        <div className="section-subtitle mb-6">
          <RichText value={data.subtitle} />
        </div>
      ) : null}
      {data.content ? (
        <div className="prose prose-lg max-w-none mb-8">
          <RichText value={data.content} />
        </div>
      ) : null}

      {(data.buttonText || data.secondaryButtonText) ? (
        <div className="flex flex-wrap gap-4">
          {data.buttonText && data.buttonLink ? (
            <Link href={data.buttonLink} className="btn-primary">
              {getTextValue(data.buttonText)}
            </Link>
          ) : null}
          {data.secondaryButtonText && data.secondaryButtonLink ? (
            <Link href={data.secondaryButtonLink} className="btn-secondary">
              {getTextValue(data.secondaryButtonText)}
            </Link>
          ) : null}
        </div>
      ) : null}
    </motion.div>
  )

  return (
    <section className={`${paddingClass} ${bgClass}`}>
      <div className="container-glos">
        <div className={`flex flex-col lg:flex-row gap-12 items-center ${
          imagePosition === 'left' ? 'lg:flex-row-reverse' : ''
        }`}>
          {textContent}
          {imageContent}
        </div>
      </div>
    </section>
  )
}
