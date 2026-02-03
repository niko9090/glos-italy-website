// Data Fetching Functions
// These functions wrap sanityFetch with proper cache tags for on-demand revalidation
// Cache tags align with Sanity document types for accurate invalidation via webhook
import { sanityFetch } from './client'
import {
  siteSettingsQuery,
  navigationQuery,
  pageBySlugQuery,
  allPagesQuery,
  pageSlugsQuery,
  allProductsQuery,
  productBySlugQuery,
  featuredProductsQuery,
  productsByCategoryQuery,
  productSlugsQuery,
  allCategoriesQuery,
  categoryBySlugQuery,
  allDealersQuery,
  dealersByCityQuery,
  allTestimonialsQuery,
  featuredTestimonialsQuery,
  allFaqsQuery,
  faqsByCategoryQuery,
  // Sectors
  allSectorsQuery,
  sectorBySlugQuery,
  sectorSlugsQuery,
  productsBySectorQuery,
  // Case Studies
  allCaseStudiesQuery,
  caseStudyBySlugQuery,
  caseStudySlugsQuery,
  featuredCaseStudiesQuery,
} from './queries'

// ===========================================
// TYPE DEFINITIONS
// ===========================================

export interface SiteSettings {
  companyName?: string
  slogan?: string
  logo?: unknown
  email?: string
  phone?: string
  address?: string
  facebook?: string
  instagram?: string
  linkedin?: string
}

export interface Navigation {
  items?: Array<{
    _key: string
    label?: string
    href?: string
  }>
}

// Base type for all sections
export interface Section {
  _key: string
  _type: string
  [key: string]: unknown
}

export interface Page {
  _id: string
  _type?: string
  title?: string
  slug?: { current: string }
  description?: string
  sections?: Section[]
  isPublished?: boolean
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: unknown
  }
}

