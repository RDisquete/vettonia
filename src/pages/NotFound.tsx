import { Link } from 'react-router-dom'
import HamburgerNav from '../components/HamburgerNav'
import Footer from '../sections/Footer'
import SEO from '../components/SEO'
import { SolidBox, SolidDot, SolidLine, SolidRing } from '../components/Solids'

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO title="404 — Página no encontrada" description="La página que buscas no existe en Vettonia 2026." path="/404" />
      <HamburgerNav />
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-coral/4"
          style={{ clipPath: 'polygon(55% 0, 100% 0, 85% 100%, 40% 100%)' }} />
        <div className="absolute inset-0 bg-violeta/3"
          style={{ clipPath: 'polygon(0 20%, 30% 0, 50% 100%, 10% 100%)' }} />

        <span className="absolute font-heading text-[clamp(12rem,40vw,35rem)] font-extrabold text-violeta/3 leading-none tracking-[-0.08em] select-none pointer-events-none top-[-8%] left-[-5%]">
          404
        </span>

        <SolidBox className="w-14 h-14 bg-coral/30 left-[8%] top-[10%] z-30 rotate-18" />
        <SolidRing className="w-28 h-28 border-violeta/15 right-[5%] top-[8%] z-30" />
        <SolidDot className="w-8 h-8 bg-violeta/30 left-[15%] top-[55%] z-30" />
        <SolidLine className="w-40 h-0.75 bg-coral/25 right-[10%] top-[45%] z-30 rotate-[-5deg]" />
        <SolidBox className="w-10 h-10 bg-violeta/25 left-[55%] bottom-[15%] z-30 rotate-35" />
        <SolidDot className="w-6 h-6 bg-coral/35 right-[25%] bottom-[12%] z-30" />
        <SolidRing className="w-16 h-16 border-coral/20 left-[30%] top-[75%] z-30" />

        <div className="relative z-10 text-center px-5">
         
            <span className="font-heading text-violeta text-[clamp(5rem,15vw,10rem)] font-extrabold tracking-[-0.06em] leading-none block">
              404
            </span>
       

         
            <p className="font-ui text-texto text-sm sm:text-base tracking-[0.15em] uppercase max-w-md mx-auto leading-relaxed">
              Ni idea de dónde está esa página. Pregunta en la barra.
            </p>
   

       
            <Link to="/"
              className="inline-block border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-10 pr-6 pt-3 pb-3 cursor-pointer hover:bg-violeta hover:border-violeta transition-all group"
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
