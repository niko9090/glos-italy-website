// SEO Metadata Utilities
// Helper functions for generating enhanced metadata for better SEO

import { Metadata } from 'next'
import { safeImageUrl, isValidImage } from '@/lib/sanity/client'
import { getTextValue, Language } from '@/lib/utils/textHelpers'

// ===========================================
// CONFIGURATION
// ===========================================

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://glositaly.vercel.app'
export const DEFAULT_LOCALE = 'it_IT'
export const SITE_NAME = 'GLOS Italy'

// ===========================================
// TYPES
// ===========================================

export interface SEOFields {
  metaTitle?: string
  metaDescription?: string
  ogImage?: unknown
  noIndex?: boolean
}

export interface PageSEO {
  title?: unknown
  seoTitle?: string
  seoDescription?: string
  description?: unknown
  slug?: { current: string }
  ogImage?: unknown
  noIndex?: boolean
}

export interface ProductSEO {
  name?: unknown
  shortDescription?: unknown
  mainImage?: unknown
  category?: {
    name?: unknown
  }
  price?: number
  seo?: SEOFields
}

export interface DealerSEO {
  name?: string
  description?: unknown
  address?: string
  city?: string
  country?: string
  phone?: string
  email?: string
  logo?: unknown
  location?: {
    lat: number
    lng: number
  }
}

export interface SiteSettingsSEO {
  companyName?: unknown
  slogan?: unknown
  logo?: unknown
  email?: string
  phone?: string
  address?: string
  facebook?: string
  instagram?: string
  linkedin?: string
}

// ===========================================
// METADATA GENERATION
// ===========================================

/**
 * Generate base metadata for pages
 */
export function generatePageMetadata(
  page: PageSEO | null,
  lang: Language = 'it'
): Metadata {
  if (!page) {
    return {
      title: 'Pagina non trovata',
      robots: { index: false, follow: false },
    }
  }

  const title = page.seoTitle || getTextValue(page.title, lang) || SITE_NAME
  const description = page.seoDescription || getTextValue(page.description, lang) || ''
  const slug = page.slug?.current || ''
  const canonicalUrl = `${SITE_URL}/${slug}`

  // Get OpenGraph image
  const ogImageUrl = isValidImage(page.ogImage)
    ? safeImageUrl(page.ogImage, 1200, 630)
    : null

  const metadata: Metadata = {
    title,
    description: description || undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: description || undefined,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: DEFAULT_LOCALE,
      type: 'website',
      images: ogImageUrl ? [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  }

  // Add robots meta if noIndex is true
  if (page.noIndex) {
    metadata.robots = {
      index: false,
      follow: true,
    }
  }

  return metadata
}

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(
  product: ProductSEO | null,
  lang: Language = 'it'
): Metadata {
  if (!product) {
    return {
      title: 'Prodotto non trovato',
      robots: { index: false, follow: false },
    }
  }

  const name = product.seo?.metaTitle || getTextValue(product.name, lang) || 'Prodotto'
  const description = product.seo?.metaDescription || getTextValue(product.shortDescription, lang) || ''
  const categoryName = getTextValue(product.category?.name, lang)
  const title = categoryName ? `${name} - ${categoryName}` : name

  // Get product image
  const ogImageUrl = isValidImage(product.mainImage)
    ? safeImageUrl(product.mainImage, 1200, 630)
    : null

  return {
    title,
    description: description || undefined,
    openGraph: {
      title,
      description: description || undefined,
      type: 'website',
      siteName: SITE_NAME,
      locale: DEFAULT_LOCALE,
      images: ogImageUrl ? [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: name,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  }
}

/**
 * Generate base site metadata (for layout.tsx)
 */
export function generateSiteMetadata(settings: SiteSettingsSEO | null): Metadata {
  const companyName = getTextValue(settings?.companyName) || SITE_NAME
  const slogan = getTextValue(settings?.slogan) || 'Prodotti di qualita Made in Italy'

  // Get logo for default OG image
  const logoUrl = isValidImage(settings?.logo)
    ? safeImageUrl(settings.logo, 1200, 630)
    : null

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: companyName,
      template: `%s | ${SITE_NAME}`,
    },
    description: slogan,
    keywords: [
      'GLOS Italy',
      'macchinari vernici',
      'blender vernici',
      'taglierine',
      'made in Italy',
      'precision machinery',
      'paint machinery',
    ],
    authors: [{ name: companyName }],
    creator: companyName,
    publisher: companyName,
    formatDetection: {
      email: true,
      address: true,
      telephone: true,
    },
    openGraph: {
      type: 'website',
      locale: DEFAULT_LOCALE,
      alternateLocale: ['en_US', 'es_ES'],
      siteName: companyName,
      title: companyName,
      description: slogan,
      images: logoUrl ? [
        {
          url: logoUrl,
          width: 1200,
          height: 630,
          alt: companyName,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: companyName,
      description: slogan,
      images: logoUrl ? [logoUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      // Add verification codes if needed
      // google: 'google-verification-code',
      // bing: 'bing-verification-code',
    },
  }
}

// ===========================================
// URL HELPERS
// ===========================================

/**
 * Generate canonical URL for a page
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${SITE_URL}/${cleanPath}`
}

/**
 * Generate breadcrumb items for JSON-LD
 */
export function generateBreadcrumbItems(
  items: Array<{ name: string; url: string }>
): Array<{ '@type': string; position: number; name: string; item: string }> {
  return items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
  }))
}
