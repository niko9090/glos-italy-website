// Carousel Section Component
'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface CarouselSectionProps {
  data: {
    title?: unknown
    subtitle?: unknown
    slides?: Array<{
      _key: string
      image: any
      title?: unknown
      description?: unknown
      buttonText?: unknown
      buttonLink?: string
      overlay?: string
      textPosition?: string
    }>
    autoplay?: boolean
    autoplaySpeed?: number
    showArrows?: boolean
    showDots?: boolean
    loop?: boolean
    pauseOnHover?: boolean
    height?: string
    effect?: string
    rounded?: boolean
  }
}

const heightClasses: Record<string, string> = {
  small: 'h-[300px]',
  medium: 'h-[500px]',
  large: 'h-[700px]',
  full: 'h-screen',
}

const overlayClasses: Record<string, string> = {
  none: '',
  light: 'bg-black/20',
  medium: 'bg-black/40',
  heavy: 'bg-black/60',
}

const textPositionClasses: Record<string, string> = {
  center: 'items-center justify-center text-center',
  left: 'items-center justify-start text-left pl-8 md:pl-16',
  right: 'items-center justify-end text-right pr-8 md:pr-16',
  'bottom-left': 'items-end justify-start text-left p-8 md:p-16',
  'bottom-right': 'items-end justify-end text-right p-8 md:p-16',
}

export default function CarouselSection({ data }: CarouselSectionProps) {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const validSlides = data.slides?.filter(slide => isValidImage(slide.image)) || []
  const totalSlides = validSlides.length

  const goToNext = useCallback(() => {
    if (totalSlides === 0) return
    setCurrentIndex(prev => {
      if (data.loop) {
        return (prev + 1) % totalSlides
      }
      return prev < totalSlides - 1 ? prev + 1 : prev
    })
  }, [totalSlides, data.loop])

  const goToPrev = useCallback(() => {
    if (totalSlides === 0) return
    setCurrentIndex(prev => {
      if (data.loop) {
        return prev === 0 ? totalSlides - 1 : prev - 1
      }
      return prev > 0 ? prev - 1 : prev
    })
  }, [totalSlides, data.loop])

  // Autoplay
  useEffect(() => {
    if (!data.autoplay || isPaused || totalSlides <= 1) return
    const interval = setInterval(goToNext, (data.autoplaySpeed || 5) * 1000)
    return () => clearInterval(interval)
  }, [data.autoplay, data.autoplaySpeed, isPaused, goToNext, totalSlides])

  if (validSlides.length === 0) return null

  const currentSlide = validSlides[currentIndex]
  const heightClass = heightClasses[data.height || 'large'] || heightClasses.large

  return (
    <section className="relative overflow-hidden">
      {(data.title || data.subtitle) ? (
        <div className="container-glos py-8 text-center">
          {data.title ? (
            <h2 className="section-title mb-4">
              <RichText value={data.title} />
            </h2>
          ) : null}
          {data.subtitle ? (
            <div className="section-subtitle">
              <RichText value={data.subtitle} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Carousel */}
      <div
        className={`relative ${heightClass} ${data.rounded ? 'mx-4 md:mx-8 rounded-2xl overflow-hidden' : ''}`}
        onMouseEnter={() => data.pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => data.pauseOnHover && setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: data.effect === 'slide' ? 100 : 0, scale: data.effect === 'zoom' ? 1.1 : 1 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: data.effect === 'slide' ? -100 : 0, scale: data.effect === 'zoom' ? 0.9 : 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <Image
              src={safeImageUrl(currentSlide.image, 1920, 1080)!}
              alt=""
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />

            {/* Overlay */}
            <div className={`absolute inset-0 ${overlayClasses[currentSlide.overlay || 'medium']}`} />

            {/* Content */}
            <div className={`absolute inset-0 flex ${textPositionClasses[currentSlide.textPosition || 'center']}`}>
              <div className="max-w-3xl px-4">
                {currentSlide.title ? (
                  <motion.h3
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-5xl font-bold text-white mb-4"
                  >
                    {t(currentSlide.title)}
                  </motion.h3>
                ) : null}
                {currentSlide.description ? (
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-xl text-white/90 mb-6"
                  >
                    {t(currentSlide.description)}
                  </motion.p>
                ) : null}
                {currentSlide.buttonText && currentSlide.buttonLink ? (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link href={currentSlide.buttonLink} className="btn-primary">
                      {t(currentSlide.buttonText)}
                    </Link>
                  </motion.div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {data.showArrows && totalSlides > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots */}
        {data.showDots && totalSlides > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {validSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
