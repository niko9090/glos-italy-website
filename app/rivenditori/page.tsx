// Dealers Page - v1.8.0 - With translations
import { Metadata } from 'next'
import { getAllDealers, getSiteSettings, getAllTestimonials } from '@/lib/sanity/fetch'
import { SITE_URL, SITE_NAME } from '@/lib/seo/metadata'
import { OrganizationSchema, BreadcrumbSchema, WebPageSchema, LocalBusinessSchema } from '@/components/seo/JsonLd'
import RivenditoriClient from './RivenditoriClient'

export const metadata: Metadata = {
  title: 'Community',
  description: 'Entra nella Community GLOS Italy. Unisciti alla nostra community in Italia e Europa.',
  alternates: {
    canonical: `${SITE_URL}/rivenditori`,
  },
  openGraph: {
    title: 'Community | GLOS Italy',
    description: 'Entra nella Community GLOS Italy. Unisciti alla nostra community in Italia e Europa.',
    url: `${SITE_URL}/rivenditori`,
    siteName: SITE_NAME,
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community | GLOS Italy',
    description: 'Entra nella Community GLOS Italy. Unisciti alla nostra community in Italia e Europa.',
  },
}

export default async function DealersPage() {
  const [dealers, settings, testimonials] = await Promise.all([
    getAllDealers(),
    getSiteSettings(),
    getAllTestimonials(),
  ])

  // Separa featured per LocalBusiness schema
  const featuredDealers = dealers.filter((d) => d.isFeatured)

  // Breadcrumb data
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Community', url: '/rivenditori' },
  ]

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema data={settings || {}} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <WebPageSchema
        title="Community GLOS Italy"
        description="Entra nella Community GLOS Italy. Unisciti alla nostra community."
        url="/rivenditori"
      />
      {/* LocalBusiness schema for featured dealers */}
      {featuredDealers.slice(0, 5).map((dealer) => (
        <LocalBusinessSchema
          key={dealer._id}
          data={{
            name: dealer.name,
            description: dealer.description,
            logo: dealer.logo,
            address: dealer.address,
            city: dealer.city,
            country: dealer.country,
            phone: dealer.phone,
            email: dealer.email,
            location: dealer.location,
            openingHours: dealer.openingHours,
          }}
        />
      ))}

      <RivenditoriClient dealers={dealers} testimonials={testimonials} />
    </>
  )
}