export interface Product {
  _id: string
  name?: string
  slug?: { current: string }
  shortDescription?: string
  fullDescription?: unknown
  mainImage?: unknown
  gallery?: unknown[]
  category?: {
    _id: string
    name?: string
    slug?: { current: string }
  }
  specifications?: Array<{
    label?: string
    value?: string
  }>
  documents?: unknown[]
  price?: number
  isActive?: boolean
  isNew?: boolean
  isFeatured?: boolean
  relatedProducts?: Product[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export interface Category {
  _id: string
  name?: string
  slug?: { current: string }
  description?: string
  image?: unknown
  productCount?: number
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export interface Dealer {
  _id: string
  name?: string
  type?: string
  description?: string
  logo?: unknown
  email?: string
  phone?: string
  website?: string
  openingHours?: string
  country?: string
  city?: string
  address?: string
  location?: {
    lat: number
    lng: number
  }
  regions?: string[]
  certifications?: string[]
  youtubeVideo?: string
  gallery?: unknown[]
  isActive?: boolean
  isFeatured?: boolean
}

export interface Testimonial {
  _id: string
  author?: string
  company?: string
  role?: string
  avatar?: unknown
  quote?: string
  rating?: number
}

export interface FAQ {
  _id: string
  question?: string
  answer?: string
  category?: string
}

export interface Sector {
  _id: string
  name?: unknown
  slug?: { current: string }
  description?: unknown
  fullDescription?: unknown
  icon?: string
  image?: unknown
  color?: string
  productCount?: number
  keyPoints?: Array<{
    _key: string
    icon?: string
    title?: unknown
    description?: unknown
  }>
  products?: Product[]
}

export interface CaseStudy {
  _id: string
  title?: unknown
  slug?: { current: string }
  client?: string
  sector?: {
    _id: string
    name?: unknown
    slug?: { current: string }
  }
  products?: Product[]
  challenge?: unknown
  solution?: unknown
  results?: unknown
  stats?: Array<{
    _key: string
    label?: string
    value?: string
  }>
  gallery?: unknown[]
  testimonial?: unknown
  testimonialAuthor?: string
  featured?: boolean
  publishedAt?: string
}

// ===========================================
// SETTINGS & NAVIGATION
// Cache tags: 'settings', 'navigation' - invalidated on global changes
// ===========================================

export async function getSiteSettings(
  preview = false
): Promise<SiteSettings | null> {
  return sanityFetch<SiteSettings | null>(
    siteSettingsQuery,
    {},
    preview,
    ['settings']
  )
}

export async function getNavigation(
  preview = false
): Promise<Navigation | null> {
  return sanityFetch<Navigation | null>(
    navigationQuery,
    {},
    preview,
    ['navigation']
  )
}

// ===========================================
// PAGES
// Cache tags: 'pages', 'page-{slug}' - invalidated on page changes
// ===========================================

export async function getPageBySlug(
  slug: string,
  preview = false
): Promise<Page | null> {
  return sanityFetch<Page | null>(
    pageBySlugQuery,
    { slug },
    preview,
    ['pages', `page-${slug}`]
  )
}

export async function getAllPages(preview = false): Promise<Page[]> {
  const result = await sanityFetch<Page[]>(allPagesQuery, {}, preview, ['pages'])
  return result || []
}

export async function getPageSlugs(): Promise<string[]> {
  const result = await sanityFetch<string[]>(pageSlugsQuery, {}, false, ['pages'])
  return result || []
}

// ===========================================
// PRODUCTS
// Cache tags: 'products', 'product-{slug}' - invalidated on product changes
// ===========================================

export async function getAllProducts(preview = false): Promise<Product[]> {
  const result = await sanityFetch<Product[]>(
    allProductsQuery,
    {},
    preview,
    ['products']
  )
  return result || []
}

export async function getProductBySlug(
  slug: string,
  preview = false
): Promise<Product | null> {
  return sanityFetch<Product | null>(
    productBySlugQuery,
    { slug },
    preview,
    ['products', `product-${slug}`]
  )
}

export async function getFeaturedProducts(preview = false): Promise<Product[]> {
  const result = await sanityFetch<Product[]>(
    featuredProductsQuery,
    {},
    preview,
    ['products']
  )
  return result || []
}

export async function getProductsByCategory(
  categoryId: string,
  preview = false
): Promise<Product[]> {
  const result = await sanityFetch<Product[]>(
    productsByCategoryQuery,
    { categoryId },
    preview,
    ['products', 'categories']
  )
  return result || []
}

export async function getProductSlugs(): Promise<string[]> {
  const result = await sanityFetch<string[]>(productSlugsQuery, {}, false, [
    'products',
  ])
  return result || []
}

// ===========================================
// CATEGORIES
// Cache tags: 'categories', 'category-{slug}' - invalidated on category changes
// ===========================================

export async function getAllCategories(preview = false): Promise<Category[]> {
  const result = await sanityFetch<Category[]>(
    allCategoriesQuery,
    {},
    preview,
    ['categories']
  )
  return result || []
}

export async function getCategoryBySlug(
  slug: string,
  preview = false
): Promise<Category | null> {
  return sanityFetch<Category | null>(
    categoryBySlugQuery,
    { slug },
    preview,
    ['categories', `category-${slug}`]
  )
}

// ===========================================
// DEALERS
// Cache tags: 'dealers' - invalidated on dealer changes
// ===========================================

export async function getAllDealers(preview = false): Promise<Dealer[]> {
  const result = await sanityFetch<Dealer[]>(allDealersQuery, {}, preview, [
    'dealers',
  ])
  return result || []
}

export async function getDealersByCity(
  city: string,
  preview = false
): Promise<Dealer[]> {
  const result = await sanityFetch<Dealer[]>(
    dealersByCityQuery,
    { city },
    preview,
    ['dealers']
  )
  return result || []
}

// ===========================================
// TESTIMONIALS
// Cache tags: 'testimonials' - invalidated on testimonial changes
// ===========================================

export async function getAllTestimonials(
  preview = false
): Promise<Testimonial[]> {
  const result = await sanityFetch<Testimonial[]>(
    allTestimonialsQuery,
    {},
    preview,
    ['testimonials']
  )
  return result || []
}

export async function getFeaturedTestimonials(
  preview = false
): Promise<Testimonial[]> {
  const result = await sanityFetch<Testimonial[]>(
    featuredTestimonialsQuery,
    {},
    preview,
    ['testimonials']
  )
  return result || []
}

// ===========================================
// FAQS
// Cache tags: 'faqs' - invalidated on FAQ changes
// ===========================================

export async function getAllFaqs(preview = false): Promise<FAQ[]> {
  const result = await sanityFetch<FAQ[]>(allFaqsQuery, {}, preview, ['faqs'])
  return result || []
}

export async function getFaqsByCategory(
  category: string,
  preview = false
): Promise<FAQ[]> {
  const result = await sanityFetch<FAQ[]>(
    faqsByCategoryQuery,
    { category },
    preview,
    ['faqs']
  )
  return result || []
}

// ===========================================
// SECTORS
// Cache tags: 'sectors', 'sector-{slug}' - invalidated on sector changes
// ===========================================

export async function getSectors(preview = false): Promise<Sector[]> {
  const result = await sanityFetch<Sector[]>(allSectorsQuery, {}, preview, [
    'sectors',
  ])
  return result || []
}

export async function getSectorBySlug(
  slug: string,
  preview = false
): Promise<Sector | null> {
  return sanityFetch<Sector | null>(
    sectorBySlugQuery,
    { slug },
    preview,
    ['sectors', `sector-${slug}`]
  )
}

export async function getSectorSlugs(): Promise<string[]> {
  const result = await sanityFetch<string[]>(sectorSlugsQuery, {}, false, [
    'sectors',
  ])
  return result || []
}

export async function getProductsBySector(
  sectorId: string,
  preview = false
): Promise<Product[]> {
  const result = await sanityFetch<Product[]>(
    productsBySectorQuery,
    { sectorId },
    preview,
    ['products', 'sectors']
  )
  return result || []
}

// ===========================================
// CASE STUDIES
// Cache tags: 'caseStudies', 'caseStudy-{slug}' - invalidated on case study changes
// ===========================================

export async function getCaseStudies(preview = false): Promise<CaseStudy[]> {
  const result = await sanityFetch<CaseStudy[]>(allCaseStudiesQuery, {}, preview, [
    'caseStudies',
  ])
  return result || []
}

export async function getCaseStudyBySlug(
  slug: string,
  preview = false
): Promise<CaseStudy | null> {
  return sanityFetch<CaseStudy | null>(
    caseStudyBySlugQuery,
    { slug },
    preview,
    ['caseStudies', `caseStudy-${slug}`]
  )
}

export async function getCaseStudySlugs(): Promise<string[]> {
  const result = await sanityFetch<string[]>(caseStudySlugsQuery, {}, false, [
    'caseStudies',
  ])
  return result || []
}

export async function getFeaturedCaseStudies(
  preview = false
): Promise<CaseStudy[]> {
  const result = await sanityFetch<CaseStudy[]>(
    featuredCaseStudiesQuery,
    {},
    preview,
    ['caseStudies']
  )
  return result || []
}
