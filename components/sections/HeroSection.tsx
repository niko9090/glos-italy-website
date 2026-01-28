// Hero Section Component with Parallax and Stagger Animations
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { urlFor } from '@/lib/sanity/client'
import { t, defaultLocale } from '@/lib/i18n'
import { ArrowRight, ChevronDown } from 'lucide-react'

interface HeroSectionProps {
  data: {
    title?: { it?: string; en?: string; es?: string }
    subtitle?: { it?: string; en?: string; es?: string }
    backgroundImage?: any
    primaryButton?: {
      text?: { it?: string; en?: string; es?: string }
      link?: string
    }
    secondaryButton?: {
      text?: { it?: string; en?: string; es?: string }
      link?: string
    }
    layout?: 'centered' | 'left' | 'split'
  }
}

export default function HeroSection({ data }: HeroSectionProps) {
  const locale = defaultLocale
  const title = t(data.title, locale)
  const subtitle = t(data.subtitle, locale)
  const primaryButtonText = t(data.primaryButton?.text, locale)
  const secondaryButtonText = t(data.secondaryButton?.text, locale)

  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -50])

  const backgroundUrl = data.backgroundImage
    ? urlFor(data.backgroundImage).width(1920).quality(85).url()
    : null

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.95 },
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Parallax Background Image */}
      {backgroundUrl && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY, scale: backgroundScale }}
        >
          <Image
            src={backgroundUrl}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      )}

      {/* Fallback gradient background with animation */}
      {!backgroundUrl && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-gray-900" />
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-light/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
      )}

      {/* Content */}
      <motion.div
        className="container-glos relative z-10 py-20"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`max-w-3xl ${
            data.layout === 'centered' ? 'mx-auto text-center' : ''
          }`}
        >
          {/* Title with stagger effect */}
          {title && (
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
            >
              {title.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  className="inline-block mr-[0.25em]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3 + index * 0.08,
                    type: 'spring',
                    stiffness: 100,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
          )}

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className={`flex gap-4 flex-wrap ${
              data.layout === 'centered' ? 'justify-center' : ''
            }`}
          >
            {primaryButtonText && data.primaryButton?.link && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href={data.primaryButton.link}
                  className="btn-glow inline-flex items-center gap-2 group"
                >
                  {primaryButtonText}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            )}

            {secondaryButtonText && data.secondaryButton?.link && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href={data.secondaryButton.link}
                  className="btn bg-white/10 text-white border-2 border-white/50 backdrop-blur-sm hover:bg-white hover:text-primary transition-all duration-300"
                >
                  {secondaryButtonText}
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-white/60 cursor-pointer hover:text-white transition-colors"
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
    </section>
  )
}
