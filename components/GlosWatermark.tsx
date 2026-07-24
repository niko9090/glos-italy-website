// Filigrana "GLOS" di sfondo, tenue e in lieve movimento. Va messa dentro un
// contenitore `relative overflow-hidden`; sta dietro al contenuto (z-0).
// Rispetta prefers-reduced-motion (niente animazione se l'utente la disattiva).
export default function GlosWatermark() {
  return (
    <>
      <style>{`
        @keyframes glosDriftA { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(1.5%, -2.5%, 0); } }
        @keyframes glosDriftB { 0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(-2%, 2%, 0); } }
        .glos-wm-a { animation: glosDriftA 26s ease-in-out infinite; }
        .glos-wm-b { animation: glosDriftB 34s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .glos-wm-a, .glos-wm-b { animation: none; } }
      `}</style>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        <div className="glos-wm-a absolute -bottom-[8vw] -right-[4vw] text-[26vw] leading-none font-black tracking-tighter text-primary/[0.05]">
          GLOS
        </div>
        <div className="glos-wm-b absolute -top-[6vw] -left-[5vw] text-[16vw] leading-none font-black tracking-tighter text-primary/[0.035]">
          GLOS
        </div>
      </div>
    </>
  )
}
