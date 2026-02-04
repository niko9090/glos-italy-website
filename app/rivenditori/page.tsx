// Dealers Page - v1.5.0 - Video modal centered
import { Metadata } from 'next'
import Link from 'next/link'
import nextDynamic from 'next/dynamic'
import { getAllDealers, getSiteSettings } from '@/lib/sanity/fetch'
import { MapPin, Star } from 'lucide-react'
import { SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { OrganizationSchema, BreadcrumbSchema, WebPageSchema, LocalBusinessSchema } from '@/components/seo/JsonLd'
import DealerCard from '@/components/DealerCard'

// Import dinamico per Leaflet (non supporta SSR)
const DealersMap = nextDynamic(() => import('@/components/DealersMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-gray-500">Caricamento mappa...</p>
      </div>
    </div>
  ),
})

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
  const [dealers, settings] = await Promise.all([
    getAllDealers(),
    getSiteSettings(),
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

          {/* CTA */}
          {dealers.length > 0 && (
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 mt-12 text-center text-white">
              <h3 className="text-2xl font-semibold mb-4">Vuoi diventare rivenditore?</h3>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                Unisciti alla rete GLOS Italy e offri ai tuoi clienti prodotti di qualità Made in Italy.
                Supporto tecnico, formazione e materiale marketing inclusi.
              </p>
              <Link href="/contatti" className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Diventa Partner
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
