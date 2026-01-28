// CTA Section Component
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Phone } from 'lucide-react'
import { urlFor } from '@/lib/sanity/client'
import { t, defaultLocale } from '@/lib/i18n'
import { useRef } from 'react'

interface CTASectionProps {
  data: {
    title?: { it?: string; en?: string; es?: string }
    subtitle?: { it?: string; en?: string; es?: string }
    primaryButton?: {
      text?: { it?: string; en?: string; es?: string }
      link?: string
    }
    secondaryButton?: {
      text?: { it?: string; en?: string; es?: string }
      link?: string
    }
    phone?: string
    backgroundImage?: any
    backgroundColor?: 'blue' | 'dark' | 'light' | 'gradient'
  }
}

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

// Button hover animation
const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.98,
  },
}

// Phone icon shake animation
const phoneShakeVariants = {
  hover: {
    rotate: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
}

export default function CTASection({ data }: CTASectionProps) {
  const locale = defaultLocale
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  const bgClasses = {
    blue: 'bg-primary text-white',
    dark: 'bg-gray-900 text-white',
    light: 'bg-gray-100 text-gray-900',
    gradient: 'bg-gradient-to-r from-primary to-primary-light text-white',
  }

  const bgClass = bgClasses[data.backgroundColor || 'blue']
  const hasBackgroundImage = !!data.backgroundImage

  return (
    <section
      ref={sectionRef}
      className={`relative py-20 overflow-hidden ${!hasBackgroundImage ? bgClass : ''}`}
    >
      {/* Background Image with subtle zoom */}
      {hasBackgroundImage && (
        <>
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ scale: 1 }}
            animate={isInView ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
          >
            <Image
              src={urlFor(data.backgroundImage).width(1920).url()}
              alt=""
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-primary/80 z-0" />
        </>
      )}

      <div className="container-glos relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Title with stagger animation */}
          {data.title && (
            <motion.h2
              variants={itemVariants}
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${hasBackgroundImage ? 'text-white' : ''}`}
            >
              {t(data.title, locale)}
            </motion.h2>
          )}

          {/* Subtitle with stagger animation */}
          {data.subtitle && (
            <motion.p
              variants={itemVariants}
              className={`text-xl mb-8 opacity-90 ${hasBackgroundImage ? 'text-white' : ''}`}
            >
              {t(data.subtitle, locale)}
            </motion.p>
          )}

          {/* Buttons with stagger animation */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4"
          >
            {data.primaryButton?.text && data.primaryButton?.link && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href={data.primaryButton.link}
                  className="btn btn-glow bg-white text-primary hover:bg-gray-100"
                >
                  {t(data.primaryButton.text, locale)}
                </Link>
              </motion.div>
            )}

            {data.secondaryButton?.text && data.secondaryButton?.link && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href={data.secondaryButton.link}
                  className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
                >
                  {t(data.secondaryButton.text, locale)}
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Phone with shake animation on hover */}
          {data.phone && (
            <motion.div
              variants={itemVariants}
              className="mt-8"
            >
              <motion.a
                href={`tel:${data.phone.replace(/\s/g, '')}`}
                className={`inline-flex items-center gap-2 text-lg font-medium ${hasBackgroundImage ? 'text-white' : ''}`}
                whileHover="hover"
              >
                <motion.span variants={phoneShakeVariants}>
                  <Phone className="w-5 h-5" />
                </motion.span>
                {data.phone}
              </motion.a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
