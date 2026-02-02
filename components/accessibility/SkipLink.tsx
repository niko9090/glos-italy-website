// Skip Link Component for Accessibility
// Allows keyboard users to skip navigation and go directly to main content
// WCAG 2.1 AA - Success Criterion 2.4.1 Bypass Blocks

'use client'

interface SkipLinkProps {
  /** Target element ID to skip to (without #) */
  targetId?: string
  /** Custom label for the skip link */
  label?: string
  /** Additional CSS classes */
  className?: string
}

export default function SkipLink({
  targetId = 'main-content',
  label = 'Vai al contenuto principale',
  className = '',
}: SkipLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      // Set tabindex to make the element focusable if it isn't already
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1')
      }
      target.focus()
      // Scroll into view smoothly
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={`skip-link ${className}`}
    >
      {label}
    </a>
  )
}
