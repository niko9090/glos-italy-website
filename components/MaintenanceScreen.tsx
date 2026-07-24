import Link from 'next/link'
import { Wrench } from 'lucide-react'
import GlosWatermark from './GlosWatermark'

interface MaintenanceScreenProps {
  title?: string
  message?: string
  backHref?: string
  backLabel?: string
}

// Schermata di manutenzione brandizzata (sito intero o singola sezione).
export default function MaintenanceScreen({
  title = 'Sito in manutenzione',
  message = 'Stiamo effettuando alcuni interventi di aggiornamento. Torneremo online a brevissimo.',
  backHref,
  backLabel,
}: MaintenanceScreenProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-metal-50 via-white to-primary/5 overflow-hidden">
      <GlosWatermark />
      <div className="relative z-10 max-w-lg w-full text-center">
        <div className="mb-6 text-3xl font-extrabold tracking-tight text-primary">
          GLOS <span className="text-metal-700">Italy</span>
        </div>
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Wrench className="h-9 w-9 text-primary" />
        </div>
        <h1 className="mb-3 text-3xl md:text-4xl font-bold text-metal-900">{title}</h1>
        <p className="mb-8 text-metal-500 leading-relaxed">{message}</p>
        {backHref && (
          <Link href={backHref} className="btn-primary inline-flex items-center justify-center">
            {backLabel || 'Torna alla home'}
          </Link>
        )}
      </div>
    </div>
  )
}
