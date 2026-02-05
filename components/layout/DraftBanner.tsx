// Banner visibile quando il sito è in modalità bozza (draft mode)
'use client'

import { useRouter } from 'next/navigation'

export default function DraftBanner() {
  const router = useRouter()

  const handleDisable = async () => {
    await fetch('/api/draft-mode/disable')
    router.refresh()
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-black text-center py-2 px-4 text-sm font-semibold shadow-lg">
      <span className="inline-flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse" />
        MODALITA BOZZA ATTIVA — Stai visualizzando contenuti non pubblicati
        <button
          onClick={handleDisable}
          className="ml-3 px-3 py-0.5 bg-black text-white rounded text-xs hover:bg-gray-800 transition-colors"
        >
          Esci
        </button>
      </span>
    </div>
  )
}
