// Banner Section Component
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'
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
  const { t } = useLanguage()

  if (isDismissed) return null

  const variantClass = variantClasses[data.variant || 'primary']
  const sizeClass = sizeClasses[data.size || 'normal']
  const isFixed = data.position?.startsWith('fixed')

  // Marquee content (repeated for seamless loop)
  const MarqueeContent = () => (
    <div className="flex items-center gap-8 px-4">
      {data.icon ? <span className="text-2xl">{data.icon}</span> : null}
      <div className="whitespace-nowrap">
        <RichText value={data.text} />
      </div>
    </div>
  )

  const renderContent = () => (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {data.icon ? <span className="text-2xl">{data.icon}</span> : null}
      <div>
        <RichText value={data.text} />
      </div>
      {data.buttonText && data.buttonLink ? (
        <Link
          href={data.buttonLink}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full font-medium transition-all backdrop-blur-sm"
        >
          {t(data.buttonText)}
        </Link>
      ) : null}
    </div>
  )

  const renderMarquee = () => (
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 20,
            ease: 'linear',
          },
        }}
      >
        <MarqueeContent />
        <MarqueeContent />
        <MarqueeContent />
        <MarqueeContent />
      </motion.div>
    </div>
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
          {data.animated ? renderMarquee() : renderContent()}

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
