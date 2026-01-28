// Testimonials Section Component with Animations
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { urlFor } from '@/lib/sanity/client'
import { t, defaultLocale } from '@/lib/i18n'
import type { Testimonial } from '@/lib/sanity/fetch'

interface TestimonialsSectionProps {
  data: {
    title?: { it?: string; en?: string; es?: string }
    subtitle?: { it?: string; en?: string; es?: string }
  }
  testimonials?: Testimonial[]
}

// Animation variants
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

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

const quoteIconVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      delay: 0.3,
    },
  },
}

// Animated star component with progressive fill
function AnimatedStar({ filled, delay }: { filled: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      whileInView={{
        opacity: 1,
        scale: 1,
        rotate: 0,
      }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 12,
        delay,
      }}
    >
      <Star
        className={`w-5 h-5 transition-colors duration-300 ${
          filled
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    </motion.div>
  )
}

export default function TestimonialsSection({ data, testimonials }: TestimonialsSectionProps) {
  const locale = defaultLocale

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <section className="section bg-white overflow-hidden">
      <div className="container-glos">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {data.title && (
            <h2 className="section-title mb-4">{t(data.title, locale)}</h2>
          )}
          {data.subtitle && (
            <p className="section-subtitle mx-auto">{t(data.subtitle, locale)}</p>
          )}
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial._id}
              variants={cardVariants}
              whileHover={{
                y: -8,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              }}
              className="bg-gray-50 rounded-2xl p-8 relative group cursor-default"
            >
              {/* Quote Icon with zoom entrance */}
              <motion.div
                variants={quoteIconVariants}
                className="absolute top-4 right-4"
              >
                <Quote className="w-8 h-8 text-primary/20 group-hover:text-primary/40 transition-colors duration-300" />
              </motion.div>

              {/* Rating with progressive star fill */}
              {testimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <AnimatedStar
                      key={i}
                      filled={i < testimonial.rating!}
                      delay={0.1 + i * 0.1}
                    />
                  ))}
                </div>
              )}

              {/* Quote */}
              <motion.blockquote
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-gray-700 mb-6 italic leading-relaxed"
              >
                "{t(testimonial.quote, locale)}"
              </motion.blockquote>

              {/* Author */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                className="flex items-center gap-4"
              >
                {testimonial.avatar && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300"
                  >
                    <Image
                      src={urlFor(testimonial.avatar).width(96).height(96).url()}
                      alt={testimonial.author || ''}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                )}
                <div>
                  <p className="font-semibold group-hover:text-primary transition-colors duration-300">
                    {testimonial.author}
                  </p>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                      {testimonial.role && testimonial.company && ', '}
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Decorative bottom line */}
              <div className="absolute bottom-0 left-8 right-8 h-1 bg-primary/0 group-hover:bg-primary/20 rounded-full transition-all duration-500 transform scale-x-0 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
