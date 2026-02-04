// Single Case Study Page
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getCaseStudyBySlug, getCaseStudySlugs, getSiteSettings } from '@/lib/sanity/fetch'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { ArrowLeft, ArrowRight, Building2, Quote, Package, Target, Lightbulb, TrendingUp } from 'lucide-react'
import RichText from '@/components/RichText'
import { getTextValue } from '@/lib/utils/textHelpers'
import { SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { BreadcrumbSchema, OrganizationSchema, WebPageSchema } from '@/components/seo/JsonLd'

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug)

  if (!caseStudy) {
    return {
      title: 'Case Study non trovato',
      robots: { index: false, follow: false },
    }
  }

  const title = getTextValue(caseStudy.title)
  const client = caseStudy.client || ''
  const description = getTextValue(caseStudy.challenge) || `Case study ${title} - ${client}`

  return {
    title: `${title} | Case Study`,
    description,
    alternates: {
      canonical: `${SITE_URL}/case-studies/${slug}`,
    },
    openGraph: {
      title: `${title} | Case Study GLOS Italy`,
      description,
      url: `${SITE_URL}/case-studies/${slug}`,
      siteName: SITE_NAME,
      locale: 'it_IT',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Case Study`,
      description,
    },
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params

  const [caseStudy, settings] = await Promise.all([
    getCaseStudyBySlug(slug),
    getSiteSettings(),
  ])

  if (!caseStudy) {
    notFound()
  }

  // Extract safe values
  const title = getTextValue(caseStudy.title)
  const client = caseStudy.client || ''
  const sector = getTextValue(caseStudy.sector?.name)
  const challengeText = getTextValue(caseStudy.challenge)
  // Use first gallery image as hero if available
  const heroImage = caseStudy.gallery?.[0]
  const heroImageUrl = isValidImage(heroImage) ? safeImageUrl(heroImage, 1920, 800) : null
  const stats = caseStudy.stats || []
  const gallery = caseStudy.gallery || []
  const products = caseStudy.products || []

  // Breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Case Studies', url: '/case-studies' },
    { name: title, url: `/case-studies/${slug}` },
  ]

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema data={settings || {}} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <WebPageSchema
        title={title}
        description={challengeText || `Case study: ${title}`}
        url={`/case-studies/${slug}`}
      />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center">
        {/* Background Image */}
        {heroImageUrl ? (
          <div className="absolute inset-0">
            <Image
              src={heroImageUrl}
              alt={title || 'Case Study'}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-dark" />
        )}

        {/* Content */}
        <div className="container-glos relative z-10 py-16 md:py-24">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tutti i Case Studies
            </Link>
          </nav>

          <div className="max-w-3xl">
            {/* Sector Badge */}
            {sector && (
              <span className="inline-block px-4 py-1 bg-primary/80 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
                {sector}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {title}
            </h1>

            {/* Client Info */}
            {client && (
              <div className="flex items-center gap-2 text-white/90 mb-6">
                <Building2 className="w-5 h-5" />
                <span className="text-lg font-medium">{client}</span>
              </div>
            )}

            {/* Challenge Preview */}
            {challengeText && (
              <p className="text-lg md:text-xl text-white/80 max-w-2xl line-clamp-3">
                {challengeText}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      {stats.length > 0 && (
        <section className="bg-primary text-white py-8">
          <div className="container-glos">
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
              {stats.map((stat: any, index: number) => (
                <div key={stat._key || index} className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-white/80 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Challenge Section */}
      {caseStudy.challenge && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container-glos">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">La Sfida</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <RichText value={caseStudy.challenge} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Solution Section */}
      {caseStudy.solution && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container-glos">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">La Soluzione</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <RichText value={caseStudy.solution} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {caseStudy.results && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container-glos">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">I Risultati</h2>
              </div>
              <div className="prose prose-lg max-w-none">
                <RichText value={caseStudy.results} />
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container-glos">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Galleria Progetto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((image: any, index: number) => {
                const imageUrl = isValidImage(image) ? safeImageUrl(image, 600, 400) : null
                if (!imageUrl) return null

                return (
                  <div
                    key={image._key || index}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                  >
                    <Image
                      src={imageUrl}
                      alt={`Immagine progetto ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      {caseStudy.testimonial && (
        <section className="py-16 md:py-24 bg-primary text-white">
          <div className="container-glos">
            <div className="max-w-4xl mx-auto text-center">
              <Quote className="w-12 h-12 mx-auto mb-6 opacity-50" />
              <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium italic mb-8">
                &ldquo;{String(caseStudy.testimonial)}&rdquo;
              </blockquote>
              {caseStudy.testimonialAuthor && (
                <div className="font-semibold text-lg">
                  — {caseStudy.testimonialAuthor}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Products Used Section */}
      {products.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container-glos">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Prodotti Utilizzati
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Scopri i prodotti GLOS Italy che hanno reso possibile questo successo
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => {
                const productImageUrl = isValidImage(product.mainImage)
                  ? safeImageUrl(product.mainImage, 400, 300)
                  : null
                const productName = getTextValue(product.name)
                const productSlug = product.slug?.current

                return (
                  <article
                    key={product._id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <Link href={`/prodotti/${productSlug}`} className="block">
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
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {productName}
                        </h3>
                        <div className="flex items-center gap-2 text-primary font-medium text-sm">
                          <span>Scopri di piu</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gray-900 text-white">
        <div className="container-glos text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Vuoi ottenere risultati simili?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Contattaci per scoprire come possiamo aiutare la tua azienda
            a raggiungere i suoi obiettivi.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contatti"
              className="btn bg-white text-gray-900 hover:bg-gray-100"
            >
              Contattaci
            </Link>
            <Link
              href="/case-studies"
              className="btn bg-white/10 text-white border border-white/30 hover:bg-white hover:text-gray-900"
            >
              Altri Case Studies
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
