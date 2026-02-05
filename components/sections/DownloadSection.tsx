// Download Section Component
'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Download, FileText, FileSpreadsheet, FileImage, Film, Archive, File } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'
import { getSpacingClasses } from '@/lib/utils/spacing'

interface DownloadSectionProps {
  documentId?: string
  sectionKey?: string
  data: {
    title?: unknown
    subtitle?: unknown
    description?: unknown
    files?: Array<{
      _key: string
      title?: unknown
      description?: unknown
      file?: { asset?: { url?: string } }
      thumbnail?: any
      fileType?: string
      fileSize?: string
      category?: string
    }>
    layout?: string
    columns?: number
    showThumbnails?: boolean
    showFileSize?: boolean
    groupByCategory?: boolean
    backgroundColor?: string
    paddingTop?: string
    paddingBottom?: string
    paddingY?: string
    marginTop?: string
    marginBottom?: string
  }
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
}

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-8 h-8 text-red-500" />,
  doc: <FileText className="w-8 h-8 text-blue-500" />,
  xls: <FileSpreadsheet className="w-8 h-8 text-green-500" />,
  image: <FileImage className="w-8 h-8 text-purple-500" />,
  video: <Film className="w-8 h-8 text-pink-500" />,
  zip: <Archive className="w-8 h-8 text-yellow-600" />,
  other: <File className="w-8 h-8 text-gray-500" />,
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

export default function DownloadSection({ data, documentId, sectionKey }: DownloadSectionProps) {
  const { t } = useLanguage()
  const bgClass = bgClasses[data.backgroundColor || 'gray']
  const textColor = data.backgroundColor?.includes('dark') ? 'text-white' : 'text-gray-900'
  const layout = data.layout || 'grid'
  const columns = data.columns || 3

  if (!data.files || data.files.length === 0) return null

  // Group by category if enabled
  const groupedFiles = data.groupByCategory
    ? data.files.reduce((acc, file) => {
        const category = file.category || 'Altro'
        if (!acc[category]) acc[category] = []
        acc[category].push(file)
        return acc
      }, {} as Record<string, typeof data.files>)
    : { '': data.files }

  const gridCols: Record<number, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  const renderFile = (file: typeof data.files[0]) => {
    const fileUrl = file.file?.asset?.url
    if (!fileUrl) return null

    return (
      <motion.a
        key={file._key}
        href={fileUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        className={`group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all ${
          layout?.includes('list') ? 'flex items-center' : ''
        }`}
      >
        {/* Thumbnail */}
        {data.showThumbnails && !layout?.includes('compact') && (
          <div className={`relative ${layout?.includes('list') ? 'w-24 h-24 flex-shrink-0' : 'aspect-video'} bg-gray-100`}>
            {isValidImage(file.thumbnail) ? (
              <Image
                src={safeImageUrl(file.thumbnail, 400, 300)!}
                alt=""
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                {fileIcons[file.fileType || 'other']}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`p-4 ${layout?.includes('list') ? 'flex-1 flex items-center justify-between' : ''}`}>
          <div className={layout?.includes('list') ? 'flex items-center gap-4' : ''}>
            {/* Icon for compact/list layout */}
            {(layout?.includes('compact') || layout?.includes('list')) && (
              <div className="flex-shrink-0">
                {fileIcons[file.fileType || 'other']}
              </div>
            )}

            <div>
              <h3 className={`font-semibold group-hover:text-primary transition-colors ${textColor}`}>
                {String(t(file.title) || '')}
              </h3>
              {file.description && !layout?.includes('compact') ? (
                <p className="text-sm text-gray-600 mt-1">{String(t(file.description) || '')}</p>
              ) : null}
              {data.showFileSize && file.fileSize && (
                <span className="text-xs text-gray-500 mt-1 block">{file.fileSize}</span>
              )}
            </div>
          </div>

          {/* Download indicator */}
          <div className={`${layout?.includes('list') ? '' : 'mt-3'} flex items-center gap-2 text-primary`}>
            <Download className="w-5 h-5 group-hover:animate-bounce" />
            <span className="text-sm font-medium">Scarica</span>
          </div>
        </div>
      </motion.a>
    )
  }

  return (
    <section data-sanity-edit-target className={`${getSpacingClasses(data)} ${bgClass}`}>
      <div className="container-glos">
        {(data.title || data.subtitle) ? (
          <div className={`text-center mb-12 ${textColor}`}>
            {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
            {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
            {data.description ? (
              <div className="prose prose-lg max-w-2xl mx-auto mt-4">
                <RichText value={data.description} />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Files */}
        {Object.entries(groupedFiles).map(([category, files]) => (
          <div key={category} className="mb-8 last:mb-0">
            {/* Category Header */}
            {category && data.groupByCategory && (
              <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>{category}</h3>
            )}

            {/* Files Grid/List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={
                layout?.includes('list')
                  ? 'space-y-4'
                  : `grid grid-cols-1 ${gridCols[columns]} gap-6`
              }
            >
              {files.map(renderFile)}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  )
}
