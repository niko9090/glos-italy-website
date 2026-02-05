// Pricing Section Component
'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, X, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'
import {
  MOTION,
  staggerContainer,
  staggerItem,
  fadeInUp,
  hoverLift,
} from '@/lib/animations/config'
import { sl } from '@/lib/utils/stegaSafe'

interface PlanFeature {
  _key: string
  text?: { it?: string; en?: string; es?: string }
  included: boolean
}

interface PricingPlan {
  _key: string
  name?: { it?: string; en?: string; es?: string }
  price: string
  period?: { it?: string; en?: string; es?: string }
  description?: { it?: string; en?: string; es?: string }
  features?: PlanFeature[]
  ctaText?: { it?: string; en?: string; es?: string }
  ctaLink?: string
  highlighted?: boolean
  badge?: { it?: string; en?: string; es?: string }
}

interface PricingSectionData {
  _type: 'pricingSection'
  title?: { it?: string; en?: string; es?: string }
  subtitle?: { it?: string; en?: string; es?: string }
  plans?: PricingPlan[]
  layout?: 'row' | 'grid'
  showComparison?: boolean
  backgroundColor?: string
  paddingY?: 'none' | 'small' | 'medium' | 'large'
}

interface PricingSectionProps {
  documentId?: string
  sectionKey?: string
  data: PricingSectionData
}

