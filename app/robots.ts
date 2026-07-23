import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/metadata'

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL.replace(/\/+$/, '')
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Endpoint tecnici e pagine non destinate all'indicizzazione.
        disallow: ['/api/', '/studio', '/studio/', '/test-hero'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
