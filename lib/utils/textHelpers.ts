// Helper per gestire campi che possono essere stringhe o oggetti multilingua

/**
 * Estrae il valore testuale da un campo che può essere:
 * - Una stringa semplice
 * - Un oggetto multilingua {it, en, es}
 * - Un oggetto indirizzo {street, city, province, postalCode, country}
 * - null/undefined
 */
export function getTextValue(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    // Se è un oggetto multilingua {it, en, es}
    if ('it' in obj || 'en' in obj || 'es' in obj) {
      return String(obj.it || obj.en || obj.es || '')
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

// Alias breve per comodità
export const t = getTextValue
