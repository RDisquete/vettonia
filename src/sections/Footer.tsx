import { Link } from 'react-router-dom'
import { SolidDot, SolidBox } from '../components/Solids'

export default function Footer() {
  return (
    <footer className="bg-violeta px-5 py-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-coral/10"
        style={{ clipPath: 'polygon(80% 0, 100% 0, 95% 100%, 70% 100%)' }} />

      <SolidDot className="w-4 h-4 bg-coral/75 left-[8%] top-[20%] z-30" />
      <SolidBox className="w-6 h-6 bg-white/10 right-[10%] top-[15%] z-30" />
      <SolidBox className="w-5 h-5 bg-coral/55 left-[60%] bottom-[20%] z-30" />

      <div className="relative z-10 max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity">
          <img src="/vettonia-logo.png" alt="Vettonia" loading="lazy" decoding="async" className="h-6 w-auto opacity-50" />
          <span className="font-heading text-white text-sm font-bold tracking-[-0.04em]">VETTONIA</span>
        </Link>
        <div className="text-right">
          <span className="font-mono text-white/30 text-[7px] tracking-[0.3em] uppercase block">
            Creado por <a href="https://rdisquete.es" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-white transition-colors">@rdisquete</a>
          </span>
          <span className="font-mono text-white/20 text-[6px] tracking-[0.2em] block mt-0.5">© 2026</span>
        </div>
      </div>
    </footer>
  )
}
