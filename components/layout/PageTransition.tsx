'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { MOTION } from '@/lib/animations/config'

// Page transition variants - fade + subtle slide
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -10,
  },
}

// Transition configuration - fast transitions (0.3-0.4s)
const pageTransition = {
  duration: MOTION.DURATION.NORMAL, // 0.4s
  ease: MOTION.EASE.OUT,
}

interface PageTransitionProps {
  children: ReactNode
}

/**
 * PageTransition component for smooth page transitions in Next.js App Router.
 * Wraps page content and provides fade + subtle slide animations between pages.
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
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
