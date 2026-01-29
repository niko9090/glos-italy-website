// Header Component
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { urlFor } from '@/lib/sanity/client'
import type { SiteSettings, Navigation } from '@/lib/sanity/fetch'

interface HeaderProps {
  settings: SiteSettings | null
  navigation: Navigation | null
}

export default function Header({ settings, navigation }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            {navigation?.items?.map((item) => (
              <Link
                key={item._key}
                href={item.href || '#'}
                className="text-gray-700 hover:text-primary font-medium py-2 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
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
                {navigation?.items?.map((item) => (
                  <Link
                    key={item._key}
                    href={item.href || '#'}
                    onClick={toggleMobileMenu}
                    className="block py-3 text-gray-700 font-medium hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* CTA Button (Mobile) */}
                <Link
                  href="/contatti"
                  onClick={toggleMobileMenu}
                  className="btn-primary text-center mt-4"
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
