// Dealers Page - v1.6.0 - Clean map, centered video, testimonials
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllDealers, getSiteSettings, getAllTestimonials } from '@/lib/sanity/fetch'
import { MapPin, Star, Quote } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { OrganizationSchema, BreadcrumbSchema, WebPageSchema, LocalBusinessSchema } from '@/components/seo/JsonLd'
import DealerCard from '@/components/DealerCard'
import DealersMap from '@/components/DealersMapWrapper'

export const metadata: Metadata = {
  title: 'Rivenditori',
  description: 'Trova il rivenditore GLOS Italy più vicino a te. Rete vendita autorizzata in Italia e Europa per macchinari di precisione.',
  alternates: {
    canonical: `${SITE_URL}/rivenditori`,
  },
  openGraph: {
    title: 'Rivenditori | GLOS Italy',
    description: 'Trova il rivenditore GLOS Italy più vicino a te. Rete vendita autorizzata in Italia e Europa.',
    url: `${SITE_URL}/rivenditori`,
    siteName: SITE_NAME,
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rivenditori | GLOS Italy',
    description: 'Trova il rivenditore GLOS Italy più vicino a te. Rete vendita autorizzata in Italia e Europa.',
  },
}

export default async function DealersPage() {
  const [dealers, settings, testimonials] = await Promise.all([
    getAllDealers(),
    getSiteSettings(),
    getAllTestimonials(),
  ])

  // Separa featured e normali, poi per tipo
  const featuredDealers = dealers.filter((d) => d.isFeatured)
  const normalDealers = dealers.filter((d) => !d.isFeatured)

  const distributors = normalDealers.filter((d) => d.type === 'distributore')
  const resellers = normalDealers.filter((d) => d.type === 'rivenditore')
  const agents = normalDealers.filter((d) => d.type === 'agente')

  // Conta rivenditori che possono apparire sulla mappa (con coordinate O con città/indirizzo per geocoding)
  const dealersWithCoords = dealers.filter((d) =>
    (d.location?.lat && d.location?.lng) || d.city || d.address
  )

  // Breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Rivenditori', url: '/rivenditori' },
  ]

  const DealerSection = ({ title, emoji, dealers: sectionDealers }: { title: string; emoji: string; dealers: any[] }) => {
    if (sectionDealers.length === 0) return null

    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <span>{emoji}</span> {title}
          <span className="text-sm font-normal text-gray-500">({sectionDealers.length})</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionDealers.map((dealer) => (
            <DealerCard key={dealer._id} dealer={dealer} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema data={settings || {}} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <WebPageSchema
        title="Rivenditori GLOS Italy"
        description="Trova il rivenditore GLOS Italy più vicino a te. Rete vendita autorizzata in Italia e Europa."
        url="/rivenditori"
      />
      {/* LocalBusiness schema for featured dealers */}
      {featuredDealers.slice(0, 5).map((dealer) => (
        <LocalBusinessSchema
          key={dealer._id}
          data={{
            name: dealer.name,
            description: dealer.description,
            logo: dealer.logo,
            address: dealer.address,
            city: dealer.city,
            country: dealer.country,
            phone: dealer.phone,
            email: dealer.email,
            location: dealer.location,
            openingHours: dealer.openingHours,
          }}
        />
      ))}

      <div className="section">
        <div className="container-glos">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="section-title mb-4">I Nostri Rivenditori</h1>
            <p className="section-subtitle mx-auto">
              Trova il punto vendita GLOS Italy più vicino a te
            </p>
            {dealers.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {dealers.length} rivenditori in {new Set(dealers.map(d => d.country || 'Italia').filter(Boolean)).size} paesi
              </p>
            )}
          </div>

          {/* Mappa Interattiva */}
          {dealersWithCoords.length > 0 ? (
            <div className="mb-12">
              <DealersMap dealers={dealers} />
              <p className="text-sm text-gray-500 text-center mt-2">
                Clicca sui marker per vedere i dettagli del rivenditore
              </p>
            </div>
          ) : dealers.length > 0 ? (
            <div className="mb-12 bg-gray-100 rounded-2xl p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                I rivenditori non hanno ancora le coordinate GPS configurate.
                <br />
                La mappa sarà disponibile a breve.
              </p>
            </div>
          ) : null}

          {/* Recensioni Clienti */}
          {testimonials.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Quote className="w-6 h-6 text-primary" /> Cosa Dicono i Nostri Clienti
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.slice(0, 6).map((testimonial) => (
                  <div
                    key={testimonial._id}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {/* Rating */}
                    {testimonial.rating && (
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < testimonial.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Quote */}
                    <blockquote className="text-gray-700 mb-4 italic">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      {isValidImage(testimonial.avatar) && safeImageUrl(testimonial.avatar, 48, 48) && (
                        <Image
                          src={safeImageUrl(testimonial.avatar, 48, 48)!}
                          alt={testimonial.author || ''}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                        {(testimonial.role || testimonial.company) && (
                          <p className="text-sm text-gray-500">
                            {testimonial.role}
                            {testimonial.role && testimonial.company && ' - '}
                            {testimonial.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Dealers */}
          {featuredDealers.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" /> Partner in Evidenza
                <span className="text-sm font-normal text-gray-500">({featuredDealers.length})</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDealers.map((dealer) => (
                  <DealerCard key={dealer._id} dealer={dealer} showFeatured />
                ))}
              </div>
            </div>
          )}

          {/* Distributors */}
          <DealerSection title="Distributori" emoji="🏭" dealers={distributors} />

          {/* Resellers */}
          <DealerSection title="Rivenditori" emoji="🏪" dealers={resellers} />

          {/* Agents */}
          <DealerSection title="Agenti" emoji="👤" dealers={agents} />

          {/* Empty State */}
          {dealers.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold mb-2">Nessun rivenditore disponibile</h3>
              <p className="text-gray-500 mb-6">
                La rete vendita è in fase di costruzione.
                <br />
                Contattaci per diventare partner!
              </p>
              <Link href="/contatti" className="btn-primary">
                Contattaci
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
