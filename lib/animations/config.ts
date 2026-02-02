// Animation Configuration - Configurazione centralizzata per animazioni
// Usare questi valori per mantenere consistenza in tutto il sito

export const MOTION = {
  // === TIMING (durata in secondi) ===
  DURATION: {
    FAST: 0.2,      // UI feedback immediato
    NORMAL: 0.4,    // Transizioni standard
    SLOW: 0.6,      // Animazioni d'ingresso
    SLOWER: 0.8,    // Hero e parallax
  },

  // === STAGGER (delay tra elementi) ===
  STAGGER: {
    FAST: 0.05,     // Grid grandi (12+ item)
    NORMAL: 0.1,    // Standard
    SLOW: 0.15,     // Effetto drammatico
  },

  // === SPRING PRESETS ===
  SPRING: {
    GENTLE: { type: 'spring' as const, stiffness: 100, damping: 15 },
    BOUNCE: { type: 'spring' as const, stiffness: 200, damping: 12 },
    STIFF: { type: 'spring' as const, stiffness: 300, damping: 25 },
    SOFT: { type: 'spring' as const, stiffness: 80, damping: 20 },
  },

  // === EASING CURVES ===
  EASE: {
    OUT: [0.0, 0.0, 0.2, 1],      // Decelerazione
    IN_OUT: [0.4, 0.0, 0.2, 1],   // Smooth
    BOUNCE: [0.68, -0.55, 0.265, 1.55], // Elastico
  },

  // === VIEWPORT OPTIONS ===
  VIEWPORT: {
    ONCE: { once: true, margin: '-100px' },
    ALWAYS: { once: false, margin: '-50px' },
  },
} as const

// === ANIMATION VARIANTS (riutilizzabili) ===

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const fadeInDown = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
}

export const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
}

export const rotateIn = {
  initial: { opacity: 0, rotate: -10, scale: 0.9 },
  animate: { opacity: 1, rotate: 0, scale: 1 },
  exit: { opacity: 0, rotate: 10, scale: 0.9 },
}

// === CONTAINER VARIANTS (per stagger) ===

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION.STAGGER.NORMAL,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: MOTION.STAGGER.FAST,
      delayChildren: 0.05,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: MOTION.SPRING.GENTLE,
  },
}

// === HOVER VARIANTS ===

export const hoverScale = {
  scale: 1.05,
  transition: { duration: MOTION.DURATION.FAST },
}

export const hoverLift = {
  y: -8,
  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  transition: { duration: MOTION.DURATION.FAST },
}

export const hoverGlow = {
  boxShadow: '0 0 30px rgba(0, 71, 171, 0.3)',
  transition: { duration: MOTION.DURATION.FAST },
}

// === TAP VARIANTS (per mobile) ===

export const tapScale = {
  scale: 0.95,
}

// === UTILITY FUNCTION ===

export function getAnimationVariant(type: string) {
  switch (type) {
    case 'fade-up': return fadeInUp
    case 'fade-down': return fadeInDown
    case 'fade-left': return fadeInLeft
    case 'fade-right': return fadeInRight
    case 'scale': return scaleIn
    case 'rotate': return rotateIn
    default: return fadeInUp
  }
}

export function getTransition(speed: 'fast' | 'normal' | 'slow' = 'normal') {
  return {
    duration: MOTION.DURATION[speed.toUpperCase() as keyof typeof MOTION.DURATION],
    ease: MOTION.EASE.OUT,
  }
}
