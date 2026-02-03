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

// NOTA: La condizione isPublished != false viene gestita dalla perspective del client
// In draft mode (perspective: 'previewDrafts') verranno mostrate anche le bozze
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    description,
    isPublished,
    seo,
    sections[] {
      _type,
      _key,
      ...
    }
  }
`

export const allPagesQuery = groq`
  *[_type == "page" && isPublished != false] | order(title asc) {
    _id,
    title,
    slug
  }
`

export const pageSlugsQuery = groq`
  *[_type == "page" && defined(slug.current) && isPublished != false].slug.current
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
  *[_type == "dealer" && isActive == true] | order(isFeatured desc, name asc) {
    _id,
    name,
    type,
    description,
    logo,
    email,
    phone,
    website,
    openingHours,
    country,
    city,
    address,
    location,
    regions,
    certifications,
    youtubeVideo,
    gallery,
    isActive,
    isFeatured
  }
`

export const dealersByCityQuery = groq`
  *[_type == "dealer" && isActive == true && city == $city] | order(isFeatured desc, name asc) {
    _id,
    name,
    type,
    description,
    logo,
    email,
    phone,
    website,
    openingHours,
    country,
    city,
    address,
    location,
    regions,
    certifications,
    youtubeVideo,
    gallery,
    isFeatured
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

// ============================================
// SETTORI (SECTORS)
// ============================================

export const allSectorsQuery = groq`
  *[_type == "sector"] | order(order asc, name asc) {
    _id,
    name,
    slug,
    description,
    icon,
    image,
    color,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`

export const sectorBySlugQuery = groq`
  *[_type == "sector" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    fullDescription,
    icon,
    image,
    color,
    keyPoints,
    "products": *[_type == "product" && references(^._id)] {
      _id,
      name,
      slug,
      shortDescription,
      mainImage
    }
  }
`

export const sectorSlugsQuery = groq`
  *[_type == "sector" && defined(slug.current)].slug.current
`

export const productsBySectorQuery = groq`
  *[_type == "product" && isActive == true && references($sectorId)] | order(sortOrder asc) {
    _id,
    name,
    slug,
    shortDescription,
    mainImage,
    isNew,
    isFeatured
  }
`

// ============================================
// CASE STUDIES
// ============================================

export const allCaseStudiesQuery = groq`
  *[_type == "caseStudy"] | order(featured desc, publishedAt desc) {
    _id,
    title,
    slug,
    client,
    challenge,
    gallery,
    featured,
    publishedAt,
    sector->{
      _id,
      name,
      slug
    },
    stats[] {
      _key,
      number,
      label
    }
  }
`

export const caseStudyBySlugQuery = groq`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    client,
    gallery,
    featured,
    publishedAt,
    sector->{
      _id,
      name,
      slug
    },
    challenge,
    solution,
    results,
    stats[] {
      _key,
      number,
      label
    },
    testimonial,
    testimonialAuthor,
    products[]->{
      _id,
      name,
      slug,
      mainImage,
      shortDescription
    }
  }
`

export const caseStudySlugsQuery = groq`
  *[_type == "caseStudy" && defined(slug.current)].slug.current
`

export const featuredCaseStudiesQuery = groq`
  *[_type == "caseStudy" && featured == true] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    client,
    sector->{
      name
    },
    challenge,
    results,
    gallery
  }
`
