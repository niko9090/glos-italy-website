// Root Layout - v3.1.0 Visual Editing with React 19
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { draftMode } from 'next/headers'
import { getSiteSettings, getNavigation } from '@/lib/sanity/fetch'
import { SanityLive } from '@/lib/sanity/live'
import { VisualEditing } from 'next-sanity'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageTransition from '@/components/layout/PageTransition'
import SkipLink from '@/components/accessibility/SkipLink'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { LanguageProvider } from '@/lib/context/LanguageContext'
import { generateSiteMetadata, SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { getTextValue } from '@/lib/utils/textHelpers'
import { OrganizationSchema, WebsiteSchema } from '@/components/seo/JsonLd'

// Font Inter - font principale per tutto il sito (look industriale/meccanico)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

// Viewport config (themeColor moved here from metadata - Next.js 15)
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
}

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
  const [settings, navigation] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
  ])

  const dm = await draftMode()
  const isDraft = dm.isEnabled

  // Prepare company info for structured data
  const companyName = getTextValue(settings?.companyName) || SITE_NAME
  const slogan = getTextValue(settings?.slogan) || 'Prodotti di qualita Made in Italy'

  return (
    <html lang="it" className={inter.variable}>
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
        {/* WhatsApp Floating Button */}
        <WhatsAppButton
          phoneNumber={settings?.whatsapp || '39XXXXXXXXXX'}
          message={settings?.whatsappMessage || 'Ciao, vorrei informazioni sui vostri prodotti.'}
        />
        {/* SanityLive - handles live content updates in real-time */}
        <SanityLive />
        {/* Visual Editing - active only in draft mode */}
        {isDraft && <VisualEditing />}
      </body>
    </html>
  )
}
