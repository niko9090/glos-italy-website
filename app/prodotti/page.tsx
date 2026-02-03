// Products List Page - Modernized with Metallic Design
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getAllProducts, getAllCategories, getSiteSettings } from '@/lib/sanity/fetch'
import { SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { OrganizationSchema, BreadcrumbSchema, WebPageSchema } from '@/components/seo/JsonLd'
import ProductsPageClient from './ProductsPageClient'

export const metadata: Metadata = {
  title: 'Prodotti | Macchinari Professionali Made in Italy',
  description: 'Scopri tutti i prodotti GLOS Italy - Blender per vernici, taglierine Policut e macchinari di precisione Made in Italy per colorifici e industria.',
  alternates: {
    canonical: `${SITE_URL}/prodotti`,
  },
  openGraph: {
    title: 'Prodotti | GLOS Italy',
    description: 'Scopri tutti i prodotti GLOS Italy - macchinari di precisione per vernici, blender e taglierine Made in Italy.',
    url: `${SITE_URL}/prodotti`,
    siteName: SITE_NAME,
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prodotti | GLOS Italy',
    description: 'Scopri tutti i prodotti GLOS Italy - macchinari di precisione per vernici, blender e taglierine Made in Italy.',
  },
}

// Force dynamic rendering to support draft mode
export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const { isEnabled: isDraftMode } = await draftMode()

  const [products, categories, settings] = await Promise.all([
    getAllProducts(isDraftMode),
    getAllCategories(isDraftMode),
    getSiteSettings(isDraftMode),
  ])

  // Breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Prodotti', url: '/prodotti' },
  ]

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema data={settings || {}} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <WebPageSchema
        title="Prodotti"
        description="Scopri tutti i prodotti GLOS Italy - macchinari di precisione per vernici, blender e taglierine Made in Italy."
        url="/prodotti"
      />

      <ProductsPageClient products={products} categories={categories} />
    </>
  )
}
