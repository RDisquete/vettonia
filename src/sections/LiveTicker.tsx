import { SolidDot, SolidBox, SolidLine } from '../components/Solids'

const items = [
  'Escenario A — SÔR',
  'Escenario B — RUIDO RUIDO',
  'Escenario C — DJ MALA LECHE',
  'Escenario A — CACHO CASTAÑA',
  'Escenario B — FLOR DE UN DÍA',
  'Escenario C — SEDA',
  'Escenario A — LAURA AIRE',
  'Escenario B — LA CHICA SINCERA',
  'Escenario C — VERDE MALVA',
]

export default function LiveTicker() {
  return (
    <a
      href="https://youtube.com"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-violeta overflow-hidden relative flex group"
    >
      <div className="absolute inset-0 bg-coral/8"
        style={{ clipPath: 'polygon(70% 0, 100% 0, 85% 100%, 55% 100%)' }} />

      <SolidDot className="w-4 h-4 bg-coral/75 left-[25%] top-1/2 -translate-y-1/2 z-30" />
      <SolidBox className="w-6 h-6 bg-white/10 right-[12%] top-[12%] z-30" />
      <SolidDot className="w-3 h-3 bg-white/20 right-[8%] bottom-[20%] z-30" />
      <SolidLine className="w-24 h-0.75 bg-coral/45 left-[40%] bottom-0 z-30" />

        <div className="bg-coral px-5 py-3 shrink-0 flex items-center gap-2 group-hover:bg-coral-oscuro transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="font-mono text-white text-[10px] tracking-[0.3em] uppercase whitespace-nowrap">En vivo</span>
        </div>
        <div className="overflow-hidden flex-1 flex items-center px-4">
          <div className="flex gap-16 animate-marquee">
            {[...items, ...items].map((item, i) => (
              <span key={i} className="font-mono text-white/70 text-[10px] tracking-[0.2em] uppercase whitespace-nowrap shrink-0">
                {item}
              </span>
            ))}
          </div>
        </div>
    </a>
  )
}
