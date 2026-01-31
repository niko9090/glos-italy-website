// Single Product Page
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { getProductBySlug, getProductSlugs } from '@/lib/sanity/fetch'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { ArrowLeft } from 'lucide-react'
import RichText from '@/components/RichText'
import { getTextValue } from '@/lib/utils/textHelpers'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

// Force dynamic rendering to support draft mode
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const slugs = await getProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: 'Prodotto non trovato' }
  }

  const name = getTextValue(product.name) || 'Prodotto'
  const description = getTextValue(product.shortDescription) || ''

  return {
    title: name,
    description: description,
    openGraph: {
      title: name,
      description: description,
      images: isValidImage(product.mainImage) && safeImageUrl(product.mainImage, 1200, 630)
        ? [safeImageUrl(product.mainImage, 1200, 630)!]
        : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // CORRETTO: draftMode() e' async in Next.js 14.x App Router
  const { isEnabled: isDraftMode } = await draftMode()
  const { slug } = await params
  const product = await getProductBySlug(slug, isDraftMode)

  if (!product) {
    notFound()
  }

  // Estrai valori sicuri
  const productName = getTextValue(product.name)
  const categoryName = getTextValue(product.category?.name)

  // Specifications array
  const specsList = product.specifications || []

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
            {isValidImage(product.mainImage) && safeImageUrl(product.mainImage, 800, 800) ? (
              <Image
                src={safeImageUrl(product.mainImage, 800, 800)!}
                alt={productName || 'Prodotto'}
                fill
                className="object-cover"
              />
            ) : null}
          </div>

          {/* Product Info */}
          <div>
            {/* Category */}
            {categoryName && (
              <span className="text-sm text-primary font-medium">
                {categoryName}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              {productName}
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
            <div className="text-lg text-gray-600 mb-6">
              <RichText value={product.shortDescription} />
            </div>

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
                  {specsList.map((spec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary font-medium">{getTextValue(spec.label)}:</span>
                      <span>{getTextValue(spec.value)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Full Description */}
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-semibold mb-6">Descrizione Completa</h2>
          <div className="prose prose-lg max-w-none">
            <RichText value={product.fullDescription} />
          </div>
        </div>
      </div>
    </div>
  )
}
