// Section Renderer - Renders sections based on type
'use client'

import dynamic from 'next/dynamic'
import type { Product, Testimonial } from '@/lib/sanity/fetch'

// Lazy load section components
const HeroSection = dynamic(() => import('./HeroSection'))
const StatsSection = dynamic(() => import('./StatsSection'))
const ProductsSection = dynamic(() => import('./ProductsSection'))
const FeaturesSection = dynamic(() => import('./FeaturesSection'))
const GallerySection = dynamic(() => import('./GallerySection'))
const CTASection = dynamic(() => import('./CTASection'))
const ContactSection = dynamic(() => import('./ContactSection'))
const TestimonialsSection = dynamic(() => import('./TestimonialsSection'))

interface SectionRendererProps {
  section: any
  products?: Product[]
  testimonials?: Testimonial[]
}

export function SectionRenderer({ section, products, testimonials }: SectionRendererProps) {
  if (!section || !section._type) {
    return null
  }

  switch (section._type) {
    case 'heroSection':
      return <HeroSection data={section} />

    case 'statsSection':
      return <StatsSection data={section} />

    case 'productsSection':
      return <ProductsSection data={section} products={products} />

    case 'featuresSection':
      return <FeaturesSection data={section} />

    case 'gallerySection':
      return <GallerySection data={section} />

    case 'ctaSection':
      return <CTASection data={section} />

    case 'contactSection':
      return <ContactSection data={section} />

    case 'testimonialsSection':
      return <TestimonialsSection data={section} testimonials={testimonials} />

    default:
      // Log unknown section types in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unknown section type: ${section._type}`)
      }
      return null
  }
}
