// Carousel Section Component - VERSIONE AVANZATA
'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface CarouselSlide {
  _key: string
  image: any
  video?: string
  title?: unknown
  subtitle?: unknown
  description?: unknown
  buttonText?: unknown
  buttonLink?: string
  buttonVariant?: 'primary' | 'secondary' | 'white' | 'ghost'
  secondButtonText?: unknown
  secondButtonLink?: string
  overlay?: string
  textPosition?: string
  textAlign?: string
  badge?: {
    text?: string
    color?: string
  }
}

interface CarouselSectionProps {
  data: {
    // Content
    title?: unknown
    subtitle?: unknown
    slides?: CarouselSlide[]
    // Layout
    layout?: 'fullscreen' | 'cards' | 'horizontal-cards' | 'thumbnails' | 'animated-grid' | 'stack' | 'coverflow'
    slidesPerView?: number
    slidesPerViewMobile?: number
    gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    height?: 'small' | 'medium' | 'large' | 'full' | 'ratio-16-9' | 'ratio-4-3' | 'ratio-1-1' | 'auto'
    contentPosition?: 'overlay' | 'below' | 'card'
    // Navigation
    autoplay?: boolean
    autoplaySpeed?: number
    showArrows?: boolean
    arrowStyle?: 'circle' | 'square' | 'icon-only' | 'background' | 'outside'
    showDots?: boolean
    dotsStyle?: 'dots' | 'lines' | 'numbers' | 'thumbnails' | 'progress'
    dotsPosition?: 'bottom' | 'top' | 'left' | 'right'
    loop?: boolean
    pauseOnHover?: boolean
    draggable?: boolean
    keyboard?: boolean
    // Style
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    shadow?: 'none' | 'sm' | 'md' | 'lg'
    containerPadding?: boolean
    backgroundColor?: 'transparent' | 'white' | 'gray-light' | 'gray-dark' | 'black' | 'primary'
    cardStyle?: 'flat' | 'elevated' | 'bordered' | 'glass'
    // Animation
    effect?: 'slide' | 'fade' | 'zoom' | 'flip' | 'cube' | 'cards' | 'creative'
    transitionSpeed?: number
    hoverEffect?: 'none' | 'zoom' | 'brightness' | 'overlay' | 'lift'
    parallax?: boolean
    kenBurns?: boolean
  }
}

