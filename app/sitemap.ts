import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'
import { SITE_URL } from '@/lib/seo/metadata'

// Rigenera la sitemap al massimo una volta all'ora.
export const revalidate = 3600

type ChangeFreq = MetadataRoute.Sitemap[number]['changeFrequency']

// Rotte statiche sempre presenti nel sito.
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: ChangeFreq }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/chi-siamo', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/prodotti', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/settori', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/listino-prezzi', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/community', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/case-studies', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/cookie', priority: 0.2, changeFrequency: 'yearly' },
]

// Slug gestiti da rotte dedicate o non indicizzabili: da non duplicare fra le pagine CMS.
const EXCLUDED_PAGE_SLUGS = new Set(['home', 'test-hero'])

interface SlugDoc {
  slug: string
  updatedAt?: string
}

// Interroga Sanity in modo isolato: un errore su un tipo non compromette il resto
// della sitemap (la build non deve mai fallire per un problema del CMS).
async function safeSlugs(query: string): Promise<SlugDoc[]> {
  try {
    const docs = await client.fetch<SlugDoc[]>(query)
    return Array.isArray(docs) ? docs : []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/+$/, '')
  const now = new Date()

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const add = (path: string, doc: SlugDoc, priority: number) => {
    if (!doc.slug) return
    entries.push({
      url: `${base}${path}/${doc.slug}`,
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : now,
      changeFrequency: 'monthly',
      priority,
    })
  }

  // Pagine CMS con almeno una sezione (le pagine vuote non vanno indicizzate).
  const pages = await safeSlugs(
    `*[_type == "page" && defined(slug.current) && isPublished != false && count(sections) > 0]{ "slug": slug.current, "updatedAt": _updatedAt }`
  )
  for (const p of pages) {
    if (EXCLUDED_PAGE_SLUGS.has(p.slug)) continue
    add('', p, 0.6)
  }

  const products = await safeSlugs(
    `*[_type == "product" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`
  )
  for (const p of products) add('/prodotti', p, 0.7)

  const sectors = await safeSlugs(
    `*[_type == "sector" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`
  )
  for (const s of sectors) add('/settori', s, 0.6)

  const caseStudies = await safeSlugs(
    `*[_type == "caseStudy" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }`
  )
  for (const c of caseStudies) add('/case-studies', c, 0.5)

  // Deduplica per URL: una pagina CMS puo condividere il path con una rotta statica
  // (es. /chi-siamo). Teniamo la prima occorrenza (le rotte statiche vengono prima).
  const seen = new Set<string>()
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
