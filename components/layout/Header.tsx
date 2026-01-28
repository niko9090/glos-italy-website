// Header Component
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'
import { urlFor } from '@/lib/sanity/client'
import { t, defaultLocale, locales, localeFlags } from '@/lib/i18n'
import type { SiteSettings, Navigation } from '@/lib/sanity/fetch'

interface HeaderProps {
  settings: SiteSettings | null
  navigation: Navigation | null
}

export default function Header({ settings, navigation }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const locale = defaultLocale

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container-glos">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {settings?.logo ? (
              <Image
                src={urlFor(settings.logo).width(200).url()}
                alt={settings.companyName || 'Logo'}
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            ) : (
              <span className="text-2xl font-bold text-primary">
                {settings?.companyName || 'GLOS Italy'}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation?.header?.map((item) => (
              <div
                key={item._key}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item._key)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children && item.children.length > 0 ? (
                  <>
                    <button className="flex items-center gap-1 text-gray-700 hover:text-primary font-medium py-2 transition-colors">
                      {t(item.label, locale)}
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {openDropdown === item._key && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-[200px]"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child._key}
                              href={child.href || '#'}
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                            >
                              {t(child.label, locale)}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={item.href || '#'}
                    className="text-gray-700 hover:text-primary font-medium py-2 transition-colors"
                  >
                    {t(item.label, locale)}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Language Selector (Desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              {locales.map((loc) => (
                <Link
                  key={loc}
                  href={`/${loc === 'it' ? '' : loc}`}
                  className={`text-lg ${locale === loc ? 'opacity-100' : 'opacity-50 hover:opacity-100'} transition-opacity`}
                >
                  {localeFlags[loc]}
                </Link>
              ))}
            </div>

            {/* CTA Button (Desktop) */}
            <Link href="/contatti" className="hidden lg:block btn-primary">
              Contattaci
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-700"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="container-glos py-4">
              <nav className="flex flex-col gap-2">
                {navigation?.header?.map((item) => (
                  <div key={item._key}>
                    {item.children && item.children.length > 0 ? (
                      <>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === item._key ? null : item._key)}
                          className="flex items-center justify-between w-full py-3 text-gray-700 font-medium"
                        >
                          {t(item.label, locale)}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              openDropdown === item._key ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openDropdown === item._key && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 border-l-2 border-primary/20"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child._key}
                                  href={child.href || '#'}
                                  onClick={toggleMobileMenu}
                                  className="block py-2 text-gray-600 hover:text-primary"
                                >
                                  {t(child.label, locale)}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href || '#'}
                        onClick={toggleMobileMenu}
                        className="block py-3 text-gray-700 font-medium hover:text-primary"
                      >
                        {t(item.label, locale)}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Language Selector (Mobile) */}
                <div className="flex items-center gap-4 py-4 border-t mt-4">
                  {locales.map((loc) => (
                    <Link
                      key={loc}
                      href={`/${loc === 'it' ? '' : loc}`}
                      onClick={toggleMobileMenu}
                      className="text-2xl"
                    >
                      {localeFlags[loc]}
                    </Link>
                  ))}
                </div>

                {/* CTA Button (Mobile) */}
                <Link
                  href="/contatti"
                  onClick={toggleMobileMenu}
                  className="btn-primary text-center mt-2"
                >
                  Contattaci
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
