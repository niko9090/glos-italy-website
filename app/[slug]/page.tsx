// Dynamic Page
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPageBySlug, getPageSlugs } from '@/lib/sanity/fetch'
import { t, defaultLocale } from '@/lib/i18n'
import { SectionRenderer } from '@/components/sections/SectionRenderer'

export const revalidate = 60

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getPageSlugs()
  return slugs
    .filter((slug) => slug !== 'home')
    .map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    return { title: 'Pagina non trovata' }
  }

  const title = t(page.title, defaultLocale) || 'GLOS Italy'
  const description = t(page.description, defaultLocale) || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug)

  if (!page) {
    notFound()
  }

  return (
    <>
      {page.sections?.map((section, index) => (
        <SectionRenderer key={section._key || index} section={section} />
      ))}
    </>
  )
}
