import { useState } from 'react'
import { Link } from 'react-router-dom'
import HamburgerNav from '../components/HamburgerNav'
import { SolidBox, SolidDot, SolidLine, SolidRing } from '../components/Solids'
import Footer from '../sections/Footer'
import SEO from '../components/SEO'
import { toast } from 'sonner'

export default function Contact() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const id = import.meta.env.VITE_FORMSPREE_ID

    if (!id) {
      toast.error('Falta VITE_FORMSPREE_ID en .env')
      return
    }

    setSending(true)
    try {
      const res = await fetch(`https://formspree.io/f/${id}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setSent(true)
        toast.success('Mensaje enviado')
      } else {
        const err = await res.json()
        toast.error(err?.error || 'Error al enviar')
      }
    } catch {
      toast.error('No se pudo conectar con Formspree')
    } finally {
      setSending(false)
    }
  }
  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO
        title="Contacto"
        description="Ponte en contacto con el equipo de Vettonia 2027. Escríbenos para cualquier duda o sugerencia."
        path="/contact"
      />
      <HamburgerNav />
      <div className="flex-1">
        <section className="px-5 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-violeta/12"
            style={{ clipPath: 'polygon(50% 0, 75% 0, 60% 100%, 30% 100%)' }} />
          <div className="absolute inset-0 bg-coral/12"
            style={{ clipPath: 'polygon(85% 0, 100% 0, 90% 100%, 65% 100%)' }} />

          <span className="absolute font-heading text-[clamp(8rem,28vw,24rem)] font-extrabold text-violeta/6 leading-none tracking-[-0.08em] select-none pointer-events-none top-[-3%] right-[-5%]">
            CONTACTO
          </span>

          <SolidBox className="w-14 h-14 bg-coral/60 left-[4%] top-[5%] z-30 rotate-18" />
          <SolidRing className="w-26 h-26 border-violeta/40 right-[-3%] top-[8%] z-30" />
          <SolidDot className="w-7 h-7 bg-violeta/60 right-[12%] top-[38%] z-30" />
          <SolidLine className="w-36 h-0.5 bg-coral/50 left-[8%] top-[42%] z-30" />
          <SolidDot className="w-5 h-5 bg-coral/70 right-[30%] bottom-[15%] z-30" />
          <SolidBox className="w-10 h-10 bg-violeta/50 left-[45%] bottom-[8%] z-30 rotate-25" />

            <h1 className="font-heading text-violeta text-[clamp(3rem,8vw,6rem)] font-extrabold leading-none tracking-[-0.08em] [text-shadow:5px_5px_0_#e85d6f]">
              CONTACTO
            </h1>
            <span className="font-mono text-texto-suave text-[9px] tracking-[0.5em] uppercase block mt-1">Háblanos</span>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14">

              {/* left side — text */}
              <div className="space-y-5">
                <p className="font-heading text-violeta text-3xl sm:text-4xl font-extrabold tracking-[-0.06em] leading-[1.1]">
                  Queremos saber de ti
                </p>
                <p className="font-ui text-texto text-sm leading-relaxed">
                  Vettonia no sería lo mismo sin la gente que viene, baila, suda y vuelve. 
                  Si tienes una idea loca, una pregunta, ganas de tocar, o simplemente 
                  quieres contarnos algo, este es el sitio.
                </p>
                <div className="border-l-4 border-coral/40 pl-4 space-y-3 pt-1 pb-1">
                  <p className="font-ui text-texto text-xs leading-relaxed">
                    <span className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase block mb-0.5">Email</span>
                    <a href="mailto:rafael.doradozamoro@gmail.com" className="hover:text-coral transition-colors">rafael.doradozamoro@gmail.com</a>
                  </p>
                  <p className="font-ui text-texto text-xs leading-relaxed">
                    <span className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase block mb-0.5">Redes</span>
                    <a href="https://instagram.com/rdisquete" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors">@rdisquete</a>
                  </p>
                </div>
                <p className="font-ui text-texto-suave text-xs leading-relaxed">
                  También puedes escribirnos a la antigua usanza. 
                  Sí, carta física. Sí, todavía sabemos leer.
                </p>
              </div>

              {/* right side — form */}
              {sent ? (
                <div className="border-2 border-coral/30 p-8 bg-white/50 text-center flex flex-col items-center justify-center"
                     style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}>
                  <span className="font-heading text-violeta text-6xl font-extrabold tracking-[-0.08em] block [text-shadow:3px_3px_0_#e85d6f]">✓</span>
                  <p className="font-heading text-violeta text-xl font-extrabold tracking-[-0.04em] mt-2">Mensaje enviado</p>
                  <p className="font-ui text-texto text-sm mt-1">Gracias por escribirnos. Te respondemos en cuanto podamos.</p>
                  <Link to="/"
                    className="mt-6 inline-block border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-8 pr-5 pt-2.5 pb-2.5 hover:bg-violeta hover:border-violeta transition-all group font-mono text-violeta text-[10px] tracking-[0.4em] uppercase hover:text-white"
                    style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
                    Volver al inicio
                  </Link>
                </div>
              ) : (
              <form onSubmit={handleSubmit}
                className="border-2 border-violeta/20 p-6 sm:p-8 bg-white/50 space-y-5 backdrop-blur-[2px]"
              >
                <div>
                  <label className="font-mono text-texto-suave text-[8px] tracking-[0.4em] uppercase block mb-2" htmlFor="name">Nombre</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="font-ui text-violeta text-sm bg-transparent border border-violeta/20 px-3 py-3 w-full outline-none placeholder:text-texto-suave/60"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="font-mono text-texto-suave text-[8px] tracking-[0.4em] uppercase block mb-2" htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="font-ui text-violeta text-sm bg-transparent border border-violeta/20 px-3 py-3 w-full outline-none placeholder:text-texto-suave/60"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="font-mono text-texto-suave text-[8px] tracking-[0.4em] uppercase block mb-2" htmlFor="subject">Asunto</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    className="font-ui text-violeta text-sm bg-transparent border border-violeta/20 px-3 py-3 w-full outline-none placeholder:text-texto-suave/60"
                    placeholder="¿De qué va?"
                  />
                </div>
                <div>
                  <label className="font-mono text-texto-suave text-[8px] tracking-[0.4em] uppercase block mb-2" htmlFor="message">Mensaje</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="font-ui text-violeta text-sm bg-transparent border border-violeta/20 px-3 py-3 w-full outline-none placeholder:text-texto-suave/60 resize-none"
                    placeholder="Cuéntanos..."
                  />
                </div>
                <button type="submit" disabled={sending}
                  className={`w-full border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-10 pr-6 pt-3 pb-3 cursor-pointer hover:bg-violeta hover:border-violeta transition-all group text-center ${sending ? 'opacity-50 pointer-events-none' : ''}`}
                  style={{ clipPath: 'polygon(3% 0, 100% 0, 97% 100%, 0 100%)' }}>
                  <span className="font-mono text-violeta text-[10px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.5em] transition-all">{sending ? 'Enviando...' : 'Enviar'}</span>
                </button>
                <input type="text" name="_gotcha" className="hidden" />
              </form>
              )}
            </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
