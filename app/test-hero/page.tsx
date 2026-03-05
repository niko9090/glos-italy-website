// Pagina temporanea per testare le varianti Hero
// URL: http://localhost:3000/test-hero
// ELIMINA QUESTA PAGINA DOPO AVER SCELTO

import ProductsHeroVariant1 from '@/components/products/ProductsHeroVariant1'
import ProductsHeroVariant2 from '@/components/products/ProductsHeroVariant2'
import ProductsHeroVariant3 from '@/components/products/ProductsHeroVariant3'

export default function TestHeroPage() {
  return (
    <div className="min-h-screen">
      {/* Variante 1 */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg font-bold">
          VARIANTE 1 - Due immagini fuse (stile homepage)
        </div>
        <ProductsHeroVariant1 />
      </div>

      {/* Separatore */}
      <div className="h-4 bg-red-500" />

      {/* Variante 2 */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg font-bold">
          VARIANTE 2 - Pattern geometrico + mesh gradient
        </div>
        <ProductsHeroVariant2 />
      </div>

      {/* Separatore */}
      <div className="h-4 bg-red-500" />

      {/* Variante 3 */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg font-bold">
          VARIANTE 3 - Split diagonale + particelle metalliche
        </div>
        <ProductsHeroVariant3 />
      </div>

      {/* Istruzioni */}
      <div className="bg-gray-900 text-white p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Quale preferisci?</h2>
        <p className="text-gray-300">
          Dimmi il numero (1, 2 o 3) e la applico alla pagina prodotti.
        </p>
      </div>
    </div>
  )
}
