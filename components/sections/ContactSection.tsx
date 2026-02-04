// Contact Section Component - VERSIONE GLASSMORPHISM v2.0
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  MapPin, Phone, Mail, Clock, MessageCircle, Send,
  Facebook, Instagram, Linkedin, Twitter, Youtube, CheckCircle2, AlertCircle
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

interface RequestType {
  _key?: string
  value?: string
  label?: unknown
  icon?: string
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
    // Request Type (tipo di richiesta)
    showRequestType?: boolean
    requestTypeLabel?: unknown
    requestTypes?: RequestType[]
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
    paddingY?: string
    paddingTop?: string
    paddingBottom?: string
    marginTop?: string
    marginBottom?: string
    containerMaxWidth?: string
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
  const [focusedField, setFocusedField] = useState<string | null>(null)

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
    if (data.textColor?.includes('dark')) return 'text-gray-900'
    if (data.textColor?.includes('light')) return 'text-white'
    const darkBgs = ['primary', 'black', 'gradient']
    return darkBgs.some(bg => (data.backgroundColor || 'white').includes(bg)) ? 'text-white' : 'text-gray-900'
  }

  // Padding classes (legacy paddingY)
  const paddingYClasses: Record<string, string> = {
    none: 'py-0',
    sm: 'py-4 md:py-6',
    md: 'py-8 md:py-12',
    lg: 'py-12 md:py-16',
    xl: 'py-16 md:py-24',
    '2xl': 'py-24 md:py-32',
  }

  // Padding Top classes
  const paddingTopClasses: Record<string, string> = {
    none: 'pt-0',
    sm: 'pt-4 md:pt-6',
    md: 'pt-8 md:pt-12',
    lg: 'pt-12 md:pt-16',
    xl: 'pt-16 md:pt-24',
    '2xl': 'pt-24 md:pt-32',
  }

  // Padding Bottom classes
  const paddingBottomClasses: Record<string, string> = {
    none: 'pb-0',
    sm: 'pb-4 md:pb-6',
    md: 'pb-8 md:pb-12',
    lg: 'pb-12 md:pb-16',
    xl: 'pb-16 md:pb-24',
    '2xl': 'pb-24 md:pb-32',
  }

  // Margin Top classes
  const marginTopClasses: Record<string, string> = {
    none: 'mt-0',
    sm: 'mt-4 md:mt-6',
    md: 'mt-8 md:mt-12',
    lg: 'mt-12 md:mt-16',
    xl: 'mt-16 md:mt-24',
  }

  // Margin Bottom classes
  const marginBottomClasses: Record<string, string> = {
    none: 'mb-0',
    sm: 'mb-4 md:mb-6',
    md: 'mb-8 md:mb-12',
    lg: 'mb-12 md:mb-16',
    xl: 'mb-16 md:mb-24',
  }

  // Container width classes
  const containerMaxWidthClasses: Record<string, string> = {
    narrow: 'max-w-3xl',
    normal: 'max-w-6xl',
    wide: 'max-w-7xl',
    full: 'max-w-none',
  }

  // Compute spacing classes
  const getSpacingClasses = () => {
    const classes: string[] = []

    // Use paddingTop/Bottom if specified, otherwise fallback to paddingY
    if (data.paddingTop) {
      classes.push(paddingTopClasses[data.paddingTop] || '')
    }
    if (data.paddingBottom) {
      classes.push(paddingBottomClasses[data.paddingBottom] || '')
    }
    // If neither paddingTop nor paddingBottom, use legacy paddingY
    if (!data.paddingTop && !data.paddingBottom) {
      classes.push(paddingYClasses[data.paddingY || 'lg'] || paddingYClasses.lg)
    }

    // Margins
    if (data.marginTop) {
      classes.push(marginTopClasses[data.marginTop] || '')
    }
    if (data.marginBottom) {
      classes.push(marginBottomClasses[data.marginBottom] || '')
    }

    return classes.filter(Boolean).join(' ')
  }

  // Map height classes
  const mapHeightClasses: Record<string, string> = {
    sm: 'h-[200px]',
    md: 'h-[300px]',
    lg: 'h-[400px]',
    xl: 'h-[500px]',
  }

  // Card style classes - NUOVI stili glassmorphism
  const cardStyleClasses: Record<string, string> = {
    none: '',
    border: 'border border-gray-200 rounded-2xl p-6 md:p-8',
    shadow: 'shadow-2xl rounded-2xl p-6 md:p-8 bg-white',
    glass: 'bg-white/80 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/30 shadow-xl',
    colored: 'bg-primary/5 rounded-2xl p-6 md:p-8',
  }

  // Icon style classes
  const getIconStyleClasses = () => {
    switch (data.iconStyle) {
      case 'simple':
        return 'text-primary'
      case 'circle-filled':
        return 'w-12 h-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center shadow-lg'
      case 'circle-outlined':
        return 'w-12 h-12 border-2 border-primary text-primary rounded-full flex items-center justify-center'
      case 'square':
        return 'w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center'
      default:
        return 'w-12 h-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center shadow-lg'
    }
  }

  // Form input classes - NUOVO stile con bordi colorati al focus
  const getInputClasses = (fieldName?: string) => {
    const isFocused = focusedField === fieldName
    const base = 'w-full px-4 py-3.5 transition-all duration-300 ease-out focus:outline-none bg-white/60 backdrop-blur-sm'
    const borderBase = 'border-2 rounded-xl'
    const focusStyles = isFocused
      ? 'border-primary ring-4 ring-primary/20 bg-white shadow-lg'
      : 'border-gray-200/80 hover:border-gray-300'

    return `${base} ${borderBase} ${focusStyles}`
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

  // Handle form submission - NUOVA implementazione con API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          requestType: formData.requestType || undefined,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus('success')
        setFormData({})
      } else {
        throw new Error(result.error || 'Errore durante l\'invio')
      }
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

  // Layout classes - AGGIORNATI per bilanciamento altezze
  const getLayoutClasses = () => {
    const layout = data.layout || 'form-left'
    if (layout?.includes('form-left')) return 'grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch'
    if (layout?.includes('form-right')) return 'grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch'
    if (layout?.includes('stacked')) return 'flex flex-col gap-12'
    if (layout?.includes('map-first')) return 'flex flex-col-reverse gap-12'
    if (layout?.includes('form-only')) return 'max-w-2xl mx-auto'
    if (layout?.includes('info-only')) return 'max-w-4xl mx-auto'
    if (layout?.includes('grid')) return 'grid md:grid-cols-3 gap-8 items-stretch'
    if (layout?.includes('map-overlay')) return 'relative'
    return 'grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch'
  }

  // Use default fields if no custom fields defined
  const formFields = data.formFields?.length ? data.formFields : [
    { _key: 'name', type: 'text' as const, name: 'name', label: 'Nome', placeholder: 'Il tuo nome', required: true, width: 'half' as const },
    { _key: 'email', type: 'email' as const, name: 'email', label: 'Email', placeholder: 'La tua email', required: true, width: 'half' as const },
    { _key: 'message', type: 'textarea' as const, name: 'message', label: 'Messaggio', placeholder: 'Scrivi il tuo messaggio...', required: true, width: 'full' as const },
  ]

  // Get container class
  const containerClass = data.containerMaxWidth
    ? `${containerMaxWidthClasses[data.containerMaxWidth] || ''} mx-auto px-4 md:px-6`
    : 'container-glos'

  return (
    <section className={`${getSpacingClasses()} ${bgClasses[backgroundColor]} ${textColor} relative overflow-hidden`}>
      {/* Decorations */}
      {data.showDecorations && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/3 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
        </>
      )}

      <div className={`${containerClass} relative z-10`}>
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
              {String(t(data.eyebrow) || '')}
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
              {String(t(data.description) || '')}
            </p>
          )}
        </motion.div>

        {/* Main Layout */}
        <div className={getLayoutClasses()}>
          {/* Contact Form - NUOVO STILE GLASSMORPHISM */}
          {data.showForm !== false && (
            <motion.div
              initial={{ opacity: 0, x: data.layout?.includes('form-right') ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`
                bg-white/80 backdrop-blur-lg rounded-2xl p-6 md:p-8
                border border-white/30 shadow-2xl
                ${data.layout?.includes('form-right') ? 'lg:order-2' : ''}
              `}
            >
              {!!data.formTitle && (
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {String(t(data.formTitle) || '')}
                </h3>
              )}
              {!!data.formSubtitle && (
                <p className="text-gray-600 mb-6">{String(t(data.formSubtitle) || '')}</p>
              )}

              {submitStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <p className="text-xl font-semibold text-gray-900">
                    {t(data.formSuccessMessage) || 'Messaggio inviato con successo!'}
                  </p>
                  <p className="text-gray-600 mt-2">Ti risponderemo al piu presto.</p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="mt-6 text-primary hover:text-primary-dark font-medium transition-colors"
                  >
                    Invia un altro messaggio
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Request Type Dropdown */}
                  {data.showRequestType !== false && data.requestTypes && data.requestTypes.length > 0 && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        {t(data.requestTypeLabel) || 'Tipo di richiesta'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="requestType"
                        required
                        className={getInputClasses('requestType')}
                        value={formData['requestType'] || ''}
                        onFocus={() => setFocusedField('requestType')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                      >
                        <option value="">Seleziona il tipo di richiesta...</option>
                        {data.requestTypes.map((rt, idx) => (
                          <option key={rt._key || idx} value={rt.value || ''}>
                            {rt.icon ? `${rt.icon} ` : ''}{t(rt.label) || rt.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {formFields.map((field) => (
                      <div
                        key={field._key}
                        className={`${field.width === 'half' ? '' : 'md:col-span-2'}`}
                      >
                        {field.type === 'textarea' ? (
                          <div className="relative">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                              {String(t(field.label) || '')} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <textarea
                              name={field.name}
                              placeholder={t(field.placeholder) || ''}
                              required={field.required}
                              rows={5}
                              className={`${getInputClasses(field.name)} min-h-[140px] resize-none`}
                              value={formData[field.name || ''] || ''}
                              onFocus={() => setFocusedField(field.name || null)}
                              onBlur={() => setFocusedField(null)}
                              onChange={(e) => setFormData({ ...formData, [field.name || '']: e.target.value })}
                            />
                          </div>
                        ) : field.type === 'select' ? (
                          <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                              {String(t(field.label) || '')} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <select
                              name={field.name}
                              required={field.required}
                              className={getInputClasses(field.name)}
                              value={formData[field.name || ''] || ''}
                              onFocus={() => setFocusedField(field.name || null)}
                              onBlur={() => setFocusedField(null)}
                              onChange={(e) => setFormData({ ...formData, [field.name || '']: e.target.value })}
                            >
                              <option value="">{t(field.placeholder) || 'Seleziona...'}</option>
                              {field.options?.map((opt, idx) => (
                                <option key={idx} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        ) : field.type === 'checkbox' ? (
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              name={field.name}
                              required={field.required}
                              className="w-5 h-5 rounded border-2 border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 transition-all"
                              checked={!!formData[field.name || '']}
                              onChange={(e) => setFormData({ ...formData, [field.name || '']: e.target.checked ? 'true' : '' })}
                            />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{String(t(field.label) || '')}</span>
                          </label>
                        ) : (
                          <div className="relative">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                              {String(t(field.label) || '')} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <input
                              type={field.type || 'text'}
                              name={field.name}
                              placeholder={t(field.placeholder) || ''}
                              required={field.required}
                              className={getInputClasses(field.name)}
                              value={formData[field.name || ''] || ''}
                              onFocus={() => setFocusedField(field.name || null)}
                              onBlur={() => setFocusedField(null)}
                              onChange={(e) => setFormData({ ...formData, [field.name || '']: e.target.value })}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Privacy */}
                  {!!data.privacyText && (
                    <div className="text-sm text-gray-500">
                      <RichText value={data.privacyText} />
                    </div>
                  )}

                  {/* Submit Button - NUOVO STILE con gradiente e hover animato */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      w-full py-4 px-6
                      bg-gradient-to-r from-primary via-primary to-primary-dark
                      hover:from-primary-dark hover:via-primary hover:to-primary
                      text-white font-semibold text-lg
                      rounded-xl shadow-lg hover:shadow-xl
                      transform hover:-translate-y-0.5 active:translate-y-0
                      transition-all duration-300 ease-out
                      flex items-center justify-center gap-3
                      disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                      group
                    "
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Invio in corso...</span>
                      </>
                    ) : (
                      <>
                        <span>{t(data.submitButtonText) || 'Invia Messaggio'}</span>
                        <Send className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg p-3"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{t(data.formErrorMessage) || 'Si e verificato un errore. Riprova.'}</span>
                    </motion.div>
                  )}
                </form>
              )}
            </motion.div>
          )}

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: data.layout?.includes('form-right') ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className={`
              flex flex-col gap-6
              ${data.layout?.includes('form-right') ? 'lg:order-1' : ''}
            `}
          >
            {/* Contact Items */}
            {data.showContactInfo !== false && data.contactItems && data.contactItems.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/30 shadow-xl">
                {!!data.contactInfoTitle && (
                  <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {String(t(data.contactInfoTitle) || '')}
                  </h3>
                )}
                <div className="space-y-5">
                  {data.contactItems.map((item) => (
                    <motion.div
                      key={item._key}
                      className="flex items-start gap-4 group"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className={getIconStyleClasses()}>
                        {item.icon ? String(item.icon) : getContactIcon(item.type)}
                      </div>
                      <div>
                        {!!item.label && (
                          <p className="text-sm text-gray-500 mb-0.5">{String(t(item.label) || '')}</p>
                        )}
                        {item.link ? (
                          <a
                            href={item.link}
                            className="font-medium text-gray-900 hover:text-primary transition-colors"
                            target={item.link.startsWith('http') ? '_blank' : undefined}
                            rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium text-gray-900">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Opening Hours */}
            {data.showOpeningHours && data.openingHours && data.openingHours.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/30 shadow-xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className={getIconStyleClasses()}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{t(data.openingHoursTitle) || 'Orari di Apertura'}</h3>
                </div>
                <div className="space-y-3">
                  {data.openingHours.map((hours) => (
                    <div key={hours._key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600">{String(t(hours.days) || '')}</span>
                      <span className="font-semibold text-gray-900">{hours.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {data.showSocialLinks && data.socialLinks && data.socialLinks.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/30 shadow-xl">
                {!!data.socialTitle && (
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{String(t(data.socialTitle) || '')}</h3>
                )}
                <div className="flex flex-wrap gap-3">
                  {data.socialLinks.map((social) => (
                    <motion.a
                      key={social._key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl"
                      title={social.label || social.platform}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {getSocialIcon(social.platform)}
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {data.showMap !== false && (
              <div className={`${mapHeightClasses[data.mapHeight || 'md']} rounded-2xl overflow-hidden shadow-xl border border-white/30`}>
                {data.mapType?.includes('google') && data.mapEmbedUrl ? (
                  <iframe
                    src={data.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : data.mapType?.includes('image') && isValidImage(data.mapImage) ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={safeImageUrl(data.mapImage, 800, 600)!}
                      alt="Mappa"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Mappa non configurata</p>
                    </div>
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
