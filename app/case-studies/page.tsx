// Case Studies List Page
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { getCaseStudies, getSectors, getSiteSettings } from '@/lib/sanity/fetch'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { getTextValue } from '@/lib/utils/textHelpers'
import { ArrowRight, Building2, TrendingUp } from 'lucide-react'
import { SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { OrganizationSchema, BreadcrumbSchema, WebPageSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Scopri i nostri progetti di successo e come GLOS Italy ha aiutato le aziende a raggiungere i loro obiettivi.',
  alternates: {
    canonical: `${SITE_URL}/case-studies`,
  },
  openGraph: {
    title: 'Case Studies | GLOS Italy',
    description: 'Scopri i nostri progetti di successo e come GLOS Italy ha aiutato le aziende a raggiungere i loro obiettivi.',
    url: `${SITE_URL}/case-studies`,
    siteName: SITE_NAME,
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies | GLOS Italy',
    description: 'Scopri i nostri progetti di successo.',
  },
}

// Force dynamic rendering to support draft mode
export const dynamic = 'force-dynamic'

export default async function CaseStudiesPage() {
  const { isEnabled: isDraftMode } = await draftMode()

  const [caseStudies, sectors, settings] = await Promise.all([
    getCaseStudies(isDraftMode),
    getSectors(isDraftMode),
    getSiteSettings(isDraftMode),
  ])

  // Breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Case Studies', url: '/case-studies' },
  ]

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema data={settings || {}} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <WebPageSchema
        title="Case Studies"
        description="Scopri i nostri progetti di successo e come GLOS Italy ha aiutato le aziende a raggiungere i loro obiettivi."
        url="/case-studies"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark text-white py-16 md:py-24">
        <div className="container-glos">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-primary-light">
              Storie di Successo
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Case Studies
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Scopri come abbiamo aiutato i nostri clienti a raggiungere risultati
              straordinari con le nostre soluzioni innovative.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      {sectors.length > 0 && (
        <section className="py-8 bg-white border-b">
          <div className="container-glos">
            <nav className="flex flex-wrap justify-center gap-3" aria-label="Filtra per settore">
              <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium transition-colors">
                Tutti
              </button>
              {sectors.map((sector) => (
                <button
                  key={sector._id}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {getTextValue(sector.name)}
                </button>
              ))}
            </nav>
          </div>
        </section>
      )}

      {/* Case Studies Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-glos">
          {caseStudies.length > 0 ? (
            <div className="space-y-8">
              {caseStudies.map((caseStudy, index) => {
                // Use first gallery image as main image
                const heroImage = caseStudy.gallery?.[0]
                const imageUrl = isValidImage(heroImage) ? safeImageUrl(heroImage, 800, 500) : null
                const title = getTextValue(caseStudy.title)
                const client = caseStudy.client || ''
                const sector = getTextValue(caseStudy.sector?.name)
                const excerpt = getTextValue(caseStudy.challenge)
                const slug = caseStudy.slug?.current
                const stats = caseStudy.stats || []
                const isFeatured = caseStudy.featured && index === 0

                // Featured layout for first featured item
                if (isFeatured) {
                  return (
                    <article
                      key={caseStudy._id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                      <Link href={`/case-studies/${slug}`} className="block">
                        <div className="grid lg:grid-cols-2">
                          {/* Image */}
                          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={title || 'Case Study'}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                priority
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark" />
                            )}
                            {/* Featured Badge */}
                            <div className="absolute top-4 left-4">
                              <span className="px-4 py-1 bg-secondary text-gray-900 text-sm font-semibold rounded-full">
                                In Evidenza
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-8 lg:p-12 flex flex-col justify-center">
                            {/* Sector Badge */}
                            {sector && (
                              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-4 w-fit">
                                {sector}
                              </span>
                            )}

                            {/* Title */}
                            <h2 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                              {title}
                            </h2>

                            {/* Client */}
                            {client && (
                              <div className="flex items-center gap-2 text-gray-600 mb-4">
                                <Building2 className="w-4 h-4" />
                                <span className="font-medium">{client}</span>
                              </div>
                            )}

                            {/* Excerpt */}
                            {excerpt && (
                              <p className="text-gray-600 mb-6 line-clamp-3">
                                {excerpt}
                              </p>
                            )}

                            {/* Stats */}
                            {stats.length > 0 && (
                              <div className="flex flex-wrap gap-8 py-6 border-t border-gray-100 mb-6">
                                {stats.slice(0, 3).map((stat: any, idx: number) => (
                                  <div key={stat._key || idx}>
                                    <div className="text-2xl lg:text-3xl font-bold text-primary">
                                      {stat.number}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {stat.label}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* CTA */}
                            <div className="flex items-center gap-2 text-primary font-semibold">
                              <span>Leggi il caso completo</span>
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  )
                }

                // Regular card layout
                return (
                  <article
                    key={caseStudy._id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <Link href={`/case-studies/${slug}`} className="block">
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto md:min-h-[280px] shrink-0">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={title || 'Case Study'}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <TrendingUp className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 lg:p-8">
                          {/* Header */}
                          <div className="mb-4">
                            {/* Sector Badge */}
                            {sector && (
                              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-2">
                                {sector}
                              </span>
                            )}
                            {/* Title */}
                            <h2 className="text-xl lg:text-2xl font-bold group-hover:text-primary transition-colors">
                              {title}
                            </h2>
                          </div>

                          {/* Client */}
                          {client && (
                            <div className="flex items-center gap-2 text-gray-600 mb-3">
                              <Building2 className="w-4 h-4" />
                              <span className="text-sm font-medium">{client}</span>
                            </div>
                          )}

                          {/* Excerpt */}
                          {excerpt && (
                            <p className="text-gray-600 text-sm lg:text-base line-clamp-2 mb-4">
                              {excerpt}
                            </p>
                          )}

                          {/* Stats */}
                          {stats.length > 0 && (
                            <div className="flex flex-wrap gap-6 py-4 border-t border-gray-100">
                              {stats.slice(0, 4).map((stat: any, idx: number) => (
                                <div key={stat._key || idx}>
                                  <div className="text-lg lg:text-xl font-bold text-primary">
                                    {stat.number}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {stat.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* CTA */}
                          <div className="mt-4 flex items-center gap-2 text-primary font-medium text-sm">
                            <span>Scopri il progetto</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Nessun case study disponibile
              </h2>
              <p className="text-gray-500 mb-6">
                I nostri case studies saranno presto disponibili.
              </p>
              <Link
                href="/contatti"
                className="btn-primary inline-flex items-center gap-2"
              >
                Contattaci per saperne di piu
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-glos text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Vuoi diventare il nostro prossimo case study?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Scopri come possiamo aiutare la tua azienda a raggiungere risultati
            straordinari con le nostre soluzioni.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contatti"
              className="btn-primary inline-flex items-center gap-2"
            >
              Inizia il Tuo Progetto
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/prodotti"
              className="btn-secondary"
            >
              Esplora i Prodotti
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
