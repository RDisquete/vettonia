import { useParams, Link } from 'react-router-dom'
import HamburgerNav from '../components/HamburgerNav'
import { SolidBox, SolidDot, SolidLine, SolidRing } from '../components/Solids'
import Footer from '../sections/Footer'
import SEO from '../components/SEO'
import JsonLd from '../components/JsonLd'
import { allArtists } from '../data/lineup'

export default function ArtistDetail() {
  const { slug } = useParams<{ slug: string }>()
  const artist = slug ? allArtists.find((a) => a.slug === slug) ?? null : null

  if (!artist) {
    return (
      <div className="flex flex-col min-h-svh bg-arena">
        <SEO title="Artista no encontrado" description="El artista que buscas no está en el cartel de Vettonia 2027." noindex />
        <HamburgerNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-heading text-violeta/30 text-8xl font-bold">404</p>
            <p className="font-mono text-texto text-[10px] tracking-[0.4em] uppercase mt-4">Ups, no lo encontramos</p>
            <Link to="/artists" className="font-mono text-violeta text-[10px] tracking-[0.4em] uppercase underline mt-6 inline-block">Volver atrás</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const artistSchema = {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: artist.name,
    description: artist.bio,
    startDate: `2027-10-08T${artist.time}:00`,
    location: { '@type': 'Place', name: artist.stage },
    performer: { '@type': 'MusicGroup', name: artist.name, image: artist.image },
    image: artist.image,
  }

  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO
        title={artist.name}
        description={`${artist.name} en Vettonia 2027. ${artist.stage} — ${artist.time}. ${artist.genre}.`}
        path={`/artists/${artist.slug}`}
        image={artist.image}
        type="article"
      />
      <JsonLd data={artistSchema} />
      <HamburgerNav />
      <div className="flex-1">
        <section className="px-5 py-16 sm:py-20 relative overflow-hidden min-h-[80vh] flex items-center">
          <div className="absolute inset-0 bg-coral/15"
            style={{ clipPath: 'polygon(70% 0, 100% 0, 85% 100%, 55% 100%)' }} />
          <div className="absolute inset-0 bg-violeta/15"
            style={{ clipPath: 'polygon(0 25%, 20% 0, 40% 100%, 15% 100%)' }} />

          <span className="absolute font-heading text-[clamp(8rem,30vw,25rem)] font-extrabold text-violeta/6 leading-none tracking-[-0.08em] select-none pointer-events-none top-[-5%] right-[-5%]">
            {artist.name.split(' ')[0]}
          </span>

          <SolidBox className="w-14 h-14 bg-coral/60 left-[4%] top-[6%] z-30 rotate-20" />
          <SolidRing className="w-28 h-28 border-violeta/40 right-[-5%] top-[6%] z-30" />
          <SolidDot className="w-7 h-7 bg-violeta/60 right-[12%] top-[40%] z-30" />
          <SolidLine className="w-36 h-0.5 bg-coral/50 left-[15%] bottom-[35%] z-30" />
          <SolidBox className="w-9 h-9 bg-coral/55 left-[50%] bottom-[10%] z-30 rotate-40" />
          <SolidDot className="w-5 h-5 bg-white/50 right-[30%] bottom-[20%] z-30" />

            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-14 items-center max-w-5xl mx-auto">
              <div className="w-64 sm:w-80 lg:w-96 mx-auto lg:mx-0 shrink-0 overflow-hidden border-2 border-violeta/20"
                style={{ transform: 'rotate(-2deg)', aspectRatio: '3/4' }}>
                <img
                  src={artist.image}
                  alt={artist.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <Link to="/artists" className="font-mono text-texto-suave text-[8px] tracking-[0.4em] uppercase hover:text-violeta transition-colors">
                  &larr; Todos los artistas
                </Link>

                <div className="mt-6">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="font-heading text-white text-sm font-bold tracking-[0.15em] uppercase bg-violeta px-4 py-2">
                    {artist.stage}
                  </span>
                  <span className="font-heading text-white text-sm font-bold tracking-[0.15em] uppercase bg-coral px-4 py-2">
                    {artist.time}
                  </span>
                  <span className="font-mono text-texto text-[9px] tracking-[0.3em] uppercase bg-piedra/5 border border-piedra/10 px-3 py-1.5">
                    {artist.genre}
                  </span>
                </div>

                  <h1 className="font-heading text-violeta text-[clamp(2.5rem,8vw,6rem)] font-extrabold leading-[0.85] tracking-[-0.06em]">
                    {artist.name}
                  </h1>

                  <p className="font-ui text-black/70 text-sm sm:text-base leading-relaxed mt-6 max-w-lg">
                    {artist.bio}
                  </p>
                </div>
              </div>
            </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
