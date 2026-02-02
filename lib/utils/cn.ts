/**
 * Utility function for conditionally joining class names
 * Similar to the `clsx` or `classnames` library but lightweight
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[]

/**
 * Combines multiple class names into a single string
 * Filters out falsy values (false, null, undefined, 0, '')
 *
 * @example
 * cn('base-class', isActive && 'active', variant === 'primary' && 'btn-primary')
 * // Returns: 'base-class active btn-primary' (if conditions are true)
 *
 * @example
 * cn(['flex', 'items-center'], 'gap-4', undefined, false, 'text-gray-900')
 * // Returns: 'flex items-center gap-4 text-gray-900'
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input))
    } else if (Array.isArray(input)) {
      const inner = cn(...input)
      if (inner) {
        classes.push(inner)
      }
    }
  }

  return classes.join(' ')
}

export default cn
