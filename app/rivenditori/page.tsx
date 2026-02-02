// Dealers Page - v1.4.0 - Enhanced SEO with Structured Data
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import nextDynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { getAllDealers, getSiteSettings } from '@/lib/sanity/fetch'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { MapPin, Phone, Mail, Award, Globe, Clock, Star, Play, ExternalLink } from 'lucide-react'
import { getTextValue } from '@/lib/utils/textHelpers'
import { SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { OrganizationSchema, BreadcrumbSchema, WebPageSchema, LocalBusinessSchema } from '@/components/seo/JsonLd'

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

export const dynamic = 'force-dynamic'

export default async function DealersPage() {
  const { isEnabled: isDraftMode } = await draftMode()

  const [dealers, settings] = await Promise.all([
    getAllDealers(isDraftMode),
    getSiteSettings(isDraftMode),
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

  // Helper per estrarre ID video YouTube
  const getYouTubeId = (url: string) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
    return match ? match[1] : null
  }

  const DealerCard = ({ dealer, showFeatured = false }: { dealer: any; showFeatured?: boolean }) => {
    const youtubeId = getYouTubeId(dealer.youtubeVideo)
    const isFeatured = dealer.isFeatured && showFeatured

    return (
      <article className={`card p-6 relative ${isFeatured ? 'ring-2 ring-yellow-400 bg-yellow-50/30' : ''}`}>
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3" /> In Evidenza
          </div>
        )}

        <div className="flex items-start gap-4">
          {isValidImage(dealer.logo) && safeImageUrl(dealer.logo, 128, 128) ? (
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={safeImageUrl(dealer.logo, 128, 128)!}
                alt={String(dealer.name || '')}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">
                {dealer.type === 'distributore' ? '🏭' : dealer.type === 'agente' ? '👤' : '🏪'}
              </span>
            </div>
          )}
          <div className="flex-grow min-w-0">
            <h3 className="text-lg font-semibold truncate">{getTextValue(dealer.name)}</h3>

            {/* Country & City */}
            <p className="text-sm text-gray-500">
              {[dealer.city, dealer.country].filter(Boolean).join(', ')}
            </p>

            {/* Certifications */}
            {dealer.certifications && dealer.certifications.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {dealer.certifications.map((cert: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
                  >
                    <Award className="w-3 h-3" />
                    {getTextValue(cert)}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {dealer.description && (
          <p className="mt-4 text-sm text-gray-600 line-clamp-2">
            {getTextValue(dealer.description)}
          </p>
        )}

        {/* Address */}
        {dealer.address && (
          <div className="flex items-start gap-2 mt-4 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
            <span>{getTextValue(dealer.address)}</span>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-4 space-y-2">
          {dealer.phone && (
            <a
              href={`tel:${getTextValue(dealer.phone).replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              {getTextValue(dealer.phone)}
            </a>
          )}
          {dealer.email && (
            <a
              href={`mailto:${getTextValue(dealer.email)}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              {getTextValue(dealer.email)}
            </a>
          )}
          {dealer.website && (
            <a
              href={dealer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <Globe className="w-4 h-4" />
              Visita il sito web
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Opening Hours */}
        {dealer.openingHours && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{getTextValue(dealer.openingHours)}</span>
            </div>
          </div>
        )}

        {/* Regions */}
        {dealer.regions && dealer.regions.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">Zone coperte:</p>
            <div className="flex flex-wrap gap-1">
              {dealer.regions.map((region: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {getTextValue(region)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Video YouTube Button */}
        {youtubeId && (
          <div className="mt-4 pt-4 border-t">
            <a
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Play className="w-5 h-5" />
              Guarda il Video
            </a>
          </div>
        )}
      </article>
    )
  }

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
