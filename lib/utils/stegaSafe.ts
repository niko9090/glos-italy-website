// Utility per gestire stringhe con caratteri stega invisibili
// In Sanity draft mode, i valori stringa hanno caratteri Unicode invisibili
// (Zero Width Space, etc.) che rompono i lookup esatti nei Record/Map.

/**
 * Stega-safe Record lookup.
 * In produzione (no stega): match esatto, zero overhead.
 * In draft mode (stega): fallback su includes() per trovare la chiave giusta.
 * Ordina le chiavi per lunghezza decrescente per matchare la più specifica.
 */
export function sl<T>(map: Record<string, T>, key: string | undefined, fallback: string): T {
  if (!key) return map[fallback]
  // Fast path: exact match (production)
  if (key in map) return map[key]
  // Stega path: find key via includes (draft mode)
  const match = Object.keys(map)
    .sort((a, b) => b.length - a.length)
    .find(k => k.length > 0 && key.includes(k))
  return match ? map[match] : map[fallback]
}

/**
 * Pulisce una stringa dai caratteri stega per switch/case e comparazioni esatte.
 */
export function cs(value?: string): string {
  return value?.replace(/[\u200B-\u200D\uFEFF]/g, '') ?? ''
}
