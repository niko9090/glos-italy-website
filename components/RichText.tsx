// Componente per renderizzare Rich Text da Sanity
'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'

// Tipi per i blocchi Portable Text
type PortableTextBlock = {
  _type: string
  _key?: string
  children?: any[]
  markDefs?: any[]
  style?: string
  listItem?: string
  level?: number
}

// Props del componente
interface RichTextProps {
  value: unknown
  className?: string
}

// Mappa colori per testo
const textColorMap: Record<string, string> = {
  black: 'text-gray-900',
  white: 'text-white',
  gray: 'text-gray-500',
  primary: 'text-primary',
  green: 'text-green-600',
  red: 'text-red-600',
  orange: 'text-orange-500',
  purple: 'text-purple-600',
}

// Mappa colori per evidenziazione
const highlightColorMap: Record<string, string> = {
  yellow: 'bg-yellow-200',
  lightgreen: 'bg-green-200',
  lightblue: 'bg-blue-200',
  pink: 'bg-pink-200',
  lightgray: 'bg-gray-200',
}

// Mappa dimensioni font
const fontSizeMap: Record<string, string> = {
  small: 'text-sm',
  normal: 'text-base',
  large: 'text-lg',
  xlarge: 'text-xl',
  xxlarge: 'text-2xl',
}

// Componenti custom per Portable Text
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
    h1: ({ children }) => <h1 className="text-4xl font-bold mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-semibold mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    'strike-through': ({ children }) => <span className="line-through">{children}</span>,
    code: ({ children }) => (
      <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm">{children}</code>
    ),
    link: ({ children, value }) => {
      const href = value?.href || '#'
      const target = value?.openInNewTab ? '_blank' : undefined
      const rel = value?.openInNewTab ? 'noopener noreferrer' : undefined

      // Check if it's an internal link
      if (href.startsWith('/')) {
        return (
          <Link href={href} className="text-primary hover:underline">
            {children}
          </Link>
        )
      }

      return (
        <a href={href} target={target} rel={rel} className="text-primary hover:underline">
          {children}
        </a>
      )
    },
    textColor: ({ children, value }) => {
      const colorClass = textColorMap[value?.color] || ''
      return <span className={colorClass}>{children}</span>
    },
    highlight: ({ children, value }) => {
      const colorClass = highlightColorMap[value?.color] || 'bg-yellow-200'
      return <span className={`${colorClass} px-1 rounded`}>{children}</span>
    },
    fontSize: ({ children, value }) => {
      const sizeClass = fontSizeMap[value?.size] || ''
      return <span className={sizeClass}>{children}</span>
    },
    textAlign: ({ children, value }) => {
      const alignClass = value?.align ? `text-${value.align}` : ''
      return <span className={`block ${alignClass}`}>{children}</span>
    },
  },
}

// Estrae il contenuto dalla struttura multilingua
function extractContent(value: unknown): PortableTextBlock[] | string | null {
  if (!value) return null

  // Se è già un array (Portable Text diretto)
  if (Array.isArray(value)) {
    return value
  }

  // Se è una stringa
  if (typeof value === 'string') {
    return value
  }

  // Se è un oggetto multilingua
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>

    // Prova a estrarre la lingua italiana, poi inglese, poi spagnola
    const content = obj.it || obj.en || obj.es

    if (Array.isArray(content)) {
      return content as PortableTextBlock[]
    }

    if (typeof content === 'string') {
      return content
    }
  }

  return null
}

export default function RichText({ value, className = '' }: RichTextProps) {
  const content = extractContent(value)

  if (!content) {
    return null
  }

  // Se è una stringa semplice, renderizza come paragrafo
  if (typeof content === 'string') {
    return <p className={className}>{content}</p>
  }

  // Se è Portable Text, usa il renderer
  return (
    <div className={className}>
      <PortableText value={content} components={components} />
    </div>
  )
}

// Export anche una versione inline senza wrapper div
export function RichTextInline({ value, className = '' }: RichTextProps) {
  const content = extractContent(value)

  if (!content) {
    return null
  }

  if (typeof content === 'string') {
    return <span className={className}>{content}</span>
  }

  return (
    <span className={className}>
      <PortableText value={content} components={components} />
    </span>
  )
}
