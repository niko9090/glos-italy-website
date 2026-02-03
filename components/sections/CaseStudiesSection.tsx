// Case Studies Section Component - Showcase of client success stories
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Building2, TrendingUp, Users, Award } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import { getSpacingClasses } from '@/lib/utils/spacing'
import RichText from '@/components/RichText'

interface StatItem {
  _key: string
  label?: unknown
  value?: string
  suffix?: string
}

interface CaseStudyItem {
  _key: string
  title?: unknown
  client?: unknown
  sector?: unknown
  sectorSlug?: { current: string }
  excerpt?: unknown
  image?: any
  logo?: any
  slug?: { current: string }
  stats?: StatItem[]
  featured?: boolean
  testimonialQuote?: unknown
  testimonialAuthor?: unknown
}

interface CaseStudiesSectionProps {
  data: {
    // Content
    eyebrow?: unknown
    title?: unknown
    subtitle?: unknown
    description?: unknown
    items?: CaseStudyItem[]
    // Layout
    layout?: 'cards' | 'horizontal' | 'featured' | 'grid' | 'carousel'
    cardStyle?: 'minimal' | 'elevated' | 'glass' | 'bordered' | 'image-overlay'
    showStats?: boolean
    showSector?: boolean
    showClient?: boolean
    showTestimonial?: boolean
    textAlign?: 'left' | 'center' | 'right'
    // Style
    backgroundColor?: 'white' | 'gray-light' | 'gray' | 'primary' | 'primary-light' | 'gradient-blue' | 'gradient-dark'
    textColor?: 'auto' | 'dark' | 'light'
    // Spacing
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string
    marginTop?: string
    marginBottom?: string
    // Animation
    animation?: 'none' | 'fade' | 'fade-up' | 'stagger' | 'slide'
    hoverEffect?: 'none' | 'scale' | 'lift' | 'zoom-image'
    // CTA
    showCta?: boolean
    ctaText?: unknown
    ctaLink?: string
  }
}

