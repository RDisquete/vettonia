import { useState, useEffect, useRef, useMemo } from 'react'
import ArtistModal from '../components/ArtistModal'
import HamburgerNav from '../components/HamburgerNav'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import Footer from '../sections/Footer'
import SEO from '../components/SEO'
import { allArtists, allGenres, type Artist } from '../data/lineup'

const genreColors: Record<string, string> = {
  'Electrónica': 'bg-violeta text-white border-violeta',
  'Indie Pop': 'bg-arena text-black border-piedra',
  'Flamenco & Fusión': 'bg-coral text-white border-coral',
  'Rock': 'bg-violeta text-white border-violeta',
  'Punk & Garage': 'bg-coral text-white border-coral',
  'Folk & Cantautor': 'bg-violeta/80 text-white border-violeta',
  'Shoegaze & Dream': 'bg-violeta text-white border-violeta',
  'World & Fusión': 'bg-coral/80 text-white border-coral',
  'Hip Hop & Rap': 'bg-violeta text-white border-carbón',
  'Metal & Stoner': 'bg-violeta text-white border-violeta',
}

const rotateSet = ['1deg', '-2deg', '1.5deg', '-1deg', '2.5deg', '-1.5deg', '0.5deg', '-0.5deg', '2deg', '-2.5deg', '1deg', '-1.5deg', '2deg', '-1deg', '0.8deg', '-1.8deg', '3deg', '-0.8deg', '1.2deg', '-2.2deg', '0.3deg', '-1.2deg', '2.8deg', '-0.3deg']
const offsetSet = ['mt-0', '-mt-4 sm:-mt-8', 'mt-2', '-mt-2 sm:-mt-4', 'mt-4 sm:mt-6', '-mt-1', 'mt-3 sm:mt-5', '-mt-3 sm:-mt-6', 'mt-1', 'mt-0', '-mt-2', 'mt-4 sm:mt-8', '-mt-1', 'mt-2 sm:mt-4', 'mt-5 sm:mt-7', '-mt-5 sm:-mt-7', 'mt-0', 'mt-3', '-mt-3', 'mt-4 sm:mt-5', '-mt-1 sm:-mt-2', 'mt-2', 'mt-6 sm:mt-9', '-mt-2 sm:-mt-5']
const aspectSet = ['3/4', '2/3', '3/5', '4/5', '3/4', '2/3', '3/4', '4/5', '3/4', '2/3', '3/5', '3/4', '4/5', '2/3', '3/4', '3/5', '3/4', '2/3', '3/4', '4/5', '3/4', '3/5', '2/3', '3/4']

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]
}

