// Dealers Page
import { Metadata } from 'next'
import Image from 'next/image'
import nextDynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { getAllDealers } from '@/lib/sanity/fetch'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { MapPin, Phone, Mail, Award } from 'lucide-react'
import { getTextValue } from '@/lib/utils/textHelpers'

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
  description: 'Trova il rivenditore GLOS Italy piu vicino a te',
}

// Force dynamic rendering to support draft mode
export const dynamic = 'force-dynamic'

export default async function DealersPage() {
  // CORRETTO: draftMode() e' async in Next.js 14.x App Router
  const { isEnabled: isDraftMode } = await draftMode()
  const dealers = await getAllDealers(isDraftMode)

  // Group dealers by type
  const distributors = dealers.filter((d) => d.type === 'distributore')
  const resellers = dealers.filter((d) => d.type === 'rivenditore')
  const agents = dealers.filter((d) => d.type === 'agente')

  const DealerCard = ({ dealer }: { dealer: any }) => (
    <article className="card p-6">
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
        ) : null}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">{getTextValue(dealer.name)}</h3>

          {/* Certifications */}
          {dealer.certifications && dealer.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 mb-2">
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

      {/* City & Address */}
      {(dealer.city || dealer.address) && (
        <div className="flex items-start gap-2 mt-4 text-sm text-gray-600">
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            {getTextValue(dealer.city)}
            {dealer.city && dealer.address && ' - '}
            {getTextValue(dealer.address)}
          </span>
        </div>
      )}

      {/* Contact */}
      <div className="mt-4 space-y-2">
        {dealer.phone && (
          <a
            href={`tel:${getTextValue(dealer.phone).replace(/\s/g, '')}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
          >
            <Phone className="w-4 h-4" />
            {getTextValue(dealer.phone)}
          </a>
        )}
        {dealer.email && (
          <a
            href={`mailto:${getTextValue(dealer.email)}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
          >
            <Mail className="w-4 h-4" />
            {getTextValue(dealer.email)}
          </a>
        )}
      </div>

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
    </article>
  )

  return (
    <div className="section">
      <div className="container-glos">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title mb-4">I Nostri Rivenditori</h1>
          <p className="section-subtitle mx-auto">
            Trova il punto vendita GLOS Italy piu vicino a te
          </p>
        </div>

        {/* Mappa Interattiva */}
        <div className="mb-12">
          <DealersMap dealers={dealers} />
          <p className="text-sm text-gray-500 text-center mt-2">
            Clicca sui marker per vedere i dettagli del rivenditore
          </p>
        </div>

        {/* Distributors */}
        {distributors.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Distributori</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {distributors.map((dealer) => (
                <DealerCard key={dealer._id} dealer={dealer} />
              ))}
            </div>
          </div>
        )}

        {/* Resellers */}
        {resellers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Rivenditori</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resellers.map((dealer) => (
                <DealerCard key={dealer._id} dealer={dealer} />
              ))}
            </div>
          </div>
        )}

        {/* Agents */}
        {agents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Agenti</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((dealer) => (
                <DealerCard key={dealer._id} dealer={dealer} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {dealers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nessun rivenditore disponibile al momento.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-primary/5 rounded-2xl p-8 mt-12 text-center">
          <h3 className="text-2xl font-semibold mb-4">Vuoi diventare rivenditore?</h3>
          <p className="text-gray-600 mb-6">
            Unisciti alla rete GLOS Italy e offri ai tuoi clienti prodotti di qualita Made in
            Italy.
          </p>
          <a href="/contatti" className="btn-primary">
            Contattaci
          </a>
        </div>
      </div>
    </div>
  )
}
