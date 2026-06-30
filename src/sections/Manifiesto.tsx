import { useEffect, useState } from 'react'
import Reveal from '../components/Reveal'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import { getPageContent } from '../services/content'

export default function Manifiesto() {
  const [c, setC] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    getPageContent('manifiesto').then(setC)
  }, [])

  const line1 = c?.line1 ?? 'ESTO NO ES'
  const line2 = c?.line2 ?? 'UN FESTIVAL.'
  const line3 = c?.line3 ?? 'ES UN PLAN.'
  const line4 = c?.line4 ?? 'EXTREMADURA 2027'
  const subtext = c?.subtext ?? 'Tres días sin cobertura, 3 escenarios, +48 artistas y una sola misión: vivir el momento. Tú eres el protagonista.'
  const stat1 = c?.stat1 ?? '3'
  const stat1Label = c?.stat1Label ?? 'Escenarios'
  const stat2 = c?.stat2 ?? '+48'
  const stat2Label = c?.stat2Label ?? 'Artistas'

  return (
    <section id="manifiesto" className="relative overflow-hidden min-h-[80vh] flex items-center scroll-mt-24">
      <img
        src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-violeta/85 via-violeta/60 to-arena/40" />

      <div className="absolute inset-0 bg-coral/12"
        style={{ clipPath: 'polygon(65% 0, 100% 0, 80% 100%, 45% 100%)' }} />
      <div className="absolute inset-0 bg-violeta/10"
        style={{ clipPath: 'polygon(0 30%, 25% 0, 45% 100%, 20% 100%)' }} />
      <div className="absolute inset-0 bg-coral-oscuro/15"
        style={{ clipPath: 'polygon(30% 60%, 55% 40%, 70% 80%, 40% 100%)' }} />
      <div className="absolute inset-0 bg-violeta-claro/12"
        style={{ clipPath: 'polygon(80% 20%, 100% 30%, 90% 60%, 70% 50%)' }} />

      <div className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: 'radial-gradient(circle, #e85d6f 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

      <span className="absolute font-heading text-[clamp(10rem,40vw,35rem)] font-bold text-white/8 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[-5%] right-[-5%]">
        2027
      </span>
      <span className="absolute font-heading text-[clamp(6rem,20vw,18rem)] font-bold text-coral/8 leading-none tracking-[-0.08em] select-none pointer-events-none top-[8%] left-[-2%] -rotate-6">
        +48
      </span>

      <SolidBox className="w-20 h-20 bg-white/25 left-[18%] top-[8%] z-40 rotate-25" />
      <SolidRing className="w-44 h-44 border-white/35 right-[-10%] top-[-8%] z-40" />
      <SolidDot className="w-10 h-10 bg-coral/80 left-[4%] top-[42%] z-40" />
      <SolidLine className="w-48 h-1 bg-white/35 right-[12%] top-[50%] z-40 rotate-1" />
      <SolidTri className="w-20 h-20 bg-white/20 left-[55%] top-[12%] z-40 rotate-35" />
      <SolidBox className="w-12 h-12 bg-white/25 right-[22%] bottom-[18%] z-40 rotate[-40deg]" />
      <SolidRing className="w-28 h-28 border-coral/70 left-[38%] bottom-[3%] z-40" />
      <SolidDot className="w-5 h-5 bg-white/80 left-[30%] top-[26%] z-40" />
      <SolidLine className="w-60 h-1 bg-white/20 left-[6%] top-[35%] z-30" />
      <SolidDot className="w-7 h-7 bg-white/55 right-[12%] bottom-[28%] z-30" />
      <SolidBox className="w-8 h-8 bg-coral-oscuro/45 left-[12%] bottom-[6%] z-30 rotate-15" />
      <SolidRing className="w-16 h-16 border-white/25 right-[35%] top-[62%] z-30" />

      <div className="absolute inset-y-[15%] left-[8%] w-px bg-white/30 z-10" />
      <div className="absolute inset-y-[15%] left-[calc(8%+8px)] w-px bg-white/15 z-10" />

      <div className="absolute top-[12%] left-[5%] z-20">
        <p className="font-heading text-white text-6xl sm:text-8xl font-bold leading-none drop-shadow-lg">{stat1}</p>
        <p className="font-mono text-white/60 text-[9px] tracking-[0.4em] uppercase mt-1 drop-shadow">{stat1Label}</p>
      </div>
      <div className="absolute bottom-[12%] right-[5%] z-20">
        <p className="font-heading text-white text-6xl sm:text-8xl font-bold leading-none text-right drop-shadow-lg">{stat2}</p>
        <p className="font-mono text-white/60 text-[9px] tracking-[0.4em] uppercase mt-1 drop-shadow text-right">{stat2Label}</p>
      </div>

      <div className="relative z-10 w-full px-5 py-20">
        <Reveal as="pop">
        <div className="max-w-6xl mx-auto">
          <p className="font-heading text-white text-[clamp(2.8rem,9vw,8rem)] font-extrabold leading-[0.78] tracking-[-0.08em] drop-shadow-lg">
            {line1}
          </p>
          <p className="font-heading text-coral text-[clamp(2.2rem,7.5vw,6.5rem)] font-extrabold leading-[0.78] tracking-[-0.08em] ml-[15%] sm:ml-[30%] drop-shadow-lg">
            {line2}
          </p>
          <p className="font-heading text-white text-[clamp(2.8rem,9vw,8rem)] font-extrabold leading-[0.78] tracking-[-0.08em] mt-3 drop-shadow-lg">
            {line3}
          </p>
          <p className="font-heading text-white/70 text-[clamp(1.4rem,4.5vw,3.5rem)] font-bold leading-[0.85] tracking-[-0.04em] ml-[25%] sm:ml-[45%] mt-1 max-w-3xl drop-shadow">
            {line4}
          </p>
          <div className="mt-10 ml-[10%] sm:ml-[25%] max-w-md border-l-4 border-coral/50 pl-5 sm:pl-6">
            <p className="font-ui text-white/80 text-sm sm:text-base leading-relaxed drop-shadow">
              {subtext}
            </p>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  )
}