export default function Artists() {
  const [genre, setGenre] = useState<string>('')
  const [genreOpen, setGenreOpen] = useState(false)
  const [selected, setSelected] = useState<Artist | null>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () => (genre ? allArtists.filter((a) => a.genre === genre) : allArtists),
    [genre]
  )

  // close genre dropdown on outside click
  useEffect(() => {
    if (!genreOpen) return
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setGenreOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [genreOpen])

  // find global index for consistent styling
  function globalIndex(a: Artist): number {
    return allArtists.findIndex((x) => x.slug === a.slug)
  }

  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO
        title="Artistas"
        description="Conoce a los +48 artistas que actuarán en Vettonia 2026. Electrónica, indie, flamenco, rock y mucho más."
        path="/artists"
      />
      <HamburgerNav />
      <div className="flex-1">
        <section className="px-5 pt-20 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-coral/2 via-transparent to-violeta/2" />

          <div className="absolute inset-0 bg-violeta/8"
            style={{ clipPath: 'polygon(35% 0, 55% 0, 50% 100%, 30% 100%)' }} />
          <div className="absolute inset-0 bg-coral/6"
            style={{ clipPath: 'polygon(70% 0, 90% 0, 80% 100%, 60% 100%)' }} />
          <div className="absolute inset-0 bg-violeta/4"
            style={{ clipPath: 'polygon(0 50%, 15% 35%, 25% 75%, 0 90%)' }} />

          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #3a1a4a 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }} />

          <span className="absolute font-heading text-[clamp(10rem,35vw,30rem)] font-extrabold text-violeta/5 leading-none tracking-[-0.08em] select-none pointer-events-none top-[-2%] left-[-5%]">
            ARTISTAS
          </span>
          <span className="absolute font-heading text-[clamp(6rem,20vw,18rem)] font-extrabold text-coral/3 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[8%] right-[-5%] -rotate-12">
            +48
          </span>

          <SolidBox className="w-20 h-20 bg-coral/40 left-[4%] top-[5%] z-30 rotate-12" />
          <SolidRing className="w-40 h-40 border-violeta/20 right-[-8%] top-[2%] z-30" />
          <SolidDot className="w-12 h-12 bg-violeta/35 right-[12%] top-[28%] z-30" />
          <SolidLine className="w-64 h-0.75 bg-coral/30 left-[6%] top-[48%] z-30 rotate-2" />
          <SolidTri className="w-24 h-24 bg-coral/30 left-[62%] top-[10%] z-30 rotate-45" />
          <SolidBox className="w-14 h-14 bg-violeta/35 left-[40%] bottom-[22%] z-30 rotate-[-20deg]" />
          <SolidRing className="w-24 h-24 border-coral/20 left-[2%] bottom-[30%] z-30" />
          <SolidLine className="w-44 h-0.75 bg-coral/25 right-[5%] top-[55%] z-30 rotate-3" />
          <SolidDot className="w-8 h-8 bg-coral/40 left-[22%] bottom-[8%] z-30" />
          <SolidBox className="w-16 h-16 bg-coral/30 right-[12%] bottom-[8%] z-30 rotate-35" />
          <SolidRing className="w-16 h-16 border-violeta/20 right-[6%] top-[45%] z-30" />
          <SolidLine className="w-28 h-0.5 bg-violeta/20 left-[45%] top-[75%] z-30 rotate-[-4deg]" />

            <h1 className="font-heading text-violeta text-[clamp(3rem,8vw,6rem)] font-extrabold leading-none tracking-[-0.08em] [text-shadow:5px_5px_0_#e85d6f]">
              ARTISTAS
            </h1>
            <span className="font-mono text-texto-suave text-[9px] tracking-[0.5em] uppercase block mt-1">+48 actuaciones</span>

            {/* genre filter dropdown */}
            <div ref={filterRef} className="mt-6 relative">
              <button
                onClick={() => setGenreOpen(!genreOpen)}
                className="w-full flex items-center justify-between border-l-4 border-t-2 border-r-2 border-b-2 border-violeta pl-5 pr-4 pt-3 pb-3 cursor-pointer hover:bg-violeta transition-all group"
                style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 0 100%)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-black/70 text-[9px] tracking-[0.4em] uppercase group-hover:text-white transition-colors">Filtrar</span>
                  <span className={`font-heading text-sm font-bold tracking-[-0.02em] ${genre ? 'text-violeta group-hover:text-white' : 'text-texto group-hover:text-white/70'}`}>
                    {genre || 'Todas las categorías'}
                  </span>
                </div>
                <span className={`text-texto text-sm transition-all duration-200 ${genreOpen ? 'rotate-180' : ''} group-hover:text-white`}>▾</span>
              </button>

              {genreOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border-2 border-violeta/30 max-h-72 overflow-y-auto z-40 shadow-lg"
                     style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0 100%)' }}>
                  <button
                    onClick={() => { setGenre(''); setGenreOpen(false) }}
                    className={`w-full text-left px-5 py-3.5 border-b border-violeta/10 transition-colors cursor-pointer ${
                      !genre ? 'bg-violeta text-white' : 'hover:bg-violeta/10'
                    }`}
                  >
                    <span className={`font-heading text-sm font-bold tracking-[-0.02em] ${!genre ? 'text-white' : 'text-violeta'}`}>
                      Todas las categorías
                    </span>
                  </button>
                  {allGenres.map((g) => (
                    <button
                      key={g}
                      onClick={() => { setGenre(g); setGenreOpen(false) }}
                      className={`w-full text-left px-5 py-3.5 border-b border-violeta/5 transition-colors cursor-pointer ${
                        genre === g ? 'bg-violeta' : 'hover:bg-violeta/10'
                      }`}
                    >
                      <span className={`inline-block font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1 font-bold ${genreColors[g] || 'bg-violeta text-white'}`}>
                        {g}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {filtered.length === 0 && (
              <p className="font-ui text-texto-suave text-sm mt-10">No hay artistas para este género.</p>
            )}

            <div className="mt-6 grid grid-cols-2 lg:grid-cols-2 gap-1 sm:gap-1.5 max-w-5xl mx-auto">
              {filtered.map((a) => {
                const gi = globalIndex(a)
                return (
                  <button
                    key={a.slug}
                    onClick={() => setSelected(a)}
                    className={`${pick(offsetSet, gi)} overflow-hidden border border-violeta/15 hover:border-coral/40 hover:bg-violeta transition-all group text-left cursor-pointer`}
                    style={{ transform: `rotate(${pick(rotateSet, gi)})`, aspectRatio: pick(aspectSet, gi) }}
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={a.image}
                        alt={a.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                          <div className="absolute inset-0 bg-linear-to-t from-violeta/85 via-violeta/20 to-transparent flex flex-col justify-end p-1.5 sm:p-2">
                            <p className="font-heading text-white text-sm sm:text-lg font-bold tracking-[-0.02em] leading-tight drop-shadow-md">{a.name}</p>
                            <span className="font-mono text-white/70 text-[7px] sm:text-[9px] tracking-[0.15em] uppercase mt-1">{a.genre}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
        </section>
      </div>
      <Footer />

      <ArtistModal artist={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
