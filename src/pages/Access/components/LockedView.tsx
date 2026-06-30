import { Link } from 'react-router-dom'
import Reveal from '../../../components/Reveal'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../../../components/Solids'

interface Props {
  code: string
  error: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
  onCodeChange: (v: string) => void
  onSubmit: () => void
}

export default function LockedView({ code, error, inputRef, onCodeChange, onSubmit }: Props) {
  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <div className="flex-1 flex items-stretch">
        <section className="relative overflow-hidden flex-1 flex items-center">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1768054180300-ab772bd09d0e?w=1600&h=900&fit=crop&auto=format"
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-arena/95 via-arena/85 to-arena/70" />
            <div className="absolute inset-0 bg-linear-to-t from-violeta/30 via-transparent to-coral/15" />
          </div>

          <div className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(circle, #3a1a4a 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }} />

          <div className="absolute inset-0 bg-coral/15"
            style={{ clipPath: 'polygon(80% 0, 100% 0, 100% 100%, 60% 100%)' }} />
          <div className="absolute inset-0 bg-violeta/15"
            style={{ clipPath: 'polygon(0 0, 20% 0, 35% 100%, 0 100%)' }} />

          <span className="absolute font-heading text-[clamp(14rem,40vw,35rem)] font-extrabold text-violeta/6 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[-8%] right-[-5%] rotate-12">
            ACCESO
          </span>

          <SolidBox className="w-16 h-16 bg-coral/70 left-[3%] top-[5%] z-30 rotate-25" />
          <SolidTri className="w-20 h-20 bg-violeta/45 right-[8%] top-[6%] z-30 rotate-[-15deg]" />
          <SolidRing className="w-36 h-36 border-coral/45 left-[-4%] top-[35%] z-30" />
          <SolidDot className="w-10 h-10 bg-violeta/70 right-[4%] top-[42%] z-30" />
          <SolidLine className="w-56 h-0.75 bg-coral/60 left-[10%] top-[52%] z-30 -rotate-3" />
          <SolidTri className="w-14 h-14 bg-coral/55 left-[50%] bottom-[18%] z-30 rotate-30" />
          <SolidBox className="w-12 h-12 bg-violeta/55 right-[15%] bottom-[10%] z-30 rotate-[-20deg]" />
          <SolidDot className="w-7 h-7 bg-coral/70 left-[25%] bottom-[5%] z-30" />
          <SolidRing className="w-18 h-18 border-violeta/45 right-[35%] top-[70%] z-30" />
          <SolidLine className="w-32 h-0.5 bg-coral/45 right-[20%] top-[80%] z-30 rotate-8" />

          <div className="relative z-10 w-full px-5">
            <Reveal as="rise" className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">
                <div className="lg:pl-6">
                  <span className="font-mono text-texto text-[9px] tracking-[0.5em] uppercase block">Acceso</span>
                  <h1 className="font-heading text-violeta text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.85] tracking-[-0.06em] mt-4">
                    TU <span className="text-coral">PASE</span>
                  </h1>
                  <p className="font-ui text-black/70 text-sm sm:text-base leading-relaxed mt-3 max-w-md">
                    Introduce el código que recibiste en tu email. ¿No tienes?
                    <Link to="/contact" className="text-coral underline underline-offset-4 hover:text-violeta transition-colors ml-1">consigue el tuyo</Link>.
                  </p>

                  <Reveal as="creep" delay={300} className="mt-8">
                    <div className="border-2 border-violeta/20 p-6 sm:p-8 bg-white/60 max-w-md backdrop-blur-[2px]"
                         style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}>
                      <input ref={inputRef} type="text" value={code}
                        onChange={(e) => onCodeChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                        className={`font-mono text-violeta text-sm bg-transparent border-2 px-4 py-3 w-full outline-none placeholder:text-black/40 text-center tracking-[0.3em] transition-colors uppercase ${error ? 'border-coral' : 'border-violeta/20 focus:border-coral/50'}`}
                        placeholder="TU CÓDIGO SECRETO"
                      />
                      {error && (
                        <p className="font-mono text-coral text-[8px] tracking-[0.2em] uppercase mt-2 text-center">Código incorrecto</p>
                      )}
                      <p className="font-mono text-texto-suave text-[7px] tracking-[0.3em] uppercase mt-3 text-center">
                        Demo: escribe <span className="text-coral font-bold">V4CC3SS25</span>
                      </p>

                      <div className="border-2 border-violeta/10 p-5 bg-white/80 flex justify-center mt-4">
                        <div className="grid grid-cols-5 gap-1">
                          {[...Array(25)].map((_, i) => (
                            <div key={i}
                                 className={`w-2 h-2 ${i % 3 === 0 || i % 7 === 0 ? 'bg-coral/50' : 'bg-violeta/15'}`} />
                          ))}
                        </div>
                      </div>

                      <button onClick={onSubmit}
                        className="border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/40 pl-10 pr-6 pt-3 pb-3 mt-5 w-full hover:bg-violeta hover:border-violeta transition-all group cursor-pointer text-center"
                        style={{ clipPath: 'polygon(3% 0, 100% 0, 97% 100%, 0 100%)' }}>
                        <span className="font-mono text-violeta text-[10px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.6em] transition-all">Entrar</span>
                      </button>
                    </div>
                  </Reveal>
                </div>

                <div className="hidden lg:flex flex-col items-start">
                  <Reveal as="pop" delay={500}>
                    <span className="font-heading text-[clamp(10rem,18vw,18rem)] font-extrabold text-violeta leading-[0.7] tracking-[-0.08em] select-none block"
                          style={{ textShadow: '8px 8px 0 #e85d6f' }}>
                      2027
                    </span>
                    <span className="font-mono text-texto-suave text-[10px] tracking-[0.6em] uppercase -mt-1 block text-right">
                      Vettonia
                    </span>
                  </Reveal>

                  <Reveal as="rise" delay={700} className="mt-8 space-y-4">
                    <div className="flex items-center gap-3 border-l-4 border-coral/50 pl-4">
                      <div>
                        <span className="font-heading text-coral text-4xl font-extrabold tracking-[-0.04em] block leading-none">3</span>
                        <span className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase">Escenarios</span>
                      </div>
                      <div className="w-px h-10 bg-black/10" />
                      <div>
                        <span className="font-heading text-violeta text-4xl font-extrabold tracking-[-0.04em] block leading-none">+48</span>
                        <span className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase">Artistas</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-l-4 border-violeta/50 pl-4">
                      <div>
                        <span className="font-heading text-violeta text-4xl font-extrabold tracking-[-0.04em] block leading-none">3</span>
                        <span className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase">Días</span>
                      </div>
                      <div className="w-px h-10 bg-black/10" />
                      <div>
                        <span className="font-heading text-coral text-4xl font-extrabold tracking-[-0.04em] block leading-none">20K</span>
                        <span className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase">Personas</span>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  )
}
