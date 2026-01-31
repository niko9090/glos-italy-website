// Product Gallery Component
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'

interface ProductGalleryProps {
  mainImage: any
  gallery?: any[]
  productName: string
}

export default function ProductGallery({ mainImage, gallery, productName }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(mainImage)

  // Filter out invalid images (missing asset reference)
  const allImages = [mainImage, ...(gallery || [])].filter(img => isValidImage(img))

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
        {isValidImage(activeImage) && safeImageUrl(activeImage, 800, 800) ? (
          <Image
            src={safeImageUrl(activeImage, 800, 800)!}
            alt={productName}
            fill
            className="object-contain"
            priority
          />
        ) : null}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(image)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                activeImage === image ? 'border-primary' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={safeImageUrl(image, 160, 160)!}
                alt={`${productName} - ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
