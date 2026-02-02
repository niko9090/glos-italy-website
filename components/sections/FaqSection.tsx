// FAQ Section Component - Allineato con schema Sanity
'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Plus, Minus, Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

// Tipi per le FAQ
interface FaqItem {
  _key: string
  question?: unknown // localeString
  answer?: unknown // localeRichText
  icon?: string
}

interface FaqCategory {
  _key: string
  name?: unknown // localeString
  icon?: string
  questions?: FaqItem[]
}

// Props allineate allo schema Sanity
interface FaqSectionProps {
  data: {
    // Content
    eyebrow?: unknown
    title?: unknown
    subtitle?: unknown
    // FAQ - Nuova struttura Sanity
    categories?: FaqCategory[]
    questions?: FaqItem[]
    // Legacy support (vecchio formato)
    items?: Array<{
      _key: string
      question?: unknown
      answer?: unknown
      category?: string
    }>
    // Layout
    layout?: 'accordion' | 'list' | 'two-columns' | 'sidebar'
    allowMultiple?: boolean
    showSearch?: boolean
    showNumbers?: boolean
    // Spacing
    paddingTop?: string
    paddingBottom?: string
    marginTop?: string
    marginBottom?: string
    // Style
    cardStyle?: 'minimal' | 'border' | 'shadow' | 'divider'
    iconStyle?: 'plus' | 'arrow' | 'chevron' | 'none'
    backgroundColor?: 'white' | 'gray-light' | 'primary-light'
    // CTA
    ctaTitle?: unknown
    ctaButton?: unknown
    ctaLink?: string
    // Legacy
    showCategories?: boolean
  }
}

// Classi per background
const bgClasses: Record<string, string> = {
  white: 'bg-white',
  'gray-light': 'bg-gray-50',
  'primary-light': 'bg-blue-50',
  // Legacy
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
}

// Classi per stile card
const cardStyleClasses: Record<string, string> = {
  minimal: 'bg-transparent',
  border: 'border border-gray-200 rounded-xl',
  shadow: 'bg-white rounded-xl shadow-md',
  divider: 'border-b border-gray-200',
}

// Classi per spaziatura
const paddingTopClasses: Record<string, string> = {
  none: 'pt-0',
  sm: 'pt-4 md:pt-6',
  md: 'pt-8 md:pt-12',
  lg: 'pt-12 md:pt-16',
  xl: 'pt-16 md:pt-24',
  '2xl': 'pt-24 md:pt-32',
}

const paddingBottomClasses: Record<string, string> = {
  none: 'pb-0',
  sm: 'pb-4 md:pb-6',
  md: 'pb-8 md:pb-12',
  lg: 'pb-12 md:pb-16',
  xl: 'pb-16 md:pb-24',
  '2xl': 'pb-24 md:pb-32',
}

const marginTopClasses: Record<string, string> = {
  none: 'mt-0',
  sm: 'mt-4 md:mt-6',
  md: 'mt-8 md:mt-12',
  lg: 'mt-12 md:mt-16',
  xl: 'mt-16 md:mt-24',
}

const marginBottomClasses: Record<string, string> = {
  none: 'mb-0',
  sm: 'mb-4 md:mb-6',
  md: 'mb-8 md:mb-12',
  lg: 'mb-12 md:mb-16',
  xl: 'mb-16 md:mb-24',
}

// Animazione per il contenuto della risposta
const answerVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: 'easeInOut' },
      opacity: { duration: 0.2 },
    },
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: 'easeInOut' },
      opacity: { duration: 0.3, delay: 0.1 },
    },
  },
}

// Animazione per l'icona
const iconVariants = {
  closed: { rotate: 0 },
  open: { rotate: 180 },
}

const plusIconVariants = {
  closed: { rotate: 0 },
  open: { rotate: 45 },
}

