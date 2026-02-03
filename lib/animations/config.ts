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

// === MODERN ANIMATION VARIANTS ===

// Text reveal - clip-path animation
export const textReveal = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] },
  },
}

// 3D card hover effect
export const hover3D = {
  rotateY: 5,
  rotateX: 5,
  scale: 1.02,
  z: 50,
  transition: { type: 'spring', stiffness: 300, damping: 20 },
}

// Glass card hover
export const hoverGlass = {
  scale: 1.02,
  y: -5,
  boxShadow: '0 25px 50px -12px rgba(0, 71, 171, 0.25), 0 0 15px rgba(0, 71, 171, 0.1)',
  transition: { duration: 0.3 },
}

// Gradient background animation config (for inline style)
export const gradientBgAnimation = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
  },
  transition: {
    duration: 8,
    repeat: Infinity,
    ease: 'linear',
  },
}

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// Floating element animation
export const floatingElement = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
  },
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut',
  },
}

// Parallax scroll variants
export const parallaxVariants = {
  subtle: { amount: '15%' },
  normal: { amount: '25%' },
  strong: { amount: '40%' },
}

// Counter bounce effect (for stats)
export const counterBounce = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

// Card entrance with stagger
export const cardEntrance = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

// Hero content stagger
export const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

export const heroItem = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Scroll indicator pulse
export const scrollIndicatorPulse = {
  animate: {
    y: [0, 10, 0],
    opacity: [0.6, 1, 0.6],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
}

// Badge bounce entrance
export const badgeBounce = {
  hidden: { opacity: 0, scale: 0, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15,
    },
  },
}

// Timeline marker pulse
export const markerPulse = {
  animate: {
    scale: [1, 1.3, 1],
    boxShadow: [
      '0 0 0 0 rgba(0, 71, 171, 0.4)',
      '0 0 0 10px rgba(0, 71, 171, 0)',
      '0 0 0 0 rgba(0, 71, 171, 0)',
    ],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
}

// Photo hover zoom
export const photoHover = {
  scale: 1.1,
  transition: { duration: 0.4, ease: 'easeOut' },
}

// Social icon bounce
export const socialBounce = {
  whileHover: {
    scale: 1.2,
    rotate: 5,
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  },
  whileTap: { scale: 0.9 },
}

// Glow button effect
export const glowButton = {
  whileHover: {
    scale: 1.05,
    boxShadow: '0 0 40px rgba(0, 71, 171, 0.6)',
    transition: { duration: 0.3 },
  },
  whileTap: { scale: 0.95 },
}
