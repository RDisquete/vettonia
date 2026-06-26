import { useState } from 'react'
import { Link } from 'react-router-dom'
import HamburgerNav from '../components/HamburgerNav'
import Footer from '../sections/Footer'
import SEO from '../components/SEO'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import { signUp } from '../services/auth'
import { toast } from 'sonner'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [passNumber, setPassNumber] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) return
    setSending(true)
    setError('')
    try {
      const result = await signUp(email, password, name)
      setPassNumber(result.passNumber)
      toast.success('Registro completado')
    } catch (err) {
      console.error('Register error:', err)
      setError(err instanceof Error ? err.message : 'Error al registrarse')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO title="Registro" description="Crea tu cuenta en Vettonia 2026." path="/register" noindex />
      <HamburgerNav />
      <div className="flex-1 flex items-center justify-center px-5 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-violeta/3"
          style={{ clipPath: 'polygon(30% 0, 55% 0, 40% 100%, 20% 100%)' }} />
        <div className="absolute inset-0 bg-coral/4"
          style={{ clipPath: 'polygon(70% 0, 90% 0, 80% 100%, 60% 100%)' }} />

        <SolidBox className="w-16 h-16 bg-coral/40 left-[5%] top-[10%] z-30 rotate-20" />
        <SolidRing className="w-32 h-32 border-violeta/20 right-[-4%] top-[5%] z-30" />
        <SolidDot className="w-10 h-10 bg-violeta/40 left-[8%] top-[50%] z-30" />
        <SolidTri className="w-16 h-16 bg-coral/25 right-[8%] bottom-[20%] z-30 rotate-35" />
        <SolidLine className="w-40 h-0.75 bg-coral/25 right-[15%] top-[45%] z-30 rotate-2" />
        <SolidRing className="w-20 h-20 border-violeta/25 left-[50%] bottom-[10%] z-30" />

        <div className="relative z-10 w-full max-w-md">
          <h1 className="font-heading text-violeta text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.08em] [text-shadow:4px_4px_0_#e85d6f]">
            REGISTRO
          </h1>
          <span className="font-mono text-texto-suave text-[9px] tracking-[0.5em] uppercase block mt-1">Crea tu cuenta</span>

          {!passNumber ? (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase block mb-1">Nombre</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full border-2 border-violeta/20 bg-white/60 px-4 py-3 font-ui text-sm text-violeta outline-none focus:border-coral transition-colors"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 0 100%)' }} />
              </div>
              <div>
                <label className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase block mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full border-2 border-violeta/20 bg-white/60 px-4 py-3 font-ui text-sm text-violeta outline-none focus:border-coral transition-colors"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 0 100%)' }} />
              </div>
              <div>
                <label className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase block mb-1">Contraseña</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className="w-full border-2 border-violeta/20 bg-white/60 px-4 py-3 font-ui text-sm text-violeta outline-none focus:border-coral transition-colors"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 0 100%)' }} />
              </div>

              {error && (
                <p className="font-mono text-coral text-[9px] tracking-[0.2em] uppercase">{error}</p>
              )}

              <button type="submit" disabled={sending}
                className="w-full border-l-4 border-t-2 border-r-2 border-b-2 border-coral pl-8 pr-5 pt-3 pb-3 cursor-pointer hover:bg-coral hover:text-white transition-all group disabled:opacity-50 disabled:pointer-events-none"
                style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}>
                <span className="font-mono text-coral text-[10px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.5em] transition-all block text-center">
                  {sending ? 'Creando cuenta...' : 'Crear cuenta'}
                </span>
              </button>
              <p className="font-ui text-texto-suave text-xs text-center mt-2">
                ¿Ya tienes cuenta? <Link to="/login" className="text-coral hover:text-coral/80 underline underline-offset-4 transition-colors">Inicia sesión</Link>
              </p>
            </form>
          ) : (
            <div className="border-2 border-violeta/10 bg-white/40 p-6 text-center mt-8"
                 style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}>
              <span className="font-heading text-violeta text-xl font-extrabold tracking-[-0.04em] block">¡Registrado!</span>
              <p className="font-ui text-texto-suave text-sm mt-2">Tu número de pase es:</p>
              <span className="font-heading text-coral text-3xl font-extrabold tracking-[-0.04em] block mt-2">{passNumber}</span>
              <p className="font-mono text-texto-suave text-[8px] tracking-[0.2em] uppercase mt-2">Guárdalo para acceder al álbum</p>
              <Link to="/login"
                className="inline-block border-l-4 border-t-2 border-r-2 border-b-2 border-coral pl-8 pr-5 pt-3 pb-3 mt-4 cursor-pointer hover:bg-coral hover:text-white transition-all group">
                <span className="font-mono text-coral text-[10px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.5em] transition-all">Iniciar sesión</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
