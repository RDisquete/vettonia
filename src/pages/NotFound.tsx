import { Link } from 'react-router-dom'
import HamburgerNav from '../components/HamburgerNav'
import Footer from '../sections/Footer'
import SEO from '../components/SEO'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO title="404 — Página no encontrada" description="La página que buscas no existe en Vettonia 2027." path="/404" />
      <HamburgerNav />
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1600&h=900&fit=crop&auto=format"
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-arena/95 via-arena/90 to-arena/80" />
          <div className="absolute inset-0 bg-linear-to-t from-violeta/30 via-transparent to-coral/10" />
        </div>

        <div className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle, #3a1a4a 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />

        <div className="absolute inset-0 bg-coral/15"
          style={{ clipPath: 'polygon(60% 0, 100% 0, 90% 100%, 45% 100%)' }} />
        <div className="absolute inset-0 bg-violeta/12"
          style={{ clipPath: 'polygon(0 15%, 25% 0, 40% 100%, 0 85%)' }} />

        <span className="absolute font-heading text-[clamp(14rem,45vw,35rem)] font-extrabold text-violeta/8 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[-10%] right-[-8%] rotate-12">
          404
        </span>
        <span className="absolute font-heading text-[clamp(6rem,18vw,14rem)] font-extrabold text-coral/6 leading-none tracking-[-0.08em] select-none pointer-events-none top-[5%] left-[-5%] -rotate-8">
          ERROR
        </span>

        <SolidBox className="w-14 h-14 bg-coral/70 left-[5%] top-[8%] z-30 rotate-25" />
        <SolidTri className="w-20 h-20 bg-violeta/50 right-[6%] top-[10%] z-30 rotate-[-15deg]" />
        <SolidRing className="w-32 h-32 border-coral/50 left-[-3%] top-[40%] z-30" />
        <SolidDot className="w-10 h-10 bg-violeta/70 right-[5%] top-[50%] z-30" />
        <SolidLine className="w-48 h-0.75 bg-coral/60 left-[15%] top-[55%] z-30 -rotate-3" />
        <SolidTri className="w-14 h-14 bg-coral/60 left-[50%] bottom-[20%] z-30 rotate-30" />
        <SolidBox className="w-12 h-12 bg-violeta/60 right-[12%] bottom-[12%] z-30 rotate-[-20deg]" />
        <SolidDot className="w-7 h-7 bg-coral/80 left-[30%] bottom-[8%] z-30" />
        <SolidRing className="w-18 h-18 border-violeta/50 right-[40%] top-[72%] z-30" />
        <SolidLine className="w-32 h-0.5 bg-coral/50 right-[25%] top-[82%] z-30 rotate-8" />

        <div className="relative z-10 text-center px-5 max-w-lg mx-auto">
          <span className="font-heading text-violeta text-[clamp(5rem,15vw,10rem)] font-extrabold tracking-[-0.06em] leading-none block select-none"
                style={{ textShadow: '4px 4px 0 #e85d6f' }}>
            404
          </span>

          <span className="font-mono text-texto-suave text-[9px] tracking-[0.5em] uppercase block mt-4">
            Página no encontrada
          </span>

          <p className="font-ui text-texto text-sm sm:text-base leading-relaxed mt-3">
            Esa página no existe. O nunca existió. O está de tour por otros servidores.
          </p>
          <p className="font-ui text-texto-suave text-xs italic mt-1">
            — Igual que tu sentido de la orientación en mitad de un mosh.
          </p>

          <Link to="/"
            className="inline-block border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-10 pr-6 pt-3 pb-3 mt-6 cursor-pointer hover:bg-violeta hover:border-violeta transition-all group"
            style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
            <span className="font-mono text-violeta text-[10px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.5em] transition-all">
              Volver al inicio
            </span>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
