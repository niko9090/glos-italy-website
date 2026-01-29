// Products List Page
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { getAllProducts, getAllCategories } from '@/lib/sanity/fetch'
import { urlFor } from '@/lib/sanity/client'

export const metadata: Metadata = {
  title: 'Prodotti',
  description: 'Scopri tutti i prodotti GLOS Italy - qualita Made in Italy',
}

export const revalidate = 60

export default async function ProductsPage() {
  const isDraftMode = draftMode().isEnabled

  const [products, categories] = await Promise.all([
    getAllProducts(isDraftMode),
    getAllCategories(isDraftMode),
  ])

  return (
    <div className="section">
      <div className="container-glos">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title mb-4">I Nostri Prodotti</h1>
          <p className="section-subtitle mx-auto">
            Qualita e innovazione Made in Italy per ogni esigenza
          </p>
        </div>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
              Tutti
            </button>
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/prodotti/categoria/${category.slug?.current}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                {category.name} ({category.productCount})
              </Link>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <article key={product._id} className="card group">
              <Link href={`/prodotti/${product.slug?.current}`}>
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {product.mainImage && (
                    <Image
                      src={urlFor(product.mainImage).width(600).height(450).url()}
                      alt={product.name || ''}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.isNew && (
                      <span className="px-3 py-1 bg-accent text-white text-sm font-medium rounded-full">
                        Nuovo
                      </span>
                    )}
                    {product.isFeatured && (
                      <span className="px-3 py-1 bg-secondary text-gray-900 text-sm font-medium rounded-full">
                        In Evidenza
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {product.category && (
                    <span className="text-sm text-primary font-medium">
                      {product.category.name}
                    </span>
                  )}

                  <h2 className="text-xl font-semibold mt-1 mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h2>

                  {product.shortDescription && (
                    <p className="text-gray-600 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nessun prodotto disponibile al momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}
