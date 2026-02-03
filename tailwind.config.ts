import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          light: 'var(--color-primary-light)',
        },
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        handwriting: ['Caveat', 'cursive', 'system-ui'],
      },
      animation: {
        // Base animations
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'slide-left': 'slideLeft 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',

        // Zoom animations
        'zoom-in': 'zoomIn 0.5s ease-out forwards',
        'zoom-out': 'zoomOut 0.5s ease-out forwards',

        // Special animations
        'flip': 'flip 0.6s ease-out forwards',
        'rotate-in': 'rotate-in 0.5s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'wave': 'wave 1.5s ease-in-out infinite',
        'glitter': 'glitter 2s linear infinite',
        'typewriter': 'typewriter 2s steps(40) forwards, blink 0.75s step-end infinite',
        'draw': 'draw 2s ease-out forwards',

        // Continuous animations
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out infinite 1s',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',

        // Modern animations
        'gradient-shift': 'gradientShift 8s ease infinite',
        'gradient-slow': 'gradientShift 15s ease infinite',
        'text-reveal': 'textReveal 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards',
        'blob-morph': 'blobMorph 8s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'zoom-pulse': 'zoomPulse 2s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'line-draw': 'lineDraw 2s ease-out forwards',
        'counter-bounce': 'counterBounce 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        zoomOut: {
          '0%': { opacity: '0', transform: 'scale(1.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        flip: {
          '0%': { opacity: '0', transform: 'rotateY(90deg)' },
          '100%': { opacity: '1', transform: 'rotateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 71, 171, 0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(0, 71, 171, 0.8), 0 0 50px rgba(0, 71, 171, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'rotate-in': {
          '0%': { opacity: '0', transform: 'rotate(-10deg) scale(0.9)' },
          '100%': { opacity: '1', transform: 'rotate(0) scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(20deg)' },
          '75%': { transform: 'rotate(-20deg)' },
        },
        glitter: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.5)' },
        },
        typewriter: {
          '0%': { width: '0', opacity: '1' },
          '100%': { width: '100%', opacity: '1' },
        },
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'currentColor' },
        },
        draw: {
          '0%': { strokeDashoffset: '1000', opacity: '0' },
          '100%': { strokeDashoffset: '0', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      transitionDelay: {
        '200': '200ms',
        '500': '500ms',
        '1000': '1000ms',
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
}

export default config
