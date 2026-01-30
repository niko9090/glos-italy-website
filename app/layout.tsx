// Root Layout
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity'
import './globals.css'
import { getSiteSettings, getNavigation } from '@/lib/sanity/fetch'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// Helper per estrarre valore da campo che può essere stringa o oggetto multilingua
function getTextValue(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if ('it' in obj) return String(obj.it || obj.en || obj.es || '')
  }
  return ''
}

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
  const companyName = getTextValue(settings?.companyName) || 'GLOS Italy'
  const slogan = getTextValue(settings?.slogan) || 'Prodotti di qualita Made in Italy'

  return {
    title: {
      default: companyName,
      template: '%s | GLOS Italy',
    },
    description: slogan,
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      siteName: companyName,
    },
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

  return (
    <html lang="it" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <Header settings={settings} navigation={navigation} />
        <main className="flex-grow">{children}</main>
        <Footer settings={settings} navigation={navigation} />
        {/* Visual Editing per Sanity - attivo solo in draft mode */}
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  )
}
