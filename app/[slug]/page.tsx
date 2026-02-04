// Dynamic Page - v3.0.0
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPageBySlug, getPageSlugs, getFeaturedProducts, getSiteSettings } from '@/lib/sanity/fetch'
import { SectionsWithDividers } from '@/components/sections/SectionsWithDividers'
import { generatePageMetadata, SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { getTextValue } from '@/lib/utils/textHelpers'
import { OrganizationSchema, BreadcrumbSchema, WebPageSchema } from '@/components/seo/JsonLd'

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
  const { slug } = await params

  const [page, products, settings] = await Promise.all([
    getPageBySlug(slug),
    getFeaturedProducts(),
    getSiteSettings(),
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
