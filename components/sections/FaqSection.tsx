// FAQ Section Component
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Plus, Minus } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface FaqSectionProps {
  data: {
    title?: unknown
    subtitle?: unknown
    items?: Array<{
      _key: string
      question?: unknown
      answer?: unknown
      category?: string
    }>
    layout?: string
    showCategories?: boolean
    allowMultiple?: boolean
    backgroundColor?: string
  }
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
}

export default function FaqSection({ data }: FaqSectionProps) {
  const [openItems, setOpenItems] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const { t } = useLanguage()

  const bgClass = bgClasses[data.backgroundColor || 'white']
  const textColor = data.backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'
  const layout = data.layout || 'accordion'

  if (!data.items || data.items.length === 0) return null

  // Get unique categories
  const categories = data.showCategories
    ? Array.from(new Set(data.items.map((item) => item.category).filter(Boolean)))
    : []

  // Filter items by category
  const filteredItems = activeCategory
    ? data.items.filter((item) => item.category === activeCategory)
    : data.items

  const toggleItem = (key: string) => {
    if (data.allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      )
    } else {
      setOpenItems((prev) => (prev.includes(key) ? [] : [key]))
    }
  }

  const renderAccordion = () => (
    <div className="space-y-4 max-w-3xl mx-auto">
      {filteredItems.map((item) => {
        const isOpen = openItems.includes(item._key)
        return (
          <motion.div
            key={item._key}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <button
              onClick={() => toggleItem(item._key)}
              className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
                isOpen ? 'bg-primary/5' : 'hover:bg-gray-50'
              }`}
            >
              <span className={`font-semibold ${isOpen ? 'text-primary' : textColor}`}>
                {t(item.question)}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-primary' : 'text-gray-400'}`} />
              </motion.div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-6 pb-4 text-gray-600">
                    <RichText value={item.answer} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )

  const renderList = () => (
    <div className="space-y-8 max-w-3xl mx-auto">
      {filteredItems.map((item, index) => (
        <motion.div
          key={item._key}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="border-b border-gray-200 pb-8 last:border-0"
        >
          <h3 className={`text-xl font-semibold mb-3 ${textColor}`}>
            {t(item.question)}
          </h3>
          <div className="text-gray-600">
            <RichText value={item.answer} />
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderTwoColumns = () => (
    <div className="grid md:grid-cols-2 gap-8">
      {filteredItems.map((item, index) => (
        <motion.div
          key={item._key}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-xl p-6 shadow-md"
        >
          <h3 className={`text-lg font-semibold mb-3 ${textColor}`}>
            {t(item.question)}
          </h3>
          <div className="text-gray-600 text-sm">
            <RichText value={item.answer} />
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderSidebar = () => (
    <div className="grid lg:grid-cols-[250px_1fr] gap-8">
      {/* Sidebar Categories */}
      {categories.length > 0 && (
        <div className="lg:sticky lg:top-4 lg:self-start">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                !activeCategory ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
            >
              Tutte
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat || null)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === cat ? 'bg-primary text-white' : 'hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isOpen = openItems.includes(item._key)
          return (
            <div key={item._key} className="bg-white rounded-xl shadow-md overflow-hidden">
              <button
                onClick={() => toggleItem(item._key)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-semibold">{t(item.question)}</span>
                {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600">
                      <RichText value={item.answer} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <section className={`section ${bgClass}`}>
      <div className="container-glos">
        {(data.title || data.subtitle) ? (
          <div className={`text-center mb-12 ${textColor}`}>
            {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
            {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
          </div>
        ) : null}

        {/* Category Filter (for non-sidebar layouts) */}
        {data.showCategories && categories.length > 0 && layout !== 'sidebar' && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full transition-colors ${
                !activeCategory ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Tutte
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat || null)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {layout === 'accordion' && renderAccordion()}
        {layout === 'list' && renderList()}
        {layout === 'two-columns' && renderTwoColumns()}
        {layout === 'sidebar' && renderSidebar()}
      </div>
    </section>
  )
}
