// Sectors List Page
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSectors, getSiteSettings } from '@/lib/sanity/fetch'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { getTextValue } from '@/lib/utils/textHelpers'
import { ArrowRight } from 'lucide-react'
import { SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { OrganizationSchema, BreadcrumbSchema, WebPageSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'I Nostri Settori',
  description: 'Scopri i settori industriali serviti da GLOS Italy: automotive, industria, edilizia e molto altro. Soluzioni su misura per ogni esigenza.',
  alternates: {
    canonical: `${SITE_URL}/settori`,
  },
  openGraph: {
    title: 'I Nostri Settori | GLOS Italy',
    description: 'Scopri i settori industriali serviti da GLOS Italy: automotive, industria, edilizia e molto altro.',
    url: `${SITE_URL}/settori`,
    siteName: SITE_NAME,
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'I Nostri Settori | GLOS Italy',
    description: 'Scopri i settori industriali serviti da GLOS Italy.',
  },
}

export default async function SectorsPage() {
  const [sectors, settings] = await Promise.all([
    getSectors(),
    getSiteSettings(),
  ])

  // Breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Settori', url: '/settori' },
  ]

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema data={settings || {}} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <WebPageSchema
        title="I Nostri Settori"
        description="Scopri i settori industriali serviti da GLOS Italy: automotive, industria, edilizia e molto altro."
        url="/settori"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-dark to-blue-900 text-white py-16 md:py-24">
        <div className="container-glos">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-white/80">
              Settori di Applicazione
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              I Nostri Settori
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Soluzioni personalizzate per ogni industria. Scopri come GLOS Italy
              risponde alle esigenze specifiche del tuo settore.
            </p>
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-glos">
          {sectors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sectors.map((sector, index) => {
                const imageUrl = isValidImage(sector.image) ? safeImageUrl(sector.image, 600, 400) : null
                const name = getTextValue(sector.name)
                const description = getTextValue(sector.description)
                const slug = sector.slug?.current

                return (
                  <article
                    key={sector._id}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <Link href={`/settori/${slug}`} className="block">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={name || 'Settore'}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Icon Overlay */}
                        {sector.icon && (
                          <div className="absolute top-4 left-4">
                            <span className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl text-2xl">
                              {sector.icon}
                            </span>
                          </div>
                        )}

                        {/* Product Count Badge */}
                        {sector.productCount && sector.productCount > 0 && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                              {sector.productCount} {sector.productCount === 1 ? 'prodotto' : 'prodotti'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h2 className="text-xl lg:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {name}
                        </h2>

                        {description && (
                          <p className="text-gray-600 line-clamp-2 mb-4">
                            {description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-primary font-medium">
                          <span>Scopri di più</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nessun settore disponibile al momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-glos text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Non trovi il tuo settore?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Contattaci per scoprire come possiamo aiutarti con soluzioni personalizzate
            per le tue esigenze specifiche.
          </p>
          <Link
            href="/contatti"
            className="btn-primary inline-flex items-center gap-2"
          >
            Contattaci
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
