// Section Renderer - Renders sections based on type
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

interface SectionRendererProps {
  section: any
  products?: Product[]
}

export function SectionRenderer({ section, products }: SectionRendererProps) {
  if (!section || !section._type) {
    return null
  }

  switch (section._type) {
    // === SEZIONI PRINCIPALI ===
    case 'heroSection':
      return <HeroSection data={section} />

    case 'carouselSection':
      return <CarouselSection data={section} />

    case 'bannerSection':
      return <BannerSection data={section} />

    // === TESTO & MEDIA ===
    case 'textImageSection':
      return <TextImageSection data={section} />

    case 'richTextSection':
      return <RichTextSection data={section} />

    case 'videoSection':
      return <VideoSection data={section} />

    case 'gallerySection':
      return <GallerySection data={section} />

    case 'beforeAfterSection':
      return <BeforeAfterSection data={section} />

    // === CONTENUTI STRUTTURATI ===
    case 'statsSection':
      return <StatsSection data={section} />

    case 'productsSection':
      return <ProductsSection data={section} products={products} />

    case 'featuresSection':
      return <FeaturesSection data={section} />

    case 'iconBoxesSection':
      return <IconBoxesSection data={section} />

    case 'tabsSection':
      return <TabsSection data={section} />

    case 'timelineSection':
      return <TimelineSection data={section} />

    // === SOCIAL PROOF ===
    case 'testimonialsSection':
      return <TestimonialsSection data={section} />

    case 'logoCloudSection':
      return <LogoCloudSection data={section} />

    case 'teamSection':
      return <TeamSection data={section} />

    // === FAQ & CONTATTI ===
    case 'faqSection':
      return <FaqSection data={section} />

    case 'ctaSection':
      return <CTASection data={section} />

    case 'contactSection':
      return <ContactSection data={section} />

    // === UTILITY ===
    case 'downloadSection':
      return <DownloadSection data={section} />

    case 'embedSection':
      return <EmbedSection data={section} />

    default:
      // Log unknown section types in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unknown section type: ${section._type}`)
      }
      return null
  }
}
