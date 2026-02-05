// SectionsClient - Client component for visual editing with data-sanity attributes
// Compatible with @sanity/visual-editing v2.x + React 18
'use client'

import { createDataAttribute } from '@sanity/visual-editing'
import { SectionRenderer } from './SectionRenderer'
import { SectionDivider } from './SectionDivider'
import type { Product } from '@/lib/sanity/fetch'

const DATA_ATTR_CONFIG = {
  projectId: '97oreljh',
  dataset: 'production',
  baseUrl: 'https://glositalystudio.vercel.app',
}

// Map section types to their typical background colors
const sectionBgMap: Record<string, 'white' | 'gray' | 'primary' | 'dark' | 'gradient'> = {
  heroSection: 'gradient',
  statsSection: 'primary',
  ctaSection: 'primary',
  featuresSection: 'white',
  productsSection: 'gray',
  testimonialsSection: 'gray',
  contactSection: 'gray',
  faqSection: 'white',
  teamSection: 'white',
  timelineSection: 'white',
  gallerySection: 'white',
  textImageSection: 'white',
  richTextSection: 'white',
  videoSection: 'white',
  logoCloudSection: 'gray',
  iconBoxesSection: 'white',
  tabsSection: 'white',
  carouselSection: 'white',
  bannerSection: 'primary',
  beforeAfterSection: 'white',
  downloadSection: 'gray',
  embedSection: 'white',
  mapSection: 'gray',
  counterSection: 'primary',
  pricingSection: 'white',
  sectorsSection: 'gray',
  strengthsSection: 'white',
  caseStudiesSection: 'gray',
  trustBadgesSection: 'gray',
}

type DividerType = 'wave' | 'curve' | 'slant' | 'gradient-fade' | 'dots' | 'none'

function getDividerType(fromBg: string, toBg: string): DividerType {
  if (fromBg === toBg) return 'none'
  if (fromBg === 'primary' || fromBg === 'dark' || fromBg === 'gradient') return 'curve'
  if (toBg === 'primary' || toBg === 'dark' || toBg === 'gradient') return 'curve'
  if ((fromBg === 'white' && toBg === 'gray') || (fromBg === 'gray' && toBg === 'white')) return 'wave'
  return 'gradient-fade'
}

function getDividerColors(fromBg: string, toBg: string): { fromColor: string; toColor: string } {
  const colorMap: Record<string, string> = {
    white: '#ffffff',
    gray: '#f3f4f6',
    primary: '#0047AB',
    dark: '#1f2937',
    gradient: '#003380',
  }
  return {
    fromColor: colorMap[fromBg] || '#ffffff',
    toColor: colorMap[toBg] || '#ffffff',
  }
}

interface SectionsClientProps {
  documentId: string
  documentType: string
  sections: any[]
  products?: Product[]
}

export function SectionsClient({ documentId, documentType, sections, products }: SectionsClientProps) {
  if (!sections || sections.length === 0) return null

  const containerAttr = createDataAttribute({
    ...DATA_ATTR_CONFIG,
    id: documentId,
    type: documentType,
    path: 'sections',
  })

  return (
    <div data-sanity={containerAttr.toString()}>
      {sections.map((section, index) => {
        if (!section || !section._type) return null

        const currentBg = section.backgroundColor || sectionBgMap[section._type] || 'white'
        const nextSection = sections[index + 1]
        const nextBg = nextSection
          ? nextSection.backgroundColor || sectionBgMap[nextSection._type] || 'white'
          : 'white'

        const dividerType = getDividerType(currentBg, nextBg)
        const { fromColor, toColor } = getDividerColors(currentBg, nextBg)
        const needsFlip = currentBg === 'primary' || currentBg === 'dark' || currentBg === 'gradient'

        const sectionAttr = section._key
          ? createDataAttribute({
              ...DATA_ATTR_CONFIG,
              id: documentId,
              type: documentType,
              path: `sections[_key=="${section._key}"]`,
            })
          : undefined

        return (
          <div key={section._key || index} data-sanity={sectionAttr?.toString()}>
            <SectionRenderer
              section={section}
              products={products}
              documentId={documentId}
              sectionKey={section._key}
            />

            {index < sections.length - 1 && dividerType !== 'none' && (
              <SectionDivider
                type={dividerType}
                fromColor={fromColor}
                toColor={toColor}
                flip={needsFlip}
                height={dividerType === 'gradient-fade' ? 40 : 60}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SectionsClient
