// SectionsClient - Client component for visual editing with data-sanity attributes
// Compatible with @sanity/visual-editing v2.x + React 18
'use client'

import { createDataAttribute } from '@sanity/visual-editing'
import { SectionRenderer } from './SectionRenderer'
import type { Product } from '@/lib/sanity/fetch'

const DATA_ATTR_CONFIG = {
  projectId: '97oreljh',
  dataset: 'production',
  baseUrl: 'https://glositalystudio.vercel.app',
}

interface SectionsClientProps {
  documentId: string
  documentType: string
  sections: any[]
  products?: Product[]
}

export function SectionsClient({ documentId, documentType, sections, products }: SectionsClientProps) {
  if (!sections || sections.length === 0) return null

  const containerAttr = createDataAttribute({
    ...DATA_ATTR_CONFIG,
    id: documentId,
    type: documentType,
    path: 'sections',
  })

  return (
    <div data-sanity={containerAttr.toString()}>
      {sections.map((section, index) => {
        if (!section || !section._type) return null

        const sectionAttr = section._key
          ? createDataAttribute({
              ...DATA_ATTR_CONFIG,
              id: documentId,
              type: documentType,
              path: `sections[_key=="${section._key}"]`,
            })
          : undefined

        return (
          <div key={section._key || index} data-sanity={sectionAttr?.toString()}>
            <SectionRenderer
              section={section}
              products={products}
              documentId={documentId}
              sectionKey={section._key}
            />
          </div>
        )
      })}
    </div>
  )
}

export default SectionsClient
