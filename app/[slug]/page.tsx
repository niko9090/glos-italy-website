// Dynamic Page
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPageBySlug, getPageSlugs, getFeaturedProducts, getAllTestimonials } from '@/lib/sanity/fetch'
import { SectionRenderer } from '@/components/sections/SectionRenderer'

// Helper per estrarre testo da campi multilingua
function getTextValue(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if ('it' in obj) return String(obj.it || obj.en || obj.es || '')
  }
  return ''
}

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
    title: getTextValue(page.title) || 'GLOS Italy',
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const isDraftMode = draftMode().isEnabled
  const page = await getPageBySlug(params.slug, isDraftMode)

  if (!page) {
    notFound()
  }

  // Fetch additional data for sections that need it
  const [products, testimonials] = await Promise.all([
    getFeaturedProducts(isDraftMode),
    getAllTestimonials(isDraftMode),
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
