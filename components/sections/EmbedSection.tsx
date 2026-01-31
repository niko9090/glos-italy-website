// Embed Section Component
'use client'

import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface EmbedSectionProps {
  data: {
    title?: unknown
    subtitle?: unknown
    description?: unknown
    embedType?: string
    googleMapsUrl?: string
    googleMapsAddress?: string
    googleFormUrl?: string
    calendlyUrl?: string
    typeformUrl?: string
    customHtml?: string
    iframeUrl?: string
    height?: string
    width?: string
    rounded?: boolean
    shadow?: boolean
    backgroundColor?: string
  }
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
}

export default function EmbedSection({ data }: EmbedSectionProps) {
  const bgClass = bgClasses[data.backgroundColor || 'white']
  const textColor = data.backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'
  const height = data.height || '450'
  const isFullWidth = data.width === 'full'

  const getEmbedUrl = (): string | null => {
    switch (data.embedType) {
      case 'google-maps':
        if (data.googleMapsUrl) {
          return data.googleMapsUrl
        }
        if (data.googleMapsAddress) {
          const encoded = encodeURIComponent(data.googleMapsAddress)
          return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encoded}`
        }
        return null
      case 'google-form':
        return data.googleFormUrl || null
      case 'calendly':
        return data.calendlyUrl || null
      case 'typeform':
        return data.typeformUrl || null
      case 'iframe':
        return data.iframeUrl || null
      default:
        return null
    }
  }

  const embedUrl = getEmbedUrl()

  const renderEmbed = () => {
    if (data.embedType === 'custom' && data.customHtml) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: data.customHtml }}
          className="w-full"
          style={{ height: `${height}px` }}
        />
      )
    }

    if (!embedUrl) {
      return (
        <div
          className="w-full bg-gray-100 flex items-center justify-center text-gray-500"
          style={{ height: `${height}px` }}
        >
          Nessun contenuto da visualizzare
        </div>
      )
    }

    return (
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    )
  }

  return (
    <section className={`section ${bgClass}`}>
      <div className={isFullWidth ? '' : 'container-glos'}>
        {(data.title || data.subtitle) ? (
          <div className={`text-center mb-12 ${isFullWidth ? 'px-4' : ''} ${textColor}`}>
            {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
            {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
            {data.description ? (
              <div className="prose prose-lg max-w-2xl mx-auto mt-4">
                <RichText value={data.description} />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Embed Container */}
        <div
          className={`overflow-hidden ${data.rounded ? 'rounded-2xl' : ''} ${data.shadow ? 'shadow-xl' : ''}`}
        >
          {renderEmbed()}
        </div>
      </div>
    </section>
  )
}
