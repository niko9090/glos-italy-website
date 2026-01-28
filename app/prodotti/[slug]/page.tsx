// Single Product Page
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug, getProductSlugs } from '@/lib/sanity/fetch'
import { urlFor } from '@/lib/sanity/client'
import { t, defaultLocale } from '@/lib/i18n'
import { ArrowLeft, Download, Check } from 'lucide-react'
import ProductGallery from '@/components/products/ProductGallery'

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

  const title = t(product.name, defaultLocale) || 'Prodotto'
  const description = t(product.shortDescription, defaultLocale) || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.mainImage
        ? [urlFor(product.mainImage).width(1200).height(630).url()]
        : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)
  const locale = defaultLocale

  if (!product) {
    notFound()
  }

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
          {/* Gallery */}
          <ProductGallery
            mainImage={product.mainImage}
            gallery={product.gallery}
            productName={t(product.name, locale) || ''}
          />

          {/* Product Info */}
          <div>
            {/* Category */}
            {product.category && (
              <Link
                href={`/prodotti/categoria/${product.category.slug?.current}`}
                className="text-sm text-primary font-medium hover:underline"
              >
                {t(product.category.name, locale)}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              {t(product.name, locale)}
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
                {t(product.shortDescription, locale)}
              </p>
            )}

            {/* Price */}
            {product.price?.showPrice && product.price?.amount && (
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary">
                  {new Intl.NumberFormat('it-IT', {
                    style: 'currency',
                    currency: product.price.currency || 'EUR',
                  }).format(product.price.amount)}
                </span>
              </div>
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
            {product.specifications && product.specifications.length > 0 && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Specifiche Tecniche</h2>
                <dl className="grid grid-cols-2 gap-4">
                  {product.specifications.map((spec: any, index: number) => (
                    <div key={index} className="border-b pb-2">
                      <dt className="text-sm text-gray-500">
                        {t(spec.label, locale)}
                      </dt>
                      <dd className="font-medium">{t(spec.value, locale)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Documents */}
            {product.documents && product.documents.length > 0 && (
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Documentazione</h2>
                <ul className="space-y-2">
                  {product.documents.map((doc: any, index: number) => (
                    <li key={index}>
                      <a
                        href={doc.file?.asset?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <Download className="w-4 h-4" />
                        {t(doc.title, locale)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Full Description */}
        {product.fullDescription && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-semibold mb-6">Descrizione Completa</h2>
            <div className="prose prose-lg max-w-none">
              {t(product.fullDescription, locale)}
            </div>
          </div>
        )}

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-semibold mb-8">Prodotti Correlati</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {product.relatedProducts.map((related) => (
                <Link
                  key={related._id}
                  href={`/prodotti/${related.slug?.current}`}
                  className="card group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {related.mainImage && (
                      <Image
                        src={urlFor(related.mainImage).width(400).height(400).url()}
                        alt={t(related.name, locale) || ''}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {t(related.name, locale)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
