// Internationalization Utilities
export type Locale = 'it' | 'en' | 'es'

export const defaultLocale: Locale = 'it'

export const locales: Locale[] = ['it', 'en', 'es']

export const localeNames: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
  es: 'Espanol',
}

export const localeFlags: Record<Locale, string> = {
  it: '🇮🇹',
  en: '🇬🇧',
  es: '🇪🇸',
}

// Helper per ottenere testo localizzato
export function getLocalizedValue<T>(
  obj: { it?: T; en?: T; es?: T } | undefined | null,
  locale: Locale
): T | undefined {
  if (!obj) return undefined

  // Prova la lingua richiesta
  if (obj[locale] !== undefined && obj[locale] !== null && obj[locale] !== '') {
    return obj[locale]
  }

  // Fallback all'italiano
  if (obj.it !== undefined && obj.it !== null && obj.it !== '') {
    return obj.it
  }

  // Fallback all'inglese
  if (obj.en !== undefined && obj.en !== null && obj.en !== '') {
    return obj.en
  }

  // Ultimo fallback: qualsiasi valore disponibile
  return obj.it || obj.en || obj.es
}

// Alias breve
export const t = getLocalizedValue

// Helper per ottenere la lingua dal path
export function getLocaleFromPath(path: string): Locale {
  const segments = path.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale
  }

  return defaultLocale
}

// Helper per costruire path con lingua
export function buildLocalizedPath(path: string, locale: Locale): string {
  // Rimuovi locale esistente dal path
  const cleanPath = path.replace(/^\/(it|en|es)/, '')

  if (locale === defaultLocale) {
    return cleanPath || '/'
  }

  return `/${locale}${cleanPath || ''}`
}

// Helper per meta tag hreflang
export function getHrefLangAlternates(path: string): Array<{ lang: string; url: string }> {
  const basePath = path.replace(/^\/(it|en|es)/, '') || '/'

  return locales.map((locale) => ({
    lang: locale,
    url: locale === defaultLocale ? basePath : `/${locale}${basePath}`,
  }))
}
