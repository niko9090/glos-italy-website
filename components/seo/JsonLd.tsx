// JSON-LD Structured Data Components
// Provides structured data for better SEO and rich search results

import { SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { safeImageUrl, isValidImage } from '@/lib/sanity/client'
import { getTextValue, Language } from '@/lib/utils/textHelpers'

// ===========================================
// TYPES
// ===========================================

interface OrganizationData {
  name?: unknown
  logo?: unknown
  email?: string
  phone?: string
  address?: string
  facebook?: string
  instagram?: string
  linkedin?: string
}

interface ProductData {
  name?: unknown
  description?: unknown
  image?: unknown
  category?: { name?: unknown }
  price?: number
  sku?: string
  brand?: string
}

interface LocalBusinessData {
  name?: string
  description?: unknown
  logo?: unknown
  address?: string
  city?: string
  country?: string
  phone?: string
  email?: string
  location?: {
    lat: number
    lng: number
  }
  openingHours?: string
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface FAQItem {
  question: string
  answer: string
}

// ===========================================
// ORGANIZATION SCHEMA
// ===========================================

interface OrganizationSchemaProps {
  data: OrganizationData
  lang?: Language
}

export function OrganizationSchema({ data, lang = 'it' }: OrganizationSchemaProps) {
  const name = getTextValue(data.name, lang) || SITE_NAME
  const logoUrl = isValidImage(data.logo) ? safeImageUrl(data.logo, 600, 600) : null

  const sameAs = [
    data.facebook,
    data.instagram,
    data.linkedin,
  ].filter(Boolean)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: SITE_URL,
    logo: logoUrl || undefined,
    email: data.email || undefined,
    telephone: data.phone || undefined,
    address: data.address ? {
      '@type': 'PostalAddress',
      streetAddress: data.address,
      addressCountry: 'IT',
    } : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    // Manufacturing company specific
    '@id': `${SITE_URL}/#organization`,
    legalName: name,
    foundingCountry: 'IT',
    knowsAbout: [
      'Paint machinery',
      'Blender machines',
      'Cutting machines',
      'Precision machinery',
    ],
  }

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  )
}

// ===========================================
// PRODUCT SCHEMA
// ===========================================

interface ProductSchemaProps {
  data: ProductData
  url: string
  lang?: Language
}

export function ProductSchema({ data, url, lang = 'it' }: ProductSchemaProps) {
  const name = getTextValue(data.name, lang) || 'Product'
  const description = getTextValue(data.description, lang) || ''
  const imageUrl = isValidImage(data.image) ? safeImageUrl(data.image, 800, 800) : null
  const categoryName = getTextValue(data.category?.name, lang)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description || undefined,
    image: imageUrl || undefined,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    category: categoryName || undefined,
    sku: data.sku || undefined,
    brand: {
      '@type': 'Brand',
      name: data.brand || SITE_NAME,
    },
    manufacturer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: data.price ? {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    } : undefined,
  }

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  )
}

// ===========================================
// LOCAL BUSINESS SCHEMA (for dealers)
// ===========================================

interface LocalBusinessSchemaProps {
  data: LocalBusinessData
  lang?: Language
}

export function LocalBusinessSchema({ data, lang = 'it' }: LocalBusinessSchemaProps) {
  const name = data.name || 'Dealer'
  const description = getTextValue(data.description, lang) || ''
  const logoUrl = isValidImage(data.logo) ? safeImageUrl(data.logo, 400, 400) : null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description: description || undefined,
    image: logoUrl || undefined,
    telephone: data.phone || undefined,
    email: data.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address || undefined,
      addressLocality: data.city || undefined,
      addressCountry: data.country || 'IT',
    },
    geo: data.location ? {
      '@type': 'GeoCoordinates',
      latitude: data.location.lat,
      longitude: data.location.lng,
    } : undefined,
    openingHours: data.openingHours || undefined,
    // Link to parent organization
    parentOrganization: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  )
}

// ===========================================
// BREADCRUMB SCHEMA
// ===========================================

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  if (!items || items.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ===========================================
// FAQ SCHEMA
// ===========================================

interface FAQSchemaProps {
  items: FAQItem[]
}

export function FAQSchema({ items }: FAQSchemaProps) {
  if (!items || items.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ===========================================
// WEBSITE SCHEMA (for homepage)
// ===========================================

interface WebsiteSchemaProps {
  name?: string
  description?: string
}

export function WebsiteSchema({ name, description }: WebsiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: name || SITE_NAME,
    url: SITE_URL,
    description: description || undefined,
    publisher: {
      '@type': 'Organization',
      name: name || SITE_NAME,
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/prodotti?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  )
}

// ===========================================
// WEBPAGE SCHEMA (for individual pages)
// ===========================================

interface WebPageSchemaProps {
  title: string
  description?: string
  url: string
  datePublished?: string
  dateModified?: string
}

export function WebPageSchema({ title, description, url, datePublished, dateModified }: WebPageSchemaProps) {
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description || undefined,
    url: fullUrl,
    datePublished: datePublished || undefined,
    dateModified: dateModified || undefined,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      '@id': `${SITE_URL}/#organization`,
    },
  }

  // Remove undefined values
  const cleanSchema = JSON.parse(JSON.stringify(schema))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  )
}
