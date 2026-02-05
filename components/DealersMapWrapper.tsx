'use client'

import dynamic from 'next/dynamic'

const DealersMap = dynamic(() => import('@/components/DealersMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-gray-500">Caricamento mappa...</p>
      </div>
    </div>
  ),
})

export default DealersMap