export default function FaqSection({ data }: FaqSectionProps) {
  const [openItems, setOpenItems] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { t, language } = useLanguage()

  const bgClass = bgClasses[data.backgroundColor || 'white'] || bgClasses.white
  const textColor = data.backgroundColor?.includes('dark') ? 'text-white' : 'text-gray-900'
  const layout = data.layout || 'accordion'
  const cardStyle = data.cardStyle || 'shadow'
  const iconStyle = data.iconStyle || 'chevron'
  const showNumbers = data.showNumbers || false
  const showSearch = data.showSearch || false
  const allowMultiple = data.allowMultiple || false

  // Normalizza le FAQ da entrambi i formati (nuovo e legacy)
  const { allQuestions, categories } = useMemo(() => {
    const cats: Array<{ key: string; name: string; icon?: string; questions: FaqItem[] }> = []
    let questions: FaqItem[] = []

    // Nuovo formato: categories con domande annidate
    if (data.categories && data.categories.length > 0) {
      data.categories.forEach((cat) => {
        const catName = t(cat.name) || 'Categoria'
        const catQuestions = cat.questions || []
        cats.push({
          key: cat._key,
          name: catName,
          icon: cat.icon,
          questions: catQuestions,
        })
        questions = [...questions, ...catQuestions]
      })
    }

    // Nuovo formato: questions (array flat senza categorie)
    if (data.questions && data.questions.length > 0) {
      questions = [...questions, ...data.questions]
    }

    // Legacy formato: items con category opzionale
    if (data.items && data.items.length > 0 && questions.length === 0) {
      const legacyItems = data.items.map((item) => ({
        _key: item._key,
        question: item.question,
        answer: item.answer,
      }))
      questions = legacyItems

      // Se showCategories era attivo nel vecchio formato
      if (data.showCategories && data.items.some((item) => item.category)) {
        const uniqueCategories = Array.from(
          new Set(data.items.map((item) => item.category).filter(Boolean))
        )
        uniqueCategories.forEach((catName, index) => {
          const catItems = data.items!
            .filter((item) => item.category === catName)
            .map((item) => ({
              _key: item._key,
              question: item.question,
              answer: item.answer,
            }))
          cats.push({
            key: `legacy-cat-${index}`,
            name: catName as string,
            questions: catItems,
          })
        })
      }
    }

    return { allQuestions: questions, categories: cats }
  }, [data.categories, data.questions, data.items, data.showCategories, t])

  // Filtra domande per ricerca
  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) {
      // Se c'e una categoria attiva, filtra per quella
      if (activeCategory && categories.length > 0) {
        const activeCat = categories.find((c) => c.key === activeCategory)
        return activeCat?.questions || []
      }
      return allQuestions
    }

    const query = searchQuery.toLowerCase()
    return allQuestions.filter((item) => {
      const questionText = t(item.question).toLowerCase()
      return questionText.includes(query)
    })
  }, [searchQuery, activeCategory, allQuestions, categories, t])

  // Se non ci sono domande, non mostrare la sezione
  if (allQuestions.length === 0) return null

  const toggleItem = (key: string) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      )
    } else {
      setOpenItems((prev) => (prev.includes(key) ? [] : [key]))
    }
  }

  // Icona per l'apertura/chiusura
  const ToggleIcon = ({ isOpen, itemKey }: { isOpen: boolean; itemKey: string }) => {
    if (iconStyle === 'none') return null

    const iconClass = `w-5 h-5 transition-colors ${isOpen ? 'text-primary' : 'text-gray-400'}`

    if (iconStyle === 'plus') {
      return (
        <motion.div
          variants={plusIconVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.2 }}
        >
          <Plus className={iconClass} />
        </motion.div>
      )
    }

    if (iconStyle === 'arrow') {
      return (
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className={iconClass} />
        </motion.div>
      )
    }

    // Default: chevron
    return (
      <motion.div
        variants={iconVariants}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className={iconClass} />
      </motion.div>
    )
  }

  // Singola domanda FAQ
  const FaqItemComponent = ({
    item,
    index,
    globalIndex,
  }: {
    item: FaqItem
    index: number
    globalIndex?: number
  }) => {
    const isOpen = openItems.includes(item._key)
    const displayIndex = globalIndex !== undefined ? globalIndex : index
    const cardClass = cardStyleClasses[cardStyle] || cardStyleClasses.shadow

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className={`overflow-hidden ${cardClass}`}
      >
        <button
          onClick={() => toggleItem(item._key)}
          className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
            isOpen ? 'bg-primary/5' : 'hover:bg-gray-50'
          }`}
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3 flex-1">
            {showNumbers && (
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  isOpen
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {displayIndex + 1}
              </span>
            )}
            <span
              className={`font-semibold text-left ${
                isOpen ? 'text-primary' : textColor
              }`}
            >
              {t(item.question)}
            </span>
          </div>
          <ToggleIcon isOpen={isOpen} itemKey={item._key} />
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key={`answer-${item._key}`}
              variants={answerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="overflow-hidden"
            >
              <div className="px-6 pb-4 text-gray-600">
                {showNumbers && <div className="ml-11" />}
                <RichText value={item.answer} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Layout: Accordion (default)
  const renderAccordion = () => (
    <div className="space-y-4 max-w-3xl mx-auto">
      {filteredQuestions.map((item, index) => (
        <FaqItemComponent key={item._key} item={item} index={index} globalIndex={index} />
      ))}
    </div>
  )

  // Layout: Lista aperta (tutte le risposte visibili)
  const renderList = () => (
    <div className="space-y-8 max-w-3xl mx-auto">
      {filteredQuestions.map((item, index) => (
        <motion.div
          key={item._key}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="border-b border-gray-200 pb-8 last:border-0"
        >
          <div className="flex items-start gap-3 mb-3">
            {showNumbers && (
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </span>
            )}
            <h3 className={`text-xl font-semibold ${textColor}`}>
              {t(item.question)}
            </h3>
          </div>
          <div className={`text-gray-600 ${showNumbers ? 'ml-11' : ''}`}>
            <RichText value={item.answer} />
          </div>
        </motion.div>
      ))}
    </div>
  )

  // Layout: Due colonne
  const renderTwoColumns = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {filteredQuestions.map((item, index) => (
        <FaqItemComponent key={item._key} item={item} index={index} globalIndex={index} />
      ))}
    </div>
  )

  // Layout: Con sidebar categorie
  const renderSidebar = () => (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8">
      {/* Sidebar Categories */}
      {categories.length > 0 && (
        <div className="lg:sticky lg:top-24 lg:self-start">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${
                !activeCategory
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Tutte le domande
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-2 ${
                  activeCategory === cat.key
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {cat.icon && <span>{cat.icon}</span>}
                <span>{cat.name}</span>
                <span className="ml-auto text-sm opacity-70">
                  ({cat.questions.length})
                </span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((item, index) => (
            <FaqItemComponent key={item._key} item={item} index={index} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Nessuna domanda trovata.</p>
          </div>
        )}
      </div>
    </div>
  )

  // Render layout appropriato
  const renderContent = () => {
    switch (layout) {
      case 'list':
        return renderList()
      case 'two-columns':
        return renderTwoColumns()
      case 'sidebar':
        return renderSidebar()
      default:
        return renderAccordion()
    }
  }

  // Compute spacing classes
  const ptClass = paddingTopClasses[data.paddingTop || 'lg'] || paddingTopClasses.lg
  const pbClass = paddingBottomClasses[data.paddingBottom || 'lg'] || paddingBottomClasses.lg
  const mtClass = marginTopClasses[data.marginTop || 'none'] || ''
  const mbClass = marginBottomClasses[data.marginBottom || 'none'] || ''

  return (
    <section className={`${ptClass} ${pbClass} ${mtClass} ${mbClass} ${bgClass}`}>
      <div className="container-glos">
        {/* Header: Eyebrow, Title, Subtitle */}
        {!!(data.eyebrow || data.title || data.subtitle) && (
          <div className={`text-center mb-12 ${textColor}`}>
            {!!data.eyebrow && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-sm font-semibold tracking-widest uppercase text-primary mb-4"
              >
                {t(data.eyebrow)}
              </motion.p>
            )}
            {!!data.title && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-title mb-4"
              >
                <RichText value={data.title} />
              </motion.h2>
            )}
            {!!data.subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="section-subtitle max-w-2xl mx-auto"
              >
                <RichText value={data.subtitle} />
              </motion.div>
            )}
          </div>
        )}

        {/* Search Bar */}
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto mb-10"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca una domanda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                {filteredQuestions.length} risultat
                {filteredQuestions.length === 1 ? 'o' : 'i'} trovato
              </p>
            )}
          </motion.div>
        )}

        {/* Category Filter (for non-sidebar layouts) */}
        {layout !== 'sidebar' && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2 rounded-full transition-all font-medium ${
                !activeCategory
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Tutte
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2 rounded-full transition-all font-medium flex items-center gap-2 ${
                  activeCategory === cat.key
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {cat.icon && <span>{cat.icon}</span>}
                {cat.name}
              </button>
            ))}
          </motion.div>
        )}

        {/* FAQ Content */}
        {renderContent()}

        {/* CTA Section */}
        {!!(data.ctaTitle || data.ctaButton) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
              {!!data.ctaTitle && (
                <h3 className={`text-2xl font-semibold mb-4 ${textColor}`}>
                  {t(data.ctaTitle)}
                </h3>
              )}
              {!!data.ctaButton && data.ctaLink && (
                <Link
                  href={data.ctaLink}
                  className="inline-flex items-center gap-2 btn-primary"
                >
                  {t(data.ctaButton)}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
