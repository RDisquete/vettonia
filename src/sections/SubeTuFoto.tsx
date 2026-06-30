import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'

export default function SubeTuFoto() {
  return (
    <section className="relative overflow-hidden min-h-[50vh] sm:min-h-[60vh] flex items-center scroll-mt-24">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&h=900&fit=crop&auto=format"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/50 via-violeta/70 to-violeta/85" />
      </div>

      <div className="absolute inset-0 bg-coral/12"
        style={{ clipPath: 'polygon(70% 0, 100% 0, 85% 100%, 50% 100%)' }} />
      <div className="absolute inset-0 bg-violeta/10"
        style={{ clipPath: 'polygon(0 40%, 20% 20%, 35% 80%, 0 100%)' }} />
      <div className="absolute inset-0 bg-violeta-claro/12"
        style={{ clipPath: 'polygon(40% 0, 55% 0, 50% 100%, 35% 100%)' }} />

      <div className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(circle, #e85d6f 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

      <span className="absolute font-heading text-[clamp(12rem,40vw,34rem)] font-extrabold text-white/8 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[-10%] right-[-6%] rotate-15">
        SUBIR
      </span>
      <span className="absolute font-heading text-[clamp(6rem,18vw,15rem)] font-extrabold text-coral/8 leading-none tracking-[-0.08em] select-none pointer-events-none top-[3%] left-[-4%] -rotate-8">
        +FOTOS
      </span>

      <SolidBox className="w-24 h-24 bg-white/35 left-[6%] top-[6%] z-30 rotate-25" />
      <SolidRing className="w-48 h-48 border-white/35 right-[-12%] top-[-10%] z-30" />
      <SolidDot className="w-12 h-12 bg-coral/85 left-[2%] top-[48%] z-30" />
      <SolidLine className="w-64 h-1 bg-white/45 right-[8%] top-[52%] z-30 rotate-2" />
      <SolidTri className="w-28 h-28 bg-white/20 left-[52%] top-[8%] z-30 rotate-40" />
      <SolidBox className="w-14 h-14 bg-white/25 right-[15%] bottom-[15%] z-30 rotate-[-35deg]" />
      <SolidRing className="w-32 h-32 border-coral/75 left-[32%] bottom-[2%] z-30" />
      <SolidDot className="w-8 h-8 bg-white/85 left-[25%] top-[20%] z-30" />
      <SolidLine className="w-48 h-0.75 bg-coral-oscuro/50 left-[5%] top-[68%] z-30 -rotate-3" />
      <SolidRing className="w-20 h-20 border-white/40 right-[30%] top-[58%] z-30" />
      <SolidDot className="w-6 h-6 bg-coral/80 right-[20%] top-[30%] z-30" />

      <div className="relative z-10 w-full px-5 py-16 sm:py-20">
        <Reveal as="pop">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-8 lg:gap-16 items-center">
          <div>
            <span className="font-mono text-white/80 text-[9px] tracking-[0.5em] uppercase block drop-shadow">Comparte</span>
            <p className="font-heading text-white text-[clamp(3rem,9vw,8rem)] font-extrabold leading-[0.78] tracking-[-0.08em] mt-2 drop-shadow-2xl [text-shadow:2px_2px_0_rgba(0,0,0,0.3)]">
              ESTO TAMBIÉN
            </p>
            <p className="font-heading text-coral text-[clamp(2.5rem,8vw,7rem)] font-extrabold leading-[0.78] tracking-[-0.08em] drop-shadow-2xl [text-shadow:2px_2px_0_rgba(0,0,0,0.25)]">
              ES TUYO.
            </p>
            <p className="font-ui text-white text-sm sm:text-base leading-relaxed mt-4 max-w-md drop-shadow-lg">
              Cada mirada, cada baile, cada momento que nadie más capturó.
              Este álbum lo hacéis vosotros. Suelta esa foto.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4">
            <div className="inline-block">
              <Link to="/upload"
                className="block bg-coral border-l-4 border-t-2 border-r-2 border-b-2 border-coral-oscuro pl-12 pr-8 pt-4 pb-4 hover:bg-coral-oscuro hover:border-violeta transition-all group shadow-lg"
                style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}>
                <span className="font-mono text-white text-[14px] sm:text-base tracking-[0.4em] uppercase group-hover:tracking-[0.7em] transition-all">
                  Sube tu foto →
                </span>
              </Link>
            </div>
            <span className="font-mono text-white/80 text-[8px] sm:text-[9px] tracking-[0.4em] uppercase drop-shadow">Sin registro · sin límites</span>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  )
}
