// Section-Specific Skeleton Components for GLOS Italy
// Loading states for different page sections

'use client'

import { cn } from '@/lib/utils'
import {
  Skeleton,
  SkeletonTitle,
  SkeletonText,
  SkeletonParagraph,
  SkeletonImage,
  SkeletonCard,
  SkeletonIconBox,
  SkeletonStat,
  SkeletonButton,
  SkeletonAvatar,
} from '@/components/ui/Skeleton'

// ============================================
// HERO SKELETON
// ============================================

interface HeroSkeletonProps {
  /** Hero layout style */
  variant?: 'full' | 'split' | 'centered'
  /** Show scroll indicator */
  showScrollIndicator?: boolean
  /** Background color */
  background?: 'dark' | 'gradient' | 'light'
  className?: string
}

/**
 * Hero section loading skeleton
 * Mimics the HeroSection component layout
 */
export function HeroSkeleton({
  variant = 'full',
  showScrollIndicator = true,
  background = 'gradient',
  className
}: HeroSkeletonProps) {
  const bgClasses = {
    dark: 'bg-gray-900',
    gradient: 'bg-gradient-to-br from-primary via-primary-dark to-gray-900',
    light: 'bg-gray-100',
  }

  const textColorClass = background === 'light' ? '' : 'opacity-60'

  return (
    <section
      className={cn(
        'relative min-h-[85vh] flex items-center overflow-hidden',
        bgClasses[background],
        className
      )}
      aria-label="Loading hero section"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="container-glos relative z-10 py-20">
        <div className={cn(
          'max-w-3xl',
          variant === 'centered' && 'mx-auto text-center',
          variant === 'split' && 'lg:w-1/2'
        )}>
          {/* Eyebrow */}
          <Skeleton className={cn('h-4 w-32 rounded mb-4', textColorClass)} />

          {/* Title */}
          <Skeleton className={cn('h-12 md:h-14 lg:h-16 w-full rounded-lg mb-4', textColorClass)} />
          <Skeleton className={cn('h-12 md:h-14 lg:h-16 w-3/4 rounded-lg mb-6', textColorClass)} />

          {/* Subtitle */}
          <Skeleton className={cn('h-6 w-full rounded mb-2', textColorClass)} />
          <Skeleton className={cn('h-6 w-5/6 rounded mb-10', textColorClass)} />

          {/* Buttons */}
          <div className={cn(
            'flex gap-4',
            variant === 'centered' && 'justify-center'
          )}>
            <Skeleton className="h-12 w-40 rounded-lg" />
            <Skeleton className="h-12 w-36 rounded-lg opacity-50" />
          </div>
        </div>

        {/* Split layout image placeholder */}
        {variant === 'split' && (
          <div className="hidden lg:block lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-1/2 lg:px-8">
            <Skeleton className="aspect-[4/3] rounded-2xl opacity-30" />
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <Skeleton className={cn('h-3 w-16 rounded mb-2', textColorClass)} />
          <Skeleton className={cn('h-8 w-8 rounded-full', textColorClass)} />
        </div>
      )}
    </section>
  )
}

// ============================================
// GRID SKELETON
// ============================================

interface GridSkeletonProps {
  /** Number of items to show */
  items?: number
  /** Number of columns */
  columns?: 2 | 3 | 4
  /** Card variant */
  cardVariant?: 'product' | 'feature' | 'minimal' | 'icon-box'
  /** Show section header */
  showHeader?: boolean
  /** Background color */
  background?: 'white' | 'gray' | 'primary-light'
  className?: string
}

const columnClasses = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

/**
 * Grid section loading skeleton
 * For products, features, cards, and other grid layouts
 */
