// Footer Component
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import type { SiteSettings, Navigation } from '@/lib/sanity/fetch'

interface FooterProps {
  settings: SiteSettings | null
  navigation: Navigation | null
}

export default function Footer({ settings, navigation }: FooterProps) {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  // Estrai valori sicuri
  const companyName = t(settings?.companyName) || 'GLOS Italy'
  const slogan = t(settings?.slogan)
  const address = t(settings?.address)

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-glos py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            {isValidImage(settings?.logo) && safeImageUrl(settings.logo, 200) ? (
              <Image
                src={safeImageUrl(settings.logo, 200)!}
                alt={companyName}
                width={150}
                height={50}
                className="h-12 w-auto mb-6 brightness-0 invert"
              />
            ) : (
              <h3 className="text-2xl font-bold mb-6">
                {companyName}
              </h3>
            )}

            {slogan && (
              <p className="text-gray-400 mb-6">{slogan}</p>
            )}

            {/* Social Links */}
            <div className="flex gap-4" role="list" aria-label="Link ai social media">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors focus-ring-white"
                  aria-label="Seguici su Facebook (si apre in una nuova finestra)"
                  role="listitem"
                >
                  <Facebook className="w-5 h-5" aria-hidden="true" />
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors focus-ring-white"
                  aria-label="Seguici su Instagram (si apre in una nuova finestra)"
                  role="listitem"
                >
                  <Instagram className="w-5 h-5" aria-hidden="true" />
                </a>
              )}
              {settings?.linkedin && (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors focus-ring-white"
                  aria-label="Seguici su LinkedIn (si apre in una nuova finestra)"
                  role="listitem"
                >
                  <Linkedin className="w-5 h-5" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Link Rapidi</h4>
            <ul className="space-y-3">
              {navigation?.items?.slice(0, 6).map((item) => (
                <li key={item._key}>
                  <Link
                    href={item.href || '#'}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t(item.label)}
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
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-400">{address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <a
                    href={`tel:${t(settings.phone).replace(/\s/g, '')}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t(settings.phone)}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <a
                    href={`mailto:${t(settings.email)}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t(settings.email)}
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
              © {currentYear} {companyName}. Tutti i diritti riservati.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookie" className="text-gray-500 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
