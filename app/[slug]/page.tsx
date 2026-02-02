// Dynamic Page
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPageBySlug, getPageSlugs, getFeaturedProducts, getSiteSettings } from '@/lib/sanity/fetch'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import { generatePageMetadata, SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { getTextValue } from '@/lib/utils/textHelpers'
import { OrganizationSchema, BreadcrumbSchema, WebPageSchema } from '@/components/seo/JsonLd'

// Force dynamic rendering to support draft mode
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getPageSlugs()
  return slugs
    .filter((slug) => slug !== 'home')
    .map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    return {
      title: 'Pagina non trovata',
      robots: { index: false, follow: false },
    }
  }

  // Use enhanced metadata generation
  const baseMetadata = generatePageMetadata({
    title: page.title,
    seoTitle: page.seo?.metaTitle || getTextValue(page.title),
    seoDescription: page.seo?.metaDescription || getTextValue(page.description),
    description: page.description,
    slug: page.slug,
    ogImage: page.seo?.ogImage,
    noIndex: (page as any).noIndex,
  })

  // Add canonical URL
  return {
    ...baseMetadata,
    alternates: {
      canonical: `${SITE_URL}/${slug}`,
    },
  }
}

export default async function DynamicPage({ params }: PageProps) {
  // CORRETTO: draftMode() e' async in Next.js 14.x App Router
  const { isEnabled: isDraftMode } = await draftMode()
  const { slug } = await params

  const [page, products, settings] = await Promise.all([
    getPageBySlug(slug, isDraftMode),
    getFeaturedProducts(isDraftMode),
    getSiteSettings(isDraftMode),
  ])

  if (!page) {
    notFound()
  }

  // Prepare breadcrumb data
  const pageTitle = getTextValue(page.title) || slug
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: pageTitle, url: `/${slug}` },
  ]

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema data={settings || {}} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <WebPageSchema
        title={pageTitle}
        description={getTextValue(page.description)}
        url={`/${slug}`}
      />

      {/* Page Content */}
      {page.sections?.map((section, index) => (
        <SectionRenderer
          key={section._key || index}
          section={section}
          products={products}
        />
      ))}
    </>
  )
}
