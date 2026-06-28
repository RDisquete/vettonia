import { SolidBox, SolidDot, SolidRing } from '../../../components/Solids'
import type { Tab } from '../hooks'

interface Props {
  tab: Tab
  onTabChange: (t: Tab) => void
  onLogout: () => void
}

const tabs: { key: Tab; label: string }[] = [
  { key: 'pase', label: 'Mi Pase' },
  { key: 'muro', label: 'Muro' },
  { key: 'contenido', label: 'Contenido' },
  { key: 'logros', label: 'Logros' },
  { key: 'stats', label: 'Stats' },
]

export default function PassHeader({ tab, onTabChange, onLogout }: Props) {
  return (
    <section className="relative overflow-hidden px-5 pt-20 pb-0">
      <div className="absolute inset-0 bg-coral/4"
        style={{ clipPath: 'polygon(0 0, 30% 0, 50% 100%, 0 100%)' }} />
      <div className="absolute inset-0 bg-violeta/5"
        style={{ clipPath: 'polygon(70% 0, 100% 0, 100% 100%, 50% 100%)' }} />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #e85d6f 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

      <span className="absolute font-heading text-[clamp(10rem,35vw,30rem)] font-extrabold text-violeta/3 leading-none tracking-[-0.08em] select-none pointer-events-none top-[-4%] left-[-3%]">
        PASE
      </span>

      <SolidDot className="w-8 h-8 bg-coral/40 right-[6%] top-[8%] z-30" />
      <SolidBox className="w-12 h-12 bg-violeta/25 left-[8%] top-[12%] z-30 rotate-20" />
      <SolidRing className="w-24 h-24 border-coral/20 right-[3%] top-[20%] z-30" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <span className="font-mono text-texto-suave text-[9px] tracking-[0.5em] uppercase block">Tu pase</span>
            <h1 className="font-heading text-violeta text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[0.85] tracking-[-0.06em] mt-2">
              BIENVENIDO
            </h1>
          </div>
          <button onClick={onLogout}
            className="font-mono text-black/40 text-[7px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-coral transition-colors cursor-pointer shrink-0">
            Cerrar sesión
          </button>
        </div>

        <div role="tablist" aria-label="Secciones del pase" className="flex gap-1.5 mt-6 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button key={t.key} role="tab" id={`tab-${t.key}`} aria-selected={tab === t.key}
              aria-controls={`tabpanel-${t.key}`} onClick={() => onTabChange(t.key)}
              className={`font-heading text-sm font-bold tracking-[-0.02em] px-5 py-2.5 border-2 transition-all cursor-pointer ${
                tab === t.key
                  ? 'bg-violeta text-white border-violeta'
                  : 'bg-transparent text-violeta border-violeta/20 hover:border-violeta/50'
              }`}
              style={{ clipPath: t.key === 'muro' || t.key === 'stats' ? 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' : 'polygon(0 0, 95% 0, 100% 100%, 0 100%)' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
