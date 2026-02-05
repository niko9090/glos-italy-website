'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Check, Loader2, MessageCircle } from 'lucide-react'

interface ChatButtonProps {
  defaultMessage?: string
  companyName?: string
}

type SendStatus = 'idle' | 'sending' | 'success' | 'error'

export function WhatsAppButton({
  defaultMessage = 'Ciao, vorrei informazioni sui vostri prodotti.',
  companyName = 'GLOS Italy'
}: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState(defaultMessage)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<SendStatus>('idle')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setMessage(defaultMessage)
      setName('')
      setPhone('')
      setStatus('idle')
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [isOpen, defaultMessage])

  const handleSend = async () => {
    if (!message.trim() || status === 'sending') return

    setStatus('sending')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
        }),
      })

      if (response.ok) {
        setStatus('success')
        // Chiudi dopo 2 secondi
        setTimeout(() => {
          setIsOpen(false)
          setStatus('idle')
        }, 2000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#0047AB] px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{companyName}</p>
                <p className="text-white/70 text-xs">Rispondiamo in pochi minuti</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Chiudi"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Success State */}
            {status === 'success' ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Messaggio inviato!
                </h3>
                <p className="text-sm text-gray-500">
                  Ti risponderemo al più presto
                </p>
              </div>
            ) : (
              <>
                {/* Chat Area */}
                <div className="bg-gray-50 p-4">
                  {/* Bubble messaggio azienda */}
                  <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[85%] border border-gray-100">
                    <p className="text-gray-800 text-sm">
                      Ciao! Come possiamo aiutarti? Scrivi il tuo messaggio e ti risponderemo subito.
                    </p>
                  </div>
                </div>

                {/* Form Area */}
                <div className="p-4 space-y-3 border-t border-gray-100">
                  {/* Nome e Telefono */}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome (opzionale)"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0047AB] focus:ring-1 focus:ring-[#0047AB]"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Telefono (opz.)"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0047AB] focus:ring-1 focus:ring-[#0047AB]"
                    />
                  </div>

                  {/* Messaggio */}
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Scrivi un messaggio..."
                      rows={2}
                      disabled={status === 'sending'}
                      className="flex-1 resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#0047AB] focus:ring-1 focus:ring-[#0047AB] disabled:opacity-50"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!message.trim() || status === 'sending'}
                      className="flex-shrink-0 w-10 h-10 bg-[#0047AB] hover:bg-[#003580] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
                      aria-label="Invia messaggio"
                    >
                      {status === 'sending' ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : (
                        <Send className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Error message */}
                  {status === 'error' && (
                    <p className="text-xs text-red-500 text-center">
                      Errore nell'invio. Riprova.
                    </p>
                  )}

                  <p className="text-[10px] text-gray-400 text-center">
                    Premi Invio per inviare
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-[#0047AB] rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Chiudi chat' : 'Apri chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-7 h-7 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse animation - only when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#0047AB] animate-ping opacity-25" />
        )}
      </motion.button>
    </div>
  )
}
