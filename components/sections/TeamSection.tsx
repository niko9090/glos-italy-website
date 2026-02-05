// Team Section Component
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Phone, Linkedin, Twitter } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import { getSpacingClasses } from '@/lib/utils/spacing'
import { sl } from '@/lib/utils/stegaSafe'
import RichText from '@/components/RichText'
import {
  MOTION,
  staggerContainer,
  staggerItem,
  hoverLift,
  photoHover,
} from '@/lib/animations/config'

interface TeamSectionProps {
  documentId?: string
  sectionKey?: string
  data: {
    title?: unknown
    subtitle?: unknown
    // Spacing
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string // legacy
    marginTop?: string
    marginBottom?: string
    members?: Array<{
      _key: string
      name: string
      role?: unknown
      photo?: any
      bio?: unknown
      email?: string
      phone?: string
      linkedin?: string
      twitter?: string
    }>
    layout?: string
    columns?: number
    cardStyle?: string
    photoShape?: string
    showSocial?: boolean
    showBio?: boolean
    backgroundColor?: string
  }
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
}

const cardStyleClasses: Record<string, string> = {
  simple: '',
  bordered: 'border border-gray-200',
  shadow: 'shadow-lg',
  colored: 'bg-primary/5',
}

const photoShapeClasses: Record<string, string> = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-2xl',
}

// Variante per animazione titolo (fade-up)
const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION.DURATION.SLOW,
      ease: MOTION.EASE.OUT,
    },
  },
}

// Variante per le icone social su hover
const socialIconVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.15,
    rotate: 5,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.9 },
}

export default function TeamSection({ data, documentId, sectionKey }: TeamSectionProps) {
  const { t } = useLanguage()
  const bgClass = sl(bgClasses, data.backgroundColor, 'gray')
  const textColor = data.backgroundColor?.includes('dark') ? 'text-white' : 'text-gray-900'
  const columns = data.columns || 3
  const photoShape = sl(photoShapeClasses, data.photoShape, 'circle')
  const cardStyle = sl(cardStyleClasses, data.cardStyle, 'shadow')

  if (!data.members || data.members.length === 0) return null

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section data-sanity-edit-target className={`${getSpacingClasses(data)} ${bgClass}`}>
      <div className="container-glos">
        {(data.title || data.subtitle) ? (
          <motion.div
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={MOTION.VIEWPORT.ONCE}
            className={`text-center mb-12 ${textColor}`}
          >
            {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
            {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
          </motion.div>
        ) : null}

        {/* Team Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={MOTION.VIEWPORT.ONCE}
          className={`grid grid-cols-1 ${gridCols[columns as keyof typeof gridCols]} gap-8`}
        >
          {data.members.map((member) => (
            <motion.div
              key={member._key}
              variants={staggerItem}
              whileHover={hoverLift}
              className={`p-6 rounded-2xl bg-white ${cardStyle} text-center cursor-pointer`}
            >
              {/* Photo */}
              {isValidImage(member.photo) && (
                <div className={`relative w-32 h-32 mx-auto mb-4 overflow-hidden ${photoShape}`}>
                  <Image
                    src={safeImageUrl(member.photo, 256, 256)!}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Name & Role */}
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              {member.role ? (
                <p className="text-primary font-medium mb-3">{String(t(member.role) || '')}</p>
              ) : null}

              {data.showBio && member.bio ? (
                <p className="text-gray-600 text-sm mb-4">{String(t(member.bio) || '')}</p>
              ) : null}

              {/* Contact & Social */}
              {data.showSocial && (
                <div className="flex justify-center gap-3 mt-4">
                  {member.email && (
                    <motion.a
                      href={`mailto:${member.email}`}
                      className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                      variants={socialIconVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Mail className="w-5 h-5" />
                    </motion.a>
                  )}
                  {member.phone && (
                    <motion.a
                      href={`tel:${member.phone.replace(/\s/g, '')}`}
                      className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                      variants={socialIconVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Phone className="w-5 h-5" />
                    </motion.a>
                  )}
                  {member.linkedin && (
                    <motion.a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 hover:bg-[#0077B5] hover:text-white transition-colors"
                      variants={socialIconVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Linkedin className="w-5 h-5" />
                    </motion.a>
                  )}
                  {member.twitter && (
                    <motion.a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-colors"
                      variants={socialIconVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Twitter className="w-5 h-5" />
                    </motion.a>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
