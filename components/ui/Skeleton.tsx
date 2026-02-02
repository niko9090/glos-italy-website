// Reusable Skeleton Components for GLOS Italy
// Animated loading placeholders with shimmer effect

import { cn } from '@/lib/utils'

interface SkeletonBaseProps {
  className?: string
}

/**
 * Base Skeleton component with shimmer animation
 * Uses the existing skeleton-shimmer class from globals.css
 */
export function Skeleton({ className }: SkeletonBaseProps) {
  return (
    <div
      className={cn(
        'skeleton-shimmer rounded',
        className
      )}
      aria-hidden="true"
    />
  )
}

// ============================================
// SKELETON TEXT VARIANTS
// ============================================

interface SkeletonTextProps extends SkeletonBaseProps {
  /** Width of the text skeleton (Tailwind width class or custom) */
  width?: string
  /** Height variant */
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const textSizeClasses = {
  xs: 'h-3',
  sm: 'h-4',
  md: 'h-5',
  lg: 'h-6',
}

/**
 * Single line text skeleton
 * Useful for labels, short text, metadata
 */
export function SkeletonText({
  className,
  width = 'w-full',
  size = 'md'
}: SkeletonTextProps) {
  return (
    <Skeleton
      className={cn(
        textSizeClasses[size],
        width,
        'rounded',
        className
      )}
    />
  )
}

// ============================================
// SKELETON TITLE
// ============================================

interface SkeletonTitleProps extends SkeletonBaseProps {
  /** Width of the title (Tailwind width class) */
  width?: string
  /** Title size variant matching section-title styles */
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const titleSizeClasses = {
  sm: 'h-6',      // Smaller headings
  md: 'h-8',      // Regular headings (h3)
  lg: 'h-10',     // Section titles (h2)
  xl: 'h-12',     // Hero titles (h1)
}

/**
 * Title/Heading skeleton
 * Matches the visual weight of section titles
 */
export function SkeletonTitle({
  className,
  width = 'w-3/4',
  size = 'lg'
}: SkeletonTitleProps) {
  return (
    <Skeleton
      className={cn(
        titleSizeClasses[size],
        width,
        'rounded-md',
        className
      )}
    />
  )
}

// ============================================
// SKELETON PARAGRAPH
// ============================================

interface SkeletonParagraphProps extends SkeletonBaseProps {
  /** Number of lines to render */
  lines?: number
  /** Gap between lines */
  gap?: 'sm' | 'md' | 'lg'
  /** Make the last line shorter */
  lastLineWidth?: string
}

const paragraphGapClasses = {
  sm: 'space-y-2',
  md: 'space-y-3',
  lg: 'space-y-4',
}

/**
 * Multi-line paragraph skeleton
 * Simulates a block of text content
 */
export function SkeletonParagraph({
  className,
  lines = 3,
  gap = 'md',
  lastLineWidth = 'w-2/3'
}: SkeletonParagraphProps) {
  return (
    <div className={cn(paragraphGapClasses[gap], className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonText
          key={index}
          width={index === lines - 1 ? lastLineWidth : 'w-full'}
          size="md"
        />
      ))}
    </div>
  )
}

// ============================================
// SKELETON IMAGE
// ============================================

interface SkeletonImageProps extends SkeletonBaseProps {
  /** Aspect ratio preset */
  aspectRatio?: 'square' | '4/3' | '16/9' | '3/2' | '21/9' | 'auto'
  /** Custom height (when aspectRatio is 'auto') */
  height?: string
  /** Border radius variant */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const aspectRatioClasses = {
  'square': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-video',
  '3/2': 'aspect-[3/2]',
  '21/9': 'aspect-[21/9]',
  'auto': '',
}

const roundedClasses = {
  'none': 'rounded-none',
  'sm': 'rounded-sm',
  'md': 'rounded-md',
  'lg': 'rounded-lg',
  'xl': 'rounded-xl',
  '2xl': 'rounded-2xl',
  'full': 'rounded-full',
}

/**
 * Image placeholder skeleton
 * Includes an icon to indicate image content
 */
export function SkeletonImage({
  className,
  aspectRatio = '4/3',
  height,
  rounded = 'xl'
}: SkeletonImageProps) {
  return (
    <div
      className={cn(
        'skeleton-shimmer relative overflow-hidden',
        aspectRatioClasses[aspectRatio],
        roundedClasses[rounded],
        aspectRatio === 'auto' && height,
        className
      )}
      aria-hidden="true"
    >
      {/* Image icon indicator */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-300/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>
    </div>
  )
}

// ============================================
// SKELETON AVATAR
// ============================================

interface SkeletonAvatarProps extends SkeletonBaseProps {
  /** Size of the avatar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const avatarSizeClasses = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
}

/**
 * Circular avatar skeleton
 */
export function SkeletonAvatar({
  className,
  size = 'md'
}: SkeletonAvatarProps) {
  return (
    <Skeleton
      className={cn(
        avatarSizeClasses[size],
        'rounded-full flex-shrink-0',
        className
      )}
    />
  )
}

// ============================================
// SKELETON BUTTON
// ============================================

interface SkeletonButtonProps extends SkeletonBaseProps {
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Width */
  width?: string
}

const buttonSizeClasses = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
}

/**
 * Button placeholder skeleton
 */
export function SkeletonButton({
  className,
  size = 'md',
  width = 'w-32'
}: SkeletonButtonProps) {
  return (
    <Skeleton
      className={cn(
        buttonSizeClasses[size],
        width,
        'rounded-lg',
        className
      )}
    />
  )
}

// ============================================
// SKELETON CARD
// ============================================

interface SkeletonCardProps extends SkeletonBaseProps {
  /** Show image placeholder */
  showImage?: boolean
  /** Image aspect ratio */
  imageAspectRatio?: SkeletonImageProps['aspectRatio']
  /** Number of text lines */
  textLines?: number
  /** Show action button */
  showButton?: boolean
  /** Card layout direction */
  direction?: 'vertical' | 'horizontal'
}

/**
 * Complete card skeleton with image, title, text, and optional button
 * Matches the product card and content card patterns
 */
export function SkeletonCard({
  className,
  showImage = true,
  imageAspectRatio = '4/3',
  textLines = 2,
  showButton = false,
  direction = 'vertical'
}: SkeletonCardProps) {
  const isHorizontal = direction === 'horizontal'

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-lg overflow-hidden',
        isHorizontal && 'flex flex-col sm:flex-row',
        className
      )}
      aria-hidden="true"
    >
      {/* Image */}
      {showImage && (
        <div className={cn(
          isHorizontal ? 'sm:w-64 md:w-80 flex-shrink-0' : 'w-full'
        )}>
          <SkeletonImage
            aspectRatio={imageAspectRatio}
            rounded="none"
          />
        </div>
      )}

