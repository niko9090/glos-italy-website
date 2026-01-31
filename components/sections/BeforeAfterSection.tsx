// Before/After Section Component
'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { getTextValue } from '@/lib/utils/textHelpers'
import RichText from '@/components/RichText'

interface BeforeAfterSectionProps {
  data: {
    title?: unknown
    subtitle?: unknown
    description?: unknown
    comparisons?: Array<{
      _key: string
      beforeImage: any
      beforeLabel?: string
      afterImage: any
      afterLabel?: string
      caption?: unknown
    }>
    layout?: string
    sliderPosition?: number
    showLabels?: boolean
    aspectRatio?: string
    rounded?: boolean
    backgroundColor?: string
  }
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
}

function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  showLabels,
  initialPosition,
  aspectRatio,
  rounded,
  isVertical,
}: {
  beforeImage: string
  afterImage: string
  beforeLabel: string
  afterLabel: string
  showLabels: boolean
  initialPosition: number
  aspectRatio: string
  rounded: boolean
  isVertical: boolean
}) {
  const [position, setPosition] = useState(initialPosition)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMove = (clientX: number, clientY: number) => {
    if (!containerRef.current || !isDragging.current) return

    const rect = containerRef.current.getBoundingClientRect()
    let newPosition: number

    if (isVertical) {
      newPosition = ((clientY - rect.top) / rect.height) * 100
    } else {
      newPosition = ((clientX - rect.left) / rect.width) * 100
    }

    setPosition(Math.max(0, Math.min(100, newPosition)))
  }

  const handleMouseDown = () => {
    isDragging.current = true
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY)
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchend', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchend', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-ew-resize ${rounded ? 'rounded-2xl' : ''}`}
      style={{ aspectRatio }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* After Image (Background) */}
      <Image src={afterImage} alt="Dopo" fill className="object-cover" />

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={isVertical ? { height: `${position}%` } : { width: `${position}%` }}
      >
        <Image src={beforeImage} alt="Prima" fill className="object-cover" />
      </div>

      {/* Slider Line */}
      <div
        className={`absolute bg-white shadow-lg ${
          isVertical
            ? 'left-0 right-0 h-1 cursor-ns-resize'
            : 'top-0 bottom-0 w-1 cursor-ew-resize'
        }`}
        style={isVertical ? { top: `${position}%` } : { left: `${position}%` }}
      >
        {/* Handle */}
        <div
          className={`absolute ${
            isVertical
              ? 'left-1/2 -translate-x-1/2 -translate-y-1/2'
              : 'top-1/2 -translate-x-1/2 -translate-y-1/2'
          } w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center`}
        >
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-gray-400 rounded" />
            <div className="w-0.5 h-4 bg-gray-400 rounded" />
          </div>
        </div>
      </div>

      {/* Labels */}
      {showLabels && (
        <>
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
            {beforeLabel}
          </div>
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
            {afterLabel}
          </div>
        </>
      )}
    </div>
  )
}

export default function BeforeAfterSection({ data }: BeforeAfterSectionProps) {
  const bgClass = bgClasses[data.backgroundColor || 'gray']
  const textColor = data.backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'
  const layout = data.layout || 'slider-horizontal'
  const aspectRatio = data.aspectRatio?.replace('/', ' / ') || '16 / 9'

  const validComparisons = data.comparisons?.filter(
    (c) => isValidImage(c.beforeImage) && isValidImage(c.afterImage)
  ) || []

  if (validComparisons.length === 0) return null

  return (
    <section className={`section ${bgClass}`}>
      <div className="container-glos">
        {/* Header */}
        {(data.title || data.subtitle) && (
          <div className={`text-center mb-12 ${textColor}`}>
            {data.title && <h2 className="section-title mb-4"><RichText value={data.title} /></h2>}
            {data.subtitle && <div className="section-subtitle"><RichText value={data.subtitle} /></div>}
            {data.description && (
              <div className="prose prose-lg max-w-2xl mx-auto mt-4">
                <RichText value={data.description} />
              </div>
            )}
          </div>
        )}

        {/* Comparisons */}
        <div className={layout === 'grid' ? 'grid md:grid-cols-2 gap-8' : 'space-y-12'}>
          {validComparisons.map((comparison) => (
            <motion.div
              key={comparison._key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {layout.startsWith('slider') ? (
                <ComparisonSlider
                  beforeImage={safeImageUrl(comparison.beforeImage, 1200, 800)!}
                  afterImage={safeImageUrl(comparison.afterImage, 1200, 800)!}
                  beforeLabel={comparison.beforeLabel || 'Prima'}
                  afterLabel={comparison.afterLabel || 'Dopo'}
                  showLabels={data.showLabels !== false}
                  initialPosition={data.sliderPosition || 50}
                  aspectRatio={aspectRatio}
                  rounded={data.rounded !== false}
                  isVertical={layout === 'slider-vertical'}
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className={`relative overflow-hidden ${data.rounded ? 'rounded-xl' : ''}`} style={{ aspectRatio }}>
                    <Image src={safeImageUrl(comparison.beforeImage, 800, 600)!} alt="Prima" fill className="object-cover" />
                    {data.showLabels && (
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                        {comparison.beforeLabel || 'Prima'}
                      </div>
                    )}
                  </div>
                  <div className={`relative overflow-hidden ${data.rounded ? 'rounded-xl' : ''}`} style={{ aspectRatio }}>
                    <Image src={safeImageUrl(comparison.afterImage, 800, 600)!} alt="Dopo" fill className="object-cover" />
                    {data.showLabels && (
                      <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                        {comparison.afterLabel || 'Dopo'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Caption */}
              {comparison.caption && (
                <p className={`text-center mt-4 ${textColor}`}>
                  {getTextValue(comparison.caption)}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
