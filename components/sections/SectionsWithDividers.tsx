// Sections With Dividers - v3.0.0
// Delegates to SectionsClient for visual editing when documentId is provided
'use client'

import { SectionsClient } from './SectionsClient'
import { SectionRenderer } from './SectionRenderer'
import { SectionDivider } from './SectionDivider'
import type { Product } from '@/lib/sanity/fetch'

interface SectionsWithDividersProps {
  sections: any[]
  products?: Product[]
  documentId?: string
  documentType?: string
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
  // New business sections
  sectorsSection: 'gray',
  strengthsSection: 'white',
  caseStudiesSection: 'gray',
  trustBadgesSection: 'gray',
}

// Divider types based on transition
type DividerType = 'wave' | 'curve' | 'slant' | 'gradient-fade' | 'dots' | 'none'

function getDividerType(fromBg: string, toBg: string): DividerType {
  // No divider needed if same background
  if (fromBg === toBg) return 'none'

  // Use curve for transitions involving primary/dark colors
  if (fromBg === 'primary' || fromBg === 'dark' || fromBg === 'gradient') {
    return 'curve'
  }

  if (toBg === 'primary' || toBg === 'dark' || toBg === 'gradient') {
    return 'curve'
  }

  // Wave for white <-> gray transitions
  if ((fromBg === 'white' && toBg === 'gray') || (fromBg === 'gray' && toBg === 'white')) {
    return 'wave'
  }

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

export function SectionsWithDividers({ sections, products, documentId, documentType }: SectionsWithDividersProps) {
  if (!sections || sections.length === 0) return null

  // Use SectionsClient for visual editing when documentId is provided
  if (documentId && documentType) {
    return (
      <SectionsClient
        documentId={documentId}
        documentType={documentType}
        sections={sections}
        products={products}
      />
    )
  }

  // Fallback: render without visual editing data attributes
  return (
    <>
      {sections.map((section, index) => {
        if (!section || !section._type) return null

        const currentBg = section.backgroundColor || sectionBgMap[section._type] || 'white'
        const nextSection = sections[index + 1]
        const nextBg = nextSection
          ? nextSection.backgroundColor || sectionBgMap[nextSection._type] || 'white'
          : 'white'

        const dividerType = getDividerType(currentBg, nextBg)
        const { fromColor, toColor } = getDividerColors(currentBg, nextBg)

        // Determine if we need to flip the divider
        const needsFlip = currentBg === 'primary' || currentBg === 'dark' || currentBg === 'gradient'

        return (
          <div key={section._key || index}>
            {/* The Section */}
            <SectionRenderer section={section} products={products} />

            {/* Divider after section (except last) */}
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
    </>
  )
}

export default SectionsWithDividers
