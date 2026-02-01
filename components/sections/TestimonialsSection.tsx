// Testimonials Section Component - VERSIONE AVANZATA
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, Play, ExternalLink, Calendar, Building2 } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface TestimonialItem {
  _key: string
  quote?: unknown
  author?: string
  role?: string
  company?: string
  companyLogo?: any
  avatar?: any
  rating?: number
  featured?: boolean
  date?: string
  source?: string
  sourceUrl?: string
  videoUrl?: string
}

interface TestimonialsSectionProps {
  data: {
    // Content
    eyebrow?: unknown
    title?: unknown
    subtitle?: unknown
    description?: unknown
    // Testimonials
    testimonials?: TestimonialItem[]
    // Layout
    layout?: 'carousel' | 'grid-2' | 'grid-3' | 'list' | 'masonry' | 'stacked' | 'slider-thumb' | 'featured-list' | 'marquee' | 'bubble'
    itemsPerView?: number
    showRating?: boolean
    showAvatar?: boolean
    showCompany?: boolean
    showDate?: boolean
    showSource?: boolean
    avatarPosition?: 'top' | 'bottom' | 'left' | 'right'
    avatarSize?: 'sm' | 'md' | 'lg'
    maxQuoteLength?: number
    // Carousel options
    autoplay?: boolean
    autoplaySpeed?: number
    showArrows?: boolean
    showDots?: boolean
    loop?: boolean
    // Style
    cardStyle?: 'minimal' | 'shadow' | 'border' | 'glass' | 'colored' | 'gradient' | 'elevated'
    quoteStyle?: 'normal' | 'quotes' | 'italic' | 'icon' | 'highlight' | 'left-border'
    quoteSize?: 'sm' | 'md' | 'lg' | 'xl'
    ratingStyle?: 'yellow' | 'blue' | 'colored' | 'numeric'
    backgroundColor?: 'white' | 'gray-light' | 'gray' | 'primary' | 'primary-light' | 'black' | 'gradient' | 'pattern'
    textColor?: 'auto' | 'dark' | 'light'
    accentColor?: 'primary' | 'green' | 'purple' | 'orange' | 'red' | 'gold'
    paddingY?: 'sm' | 'md' | 'lg' | 'xl'
    // Animation
    animation?: 'none' | 'fade' | 'fade-up' | 'stagger' | 'zoom' | 'slide' | 'flip'
    hoverEffect?: 'none' | 'scale' | 'lift' | 'glow' | 'tilt'
    transitionEffect?: 'slide' | 'fade' | 'zoom' | 'flip' | 'cards' | 'creative'
    // Aggregate rating
    showAggregateRating?: boolean
    aggregateRatingTitle?: unknown
    totalReviews?: number
    // CTA
    showCta?: boolean
    ctaText?: unknown
    ctaLink?: string
  }
}

// Animated star component
function AnimatedStar({ filled, delay, style = 'yellow' }: { filled: boolean; delay: number; style?: string }) {
  const colorClasses: Record<string, { filled: string; empty: string }> = {
    yellow: { filled: 'text-yellow-400 fill-yellow-400', empty: 'text-gray-300' },
    blue: { filled: 'text-primary fill-primary', empty: 'text-gray-300' },
    colored: { filled: 'text-orange-400 fill-orange-400', empty: 'text-gray-300' },
    numeric: { filled: 'text-yellow-400 fill-yellow-400', empty: 'text-gray-300' },
  }

  const colors = colorClasses[style] || colorClasses.yellow

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 12, delay }}
    >
      <Star className={`w-5 h-5 ${filled ? colors.filled : colors.empty}`} />
    </motion.div>
  )
}

// Rating component
function RatingDisplay({ rating, style = 'yellow' }: { rating: number; style?: string }) {
  if (style === 'numeric') {
    return (
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        <span className="font-semibold">{rating}/5</span>
      </div>
    )
  }

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <AnimatedStar key={i} filled={i < rating} delay={0.1 + i * 0.05} style={style} />
      ))}
    </div>
  )
}

