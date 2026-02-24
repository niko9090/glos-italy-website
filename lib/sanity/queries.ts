// GROQ Queries per Sanity - v3.0.0 con defineQuery
import { defineQuery } from 'next-sanity'

// ============================================
// IMPOSTAZIONI SITO
// ============================================

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    companyName,
    legalName,
    slogan,
    logo,
    logoWhite,
    email,
    salesEmail,
    technicalEmail,
    phone,
    address,
    website,
    // Legal
    vatNumber,
    fiscalCode,
    pec,
    rea,
    capitaleSociale,
    sdi,
    // Social
    facebook,
    instagram,
    linkedin,
    youtube,
    twitter,
    tiktok,
    whatsapp,
    whatsappMessage,
    tawkPropertyId,
    tawkWidgetId,
    // Header settings
    headerLogoSize,
    headerHeight,
    headerStyle,
    headerCtaText,
    headerCtaLink,
    headerShowLanguageSelector,
    headerNavGap,
    // Footer settings
    footerLogoSize,
    footerStyle,
    footerColumns,
    footerShowSocial,
    footerShowQuickLinks,
    footerShowProducts,
    footerShowContacts,
    footerPadding,
    footerColumnsGap,
    footerCopyrightText,
    footerBottomLinks,
    // Download files
    "listinoPrezziPdfUrl": listinoPrezziPdf.asset->url,
    "catalogoPdfUrl": catalogoPdf.asset->url
  }
`)

// ============================================
// NAVIGAZIONE
// ============================================

export const navigationQuery = defineQuery(`
  *[_type == "navigation"][0] {
    "items": items[isActive != false] {
      _key,
      label,
      href
    }
  }
`)

// ============================================
// PAGINE
// ============================================

// NOTA: La condizione isPublished != false viene gestita dalla perspective del client
// In draft mode (perspective: 'previewDrafts') verranno mostrate anche le bozze
export const pageBySlugQuery = defineQuery(`
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
`)

export const allPagesQuery = defineQuery(`
  *[_type == "page" && isPublished != false] | order(title asc) {
    _id,
    title,
    slug
  }
`)

export const pageSlugsQuery = defineQuery(`
  *[_type == "page" && defined(slug.current) && isPublished != false].slug.current
`)

// ============================================
// PRODOTTI
// ============================================

export const allProductsQuery = defineQuery(`
  *[_type == "product" && isActive == true] | order(sortOrder asc) {
    _id,
    name,
    slug,
    shortDescription,
    mainImage,
    category->{
      _id,
      name,
      slug,
      parentCategory->{
        _id,
        name,
        slug
      }
    },
    price,
    isNew,
    isFeatured
  }
`)

export const productBySlugQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    shortDescription,
    fullDescription,
    mainImage,
    gallery[] {
      _key,
      asset,
      alt,
      caption,
      hotspot,
      crop
    },
    category->{
      _id,
      name,
      slug,
      parentCategory->{
        _id,
        name,
        slug
      }
    },
    specifications[] {
      _key,
      label,
      value
    },
    features[] {
      _key,
      icon,
      title,
      description
    },
    documents[] {
      _key,
      title,
      file {
        asset
      },
      fileType
    },
    price,
    isNew,
    isFeatured,
    relatedProducts[]->{
      _id,
      name,
      slug,
      mainImage,
      shortDescription,
      category->{
        name,
        parentCategory->{
          name
        }
      }
    },
    seo
  }
`)

export const featuredProductsQuery = defineQuery(`
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
`)

export const productsByCategoryQuery = defineQuery(`
  *[_type == "product" && isActive == true && category._ref == $categoryId] | order(sortOrder asc) {
    _id,
    name,
    slug,
    shortDescription,
    mainImage,
    price,
    isNew
  }
`)

export const productSlugsQuery = defineQuery(`
  *[_type == "product" && defined(slug.current)].slug.current
`)

// ============================================
// CATEGORIE
// ============================================

