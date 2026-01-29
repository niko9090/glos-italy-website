// Data Fetching Functions
import { getClient } from './client'
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

// Types - Semplificati (no multilingua)
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
  email?: string
  phone?: string
  city?: string
  address?: string
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
  const client = getClient(preview)
  return client.fetch(siteSettingsQuery, {}, { next: { revalidate: 60 } })
}

// Navigation
export async function getNavigation(preview = false): Promise<Navigation | null> {
  const client = getClient(preview)
  return client.fetch(navigationQuery, {}, { next: { revalidate: 60 } })
}

// Pages
export async function getPageBySlug(slug: string, preview = false): Promise<Page | null> {
  const client = getClient(preview)
  return client.fetch(pageBySlugQuery, { slug }, { next: { revalidate: 60 } })
}

export async function getAllPages(preview = false): Promise<Page[]> {
  const client = getClient(preview)
  return client.fetch(allPagesQuery, {}, { next: { revalidate: 60 } }) || []
}

export async function getPageSlugs(): Promise<string[]> {
  const client = getClient(false)
  return client.fetch(pageSlugsQuery) || []
}

// Products
export async function getAllProducts(preview = false): Promise<Product[]> {
  const client = getClient(preview)
  return client.fetch(allProductsQuery, {}, { next: { revalidate: 60 } }) || []
}

export async function getProductBySlug(slug: string, preview = false): Promise<Product | null> {
  const client = getClient(preview)
  return client.fetch(productBySlugQuery, { slug }, { next: { revalidate: 60 } })
}

export async function getFeaturedProducts(preview = false): Promise<Product[]> {
  const client = getClient(preview)
  return client.fetch(featuredProductsQuery, {}, { next: { revalidate: 60 } }) || []
}

export async function getProductsByCategory(categoryId: string, preview = false): Promise<Product[]> {
  const client = getClient(preview)
  return client.fetch(productsByCategoryQuery, { categoryId }, { next: { revalidate: 60 } }) || []
}

export async function getProductSlugs(): Promise<string[]> {
  const client = getClient(false)
  return client.fetch(productSlugsQuery) || []
}

// Categories
export async function getAllCategories(preview = false): Promise<Category[]> {
  const client = getClient(preview)
  return client.fetch(allCategoriesQuery, {}, { next: { revalidate: 60 } }) || []
}

export async function getCategoryBySlug(slug: string, preview = false): Promise<Category | null> {
  const client = getClient(preview)
  return client.fetch(categoryBySlugQuery, { slug }, { next: { revalidate: 60 } })
}

// Dealers
export async function getAllDealers(preview = false): Promise<Dealer[]> {
  const client = getClient(preview)
  return client.fetch(allDealersQuery, {}, { next: { revalidate: 60 } }) || []
}

export async function getDealersByCity(city: string, preview = false): Promise<Dealer[]> {
  const client = getClient(preview)
  return client.fetch(dealersByCityQuery, { city }, { next: { revalidate: 60 } }) || []
}

// Testimonials
export async function getAllTestimonials(preview = false): Promise<Testimonial[]> {
  const client = getClient(preview)
  return client.fetch(allTestimonialsQuery, {}, { next: { revalidate: 60 } }) || []
}

export async function getFeaturedTestimonials(preview = false): Promise<Testimonial[]> {
  const client = getClient(preview)
  return client.fetch(featuredTestimonialsQuery, {}, { next: { revalidate: 60 } }) || []
}

// FAQs
export async function getAllFaqs(preview = false): Promise<FAQ[]> {
  const client = getClient(preview)
  return client.fetch(allFaqsQuery, {}, { next: { revalidate: 60 } }) || []
}

export async function getFaqsByCategory(category: string, preview = false): Promise<FAQ[]> {
  const client = getClient(preview)
  return client.fetch(faqsByCategoryQuery, { category }, { next: { revalidate: 60 } }) || []
}
