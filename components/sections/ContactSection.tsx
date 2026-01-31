// Contact Section Component - VERSIONE AVANZATA
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  MapPin, Phone, Mail, Clock, MessageCircle, Send,
  Facebook, Instagram, Linkedin, Twitter, Youtube
} from 'lucide-react'
import { isValidImage, safeImageUrl } from '@/lib/sanity/client'
import { useLanguage } from '@/lib/context/LanguageContext'
import RichText from '@/components/RichText'

interface FormField {
  _key: string
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'date' | 'file'
  name?: string
  label?: unknown
  placeholder?: unknown
  required?: boolean
  options?: string[]
  width?: 'full' | 'half'
}

interface ContactItem {
  _key: string
  type?: 'address' | 'phone' | 'mobile' | 'email' | 'whatsapp' | 'fax' | 'vat' | 'other'
  label?: unknown
  value?: string
  link?: string
  icon?: string
}

interface OpeningHours {
  _key: string
  days?: unknown
  hours?: string
  note?: unknown
}

interface SocialLink {
  _key: string
  platform?: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'youtube' | 'tiktok' | 'pinterest' | 'whatsapp' | 'telegram'
  url?: string
  label?: string
}

interface ContactSectionProps {
  data: {
    // Content
    eyebrow?: unknown
    title?: unknown
    subtitle?: unknown
    description?: unknown
    // Elements to show
    showForm?: boolean
    showMap?: boolean
    showContactInfo?: boolean
    showSocialLinks?: boolean
    showOpeningHours?: boolean
    // Form
    formTitle?: unknown
    formSubtitle?: unknown
    formFields?: FormField[]
    submitButtonText?: unknown
    submitButtonIcon?: string
    formSuccessMessage?: unknown
    formErrorMessage?: unknown
    privacyText?: unknown
    formStyle?: 'classic' | 'minimal' | 'bordered' | 'floating' | 'card'
    // Contact Info
    contactInfoTitle?: unknown
    contactItems?: ContactItem[]
    // Opening Hours
    openingHoursTitle?: unknown
    openingHours?: OpeningHours[]
    // Social
    socialTitle?: unknown
    socialLinks?: SocialLink[]
    // Map
    mapType?: 'google' | 'openstreet' | 'image'
    mapEmbedUrl?: string
    mapImage?: any
    mapZoom?: number
    mapHeight?: 'sm' | 'md' | 'lg' | 'xl'
    // Layout
    layout?: 'form-left' | 'form-right' | 'stacked' | 'map-first' | 'form-only' | 'info-only' | 'grid' | 'map-overlay'
    formWidth?: 'narrow' | 'normal' | 'wide'
    contentWidth?: 'narrow' | 'normal' | 'wide' | 'full'
    paddingY?: 'sm' | 'md' | 'lg' | 'xl'
    // Style
    backgroundColor?: 'white' | 'gray-light' | 'gray' | 'primary' | 'primary-light' | 'black' | 'gradient'
    textColor?: 'auto' | 'dark' | 'light'
    cardStyle?: 'none' | 'border' | 'shadow' | 'glass' | 'colored'
    iconStyle?: 'simple' | 'circle-filled' | 'circle-outlined' | 'square'
    animation?: 'none' | 'fade' | 'fade-up' | 'slide-left' | 'slide-right'
    // Decorations
    showDecorations?: boolean
    decorativeImage?: any
  }
}

