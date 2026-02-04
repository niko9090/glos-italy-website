// Section Manager - Overlay HUD Component
// Shows move up/down and delete buttons on sections
// NOTE: OverlayPlugin/useDocuments API requires @sanity/visual-editing v5+ (React 19)
// This component is exported standalone for future use when upgrading to React 19
'use client'

import { type CSSProperties } from 'react'

// Standalone plugin definition (compatible with v2.x)
export function sectionManagerPlugin() {
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
  onMoveUp?: () => void
  onMoveDown?: () => void
  onDelete?: () => void
}

export function SectionManagerHUD({ node, onMoveUp, onMoveDown, onDelete }: SectionManagerHUDProps) {
  const handleDelete = () => {
    if (!confirm('Eliminare questa sezione?')) return
    onDelete?.()
  }

  return (
    <div style={hudStyles}>
      <button
        onClick={onMoveUp}
        style={buttonStyle}
        title="Sposta su"
        onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)' }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = 'transparent' }}
      >
        &#x25B2;
      </button>
      <button
        onClick={onMoveDown}
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
