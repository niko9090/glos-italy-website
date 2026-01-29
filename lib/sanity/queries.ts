// GROQ Queries per Sanity
import { groq } from 'next-sanity'

// ============================================
// IMPOSTAZIONI SITO
// ============================================

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    companyName,
    slogan,
    logo,
    email,
    phone,
    address,
    facebook,
    instagram,
    linkedin
  }
`

// ============================================
// NAVIGAZIONE
// ============================================

export const navigationQuery = groq`
  *[_type == "navigation"][0] {
    "items": items[] {
      _key,
      label,
      href
    }
  }
`

// ============================================
// PAGINE
// ============================================

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    seo,
    sections[] {
      _type,
      _key,
      ...
    }
  }
`

export const allPagesQuery = groq`
  *[_type == "page"] | order(title asc) {
    _id,
    title,
    slug
  }
`

export const pageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current)].slug.current
`

// ============================================
// PRODOTTI
// ============================================

export const allProductsQuery = groq`
  *[_type == "product" && isActive == true] | order(sortOrder asc) {
    _id,
    name,
    slug,
    shortDescription,
    mainImage,
    category->{
      _id,
      name,
      slug
    },
    price,
    isNew,
    isFeatured
  }
`

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    shortDescription,
    fullDescription,
    mainImage,
    gallery,
    category->{
      _id,
      name,
      slug
    },
    specifications,
    documents,
    price,
    isNew,
    isFeatured,
    relatedProducts[]->{
      _id,
      name,
      slug,
      mainImage,
      shortDescription
    },
    seo
  }
`

export const featuredProductsQuery = groq`
  *[_type == "product" && isActive == true && isFeatured == true] | order(sortOrder asc)[0...6] {
    _id,
    name,
    slug,
    shortDescription,
    mainImage,
    category->{
      name
    },
    isNew
  }
`

export const productsByCategoryQuery = groq`
  *[_type == "product" && isActive == true && category._ref == $categoryId] | order(sortOrder asc) {
    _id,
    name,
    slug,
    shortDescription,
    mainImage,
    price,
    isNew
  }
`

export const productSlugsQuery = groq`
  *[_type == "product" && defined(slug.current)].slug.current
`

// ============================================
// CATEGORIE
// ============================================

export const allCategoriesQuery = groq`
  *[_type == "productCategory" && isActive == true] | order(name asc) {
    _id,
    name,
    slug,
    description,
    image,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "productCategory" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    image,
    seo
  }
`

// ============================================
// RIVENDITORI
// ============================================

export const allDealersQuery = groq`
  *[_type == "dealer" && isActive == true] | order(name asc) {
    _id,
    name,
    type,
    logo,
    email,
    phone,
    city,
    address,
    location,
    regions,
    certifications,
    isActive
  }
`

export const dealersByCityQuery = groq`
  *[_type == "dealer" && isActive == true && city == $city] | order(name asc) {
    _id,
    name,
    type,
    logo,
    email,
    phone,
    city,
    address,
    location,
    regions,
    certifications
  }
`

// ============================================
// TESTIMONIANZE
// ============================================

export const allTestimonialsQuery = groq`
  *[_type == "testimonial" && isActive == true] | order(_createdAt desc) {
    _id,
    author,
    company,
    role,
    avatar,
    quote,
    rating
  }
`

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && isActive == true] | order(_createdAt desc)[0...3] {
    _id,
    author,
    company,
    role,
    avatar,
    quote,
    rating
  }
`

// ============================================
// FAQ
// ============================================

export const allFaqsQuery = groq`
  *[_type == "faq" && isActive == true] | order(sortOrder asc) {
    _id,
    question,
    answer,
    category
  }
`

export const faqsByCategoryQuery = groq`
  *[_type == "faq" && isActive == true && category == $category] | order(sortOrder asc) {
    _id,
    question,
    answer
  }
`
