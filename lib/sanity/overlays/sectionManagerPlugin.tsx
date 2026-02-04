// Section Manager - Overlay Plugin (HUD)
// Shows move up/down and delete buttons on sections when hovering in visual editing
'use client'

import { type OverlayPlugin } from '@sanity/visual-editing'
import { useDocuments } from '@sanity/visual-editing/react'
import { at, unset, insert } from '@sanity/mutate'
import { type CSSProperties } from 'react'

export function sectionManagerPlugin(): OverlayPlugin {
  return {
    name: 'section-manager',
  }
}

// Extract _key from path like sections[_key=="abc123"]
function extractKeyFromPath(path: string): string | null {
  const match = path.match(/_key=="([^"]+)"/)
  return match ? match[1] : null
}

const hudStyles: CSSProperties = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  display: 'flex',
  gap: '4px',
  zIndex: 9999,
  backgroundColor: 'rgba(26, 26, 46, 0.9)',
  backdropFilter: 'blur(8px)',
  borderRadius: '8px',
  padding: '4px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
}

const buttonStyle: CSSProperties = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: 'transparent',
  color: 'white',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.15s',
}

const deleteButtonStyle: CSSProperties = {
  ...buttonStyle,
  color: '#e63946',
}

interface SectionManagerHUDProps {
  node: {
    id: string
    path: string
  }
}

function SectionManagerHUD({ node }: SectionManagerHUDProps) {
  const { id, path } = node
  const { getDocument } = useDocuments()
  const doc = getDocument(id)

  const handleDelete = () => {
    if (!confirm('Eliminare questa sezione?')) return
    doc.patch(() => [at(path, unset())])
  }

  const handleMoveUp = () => {
    doc.patch(async ({ getSnapshot }) => {
      const snapshot = await getSnapshot()
      const sections = (snapshot as any)?.sections || []
      const key = extractKeyFromPath(path)
      if (!key) return []

      const idx = sections.findIndex((s: any) => s._key === key)
      if (idx <= 0) return []

      const item = sections[idx]
      return [
        at(`sections[_key=="${key}"]`, unset()),
        at('sections', insert(item, 'before', sections[idx - 1]._key)),
      ]
    })
  }

  const handleMoveDown = () => {
    doc.patch(async ({ getSnapshot }) => {
      const snapshot = await getSnapshot()
      const sections = (snapshot as any)?.sections || []
      const key = extractKeyFromPath(path)
      if (!key) return []

      const idx = sections.findIndex((s: any) => s._key === key)
      if (idx < 0 || idx >= sections.length - 1) return []

      const item = sections[idx]
      return [
        at(`sections[_key=="${key}"]`, unset()),
        at('sections', insert(item, 'after', sections[idx + 1]._key)),
      ]
    })
  }

  return (
    <div style={hudStyles}>
      <button
        onClick={handleMoveUp}
        style={buttonStyle}
        title="Sposta su"
        onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)' }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = 'transparent' }}
      >
        &#x25B2;
      </button>
      <button
        onClick={handleMoveDown}
        style={buttonStyle}
        title="Sposta giu"
        onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)' }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = 'transparent' }}
      >
        &#x25BC;
      </button>
      <button
        onClick={handleDelete}
        style={deleteButtonStyle}
        title="Elimina sezione"
        onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = 'rgba(230,57,70,0.2)' }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = 'transparent' }}
      >
        &#x2715;
      </button>
    </div>
  )
}

export default SectionManagerHUD
