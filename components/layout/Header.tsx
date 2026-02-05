// Header Component - v2.0 con personalizzazione da Sanity
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { sl } from '@/lib/utils/stegaSafe'
import { useLanguage } from '@/lib/context/LanguageContext'
import LanguageSelector from '@/components/LanguageSelector'
import type { SiteSettings, Navigation } from '@/lib/sanity/fetch'

interface HeaderProps {
  settings: SiteSettings | null
  navigation: Navigation | null
}

// Menu di fallback se Sanity non ha dati
const defaultNavItems = [
  { _key: 'home', label: 'Home', href: '/' },
  { _key: 'chi-siamo', label: 'Chi Siamo', href: '/chi-siamo' },
  { _key: 'prodotti', label: 'Prodotti', href: '/prodotti' },
  { _key: 'rivenditori', label: 'Rivenditori', href: '/rivenditori' },
]

// Logo size classes
const logoSizeClasses: Record<string, { height: string; width: number }> = {
  sm: { height: 'h-8', width: 100 },
  md: { height: 'h-10', width: 125 },
  lg: { height: 'h-12', width: 150 },
  xl: { height: 'h-14', width: 175 },
  '2xl': { height: 'h-16', width: 200 },
}

// Header height classes
const headerHeightClasses: Record<string, string> = {
  sm: 'h-16',
  md: 'h-20',
  lg: 'h-24',
}

// Header style classes
const headerStyleClasses: Record<string, string> = {
  metal: 'header-metal',
  white: 'bg-white shadow-sm',
  transparent: 'bg-transparent',
  dark: 'bg-gray-900 text-white',
}

// Nav gap classes
const navGapClasses: Record<string, string> = {
  '4': 'gap-4',
  '6': 'gap-6',
  '8': 'gap-8',
  '10': 'gap-10',
}

export default function Header({ settings, navigation }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useLanguage()
  const companyName = t(settings?.companyName) || 'GLOS Italy'

  // Usa items da Sanity se esistono, altrimenti usa il fallback
  const navItems = navigation?.items && navigation.items.length > 0
    ? navigation.items
    : defaultNavItems

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  // Get customization settings with defaults
  const logoSize = sl(logoSizeClasses, settings?.headerLogoSize, 'lg')
  const headerHeight = sl(headerHeightClasses, settings?.headerHeight, 'md')
  const headerStyle = sl(headerStyleClasses, settings?.headerStyle, 'metal')
  const navGap = sl(navGapClasses, settings?.headerNavGap, '8')
  const showLanguageSelector = settings?.headerShowLanguageSelector !== false
  const ctaText = t(settings?.headerCtaText) || 'Contattaci'
  const ctaLink = settings?.headerCtaLink || '/contatti'

  return (
    <header className={`sticky top-0 z-50 ${headerStyle}`}>
      <div className="container-glos">
        <div className={`flex items-center justify-between ${headerHeight}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {isValidImage(settings?.logo) && safeImageUrl(settings.logo, logoSize.width) ? (
              <Image
                src={safeImageUrl(settings.logo, logoSize.width)!}
                alt={companyName}
                width={logoSize.width}
                height={60}
                className={`${logoSize.height} w-auto object-contain`}
              />
            ) : (
              <span className="text-2xl font-bold text-primary">
                {companyName}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center ${navGap}`}>
            {navItems.map((item) => (
              <Link
                key={item._key}
                href={item.href || '#'}
                className="text-gray-700 hover:text-primary font-medium py-2 transition-colors"
              >
                {t(item.label)}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Language Selector (Desktop) */}
            {showLanguageSelector && (
              <div className="hidden lg:block">
                <LanguageSelector variant="compact" />
              </div>
            )}

            {/* CTA Button (Desktop) */}
            <Link href={ctaLink} className="hidden lg:block btn-primary">
              {ctaText}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-700 focus-ring rounded-lg"
              aria-label={isMobileMenuOpen ? 'Chiudi menu di navigazione' : 'Apri menu di navigazione'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden metal-brushed border-t border-gray-300/50"
            role="navigation"
            aria-label="Menu di navigazione mobile"
          >
            <div className="container-glos py-4">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item._key}
                    href={item.href || '#'}
                    onClick={toggleMobileMenu}
                    className="block py-3 text-gray-700 font-medium hover:text-primary"
                  >
                    {t(item.label)}
                  </Link>
                ))}

                {/* Language Selector (Mobile) */}
                {showLanguageSelector && (
                  <div className="py-3 border-t border-gray-100 mt-2">
                    <LanguageSelector variant="flags-only" />
                  </div>
                )}

                {/* CTA Button (Mobile) */}
                <Link
                  href={ctaLink}
                  onClick={toggleMobileMenu}
                  className="btn-primary text-center mt-4"
                >
                  {ctaText}
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
