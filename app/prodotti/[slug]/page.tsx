// Single Product Page
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { getProductBySlug, getProductSlugs } from '@/lib/sanity/fetch'
import { urlFor } from '@/lib/sanity/client'
import { ArrowLeft } from 'lucide-react'

interface ProductPageProps {
  params: { slug: string }
}

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return { title: 'Prodotto non trovato' }
  }

  return {
    title: product.name || 'Prodotto',
    description: product.shortDescription || '',
    openGraph: {
      title: product.name || 'Prodotto',
      description: product.shortDescription || '',
      images: product.mainImage
        ? [urlFor(product.mainImage).width(1200).height(630).url()]
        : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const isDraftMode = draftMode().isEnabled
  const product = await getProductBySlug(params.slug, isDraftMode)

  if (!product) {
    notFound()
  }

  // Parse specs from text (one per line)
  const specsList = product.specs
    ? product.specs.split('\n').filter((s: string) => s.trim())
    : []

  return (
    <div className="section">
      <div className="container-glos">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/prodotti"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna ai Prodotti
          </Link>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {product.mainImage && (
              <Image
                src={urlFor(product.mainImage).width(800).height(800).url()}
                alt={product.name || ''}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category */}
            {product.category && (
              <span className="text-sm text-primary font-medium">
                {product.category.name}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              {product.name}
            </h1>

            {/* Badges */}
            <div className="flex gap-2 mb-6">
              {product.isNew && (
                <span className="px-3 py-1 bg-accent text-white text-sm font-medium rounded-full">
                  Nuovo
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-lg text-gray-600 mb-6">
                {product.shortDescription}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/contatti" className="btn-primary">
                Richiedi Informazioni
              </Link>
              <Link href="/rivenditori" className="btn-secondary">
                Trova Rivenditore
              </Link>
            </div>

            {/* Specifications */}
            {specsList.length > 0 && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Specifiche Tecniche</h2>
                <ul className="space-y-2">
                  {specsList.map((spec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Full Description */}
        {product.description && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-semibold mb-6">Descrizione Completa</h2>
            <div className="prose prose-lg max-w-none">
              {product.description}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
