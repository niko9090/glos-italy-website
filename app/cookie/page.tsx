import { Metadata } from 'next'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/sanity/fetch'

export const metadata: Metadata = {
  title: 'Cookie Policy | GLOS Italy',
  description: 'Informativa sull\'utilizzo dei cookie sul sito GLOS Italy.',
}

export default async function CookiePolicyPage() {
  const settings = await getSiteSettings()

  const companyName = settings?.legalName || 'GLOS Italy S.r.l.'
  const email = settings?.email || 'info@glos.it'

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-16">
        <div className="container-glos">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-blue-200">Informativa sull&apos;utilizzo dei cookie</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container-glos">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div className="prose prose-lg max-w-none">

              <p className="text-gray-500 text-sm mb-8">
                Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              <h2>1. Cosa sono i Cookie</h2>
              <p>
                I cookie sono piccoli file di testo che i siti web salvano sul dispositivo dell&apos;utente
                (computer, tablet, smartphone) durante la navigazione. Vengono utilizzati per memorizzare
                informazioni e preferenze, migliorare l&apos;esperienza di navigazione e raccogliere dati statistici.
              </p>

              <h2>2. Titolare del Trattamento</h2>
              <p>
                Il Titolare del trattamento dei dati raccolti tramite cookie è:<br />
                <strong>{companyName}</strong><br />
                Email: <a href={`mailto:${email}`}>{email}</a>
              </p>

              <h2>3. Tipologie di Cookie Utilizzati</h2>

              <h3>3.1 Cookie Tecnici (Necessari)</h3>
              <p>
                Sono essenziali per il corretto funzionamento del sito web. Non richiedono il consenso dell&apos;utente.
              </p>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Cookie</th>
                    <th className="border border-gray-300 p-2 text-left">Finalità</th>
                    <th className="border border-gray-300 p-2 text-left">Durata</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">glos-language</td>
                    <td className="border border-gray-300 p-2">Memorizza la lingua preferita</td>
                    <td className="border border-gray-300 p-2">1 anno</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">cookie-consent</td>
                    <td className="border border-gray-300 p-2">Memorizza le preferenze cookie</td>
                    <td className="border border-gray-300 p-2">1 anno</td>
                  </tr>
                </tbody>
              </table>

              <h3>3.2 Cookie Analitici</h3>
              <p>
                Utilizzati per raccogliere informazioni statistiche in forma anonima sull&apos;utilizzo del sito.
                Richiedono il consenso dell&apos;utente.
              </p>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Servizio</th>
                    <th className="border border-gray-300 p-2 text-left">Finalità</th>
                    <th className="border border-gray-300 p-2 text-left">Privacy Policy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">Vercel Analytics</td>
                    <td className="border border-gray-300 p-2">Statistiche di navigazione</td>
                    <td className="border border-gray-300 p-2">
                      <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3>3.3 Cookie di Terze Parti</h3>
              <p>
                Il sito potrebbe incorporare contenuti o servizi di terze parti che installano propri cookie.
              </p>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Servizio</th>
                    <th className="border border-gray-300 p-2 text-left">Finalità</th>
                    <th className="border border-gray-300 p-2 text-left">Privacy Policy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">Google Maps</td>
                    <td className="border border-gray-300 p-2">Visualizzazione mappe</td>
                    <td className="border border-gray-300 p-2">
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Tawk.to</td>
                    <td className="border border-gray-300 p-2">Live chat supporto</td>
                    <td className="border border-gray-300 p-2">
                      <a href="https://www.tawk.to/privacy-policy/" target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Sanity CDN</td>
                    <td className="border border-gray-300 p-2">Distribuzione contenuti</td>
                    <td className="border border-gray-300 p-2">
                      <a href="https://www.sanity.io/legal/privacy" target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h2>4. Gestione dei Cookie</h2>
              <p>
                L&apos;utente può gestire le preferenze sui cookie in diversi modi:
              </p>

              <h3>4.1 Tramite il Banner Cookie</h3>
              <p>
                Al primo accesso al sito viene mostrato un banner che permette di accettare o rifiutare
                i cookie non essenziali. Le preferenze possono essere modificate in qualsiasi momento.
              </p>

              <h3>4.2 Tramite le Impostazioni del Browser</h3>
              <p>
                È possibile bloccare o eliminare i cookie attraverso le impostazioni del browser.
                Di seguito i link alle istruzioni dei principali browser:
              </p>
              <ul>
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop" target="_blank" rel="noopener noreferrer">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                    Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
                    Microsoft Edge
                  </a>
                </li>
              </ul>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
                <p className="text-amber-800 text-sm mb-0">
                  <strong>Nota:</strong> La disattivazione dei cookie tecnici potrebbe compromettere
                  alcune funzionalità del sito web.
                </p>
              </div>

              <h2>5. Cookie e Dati Personali</h2>
              <p>
                Per informazioni complete sul trattamento dei dati personali, inclusi quelli raccolti
                tramite cookie, si prega di consultare la nostra{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>

              <h2>6. Aggiornamenti</h2>
              <p>
                La presente Cookie Policy può essere soggetta a modifiche. La data dell&apos;ultimo
                aggiornamento è indicata in cima a questa pagina. Si consiglia di consultare
                periodicamente questa pagina.
              </p>

              <h2>7. Contatti</h2>
              <p>
                Per domande o richieste relative ai cookie, contattare:<br />
                <a href={`mailto:${email}`}>{email}</a>
              </p>

              <h2>8. Riferimenti Normativi</h2>
              <ul>
                <li>Regolamento UE 2016/679 (GDPR)</li>
                <li>Direttiva 2002/58/CE (ePrivacy)</li>
                <li>D.Lgs. 196/2003 (Codice Privacy) e s.m.i.</li>
                <li>Linee guida del Garante Privacy sui cookie (10 giugno 2021)</li>
              </ul>

            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4">
              <Link
                href="/privacy"
                className="inline-flex items-center text-primary hover:underline"
              >
                Privacy Policy →
              </Link>
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:underline"
              >
                ← Torna alla home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
