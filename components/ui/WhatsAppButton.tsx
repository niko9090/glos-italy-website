'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Clock } from 'lucide-react'

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
}

export function WhatsAppButton({
  phoneNumber,
  message = 'Ciao, vorrei informazioni sui vostri prodotti.'
}: WhatsAppButtonProps) {
  const [showPopup, setShowPopup] = useState(false)

  // Verifica se il numero e' configurato correttamente (non placeholder e non vuoto)
  const isConfigured = phoneNumber &&
    phoneNumber !== '39XXXXXXXXXX' &&
    phoneNumber.replace(/\D/g, '').length >= 10

  const handleClick = () => {
    if (isConfigured) {
      // Apri WhatsApp con il numero configurato
      const cleanNumber = phoneNumber!.replace(/\D/g, '')
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    } else {
      // Mostra popup "in sviluppo"
      setShowPopup(true)
    }
  }

  return (
    <>
      <motion.button
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Contattaci su WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" fill="white" />
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
      </motion.button>

      {/* Popup "Funzionalita in sviluppo" */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Chiudi"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-[#25D366]/10 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-[#25D366]" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Funzionalita in Sviluppo
              </h3>

              {/* Message */}
              <p className="text-gray-600 mb-4">
                Il servizio WhatsApp sara disponibile a breve. Nel frattempo puoi contattarci tramite il modulo di contatto o via email.
              </p>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Prossimamente
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowPopup(false)}
                className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Ho capito
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
