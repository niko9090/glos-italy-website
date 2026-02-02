// Spacing Utility Classes - Shared across all section components
// Maps Sanity spacing options to Tailwind CSS classes

export const paddingTopClasses: Record<string, string> = {
  none: 'pt-0',
  sm: 'pt-4 md:pt-6',
  md: 'pt-8 md:pt-12',
  lg: 'pt-12 md:pt-16',
  xl: 'pt-16 md:pt-24',
  '2xl': 'pt-24 md:pt-32',
}

export const paddingBottomClasses: Record<string, string> = {
  none: 'pb-0',
  sm: 'pb-4 md:pb-6',
  md: 'pb-8 md:pb-12',
  lg: 'pb-12 md:pb-16',
  xl: 'pb-16 md:pb-24',
  '2xl': 'pb-24 md:pb-32',
}

export const marginTopClasses: Record<string, string> = {
  none: 'mt-0',
  sm: 'mt-4 md:mt-6',
  md: 'mt-8 md:mt-12',
  lg: 'mt-12 md:mt-16',
  xl: 'mt-16 md:mt-24',
}

export const marginBottomClasses: Record<string, string> = {
  none: 'mb-0',
  sm: 'mb-4 md:mb-6',
  md: 'mb-8 md:mb-12',
  lg: 'mb-12 md:mb-16',
  xl: 'mb-16 md:mb-24',
}

// Legacy paddingY classes (for backwards compatibility)
export const paddingYClasses: Record<string, string> = {
  none: 'py-0',
  sm: 'py-4 md:py-6',
  md: 'py-8 md:py-12',
  lg: 'py-12 md:py-16',
  xl: 'py-16 md:py-24',
  '2xl': 'py-24 md:py-32',
}

export const containerWidthClasses: Record<string, string> = {
  narrow: 'max-w-3xl',
  normal: 'max-w-6xl',
  wide: 'max-w-7xl',
  full: 'max-w-none',
}

/**
 * Get spacing classes for a section based on its data props.
 * Supports both new granular padding (paddingTop/Bottom) and legacy paddingY.
 *
 * @param data - Section data object with spacing properties
 * @param defaultPadding - Default padding value if none specified (default: 'lg')
 * @returns Combined CSS class string for spacing
 */
export function getSpacingClasses(
  data: {
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string
    marginTop?: string
    marginBottom?: string
  },
  defaultPadding = 'lg'
): string {
  const classes: string[] = []

  // Use paddingTop/Bottom if specified, otherwise fallback to paddingY
  if (data.paddingTop) {
    classes.push(paddingTopClasses[data.paddingTop] || '')
  } else if (data.paddingY) {
    classes.push(paddingTopClasses[data.paddingY] || paddingTopClasses[defaultPadding])
  } else {
    classes.push(paddingTopClasses[defaultPadding])
  }

  if (data.paddingBottom) {
    classes.push(paddingBottomClasses[data.paddingBottom] || '')
  } else if (data.paddingY) {
    classes.push(paddingBottomClasses[data.paddingY] || paddingBottomClasses[defaultPadding])
  } else {
    classes.push(paddingBottomClasses[defaultPadding])
  }

  // Margins
  if (data.marginTop && data.marginTop !== 'none') {
    classes.push(marginTopClasses[data.marginTop] || '')
  }
  if (data.marginBottom && data.marginBottom !== 'none') {
    classes.push(marginBottomClasses[data.marginBottom] || '')
  }

  return classes.filter(Boolean).join(' ')
}

/**
 * Get container width class based on section data.
 *
 * @param containerWidth - Container width option
 * @returns CSS class string for container width
 */
export function getContainerClass(containerWidth?: string): string {
  if (!containerWidth || containerWidth === 'normal') {
    return 'container-glos'
  }
  return `${containerWidthClasses[containerWidth] || ''} mx-auto px-4 md:px-6`
}
