// Logo Cloud Section Component
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface LogoCloudSectionProps {
  data: {
    title?: unknown
    subtitle?: unknown
    logos?: Array<{
      _key: string
      logo: any
      name?: string
      url?: string
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
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
}

export default function LogoCloudSection({ data }: LogoCloudSectionProps) {
  const bgClass = bgClasses[data.backgroundColor || 'gray']
  const textColor = data.backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'
  const layout = data.layout || 'grid'
  const columns = data.columns || 5

  const validLogos = data.logos?.filter((logo) => isValidImage(logo.logo)) || []

  if (validLogos.length === 0) return null

  const gridCols: Record<number, string> = {
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-3 md:grid-cols-6',
  }

  const renderLogo = (logo: typeof validLogos[0], index: number) => {
    const content = (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.1 }}
        className={`relative h-16 flex items-center justify-center px-4 ${
          data.grayscale ? 'grayscale hover:grayscale-0' : ''
        } transition-all duration-300`}
      >
        <Image
          src={safeImageUrl(logo.logo, 200, 100)!}
          alt={logo.name || ''}
          width={120}
          height={60}
          className="object-contain max-h-12"
        />
      </motion.div>
    )

    if (logo.url) {
      return (
        <a
          key={logo._key}
          href={logo.url}
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
  if (layout === 'marquee') {
    return (
      <section className={`section ${bgClass} overflow-hidden`}>
        <div className="container-glos">
          {(data.title || data.subtitle) ? (
            <div className={`text-center mb-12 ${textColor}`}>
              {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
              {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
            </div>
          ) : null}
        </div>

        {/* Marquee */}
        <div className="relative">
          <div className="flex animate-marquee gap-12">
            {[...validLogos, ...validLogos].map((logo, index) => (
              <div
                key={`${logo._key}-${index}`}
                className={`flex-shrink-0 h-16 w-32 flex items-center justify-center ${
                  data.grayscale ? 'grayscale hover:grayscale-0' : ''
                } transition-all duration-300`}
              >
                <Image
                  src={safeImageUrl(logo.logo, 200, 100)!}
                  alt={logo.name || ''}
                  width={120}
                  height={60}
                  className="object-contain max-h-12"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Carousel layout
  if (layout === 'carousel') {
    return (
      <section className={`section ${bgClass}`}>
        <div className="container-glos">
          {(data.title || data.subtitle) ? (
            <div className={`text-center mb-12 ${textColor}`}>
              {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
              {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
            </div>
          ) : null}

          {/* Carousel */}
          <div className="flex overflow-x-auto gap-8 pb-4 snap-x scrollbar-hide">
            {validLogos.map((logo, index) => (
              <div key={logo._key} className="flex-shrink-0 snap-center">
                {renderLogo(logo, index)}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Grid layout (default)
  return (
    <section className={`section ${bgClass}`}>
      <div className="container-glos">
        {(data.title || data.subtitle) ? (
          <div className={`text-center mb-12 ${textColor}`}>
            {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
            {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
          </div>
        ) : null}

        {/* Grid */}
        <div className={`grid ${gridCols[columns]} gap-8 items-center justify-items-center`}>
          {validLogos.map((logo, index) => renderLogo(logo, index))}
        </div>
      </div>
    </section>
  )
}
