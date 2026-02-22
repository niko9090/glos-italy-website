import { Metadata } from 'next'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/sanity/fetch'

export const metadata: Metadata = {
  title: 'Privacy Policy | GLOS Italy',
  description: 'Informativa sulla privacy e trattamento dei dati personali di GLOS Italy S.r.l.',
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings()

  const companyName = settings?.legalName || 'GLOS Italy S.r.l.'
  const address = settings?.address || 'Via Basilicata, 16 - 42028 Poviglio (RE) - Italia'
  const email = settings?.email || 'info@glos.it'
  const pec = settings?.pec || ''
  const vatNumber = settings?.vatNumber || ''

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white py-16">
        <div className="container-glos">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-blue-200">Informativa sul trattamento dei dati personali</p>
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

              <h2>1. Titolare del Trattamento</h2>
              <p>
                Il Titolare del trattamento dei dati personali è:<br />
                <strong>{companyName}</strong><br />
                {address}<br />
                {vatNumber && <>P.IVA: {vatNumber}<br /></>}
                Email: <a href={`mailto:${email}`}>{email}</a><br />
                {pec && <>PEC: {pec}</>}
              </p>

              <h2>2. Tipologie di Dati Raccolti</h2>
              <p>
                Tra i Dati Personali raccolti da questo sito web, in modo autonomo o tramite terze parti, ci sono:
              </p>
              <ul>
                <li><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, sistema operativo, pagine visitate, data e ora di accesso</li>
                <li><strong>Dati forniti volontariamente:</strong> nome, cognome, email, telefono, azienda e messaggio inseriti nel form di contatto</li>
                <li><strong>Cookie e tecnologie simili:</strong> come descritto nella <Link href="/cookie">Cookie Policy</Link></li>
              </ul>

              <h2>3. Finalità del Trattamento</h2>
              <p>I dati personali sono trattati per le seguenti finalità:</p>
              <ul>
                <li><strong>Rispondere alle richieste:</strong> gestire le comunicazioni inviate tramite il form di contatto</li>
                <li><strong>Fornire preventivi:</strong> elaborare richieste commerciali e preventivi personalizzati</li>
                <li><strong>Migliorare il servizio:</strong> analisi statistiche anonime per ottimizzare il sito web</li>
                <li><strong>Adempimenti legali:</strong> rispettare obblighi di legge, regolamenti e normative vigenti</li>
              </ul>

              <h2>4. Base Giuridica del Trattamento</h2>
              <p>Il trattamento dei dati personali si basa su:</p>
              <ul>
                <li><strong>Consenso:</strong> per l&apos;invio di comunicazioni tramite form di contatto</li>
                <li><strong>Legittimo interesse:</strong> per analisi statistiche e miglioramento del servizio</li>
                <li><strong>Obbligo legale:</strong> per adempiere a obblighi di legge</li>
                <li><strong>Esecuzione contrattuale:</strong> per fornire preventivi e servizi richiesti</li>
              </ul>

              <h2>5. Modalità di Trattamento</h2>
              <p>
                Il trattamento dei dati personali viene effettuato mediante strumenti informatici e/o telematici,
                con modalità organizzative e logiche strettamente correlate alle finalità indicate.
                Sono adottate misure di sicurezza adeguate per prevenire la perdita, l&apos;uso illecito o non corretto
                e l&apos;accesso non autorizzato ai dati.
              </p>

              <h2>6. Conservazione dei Dati</h2>
              <p>
                I dati personali sono conservati per il tempo strettamente necessario a conseguire le finalità
                per cui sono stati raccolti e comunque non oltre i termini di legge:
              </p>
              <ul>
                <li><strong>Dati di contatto:</strong> conservati per 24 mesi dall&apos;ultimo contatto</li>
                <li><strong>Dati di navigazione:</strong> conservati per 12 mesi</li>
                <li><strong>Dati contabili/fiscali:</strong> conservati per 10 anni come previsto dalla legge</li>
              </ul>

              <h2>7. Comunicazione e Diffusione</h2>
              <p>
                I dati personali non sono diffusi né comunicati a terzi, salvo:
              </p>
              <ul>
                <li>Fornitori di servizi tecnici (hosting, email, analytics) che agiscono come Responsabili del trattamento</li>
                <li>Autorità competenti quando richiesto per legge</li>
              </ul>

              <h2>8. Trasferimento dei Dati</h2>
              <p>
                Alcuni servizi di terze parti potrebbero comportare il trasferimento di dati al di fuori dell&apos;UE.
                In tal caso, il trasferimento avviene nel rispetto delle garanzie previste dal GDPR
                (decisioni di adeguatezza, clausole contrattuali standard, ecc.).
              </p>

              <h2>9. Diritti dell&apos;Interessato</h2>
              <p>Ai sensi degli artt. 15-22 del GDPR, l&apos;interessato ha diritto di:</p>
              <ul>
                <li><strong>Accesso:</strong> ottenere conferma del trattamento e copia dei dati</li>
                <li><strong>Rettifica:</strong> correggere dati inesatti o incompleti</li>
                <li><strong>Cancellazione:</strong> richiedere la cancellazione dei dati (&quot;diritto all&apos;oblio&quot;)</li>
                <li><strong>Limitazione:</strong> limitare il trattamento in determinati casi</li>
                <li><strong>Portabilità:</strong> ricevere i dati in formato strutturato e leggibile</li>
                <li><strong>Opposizione:</strong> opporsi al trattamento per motivi legittimi</li>
                <li><strong>Revoca del consenso:</strong> revocare il consenso in qualsiasi momento</li>
              </ul>
              <p>
                Per esercitare i propri diritti, l&apos;interessato può inviare una richiesta a{' '}
                <a href={`mailto:${email}`}>{email}</a>.
              </p>

              <h2>10. Reclamo all&apos;Autorità di Controllo</h2>
              <p>
                L&apos;interessato ha diritto di proporre reclamo all&apos;Autorità Garante per la Protezione dei Dati Personali:<br />
                <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a>
              </p>

              <h2>11. Modifiche alla Privacy Policy</h2>
              <p>
                Il Titolare si riserva il diritto di modificare questa informativa in qualsiasi momento.
                Le modifiche saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.
              </p>

              <h2>12. Cookie</h2>
              <p>
                Per informazioni sull&apos;utilizzo dei cookie, si prega di consultare la nostra{' '}
                <Link href="/cookie" className="text-primary hover:underline">Cookie Policy</Link>.
              </p>

            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/"
                className="inline-flex items-center text-primary hover:underline"
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
