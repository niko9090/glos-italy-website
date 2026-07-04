import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Area Riservata | GLOS Italy',
  description:
    "L'Area Riservata clienti GL.OS: presto potrai seguire i tuoi progetti, consultare offerte e fatture, aprire richieste di assistenza e provare le nostre demo.",
}

const features = [
  { title: 'I tuoi progetti', text: 'Segui lo stato di avanzamento e la documentazione dei tuoi impianti.' },
  { title: 'Offerte e fatture', text: 'Consulta e scarica offerte e fatture, sempre disponibili online.' },
  { title: 'Assistenza dedicata', text: 'Apri richieste di supporto e segui la loro lavorazione.' },
  { title: 'Demo interattive', text: 'Prova da vicino i nostri sistemi di controllo produzione.' },
]

export default function AreaRiservataPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-20">
        <div className="container-glos text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" /> Coming soon
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold">Area Riservata Clienti</h1>
          <p className="mt-4 text-blue-200 max-w-2xl mx-auto text-lg">
            Stiamo preparando la tua area riservata GL.OS. Presto avrai a portata di mano tutto il tuo
            rapporto con noi: progetti, offerte, fatture, assistenza e demo.
          </p>
        </div>
      </section>

      {/* Cosa troverai */}
      <section className="py-16">
        <div className="container-glos">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900">{f.title}</h2>
                <p className="mt-2 text-gray-500">{f.text}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mt-10 text-center">
            <p className="text-gray-500">
              L&apos;accesso sarà disponibile a breve. Per informazioni scrivici a{' '}
              <a href="mailto:info@glos.it" className="text-primary font-medium hover:underline">
                info@glos.it
              </a>
              .
            </p>
            <Link href="/contatti" className="btn-primary inline-block mt-6">
              Contattaci
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
