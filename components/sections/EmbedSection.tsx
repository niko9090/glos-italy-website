// Embed Section Component
'use client'

import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'
import { getSpacingClasses } from '@/lib/utils/spacing'

interface EmbedSectionProps {
  documentId?: string
  sectionKey?: string
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
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string
    marginTop?: string
    marginBottom?: string
  }
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
}

export default function EmbedSection({ data, documentId, sectionKey }: EmbedSectionProps) {
  const bgClass = bgClasses[data.backgroundColor || 'white']
  const textColor = data.backgroundColor?.includes('dark') ? 'text-white' : 'text-gray-900'
  const height = data.height || '450'
  const isFullWidth = data.width?.includes('full')

  const getEmbedUrl = (): string | null => {
    const embedType = data.embedType || ''
    if (embedType?.includes('google-maps')) {
      if (data.googleMapsUrl) return data.googleMapsUrl
      if (data.googleMapsAddress) {
        const encoded = encodeURIComponent(data.googleMapsAddress)
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encoded}`
      }
      return null
    }
    if (embedType?.includes('google-form')) return data.googleFormUrl || null
    if (embedType?.includes('calendly')) return data.calendlyUrl || null
    if (embedType?.includes('typeform')) return data.typeformUrl || null
    if (embedType?.includes('iframe')) return data.iframeUrl || null
    return null
  }

  const embedUrl = getEmbedUrl()

  const renderEmbed = () => {
    if (data.embedType?.includes('custom') && data.customHtml) {
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
    <section data-sanity-edit-target className={`${getSpacingClasses(data)} ${bgClass}`}>
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