export const allCategoriesQuery = defineQuery(`
  *[_type == "productCategory" && isActive == true] | order(sortOrder asc, name asc) {
    _id,
    name,
    slug,
    description,
    image,
    parentCategory->{
      _id,
      name,
      slug
    },
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`)

// Categorie principali con sottocategorie annidate
export const categoriesWithSubcategoriesQuery = defineQuery(`
  *[_type == "productCategory" && isActive == true && !defined(parentCategory)] | order(sortOrder asc, name asc) {
    _id,
    name,
    slug,
    description,
    image,
    "productCount": count(*[_type == "product" && references(^._id)]),
    "subcategories": *[_type == "productCategory" && isActive == true && parentCategory._ref == ^._id] | order(sortOrder asc, name asc) {
      _id,
      name,
      slug,
      description,
      image,
      "productCount": count(*[_type == "product" && references(^._id)])
    }
  }
`)

// Solo categorie principali (senza parentCategory)
export const mainCategoriesQuery = defineQuery(`
  *[_type == "productCategory" && isActive == true && !defined(parentCategory)] | order(sortOrder asc, name asc) {
    _id,
    name,
    slug,
    description,
    image,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`)

// Sottocategorie di una specifica categoria
export const subcategoriesByCategoryQuery = defineQuery(`
  *[_type == "productCategory" && isActive == true && parentCategory._ref == $categoryId] | order(sortOrder asc, name asc) {
    _id,
    name,
    slug,
    description,
    image,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`)

export const categoryBySlugQuery = defineQuery(`
  *[_type == "productCategory" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    image,
    parentCategory->{
      _id,
      name,
      slug
    },
    "subcategories": *[_type == "productCategory" && isActive == true && parentCategory._ref == ^._id] | order(sortOrder asc, name asc) {
      _id,
      name,
      slug,
      description,
      image,
      "productCount": count(*[_type == "product" && references(^._id)])
    },
    seo
  }
`)

// ============================================
// RIVENDITORI
// ============================================

export const allDealersQuery = defineQuery(`
  *[_type == "dealer" && isActive != false] | order(isFeatured desc, name asc) {
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
`)

export const dealersByCityQuery = defineQuery(`
  *[_type == "dealer" && isActive != false && city == $city] | order(isFeatured desc, name asc) {
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
`)

// ============================================
// TESTIMONIANZE
// ============================================

export const allTestimonialsQuery = defineQuery(`
  *[_type == "testimonial" && isActive == true] | order(_createdAt desc) {
    _id,
    author,
    company,
    role,
    avatar,
    quote,
    rating
  }
`)

export const featuredTestimonialsQuery = defineQuery(`
  *[_type == "testimonial" && isActive == true] | order(_createdAt desc)[0...3] {
    _id,
    author,
    company,
    role,
    avatar,
    quote,
    rating
  }
`)

// ============================================
// FAQ
// ============================================

export const allFaqsQuery = defineQuery(`
  *[_type == "faq" && isActive == true] | order(sortOrder asc) {
    _id,
    question,
    answer,
    category
  }
`)

export const faqsByCategoryQuery = defineQuery(`
  *[_type == "faq" && isActive == true && category == $category] | order(sortOrder asc) {
    _id,
    question,
    answer
  }
`)

// ============================================
// SETTORI (SECTORS)
// ============================================

export const allSectorsQuery = defineQuery(`
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
`)

export const sectorBySlugQuery = defineQuery(`
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
`)

export const sectorSlugsQuery = defineQuery(`
  *[_type == "sector" && defined(slug.current)].slug.current
`)

export const productsBySectorQuery = defineQuery(`
  *[_type == "product" && isActive == true && references($sectorId)] | order(sortOrder asc) {
    _id,
    name,
    slug,
    shortDescription,
    mainImage,
    isNew,
    isFeatured
  }
`)

// ============================================
// CASE STUDIES
// ============================================

export const allCaseStudiesQuery = defineQuery(`
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
`)

export const caseStudyBySlugQuery = defineQuery(`
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
`)

export const caseStudySlugsQuery = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)].slug.current
`)

export const featuredCaseStudiesQuery = defineQuery(`
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
`)