export default function ContactSection({ data }: ContactSectionProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Background classes
  const bgClasses: Record<string, string> = {
    white: 'bg-white',
    'gray-light': 'bg-gray-50',
    gray: 'bg-gray-100',
    primary: 'bg-primary',
    'primary-light': 'bg-blue-50',
    black: 'bg-gray-900',
    gradient: 'bg-gradient-to-br from-primary via-primary-dark to-blue-900',
  }

  // Text color
  const getTextColor = () => {
    if (data.textColor === 'dark') return 'text-gray-900'
    if (data.textColor === 'light') return 'text-white'
    const darkBgs = ['primary', 'black', 'gradient']
    return darkBgs.includes(data.backgroundColor || 'white') ? 'text-white' : 'text-gray-900'
  }

  // Padding classes
  const paddingClasses: Record<string, string> = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-24 md:py-32',
  }

  // Map height classes
  const mapHeightClasses: Record<string, string> = {
    sm: 'h-[200px]',
    md: 'h-[300px]',
    lg: 'h-[400px]',
    xl: 'h-[500px]',
  }

  // Card style classes
  const cardStyleClasses: Record<string, string> = {
    none: '',
    border: 'border border-gray-200 rounded-xl p-6',
    shadow: 'shadow-xl rounded-xl p-6 bg-white',
    glass: 'bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20',
    colored: 'bg-primary/5 rounded-xl p-6',
  }

  // Icon style classes
  const getIconStyleClasses = () => {
    switch (data.iconStyle) {
      case 'simple':
        return 'text-primary'
      case 'circle-filled':
        return 'w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center'
      case 'circle-outlined':
        return 'w-12 h-12 border-2 border-primary text-primary rounded-full flex items-center justify-center'
      case 'square':
        return 'w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center'
      default:
        return 'w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center'
    }
  }

  // Form input classes based on style
  const getInputClasses = () => {
    const base = 'w-full px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50'
    switch (data.formStyle) {
      case 'minimal':
        return `${base} border-b border-gray-200 focus:border-primary bg-transparent`
      case 'bordered':
        return `${base} border-2 border-gray-200 rounded-lg focus:border-primary bg-transparent`
      case 'floating':
        return `${base} border border-gray-200 rounded-lg peer placeholder-transparent`
      case 'card':
        return `${base} border border-gray-100 rounded-lg bg-gray-50 focus:bg-white`
      default: // classic
        return `${base} border border-gray-200 rounded-lg`
    }
  }

  // Animation variants
  const getAnimationVariants = () => {
    switch (data.animation) {
      case 'none':
        return { initial: {}, animate: {} }
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.6 } },
        }
      case 'slide-left':
        return {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
        }
      case 'slide-right':
        return {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
        }
      default: // fade-up
        return {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }
    }
  }

  // Social icon mapping
  const getSocialIcon = (platform?: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5" />
      case 'instagram':
        return <Instagram className="w-5 h-5" />
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />
      case 'twitter':
        return <Twitter className="w-5 h-5" />
      case 'youtube':
        return <Youtube className="w-5 h-5" />
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5" />
      default:
        return <MessageCircle className="w-5 h-5" />
    }
  }

  // Contact icon mapping
  const getContactIcon = (type?: string) => {
    switch (type) {
      case 'address':
        return <MapPin className="w-5 h-5" />
      case 'phone':
      case 'mobile':
        return <Phone className="w-5 h-5" />
      case 'email':
        return <Mail className="w-5 h-5" />
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5" />
      default:
        return <MapPin className="w-5 h-5" />
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitStatus('success')
      setFormData({})
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const backgroundColor = data.backgroundColor || 'gray-light'
  const textColor = getTextColor()
  const darkBg = ['primary', 'black', 'gradient'].includes(backgroundColor)
  const animationVariants = getAnimationVariants()

  // Layout classes
  const getLayoutClasses = () => {
    const layout = data.layout || 'form-left'
    switch (layout) {
      case 'form-left':
        return 'grid lg:grid-cols-2 gap-12'
      case 'form-right':
        return 'grid lg:grid-cols-2 gap-12'
      case 'stacked':
        return 'flex flex-col gap-12'
      case 'map-first':
        return 'flex flex-col-reverse gap-12'
      case 'form-only':
        return 'max-w-2xl mx-auto'
      case 'info-only':
        return 'max-w-4xl mx-auto'
      case 'grid':
        return 'grid md:grid-cols-3 gap-8'
      case 'map-overlay':
        return 'relative'
      default:
        return 'grid lg:grid-cols-2 gap-12'
    }
  }

  // Use default fields if no custom fields defined
  const formFields = data.formFields?.length ? data.formFields : [
    { _key: 'name', type: 'text' as const, name: 'name', label: 'Nome', placeholder: 'Il tuo nome', required: true, width: 'half' as const },
    { _key: 'email', type: 'email' as const, name: 'email', label: 'Email', placeholder: 'La tua email', required: true, width: 'half' as const },
    { _key: 'message', type: 'textarea' as const, name: 'message', label: 'Messaggio', placeholder: 'Scrivi il tuo messaggio...', required: true, width: 'full' as const },
  ]

  return (
    <section className={`${paddingClasses[data.paddingY || 'lg']} ${bgClasses[backgroundColor]} ${textColor} relative overflow-hidden`}>
      {/* Decorations */}
      {data.showDecorations && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-current opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-current opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </>
      )}

      <div className="container-glos relative z-10">
        {/* Header */}
        <motion.div
          {...animationVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {!!data.eyebrow && (
            <p className={`text-sm font-semibold tracking-widest uppercase mb-4 ${darkBg ? 'opacity-80' : 'text-primary'}`}>
              {t(data.eyebrow)}
            </p>
          )}
          {!!data.title && (
            <h2 className="section-title mb-4">
              <RichText value={data.title} />
            </h2>
          )}
          {!!data.subtitle && (
            <div className="section-subtitle">
              <RichText value={data.subtitle} />
            </div>
          )}
          {!!data.description && (
            <p className="mt-4 max-w-2xl mx-auto opacity-80">
              {t(data.description)}
            </p>
          )}
        </motion.div>

        {/* Main Layout */}
        <div className={getLayoutClasses()}>
          {/* Contact Form */}
          {data.showForm !== false && (
            <motion.div
              initial={{ opacity: 0, x: data.layout === 'form-right' ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`${cardStyleClasses[data.cardStyle || 'shadow']} ${data.layout === 'form-right' ? 'lg:order-2' : ''}`}
            >
              {!!data.formTitle && (
                <h3 className="text-xl font-semibold mb-2">{t(data.formTitle)}</h3>
              )}
              {!!data.formSubtitle && (
                <p className="text-sm opacity-70 mb-6">{t(data.formSubtitle)}</p>
              )}

              {submitStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-medium">
                    {t(data.formSuccessMessage) || 'Messaggio inviato con successo!'}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formFields.map((field) => (
                      <div
                        key={field._key}
                        className={field.width === 'half' ? '' : 'md:col-span-2'}
                      >
                        {field.type === 'textarea' ? (
                          <div className="relative">
                            <label className="text-sm font-medium mb-1 block">
                              {t(field.label)} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <textarea
                              name={field.name}
                              placeholder={t(field.placeholder) || ''}
                              required={field.required}
                              rows={4}
                              className={getInputClasses()}
                              value={formData[field.name || ''] || ''}
                              onChange={(e) => setFormData({ ...formData, [field.name || '']: e.target.value })}
                            />
                          </div>
                        ) : field.type === 'select' ? (
                          <div>
                            <label className="text-sm font-medium mb-1 block">
                              {t(field.label)} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <select
                              name={field.name}
                              required={field.required}
                              className={getInputClasses()}
                              value={formData[field.name || ''] || ''}
                              onChange={(e) => setFormData({ ...formData, [field.name || '']: e.target.value })}
                            >
                              <option value="">{t(field.placeholder) || 'Seleziona...'}</option>
                              {field.options?.map((opt, idx) => (
                                <option key={idx} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        ) : field.type === 'checkbox' ? (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name={field.name}
                              required={field.required}
                              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                              checked={!!formData[field.name || '']}
                              onChange={(e) => setFormData({ ...formData, [field.name || '']: e.target.checked ? 'true' : '' })}
                            />
                            <span className="text-sm">{t(field.label)}</span>
                          </label>
                        ) : (
                          <div className="relative">
                            <label className="text-sm font-medium mb-1 block">
                              {t(field.label)} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <input
                              type={field.type || 'text'}
                              name={field.name}
                              placeholder={t(field.placeholder) || ''}
                              required={field.required}
                              className={getInputClasses()}
                              value={formData[field.name || ''] || ''}
                              onChange={(e) => setFormData({ ...formData, [field.name || '']: e.target.value })}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Privacy */}
                  {!!data.privacyText && (
                    <div className="text-sm opacity-70">
                      <RichText value={data.privacyText} />
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {t(data.submitButtonText) || 'Invia Messaggio'}
                        {data.submitButtonIcon || <Send className="w-5 h-5" />}
                      </>
                    )}
                  </button>

                  {submitStatus === 'error' && (
                    <p className="text-red-500 text-sm text-center">
                      {t(data.formErrorMessage) || 'Si è verificato un errore. Riprova.'}
                    </p>
                  )}
                </form>
              )}
            </motion.div>
          )}

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: data.layout === 'form-right' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`space-y-8 ${data.layout === 'form-right' ? 'lg:order-1' : ''}`}
          >
            {/* Contact Items */}
            {data.showContactInfo !== false && data.contactItems && data.contactItems.length > 0 && (
              <div className={cardStyleClasses[data.cardStyle || 'shadow']}>
                {!!data.contactInfoTitle && (
                  <h3 className="text-xl font-semibold mb-6">{t(data.contactInfoTitle)}</h3>
                )}
                <div className="space-y-4">
                  {data.contactItems.map((item) => (
                    <div key={item._key} className="flex items-start gap-4">
                      <div className={getIconStyleClasses()}>
                        {item.icon ? String(item.icon) : getContactIcon(item.type)}
                      </div>
                      <div>
                        {!!item.label && (
                          <p className="text-sm opacity-70">{t(item.label)}</p>
                        )}
                        {item.link ? (
                          <a
                            href={item.link}
                            className="font-medium hover:text-primary transition-colors"
                            target={item.link.startsWith('http') ? '_blank' : undefined}
                            rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opening Hours */}
            {data.showOpeningHours && data.openingHours && data.openingHours.length > 0 && (
              <div className={cardStyleClasses[data.cardStyle || 'shadow']}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={getIconStyleClasses()}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{t(data.openingHoursTitle) || 'Orari di Apertura'}</h3>
                </div>
                <div className="space-y-2">
                  {data.openingHours.map((hours) => (
                    <div key={hours._key} className="flex justify-between">
                      <span className="opacity-80">{t(hours.days)}</span>
                      <span className="font-medium">{hours.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {data.showSocialLinks && data.socialLinks && data.socialLinks.length > 0 && (
              <div>
                {!!data.socialTitle && (
                  <h3 className="text-lg font-semibold mb-4">{t(data.socialTitle)}</h3>
                )}
                <div className="flex flex-wrap gap-3">
                  {data.socialLinks.map((social) => (
                    <a
                      key={social._key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${getIconStyleClasses()} hover:scale-110 transition-transform`}
                      title={social.label || social.platform}
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {data.showMap !== false && (
              <div className={`${mapHeightClasses[data.mapHeight || 'md']} rounded-xl overflow-hidden`}>
                {data.mapType === 'google' && data.mapEmbedUrl ? (
                  <iframe
                    src={data.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : data.mapType === 'image' && isValidImage(data.mapImage) ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={safeImageUrl(data.mapImage, 800, 600)!}
                      alt="Mappa"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
