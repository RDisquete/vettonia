import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import { unlockAlbum } from '../lib/storage'

export default function Acceso() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = () => {
    if (unlockAlbum(code)) {
      setSuccess(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  const perks = [
    'Álbum privado de fotos',
    'Descargar contenido exclusivo',
    'Muro de la fama',
    'Tu pase digital personalizado',
    'Playlists y mixtapes',
    'Estadísticas del festival',
  ]

  return (
    <section id="acceso" className="px-5 py-24 relative overflow-hidden scroll-mt-24 min-h-[70vh] flex items-center ">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1777290734933-acaa88c57f6c?w=1600&h=900&fit=crop&auto=format"
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-arena/95 via-arena/85 to-arena/70" />
        <div className="absolute inset-0 bg-linear-to-t from-violeta/40 via-transparent to-coral/20" />
      </div>

      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #3a1a4a 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

      <div className="absolute inset-0 bg-coral/8"
        style={{ clipPath: 'polygon(75% 0, 100% 0, 100% 100%, 55% 100%)' }} />
      <div className="absolute inset-0 bg-violeta/6"
        style={{ clipPath: 'polygon(0 0, 25% 0, 40% 100%, 0 100%)' }} />
      <div className="absolute inset-0 bg-coral-oscuro/6"
        style={{ clipPath: 'polygon(50% 0, 65% 0, 55% 100%, 40% 100%)' }} />
      <div className="absolute inset-0 bg-violeta-claro/4"
        style={{ clipPath: 'polygon(85% 0, 100% 0, 95% 100%, 70% 100%)' }} />

      <span className="absolute font-heading text-[clamp(12rem,35vw,30rem)] font-extrabold text-violeta/4 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[-5%] right-[-5%] rotate-6">
        ENTRAR
      </span>
      <span className="absolute font-heading text-[clamp(5rem,15vw,13rem)] font-extrabold text-coral/2 leading-none tracking-[-0.08em] select-none pointer-events-none top-[3%] left-[-3%] -rotate-8">
        ACCESO
      </span>

      <SolidBox className="w-16 h-16 bg-coral/45 left-[3%] top-[5%] z-30 rotate-20" />
      <SolidTri className="w-20 h-20 bg-violeta/30 right-[10%] top-[6%] z-30 rotate-[-10deg]" />
      <SolidRing className="w-40 h-40 border-coral/30 left-[-4%] top-[28%] z-30" />
      <SolidDot className="w-10 h-10 bg-violeta/50 right-[5%] top-[38%] z-30" />
      <SolidLine className="w-56 h-0.75 bg-coral-oscuro/30 left-[12%] top-[52%] z-30 rotate-[-5deg]" />
      <SolidTri className="w-14 h-14 bg-coral/35 left-[52%] bottom-[18%] z-30 rotate-25" />
      <SolidBox className="w-12 h-12 bg-violeta/40 right-[18%] bottom-[14%] z-30 rotate-[-15deg]" />
      <SolidLine className="w-36 h-0.75 bg-violeta-claro/20 left-[45%] top-[72%] z-30 rotate-2" />
      <SolidDot className="w-7 h-7 bg-coral/50 left-[28%] bottom-[5%] z-30" />
      <SolidRing className="w-20 h-20 border-violeta/30 right-[35%] top-[62%] z-30" />
      <SolidBox className="w-8 h-8 bg-coral-oscuro/30 left-[60%] top-[8%] z-30 rotate-30" />
      <SolidDot className="w-5 h-5 bg-violeta/50 right-[50%] bottom-[8%] z-30" />

        <Reveal as="pop" className="w-full">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center max-w-5xl mx-auto">
          <div className="lg:pl-6">
              <p className="font-heading text-violeta text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.85] tracking-[-0.06em]">
                TIENES <span className="text-coral">PASE</span>?
              </p>
              <p className="font-ui text-black/70 text-sm sm:text-base leading-relaxed mt-3 max-w-md">
                20.000 almas, un valle y tres días de locura — si tienes código,
                el pase te abre el álbum privado, contenido exclusivo, el muro de la fama y mucho más. ¿Sin código? <Link to="/contact" className="text-coral underline underline-offset-4 hover:text-violeta transition-colors">escríbenos</Link>.
              </p>

              <div className="border-2 border-violeta/20 p-6 sm:p-8 bg-white/60 max-w-md backdrop-blur-[2px]"
                   style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}>
                {success ? (
                  <div className="text-center">
                    <span className="font-heading text-violeta text-5xl font-extrabold tracking-[-0.08em] block">&#10003;</span>
                    <p className="font-heading text-violeta text-lg font-bold tracking-[-0.02em] mt-2">Pase activado</p>
                    <p className="font-ui text-texto text-sm mt-1">Bienvenido. Todo esto es tuyo:</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-3">
                      {perks.map((p, i) => (
                        <span key={i} className="font-mono text-texto-suave text-[7px] tracking-[0.2em] uppercase flex items-center gap-1">
                          <span className="text-coral">&#10003;</span> {p}
                        </span>
                      ))}
                    </div>
                    <button onClick={() => navigate('/access')}
                      className="border-l-4 border-t-2 border-r-2 border-b-2 border-coral/50 pl-10 pr-6 pt-3 pb-3 mt-5 w-full hover:bg-coral hover:border-coral transition-all group cursor-pointer"
                      style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
                      <span className="font-mono text-coral text-[10px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.5em] transition-all block">
                        Entrar al hub
                      </span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <input type="text" value={code}
                      onChange={(e) => { setCode(e.target.value); setError(false) }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      className={`font-mono text-violeta text-sm bg-transparent border-2 px-4 py-3 w-full outline-none placeholder:text-black/40 text-center tracking-[0.3em] transition-colors uppercase ${error ? 'border-coral' : 'border-violeta/20 focus:border-coral/50'}`}
                      placeholder="TU CÓDIGO SECRETO"
                    />
                    {error && (
                      <p className="font-mono text-coral text-[8px] tracking-[0.2em] uppercase mt-2 text-center">Código incorrecto</p>
                    )}

                    <div className="border-2 border-violeta/10 p-4 bg-white/80 flex justify-center mt-4">
                      <div className="grid grid-cols-5 gap-1">
                        {[...Array(25)].map((_, i) => (
                          <div key={i}
                               className={`w-2 h-2 ${i % 3 === 0 || i % 7 === 0 ? 'bg-coral/50' : 'bg-violeta/15'}`} />
                        ))}
                      </div>
                    </div>

                    <button onClick={handleSubmit}
                      className="border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/40 pl-10 pr-6 pt-3 pb-3 mt-5 w-full hover:bg-violeta hover:border-violeta transition-all group cursor-pointer text-center"
                      style={{ clipPath: 'polygon(3% 0, 100% 0, 97% 100%, 0 100%)' }}>
                      <span className="font-mono text-violeta text-[10px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.6em] transition-all">Entrar</span>
                    </button>
                  </div>
                )}
              </div>
          </div>

          <div className="hidden lg:flex flex-col items-start">
              <span className="font-heading text-[clamp(10rem,18vw,18rem)] font-extrabold text-violeta leading-[0.7] tracking-[-0.08em] select-none block"
                    style={{ textShadow: '8px 8px 0 #e85d6f' }}>
                2026
              </span>
              <span className="font-mono text-texto-suave text-[10px] tracking-[0.6em] uppercase -mt-1 block text-right">
                Vettonia
              </span>

              <div className="flex items-center gap-3 border-l-4 border-coral/50 pl-4">
                <div>
                  <span className="font-heading text-coral text-3xl font-extrabold tracking-[-0.04em] block leading-none">3</span>
                  <span className="font-mono text-texto-suave text-[7px] tracking-[0.3em] uppercase">Escenarios</span>
                </div>
                <div className="w-px h-8 bg-black/10" />
                <div>
                  <span className="font-heading text-violeta text-3xl font-extrabold tracking-[-0.04em] block leading-none">+48</span>
                  <span className="font-mono text-texto-suave text-[7px] tracking-[0.3em] uppercase">Artistas</span>
                </div>
              </div>
          </div>
        </div>
        </Reveal>
    </section>
  )
}
