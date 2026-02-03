// Section Divider - Divisori moderni tra sezioni
'use client'

import { motion } from 'framer-motion'

type DividerType = 'wave' | 'curve' | 'slant' | 'triangle' | 'gradient-fade' | 'dots' | 'none'

interface SectionDividerProps {
  type?: DividerType
  fromColor?: string
  toColor?: string
  flip?: boolean
  height?: number
  className?: string
}

export function SectionDivider({
  type = 'wave',
  fromColor = '#ffffff',
  toColor = '#f3f4f6',
  flip = false,
  height = 80,
  className = '',
}: SectionDividerProps) {
  if (type === 'none') return null

  const transform = flip ? 'scaleY(-1)' : undefined

  // Gradient Fade divider
  if (type === 'gradient-fade') {
    return (
      <div
        className={`w-full ${className}`}
        style={{
          height: height,
          background: `linear-gradient(to bottom, ${fromColor} 0%, ${toColor} 100%)`,
        }}
      />
    )
  }

  // Dots pattern divider
  if (type === 'dots') {
    return (
      <div
        className={`w-full relative overflow-hidden ${className}`}
        style={{ height: height, backgroundColor: toColor }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, ${fromColor === '#ffffff' ? '#0047AB' : fromColor} 2px, transparent 2px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${fromColor} 0%, transparent 30%, transparent 70%, ${toColor} 100%)`,
          }}
        />
      </div>
    )
  }

  // SVG-based dividers
  const svgStyle = {
    display: 'block',
    width: '100%',
    height: height,
    transform,
  }

  return (
    <motion.div
      className={`w-full overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {type === 'wave' && (
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={svgStyle}
        >
          <path
            d="M0,64 C360,128 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z"
            fill={toColor}
          />
          <path
            d="M0,80 C240,40 480,100 720,80 C960,60 1200,100 1440,80 L1440,120 L0,120 Z"
            fill={toColor}
            opacity="0.5"
          />
        </svg>
      )}

      {type === 'curve' && (
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={svgStyle}
        >
          <path
            d="M0,120 C480,0 960,0 1440,120 L1440,120 L0,120 Z"
            fill={toColor}
          />
        </svg>
      )}

      {type === 'slant' && (
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={svgStyle}
        >
          <polygon points="0,120 1440,0 1440,120" fill={toColor} />
        </svg>
      )}

      {type === 'triangle' && (
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={svgStyle}
        >
          <polygon points="720,0 1440,120 0,120" fill={toColor} />
        </svg>
      )}
    </motion.div>
  )
}

// Automatic divider that determines colors based on section backgrounds
type SectionBg = 'white' | 'gray' | 'primary' | 'dark' | 'gradient' | 'transparent'

const bgColorMap: Record<SectionBg, string> = {
  white: '#ffffff',
  gray: '#f3f4f6',
  primary: '#0047AB',
  dark: '#1f2937',
  gradient: '#0047AB',
  transparent: '#ffffff',
}

interface AutoDividerProps {
  fromBg?: SectionBg
  toBg?: SectionBg
  className?: string
}

export function AutoDivider({ fromBg = 'white', toBg = 'gray', className = '' }: AutoDividerProps) {
  const fromColor = bgColorMap[fromBg]
  const toColor = bgColorMap[toBg]

  // Choose divider type based on color transition
  let type: DividerType = 'wave'

  if (fromBg === 'primary' || toBg === 'primary' || fromBg === 'dark' || toBg === 'dark') {
    type = 'curve'
  }

  if ((fromBg === 'white' && toBg === 'gray') || (fromBg === 'gray' && toBg === 'white')) {
    type = 'wave'
  }

  return (
    <SectionDivider
      type={type}
      fromColor={fromColor}
      toColor={toColor}
      height={60}
      className={className}
    />
  )
}

export default SectionDivider
