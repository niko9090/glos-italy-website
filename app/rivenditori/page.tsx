// Dealers Page
import { Metadata } from 'next'
import Image from 'next/image'
import { draftMode } from 'next/headers'
import { getAllDealers } from '@/lib/sanity/fetch'
import { urlFor } from '@/lib/sanity/client'
import { MapPin, Phone, Mail, Globe, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Rivenditori',
  description: 'Trova il rivenditore GLOS Italy piu vicino a te',
}

export const revalidate = 60

export default async function DealersPage() {
  const isDraftMode = draftMode().isEnabled
  const dealers = await getAllDealers(isDraftMode)

  // Group dealers by type
  const distributors = dealers.filter((d) => d.type === 'distributore')
  const resellers = dealers.filter((d) => d.type === 'rivenditore')
  const agents = dealers.filter((d) => d.type === 'agente')

  const DealerCard = ({ dealer }: { dealer: any }) => (
    <article className="card p-6">
      <div className="flex items-start gap-4">
        {dealer.logo && (
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={urlFor(dealer.logo).width(128).height(128).url()}
              alt={dealer.name || ''}
              fill
              className="object-contain"
            />
          </div>
        )}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">{dealer.name}</h3>

          {/* Certifications */}
          {dealer.certifications && dealer.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 mb-2">
              {dealer.certifications.map((cert: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
                >
                  <Award className="w-3 h-3" />
                  {cert}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Address */}
      {dealer.address && (
        <div className="flex items-start gap-2 mt-4 text-sm text-gray-600">
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            {[
              dealer.address.street,
              dealer.address.city,
              dealer.address.province,
              dealer.address.postalCode,
            ]
              .filter(Boolean)
              .join(', ')}
          </span>
        </div>
      )}

      {/* Contact */}
      <div className="mt-4 space-y-2">
        {dealer.contact?.phone && (
          <a
            href={`tel:${dealer.contact.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
          >
            <Phone className="w-4 h-4" />
            {dealer.contact.phone}
          </a>
        )}
        {dealer.contact?.email && (
          <a
            href={`mailto:${dealer.contact.email}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
          >
            <Mail className="w-4 h-4" />
            {dealer.contact.email}
          </a>
        )}
        {dealer.contact?.website && (
          <a
            href={dealer.contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
          >
            <Globe className="w-4 h-4" />
            Visita il sito
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
                {region}
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

        {/* Map Placeholder */}
        <div className="bg-gray-100 rounded-2xl h-96 mb-12 flex items-center justify-center">
          <p className="text-gray-500">Mappa interattiva - Configurare con Google Maps API</p>
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
