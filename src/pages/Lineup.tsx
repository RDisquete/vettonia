import { useState, useEffect } from 'react'
import Reveal from '../components/Reveal'
import ArtistModal from '../components/ArtistModal'
import HamburgerNav from '../components/HamburgerNav'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import Footer from '../sections/Footer'
import SEO from '../components/SEO'
import { stageConfig, type Artist } from '../constants/lineup'
import { getPublishedStages } from '../services/lineup'
import type { Stage } from '../data/lineup'

function StageBlock({ stage, si, cfg, onSelect }: { stage: Stage; si: number; cfg: typeof stageConfig[0]; onSelect: (a: Artist) => void }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-8">
        <span className={`font-mono text-5xl sm:text-7xl font-extrabold tabular-nums leading-none ${si === 0 ? 'text-coral' : si === 1 ? 'text-violeta' : 'text-coral'}`}
              style={{ transform: `rotate(${si === 0 ? '-3deg' : si === 1 ? '2deg' : '-1.5deg'})` }}>
          {cfg.watermark}
        </span>
        <div className="flex-1">
          <h2 className="font-heading text-violeta text-2xl sm:text-4xl font-extrabold tracking-[-0.06em] leading-tight">
            {stage.name}
          </h2>
          <span className="font-mono text-black/40 text-[8px] tracking-[0.3em] uppercase">
            {stage.artists.length} artistas
          </span>
        </div>
        <div className={`hidden sm:block w-20 h-0.5 ${si === 0 ? 'bg-coral/40' : si === 1 ? 'bg-violeta/40' : 'bg-coral/40'} rotate-6`} />
      </div>

      <div className={`absolute -top-4 right-0 w-32 sm:w-48 h-px ${si === 0 ? 'bg-coral/20' : si === 1 ? 'bg-violeta/20' : 'bg-coral/20'} rotate-12`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {stage.artists.map((a, i) => (
          <button
            key={a.slug}
            onClick={() => onSelect(a)}
            className={`group relative flex items-center border-2 ${cfg.border} bg-white/30 hover:bg-violeta transition-all overflow-hidden text-left w-full cursor-pointer`}
            style={{
              borderLeftWidth: '4px',
              transform: `rotate(${i % 3 === 0 ? '0.5deg' : i % 3 === 1 ? '-0.8deg' : '0.3deg'})`,
              clipPath: i % 4 === 0
                ? 'polygon(0 0, 100% 0, 96% 100%, 0 100%)'
                : i % 4 === 1
                ? 'polygon(4% 0, 100% 0, 100% 100%, 0 96%)'
                : i % 4 === 2
                ? 'polygon(0 4%, 100% 0, 96% 100%, 0 100%)'
                : 'polygon(4% 0, 100% 4%, 100% 100%, 0 96%)',
            }}
          >
            <div className="flex items-center justify-center w-14 sm:w-20 shrink-0 self-stretch border-r-2 border-violeta/10">
              <span className={`font-mono text-lg sm:text-2xl font-extrabold tabular-nums leading-none -rotate-3 ${si === 0 ? 'text-coral' : si === 1 ? 'text-violeta' : 'text-coral'}`}>
                {a.time}
              </span>
            </div>

            <div className="w-14 h-14 sm:w-18 sm:h-18 shrink-0 overflow-hidden my-2"
                 style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}>
              <img
                src={a.image}
                alt={a.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            <div className="flex-1 min-w-0 py-3 pr-3">
              <span className="font-heading text-violeta text-sm sm:text-base font-bold tracking-[-0.02em] group-hover:text-white transition-colors truncate block">
                {a.name}
              </span>
              <span className="font-mono text-black/40 text-[7px] tracking-[0.3em] uppercase group-hover:text-white/60 transition-colors">
                {a.genre}
              </span>
            </div>

            <span className="font-mono text-black/20 text-lg sm:text-2xl font-extrabold pr-3 sm:pr-4 group-hover:text-white/30 transition-colors hidden sm:block"
                  style={{ transform: 'rotate(2deg)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Lineup() {
  const [mobileStage, setMobileStage] = useState(0)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [stages, setStages] = useState<Stage[]>([])

  useEffect(() => {
    getPublishedStages().then(setStages)
  }, [])

  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO
        title="Cartel"
        description="Descubre el cartel completo de Vettonia 2026. 48 artistas en 3 escenarios. Horarios y artistas del festival."
        path="/lineup"
      />
      <HamburgerNav />
      <div className="flex-1">
        <section className="px-5 pt-20 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-violeta/2 via-transparent to-coral/2" />

          <div className="absolute inset-0 bg-violeta/8"
            style={{ clipPath: 'polygon(25% 0, 45% 0, 35% 100%, 15% 100%)' }} />
          <div className="absolute inset-0 bg-coral/6"
            style={{ clipPath: 'polygon(70% 0, 95% 0, 85% 100%, 60% 100%)' }} />
          <div className="absolute inset-0 bg-violeta/4"
            style={{ clipPath: 'polygon(0 60%, 10% 45%, 20% 80%, 5% 100%)' }} />

          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #3a1a4a 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }} />

          <span className="absolute font-heading text-[clamp(10rem,35vw,30rem)] font-extrabold text-violeta/5 leading-none tracking-[-0.08em] select-none pointer-events-none top-[-2%] right-[-5%]">
            CARTEL
          </span>
          <span className="absolute font-heading text-[clamp(6rem,20vw,18rem)] font-extrabold text-coral/3 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[5%] left-[-3%] rotate-12">
            2026
          </span>

          <SolidBox className="w-20 h-20 bg-coral/35 left-[5%] top-[4%] z-30 rotate-15" />
          <SolidRing className="w-40 h-40 border-violeta/20 right-[-6%] top-[2%] z-30" />
          <SolidDot className="w-12 h-12 bg-violeta/35 left-[32%] top-[18%] z-30" />
          <SolidLine className="w-64 h-0.75 bg-coral/25 right-[8%] top-[48%] z-30 -rotate-3" />
          <SolidTri className="w-22 h-22 bg-coral/25 left-[60%] top-[8%] z-30 rotate-30" />
          <SolidDot className="w-8 h-8 bg-coral/40 right-[18%] top-[30%] z-30" />
          <SolidRing className="w-28 h-28 border-coral/20 left-[3%] top-[55%] z-30" />
          <SolidBox className="w-14 h-14 bg-coral/30 right-[25%] bottom-[22%] z-30 rotate-40" />
          <SolidLine className="w-44 h-0.75 bg-violeta/20 left-[35%] top-[72%] z-30 rotate-2" />
          <SolidDot className="w-6 h-6 bg-violeta/40 left-[8%] bottom-[15%] z-30" />
          <SolidRing className="w-16 h-16 border-violeta/20 right-[5%] bottom-[10%] z-30" />
          <SolidBox className="w-10 h-10 bg-violeta/35 left-[25%] bottom-[5%] z-30 rotate-60" />

          <Reveal as="pop" className="relative z-10 max-w-6xl mx-auto">
            <h1 className="font-heading text-violeta text-[clamp(3rem,8vw,6rem)] font-extrabold leading-none tracking-[-0.08em] [text-shadow:5px_5px_0_#e85d6f]">
              CARTEL
            </h1>
            <span className="font-mono text-texto-suave text-[9px] tracking-[0.5em] uppercase block mt-1">48 artistas · 3 escenarios</span>

            {/* mobile stage selector */}
            <div className="flex sm:hidden gap-2 mt-6 mb-8">
              {stageConfig.map((cfg, si) => (
                <button
                  key={cfg.watermark}
                  onClick={() => setMobileStage(si)}
                  className={`flex-1 font-heading text-lg font-extrabold tracking-[-0.04em] py-3 border-2 transition-all cursor-pointer ${
                    mobileStage === si ? cfg.bgActive : cfg.bgInactive
                  }`}
                  style={{
                    clipPath: si === 0
                      ? 'polygon(0 0, 100% 0, 92% 100%, 0 100%)'
                      : si === 2
                      ? 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)'
                      : 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)',
                  }}
                >
                  {cfg.watermark}
                </button>
              ))}
            </div>

            {/* mobile: solo el escenario seleccionado */}
            <div className="sm:hidden mt-10">
              {stages.map((stage, si) => {
                const cfg = stageConfig[si]
                if (si !== mobileStage) return null
                return (
                  <Reveal as="pop" key={`m-${mobileStage}`}>
                    <StageBlock stage={stage} si={si} cfg={cfg} onSelect={setSelectedArtist} />
                  </Reveal>
                )
              })}
            </div>

            {/* desktop: todos los escenarios */}
            <div className="hidden sm:block mt-10 space-y-20">
              {stages.map((stage, si) => {
                const cfg = stageConfig[si]
                const anim = si === 0 ? 'rise' : si === 1 ? 'creep' : 'pop'
                return (
                  <Reveal as={anim} delay={si * 100} key={stage.name}>
                    <StageBlock stage={stage} si={si} cfg={cfg} onSelect={setSelectedArtist} />
                  </Reveal>
                )
              })}
            </div>
          </Reveal>
        </section>
      </div>
      <Footer />

      <ArtistModal artist={selectedArtist} onClose={() => setSelectedArtist(null)} />
    </div>
  )
}
