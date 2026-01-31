// Features Section Component with Enhanced Animations
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Check } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { getTextValue } from '@/lib/utils/textHelpers'
import RichText from '@/components/RichText'

interface FeaturesSectionProps {
  data: {
    title?: string
    subtitle?: string
    image?: any
    items?: Array<{
      _key: string
      title?: string
      description?: string
    }>
  }
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

const iconContainerVariants = {
  rest: { rotate: 0, scale: 1 },
  hover: {
    rotate: [0, -10, 10, -5, 5, 0],
    scale: 1.1,
    transition: {
      rotate: { duration: 0.5 },
      scale: { duration: 0.2 },
    },
  },
}

export default function FeaturesSection({ data }: FeaturesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax for the image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])

  return (
    <section ref={sectionRef} className="section bg-gray-50 overflow-hidden">
      <div className="container-glos">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image with parallax effect */}
          {isValidImage(data.image) && safeImageUrl(data.image, 800, 600) ? (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
              className="relative"
            >
              <motion.div
                style={{ y: imageY, scale: imageScale }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src={safeImageUrl(data.image, 800, 600)!}
                  alt=""
                  fill
                  className="object-cover"
                />
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary/20 rounded-full -z-10" />
            </motion.div>
          ) : null}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title mb-4"
            >
              <RichText value={data.title} />
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="section-subtitle mb-8"
            >
              <RichText value={data.subtitle} />
            </motion.div>

            {/* Features List with stagger */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="space-y-6"
            >
              {data.items?.map((item) => (
                <motion.div
                  key={item._key}
                  variants={itemVariants}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  className="flex gap-4 group cursor-default"
                >
                  {/* Icon with rotation and glow on hover */}
                  <motion.div
                    variants={iconContainerVariants}
                    className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center
                               group-hover:bg-primary group-hover:shadow-lg
                               transition-all duration-300"
                  >
                    <Check className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                  </motion.div>

                  {/* Text content */}
                  <div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors duration-300">
                      {getTextValue(item.title)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {getTextValue(item.description)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