export default function PricingSection({ data, documentId, sectionKey }: PricingSectionProps) {
  const { language } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  // Helper function to get localized text
  const getText = (value: { it?: string; en?: string; es?: string } | undefined): string => {
    if (!value) return ''
    return value[language] || value.it || ''
  }

  const plans = data.plans || []
  const layout = data.layout || 'row'
  const showComparison = data.showComparison || false

  // Background classes
  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    'gray-light': 'bg-gray-50',
    gray: 'bg-gray-100',
    dark: 'bg-gray-900',
    primary: 'bg-primary',
    'gradient-blue': 'bg-gradient-to-br from-primary via-primary-dark to-blue-900',
    'gradient-dark': 'bg-gradient-to-br from-gray-800 via-gray-900 to-black',
  }

  // Padding classes
  const paddingClasses: Record<string, string> = {
    none: 'py-0',
    small: 'py-8 md:py-12',
    medium: 'py-12 md:py-16',
    large: 'py-16 md:py-24',
  }

  // Text color based on background
  const getTextColor = () => {
    const darkBgs = ['dark', 'primary', 'gradient-blue', 'gradient-dark']
    return darkBgs.includes(data.backgroundColor || 'white') ? 'text-white' : 'text-gray-900'
  }

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: MOTION.SPRING.GENTLE,
    },
  }

  // Container variants for stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: MOTION.STAGGER.NORMAL,
        delayChildren: 0.1,
      },
    },
  }

  // Get layout classes
  const getLayoutClasses = () => {
    if (layout === 'grid') {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
    }
    // Row layout - side by side with responsive behavior
    const planCount = plans.length
    if (planCount <= 2) {
      return 'flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto'
    }
    if (planCount === 3) {
      return 'flex flex-col lg:flex-row justify-center gap-8 max-w-6xl mx-auto'
    }
    return 'flex flex-col lg:flex-row flex-wrap justify-center gap-8'
  }

  const backgroundColor = data.backgroundColor || 'gray-light'
  const textColor = getTextColor()

  // Render a single pricing card
  const renderPricingCard = (plan: PricingPlan, index: number) => {
    const isHighlighted = plan.highlighted || false
    const badgeText = getText(plan.badge)

    return (
      <motion.div
        key={plan._key}
        variants={cardVariants}
        whileHover={hoverLift}
        className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
          isHighlighted
            ? 'bg-primary text-white shadow-2xl scale-105 z-10 ring-4 ring-primary/30'
            : 'bg-white text-gray-900 shadow-lg hover:shadow-xl'
        } ${layout === 'row' ? 'flex-1 min-w-[280px] max-w-[380px]' : ''}`}
      >
        {/* Badge */}
        {badgeText && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className={`inline-block px-4 py-1.5 text-sm font-semibold rounded-full shadow-lg ${
              isHighlighted
                ? 'bg-secondary text-gray-900'
                : 'bg-primary text-white'
            }`}>
              {badgeText}
            </span>
          </div>
        )}

        {/* Plan name */}
        <h3 className={`text-xl font-bold mb-2 ${badgeText ? 'mt-4' : ''}`}>
          {getText(plan.name)}
        </h3>

        {/* Description */}
        {plan.description && (
          <p className={`text-sm mb-6 ${isHighlighted ? 'opacity-80' : 'text-gray-600'}`}>
            {getText(plan.description)}
          </p>
        )}

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-extrabold">{plan.price}</span>
            {plan.period && (
              <span className={`text-sm ${isHighlighted ? 'opacity-70' : 'text-gray-500'}`}>
                /{getText(plan.period)}
              </span>
            )}
          </div>
        </div>

        {/* Features list */}
        {plan.features && plan.features.length > 0 && (
          <ul className="space-y-3 mb-8 flex-1">
            {plan.features.map((feature) => (
              <li key={feature._key} className="flex items-start gap-3">
                {feature.included ? (
                  <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    isHighlighted ? 'text-secondary' : 'text-green-500'
                  }`} />
                ) : (
                  <X className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    isHighlighted ? 'opacity-40' : 'text-gray-300'
                  }`} />
                )}
                <span className={`text-sm ${
                  !feature.included ? (isHighlighted ? 'opacity-40 line-through' : 'text-gray-400 line-through') : ''
                }`}>
                  {getText(feature.text)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA Button */}
        {plan.ctaLink && (
          <Link
            href={plan.ctaLink}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              isHighlighted
                ? 'bg-white text-primary hover:bg-gray-100'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {getText(plan.ctaText) || 'Scegli piano'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </motion.div>
    )
  }

  // Render comparison table
  const renderComparisonTable = () => {
    if (!showComparison || plans.length === 0) return null

    // Collect all unique features across all plans
    const allFeatures: { text: string; planIncluded: Record<string, boolean> }[] = []
    const featureMap = new Map<string, { text: string; planIncluded: Record<string, boolean> }>()

    plans.forEach((plan) => {
      plan.features?.forEach((feature) => {
        const featureText = getText(feature.text)
        if (featureText) {
          if (!featureMap.has(featureText)) {
            featureMap.set(featureText, { text: featureText, planIncluded: {} })
          }
          featureMap.get(featureText)!.planIncluded[plan._key] = feature.included
        }
      })
    })

    featureMap.forEach((value) => allFeatures.push(value))

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: MOTION.DURATION.SLOW, delay: 0.3 }}
        className="mt-16 overflow-x-auto"
      >
        <h3 className={`text-2xl font-bold text-center mb-8 ${textColor}`}>
          Confronto piani
        </h3>
        <table className="w-full min-w-[600px] bg-white rounded-2xl shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 font-semibold text-gray-700 border-b">
                Funzionalità
              </th>
              {plans.map((plan) => (
                <th
                  key={plan._key}
                  className={`p-4 font-semibold border-b text-center ${
                    plan.highlighted ? 'bg-primary/10 text-primary' : 'text-gray-700'
                  }`}
                >
                  {getText(plan.name)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allFeatures.map((feature, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100 transition-colors`}
              >
                <td className="p-4 text-gray-700 border-b">{feature.text}</td>
                {plans.map((plan) => (
                  <td
                    key={plan._key}
                    className={`p-4 text-center border-b ${
                      plan.highlighted ? 'bg-primary/5' : ''
                    }`}
                  >
                    {feature.planIncluded[plan._key] ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    )
  }

  if (plans.length === 0) {
    return null
  }

  return (
    <section
      data-sanity-edit-target
      ref={sectionRef}
      className={`relative overflow-hidden ${sl(paddingClasses, data.paddingY, 'large')} ${sl(bgClasses, backgroundColor, 'gray-light')} ${textColor}`}
    >
      <div className="container-glos">
        {/* Header */}
        {(data.title || data.subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: MOTION.DURATION.NORMAL }}
            className="text-center mb-12"
          >
            {data.title && (
              <h2 className="section-title mb-4">
                <RichText value={getText(data.title)} />
              </h2>
            )}
            {data.subtitle && (
              <p className={`section-subtitle mx-auto ${
                getTextColor().includes('white') ? 'opacity-80' : ''
              }`}>
                {getText(data.subtitle)}
              </p>
            )}
          </motion.div>
        )}

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className={getLayoutClasses()}
        >
          {plans.map((plan, index) => renderPricingCard(plan, index))}
        </motion.div>

        {/* Comparison Table */}
        {renderComparisonTable()}
      </div>
    </section>
  )
}