      {/* Content */}
      <div className={cn(
        'p-6 flex-1',
        isHorizontal && 'flex flex-col justify-center'
      )}>
        {/* Category/Tag */}
        <SkeletonText width="w-20" size="sm" className="mb-2" />

        {/* Title */}
        <SkeletonTitle size="sm" width="w-3/4" className="mb-4" />

        {/* Description lines */}
        <SkeletonParagraph lines={textLines} gap="sm" className="mb-4" />

        {/* Button */}
        {showButton && (
          <SkeletonButton width="w-28" className="mt-2" />
        )}
      </div>
    </div>
  )
}

// ============================================
// SKELETON ICON BOX
// ============================================

interface SkeletonIconBoxProps extends SkeletonBaseProps {
  /** Icon size */
  iconSize?: 'sm' | 'md' | 'lg'
  /** Show description text */
  showDescription?: boolean
  /** Layout alignment */
  align?: 'left' | 'center'
}

const iconBoxSizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
}

/**
 * Icon + text block skeleton
 * For features, benefits, stats displays
 */
export function SkeletonIconBox({
  className,
  iconSize = 'md',
  showDescription = true,
  align = 'left'
}: SkeletonIconBoxProps) {
  const isCenter = align === 'center'

  return (
    <div className={cn(
      'flex gap-4',
      isCenter ? 'flex-col items-center text-center' : 'items-start',
      className
    )}>
      {/* Icon */}
      <Skeleton
        className={cn(
          iconBoxSizeClasses[iconSize],
          'rounded-xl flex-shrink-0'
        )}
      />

      {/* Content */}
      <div className={cn(
        'flex-1',
        isCenter && 'w-full'
      )}>
        <SkeletonTitle size="sm" width={isCenter ? 'w-1/2 mx-auto' : 'w-3/4'} className="mb-2" />
        {showDescription && (
          <SkeletonParagraph
            lines={2}
            gap="sm"
            lastLineWidth={isCenter ? 'w-3/4 mx-auto' : 'w-2/3'}
          />
        )}
      </div>
    </div>
  )
}

// ============================================
// SKELETON STAT
// ============================================

interface SkeletonStatProps extends SkeletonBaseProps {
  /** Layout orientation */
  direction?: 'vertical' | 'horizontal'
}

/**
 * Stat/Counter skeleton
 * For numerical displays with labels
 */
export function SkeletonStat({
  className,
  direction = 'vertical'
}: SkeletonStatProps) {
  const isHorizontal = direction === 'horizontal'

  return (
    <div className={cn(
      'flex gap-2',
      isHorizontal ? 'items-center' : 'flex-col items-center text-center',
      className
    )}>
      {/* Number */}
      <Skeleton className={cn(
        'h-10 rounded-lg',
        isHorizontal ? 'w-16' : 'w-24'
      )} />

      {/* Label */}
      <SkeletonText
        width={isHorizontal ? 'w-20' : 'w-32'}
        size="sm"
      />
    </div>
  )
}

// ============================================
// SKELETON LIST ITEM
// ============================================

interface SkeletonListItemProps extends SkeletonBaseProps {
  /** Show avatar/icon on left */
  showAvatar?: boolean
  /** Avatar size */
  avatarSize?: SkeletonAvatarProps['size']
  /** Number of text lines */
  lines?: number
}

/**
 * List item skeleton with optional avatar
 * For lists, comments, team members
 */
export function SkeletonListItem({
  className,
  showAvatar = true,
  avatarSize = 'md',
  lines = 2
}: SkeletonListItemProps) {
  return (
    <div className={cn('flex gap-4 items-start', className)}>
      {showAvatar && <SkeletonAvatar size={avatarSize} />}
      <div className="flex-1">
        <SkeletonText width="w-1/3" size="sm" className="mb-2" />
        <SkeletonParagraph lines={lines} gap="sm" />
      </div>
    </div>
  )
}

// ============================================
// SKELETON BADGE
// ============================================

interface SkeletonBadgeProps extends SkeletonBaseProps {
  /** Badge size */
  size?: 'sm' | 'md'
}

/**
 * Small badge/tag skeleton
 */
export function SkeletonBadge({
  className,
  size = 'sm'
}: SkeletonBadgeProps) {
  return (
    <Skeleton
      className={cn(
        'rounded-full',
        size === 'sm' ? 'h-5 w-16' : 'h-6 w-20',
        className
      )}
    />
  )
}

// ============================================
// UTILITY: cn helper if not already in project
// ============================================
// Note: If @/lib/utils doesn't exist, create it or use this inline:
// const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ')

export default Skeleton
