// Timeline Section Component
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { getTextValue } from '@/lib/utils/textHelpers'
import RichText from '@/components/RichText'

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
  const bgClass = bgClasses[data.backgroundColor || 'white']
  const textColor = data.backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'
  const lineColor = lineColorClasses[data.lineColor || 'primary']
  const layout = data.layout || 'vertical-alternate'

  if (!data.items || data.items.length === 0) return null

  // Horizontal layout
  if (layout === 'horizontal') {
    return (
      <section className={`section ${bgClass} overflow-hidden`}>
        <div className="container-glos">
          {/* Header */}
          {(data.title || data.subtitle) && (
            <div className={`text-center mb-12 ${textColor}`}>
              {data.title && <h2 className="section-title mb-4"><RichText value={data.title} /></h2>}
              {data.subtitle && <div className="section-subtitle"><RichText value={data.subtitle} /></div>}
            </div>
          )}

          {/* Horizontal Timeline */}
          <div className="relative">
            {/* Line */}
            <div className={`absolute top-8 left-0 right-0 h-1 ${lineColor}`} />

            {/* Items */}
            <div className="flex overflow-x-auto gap-8 pb-4 snap-x">
              {data.items.map((item, index) => (
                <motion.div
                  key={item._key}
                  initial={data.animated ? { opacity: 0, y: 20 } : undefined}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-64 snap-start"
                >
                  {/* Dot */}
                  <div className={`w-4 h-4 rounded-full ${lineColor} mx-auto mb-4 ring-4 ring-white`} />

                  {/* Year */}
                  <div className={`text-center font-bold text-lg ${item.highlighted ? 'text-primary' : textColor}`}>
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.year}
                  </div>

                  {/* Content Card */}
                  <div className={`mt-4 p-4 rounded-xl ${item.highlighted ? 'bg-primary/10 border-2 border-primary' : 'bg-white shadow-lg'}`}>
                    {data.showImages && isValidImage(item.image) && (
                      <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                        <Image src={safeImageUrl(item.image, 300, 200)!} alt="" fill className="object-cover" />
                      </div>
                    )}
                    <h3 className={`font-semibold mb-2 ${textColor}`}>{getTextValue(item.title)}</h3>
                    <p className="text-sm text-gray-600">{getTextValue(item.description)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Vertical layouts
  const isAlternate = layout === 'vertical-alternate'
  const isLeft = layout === 'vertical-left'

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

        {/* Vertical Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center Line */}
          <div className={`absolute ${isLeft ? 'left-4' : isAlternate ? 'left-1/2 -translate-x-1/2' : 'right-4'} top-0 bottom-0 w-1 ${lineColor}`} />

          {data.items.map((item, index) => {
            const isEven = index % 2 === 0
            const alignRight = isAlternate ? isEven : !isLeft

            return (
              <motion.div
                key={item._key}
                initial={data.animated ? { opacity: 0, x: alignRight ? -50 : 50 } : undefined}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className={`relative flex items-center mb-12 ${
                  isAlternate
                    ? isEven ? 'flex-row' : 'flex-row-reverse'
                    : isLeft ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className={`absolute ${isLeft ? 'left-4' : isAlternate ? 'left-1/2' : 'right-4'} -translate-x-1/2 z-10`}>
                  <div className={`w-6 h-6 rounded-full ${item.highlighted ? 'bg-accent' : lineColor} ring-4 ring-white flex items-center justify-center`}>
                    {item.icon && <span className="text-xs">{item.icon}</span>}
                  </div>
                </div>

                {/* Content */}
                <div className={`w-full ${isAlternate ? 'md:w-[45%]' : isLeft ? 'ml-12' : 'mr-12'} ${isAlternate ? (isEven ? 'md:pr-12' : 'md:pl-12') : ''}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-xl ${item.highlighted ? 'bg-primary/10 border-2 border-primary' : 'bg-white shadow-lg'}`}
                  >
                    {/* Year Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 ${
                      item.highlighted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.year}
                    </span>

                    {data.showImages && isValidImage(item.image) && (
                      <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                        <Image src={safeImageUrl(item.image, 500, 300)!} alt="" fill className="object-cover" />
                      </div>
                    )}

                    <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>{getTextValue(item.title)}</h3>
                    <p className="text-gray-600">{getTextValue(item.description)}</p>
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
