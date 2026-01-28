// Products Section Component
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity/client'
import { t, defaultLocale } from '@/lib/i18n'
import type { Product } from '@/lib/sanity/fetch'

interface ProductsSectionProps {
  data: {
    sectionLabel?: { it?: string; en?: string; es?: string }
    title?: { it?: string; en?: string; es?: string }
    subtitle?: { it?: string; en?: string; es?: string }
    showFeatured?: boolean
    limit?: number
    ctaButton?: {
      text?: { it?: string; en?: string; es?: string }
      link?: string
    }
  }
  products?: Product[]
}

export default function ProductsSection({ data, products }: ProductsSectionProps) {
  const locale = defaultLocale
  const displayProducts = products?.slice(0, data.limit || 6) || []

  return (
    <section className="section bg-white">
      <div className="container-glos">
        {/* Header */}
        <div className="text-center mb-12">
          {data.sectionLabel && (
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {t(data.sectionLabel, locale)}
            </span>
          )}

          {data.title && (
            <h2 className="section-title mb-4">{t(data.title, locale)}</h2>
          )}

          {data.subtitle && (
            <p className="section-subtitle mx-auto">{t(data.subtitle, locale)}</p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product, index) => (
            <motion.article
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card group"
            >
              <Link href={`/prodotti/${product.slug?.current}`}>
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {product.mainImage && (
                    <Image
                      src={urlFor(product.mainImage).width(600).height(450).url()}
                      alt={t(product.name, locale) || ''}
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
                      {t(product.category.name, locale)}
                    </span>
                  )}

                  <h3 className="text-xl font-semibold mt-1 mb-2 group-hover:text-primary transition-colors">
                    {t(product.name, locale)}
                  </h3>

                  {product.shortDescription && (
                    <p className="text-gray-600 line-clamp-2">
                      {t(product.shortDescription, locale)}
                    </p>
                  )}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* CTA Button */}
        {data.ctaButton?.text && data.ctaButton?.link && (
          <div className="text-center mt-12">
            <Link href={data.ctaButton.link} className="btn-primary">
              {t(data.ctaButton.text, locale)}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
