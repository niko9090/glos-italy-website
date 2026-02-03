'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { MOTION } from '@/lib/animations/config'

// Enhanced page transition variants with scale and blur
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    y: -15,
    scale: 0.98,
    filter: 'blur(4px)',
  },
}

// Smooth transition configuration
const pageTransition = {
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94], // Custom smooth easing
}

// Overlay animation for transition effect
const overlayVariants = {
  initial: { scaleY: 0 },
  animate: { scaleY: 0 },
  exit: {
    scaleY: 1,
    transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] },
  },
}

interface PageTransitionProps {
  children: ReactNode
}

/**
 * PageTransition component for smooth page transitions in Next.js App Router.
 * Wraps page content and provides fade + subtle slide + scale animations between pages.
 * Includes blur effect for a modern, polished feel.
 *
 * Note: In Next.js App Router, AnimatePresence with mode="wait" ensures
 * the exit animation completes before the enter animation begins.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
