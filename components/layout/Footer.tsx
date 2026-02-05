// Footer Component - v2.0 con personalizzazione da Sanity
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Linkedin, Youtube, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { sl } from '@/lib/utils/stegaSafe'
import { useLanguage } from '@/lib/context/LanguageContext'
import type { SiteSettings, Navigation } from '@/lib/sanity/fetch'

interface FooterProps {
  settings: SiteSettings | null
  navigation: Navigation | null
}

// Logo size classes
const logoSizeClasses: Record<string, { height: string; width: number }> = {
  sm: { height: 'h-8', width: 100 },
  md: { height: 'h-10', width: 125 },
  lg: { height: 'h-12', width: 150 },
  xl: { height: 'h-14', width: 175 },
  '2xl': { height: 'h-16', width: 200 },
}

// Footer style classes
const footerStyleClasses: Record<string, string> = {
  'metal-dark': 'metal-dark',
  black: 'bg-gray-950',
  'gray-dark': 'bg-gray-800',
  primary: 'bg-primary',
}

// Footer padding classes
const footerPaddingClasses: Record<string, string> = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-20',
}

// Footer columns gap classes
const footerColumnsGapClasses: Record<string, string> = {
  '6': 'gap-6',
  '8': 'gap-8',
  '12': 'gap-12',
}

// Footer columns layout classes
const footerColumnsClasses: Record<string, string> = {
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export default function Footer({ settings, navigation }: FooterProps) {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  // Estrai valori sicuri
  const companyName = t(settings?.companyName) || 'GLOS Italy'
  const slogan = t(settings?.slogan)
  const address = t(settings?.address)

  // Get customization settings with defaults
  const logoSize = sl(logoSizeClasses, settings?.footerLogoSize, 'lg')
  const footerStyle = sl(footerStyleClasses, settings?.footerStyle, 'metal-dark')
  const footerPadding = sl(footerPaddingClasses, settings?.footerPadding, 'lg')
  const footerColumnsGap = sl(footerColumnsGapClasses, settings?.footerColumnsGap, '12')
  const footerColumns = sl(footerColumnsClasses, settings?.footerColumns, '4')
  const showSocial = settings?.footerShowSocial !== false
  const showQuickLinks = settings?.footerShowQuickLinks !== false
  const showProducts = settings?.footerShowProducts !== false
  const showContacts = settings?.footerShowContacts !== false
  const bottomLinks = settings?.footerBottomLinks || [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookie' },
  ]

  // Copyright text with {year} replacement
  const copyrightText = settings?.footerCopyrightText
    ? settings.footerCopyrightText.replace('{year}', String(currentYear))
    : `© ${currentYear} ${companyName}. Tutti i diritti riservati.`

  // Determine which logo to use - prefer logoWhite for dark backgrounds
  const footerLogo = isValidImage(settings?.logoWhite) ? settings.logoWhite : settings?.logo

  return (
    <footer className={`${footerStyle} text-white`}>
      <div className={`container-glos ${footerPadding}`}>
        <div className={`grid ${footerColumns} ${footerColumnsGap}`}>
          {/* Company Info */}
          <div>
            {isValidImage(footerLogo) && safeImageUrl(footerLogo, logoSize.width) ? (
              <Image
                src={safeImageUrl(footerLogo, logoSize.width)!}
                alt={companyName}
                width={logoSize.width}
                height={60}
                className={`${logoSize.height} w-auto mb-6 object-contain`}
                style={{ filter: !isValidImage(settings?.logoWhite) ? 'brightness(0) invert(1)' : 'none' }}
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
            {showSocial && (
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
                {settings?.youtube && (
                  <a
                    href={settings.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors focus-ring-white"
                    aria-label="Seguici su YouTube (si apre in una nuova finestra)"
                    role="listitem"
                  >
                    <Youtube className="w-5 h-5" aria-hidden="true" />
                  </a>
                )}
                {settings?.twitter && (
                  <a
                    href={settings.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors focus-ring-white"
                    aria-label="Seguici su Twitter/X (si apre in una nuova finestra)"
                    role="listitem"
                  >
                    <Twitter className="w-5 h-5" aria-hidden="true" />
                  </a>
                )}
                {settings?.tiktok && (
                  <a
                    href={settings.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors focus-ring-white"
                    aria-label="Seguici su TikTok (si apre in una nuova finestra)"
                    role="listitem"
                  >
                    <svg className="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.1a8.16 8.16 0 0 0 4.76 1.52v-3.4c-.87 0-1.7-.2-2.44-.53h-.01z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          {showQuickLinks && (
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
          )}

          {/* Products */}
          {showProducts && (
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
          )}

          {/* Contact Info */}
          {showContacts && (
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
                      href={`tel:${String(t(settings.phone) || '').replace(/\s/g, '')}`}
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
                      href={`mailto:${String(t(settings.email) || '')}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {t(settings.email)}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-glos py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              {copyrightText}
            </p>
            <div className="flex gap-6 text-sm">
              {bottomLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href || '#'}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
