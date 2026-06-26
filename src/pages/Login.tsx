import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HamburgerNav from '../components/HamburgerNav'
import Footer from '../sections/Footer'
import SEO from '../components/SEO'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import { signIn } from '../services/auth'
import { toast } from 'sonner'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setSending(true)
    setError('')
    try {
      await signIn(email, password)
      toast.success('Sesión iniciada')
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO title="Iniciar sesión" description="Accede a tu cuenta de Vettonia 2026." path="/login" noindex />
      <HamburgerNav />
      <div className="flex-1 flex items-center justify-center px-5 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-coral/3"
          style={{ clipPath: 'polygon(30% 0, 55% 0, 40% 100%, 20% 100%)' }} />
        <div className="absolute inset-0 bg-violeta/4"
          style={{ clipPath: 'polygon(70% 0, 90% 0, 80% 100%, 60% 100%)' }} />

        <SolidBox className="w-12 h-12 bg-coral/45 left-[6%] top-[12%] z-30 rotate-15" />
        <SolidRing className="w-28 h-28 border-violeta/20 right-[-3%] top-[8%] z-30" />
        <SolidDot className="w-8 h-8 bg-violeta/45 left-[12%] top-[45%] z-30" />
        <SolidTri className="w-14 h-14 bg-coral/30 right-[10%] bottom-[25%] z-30 rotate-40" />
        <SolidLine className="w-36 h-0.75 bg-coral/30 right-[12%] top-[50%] z-30 -rotate-2" />
        <SolidRing className="w-16 h-16 border-violeta/30 left-[45%] bottom-[12%] z-30" />

        <div className="relative z-10 w-full max-w-md">
          <h1 className="font-heading text-violeta text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.08em] [text-shadow:4px_4px_0_#e85d6f]">
            ACCEDER
          </h1>
          <span className="font-mono text-texto-suave text-[9px] tracking-[0.5em] uppercase block mt-1">Inicia sesión</span>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase block mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border-2 border-violeta/20 bg-white/60 px-4 py-3 font-ui text-sm text-violeta outline-none focus:border-coral transition-colors"
                style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 0 100%)' }} />
            </div>
            <div>
              <label className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase block mb-1">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
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
                {sending ? 'Entrando...' : 'Entrar'}
              </span>
            </button>
          </form>

          <p className="font-ui text-texto-suave text-xs text-center mt-6">
            ¿No tienes cuenta? <Link to="/register" className="text-coral hover:text-coral/80 underline underline-offset-4 transition-colors">Regístrate</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
