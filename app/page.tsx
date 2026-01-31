// Homepage
import { draftMode } from 'next/headers'
import { getPageBySlug, getFeaturedProducts, getFeaturedTestimonials } from '@/lib/sanity/fetch'
import { SectionRenderer } from '@/components/sections/SectionRenderer'

// Force dynamic rendering to support draft mode
export const dynamic = 'force-dynamic'

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
      {/* DEBUG - RIMUOVERE */}
      {isDraftMode && (
        <div style={{
          background: '#fef3c7',
          padding: '20px',
          margin: '20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>
          <strong>DEBUG INFO:</strong><br/>
          Draft Mode: {isDraftMode ? 'YES' : 'NO'}<br/>
          Page ID: {page._id}<br/>
          Page Title: {JSON.stringify(page.title)}<br/>
          Sections Count: {page.sections?.length || 0}
        </div>
      )}
      {/* FINE DEBUG */}

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
