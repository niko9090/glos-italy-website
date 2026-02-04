// Single Sector Page
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSectorBySlug, getSectorSlugs, getSiteSettings, getProductsBySector } from '@/lib/sanity/fetch'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { ArrowLeft, ArrowRight, Package } from 'lucide-react'
import RichText from '@/components/RichText'
import { getTextValue } from '@/lib/utils/textHelpers'
import { SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { BreadcrumbSchema, OrganizationSchema, WebPageSchema } from '@/components/seo/JsonLd'

interface SectorPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getSectorSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const { slug } = await params
  const sector = await getSectorBySlug(slug)

  if (!sector) {
    return {
      title: 'Settore non trovato',
      robots: { index: false, follow: false },
    }
  }

  const sectorName = getTextValue(sector.name)
  const sectorDescription = getTextValue(sector.description) || `Scopri le soluzioni GLOS Italy per il settore ${sectorName}`

  return {
    title: sectorName,
    description: sectorDescription,
    alternates: {
      canonical: `${SITE_URL}/settori/${slug}`,
    },
    openGraph: {
      title: `${sectorName} | GLOS Italy`,
      description: sectorDescription,
      url: `${SITE_URL}/settori/${slug}`,
      siteName: SITE_NAME,
      locale: 'it_IT',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${sectorName} | GLOS Italy`,
      description: sectorDescription,
    },
  }
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { slug } = await params

  const [sector, settings] = await Promise.all([
    getSectorBySlug(slug),
    getSiteSettings(),
  ])

  if (!sector) {
    notFound()
  }

  // Fetch related products for this sector
  const relatedProducts = await getProductsBySector(sector._id)

  // Extract safe values
  const sectorName = getTextValue(sector.name)
  const sectorDescription = getTextValue(sector.description)
  const heroImageUrl = isValidImage(sector.image) ? safeImageUrl(sector.image, 1920, 800) : null

  // Breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Settori', url: '/settori' },
    { name: sectorName, url: `/settori/${slug}` },
  ]

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema data={settings || {}} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <WebPageSchema
        title={sectorName}
        description={sectorDescription || `Soluzioni GLOS Italy per ${sectorName}`}
        url={`/settori/${slug}`}
      />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center">
        {/* Background Image */}
        {heroImageUrl ? (
          <div className="absolute inset-0">
            <Image
              src={heroImageUrl}
              alt={sectorName || 'Settore'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-blue-900" />
        )}

        {/* Content */}
        <div className="container-glos relative z-10 py-16 md:py-24">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/settori"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tutti i Settori
            </Link>
          </nav>

          <div className="max-w-3xl">
            {/* Icon */}
            {sector.icon && (
              <span className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl text-4xl mb-6">
                {sector.icon}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {sectorName}
            </h1>

            {/* Description */}
            {sectorDescription && (
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                {sectorDescription}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="#prodotti"
                className="btn-primary"
              >
                Vedi i Prodotti
              </Link>
              <Link
                href="/contatti"
                className="btn bg-white/20 text-white border border-white/30 hover:bg-white hover:text-primary"
              >
                Richiedi Informazioni
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Full Description Section */}
      {sector.fullDescription && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container-glos">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Soluzioni per {sectorName}
              </h2>
              <div className="prose prose-lg max-w-none">
                <RichText value={sector.fullDescription} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Key Points / Features */}
      {sector.keyPoints && sector.keyPoints.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container-glos">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Vantaggi per il Tuo Settore
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sector.keyPoints.map((point: any, index: number) => (
                <div
                  key={point._key || index}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow"
                >
                  {point.icon && (
                    <span className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-2xl mb-4">
                      {point.icon}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold mb-2">
                    {getTextValue(point.title)}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {getTextValue(point.description)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      <section id="prodotti" className="py-16 md:py-24 bg-white scroll-mt-20">
        <div className="container-glos">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Prodotti per {sectorName}
              </h2>
              <p className="text-gray-600 mt-2">
                {relatedProducts.length} {relatedProducts.length === 1 ? 'prodotto disponibile' : 'prodotti disponibili'}
              </p>
            </div>
            <Link
              href="/prodotti"
              className="hidden md:inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Tutti i Prodotti
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((product) => {
                const productImageUrl = isValidImage(product.mainImage)
                  ? safeImageUrl(product.mainImage, 600, 450)
                  : null
                const productName = getTextValue(product.name)
                const productDescription = getTextValue(product.shortDescription)

                return (
                  <article
                    key={product._id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <Link href={`/prodotti/${product.slug?.current}`} className="block">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        {productImageUrl ? (
                          <Image
                            src={productImageUrl}
                            alt={productName || 'Prodotto'}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-300" />
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          {product.isNew && (
                            <span className="px-3 py-1 bg-accent text-white text-sm font-medium rounded-full">
                              Nuovo
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="px-3 py-1 bg-secondary text-gray-900 text-sm font-medium rounded-full">
                              In Evidenza
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {productName}
                        </h3>
                        {productDescription && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {productDescription}
                          </p>
                        )}
                        <div className="mt-4 flex items-center gap-2 text-primary font-medium text-sm">
                          <span>Scopri di piu</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Nessun prodotto specifico per questo settore al momento.
              </p>
              <Link
                href="/prodotti"
                className="inline-flex items-center gap-2 text-primary font-medium mt-4 hover:underline"
              >
                Esplora tutti i prodotti
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Mobile CTA */}
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/prodotti"
              className="btn-secondary inline-flex items-center gap-2"
            >
              Tutti i Prodotti
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container-glos text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Hai bisogno di una soluzione personalizzata?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Il nostro team di esperti e pronto ad aiutarti a trovare la soluzione
            perfetta per le esigenze del tuo settore.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contatti"
              className="btn bg-white text-primary hover:bg-gray-100"
            >
              Contattaci
            </Link>
            <Link
              href="/rivenditori"
              className="btn bg-white/20 text-white border border-white/30 hover:bg-white hover:text-primary"
            >
              Trova Rivenditore
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