export default function CarouselSection({ data }: CarouselSectionProps) {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState(0)

  const validSlides = data.slides?.filter(slide => isValidImage(slide.image)) || []
  const totalSlides = validSlides.length

  const goToNext = useCallback(() => {
    if (totalSlides === 0) return
    setDirection(1)
    setCurrentIndex(prev => {
      if (data.loop !== false) {
        return (prev + 1) % totalSlides
      }
      return prev < totalSlides - 1 ? prev + 1 : prev
    })
  }, [totalSlides, data.loop])

  const goToPrev = useCallback(() => {
    if (totalSlides === 0) return
    setDirection(-1)
    setCurrentIndex(prev => {
      if (data.loop !== false) {
        return prev === 0 ? totalSlides - 1 : prev - 1
      }
      return prev > 0 ? prev - 1 : prev
    })
  }, [totalSlides, data.loop])

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }, [currentIndex])

  // Autoplay
  useEffect(() => {
    if (!data.autoplay || isPaused || totalSlides <= 1) return
    const interval = setInterval(goToNext, (data.autoplaySpeed || 5) * 1000)
    return () => clearInterval(interval)
  }, [data.autoplay, data.autoplaySpeed, isPaused, goToNext, totalSlides])

  // Keyboard navigation
  useEffect(() => {
    if (!data.keyboard) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [data.keyboard, goToNext, goToPrev])

  if (validSlides.length === 0) return null

  // Height classes
  const heightClasses: Record<string, string> = {
    small: 'h-[300px]',
    medium: 'h-[500px]',
    large: 'h-[700px]',
    full: 'h-screen',
    'ratio-16-9': 'aspect-video',
    'ratio-4-3': 'aspect-[4/3]',
    'ratio-1-1': 'aspect-square',
    auto: 'h-auto min-h-[400px]',
  }

  // Overlay classes
  const overlayClasses: Record<string, string> = {
    none: '',
    light: 'bg-black/20',
    medium: 'bg-black/40',
    heavy: 'bg-black/60',
    'very-heavy': 'bg-black/80',
    'gradient-bottom': 'bg-gradient-to-t from-black/80 via-black/40 to-transparent',
    'gradient-left': 'bg-gradient-to-r from-black/80 via-black/40 to-transparent',
  }

  // Text position classes
  const textPositionClasses: Record<string, string> = {
    center: 'items-center justify-center text-center',
    left: 'items-center justify-start text-left pl-8 md:pl-16',
    right: 'items-center justify-end text-right pr-8 md:pr-16',
    'bottom-left': 'items-end justify-start text-left p-8 md:p-16',
    'bottom-center': 'items-end justify-center text-center p-8 md:p-16',
    'bottom-right': 'items-end justify-end text-right p-8 md:p-16',
  }

  // Rounded classes
  const roundedClasses: Record<string, string> = {
    none: '',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
  }

  // Shadow classes
  const shadowClasses: Record<string, string> = {
    none: '',
    sm: 'shadow-lg',
    md: 'shadow-xl',
    lg: 'shadow-2xl',
  }

  // Background classes
  const bgClasses: Record<string, string> = {
    transparent: '',
    white: 'bg-white',
    'gray-light': 'bg-gray-100',
    'gray-dark': 'bg-gray-800',
    black: 'bg-black',
    primary: 'bg-primary',
  }

  // Gap classes
  const gapClasses: Record<string, string> = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  // Arrow style classes
  const getArrowClasses = () => {
    const base = 'absolute top-1/2 -translate-y-1/2 z-10 transition-all'
    switch (data.arrowStyle) {
      case 'square':
        return `${base} p-3 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-lg`
      case 'icon-only':
        return `${base} p-2 text-white hover:text-white/80`
      case 'background':
        return `${base} p-4 bg-black/50 text-white hover:bg-black/70`
      case 'outside':
        return `${base} p-3 bg-white shadow-lg text-gray-900 hover:bg-gray-100 rounded-full`
      default: // circle
        return `${base} p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30`
    }
  }

  // Button variant classes
  const buttonVariantClasses: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors',
    white: 'bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors',
    ghost: 'text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors border border-white/30',
  }

  // Badge color classes
  const badgeColorClasses: Record<string, string> = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
  }

  // Animation variants based on effect
  const getSlideVariants = () => {
    const effect = data.effect || 'slide'
    const speed = (data.transitionSpeed || 500) / 1000

    switch (effect) {
      case 'fade':
        return {
          enter: { opacity: 0 },
          center: { opacity: 1, transition: { duration: speed } },
          exit: { opacity: 0, transition: { duration: speed } },
        }
      case 'zoom':
        return {
          enter: { opacity: 0, scale: 1.2 },
          center: { opacity: 1, scale: 1, transition: { duration: speed } },
          exit: { opacity: 0, scale: 0.8, transition: { duration: speed } },
        }
      case 'flip':
        return {
          enter: { opacity: 0, rotateY: direction > 0 ? 90 : -90 },
          center: { opacity: 1, rotateY: 0, transition: { duration: speed } },
          exit: { opacity: 0, rotateY: direction > 0 ? -90 : 90, transition: { duration: speed } },
        }
      case 'cube':
        return {
          enter: { opacity: 0, rotateY: direction > 0 ? 90 : -90, z: -500 },
          center: { opacity: 1, rotateY: 0, z: 0, transition: { duration: speed } },
          exit: { opacity: 0, rotateY: direction > 0 ? -90 : 90, z: -500, transition: { duration: speed } },
        }
      default: // slide
        return {
          enter: { opacity: 0, x: direction > 0 ? 300 : -300 },
          center: { opacity: 1, x: 0, transition: { duration: speed } },
          exit: { opacity: 0, x: direction > 0 ? -300 : 300, transition: { duration: speed } },
        }
    }
  }

  const currentSlide = validSlides[currentIndex]
  const layout = data.layout || 'fullscreen'
  const heightClass = heightClasses[data.height || 'large']
  const slideVariants = getSlideVariants()

  return (
    <section className={`relative overflow-hidden ${bgClasses[data.backgroundColor || 'transparent']}`}>
      {/* Section Header */}
      {!!(data.title || data.subtitle) && (
        <div className="container-glos py-8 text-center">
          {!!data.title && (
            <h2 className="section-title mb-4">
              <RichText value={data.title} />
            </h2>
          )}
          {!!data.subtitle && (
            <div className="section-subtitle">
              <RichText value={data.subtitle} />
            </div>
          )}
        </div>
      )}

      {/* Carousel Container */}
      <div
        className={`relative ${heightClass} ${
          data.containerPadding ? 'mx-4 md:mx-8' : ''
        } ${roundedClasses[data.rounded || 'none']} ${shadowClasses[data.shadow || 'none']} overflow-hidden`}
        onMouseEnter={() => data.pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => data.pauseOnHover && setIsPaused(false)}
      >
        {/* Slides */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Background Image with Ken Burns */}
            <div className={`absolute inset-0 ${data.kenBurns ? 'animate-ken-burns' : ''}`}>
              <Image
                src={safeImageUrl(currentSlide.image, 1920, 1080)!}
                alt=""
                fill
                className={`object-cover ${data.hoverEffect?.includes('zoom') ? 'transition-transform duration-700 hover:scale-110' : ''}`}
                priority={currentIndex === 0}
              />
            </div>

            {/* Overlay */}
            <div className={`absolute inset-0 ${overlayClasses[currentSlide.overlay || 'medium']}`} />

            {/* Content */}
            <div className={`absolute inset-0 flex ${textPositionClasses[currentSlide.textPosition || 'center']}`}>
              <div className="max-w-3xl px-4">
                {/* Badge */}
                {!!currentSlide.badge?.text && (
                  <motion.span
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`inline-block px-4 py-1 rounded-full text-white text-sm font-semibold mb-4 ${
                      badgeColorClasses[currentSlide.badge.color || 'blue']
                    }`}
                  >
                    {String(currentSlide.badge.text)}
                  </motion.span>
                )}

                {/* Subtitle */}
                {!!currentSlide.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-sm md:text-base font-semibold tracking-widest uppercase text-white/80 mb-3"
                  >
                    {t(currentSlide.subtitle)}
                  </motion.p>
                )}

                {/* Title */}
                {!!currentSlide.title && (
                  <motion.h3
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-5xl font-bold text-white mb-4"
                  >
                    {t(currentSlide.title)}
                  </motion.h3>
                )}

                {/* Description */}
                {!!currentSlide.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-xl text-white/90 mb-6"
                  >
                    {t(currentSlide.description)}
                  </motion.p>
                )}

                {/* Buttons */}
                {!!(currentSlide.buttonText || currentSlide.secondButtonText) && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4 justify-center md:justify-start"
                  >
                    {!!currentSlide.buttonText && currentSlide.buttonLink && (
                      <Link
                        href={currentSlide.buttonLink}
                        className={buttonVariantClasses[currentSlide.buttonVariant || 'primary']}
                      >
                        {t(currentSlide.buttonText)}
                      </Link>
                    )}
                    {!!currentSlide.secondButtonText && currentSlide.secondButtonLink && (
                      <Link
                        href={currentSlide.secondButtonLink}
                        className={buttonVariantClasses['ghost']}
                      >
                        {t(currentSlide.secondButtonText)}
                      </Link>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {data.showArrows !== false && totalSlides > 1 && (
          <>
            <button
              onClick={goToPrev}
              className={`${getArrowClasses()} ${data.arrowStyle?.includes('outside') ? '-left-12' : 'left-4'}`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className={`${getArrowClasses()} ${data.arrowStyle?.includes('outside') ? '-right-12' : 'right-4'}`}
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Dots/Indicators */}
        {data.showDots !== false && totalSlides > 1 && (
          <div className={`absolute z-10 flex ${
            data.dotsPosition?.includes('top') ? 'top-4 left-1/2 -translate-x-1/2' :
            data.dotsPosition?.includes('left') ? 'left-4 top-1/2 -translate-y-1/2 flex-col' :
            data.dotsPosition?.includes('right') ? 'right-4 top-1/2 -translate-y-1/2 flex-col' :
            'bottom-4 left-1/2 -translate-x-1/2'
          } gap-2`}>
            {data.dotsStyle?.includes('progress') ? (
              // Progress bar
              <div className="w-32 h-1 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ) : data.dotsStyle?.includes('numbers') ? (
              // Numbers
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                {currentIndex + 1} / {totalSlides}
              </div>
            ) : data.dotsStyle?.includes('lines') ? (
              // Lines
              validSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-1 transition-all ${
                    idx === currentIndex ? 'w-8 bg-white' : 'w-4 bg-white/50 hover:bg-white/70'
                  } rounded-full`}
                />
              ))
            ) : data.dotsStyle?.includes('thumbnails') ? (
              // Thumbnails
              <div className="flex gap-2 p-2 bg-black/30 backdrop-blur-sm rounded-lg">
                {validSlides.slice(0, 5).map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`relative w-12 h-8 rounded overflow-hidden transition-all ${
                      idx === currentIndex ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={safeImageUrl(slide.image, 80, 60)!}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
                {validSlides.length > 5 && (
                  <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center text-white text-xs">
                    +{validSlides.length - 5}
                  </div>
                )}
              </div>
            ) : (
              // Default dots
              validSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 h-3 bg-white' : 'w-3 h-3 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Ken Burns animation style */}
      <style jsx global>{`
        @keyframes ken-burns {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-1%, -1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .animate-ken-burns {
          animation: ken-burns 20s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
