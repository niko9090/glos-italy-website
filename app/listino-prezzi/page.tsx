// Listino Prezzi - Catalogo completo prodotti GLOS con prezzi
import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/sanity/fetch'
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

export default async function ListinoPrezziPage() {
  const settings = await getSiteSettings()

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
      <ListinoPrezziClient />
    </>
  )
}
