// Script per aggiornare i dati aziendali in tutto il sito

const projectId = '97oreljh'
const dataset = 'production'
const token = 'skA1PF9CiGcxPjkXxpxCzCoxUErZKlzi4x8ajNyRqQMlHw9jhdusMoOORZZt4onZlUaVgBHKNKG2hxwe7OxeFcugABIPQDhgkU8pMoxTOcuOx8ePAclCdJuXxloTw1csZ0yrEWODDX9KwWjuYN6lFWPKTdIKtaS45a4sLk54QZySu1eewqEz'
const apiVersion = '2024-01-01'

const companyData = {
  // Sede
  address: 'Via Basilicata, 16',
  city: 'Poviglio',
  province: 'RE',
  postalCode: '42028',
  country: 'Italia',
  fullAddress: 'Via Basilicata, 16 - 42028 Poviglio (RE), Italia',

  // Contatti
  phone: '+39 0522 967690',
  email: 'info@glos.it',
  salesEmail: 'sales@glos.it',
  technicalEmail: 'technical@glos.it',

  // Web
  website: 'www.glos.it',

  // Dati fiscali
  vatNumber: 'IT 02915060350',
  fiscalCode: '02915060350'
}

async function mutateSanity(mutations) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ mutations })
  })
  return res.json()
}

async function updateCompanyInfo() {
  try {
    console.log('Aggiornamento dati aziendali in siteSettings...')

    const mutations = [
      {
        patch: {
          id: 'siteSettings',
          set: {
            // Indirizzo
            address: companyData.fullAddress,
            city: companyData.city,
            province: companyData.province,
            postalCode: companyData.postalCode,
            country: companyData.country,

            // Contatti
            phone: companyData.phone,
            email: companyData.email,
            salesEmail: companyData.salesEmail,
            technicalEmail: companyData.technicalEmail,

            // Web
            website: companyData.website,

            // Dati fiscali
            vatNumber: companyData.vatNumber,
            fiscalCode: companyData.fiscalCode,

            // Per il footer e altre sezioni
            contactInfo: {
              address: companyData.fullAddress,
              phone: companyData.phone,
              email: companyData.email,
              salesEmail: companyData.salesEmail,
              technicalEmail: companyData.technicalEmail
            }
          }
        }
      }
    ]

    const result = await mutateSanity(mutations)
    console.log('Risultato:', JSON.stringify(result, null, 2))
    console.log('✅ Dati aziendali aggiornati!')

    console.log('\n📋 Riepilogo dati aggiornati:')
    console.log('   Sede: ' + companyData.fullAddress)
    console.log('   Telefono: ' + companyData.phone)
    console.log('   Email: ' + companyData.email)
    console.log('   Email Commerciale: ' + companyData.salesEmail)
    console.log('   Assistenza Tecnica: ' + companyData.technicalEmail)
    console.log('   Sito Web: ' + companyData.website)
    console.log('   P.IVA / C.F.: ' + companyData.vatNumber)

  } catch (error) {
    console.error('Errore:', error)
  }
}

updateCompanyInfo()
