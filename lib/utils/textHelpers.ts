// Helper per gestire campi che possono essere stringhe o oggetti multilingua

export type Language = 'it' | 'en' | 'es'

/**
 * Estrae il valore testuale da un campo che può essere:
 * - Una stringa semplice
 * - Un oggetto multilingua {it, en, es}
 * - Un oggetto indirizzo {street, city, province, postalCode, country}
 * - null/undefined
 *
 * @param value - Il valore da estrarre
 * @param lang - Lingua preferita (default: 'it')
 */
export function getTextValue(value: unknown, lang: Language = 'it'): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    // Se è un oggetto multilingua {it, en, es}
    if ('it' in obj || 'en' in obj || 'es' in obj) {
      // Prova la lingua richiesta, poi fallback a italiano, poi inglese
      return String(obj[lang] || obj.it || obj.en || obj.es || '')
    }
    // Se è un oggetto indirizzo {street, city, ...}
    if ('street' in obj || 'city' in obj) {
      const addr = obj as { street?: string; city?: string; province?: string; postalCode?: string; country?: string }
      return [addr.street, addr.city, addr.province, addr.postalCode, addr.country]
        .filter(Boolean)
        .join(', ')
    }
  }
  return ''
}

// Alias breve per comodità (usa italiano come default)
export const t = getTextValue
