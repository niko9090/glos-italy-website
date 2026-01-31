// Team Section Component
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Phone, Linkedin, Twitter } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface TeamSectionProps {
  data: {
    title?: unknown
    subtitle?: unknown
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function TeamSection({ data }: TeamSectionProps) {
  const { t } = useLanguage()
  const bgClass = bgClasses[data.backgroundColor || 'gray']
  const textColor = data.backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'
  const columns = data.columns || 3
  const photoShape = photoShapeClasses[data.photoShape || 'circle']
  const cardStyle = cardStyleClasses[data.cardStyle || 'shadow']

  if (!data.members || data.members.length === 0) return null

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className={`section ${bgClass}`}>
      <div className="container-glos">
        {(data.title || data.subtitle) ? (
          <div className={`text-center mb-12 ${textColor}`}>
            {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
            {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
          </div>
        ) : null}

        {/* Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`grid grid-cols-1 ${gridCols[columns as keyof typeof gridCols]} gap-8`}
        >
          {data.members.map((member) => (
            <motion.div
              key={member._key}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-2xl bg-white ${cardStyle} text-center`}
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
                <p className="text-primary font-medium mb-3">{t(member.role)}</p>
              ) : null}

              {data.showBio && member.bio ? (
                <p className="text-gray-600 text-sm mb-4">{t(member.bio)}</p>
              ) : null}

              {/* Contact & Social */}
              {data.showSocial && (
                <div className="flex justify-center gap-3 mt-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-all"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/\s/g, '')}`}
                      className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-all"
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 hover:bg-[#0077B5] hover:text-white transition-all"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
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
