// Tabs Section Component
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface TabsSectionProps {
  data: {
    title?: unknown
    subtitle?: unknown
    tabs?: Array<{
      _key: string
      label?: unknown
      icon?: string
      content?: unknown
      image?: any
      features?: Array<{
        _key: string
        text?: unknown
        icon?: string
      }>
      buttonText?: unknown
      buttonLink?: string
    }>
    tabStyle?: string
    contentLayout?: string
    animated?: boolean
    backgroundColor?: string
  }
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900',
}

export default function TabsSection({ data }: TabsSectionProps) {
  const [activeTab, setActiveTab] = useState(0)
  const { t } = useLanguage()

  const bgClass = bgClasses[data.backgroundColor || 'white']
  const textColor = data.backgroundColor?.includes('dark') ? 'text-white' : 'text-gray-900'
  const tabStyle = data.tabStyle || 'pills'
  const contentLayout = data.contentLayout || 'text-image'

  if (!data.tabs || data.tabs.length === 0) return null

  const activeContent = data.tabs[activeTab]

  const tabClasses = {
    pills: {
      container: 'flex flex-wrap justify-center gap-2 mb-8',
      tab: (active: boolean) =>
        `px-6 py-3 rounded-full font-medium transition-all ${
          active
            ? 'bg-primary text-white shadow-lg'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`,
    },
    underlined: {
      container: 'flex justify-center gap-8 mb-8 border-b border-gray-200',
      tab: (active: boolean) =>
        `px-4 py-3 font-medium transition-all border-b-2 -mb-[2px] ${
          active
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-600 hover:text-gray-900'
        }`,
    },
    boxed: {
      container: 'flex justify-center mb-8 bg-gray-100 rounded-xl p-1',
      tab: (active: boolean) =>
        `px-6 py-3 rounded-lg font-medium transition-all ${
          active
            ? 'bg-white text-primary shadow-md'
            : 'text-gray-600 hover:text-gray-900'
        }`,
    },
    vertical: {
      container: 'flex flex-col gap-2 w-full md:w-64',
      tab: (active: boolean) =>
        `px-6 py-4 rounded-xl font-medium text-left transition-all ${
          active
            ? 'bg-primary text-white shadow-lg'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`,
    },
  }

  const currentStyle = tabClasses[tabStyle as keyof typeof tabClasses] || tabClasses.pills

  return (
    <section className={`section ${bgClass}`}>
      <div className="container-glos">
        {(data.title || data.subtitle) ? (
          <div className={`text-center mb-12 ${textColor}`}>
            {data.title ? <h2 className="section-title mb-4"><RichText value={data.title} /></h2> : null}
            {data.subtitle ? <div className="section-subtitle"><RichText value={data.subtitle} /></div> : null}
          </div>
        ) : null}

        <div className={tabStyle?.includes('vertical') ? 'flex flex-col md:flex-row gap-8' : ''}>
          {/* Tab Buttons */}
          <div className={currentStyle.container}>
            {data.tabs.map((tab, index) => (
              <button
                key={tab._key}
                onClick={() => setActiveTab(index)}
                className={currentStyle.tab(index === activeTab)}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {String(t(tab.label) || '')}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={data.animated ? { opacity: 0, y: 10 } : undefined}
                animate={{ opacity: 1, y: 0 }}
                exit={data.animated ? { opacity: 0, y: -10 } : undefined}
                transition={{ duration: 0.3 }}
              >
                {contentLayout?.includes('text-only') ? (
                  <div className={`prose prose-lg max-w-none ${textColor}`}>
                    <RichText value={activeContent.content} />

                    {/* Features */}
                    {activeContent.features && activeContent.features.length > 0 ? (
                      <ul className="mt-6 space-y-3">
                        {activeContent.features.map((feature) => (
                          <li key={feature._key} className="flex items-start gap-3">
                            <span className="text-primary">{feature.icon || <Check className="w-5 h-5" />}</span>
                            <span>{String(t(feature.text) || '')}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {/* Button */}
                    {activeContent.buttonText && activeContent.buttonLink ? (
                      <Link href={activeContent.buttonLink} className="btn-primary mt-6 inline-block">
                        {String(t(activeContent.buttonText) || '')}
                      </Link>
                    ) : null}
                  </div>
                ) : (
                  <div className={`grid lg:grid-cols-2 gap-8 items-center ${contentLayout?.includes('image-text') ? 'lg:grid-flow-dense' : ''}`}>
                    {/* Text */}
                    <div className={`${contentLayout?.includes('image-text') ? 'lg:order-2' : ''} ${textColor}`}>
                      <div className="prose prose-lg max-w-none">
                        <RichText value={activeContent.content} />
                      </div>

                      {/* Features */}
                      {activeContent.features && activeContent.features.length > 0 ? (
                        <ul className="mt-6 space-y-3">
                          {activeContent.features.map((feature) => (
                            <li key={feature._key} className="flex items-start gap-3">
                              <span className="text-primary text-xl">{feature.icon || '✓'}</span>
                              <span>{String(t(feature.text) || '')}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {activeContent.buttonText && activeContent.buttonLink ? (
                        <Link href={activeContent.buttonLink} className="btn-primary mt-6 inline-block">
                          {String(t(activeContent.buttonText) || '')}
                        </Link>
                      ) : null}
                    </div>

                    {/* Image */}
                    {isValidImage(activeContent.image) && (
                      <div className={contentLayout?.includes('image-text') ? 'lg:order-1' : ''}>
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                          <Image
                            src={safeImageUrl(activeContent.image, 800, 600)!}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