export default function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(data.autoplay !== false)
  const containerRef = useRef<HTMLDivElement>(null)

  const testimonials = data.testimonials || []
  const layout = data.layout || 'carousel'
  const showRating = data.showRating !== false
  const showAvatar = data.showAvatar !== false
  const showCompany = data.showCompany !== false
  const showDate = data.showDate === true
  const showSource = data.showSource === true
  const autoplaySpeed = data.autoplaySpeed || 5000
  const showArrows = data.showArrows !== false
  const showDots = data.showDots !== false
  const loop = data.loop !== false

  // Navigation
  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= testimonials.length - 1) {
        return loop ? 0 : prev
      }
      return prev + 1
    })
  }, [testimonials.length, loop])

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev <= 0) {
        return loop ? testimonials.length - 1 : prev
      }
      return prev - 1
    })
  }, [testimonials.length, loop])

  // Autoplay
  useEffect(() => {
    if (!isPlaying || !['carousel', 'slider-thumb'].includes(layout)) return

    const interval = setInterval(nextSlide, autoplaySpeed)
    return () => clearInterval(interval)
  }, [isPlaying, layout, autoplaySpeed, nextSlide])

  // Background classes
  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    'gray-light': 'bg-gray-50',
    gray: 'bg-gray-100',
    primary: 'bg-primary',
    'primary-light': 'bg-primary/10',
    black: 'bg-gray-900',
    gradient: 'bg-gradient-to-br from-primary via-primary-dark to-blue-900',
    pattern: 'bg-gray-50',
  }

  // Text color based on background
  const getTextColor = () => {
    if (data.textColor?.includes('dark')) return 'text-gray-900'
    if (data.textColor?.includes('light')) return 'text-white'
    const darkBgs = ['primary', 'black', 'gradient']
    return darkBgs.some(bg => (data.backgroundColor || 'gray-light').includes(bg)) ? 'text-white' : 'text-gray-900'
  }

  // Accent color classes
  const accentClasses: Record<string, string> = {
    primary: 'text-primary',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
    gold: 'text-yellow-500',
  }

  // Padding classes
  const paddingClasses: Record<string, string> = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-24 md:py-32',
  }

  // Card style classes
  const cardStyleClasses: Record<string, string> = {
    minimal: 'p-6',
    shadow: 'bg-white rounded-2xl p-8 shadow-lg',
    border: 'border-2 border-gray-200 rounded-2xl p-8',
    glass: 'bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20',
    colored: 'bg-primary/5 rounded-2xl p-8',
    gradient: 'bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg',
    elevated: 'bg-white rounded-2xl p-8 shadow-xl ring-1 ring-black/5',
  }

  // Quote style classes
  const quoteStyleClasses: Record<string, string> = {
    normal: '',
    quotes: 'relative',
    italic: 'italic',
    icon: '',
    highlight: 'bg-yellow-100/50 px-4 py-2 rounded-lg',
    'left-border': 'border-l-4 border-primary pl-6',
  }

  // Quote size classes
  const quoteSizeClasses: Record<string, string> = {
    sm: 'text-sm md:text-base',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
    xl: 'text-xl md:text-2xl',
  }

  // Avatar size classes
  const avatarSizeClasses: Record<string, { container: string; size: number }> = {
    sm: { container: 'w-10 h-10', size: 40 },
    md: { container: 'w-14 h-14', size: 56 },
    lg: { container: 'w-20 h-20', size: 80 },
  }

  // Hover effect classes
  const hoverClasses: Record<string, string> = {
    none: '',
    scale: 'hover:scale-105 transition-transform duration-300',
    lift: 'hover:-translate-y-2 hover:shadow-2xl transition-all duration-300',
    glow: 'hover:shadow-xl hover:shadow-primary/20 transition-all duration-300',
    tilt: 'hover:rotate-1 transition-transform duration-300',
  }

  // Animation variants
  const getContainerVariants = () => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: data.animation?.includes('stagger') ? 0.15 : 0,
        delayChildren: 0.1,
      },
    },
  })

  const getItemVariants = () => {
    switch (data.animation) {
      case 'none':
        return { hidden: {}, visible: {} }
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } },
        }
      case 'zoom':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        }
      case 'slide':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        }
      case 'flip':
        return {
          hidden: { opacity: 0, rotateY: 90 },
          visible: { opacity: 1, rotateY: 0, transition: { duration: 0.6 } },
        }
      default: // fade-up or stagger
        return {
          hidden: { opacity: 0, y: 30, scale: 0.95 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 100, damping: 15 },
          },
        }
    }
  }

  // Calculate aggregate rating
  const aggregateRating = testimonials.length > 0
    ? testimonials.reduce((sum, testimonialItem) => sum + (testimonialItem.rating || 5), 0) / testimonials.length
    : 5

  // Render testimonial card
  const renderTestimonialCard = (testimonial: TestimonialItem, index: number, isFeatured = false) => {
    const avatarPos = data.avatarPosition || 'bottom'
    const avatarSizeConfig = avatarSizeClasses[data.avatarSize || 'md']
    const accentColor = accentClasses[data.accentColor || 'primary']

    const avatarElement = showAvatar && isValidImage(testimonial.avatar) && (
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`relative ${avatarSizeConfig.container} rounded-full overflow-hidden ring-2 ring-white shadow-lg flex-shrink-0`}
      >
        <Image
          src={safeImageUrl(testimonial.avatar, avatarSizeConfig.size * 2, avatarSizeConfig.size * 2)!}
          alt={testimonial.author || ''}
          fill
          className="object-cover"
        />
      </motion.div>
    )

    const authorInfo = (
      <div className={avatarPos?.includes('left') || avatarPos?.includes('right') ? '' : 'text-center'}>
        <p className="font-semibold">{testimonial.author}</p>
        {(showCompany && (testimonial.role || testimonial.company)) && (
          <p className="text-sm opacity-70">
            {testimonial.role}
            {testimonial.role && testimonial.company && ' @ '}
            {testimonial.company}
          </p>
        )}
        {showDate && testimonial.date && (
          <p className="text-xs opacity-50 flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {new Date(testimonial.date).toLocaleDateString('it-IT')}
          </p>
        )}
        {showSource && testimonial.source && (
          <p className="text-xs opacity-50 flex items-center gap-1 mt-1">
            <Building2 className="w-3 h-3" />
            {testimonial.sourceUrl ? (
              <a href={testimonial.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                {testimonial.source}
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : testimonial.source}
          </p>
        )}
      </div>
    )

    return (
      <motion.div
        key={testimonial._key}
        variants={getItemVariants()}
        className={`relative group ${cardStyleClasses[data.cardStyle || 'shadow']} ${hoverClasses[data.hoverEffect || 'lift']} ${isFeatured ? 'md:col-span-2' : ''}`}
      >
        {/* Quote icon for 'icon' style */}
        {data.quoteStyle?.includes('icon') && (
          <Quote className={`absolute top-4 right-4 w-8 h-8 ${accentColor} opacity-20`} />
        )}

        {/* Video indicator */}
        {testimonial.videoUrl && (
          <a
            href={testimonial.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <Play className="w-4 h-4 ml-0.5" />
          </a>
        )}

        {/* Avatar top position */}
        {avatarPos?.includes('top') && (
          <div className="flex flex-col items-center mb-6">
            {avatarElement}
            <div className="mt-4">{authorInfo}</div>
          </div>
        )}

        {/* Avatar left position */}
        {avatarPos?.includes('left') && (
          <div className="flex gap-4 items-start mb-4">
            {avatarElement}
            {authorInfo}
          </div>
        )}

        {/* Rating */}
        {showRating && testimonial.rating && (
          <div className={`mb-4 ${avatarPos?.includes('top') ? 'flex justify-center' : ''}`}>
            <RatingDisplay rating={testimonial.rating} style={data.ratingStyle} />
          </div>
        )}

        {/* Quote */}
        <blockquote className={`${quoteStyleClasses[data.quoteStyle || 'quotes']} ${quoteSizeClasses[data.quoteSize || 'md']} leading-relaxed mb-6`}>
          {data.quoteStyle?.includes('quotes') && (
            <span className={`absolute -top-2 -left-2 text-6xl ${accentColor} opacity-20 font-serif`}>"</span>
          )}
          <span className={data.quoteStyle?.includes('italic') ? 'italic' : ''}>
            "{t(testimonial.quote)}"
          </span>
        </blockquote>

        {/* Avatar right position */}
        {avatarPos?.includes('right') && (
          <div className="flex gap-4 items-center justify-end">
            {authorInfo}
            {avatarElement}
          </div>
        )}

        {/* Avatar bottom position (default) */}
        {avatarPos?.includes('bottom') && (
          <div className="flex items-center gap-4">
            {avatarElement}
            {authorInfo}
          </div>
        )}

        {/* Company logo */}
        {testimonial.companyLogo && isValidImage(testimonial.companyLogo) && (
          <div className="mt-4 opacity-50">
            <Image
              src={safeImageUrl(testimonial.companyLogo, 120, 40)!}
              alt={testimonial.company || ''}
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        )}

        {/* Decorative line */}
        <div className={`absolute bottom-0 left-8 right-8 h-1 ${accentColor.replace('text-', 'bg-')} opacity-0 group-hover:opacity-30 rounded-full transition-opacity duration-500`} />
      </motion.div>
    )
  }

  // Render grid layout
  const renderGridLayout = (columns: 2 | 3) => (
    <motion.div
      variants={getContainerVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`grid gap-8 ${columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}
    >
      {testimonials.map((testimonialItem, i) => renderTestimonialCard(testimonialItem, i))}
    </motion.div>
  )

  // Render carousel layout
  const renderCarouselLayout = () => (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: data.transitionEffect?.includes('slide') ? 100 : 0, scale: data.transitionEffect?.includes('zoom') ? 0.8 : 1 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: data.transitionEffect?.includes('slide') ? -100 : 0, scale: data.transitionEffect?.includes('zoom') ? 0.8 : 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {testimonials[currentIndex] && renderTestimonialCard(testimonials[currentIndex], currentIndex)}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {showArrows && testimonials.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(data.autoplay !== false)}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(data.autoplay !== false)}
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-primary w-8' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )

  // Render list layout
  const renderListLayout = () => (
    <motion.div
      variants={getContainerVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {testimonials.map((testimonialItem, i) => renderTestimonialCard(testimonialItem, i))}
    </motion.div>
  )

  // Render masonry layout
  const renderMasonryLayout = () => (
    <motion.div
      variants={getContainerVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
    >
      {testimonials.map((testimonialItem, i) => (
        <div key={testimonialItem._key} className="break-inside-avoid">
          {renderTestimonialCard(testimonialItem, i)}
        </div>
      ))}
    </motion.div>
  )

  // Render featured-list layout
  const renderFeaturedListLayout = () => {
    const featured = testimonials.find(testimonialItem => testimonialItem.featured) || testimonials[0]
    const others = testimonials.filter(testimonialItem => testimonialItem._key !== featured?._key)

    return (
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          variants={getItemVariants()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featured && renderTestimonialCard(featured, 0, true)}
        </motion.div>
        <motion.div
          variants={getContainerVariants()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {others.slice(0, 3).map((testimonialItem, i) => renderTestimonialCard(testimonialItem, i + 1))}
        </motion.div>
      </div>
    )
  }

  // Render marquee layout
  const renderMarqueeLayout = () => (
    <div className="overflow-hidden py-4">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex gap-6"
        style={{ width: 'max-content' }}
      >
        {[...testimonials, ...testimonials].map((testimonialItem, i) => (
          <div key={`${testimonialItem._key}-${i}`} className="w-80 flex-shrink-0">
            {renderTestimonialCard(testimonialItem, i)}
          </div>
        ))}
      </motion.div>
    </div>
  )

  // Render bubble layout
  const renderBubbleLayout = () => (
    <motion.div
      variants={getContainerVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="space-y-8 max-w-3xl mx-auto"
    >
      {testimonials.map((testimonialItem, i) => (
        <motion.div
          key={testimonialItem._key}
          variants={getItemVariants()}
          className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        >
          <div className={`max-w-lg ${i % 2 === 0 ? 'mr-12' : 'ml-12'}`}>
            <div className={`relative p-6 rounded-2xl ${
              i % 2 === 0
                ? 'bg-primary text-white rounded-bl-none'
                : 'bg-gray-100 text-gray-900 rounded-br-none'
            }`}>
              <p className={quoteSizeClasses[data.quoteSize || 'md']}>"{t(testimonialItem.quote)}"</p>
              <div className={`absolute bottom-0 ${i % 2 === 0 ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} w-0 h-0 border-t-[20px] ${i % 2 === 0 ? 'border-t-primary' : 'border-t-gray-100'} ${i % 2 === 0 ? 'border-r-[20px] border-r-transparent' : 'border-l-[20px] border-l-transparent'}`} />
            </div>
            <div className={`flex items-center gap-3 mt-4 ${i % 2 === 0 ? '' : 'justify-end'}`}>
              {showAvatar && isValidImage(testimonialItem.avatar) && (
                <Image
                  src={safeImageUrl(testimonialItem.avatar, 48, 48)!}
                  alt={testimonialItem.author || ''}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-sm">{testimonialItem.author}</p>
                {showCompany && testimonialItem.company && <p className="text-xs opacity-70">{testimonialItem.company}</p>}
              </div>
              {showRating && testimonialItem.rating && (
                <div className="ml-2">
                  <RatingDisplay rating={testimonialItem.rating} style={data.ratingStyle} />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )

  // Render stacked layout
  const renderStackedLayout = () => (
    <div className="relative max-w-xl mx-auto h-96">
      {testimonials.slice(0, 3).map((testimonialItem, i) => (
        <motion.div
          key={testimonialItem._key}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.2 }}
          className="absolute w-full"
          style={{
            top: `${i * 20}px`,
            zIndex: 3 - i,
            transform: `scale(${1 - i * 0.05})`,
          }}
        >
          {renderTestimonialCard(testimonialItem, i)}
        </motion.div>
      ))}
    </div>
  )

  // Render slider with thumbnails
  const renderSliderThumbLayout = () => (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {renderCarouselLayout()}
      </div>
      <div className="space-y-4">
        {testimonials.map((testimonialItem, i) => (
          <button
            key={testimonialItem._key}
            onClick={() => setCurrentIndex(i)}
            className={`w-full text-left p-4 rounded-lg transition-all ${
              i === currentIndex
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {showAvatar && isValidImage(testimonialItem.avatar) && (
                <Image
                  src={safeImageUrl(testimonialItem.avatar, 48, 48)!}
                  alt={testimonialItem.author || ''}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-sm">{testimonialItem.author}</p>
                {testimonialItem.company && <p className="text-xs opacity-70">{testimonialItem.company}</p>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  // Render layout based on type
  const renderLayout = () => {
    switch (layout) {
      case 'grid-2':
        return renderGridLayout(2)
      case 'grid-3':
        return renderGridLayout(3)
      case 'list':
        return renderListLayout()
      case 'masonry':
        return renderMasonryLayout()
      case 'stacked':
        return renderStackedLayout()
      case 'slider-thumb':
        return renderSliderThumbLayout()
      case 'featured-list':
        return renderFeaturedListLayout()
      case 'marquee':
        return renderMarqueeLayout()
      case 'bubble':
        return renderBubbleLayout()
      default:
        return renderCarouselLayout()
    }
  }

  if (testimonials.length === 0) {
    return null
  }

  const textColor = getTextColor()

  return (
    <section
      ref={containerRef}
      className={`relative overflow-hidden ${paddingClasses[data.paddingY || 'lg']} ${bgClasses[data.backgroundColor || 'gray-light']} ${textColor}`}
    >
      {/* Pattern background */}
      {data.backgroundColor?.includes('pattern') && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />
        </div>
      )}

      <div className="container-glos relative z-10">
        {/* Header */}
        {!!(data.eyebrow || data.title || data.subtitle || data.description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            {!!data.eyebrow && (
              <p className="text-sm font-semibold tracking-widest uppercase mb-4 opacity-70">
                {t(data.eyebrow)}
              </p>
            )}
            {!!data.title && (
              <h2 className="section-title mb-4">
                <RichText value={data.title} />
              </h2>
            )}
            {!!data.subtitle && (
              <p className="section-subtitle mx-auto mb-4">{t(data.subtitle)}</p>
            )}
            {!!data.description && (
              <div className="max-w-2xl mx-auto opacity-80">
                <RichText value={data.description} />
              </div>
            )}
          </motion.div>
        )}

        {/* Aggregate Rating */}
        {!!data.showAggregateRating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex flex-col items-center gap-2 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              {!!data.aggregateRatingTitle && (
                <p className="text-sm opacity-70">{t(data.aggregateRatingTitle)}</p>
              )}
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold">{aggregateRating.toFixed(1)}</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < Math.round(aggregateRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              {!!data.totalReviews && (
                <p className="text-sm opacity-70">su {data.totalReviews} recensioni</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Testimonials */}
        {renderLayout()}

        {/* CTA */}
        {data.showCta && !!data.ctaText && data.ctaLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href={data.ctaLink}
              className="btn-primary inline-flex items-center gap-2"
            >
              {t(data.ctaText)}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
