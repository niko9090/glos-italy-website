// Timeline Section Component
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'
import {
  MOTION,
  fadeInUp,
  staggerContainer,
  staggerItem
} from '@/lib/animations/config'

// Timeline-specific animation variants
const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION.DURATION.SLOW,
      ease: MOTION.EASE.OUT,
    }
  }
}

const lineDrawVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: MOTION.DURATION.SLOWER,
      ease: MOTION.EASE.IN_OUT,
    }
  }
}

const horizontalLineDrawVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: MOTION.DURATION.SLOWER,
      ease: MOTION.EASE.IN_OUT,
    }
  }
}

const markerVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (delay: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay,
      type: 'spring',
      stiffness: 200,
      damping: 15,
    }
  })
}

const itemFromLeftVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: MOTION.DURATION.SLOW,
      ease: MOTION.EASE.OUT,
    }
  }
}

const itemFromRightVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: MOTION.DURATION.SLOW,
      ease: MOTION.EASE.OUT,
    }
  }
}

const horizontalItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: MOTION.DURATION.NORMAL,
      ease: MOTION.EASE.OUT,
    }
  })
}

interface TimelineSectionProps {
  data: {
    title?: unknown
    subtitle?: unknown
    items?: Array<{
      _key: string
      year: string
      title?: unknown
      description?: unknown
      image?: any
      icon?: string
      highlighted?: boolean
    }>
    layout?: string
    lineColor?: string
    showImages?: boolean
    animated?: boolean
    backgroundColor?: string
  }
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
}

const lineColorClasses: Record<string, string> = {
  primary: 'bg-primary',
  gray: 'bg-gray-300',
  gradient: 'bg-gradient-to-b from-primary via-secondary to-accent',
}

