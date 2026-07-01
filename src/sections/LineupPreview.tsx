import { Link } from 'react-router-dom'
import { useState } from 'react'
import Reveal from '../components/Reveal'
import ArtistModal from '../components/ArtistModal'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import { previewArtists, type Artist } from '../constants/lineup'

export default function LineupPreview() {
  const [selectedArtist, setSelectedArtist] = useState<{ artist: Artist; stage: string; time: string } | null>(null)

  return (
    <section id="cartel" className="bg-arena-oscuro px-5 py-20 relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-violeta/15"
        style={{ clipPath: 'polygon(55% 0, 80% 0, 65% 100%, 35% 100%)' }} />
      <div className="absolute inset-0 bg-coral/12"
        style={{ clipPath: 'polygon(0 70%, 20% 40%, 45% 100%, 15% 100%)' }} />
      <div className="absolute inset-0 bg-violeta-claro/10"
        style={{ clipPath: 'polygon(85% 0, 100% 0, 95% 100%, 70% 100%)' }} />
      <div className="absolute inset-0 bg-coral-oscuro/12"
        style={{ clipPath: 'polygon(0 0, 12% 0, 8% 100%, 0 100%)' }} />

      <div className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(circle, #e85d6f 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

      <span className="absolute font-heading text-[clamp(10rem,35vw,30rem)] font-extrabold text-violeta/6 leading-none tracking-[-0.08em] select-none pointer-events-none top-[-2%] right-[-5%]">
        CARTEL
      </span>
      <span className="absolute font-heading text-[clamp(5rem,15vw,13rem)] font-extrabold text-coral/6 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[5%] left-[-3%] rotate-12">
        +48
      </span>

      <SolidBox className="w-16 h-16 bg-coral/70 left-[8%] top-[6%] z-30 rotate-15" />
      <SolidRing className="w-28 h-28 border-violeta/45 left-[48%] top-[5%] z-30" />
      <SolidDot className="w-10 h-10 bg-violeta/70 right-[14%] top-[22%] z-30" />
      <SolidLine className="w-48 h-0.75 bg-violeta-claro/40 left-[20%] top-[42%] z-30 rotate-2" />
      <SolidTri className="w-16 h-16 bg-coral/55 left-[55%] top-[10%] z-30 rotate-25" />
      <SolidBox className="w-12 h-12 bg-violeta/60 right-[8%] bottom-[32%] z-30 rotate-40" />
      <SolidRing className="w-24 h-24 border-coral/60 left-[3%] bottom-[22%] z-30" />
      <SolidDot className="w-7 h-7 bg-coral/80 left-[32%] bottom-[10%] z-30" />
      <SolidLine className="w-36 h-1 bg-violeta/35 right-[22%] top-[55%] z-30 -rotate-2" />
      <SolidDot className="w-6 h-6 bg-coral/80 right-[32%] bottom-[42%] z-30" />
      <SolidRing className="w-14 h-14 border-violeta/50 right-[6%] top-[65%] z-30" />
      <SolidBox className="w-8 h-8 bg-coral-oscuro/50 left-[40%] bottom-[4%] z-30 rotate-60" />

        <Reveal as="pop">
        <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="font-heading text-violeta text-[clamp(2rem,6vw,4.5rem)] font-extrabold leading-none tracking-[-0.08em] [text-shadow:4px_4px_0_#e85d6f]">
            AVANCE
          </h2>
          <span className="font-mono text-texto-suave text-[8px] tracking-[0.5em] uppercase block mt-1">Lo que viene</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-12">
          <div className="space-y-1">
            {previewArtists.map((item, i) => (
              <button key={i} onClick={() => setSelectedArtist(item)}
                   className={`w-full text-left flex items-center gap-4 p-4 border-l-4 border-t border-r border-b border-violeta/10 hover:border-violeta/30 hover:bg-violeta/2 transition-all cursor-pointer group ${i % 2 === 0 ? 'bg-white/60' : 'bg-transparent'}`}>
                <span className="font-heading text-violeta text-base sm:text-lg font-bold tracking-[-0.04em] min-w-18">{item.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-violeta text-sm sm:text-base font-bold tracking-[-0.02em] truncate group-hover:tracking-normal transition-all">{item.artist.name}</p>
                  <p className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase">{item.stage}</p>
                </div>
                <span className="font-heading text-coral text-[10px] min-w-6 text-right font-bold">{i + 1}</span>
              </button>
            ))}
          </div>

          <div className="bg-violeta p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden lg:mt-0 min-h-72">
            <SolidDot className="w-10 h-10 bg-coral/80 right-[6%] top-[6%] z-30" />
            <SolidLine className="w-32 h-0.75 bg-coral/40 left-[10%] top-[42%] z-30 rotate-3" />
            <SolidTri className="w-14 h-14 bg-white/20 right-[35%] top-[15%] z-30 rotate-40" />
            <SolidBox className="w-14 h-14 bg-white/20 left-[42%] bottom-[22%] z-30 rotate-20" />
            <SolidRing className="w-24 h-24 border-white/35 right-[8%] bottom-[28%] z-30" />
            <SolidDot className="w-5 h-5 bg-white/45 left-[12%] top-[12%] z-30" />
            <SolidBox className="w-6 h-6 bg-coral-oscuro/45 left-[60%] top-[5%] z-30 rotate-50" />
            <SolidRing className="w-12 h-12 border-white/25 left-[28%] bottom-[8%] z-30" />

            <div className="relative z-10">
              <p className="font-heading text-white text-6xl sm:text-8xl font-extrabold leading-[0.85] tracking-[-0.08em]">
                +48
              </p>
              <p className="font-mono text-white/60 text-[9px] tracking-[0.4em] uppercase mt-2">Artistas</p>
            </div>
            <div>
              <p className="font-mono text-white/60 text-[9px] tracking-[0.4em] uppercase">3 Escenarios</p>
              <div className="h-px bg-white/10 mt-4" />
              <Link to="/lineup"
                    className="border-l-4 border-t-2 border-r-2 border-b-2 border-white/30 pl-8 pr-5 pt-3 pb-3 mt-4 block hover:bg-white/10 transition-all group"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }}>
                <span className="font-mono text-white text-[10px] tracking-[0.4em] uppercase group-hover:tracking-[0.5em] transition-all">Ver cartel completo</span>
              </Link>
            </div>
          </div>
        </div>
        </div>
        </Reveal>

      <ArtistModal
        artist={selectedArtist?.artist ?? null}
        stage={selectedArtist?.stage}
        time={selectedArtist?.time}
        onClose={() => setSelectedArtist(null)}
      />
    </section>
  )
}