export default function CaseStudiesSection({ data }: CaseStudiesSectionProps) {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  // Background classes
  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    'gray-light': 'bg-gray-50',
    gray: 'bg-gray-100',
    primary: 'bg-primary',
    'primary-light': 'bg-blue-50',
    'gradient-blue': 'bg-gradient-to-br from-primary via-primary-dark to-blue-900',
    'gradient-dark': 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
  }

  // Text color determination
  const getTextColor = () => {
    if (data.textColor === 'dark') return 'text-gray-900'
    if (data.textColor === 'light') return 'text-white'
    const darkBgs = ['primary', 'gradient-blue', 'gradient-dark']
    return darkBgs.includes(data.backgroundColor || 'white') ? 'text-white' : 'text-gray-900'
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: data.animation === 'stagger' ? 0.15 : 0,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: data.animation === 'fade-up' || data.animation === 'stagger' ? 40 : 0,
      x: data.animation === 'slide' ? -30 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15 },
    },
  }

  // Hover animation
  const getHoverAnimation = () => {
    switch (data.hoverEffect) {
      case 'scale':
        return { scale: 1.02, transition: { duration: 0.3 } }
      case 'lift':
        return { y: -8, boxShadow: '0 25px 50px -12px rgba(0, 71, 171, 0.25)', transition: { duration: 0.3 } }
      default:
        return {}
    }
  }

  const backgroundColor = data.backgroundColor || 'white'
  const textColor = getTextColor()
  const isDarkBg = ['primary', 'gradient-blue', 'gradient-dark'].includes(backgroundColor)

  // Render case study card based on layout
  const renderCaseStudyCard = (caseStudy: CaseStudyItem, index: number) => {
    const imageUrl = isValidImage(caseStudy.image) ? safeImageUrl(caseStudy.image, 800, 500) : null
    const logoUrl = isValidImage(caseStudy.logo) ? safeImageUrl(caseStudy.logo, 200, 100) : null
    const slug = caseStudy.slug?.current
    const isHorizontal = data.layout === 'horizontal'
    const isFeatured = caseStudy.featured && data.layout === 'featured'
    const isImageOverlay = data.cardStyle === 'image-overlay'

    // Card wrapper classes
    const getCardWrapperClasses = () => {
      const base = 'group relative rounded-2xl overflow-hidden transition-all duration-300'

      if (isImageOverlay) {
        return `${base} min-h-[400px] flex items-end`
      }

      if (isHorizontal) {
        return `${base} flex flex-col md:flex-row bg-white shadow-lg hover:shadow-2xl`
      }

      switch (data.cardStyle) {
        case 'elevated':
          return `${base} bg-white shadow-lg hover:shadow-2xl`
        case 'glass':
          return `${base} bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15`
        case 'bordered':
          return `${base} bg-white border-2 border-gray-200 hover:border-primary`
        default: // minimal
          return `${base} bg-white shadow-md hover:shadow-xl`
      }
    }

    return (
      <motion.article
        key={caseStudy._key}
        variants={itemVariants}
        whileHover={getHoverAnimation()}
        className={`
          ${getCardWrapperClasses()}
          ${isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}
        `}
      >
        {slug ? (
          <Link href={`/case-studies/${slug}`} className="block w-full h-full">
            {renderCardContent(caseStudy, imageUrl, logoUrl, isHorizontal, isImageOverlay, isFeatured)}
          </Link>
        ) : (
          renderCardContent(caseStudy, imageUrl, logoUrl, isHorizontal, isImageOverlay, isFeatured)
        )}
      </motion.article>
    )
  }

  // Card content renderer
  const renderCardContent = (
    caseStudy: CaseStudyItem,
    imageUrl: string | null,
    logoUrl: string | null,
    isHorizontal: boolean,
    isImageOverlay: boolean,
    isFeatured: boolean
  ) => {
    // Image overlay layout
    if (isImageOverlay && imageUrl) {
      return (
        <>
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt=""
              fill
              className={`object-cover transition-transform duration-500 ${
                data.hoverEffect === 'zoom-image' ? 'group-hover:scale-110' : ''
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 p-6 lg:p-8 w-full text-white">
            {/* Sector Badge */}
            {data.showSector !== false && caseStudy.sector && (
              <span className="inline-block px-3 py-1 bg-primary/80 backdrop-blur-sm rounded-full text-xs font-medium mb-3">
                {t(caseStudy.sector)}
              </span>
            )}

            {/* Title */}
            <h3 className="text-xl lg:text-2xl font-bold mb-2 group-hover:text-primary-light transition-colors">
              {t(caseStudy.title)}
            </h3>

            {/* Client */}
            {data.showClient !== false && caseStudy.client && (
              <div className="flex items-center gap-2 text-white/80 mb-3">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">{t(caseStudy.client)}</span>
              </div>
            )}

            {/* Stats Preview */}
            {data.showStats && caseStudy.stats && caseStudy.stats.length > 0 && (
              <div className="flex gap-4 mt-4">
                {caseStudy.stats.slice(0, 3).map((stat) => (
                  <div key={stat._key} className="text-center">
                    <div className="text-xl lg:text-2xl font-bold text-primary-light">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-xs text-white/60">{t(stat.label)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Arrow */}
            <div className="mt-4 flex items-center gap-2 text-primary-light font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Leggi il caso</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </>
      )
    }

    // Horizontal layout
    if (isHorizontal) {
      return (
        <>
          {/* Image */}
          {imageUrl && (
            <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto shrink-0">
              <Image
                src={imageUrl}
                alt=""
                fill
                className={`object-cover transition-transform duration-500 ${
                  data.hoverEffect === 'zoom-image' ? 'group-hover:scale-105' : ''
                }`}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                {/* Sector Badge */}
                {data.showSector !== false && caseStudy.sector && (
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-2">
                    {t(caseStudy.sector)}
                  </span>
                )}

                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-bold group-hover:text-primary transition-colors">
                  {t(caseStudy.title)}
                </h3>
              </div>

              {/* Client Logo */}
              {logoUrl && (
                <div className="relative w-16 h-8 shrink-0 opacity-60">
                  <Image src={logoUrl} alt="" fill className="object-contain" />
                </div>
              )}
            </div>

            {/* Client */}
            {data.showClient !== false && caseStudy.client && (
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">{t(caseStudy.client)}</span>
              </div>
            )}

            {/* Excerpt */}
            {caseStudy.excerpt && (
              <p className="text-gray-600 text-sm lg:text-base line-clamp-2 mb-4">
                {t(caseStudy.excerpt)}
              </p>
            )}

            {/* Stats */}
            {data.showStats && caseStudy.stats && caseStudy.stats.length > 0 && (
              <div className="flex flex-wrap gap-6 py-4 border-t border-gray-100">
                {caseStudy.stats.slice(0, 4).map((stat) => (
                  <div key={stat._key}>
                    <div className="text-lg lg:text-xl font-bold text-primary">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-xs text-gray-500">{t(stat.label)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Testimonial */}
            {data.showTestimonial && caseStudy.testimonialQuote && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <blockquote className="text-sm italic text-gray-600">
                  &ldquo;{t(caseStudy.testimonialQuote)}&rdquo;
                </blockquote>
                {caseStudy.testimonialAuthor && (
                  <cite className="text-xs text-gray-500 mt-1 block not-italic">
                    - {t(caseStudy.testimonialAuthor)}
                  </cite>
                )}
              </div>
            )}

            {/* Read more */}
            <div className="mt-4 flex items-center gap-2 text-primary font-medium text-sm">
              <span>Scopri il progetto</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </>
      )
    }

    // Default card layout
    return (
      <>
        {/* Image */}
        {imageUrl && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={imageUrl}
              alt=""
              fill
              className={`object-cover transition-transform duration-500 ${
                data.hoverEffect === 'zoom-image' ? 'group-hover:scale-105' : ''
              }`}
            />
            {/* Sector Badge Overlay */}
            {data.showSector !== false && caseStudy.sector && (
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-primary rounded-full text-xs font-medium">
                  {t(caseStudy.sector)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Client */}
          {data.showClient !== false && caseStudy.client && (
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Building2 className="w-3 h-3" />
              <span className="text-xs font-medium uppercase tracking-wide">
                {t(caseStudy.client)}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg lg:text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {t(caseStudy.title)}
          </h3>

          {/* Excerpt */}
          {caseStudy.excerpt && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {t(caseStudy.excerpt)}
            </p>
          )}

          {/* Stats Compact */}
          {data.showStats && caseStudy.stats && caseStudy.stats.length > 0 && (
            <div className="flex gap-4 py-3 border-t border-gray-100">
              {caseStudy.stats.slice(0, 3).map((stat) => (
                <div key={stat._key} className="flex-1 text-center">
                  <div className="text-base lg:text-lg font-bold text-primary">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                    {t(stat.label)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Arrow */}
          <div className="flex items-center gap-1 text-primary font-medium text-sm mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Leggi di piu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </>
    )
  }

  // Layout wrapper classes
  const getLayoutClasses = () => {
    switch (data.layout) {
      case 'horizontal':
        return 'flex flex-col gap-8'
      case 'featured':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8'
      default: // cards
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
    }
  }

  return (
    <section
      ref={sectionRef}
      className={`${getSpacingClasses(data)} ${bgClasses[backgroundColor]} ${textColor} overflow-hidden`}
    >
      <div className="container-glos">
        {/* Header */}
        {!!(data.eyebrow || data.title || data.subtitle || data.description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`mb-12 lg:mb-16 ${
              data.textAlign === 'left' ? 'text-left' : data.textAlign === 'right' ? 'text-right' : 'text-center'
            }`}
          >
            {!!data.eyebrow && (
              <p className={`text-sm font-semibold tracking-widest uppercase mb-4 ${isDarkBg ? 'text-white/80' : 'text-primary'}`}>
                {t(data.eyebrow)}
              </p>
            )}
            {!!data.title && (
              <h2 className="section-title mb-4">
                <RichText value={data.title} />
              </h2>
            )}
            {!!data.subtitle && (
              <div className="section-subtitle mb-4">
                <RichText value={data.subtitle} />
              </div>
            )}
            {!!data.description && (
              <div className="max-w-2xl mx-auto opacity-70">
                <RichText value={data.description} />
              </div>
            )}
          </motion.div>
        )}

        {/* Case Studies Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className={getLayoutClasses()}
        >
          {data.items?.map((caseStudy, index) => renderCaseStudyCard(caseStudy, index))}
        </motion.div>

        {/* CTA Button */}
        {data.showCta && !!data.ctaText && data.ctaLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              href={data.ctaLink}
              className="inline-flex items-center gap-2 btn-primary"
            >
              {t(data.ctaText)}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
