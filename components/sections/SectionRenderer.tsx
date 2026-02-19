// Section Renderer - v3.0.0 - Passes documentId/sectionKey for visual editing
'use client'

import dynamic from 'next/dynamic'
import type { Product } from '@/lib/sanity/fetch'

// Lazy load section components
const HeroSection = dynamic(() => import('./HeroSection'))
const StatsSection = dynamic(() => import('./StatsSection'))
const ProductsSection = dynamic(() => import('./ProductsSection'))
const FeaturesSection = dynamic(() => import('./FeaturesSection'))
const GallerySection = dynamic(() => import('./GallerySection'))
const CTASection = dynamic(() => import('./CTASection'))
const ContactSection = dynamic(() => import('./ContactSection'))
const TestimonialsSection = dynamic(() => import('./TestimonialsSection'))

// New sections
const TextImageSection = dynamic(() => import('./TextImageSection'))
const RichTextSection = dynamic(() => import('./RichTextSection'))
const FaqSection = dynamic(() => import('./FaqSection'))
const LogoCloudSection = dynamic(() => import('./LogoCloudSection'))

// Advanced sections
const CarouselSection = dynamic(() => import('./CarouselSection'))
const VideoSection = dynamic(() => import('./VideoSection'))
const TimelineSection = dynamic(() => import('./TimelineSection'))
const TeamSection = dynamic(() => import('./TeamSection'))
const TabsSection = dynamic(() => import('./TabsSection'))
const BannerSection = dynamic(() => import('./BannerSection'))
const IconBoxesSection = dynamic(() => import('./IconBoxesSection'))
const BeforeAfterSection = dynamic(() => import('./BeforeAfterSection'))
const DownloadSection = dynamic(() => import('./DownloadSection'))
const EmbedSection = dynamic(() => import('./EmbedSection'))
const MapSection = dynamic(() => import('./MapSection'))
const CounterSection = dynamic(() => import('./CounterSection'))
const PricingSection = dynamic(() => import('./PricingSection'))

// New business sections
const SectorsSection = dynamic(() => import('./SectorsSection'))
const StrengthsSection = dynamic(() => import('./StrengthsSection'))
const CaseStudiesSection = dynamic(() => import('./CaseStudiesSection'))
const TrustBadgesSection = dynamic(() => import('./TrustBadgesSection'))

interface SectionRendererProps {
  section: any
  products?: Product[]
  documentId?: string
  sectionKey?: string
}

// Lista delle sezioni da nascondere (non renderizzare)
// Per riattivare una sezione, rimuoverla da questo array
const HIDDEN_SECTIONS: string[] = [
  'statsSection', // Nascosta: 30+ Anni, 500+ Clienti, etc.
]

export function SectionRenderer({ section, products, documentId, sectionKey }: SectionRendererProps) {
  if (!section || !section._type) {
    return null
  }

  // Salta il rendering delle sezioni nascoste
  if (HIDDEN_SECTIONS.includes(section._type)) {
    return null
  }

  // Common props for visual editing
  const editProps = { documentId, sectionKey }

  switch (section._type) {
    // === SEZIONI PRINCIPALI ===
    case 'heroSection':
      return <HeroSection data={section} {...editProps} />

    case 'carouselSection':
      return <CarouselSection data={section} {...editProps} />

    case 'bannerSection':
      return <BannerSection data={section} {...editProps} />

    // === TESTO & MEDIA ===
    case 'textImageSection':
      return <TextImageSection data={section} {...editProps} />

    case 'richTextSection':
      return <RichTextSection data={section} {...editProps} />

    case 'videoSection':
      return <VideoSection data={section} {...editProps} />

    case 'gallerySection':
      return <GallerySection data={section} {...editProps} />

    case 'beforeAfterSection':
      return <BeforeAfterSection data={section} {...editProps} />

    // === CONTENUTI STRUTTURATI ===
    case 'statsSection':
      return <StatsSection data={section} {...editProps} />

    case 'productsSection':
      return <ProductsSection data={section} products={products} {...editProps} />

    case 'featuresSection':
      return <FeaturesSection data={section} {...editProps} />

    case 'iconBoxesSection':
      return <IconBoxesSection data={section} {...editProps} />

    case 'tabsSection':
      return <TabsSection data={section} {...editProps} />

    case 'timelineSection':
      return <TimelineSection data={section} {...editProps} />

    // === BUSINESS SECTIONS ===
    case 'sectorsSection':
      return <SectorsSection data={section} {...editProps} />

    case 'strengthsSection':
      return <StrengthsSection data={section} {...editProps} />

    case 'caseStudiesSection':
      return <CaseStudiesSection data={section} {...editProps} />

    case 'trustBadgesSection':
      return <TrustBadgesSection data={section} {...editProps} />

    // === SOCIAL PROOF ===
    case 'testimonialsSection':
      return <TestimonialsSection data={section} {...editProps} />

    case 'logoCloudSection':
      return <LogoCloudSection data={section} {...editProps} />

    case 'teamSection':
      return <TeamSection data={section} {...editProps} />

    // === FAQ & CONTATTI ===
    case 'faqSection':
      return <FaqSection data={section} {...editProps} />

    case 'ctaSection':
      return <CTASection data={section} {...editProps} />

    case 'contactSection':
      return <ContactSection data={section} {...editProps} />

    // === UTILITY ===
    case 'downloadSection':
      return <DownloadSection data={section} {...editProps} />

    case 'embedSection':
      return <EmbedSection data={section} {...editProps} />

    case 'mapSection':
      return <MapSection data={section} dealers={section.dealers} {...editProps} />

    case 'counterSection':
      return <CounterSection data={section} {...editProps} />

    case 'pricingSection':
      return <PricingSection data={section} {...editProps} />

    default:
      // Log unknown section types in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unknown section type: ${section._type}`)
      }
      return null
  }
}
