// Inline Text Editor - Overlay Plugin (exclusive)
// Enables inline text editing directly in the preview
'use client'

import { type OverlayPlugin } from '@sanity/visual-editing'
import { useDocuments } from '@sanity/visual-editing/react'
import { at, set } from '@sanity/mutate'
import { useState, useRef, useEffect, type CSSProperties } from 'react'

export function inlineTextPlugin(): OverlayPlugin {
  return {
    name: 'inline-text-editor',
  }
}

// Styles
const editorStyles: CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#1a1a2e',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  zIndex: 99999,
  minWidth: '400px',
  maxWidth: '600px',
}

const textareaStyles: CSSProperties = {
  width: '100%',
  minHeight: '120px',
  backgroundColor: '#2a2a4e',
  color: 'white',
  border: '1px solid #444',
  borderRadius: '8px',
  padding: '12px',
  fontSize: '14px',
  fontFamily: 'inherit',
  resize: 'vertical',
  outline: 'none',
}

const buttonBarStyles: CSSProperties = {
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
  marginTop: '12px',
}

const saveButtonStyle: CSSProperties = {
  backgroundColor: '#0047AB',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '8px 20px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
}

const cancelButtonStyle: CSSProperties = {
  backgroundColor: 'transparent',
  color: '#aaa',
  border: '1px solid #555',
  borderRadius: '6px',
  padding: '8px 20px',
  fontSize: '13px',
  cursor: 'pointer',
}

interface InlineTextEditorProps {
  node: {
    id: string
    path: string
    type: string
  }
  closeExclusiveView: () => void
}

function InlineTextEditor({ node, closeExclusiveView }: InlineTextEditorProps) {
  const { id, path } = node
  const { getDocument } = useDocuments()
  const doc = getDocument(id)
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  const handleSave = () => {
    doc.patch(() => [at(path, set(value))])
    closeExclusiveView()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeExclusiveView()
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave()
    }
  }

  return (
    <div style={editorStyles} onKeyDown={handleKeyDown}>
      <div style={{ color: '#888', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Modifica Testo
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={textareaStyles}
        placeholder="Inserisci il testo..."
      />
      <div style={buttonBarStyles}>
        <button onClick={closeExclusiveView} style={cancelButtonStyle}>
          Annulla
        </button>
        <button onClick={handleSave} style={saveButtonStyle}>
          Salva
        </button>
      </div>
      <div style={{ color: '#666', fontSize: '10px', marginTop: '8px' }}>
        Cmd+Enter per salvare, Esc per annullare
      </div>
    </div>
  )
}

export default InlineTextEditor
