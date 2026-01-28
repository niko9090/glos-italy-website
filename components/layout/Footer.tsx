// Footer Component
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { urlFor } from '@/lib/sanity/client'
import { t, defaultLocale } from '@/lib/i18n'
import type { SiteSettings, Navigation } from '@/lib/sanity/fetch'

interface FooterProps {
  settings: SiteSettings | null
  navigation: Navigation | null
}

export default function Footer({ settings, navigation }: FooterProps) {
  const locale = defaultLocale
  const currentYear = new Date().getFullYear()

  const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-glos py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            {settings?.logo ? (
              <Image
                src={urlFor(settings.logo).width(200).url()}
                alt={settings.companyName || 'Logo'}
                width={150}
                height={50}
                className="h-12 w-auto mb-6 brightness-0 invert"
              />
            ) : (
              <h3 className="text-2xl font-bold mb-6">
                {settings?.companyName || 'GLOS Italy'}
              </h3>
            )}

            {settings?.tagline && (
              <p className="text-gray-400 mb-6">{t(settings.tagline, locale)}</p>
            )}

            {/* Social Links */}
            {settings?.social && (
              <div className="flex gap-4">
                {Object.entries(settings.social).map(([key, url]) => {
                  if (!url) return null
                  const Icon = socialIcons[key]
                  if (!Icon) return null

                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Link Rapidi</h4>
            <ul className="space-y-3">
              {navigation?.header?.slice(0, 6).map((item) => (
                <li key={item._key}>
                  <Link
                    href={item.href || '#'}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t(item.label, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Prodotti</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/prodotti" className="text-gray-400 hover:text-white transition-colors">
                  Tutti i Prodotti
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="text-gray-400 hover:text-white transition-colors">
                  Catalogo PDF
                </Link>
              </li>
              <li>
                <Link href="/rivenditori" className="text-gray-400 hover:text-white transition-colors">
                  Trova Rivenditore
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contatti</h4>
            <ul className="space-y-4">
              {settings?.contact?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-400">{t(settings.contact.address, locale)}</span>
                </li>
              )}
              {settings?.contact?.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <a
                    href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {settings.contact.phone}
                  </a>
                </li>
              )}
              {settings?.contact?.email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {settings.contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-glos py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              {t(settings?.footer?.copyright, locale) ||
                `© ${currentYear} GLOS Italy. Tutti i diritti riservati.`}
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookie" className="text-gray-500 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/termini" className="text-gray-500 hover:text-white transition-colors">
                Termini e Condizioni
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
