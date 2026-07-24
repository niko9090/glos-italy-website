// Filigrana "GLOS" di sfondo: blu GLOS, molto leggera, in lieve movimento.
// Due scritte in angoli OPPOSTI: in alto a destra e in basso a sinistra.
// Colore e opacita' via stile inline (le classi Tailwind con /opacity su colori
// custom in Tailwind v4 possono non applicare l'alpha e lasciare il nero).
// Va dentro un contenitore `relative overflow-hidden`; sta dietro al contenuto (z-0).
// Rispetta prefers-reduced-motion.
const GLOS_BLUE = '#0047AB'

export default function GlosWatermark() {
  return (
    <>
      <style>{`
        @keyframes glosDriftA { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(-2%, 3%, 0); } }
        @keyframes glosDriftB { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(2%, -3%, 0); } }
        .glos-wm-a { animation: glosDriftA 18s ease-in-out infinite; }
        .glos-wm-b { animation: glosDriftB 22s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .glos-wm-a, .glos-wm-b { animation: none; } }
      `}</style>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        {/* In alto a destra */}
        <div
          className="glos-wm-a absolute -top-[8vw] -right-[4vw] text-[26vw] leading-none font-black tracking-tighter"
          style={{ color: GLOS_BLUE, opacity: 0.06 }}
        >
          GLOS
        </div>
        {/* In basso a sinistra */}
        <div
          className="glos-wm-b absolute -bottom-[7vw] -left-[5vw] text-[26vw] leading-none font-black tracking-tighter"
          style={{ color: GLOS_BLUE, opacity: 0.05 }}
        >
          GLOS
        </div>
      </div>
    </>
  )
}
