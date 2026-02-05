// Data Fetching Functions - v3.0.0
// Uses sanityFetch from live.ts (defineLive) - no more manual preview parameter
// Live mode and stega are handled automatically by next-sanity v12
import { sanityFetch } from './live'
import { client } from './client'
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
  logoWhite?: unknown
  email?: string
  phone?: string
  address?: string
  facebook?: string
  instagram?: string
  linkedin?: string
  youtube?: string
  twitter?: string
  tiktok?: string
  whatsapp?: string
  whatsappMessage?: string
  // Header settings
  headerLogoSize?: string
  headerHeight?: string
  headerStyle?: string
  headerCtaText?: unknown
  headerCtaLink?: string
  headerShowLanguageSelector?: boolean
  headerNavGap?: string
  // Footer settings
  footerLogoSize?: string
  footerStyle?: string
  footerColumns?: string
  footerShowSocial?: boolean
  footerShowQuickLinks?: boolean
  footerShowProducts?: boolean
  footerShowContacts?: boolean
  footerPadding?: string
  footerColumnsGap?: string
  footerCopyrightText?: string
  footerBottomLinks?: Array<{
    label?: string
    href?: string
  }>
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
  shortDescription?: unknown
  fullDescription?: unknown
  mainImage?: unknown
  gallery?: Array<{
    _key?: string
    asset?: unknown
    alt?: string
    caption?: string
    hotspot?: unknown
    crop?: unknown
  }>
  category?: {
    _id: string
    name?: string
    slug?: { current: string }
  }
  specifications?: Array<{
    _key?: string
    label?: string
    value?: string
  }>
  features?: Array<{
    _key?: string
    icon?: string
    title?: string
    description?: string
  }>
  documents?: Array<{
    _key?: string
    title?: string
    file?: {
      asset?: unknown
    }
    fileType?: string
  }>
  price?: number
  sortOrder?: number
  isActive?: boolean
  isNew?: boolean
  isFeatured?: boolean
  badges?: string[]
  customBadge?: {
    text?: string
    color?: string
  }
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
    _key?: string
    number?: string
    label?: string
  }>
  gallery?: unknown[]
  testimonial?: string
  testimonialAuthor?: string
  featured?: boolean
  publishedAt?: string
}

// ===========================================
// SETTINGS & NAVIGATION
// ===========================================

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data } = await sanityFetch({ query: siteSettingsQuery })
  return data
}

export async function getNavigation(): Promise<Navigation | null> {
  const { data } = await sanityFetch({ query: navigationQuery })
  return data
}

// ===========================================
// PAGES
// ===========================================

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data } = await sanityFetch({ query: pageBySlugQuery, params: { slug } })
  return data
}

export async function getAllPages(): Promise<Page[]> {
  const { data } = await sanityFetch({ query: allPagesQuery })
  return data || []
}

// Uses direct client to avoid draftMode() call in generateStaticParams
export async function getPageSlugs(): Promise<string[]> {
  return await client.fetch(pageSlugsQuery) || []
}

// ===========================================
// PRODUCTS
// ===========================================

export async function getAllProducts(): Promise<Product[]> {
  const { data } = await sanityFetch({ query: allProductsQuery })
  return data || []
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data } = await sanityFetch({ query: productBySlugQuery, params: { slug } })
  return data
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await sanityFetch({ query: featuredProductsQuery })
  return data || []
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const { data } = await sanityFetch({ query: productsByCategoryQuery, params: { categoryId } })
  return data || []
}

// Uses direct client to avoid draftMode() call in generateStaticParams
export async function getProductSlugs(): Promise<string[]> {
  return await client.fetch(productSlugsQuery) || []
}

// ===========================================
// CATEGORIES
// ===========================================

export async function getAllCategories(): Promise<Category[]> {
  const { data } = await sanityFetch({ query: allCategoriesQuery })
  return data || []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await sanityFetch({ query: categoryBySlugQuery, params: { slug } })
  return data
}

// ===========================================
// DEALERS
// ===========================================

export async function getAllDealers(): Promise<Dealer[]> {
  const { data } = await sanityFetch({ query: allDealersQuery })
  return data || []
}

export async function getDealersByCity(city: string): Promise<Dealer[]> {
  const { data } = await sanityFetch({ query: dealersByCityQuery, params: { city } })
  return data || []
}

// ===========================================
// TESTIMONIALS
// ===========================================

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const { data } = await sanityFetch({ query: allTestimonialsQuery })
  return data || []
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const { data } = await sanityFetch({ query: featuredTestimonialsQuery })
  return data || []
}

// ===========================================
// FAQS
// ===========================================

export async function getAllFaqs(): Promise<FAQ[]> {
  const { data } = await sanityFetch({ query: allFaqsQuery })
  return data || []
}

export async function getFaqsByCategory(category: string): Promise<FAQ[]> {
  const { data } = await sanityFetch({ query: faqsByCategoryQuery, params: { category } })
  return data || []
}

// ===========================================
// SECTORS
// ===========================================

export async function getSectors(): Promise<Sector[]> {
  const { data } = await sanityFetch({ query: allSectorsQuery })
  return data || []
}

export async function getSectorBySlug(slug: string): Promise<Sector | null> {
  const { data } = await sanityFetch({ query: sectorBySlugQuery, params: { slug } })
  return data
}

// Uses direct client to avoid draftMode() call in generateStaticParams
export async function getSectorSlugs(): Promise<string[]> {
  return await client.fetch(sectorSlugsQuery) || []
}

export async function getProductsBySector(sectorId: string): Promise<Product[]> {
  const { data } = await sanityFetch({ query: productsBySectorQuery, params: { sectorId } })
  return data || []
}

// ===========================================
// CASE STUDIES
// ===========================================

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const { data } = await sanityFetch({ query: allCaseStudiesQuery })
  return data || []
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const { data } = await sanityFetch({ query: caseStudyBySlugQuery, params: { slug } })
  return data
}

// Uses direct client to avoid draftMode() call in generateStaticParams
export async function getCaseStudySlugs(): Promise<string[]> {
  return await client.fetch(caseStudySlugsQuery) || []
}

export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  const { data } = await sanityFetch({ query: featuredCaseStudiesQuery })
  return data || []
}
