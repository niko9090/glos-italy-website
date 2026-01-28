// Testimonials Section Component
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

export default function TestimonialsSection({ data, testimonials }: TestimonialsSectionProps) {
  const locale = defaultLocale

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <section className="section bg-white">
      <div className="container-glos">
        {/* Header */}
        <div className="text-center mb-12">
          {data.title && (
            <h2 className="section-title mb-4">{t(data.title, locale)}</h2>
          )}
          {data.subtitle && (
            <p className="section-subtitle mx-auto">{t(data.subtitle, locale)}</p>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />

              {/* Rating */}
              {testimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating!
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Quote */}
              <blockquote className="text-gray-700 mb-6 italic">
                "{t(testimonial.quote, locale)}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {testimonial.avatar && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={urlFor(testimonial.avatar).width(96).height(96).url()}
                      alt={testimonial.author || ''}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                      {testimonial.role && testimonial.company && ', '}
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
