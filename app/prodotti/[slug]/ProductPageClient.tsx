// Single Product Page Client Component - Modern Design
'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { isValidImage, safeImageUrl, getFileUrl } from '@/lib/sanity/client'
import { getTextValue } from '@/lib/utils/textHelpers'
import RichText from '@/components/RichText'
import type { Product } from '@/lib/sanity/fetch'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  FileText,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Star,
  Settings,
  Zap,
  Lock,
  Lightbulb,
  Target,
  Trophy,
  Rocket,
  CheckCircle,
  Shield,
  ZoomIn
} from 'lucide-react'

interface ProductPageClientProps {
  product: Product
  relatedProducts: Product[]
}

// Icon mapping
const featureIcons: Record<string, React.ReactNode> = {
  gear: <Settings className="w-6 h-6" />,
  lightning: <Zap className="w-6 h-6" />,
  lock: <Lock className="w-6 h-6" />,
  bulb: <Lightbulb className="w-6 h-6" />,
  target: <Target className="w-6 h-6" />,
  trophy: <Trophy className="w-6 h-6" />,
  rocket: <Rocket className="w-6 h-6" />,
  check: <CheckCircle className="w-6 h-6" />,
  star: <Star className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
}

// File type icons
const fileTypeIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-5 h-5 text-red-500" />,
  doc: <FileText className="w-5 h-5 text-blue-500" />,
  xls: <FileText className="w-5 h-5 text-green-500" />,
  zip: <FileText className="w-5 h-5 text-amber-500" />,
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Build gallery array: main image + gallery images
  const allImages = [
    product.mainImage,
    ...(Array.isArray(product.gallery) ? product.gallery : [])
  ].filter(img => isValidImage(img))

  const productName = getTextValue(product.name)
  const categoryName = getTextValue(product.category?.name)
  const specifications = product.specifications || []
  const features = (product as any).features || []
  const documents = (product as any).documents || []

  // Lightbox navigation
  const goToPrevious = useCallback(() => {
    setSelectedImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)
  }, [allImages.length])

  const goToNext = useCallback(() => {
    setSelectedImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)
  }, [allImages.length])

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
    if (e.key === 'Escape') setLightboxOpen(false)
  }, [goToNext, goToPrevious])

  return (
    <div className="min-h-screen bg-gradient-to-b from-metal-50 via-white to-metal-100">
      {/* Breadcrumb */}
      <section className="bg-white border-b border-metal-200">
        <div className="container-glos py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/prodotti"
              className="inline-flex items-center gap-1 text-metal-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Torna ai Prodotti
            </Link>
            {!!categoryName && (
              <>
                <span className="text-metal-300">/</span>
                <span className="text-metal-600">{String(categoryName)}</span>
              </>
            )}
          </nav>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="section">
        <div className="container-glos">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Main Image */}
              <div
                className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-metal-100 to-metal-200 cursor-zoom-in group"
                onClick={() => setLightboxOpen(true)}
              >
                {allImages[selectedImageIndex] && safeImageUrl(allImages[selectedImageIndex], 800, 800) ? (
                  <Image
                    src={safeImageUrl(allImages[selectedImageIndex], 800, 800)!}
                    alt={productName || 'Prodotto'}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-metal-400">
                    Immagine non disponibile
                  </div>
                )}

                {/* Zoom indicator */}
                <div className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <ZoomIn className="w-5 h-5 text-metal-700" />
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      NUOVO
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-metal-900 text-xs font-bold rounded-full shadow-lg">
                      <Star className="w-3 h-3" />
                      IN EVIDENZA
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImageIndex
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-metal-200 hover:border-metal-400'
                      }`}
                    >
                      {safeImageUrl(img, 100, 100) && (
                        <Image
                          src={safeImageUrl(img, 100, 100)!}
                          alt={`${productName} - immagine ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Category */}
              {!!categoryName && (
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                  {String(categoryName)}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-metal-800 mb-6 leading-tight">
                {String(productName || '')}
              </h1>

              {/* Short Description */}
              <div className="text-lg text-metal-600 mb-8 leading-relaxed">
                <RichText value={product.shortDescription} />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/contatti"
                  className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
                >
                  <Phone className="w-5 h-5" />
                  Richiedi Informazioni
                </Link>
                <Link
                  href="/rivenditori"
                  className="btn-secondary flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Trova Rivenditore
                </Link>
              </div>

              {/* Quick Features */}
              {features.length > 0 && (
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-semibold text-metal-800">Caratteristiche Principali</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {features.slice(0, 4).map((feature: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-metal-50 rounded-lg"
                      >
                        <div className="p-2 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                          {featureIcons[feature.icon] || <CheckCircle className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-metal-800">{feature.title}</h4>
                          {feature.description && (
                            <p className="text-sm text-metal-500 mt-0.5">{feature.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Preview */}
              {specifications.length > 0 && (
                <div className="border-t border-metal-200 pt-6">
                  <h3 className="text-lg font-semibold text-metal-800 mb-4">Specifiche Tecniche</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {specifications.slice(0, 6).map((spec: any, index: number) => (
                      <div key={index} className="flex justify-between py-2 border-b border-metal-100">
                        <span className="text-metal-500 text-sm">{getTextValue(spec.label)}</span>
                        <span className="text-metal-800 font-medium text-sm">{getTextValue(spec.value)}</span>
                      </div>
                    ))}
                  </div>
                  {specifications.length > 6 && (
                    <p className="text-sm text-metal-400 mt-3">
                      +{specifications.length - 6} altre specifiche - vedi tabella completa sotto
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Full Description Section */}
      {product.fullDescription && (
        <section className="py-16 bg-white">
          <div className="container-glos">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-metal-800 mb-6">
                Descrizione Completa
              </h2>
              <div className="prose prose-lg max-w-none prose-headings:text-metal-800 prose-p:text-metal-600 prose-a:text-primary">
                <RichText value={product.fullDescription} />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Full Specifications Table */}
      {specifications.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-metal-50 to-white">
          <div className="container-glos">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-metal-800 mb-8 text-center">
                Specifiche Tecniche Complete
              </h2>
              <div className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl border border-metal-200">
                <table className="w-full">
                  <tbody>
                    {specifications.map((spec: any, index: number) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? 'bg-metal-50' : 'bg-white'
                        } hover:bg-primary/5 transition-colors`}
                      >
                        <td className="py-4 px-6 font-medium text-metal-700 border-r border-metal-200">
                          {getTextValue(spec.label)}
                        </td>
                        <td className="py-4 px-6 text-metal-900 font-semibold">
                          {getTextValue(spec.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Documents Download Section */}
      {documents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-glos">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-metal-800 mb-8 text-center">
                Documenti Scaricabili
              </h2>
              <div className="max-w-2xl mx-auto grid gap-4">
                {documents.map((doc: any, index: number) => {
                  const fileUrl = getFileUrl(doc.file)
                  if (!fileUrl) return null

                  return (
                    <a
                      key={index}
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-metal-50 rounded-xl hover:bg-metal-100 transition-colors group border border-metal-200"
                    >
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        {fileTypeIcons[doc.fileType] || <FileText className="w-5 h-5 text-metal-500" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-metal-800 group-hover:text-primary transition-colors">
                          {doc.title}
                        </h4>
                        <p className="text-sm text-metal-500 uppercase">{doc.fileType || 'Documento'}</p>
                      </div>
                      <Download className="w-5 h-5 text-metal-400 group-hover:text-primary transition-colors" />
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-dark to-primary">
        <div className="container-glos text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Interessato a {String(productName || 'questo prodotto')}?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contattaci per ricevere maggiori informazioni, un preventivo personalizzato o per prenotare una dimostrazione.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contatti"
                className="btn bg-white text-primary hover:bg-metal-100 flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Richiedi Preventivo
              </Link>
              <Link
                href="tel:+390000000000"
                className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20 flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Chiama Ora
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-metal-50">
          <div className="container-glos">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-metal-800 mb-8 text-center">
                Ti Potrebbe Interessare
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <RelatedProductCard key={relatedProduct._id} product={relatedProduct} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Chiudi"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation buttons */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goToPrevious() }}
                  className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  aria-label="Immagine precedente"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goToNext() }}
                  className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  aria-label="Immagine successiva"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Main image */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages[selectedImageIndex] && safeImageUrl(allImages[selectedImageIndex], 1200, 1200) && (
                <Image
                  src={safeImageUrl(allImages[selectedImageIndex], 1200, 1200)!}
                  alt={`${productName} - immagine ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                />
              )}
            </motion.div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">
              {selectedImageIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Related Product Card Component
function RelatedProductCard({ product }: { product: Product }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Link
      href={`/prodotti/${product.slug?.current}`}
      className="group bg-white rounded-xl overflow-hidden border border-metal-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-metal-100">
        {!imageLoaded && <div className="absolute inset-0 bg-metal-200 animate-pulse" />}
        {isValidImage(product.mainImage) && safeImageUrl(product.mainImage, 300, 225) ? (
          <Image
            src={safeImageUrl(product.mainImage, 300, 225)!}
            alt={getTextValue(product.name) || ''}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-metal-800 group-hover:text-primary transition-colors line-clamp-1">
          {String(getTextValue(product.name) || '')}
        </h3>
        <p className="text-sm text-metal-500 mt-1 line-clamp-2">
          {String(getTextValue(product.shortDescription) || '')}
        </p>
      </div>
    </Link>
  )
}
