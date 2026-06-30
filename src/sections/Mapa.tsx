import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { SolidBox, SolidDot, SolidLine, SolidRing } from '../components/Solids'

export default function Mapa() {
  return (
    <section id="mapa" className="px-5 py-24 relative overflow-hidden scroll-mt-24 min-h-[60vh] flex items-center ">
      <img
        src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&h=900&fit=crop&auto=format"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-arena/85 via-arena/60 to-violeta/30" />

      <div className="absolute inset-0 bg-coral/15"
        style={{ clipPath: 'polygon(80% 0, 100% 0, 90% 100%, 65% 100%)' }} />
      <div className="absolute inset-0 bg-violeta/15"
        style={{ clipPath: 'polygon(0 60%, 15% 40%, 30% 80%, 10% 100%)' }} />

      <div className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(circle, #3a1a4a 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

      <div className="absolute w-[50vw] h-[50vw] sm:w-[40vw] sm:h-[40vw] rounded-full border border-violeta/25 left-[60%] top-[50%] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute w-[35vw] h-[35vw] sm:w-[28vw] sm:h-[28vw] rounded-full border border-dashed border-violeta/20 left-[60%] top-[50%] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute w-[20vw] h-[20vw] sm:w-[16vw] sm:h-[16vw] rounded-full border border-violeta/35 left-[60%] top-[50%] -translate-x-1/2 -translate-y-1/2" />

      <SolidBox className="w-12 h-12 bg-coral/80 left-[20%] top-[6%] z-30 rotate-20" />
      <SolidRing className="w-24 h-24 border-violeta/50 left-[55%] top-[5%] z-30" />
      <SolidDot className="w-8 h-8 bg-coral/85 right-[8%] top-[30%] z-30" />
      <SolidBox className="w-10 h-10 bg-violeta/70 right-[35%] bottom-[25%] z-30 rotate-40" />
      <SolidRing className="w-20 h-20 border-coral/70 right-[3%] bottom-[15%] z-30" />
      <SolidDot className="w-6 h-6 bg-coral/80 left-[10%] bottom-[18%] z-30" />
      <SolidLine className="w-36 h-1 bg-violeta/50 right-[20%] top-[55%] z-30" />
      <SolidDot className="w-4 h-4 bg-coral/90 left-[45%] top-[55%] z-30" />

        <Reveal as="pop" className="w-full">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          <div className="order-2 lg:order-1">
            <p className="font-mono text-texto-suave text-[10px] tracking-[0.5em] uppercase mb-4">
              ¿Dónde estás?
            </p>
            <p className="font-heading text-violeta text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.85] tracking-[-0.06em] max-w-lg drop-shadow-sm">
              AQUÍ <span className="text-coral">NADA</span> QUEDA LEJOS.
            </p>
            <p className="font-ui text-black/70 text-sm sm:text-base leading-relaxed mt-4 max-w-md">
              Dinos dónde estás y te guiamos hasta tu escenario favorito.
              Extremadura es grande, pero el finde es tuyo.
            </p>

            <Link to="/map"
                  className="border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/70 pl-10 pr-6 pt-4 pb-4 mt-8 inline-block hover:bg-violeta hover:text-white transition-all group"
                  style={{ clipPath: 'polygon(0 0, 85% 0, 100% 30%, 100% 100%, 0 100%)' }}>
              <span className="font-mono text-violeta text-[11px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.5em] transition-all">
                Encuéntrame
              </span>
            </Link>
          </div>

          <div className="order-1 lg:order-2 relative shrink-0 mx-auto lg:mx-0">
            <div className="relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-coral/35 border-2 border-coral/80 flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-coral" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-14 border-r-14 border-t-16 border-l-transparent border-r-transparent border-t-coral/70" />
            </div>
            <div className="absolute top-[-20%] right-[-30%] w-16 h-16 sm:w-20 sm:h-20 border-2 border-dashed border-violeta/50 rounded-full" />
            <div className="absolute bottom-[10%] left-[-40%] w-12 h-12 border border-violeta/35 rounded-full" />
          </div>
        </div>
        </Reveal>
    </section>
  )
}