export function GridSkeleton({
  items = 6,
  columns = 3,
  cardVariant = 'product',
  showHeader = true,
  background = 'white',
  className
}: GridSkeletonProps) {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    'primary-light': 'bg-blue-50',
  }

  const renderCard = (index: number) => {
    switch (cardVariant) {
      case 'feature':
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <SkeletonIconBox iconSize="lg" showDescription={true} />
          </div>
        )

      case 'icon-box':
        return (
          <div key={index} className="p-4">
            <SkeletonIconBox iconSize="md" showDescription={true} align="center" />
          </div>
        )

      case 'minimal':
        return (
          <div key={index} className="p-4">
            <SkeletonText width="w-24" size="sm" className="mb-2" />
            <SkeletonTitle size="sm" width="w-3/4" className="mb-3" />
            <SkeletonParagraph lines={2} gap="sm" />
          </div>
        )

      case 'product':
      default:
        return (
          <SkeletonCard
            key={index}
            showImage={true}
            imageAspectRatio="4/3"
            textLines={2}
            showButton={false}
          />
        )
    }
  }

  return (
    <section
      className={cn('py-16 md:py-24', bgClasses[background], className)}
      aria-label="Loading grid section"
    >
      <div className="container-glos">
        {/* Header */}
        {showHeader && (
          <div className="text-center mb-12">
            <SkeletonTitle size="lg" width="w-1/2" className="mx-auto mb-4" />
            <SkeletonParagraph
              lines={2}
              gap="sm"
              lastLineWidth="w-3/4"
              className="max-w-2xl mx-auto"
            />
          </div>
        )}

        {/* Grid */}
        <div className={cn('grid gap-8', columnClasses[columns])}>
          {Array.from({ length: items }).map((_, index) => renderCard(index))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// TEXT SECTION SKELETON
// ============================================

interface TextSkeletonProps {
  /** Content width */
  width?: 'narrow' | 'normal' | 'wide'
  /** Number of paragraphs */
  paragraphs?: number
  /** Lines per paragraph */
  linesPerParagraph?: number
  /** Show title */
  showTitle?: boolean
  /** Text alignment */
  align?: 'left' | 'center'
  /** Background color */
  background?: 'white' | 'gray' | 'cream'
  className?: string
}

const textWidthClasses = {
  narrow: 'max-w-2xl',
  normal: 'max-w-4xl',
  wide: 'max-w-6xl',
}

/**
 * Rich text section loading skeleton
 * For content-heavy text sections
 */
export function TextSkeleton({
  width = 'normal',
  paragraphs = 3,
  linesPerParagraph = 4,
  showTitle = true,
  align = 'left',
  background = 'white',
  className
}: TextSkeletonProps) {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    cream: 'bg-amber-50',
  }

  return (
    <section
      className={cn('py-16 md:py-24', bgClasses[background], className)}
      aria-label="Loading text section"
    >
      <div className="container-glos">
        <div className={cn(
          textWidthClasses[width],
          'mx-auto',
          align === 'center' && 'text-center'
        )}>
          {/* Title */}
          {showTitle && (
            <SkeletonTitle
              size="lg"
              width={align === 'center' ? 'w-1/2 mx-auto' : 'w-2/3'}
              className="mb-8"
            />
          )}

          {/* Paragraphs */}
          <div className="space-y-6">
            {Array.from({ length: paragraphs }).map((_, index) => (
              <SkeletonParagraph
                key={index}
                lines={linesPerParagraph}
                gap="md"
                lastLineWidth={index === paragraphs - 1 ? 'w-1/2' : 'w-5/6'}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// STATS SKELETON
// ============================================

interface StatsSkeletonProps {
  /** Number of stats */
  items?: number
  /** Background style */
  background?: 'white' | 'gray' | 'primary' | 'gradient'
  className?: string
}

/**
 * Stats/Counter section loading skeleton
 */
export function StatsSkeleton({
  items = 4,
  background = 'primary',
  className
}: StatsSkeletonProps) {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-primary',
    gradient: 'bg-gradient-to-r from-primary to-primary-dark',
  }

  const isDark = background === 'primary' || background === 'gradient'

  return (
    <section
      className={cn('py-12 md:py-16', bgClasses[background], className)}
      aria-label="Loading stats section"
    >
      <div className="container-glos">
        <div className={cn(
          'grid gap-8',
          items <= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'
        )}>
          {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="text-center">
              <Skeleton className={cn(
                'h-12 w-24 mx-auto rounded-lg mb-2',
                isDark && 'opacity-40'
              )} />
              <Skeleton className={cn(
                'h-4 w-32 mx-auto rounded',
                isDark && 'opacity-30'
              )} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// TESTIMONIALS SKELETON
// ============================================

interface TestimonialsSkeletonProps {
  /** Number of testimonials */
  items?: number
  /** Layout variant */
  variant?: 'cards' | 'carousel' | 'featured'
  className?: string
}

/**
 * Testimonials section loading skeleton
 */
export function TestimonialsSkeleton({
  items = 3,
  variant = 'cards',
  className
}: TestimonialsSkeletonProps) {
  const renderTestimonial = (index: number) => (
    <div
      key={index}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8"
    >
      {/* Quote */}
      <div className="mb-6">
        <SkeletonParagraph lines={3} gap="md" />
      </div>

      {/* Author */}
      <div className="flex items-center gap-4">
        <SkeletonAvatar size="lg" />
        <div>
          <SkeletonText width="w-32" size="md" className="mb-1" />
          <SkeletonText width="w-24" size="sm" />
        </div>
      </div>

      {/* Rating stars */}
      <div className="flex gap-1 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-4 rounded" />
        ))}
      </div>
    </div>
  )

  return (
    <section
      className={cn('py-16 md:py-24 bg-gray-50', className)}
      aria-label="Loading testimonials section"
    >
      <div className="container-glos">
        {/* Header */}
        <div className="text-center mb-12">
          <SkeletonTitle size="lg" width="w-1/3" className="mx-auto mb-4" />
          <SkeletonText width="w-1/2" className="mx-auto" />
        </div>

        {/* Testimonials grid */}
        {variant === 'featured' ? (
          <div className="max-w-4xl mx-auto">
            {renderTestimonial(0)}
          </div>
        ) : (
          <div className={cn(
            'grid gap-8',
            items <= 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          )}>
            {Array.from({ length: items }).map((_, index) => renderTestimonial(index))}
          </div>
        )}
      </div>
    </section>
  )
}

// ============================================
// GALLERY SKELETON
// ============================================

interface GallerySkeletonProps {
  /** Number of images */
  items?: number
  /** Layout variant */
  variant?: 'grid' | 'masonry' | 'carousel'
  className?: string
}

/**
 * Gallery section loading skeleton
 */
export function GallerySkeleton({
  items = 6,
  variant = 'grid',
  className
}: GallerySkeletonProps) {
  return (
    <section
      className={cn('py-16 md:py-24 bg-white', className)}
      aria-label="Loading gallery section"
    >
      <div className="container-glos">
        {/* Header */}
        <div className="text-center mb-12">
          <SkeletonTitle size="lg" width="w-1/4" className="mx-auto mb-4" />
          <SkeletonText width="w-1/3" className="mx-auto" />
        </div>

        {/* Gallery grid */}
        <div className={cn(
          'grid gap-4',
          variant === 'masonry'
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-2 md:grid-cols-3 gap-6'
        )}>
          {Array.from({ length: items }).map((_, index) => (
            <SkeletonImage
              key={index}
              aspectRatio={variant === 'masonry' && index % 3 === 0 ? '3/2' : 'square'}
              rounded="lg"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// CTA SKELETON
// ============================================

interface CTASkeletonProps {
  /** Layout variant */
  variant?: 'simple' | 'split' | 'banner'
  /** Background style */
  background?: 'primary' | 'gradient' | 'dark'
  className?: string
}

/**
 * Call-to-action section loading skeleton
 */
export function CTASkeleton({
  variant = 'simple',
  background = 'primary',
  className
}: CTASkeletonProps) {
  const bgClasses = {
    primary: 'bg-primary',
    gradient: 'bg-gradient-to-r from-primary to-primary-dark',
    dark: 'bg-gray-900',
  }

  return (
    <section
      className={cn('py-16 md:py-20', bgClasses[background], className)}
      aria-label="Loading CTA section"
    >
      <div className="container-glos">
        <div className={cn(
          'flex flex-col items-center text-center',
          variant === 'split' && 'md:flex-row md:justify-between md:text-left'
        )}>
          {/* Content */}
          <div className={cn(
            variant === 'split' ? 'md:max-w-lg' : 'max-w-2xl'
          )}>
            <Skeleton className="h-10 w-3/4 mx-auto md:mx-0 rounded-lg mb-4 opacity-50" />
            <Skeleton className="h-5 w-full rounded mb-2 opacity-30" />
            <Skeleton className="h-5 w-4/5 rounded mb-6 opacity-30" />
          </div>

          {/* Buttons */}
          <div className={cn(
            'flex gap-4',
            variant !== 'split' && 'mt-6'
          )}>
            <Skeleton className="h-12 w-36 rounded-lg" />
            {variant !== 'simple' && (
              <Skeleton className="h-12 w-32 rounded-lg opacity-50" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// CONTACT SKELETON
// ============================================

interface ContactSkeletonProps {
  /** Show contact form */
  showForm?: boolean
  /** Show map placeholder */
  showMap?: boolean
  className?: string
}

/**
 * Contact section loading skeleton
 */
export function ContactSkeleton({
  showForm = true,
  showMap = true,
  className
}: ContactSkeletonProps) {
  return (
    <section
      className={cn('py-16 md:py-24 bg-gray-50', className)}
      aria-label="Loading contact section"
    >
      <div className="container-glos">
        {/* Header */}
        <div className="text-center mb-12">
          <SkeletonTitle size="lg" width="w-1/4" className="mx-auto mb-4" />
          <SkeletonText width="w-1/3" className="mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            {/* Contact items */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex gap-4 items-start">
                <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <SkeletonText width="w-24" size="sm" className="mb-2" />
                  <SkeletonText width="w-48" size="md" />
                </div>
              </div>
            ))}

            {/* Map */}
            {showMap && (
              <div className="mt-8">
                <SkeletonImage
                  aspectRatio="16/9"
                  rounded="xl"
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Contact form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <SkeletonTitle size="md" width="w-1/2" className="mb-6" />

              {/* Form fields */}
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-16 rounded mb-2" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 rounded mb-2" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-12 rounded mb-2" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 rounded mb-2" />
                  <Skeleton className="h-32 w-full rounded-lg" />
                </div>
                <SkeletonButton size="lg" width="w-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ============================================
// FAQ SKELETON
// ============================================

interface FAQSkeletonProps {
  /** Number of FAQ items */
  items?: number
  className?: string
}

/**
 * FAQ section loading skeleton
 */
export function FAQSkeleton({
  items = 5,
  className
}: FAQSkeletonProps) {
  return (
    <section
      className={cn('py-16 md:py-24 bg-white', className)}
      aria-label="Loading FAQ section"
    >
      <div className="container-glos">
        {/* Header */}
        <div className="text-center mb-12">
          <SkeletonTitle size="lg" width="w-1/3" className="mx-auto mb-4" />
          <SkeletonText width="w-1/2" className="mx-auto" />
        </div>

        {/* FAQ items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {Array.from({ length: items }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-5"
            >
              <div className="flex justify-between items-center">
                <SkeletonText width="w-3/4" size="md" />
                <Skeleton className="w-6 h-6 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// TEAM SKELETON
// ============================================

interface TeamSkeletonProps {
  /** Number of team members */
  items?: number
  className?: string
}

/**
 * Team section loading skeleton
 */
export function TeamSkeleton({
  items = 4,
  className
}: TeamSkeletonProps) {
  return (
    <section
      className={cn('py-16 md:py-24 bg-gray-50', className)}
      aria-label="Loading team section"
    >
      <div className="container-glos">
        {/* Header */}
        <div className="text-center mb-12">
          <SkeletonTitle size="lg" width="w-1/4" className="mx-auto mb-4" />
          <SkeletonText width="w-1/3" className="mx-auto" />
        </div>

        {/* Team grid */}
        <div className={cn(
          'grid gap-8',
          items <= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        )}>
          {Array.from({ length: items }).map((_, index) => (
            <div key={index} className="text-center">
              <SkeletonAvatar size="xl" className="mx-auto mb-4 w-32 h-32" />
              <SkeletonTitle size="sm" width="w-3/4" className="mx-auto mb-2" />
              <SkeletonText width="w-1/2" size="sm" className="mx-auto mb-3" />
              {/* Social icons */}
              <div className="flex justify-center gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="w-8 h-8 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// PAGE SKELETON (Full page)
// ============================================

interface PageSkeletonProps {
  /** Show hero section */
  showHero?: boolean
  /** Sections to show */
  sections?: ('text' | 'grid' | 'stats' | 'cta' | 'testimonials' | 'gallery' | 'contact' | 'faq')[]
  className?: string
}

/**
 * Full page loading skeleton
 * Combines multiple section skeletons
 */
export function PageSkeleton({
  showHero = true,
  sections = ['text', 'grid', 'cta'],
  className
}: PageSkeletonProps) {
  const renderSection = (section: string, index: number) => {
    switch (section) {
      case 'text':
        return <TextSkeleton key={index} />
      case 'grid':
        return <GridSkeleton key={index} />
      case 'stats':
        return <StatsSkeleton key={index} />
      case 'cta':
        return <CTASkeleton key={index} />
      case 'testimonials':
        return <TestimonialsSkeleton key={index} />
      case 'gallery':
        return <GallerySkeleton key={index} />
      case 'contact':
        return <ContactSkeleton key={index} />
      case 'faq':
        return <FAQSkeleton key={index} />
      default:
        return null
    }
  }

  return (
    <main className={cn('min-h-screen', className)}>
      {showHero && <HeroSkeleton />}
      {sections.map((section, index) => renderSection(section, index))}
    </main>
  )
}

// Export all section skeletons
export default {
  HeroSkeleton,
  GridSkeleton,
  TextSkeleton,
  StatsSkeleton,
  TestimonialsSkeleton,
  GallerySkeleton,
  CTASkeleton,
  ContactSkeleton,
  FAQSkeleton,
  TeamSkeleton,
  PageSkeleton,
}
