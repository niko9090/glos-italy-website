// Logo Cloud Section Component
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'
import {
  MOTION,
  fadeInUp,
  staggerContainerFast,
  staggerItem,
} from '@/lib/animations/config'
import { sl } from '@/lib/utils/stegaSafe'

interface LogoCloudSectionProps {
  documentId?: string
  sectionKey?: string
  data: {
    title?: unknown
    subtitle?: unknown
    logos?: Array<{
      _key: string
      image: any
      name?: string
      link?: string
    }>
    layout?: string
    columns?: number
    grayscale?: boolean
    showNames?: boolean
    backgroundColor?: string
  }
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  'gray-light': 'bg-gray-50',
  gray: 'bg-gray-50',
  transparent: 'bg-transparent',
  dark: 'bg-gray-900',
}

export default function LogoCloudSection({ data, documentId, sectionKey }: LogoCloudSectionProps) {
  const bgClass = sl(bgClasses, data.backgroundColor, 'gray')
  const textColor = data.backgroundColor?.includes('dark') ? 'text-white' : 'text-gray-900'
  const layout = data.layout || 'grid'
  const columns = data.columns || 5

  const validLogos = data.logos?.filter((logo) => isValidImage(logo.image)) || []

  if (validLogos.length === 0) return null

  const gridCols: Record<number, string> = {
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-3 md:grid-cols-6',
  }

  // Logo item variants for stagger animation
  const logoItemVariant = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        ...MOTION.SPRING.GENTLE,
        duration: MOTION.DURATION.NORMAL,
      },
    },
  }

  // Hover animation with scale and brightness
  const logoHover = {
    scale: 1.1,
    filter: 'brightness(1.1)',
    transition: { duration: MOTION.DURATION.FAST },
  }

  const renderLogo = (logo: typeof validLogos[0], index: number) => {
    const content = (
      <motion.div
        variants={logoItemVariant}
        whileHover={logoHover}
        whileTap={{ scale: 0.95 }}
        className={`relative h-16 flex items-center justify-center px-4 ${
          data.grayscale ? 'grayscale hover:grayscale-0' : ''
        } transition-all duration-300 cursor-pointer`}
      >
        <Image
          src={safeImageUrl(logo.image, 200, 100)!}
          alt={logo.name || ''}
          width={120}
          height={60}
          className="object-contain max-h-12"
        />
      </motion.div>
    )

    if (logo.link) {
      return (
        <a
          key={logo._key}
          href={logo.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {content}
          {data.showNames && logo.name && (
            <p className="text-center text-sm text-gray-500 mt-2">{logo.name}</p>
          )}
        </a>
      )
    }

    return (
      <div key={logo._key}>
        {content}
        {data.showNames && logo.name && (
          <p className="text-center text-sm text-gray-500 mt-2">{logo.name}</p>
        )}
      </div>
    )
  }

  // Marquee layout
  if (layout?.includes('marquee')) {
    return (
      <section data-sanity-edit-target className={`section ${bgClass} overflow-hidden`}>
        <div className="container-glos">
          {(data.title || data.subtitle) ? (
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={MOTION.VIEWPORT.ONCE}
              variants={fadeInUp}
              transition={{ duration: MOTION.DURATION.SLOW, ease: MOTION.EASE.OUT }}
              className={`text-center mb-12 ${textColor}`}
            >
              {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
              {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
            </motion.div>
          ) : null}
        </div>

        {/* Marquee - mantiene animazione CSS infinita */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={MOTION.VIEWPORT.ONCE}
          transition={{ duration: MOTION.DURATION.NORMAL, delay: 0.2 }}
          className="relative"
        >
          <div className="flex animate-marquee gap-12">
            {[...validLogos, ...validLogos].map((logo, index) => (
              <motion.div
                key={`${logo._key}-${index}`}
                whileHover={logoHover}
                className={`flex-shrink-0 h-16 w-32 flex items-center justify-center cursor-pointer ${
                  data.grayscale ? 'grayscale hover:grayscale-0' : ''
                } transition-all duration-300`}
              >
                <Image
                  src={safeImageUrl(logo.image, 200, 100)!}
                  alt={logo.name || ''}
                  width={120}
                  height={60}
                  className="object-contain max-h-12"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    )
  }

  // Carousel layout
  if (layout?.includes('carousel')) {
    return (
      <section data-sanity-edit-target className={`section ${bgClass}`}>
        <div className="container-glos">
          {(data.title || data.subtitle) ? (
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={MOTION.VIEWPORT.ONCE}
              variants={fadeInUp}
              transition={{ duration: MOTION.DURATION.SLOW, ease: MOTION.EASE.OUT }}
              className={`text-center mb-12 ${textColor}`}
            >
              {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
              {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
            </motion.div>
          ) : null}

          {/* Carousel con stagger */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={MOTION.VIEWPORT.ONCE}
            variants={staggerContainerFast}
            className="flex overflow-x-auto gap-8 pb-4 snap-x scrollbar-hide"
          >
            {validLogos.map((logo, index) => (
              <motion.div key={logo._key} variants={staggerItem} className="flex-shrink-0 snap-center">
                {renderLogo(logo, index)}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    )
  }

  // Grid layout (default)
  return (
    <section data-sanity-edit-target className={`section ${bgClass}`}>
      <div className="container-glos">
        {(data.title || data.subtitle) ? (
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={MOTION.VIEWPORT.ONCE}
            variants={fadeInUp}
            transition={{ duration: MOTION.DURATION.SLOW, ease: MOTION.EASE.OUT }}
            className={`text-center mb-12 ${textColor}`}
          >
            {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
            {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
          </motion.div>
        ) : null}

        {/* Grid con stagger animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={MOTION.VIEWPORT.ONCE}
          variants={staggerContainerFast}
          className={`grid ${gridCols[columns]} gap-8 items-center justify-items-center`}
        >
          {validLogos.map((logo, index) => renderLogo(logo, index))}
        </motion.div>
      </div>
    </section>
  )
}
