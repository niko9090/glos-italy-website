// Single Product Page - Modern Design with Gallery Lightbox
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getProductBySlug, getProductSlugs, getSiteSettings, getAllProducts } from '@/lib/sanity/fetch'
import { generateProductMetadata, SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { ProductSchema, BreadcrumbSchema, OrganizationSchema } from '@/components/seo/JsonLd'
import { getTextValue } from '@/lib/utils/textHelpers'
import ProductPageClient from './ProductPageClient'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Prodotto non trovato',
      robots: { index: false, follow: false },
    }
  }

  const baseMetadata = generateProductMetadata(product)

  return {
    ...baseMetadata,
    alternates: {
      canonical: `${SITE_URL}/prodotti/${slug}`,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const [product, settings, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
    getAllProducts(),
  ])

  if (!product) {
    notFound()
  }

  // Get related products (either from product data or fallback to same category)
  let relatedProducts = product.relatedProducts || []

  // If no related products defined, get products from same category
  if (relatedProducts.length === 0 && product.category) {
    relatedProducts = allProducts
      .filter(p => p._id !== product._id && p.category?._id === product.category?._id)
      .slice(0, 4)
  }

  // If still no related, get any other products
  if (relatedProducts.length === 0) {
    relatedProducts = allProducts
      .filter(p => p._id !== product._id)
      .slice(0, 4)
  }

  // Safe values
  const productName = getTextValue(product.name)
  const categoryName = getTextValue(product.category?.name)

  // Breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Prodotti', url: '/prodotti' },
    ...(categoryName ? [{ name: categoryName, url: `/prodotti?category=${product.category?._id}` }] : []),
    { name: productName, url: `/prodotti/${slug}` },
  ]

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema data={settings || {}} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ProductSchema
        data={{
          name: product.name,
          description: product.shortDescription,
          image: product.mainImage,
          category: product.category,
          price: product.price,
          brand: SITE_NAME,
        }}
        url={`/prodotti/${slug}`}
      />

      <ProductPageClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  )
}
