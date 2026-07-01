import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import ArtistModal from '../components/ArtistModal'
import FavoriteButton from '../components/FavoriteButton'
import HamburgerNav from '../components/HamburgerNav'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import Footer from '../sections/Footer'
import SEO from '../components/SEO'
import { genreColors, rotateSet, offsetSet, aspectSet, pick, allArtists, allGenres, type Artist } from '../constants/lineup'
import { getFavorites, toggleFavorite } from '../services/favorites'

export default function Artists() {
  const [genre, setGenre] = useState<string>('')
  const [genreOpen, setGenreOpen] = useState(false)
  const [selected, setSelected] = useState<Artist | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const filterRef = useRef<HTMLDivElement>(null)

  const loadFavorites = useCallback(async () => {
    setFavorites(await getFavorites())
  }, [])

  useEffect(() => { loadFavorites() }, [loadFavorites])

  const handleToggleFav = useCallback(async (slug: string) => {
    await toggleFavorite(slug)
    await loadFavorites()
  }, [loadFavorites])

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
        description="Conoce a los +48 artistas que actuarán en Vettonia 2027. Electrónica, indie, flamenco, rock y mucho más."
        path="/artists"
      />
      <HamburgerNav />
      <div className="flex-1">
        <section className="px-5 pt-20 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-coral/2 via-transparent to-violeta/2" />

          <div className="absolute inset-0 bg-violeta/15"
            style={{ clipPath: 'polygon(35% 0, 55% 0, 50% 100%, 30% 100%)' }} />
          <div className="absolute inset-0 bg-coral/15"
            style={{ clipPath: 'polygon(70% 0, 90% 0, 80% 100%, 60% 100%)' }} />
          <div className="absolute inset-0 bg-violeta/12"
            style={{ clipPath: 'polygon(0 50%, 15% 35%, 25% 75%, 0 90%)' }} />

          <div className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(circle, #3a1a4a 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }} />

          <span className="absolute font-heading text-[clamp(10rem,35vw,30rem)] font-extrabold text-violeta/10 leading-none tracking-[-0.08em] select-none pointer-events-none top-[-2%] left-[-5%]">
            ARTISTAS
          </span>
          <span className="absolute font-heading text-[clamp(6rem,20vw,18rem)] font-extrabold text-coral/6 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[8%] right-[-5%] -rotate-12">
            +48
          </span>

          <SolidBox className="w-20 h-20 bg-coral/60 left-[4%] top-[5%] z-30 rotate-12" />
          <SolidRing className="w-40 h-40 border-violeta/40 right-[-8%] top-[2%] z-30" />
          <SolidDot className="w-12 h-12 bg-violeta/55 right-[12%] top-[28%] z-30" />
          <SolidLine className="w-64 h-0.75 bg-coral/50 left-[6%] top-[48%] z-30 rotate-2" />
          <SolidTri className="w-24 h-24 bg-coral/50 left-[62%] top-[10%] z-30 rotate-45" />
          <SolidBox className="w-14 h-14 bg-violeta/55 left-[40%] bottom-[22%] z-30 rotate-[-20deg]" />
          <SolidRing className="w-24 h-24 border-coral/40 left-[2%] bottom-[30%] z-30" />
          <SolidLine className="w-44 h-0.75 bg-coral/50 right-[5%] top-[55%] z-30 rotate-3" />
          <SolidDot className="w-8 h-8 bg-coral/60 left-[22%] bottom-[8%] z-30" />
          <SolidBox className="w-16 h-16 bg-coral/50 right-[12%] bottom-[8%] z-30 rotate-35" />
          <SolidRing className="w-16 h-16 border-violeta/40 right-[6%] top-[45%] z-30" />
          <SolidLine className="w-28 h-0.5 bg-violeta/40 left-[45%] top-[75%] z-30 rotate-[-4deg]" />

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
                  <span className="font-mono text-texto text-[9px] tracking-[0.4em] uppercase group-hover:text-white transition-colors">Filtrar</span>
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
                    className={`${pick(offsetSet, gi)} overflow-hidden border border-violeta/15 hover:border-coral/40 hover:bg-violeta transition-all group text-left cursor-pointer relative`}
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
                            <div className="flex items-center gap-1">
                              <p className="font-heading text-white text-sm sm:text-lg font-bold tracking-[-0.02em] leading-tight drop-shadow-md">{a.name}</p>
                            </div>
                            <span className="font-mono text-white/70 text-[7px] sm:text-[9px] tracking-[0.15em] uppercase mt-1">{a.genre}</span>
                      </div>
                      <div className="absolute top-1.5 right-1.5 z-10">
                        <FavoriteButton isFavorite={favorites.has(a.slug)} onToggle={() => handleToggleFav(a.slug)} overlay />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
        </section>
      </div>
      <Footer />

      <ArtistModal
        artist={selected}
        onClose={() => setSelected(null)}
        isFavorite={selected ? favorites.has(selected.slug) : false}
        onToggleFav={selected ? () => handleToggleFav(selected.slug) : undefined}
      />
    </div>
  )
}
