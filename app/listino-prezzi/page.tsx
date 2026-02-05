// Listino Prezzi - Catalogo completo prodotti GLOS con prezzi
import type { Metadata } from 'next'
import { getSiteSettings, getAllProducts } from '@/lib/sanity/fetch'
import { safeImageUrl } from '@/lib/sanity/client'
import { SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { OrganizationSchema, BreadcrumbSchema, WebPageSchema } from '@/components/seo/JsonLd'
import ListinoPrezziClient from './ListinoPrezziClient'

export const metadata: Metadata = {
  title: `Listino Prezzi | Catalogo Prodotti ${SITE_NAME}`,
  description:
    'Listino prezzi completo GLOS Italy: taglierine professionali Policut, miscelatore Blender GLOS, Termolight, accessori e ricambi. Prezzi IVA esclusa. Made in Italy.',
  alternates: {
    canonical: `${SITE_URL}/listino-prezzi`,
  },
  openGraph: {
    title: `Listino Prezzi | ${SITE_NAME}`,
    description:
      'Catalogo completo con prezzi di tutte le attrezzature professionali GLOS: taglierine Policut, miscelatori Blender, Termolight e accessori.',
    url: `${SITE_URL}/listino-prezzi`,
    siteName: SITE_NAME,
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Listino Prezzi | ${SITE_NAME}`,
    description:
      'Catalogo completo con prezzi di tutte le attrezzature professionali GLOS.',
  },
}

// Map Sanity product names to listino category IDs
function buildCategoryImages(products: Awaited<ReturnType<typeof getAllProducts>>): Record<string, string> {
  const map: Record<string, string> = {}

  for (const product of products) {
    const name = (typeof product.name === 'string' ? product.name : '').toLowerCase()
    const url = safeImageUrl(product.mainImage, 600)
    if (!url) continue

    if (name.includes('twin') && !name.includes('basic') && !map.twin) {
      map.twin = url
    } else if (name.includes('easy') && name.includes('basic') && !map.basic) {
      map.basic = url
    } else if (name.includes('easy') && !name.includes('basic') && !name.includes('light') && !map.easy) {
      map.easy = url
    } else if (name.includes('easy') && name.includes('light') && !map.easy) {
      // fallback for easy if no exact match
      if (!map.easy) map.easy = url
    } else if (name.includes('termolight') && !map.termolight) {
      map.termolight = url
    } else if (name.includes('blender') && !map.blender) {
      map.blender = url
    } else if (name.includes('wash') && !map.washstation) {
      map.washstation = url
    }
  }

  return map
}

export default async function ListinoPrezziPage() {
  const [settings, products] = await Promise.all([
    getSiteSettings(),
    getAllProducts(),
  ])

  const categoryImages = buildCategoryImages(products)

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Listino Prezzi', url: '/listino-prezzi' },
  ]

  return (
    <>
      <OrganizationSchema data={settings || {}} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <WebPageSchema
        title="Listino Prezzi - Catalogo Prodotti GLOS"
        description="Listino prezzi completo di tutte le attrezzature professionali GLOS Italy."
        url={`${SITE_URL}/listino-prezzi`}
      />
      <ListinoPrezziClient categoryImages={categoryImages} />
    </>
  )
}
