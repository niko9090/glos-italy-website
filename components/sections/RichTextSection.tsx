// Rich Text Section Component
'use client'

import { motion } from 'framer-motion'
import RichText from '@/components/RichText'

interface RichTextSectionProps {
  data: {
    title?: unknown
    content?: unknown
    columns?: number
    maxWidth?: string
    textAlign?: string
    dropCap?: boolean
    backgroundColor?: string
    verticalPadding?: string
  }
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
}

const paddingClasses: Record<string, string> = {
  small: 'py-8 md:py-12',
  medium: 'py-12 md:py-20',
  large: 'py-20 md:py-32',
}

const maxWidthClasses: Record<string, string> = {
  narrow: 'max-w-2xl',
  medium: 'max-w-4xl',
  wide: 'max-w-6xl',
  full: 'max-w-none',
}

const textAlignClasses: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

export default function RichTextSection({ data }: RichTextSectionProps) {
  const bgClass = bgClasses[data.backgroundColor || 'white']
  const paddingClass = paddingClasses[data.verticalPadding || 'medium']
  const textColor = data.backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'
  const maxWidth = maxWidthClasses[data.maxWidth || 'medium']
  const textAlign = textAlignClasses[data.textAlign || 'left']
  const columns = data.columns || 1

  const columnClasses: Record<number, string> = {
    1: '',
    2: 'md:columns-2 gap-8',
    3: 'md:columns-2 lg:columns-3 gap-8',
  }

  return (
    <section className={`${paddingClass} ${bgClass}`}>
      <div className="container-glos">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`${maxWidth} mx-auto ${textColor}`}
        >
          {/* Title */}
          {data.title && (
            <h2 className={`section-title mb-8 ${textAlign}`}>
              <RichText value={data.title} />
            </h2>
          )}

          {/* Content */}
          {data.content && (
            <div
              className={`prose prose-lg max-w-none ${textAlign} ${columnClasses[columns]} ${
                data.dropCap ? 'first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-primary' : ''
              }`}
            >
              <RichText value={data.content} />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
