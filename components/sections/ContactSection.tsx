// Contact Section Component
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Phone, Mail, CheckCircle } from 'lucide-react'
import { t, defaultLocale } from '@/lib/i18n'

interface ContactSectionProps {
  data: {
    title?: { it?: string; en?: string; es?: string }
    subtitle?: { it?: string; en?: string; es?: string }
    showForm?: boolean
    formSettings?: {
      submitButtonText?: { it?: string; en?: string; es?: string }
      successMessage?: { it?: string; en?: string; es?: string }
      subjects?: Array<{
        value?: string
        label?: { it?: string; en?: string; es?: string }
      }>
    }
    showMap?: boolean
    showContactInfo?: boolean
  }
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

const successVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1], // Spring-like bounce
    },
  },
}

const iconHoverVariants = {
  hover: {
    scale: 1.15,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
}

export default function ContactSection({ data }: ContactSectionProps) {
  const locale = defaultLocale
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const body = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section bg-gray-50">
      <div className="container-glos">
        {/* Header */}
        <div className="text-center mb-12">
          {data.title && (
            <h2 className="section-title mb-4">{t(data.title, locale)}</h2>
          )}
          {data.subtitle && (
            <p className="section-subtitle mx-auto">{t(data.subtitle, locale)}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          {data.showForm && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {isSubmitted ? (
                <motion.div
                  className="text-center py-12"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.2,
                      duration: 0.5,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                  >
                    <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                  </motion.div>
                  <motion.h3
                    className="text-2xl font-semibold mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Messaggio Inviato!
                  </motion.h3>
                  <motion.p
                    className="text-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {t(data.formSettings?.successMessage, locale) ||
                      'Grazie per averci contattato. Ti risponderemo al piu presto.'}
                  </motion.p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="label">
                        Nome *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="input transition-transform duration-200 focus:scale-[1.02]"
                        placeholder="Il tuo nome"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="input transition-transform duration-200 focus:scale-[1.02]"
                        placeholder="La tua email"
                      />
                    </div>
                  </motion.div>

                  {data.formSettings?.subjects && data.formSettings.subjects.length > 0 && (
                    <motion.div variants={itemVariants}>
                      <label htmlFor="subject" className="label">
                        Oggetto
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="input transition-transform duration-200 focus:scale-[1.02]"
                      >
                        <option value="">Seleziona un argomento</option>
                        {data.formSettings.subjects.map((subject, index) => (
                          <option key={index} value={subject.value}>
                            {t(subject.label, locale)}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <label htmlFor="message" className="label">
                      Messaggio *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="input resize-none transition-transform duration-200 focus:scale-[1.02]"
                      placeholder="Scrivi il tuo messaggio..."
                    />
                  </motion.div>

                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Invio in corso...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        {t(data.formSettings?.submitButtonText, locale) || 'Invia Messaggio'}
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </motion.div>
          )}

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {data.showContactInfo && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-6">Informazioni di Contatto</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <motion.div
                      variants={iconHoverVariants}
                      whileHover="hover"
                      className="cursor-pointer"
                    >
                      <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    </motion.div>
                    <div>
                      <p className="font-medium">Indirizzo</p>
                      <p className="text-gray-600">Via Example 123, 12345 Citta, Italia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <motion.div
                      variants={iconHoverVariants}
                      whileHover="hover"
                      className="cursor-pointer"
                    >
                      <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    </motion.div>
                    <div>
                      <p className="font-medium">Telefono</p>
                      <a href="tel:+390123456789" className="text-gray-600 hover:text-primary">
                        +39 0123 456 789
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <motion.div
                      variants={iconHoverVariants}
                      whileHover="hover"
                      className="cursor-pointer"
                    >
                      <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    </motion.div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:info@glositaly.it" className="text-gray-600 hover:text-primary">
                        info@glositaly.it
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {data.showMap && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">
                    Mappa Google - Configurare con API Key
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
