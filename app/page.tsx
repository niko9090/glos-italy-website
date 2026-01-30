// Homepage
import { draftMode } from 'next/headers'
import { getPageBySlug, getFeaturedProducts, getFeaturedTestimonials } from '@/lib/sanity/fetch'
import { SectionRenderer } from '@/components/sections/SectionRenderer'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  // CORRETTO: draftMode() e' async in Next.js 14.x App Router
  const { isEnabled: isDraftMode } = await draftMode()

  const [page, products, testimonials] = await Promise.all([
    getPageBySlug('home', isDraftMode),
    getFeaturedProducts(isDraftMode),
    getFeaturedTestimonials(isDraftMode),
  ])

  if (!page) {
    return (
      <div className="container-glos py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Benvenuti in GLOS Italy</h1>
        <p className="text-gray-600">
          Il contenuto della homepage verra caricato dal CMS Sanity.
        </p>
      </div>
    )
  }

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
