// Homepage - v3.0.0
import { Metadata } from 'next'
import { getPageBySlug, getFeaturedProducts, getSiteSettings } from '@/lib/sanity/fetch'
import { SectionsWithDividers } from '@/components/sections/SectionsWithDividers'
import { generateSiteMetadata, SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { getTextValue } from '@/lib/utils/textHelpers'
import { OrganizationSchema, WebsiteSchema, WebPageSchema } from '@/components/seo/JsonLd'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const page = await getPageBySlug('home')

  // Use base site metadata as foundation
  const baseMetadata = generateSiteMetadata(settings)

  const title = page?.seo?.metaTitle || getTextValue(settings?.companyName) || SITE_NAME
  const description = page?.seo?.metaDescription ||
    getTextValue(settings?.slogan) ||
    'GLOS Italy - Macchinari di precisione per vernici Made in Italy'

  return {
    ...baseMetadata,
    title,
    description,
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url: SITE_URL,
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
    },
  }
}

export default async function HomePage() {
  const [page, products, settings] = await Promise.all([
    getPageBySlug('home'),
    getFeaturedProducts(),
    getSiteSettings(),
  ])

  // Prepare company info for structured data
  const companyName = getTextValue(settings?.companyName) || SITE_NAME
  const slogan = getTextValue(settings?.slogan) || 'Prodotti di qualita Made in Italy'

  if (!page) {
    return (
      <>
        {/* Structured Data even for fallback */}
        <OrganizationSchema data={settings || {}} />
        <WebsiteSchema name={companyName} description={slogan} />

        <div className="container-glos py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Benvenuti in GLOS Italy</h1>
          <p className="text-gray-600">
            Il contenuto della homepage verra caricato dal CMS Sanity.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema data={settings || {}} />
      <WebsiteSchema name={companyName} description={slogan} />
      <WebPageSchema
        title={companyName}
        description={slogan}
        url="/"
      />

      {/* Page Content with Dividers */}
      <SectionsWithDividers
        sections={page.sections || []}
        products={products}
        documentId={page._id}
        documentType={page._type || 'page'}
      />
    </>
  )
}
