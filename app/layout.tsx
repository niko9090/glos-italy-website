// Root Layout
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { getSiteSettings, getNavigation } from '@/lib/sanity/fetch'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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

  return {
    title: {
      default: settings?.seo?.title || 'GLOS Italy',
      template: '%s | GLOS Italy',
    },
    description: settings?.seo?.description?.it || 'Prodotti di qualita Made in Italy',
    keywords: settings?.seo?.keywords || [],
    openGraph: {
      type: 'website',
      locale: 'it_IT',
      siteName: settings?.companyName || 'GLOS Italy',
    },
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

  return (
    <html lang="it" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <Header settings={settings} navigation={navigation} />
        <main className="flex-grow">{children}</main>
        <Footer settings={settings} navigation={navigation} />
      </body>
    </html>
  )
}
