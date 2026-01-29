// Dynamic Page
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPageBySlug, getPageSlugs, getFeaturedProducts, getAllTestimonials } from '@/lib/sanity/fetch'
import { SectionRenderer } from '@/components/sections/SectionRenderer'

export const revalidate = 60

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getPageSlugs()
  return slugs
    .filter((slug) => slug !== 'home')
    .map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    return { title: 'Pagina non trovata' }
  }

  return {
    title: page.title || 'GLOS Italy',
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    notFound()
  }

  // Fetch additional data for sections that need it
  const [products, testimonials] = await Promise.all([
    getFeaturedProducts(),
    getAllTestimonials(),
  ])

  return (
    <>
      {page.sections?.map((section, index) => (
        <SectionRenderer
          key={section._key || index}
          section={section}
          products={products}
          testimonials={testimonials}
        />
      ))}
    </>
  )
}
