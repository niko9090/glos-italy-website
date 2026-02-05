// Rich Text Section Component
'use client'

import { motion } from 'framer-motion'
import { getSpacingClasses } from '@/lib/utils/spacing'
import { sl } from '@/lib/utils/stegaSafe'
import RichText from '@/components/RichText'

interface RichTextSectionProps {
  documentId?: string
  sectionKey?: string
  data: {
    title?: unknown
    content?: unknown
    columns?: number
    contentWidth?: string  // Schema: 'narrow' | 'normal' | 'wide' | 'full'
    textAlign?: string     // Schema: 'left' | 'center' | 'right' | 'justify'
    dropCap?: boolean
    backgroundColor?: string  // Schema: 'white' | 'gray-light' | 'cream' | 'primary-light' | 'black' | 'gradient'
    // Spacing
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string // legacy
    marginTop?: string
    marginBottom?: string
    dividers?: string      // Schema: 'none' | 'top' | 'bottom' | 'both'
  }
}

// Background classes matching schema values
const bgClasses: Record<string, string> = {
  'white': 'bg-white',
  'gray-light': 'bg-gray-50',
  'cream': 'bg-amber-50',
  'primary-light': 'bg-blue-50',
  'black': 'bg-gray-900',
  'gradient': 'bg-gradient-to-br from-gray-50 to-blue-50',
}

// Padding classes matching schema values
const paddingClasses: Record<string, string> = {
  'none': 'py-0',
  'sm': 'py-8 md:py-12',
  'md': 'py-12 md:py-16',
  'lg': 'py-16 md:py-24',
  'xl': 'py-24 md:py-32',
}

// Content width classes matching schema values
const contentWidthClasses: Record<string, string> = {
  'narrow': 'max-w-2xl',
  'normal': 'max-w-4xl',
  'wide': 'max-w-6xl',
  'full': 'max-w-none',
}

const textAlignClasses: Record<string, string> = {
  'left': 'text-left',
  'center': 'text-center',
  'right': 'text-right',
  'justify': 'text-justify',
}

// Divider classes matching schema values
const getDividerClasses = (dividers: string | undefined): string => {
  switch (dividers) {
    case 'top':
      return 'border-t border-gray-200'
    case 'bottom':
      return 'border-b border-gray-200'
    case 'both':
      return 'border-t border-b border-gray-200'
    default:
      return ''
  }
}

export default function RichTextSection({ data, documentId, sectionKey }: RichTextSectionProps) {
  const bgClass = sl(bgClasses, data.backgroundColor, 'white')
  const spacingClass = getSpacingClasses(data)
  const textColor = data.backgroundColor === 'black' ? 'text-white' : 'text-gray-900'
  const contentWidth = sl(contentWidthClasses, data.contentWidth, 'normal')
  const textAlign = sl(textAlignClasses, data.textAlign, 'left')
  const dividerClass = getDividerClasses(data.dividers)
  const columns = data.columns || 1

  const columnClasses: Record<number, string> = {
    1: '',
    2: 'md:columns-2 gap-8',
    3: 'md:columns-2 lg:columns-3 gap-8',
  }

  return (
    <section data-sanity-edit-target className={`${spacingClass} ${bgClass} ${dividerClass}`}>
      <div className="container-glos">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`${contentWidth} mx-auto ${textColor}`}
        >
          {data.title ? (
            <h2 className={`section-title mb-8 ${textAlign}`}>
              <RichText value={data.title} />
            </h2>
          ) : null}

          {data.content ? (
            <div
              className={`prose prose-lg max-w-none ${textAlign} ${columnClasses[columns]} ${
                data.dropCap ? 'first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-primary' : ''
              }`}
            >
              <RichText value={data.content} />
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}
