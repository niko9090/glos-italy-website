// Script per creare il prodotto ECO-CUT

const projectId = '97oreljh'
const dataset = 'production'
const token = 'skA1PF9CiGcxPjkXxpxCzCoxUErZKlzi4x8ajNyRqQMlHw9jhdusMoOORZZt4onZlUaVgBHKNKG2hxwe7OxeFcugABIPQDhgkU8pMoxTOcuOx8ePAclCdJuXxloTw1csZ0yrEWODDX9KwWjuYN6lFWPKTdIKtaS45a4sLk54QZySu1eewqEz'
const apiVersion = '2024-01-01'

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

async function createEcoCut() {
  try {
    console.log('Creazione categoria e prodotto ECO-CUT...')

    const mutations = [
      // Crea categoria ECO-CUT
      {
        createOrReplace: {
          _id: 'cat-eco-cut',
          _type: 'productCategory',
          name: {
            it: 'ECO-CUT',
            en: 'ECO-CUT',
            es: 'ECO-CUT'
          },
          slug: { _type: 'slug', current: 'eco-cut' },
          description: {
            it: 'Taglierine professionali per polistirolo - 4ª generazione',
            en: 'Professional polystyrene cutters - 4th generation',
            es: 'Cortadoras profesionales de poliestireno - 4ª generación'
          },
          isActive: true,
          sortOrder: 1
        }
      },
      // Crea prodotto ECO-CUT 1000/30
      {
        createOrReplace: {
          _id: 'prod-eco-cut-1000-30',
          _type: 'product',
          name: {
            it: 'ECO-CUT 1000/30',
            en: 'ECO-CUT 1000/30',
            es: 'ECO-CUT 1000/30'
          },
          slug: { _type: 'slug', current: 'eco-cut-1000-30' },
          shortDescription: {
            it: "L'Evoluzione della Taglierina per Polistirolo. Riduci i Costi. Aumenta l'Efficienza. Lavora Sicuro.",
            en: 'The Evolution of Polystyrene Cutting. Reduce Costs. Increase Efficiency. Work Safe.',
            es: 'La Evolución de la Cortadora de Poliestireno. Reduce Costes. Aumenta la Eficiencia. Trabaja Seguro.'
          },
          fullDescription: {
            it: "ECO-CUT: dove la qualità incontra l'Innovazione. Dopo 15 anni di produzione e costante ascolto delle richieste degli artigiani, siamo orgogliosi di lanciare la quarta generazione della nostra taglierina professionale per polistirolo. Scegliere ECO-CUT significa dotarsi di una taglierina che traduce l'esperienza GL.OS Srl in un vantaggio diretto sul campo: meno scarti, più velocità e la garanzia di un risultato professionale ad ogni taglio. L'unica taglierina sul mercato che unisce qualità e prezzo in un design modulare.",
            en: "ECO-CUT: where quality meets Innovation. After 15 years of production and constant listening to artisan requests, we are proud to launch the fourth generation of our professional polystyrene cutter. Choosing ECO-CUT means equipping yourself with a cutter that translates GL.OS Srl's experience into a direct advantage in the field: less waste, more speed and the guarantee of a professional result with every cut. The only cutter on the market that combines quality and price in a modular design.",
            es: "ECO-CUT: donde la calidad encuentra la Innovación. Después de 15 años de producción y escucha constante de las solicitudes de los artesanos, estamos orgullosos de lanzar la cuarta generación de nuestra cortadora profesional de poliestireno. Elegir ECO-CUT significa equiparse con una cortadora que traduce la experiencia de GL.OS Srl en una ventaja directa en el campo: menos desperdicio, más velocidad y la garantía de un resultado profesional en cada corte. La única cortadora del mercado que combina calidad y precio en un diseño modular."
          },
          category: { _ref: 'cat-eco-cut', _type: 'reference' },
          specifications: [
            {
              _key: 'spec1',
              label: { it: 'Dimensione Max Pannello', en: 'Max Panel Size', es: 'Tamaño Máx. Panel' },
              value: { it: '1000×500 mm', en: '1000×500 mm', es: '1000×500 mm' }
            },
            {
              _key: 'spec2',
              label: { it: 'Profondità di Taglio', en: 'Cutting Depth', es: 'Profundidad de Corte' },
              value: { it: '300 mm', en: '300 mm', es: '300 mm' }
            },
            {
              _key: 'spec3',
              label: { it: 'Dimensioni Chiusa', en: 'Closed Dimensions', es: 'Dimensiones Cerrada' },
              value: { it: '1450×480×200 mm', en: '1450×480×200 mm', es: '1450×480×200 mm' }
            },
            {
              _key: 'spec4',
              label: { it: 'Peso', en: 'Weight', es: 'Peso' },
              value: { it: '13 Kg', en: '13 Kg', es: '13 Kg' }
            },
            {
              _key: 'spec5',
              label: { it: 'Voltaggio', en: 'Voltage', es: 'Voltaje' },
              value: { it: '24V', en: '24V', es: '24V' }
            },
            {
              _key: 'spec6',
              label: { it: 'Prezzo', en: 'Price', es: 'Precio' },
              value: { it: 'Da richiedere', en: 'On request', es: 'A consultar' }
            }
          ],
          features: [
            {
              _key: 'feat1',
              icon: 'ruler',
              title: { it: 'Tagli da 45° a 45°', en: '45° to 45° Cuts', es: 'Cortes de 45° a 45°' },
              description: { it: 'Tagli longitudinali di precisione per seguire ogni angolo', en: 'Precision longitudinal cuts to follow any angle', es: 'Cortes longitudinales de precisión para seguir cualquier ángulo' }
            },
            {
              _key: 'feat2',
              icon: 'layers',
              title: { it: 'Scanalature e Spessore', en: 'Grooves and Thickness', es: 'Ranuras y Espesor' },
              description: { it: 'Tagli trasversali di precisione per raccordi di tubi o riduzione dello spessore', en: 'Precision transversal cuts for pipe fittings or thickness reduction', es: 'Cortes transversales de precisión para accesorios de tubería o reducción de espesor' }
            },
            {
              _key: 'feat3',
              icon: 'move-diagonal',
              title: { it: 'Tagli Diagonali', en: 'Diagonal Cuts', es: 'Cortes Diagonales' },
              description: { it: 'Con un ampio arco di taglio, è in grado di eseguire vari tagli diagonali', en: 'With a wide cutting arc, it can perform various diagonal cuts', es: 'Con un amplio arco de corte, puede realizar varios cortes diagonales' }
            },
            {
              _key: 'feat4',
              icon: 'puzzle',
              title: { it: 'Design Modulare', en: 'Modular Design', es: 'Diseño Modular' },
              description: { it: "L'unica taglierina sul mercato che unisce qualità e prezzo in un design modulare", en: 'The only cutter on the market that combines quality and price in a modular design', es: 'La única cortadora del mercado que combina calidad y precio en un diseño modular' }
            }
          ],
          isActive: true,
          isNew: true,
          isFeatured: true,
          sortOrder: 0,
          badges: ['new', 'madeInItaly']
        }
      }
    ]

    const result = await mutateSanity(mutations)
    console.log('Risultato:', JSON.stringify(result, null, 2))
    console.log('\n✅ Prodotto ECO-CUT 1000/30 creato con successo!')
    console.log('\n📋 Dettagli:')
    console.log('   - Nome: ECO-CUT 1000/30')
    console.log('   - Slug: eco-cut-1000-30')
    console.log('   - Categoria: ECO-CUT')
    console.log('   - Badge: NOVITÀ, Made in Italy')
    console.log('   - Prezzo: Da richiedere')
    console.log('\n⚠️  NOTA: Carica l\'immagine del prodotto da Sanity Studio')

  } catch (error) {
    console.error('Errore:', error)
  }
}

createEcoCut()
