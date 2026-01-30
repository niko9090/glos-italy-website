// Data Fetching Functions
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
} from './queries'

// Types
export interface SiteSettings {
  companyName?: string
  slogan?: string
  logo?: any
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

export interface Page {
  _id: string
  title?: string
  slug?: { current: string }
  sections?: any[]
  isPublished?: boolean
}

export interface Product {
  _id: string
  name?: string
  slug?: { current: string }
  shortDescription?: string
  description?: string
  specs?: string
  mainImage?: any
  category?: {
    _id: string
    name?: string
    slug?: { current: string }
  }
  isActive?: boolean
  isNew?: boolean
  isFeatured?: boolean
}

export interface Category {
  _id: string
  name?: string
  slug?: { current: string }
  description?: string
  image?: any
  productCount?: number
}

export interface Dealer {
  _id: string
  name?: string
  type?: string
  logo?: any
  email?: string
  phone?: string
  city?: string
  address?: string
  location?: {
    lat: number
    lng: number
  }
  regions?: string[]
  certifications?: string[]
  isActive?: boolean
}

export interface Testimonial {
  _id: string
  author?: string
  company?: string
  role?: string
  avatar?: any
  quote?: string
  rating?: number
}

export interface FAQ {
  _id: string
  question?: string
  answer?: string
  category?: string
}

// ============================================
// FETCH FUNCTIONS
// ============================================

// Settings
export async function getSiteSettings(preview = false): Promise<SiteSettings | null> {
  return sanityFetch<SiteSettings | null>(siteSettingsQuery, {}, preview)
}

// Navigation
export async function getNavigation(preview = false): Promise<Navigation | null> {
  return sanityFetch<Navigation | null>(navigationQuery, {}, preview)
}

// Pages
export async function getPageBySlug(slug: string, preview = false): Promise<Page | null> {
  return sanityFetch<Page | null>(pageBySlugQuery, { slug }, preview)
}

export async function getAllPages(preview = false): Promise<Page[]> {
  const result = await sanityFetch<Page[]>(allPagesQuery, {}, preview)
  return result || []
}

export async function getPageSlugs(): Promise<string[]> {
  const result = await sanityFetch<string[]>(pageSlugsQuery, {}, false)
  return result || []
}

// Products
export async function getAllProducts(preview = false): Promise<Product[]> {
  const result = await sanityFetch<Product[]>(allProductsQuery, {}, preview)
  return result || []
}

export async function getProductBySlug(slug: string, preview = false): Promise<Product | null> {
  return sanityFetch<Product | null>(productBySlugQuery, { slug }, preview)
}

export async function getFeaturedProducts(preview = false): Promise<Product[]> {
  const result = await sanityFetch<Product[]>(featuredProductsQuery, {}, preview)
  return result || []
}

export async function getProductsByCategory(categoryId: string, preview = false): Promise<Product[]> {
  const result = await sanityFetch<Product[]>(productsByCategoryQuery, { categoryId }, preview)
  return result || []
}

export async function getProductSlugs(): Promise<string[]> {
  const result = await sanityFetch<string[]>(productSlugsQuery, {}, false)
  return result || []
}

// Categories
export async function getAllCategories(preview = false): Promise<Category[]> {
  const result = await sanityFetch<Category[]>(allCategoriesQuery, {}, preview)
  return result || []
}

export async function getCategoryBySlug(slug: string, preview = false): Promise<Category | null> {
  return sanityFetch<Category | null>(categoryBySlugQuery, { slug }, preview)
}

// Dealers
export async function getAllDealers(preview = false): Promise<Dealer[]> {
  const result = await sanityFetch<Dealer[]>(allDealersQuery, {}, preview)
  return result || []
}

export async function getDealersByCity(city: string, preview = false): Promise<Dealer[]> {
  const result = await sanityFetch<Dealer[]>(dealersByCityQuery, { city }, preview)
  return result || []
}

// Testimonials
export async function getAllTestimonials(preview = false): Promise<Testimonial[]> {
  const result = await sanityFetch<Testimonial[]>(allTestimonialsQuery, {}, preview)
  return result || []
}

export async function getFeaturedTestimonials(preview = false): Promise<Testimonial[]> {
  const result = await sanityFetch<Testimonial[]>(featuredTestimonialsQuery, {}, preview)
  return result || []
}

// FAQs
export async function getAllFaqs(preview = false): Promise<FAQ[]> {
  const result = await sanityFetch<FAQ[]>(allFaqsQuery, {}, preview)
  return result || []
}

export async function getFaqsByCategory(category: string, preview = false): Promise<FAQ[]> {
  const result = await sanityFetch<FAQ[]>(faqsByCategoryQuery, { category }, preview)
  return result || []
}