export default function TimelineSection({ data }: TimelineSectionProps) {
  const { t } = useLanguage()
  const bgClass = bgClasses[data.backgroundColor || 'white']
  const textColor = data.backgroundColor?.includes('dark') ? 'text-white' : 'text-gray-900'
  const lineColor = lineColorClasses[data.lineColor || 'primary']
  const layout = data.layout || 'vertical-alternate'

  if (!data.items || data.items.length === 0) return null

  // Horizontal layout
  if (layout?.includes('horizontal')) {
    return (
      <section className={`section ${bgClass} overflow-hidden`}>
        <div className="container-glos">
          {/* Animated Title */}
          {(data.title || data.subtitle) ? (
            <motion.div
              className={`text-center mb-12 ${textColor}`}
              variants={titleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={MOTION.VIEWPORT.ONCE}
            >
              {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
              {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
            </motion.div>
          ) : null}

          {/* Horizontal Timeline */}
          <div className="relative">
            {/* Animated Line with Draw Effect */}
            <motion.div
              className={`absolute top-8 left-0 right-0 h-1 ${lineColor} origin-left`}
              variants={horizontalLineDrawVariants}
              initial="hidden"
              whileInView="visible"
              viewport={MOTION.VIEWPORT.ONCE}
            />

            {/* Items with Stagger Animation */}
            <div className="flex overflow-x-auto gap-8 pb-4 snap-x">
              {data.items.map((item, index) => (
                <motion.div
                  key={item._key}
                  variants={horizontalItemVariants}
                  custom={index * MOTION.STAGGER.NORMAL + 0.3}
                  initial="hidden"
                  whileInView="visible"
                  viewport={MOTION.VIEWPORT.ONCE}
                  className="flex-shrink-0 w-64 snap-start"
                >
                  {/* Animated Dot/Marker */}
                  <motion.div
                    className={`w-4 h-4 rounded-full ${lineColor} mx-auto mb-4 ring-4 ring-white`}
                    variants={markerVariants}
                    custom={index * MOTION.STAGGER.NORMAL + 0.2}
                    initial="hidden"
                    whileInView="visible"
                    viewport={MOTION.VIEWPORT.ONCE}
                    whileHover={{ scale: 1.3 }}
                  />

                  {/* Year */}
                  <div className={`text-center font-bold text-lg ${item.highlighted ? 'text-primary' : textColor}`}>
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.year}
                  </div>

                  {/* Content Card with Hover Animation */}
                  <motion.div
                    className={`mt-4 p-4 rounded-xl ${item.highlighted ? 'bg-primary/10 border-2 border-primary' : 'bg-white shadow-lg'}`}
                    whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                    transition={{ duration: MOTION.DURATION.FAST }}
                  >
                    {data.showImages && isValidImage(item.image) && (
                      <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                        <Image src={safeImageUrl(item.image, 300, 200)!} alt="" fill className="object-cover" />
                      </div>
                    )}
                    <h3 className={`font-semibold mb-2 ${textColor}`}>{t(item.title)}</h3>
                    <p className="text-sm text-gray-600">{t(item.description)}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Vertical layouts
  const isAlternate = layout?.includes('vertical-alternate')
  const isLeft = layout?.includes('vertical-left')

  return (
    <section className={`section ${bgClass}`}>
      <div className="container-glos">
        {/* Animated Title */}
        {(data.title || data.subtitle) ? (
          <motion.div
            className={`text-center mb-12 ${textColor}`}
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={MOTION.VIEWPORT.ONCE}
          >
            {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
            {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
          </motion.div>
        ) : null}

        {/* Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Animated Center Line with Draw Effect */}
          <motion.div
            className={`absolute ${isLeft ? 'left-4' : isAlternate ? 'left-1/2 -translate-x-1/2' : 'right-4'} top-0 bottom-0 w-1 ${lineColor} origin-top`}
            variants={lineDrawVariants}
            initial="hidden"
            whileInView="visible"
            viewport={MOTION.VIEWPORT.ONCE}
          />

          {data.items.map((item, index) => {
            const isEven = index % 2 === 0
            const alignRight = isAlternate ? isEven : !isLeft
            // Alternate animation direction based on position
            const itemVariants = alignRight ? itemFromLeftVariants : itemFromRightVariants

            return (
              <motion.div
                key={item._key}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className={`relative flex items-center mb-12 ${
                  isAlternate
                    ? isEven ? 'flex-row' : 'flex-row-reverse'
                    : isLeft ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Animated Dot/Marker */}
                <div className={`absolute ${isLeft ? 'left-4' : isAlternate ? 'left-1/2' : 'right-4'} -translate-x-1/2 z-10`}>
                  <motion.div
                    className={`w-6 h-6 rounded-full ${item.highlighted ? 'bg-accent' : lineColor} ring-4 ring-white flex items-center justify-center`}
                    variants={markerVariants}
                    custom={index * MOTION.STAGGER.NORMAL}
                    initial="hidden"
                    whileInView="visible"
                    viewport={MOTION.VIEWPORT.ONCE}
                    whileHover={{
                      scale: 1.4,
                      boxShadow: '0 0 20px rgba(0, 71, 171, 0.5)'
                    }}
                    transition={{ duration: MOTION.DURATION.FAST }}
                  >
                    {item.icon && <span className="text-xs">{item.icon}</span>}
                  </motion.div>
                </div>

                {/* Content */}
                <div className={`w-full ${isAlternate ? 'md:w-[45%]' : isLeft ? 'ml-12' : 'mr-12'} ${isAlternate ? (isEven ? 'md:pr-12' : 'md:pl-12') : ''}`}>
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      y: -5,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                    }}
                    transition={{ duration: MOTION.DURATION.FAST }}
                    className={`p-6 rounded-xl ${item.highlighted ? 'bg-primary/10 border-2 border-primary' : 'bg-white shadow-lg'}`}
                  >
                    {/* Year Badge */}
                    <motion.span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 ${
                        item.highlighted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={MOTION.VIEWPORT.ONCE}
                      transition={{ delay: 0.2, ...MOTION.SPRING.BOUNCE }}
                    >
                      {item.year}
                    </motion.span>

                    {data.showImages && isValidImage(item.image) && (
                      <motion.div
                        className="relative h-48 rounded-lg overflow-hidden mb-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={MOTION.VIEWPORT.ONCE}
                        transition={{ delay: 0.3, duration: MOTION.DURATION.NORMAL }}
                      >
                        <Image src={safeImageUrl(item.image, 500, 300)!} alt="" fill className="object-cover" />
                      </motion.div>
                    )}

                    <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>{t(item.title)}</h3>
                    <p className="text-gray-600">{t(item.description)}</p>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
