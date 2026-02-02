// Root Layout
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity'
import './globals.css'
import { getSiteSettings, getNavigation } from '@/lib/sanity/fetch'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageTransition from '@/components/layout/PageTransition'
import SkipLink from '@/components/accessibility/SkipLink'
import { LanguageProvider } from '@/lib/context/LanguageContext'
import { generateSiteMetadata, SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { getTextValue } from '@/lib/utils/textHelpers'
import { OrganizationSchema, WebsiteSchema } from '@/components/seo/JsonLd'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  // Use enhanced metadata generation
  const baseMetadata = generateSiteMetadata(settings)

  return {
    ...baseMetadata,
    // Additional SEO enhancements
    alternates: {
      canonical: SITE_URL,
      languages: {
        'it-IT': SITE_URL,
        'en-US': `${SITE_URL}/en`,
        'es-ES': `${SITE_URL}/es`,
      },
    },
    // Icons configuration
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    // Manifest
    manifest: '/site.webmanifest',
    // Theme color
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
    ],
    // Category
    category: 'technology',
    // Classification
    classification: 'Industrial Machinery',
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // CORRETTO: draftMode() e' async in Next.js 14.x App Router
  const { isEnabled: isDraftMode } = await draftMode()

  const [settings, navigation] = await Promise.all([
    getSiteSettings(isDraftMode),
    getNavigation(isDraftMode),
  ])

  // Prepare company info for structured data
  const companyName = getTextValue(settings?.companyName) || SITE_NAME
  const slogan = getTextValue(settings?.slogan) || 'Prodotti di qualita Made in Italy'

  return (
    <html lang="it" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Global Structured Data - Organization and Website schemas */}
        <OrganizationSchema data={settings || {}} />
        <WebsiteSchema name={companyName} description={slogan} />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <LanguageProvider>
          <SkipLink />
          <Header settings={settings} navigation={navigation} />
          <main id="main-content" className="flex-grow" tabIndex={-1}>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer settings={settings} navigation={navigation} />
        </LanguageProvider>
        {/* Visual Editing per Sanity - attivo solo in draft mode */}
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  )
}
