// Banner Section Component
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { getTextValue } from '@/lib/utils/textHelpers'
import RichText from '@/components/RichText'

interface BannerSectionProps {
  data: {
    text?: unknown
    buttonText?: unknown
    buttonLink?: string
    dismissible?: boolean
    icon?: string
    variant?: string
    size?: string
    position?: string
    fullWidth?: boolean
    animated?: boolean
  }
}

const variantClasses: Record<string, string> = {
  info: 'bg-blue-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-gray-900',
  promo: 'bg-purple-600 text-white',
  primary: 'bg-primary text-white',
  dark: 'bg-gray-900 text-white',
  gradient: 'bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-white',
}

const sizeClasses: Record<string, string> = {
  compact: 'py-2',
  normal: 'py-4',
  large: 'py-6',
}

export default function BannerSection({ data }: BannerSectionProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  const variantClass = variantClasses[data.variant || 'primary']
  const sizeClass = sizeClasses[data.size || 'normal']
  const isFixed = data.position?.startsWith('fixed')

  const renderContent = () => (
    <motion.div
      initial={data.animated ? { x: '-100%' } : { opacity: 0 }}
      animate={data.animated ? { x: 0 } : { opacity: 1 }}
      transition={data.animated ? { duration: 20, repeat: Infinity, ease: 'linear' } : undefined}
      className="flex items-center justify-center gap-4 flex-wrap"
    >
      {data.icon ? <span className="text-2xl">{data.icon}</span> : null}

      <div className={data.animated ? 'whitespace-nowrap' : ''}>
        <RichText value={data.text} />
      </div>

      {data.buttonText && data.buttonLink ? (
        <Link
          href={data.buttonLink}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full font-medium transition-all backdrop-blur-sm"
        >
          {getTextValue(data.buttonText)}
        </Link>
      ) : null}
    </motion.div>
  )

  const banner = (
    <div
      className={`${variantClass} ${sizeClass} ${
        isFixed
          ? `fixed left-0 right-0 z-50 ${data.position === 'fixed-top' ? 'top-0' : 'bottom-0'}`
          : ''
      }`}
    >
      <div className={data.fullWidth ? 'px-4' : 'container-glos'}>
        <div className="relative flex items-center justify-center">
          {data.animated ? (
            <div className="overflow-hidden w-full">
              {renderContent()}
            </div>
          ) : (
            renderContent()
          )}

          {/* Dismiss Button */}
          {data.dismissible && (
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute right-0 p-2 hover:bg-white/20 rounded-full transition-all"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  // For fixed position, we need to add spacing
  if (isFixed) {
    return (
      <>
        {data.position === 'fixed-top' && <div className={sizeClass} />}
        {banner}
        {data.position === 'fixed-bottom' && <div className={sizeClass} />}
      </>
    )
  }

  return banner
}
