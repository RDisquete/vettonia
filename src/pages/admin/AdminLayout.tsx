import { useState, useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { SolidBox, SolidDot } from '../../components/Solids'
import { signInAdmin, signOut, getSession, onAuthStateChange } from '../../services/auth'
import type { Session } from '@supabase/supabase-js'

const navItems = [
  { label: 'Panel', path: '/admin' },
  { label: 'Cartel', path: '/admin/lineup' },
  { label: 'Galería', path: '/admin/gallery' },
  { label: 'Alertas', path: '/admin/alerts' },
  { label: 'Contenido', path: '/admin/content' },
]

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => { emailRef.current?.focus() }, [])

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setError(false)
    try {
      await signInAdmin(email, password)
      onLogin()
    } catch {
      setError(true)
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-arena flex items-center justify-center p-4">
      <div className="w-full max-w-xs text-center">
        <span className="font-heading text-violeta text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.08em] block [text-shadow:4px_4px_0_#e85d6f]">
          ADMIN
        </span>
        <span className="font-mono text-texto-suave text-[8px] tracking-[0.4em] uppercase block mt-2">Inicia sesión</span>
        <div className="mt-6 border-2 border-violeta/20 p-6 bg-white/60"
             style={{ clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}>
          <input ref={emailRef} type="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setError(false) }}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
            className="font-mono text-violeta text-sm bg-transparent border-2 px-4 py-3 w-full outline-none text-center tracking-widest placeholder:text-black/30 transition-colors border-violeta/20 focus:border-coral/50"
            placeholder="EMAIL"
            autoComplete="email" />
          <input type="password" value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
            className={`font-mono text-violeta text-sm bg-transparent border-2 px-4 py-3 w-full outline-none text-center tracking-[0.3em] uppercase placeholder:text-black/30 transition-colors mt-3 ${error ? 'border-coral' : 'border-violeta/20 focus:border-coral/50'}`}
            placeholder="CONTRASEÑA"
            autoComplete="current-password" />
          {error && (
            <p className="font-mono text-coral text-[8px] tracking-[0.2em] uppercase mt-2">Credenciales incorrectas</p>
          )}
          <button onClick={handleSubmit} disabled={loading}
            className={`border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/40 pl-10 pr-6 pt-3 pb-3 mt-5 w-full hover:bg-violeta hover:border-violeta transition-all group cursor-pointer ${loading ? 'opacity-50 pointer-events-none' : ''}`}
            style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
            <span className="font-mono text-violeta text-[10px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.5em] transition-all block">
              {loading ? 'Entrando...' : 'Entrar'}
            </span>
          </button>
        </div>
        <Link to="/" className="font-mono text-black/40 text-[7px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-violeta transition-colors mt-4 block">
          Volver a la web
        </Link>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(true)
  const { pathname } = useLocation()

  useEffect(() => {
    let alive = true
    getSession().then(s => {
      if (alive) { setSession(s); setChecking(false) }
    }).catch(() => {
      if (alive) setChecking(false)
    })
    const unsub = onAuthStateChange(s => {
      if (alive) setSession(s as Session | null)
    })
    return () => { alive = false; unsub() }
  }, [])

  const handleLogout = async () => {
    await signOut()
  }

  const clearCache = () => {
    Object.keys(localStorage).filter(k => k.startsWith('vettonia_')).forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  if (checking) return null

  if (!session) return <Login onLogin={() => getSession().then(setSession).catch(() => setChecking(false))} />

  return (
    <div className="min-h-svh bg-arena flex flex-col">
      <div className="bg-carbón px-5 py-3 flex items-center justify-between relative overflow-hidden">
        <SolidDot className="w-2 h-2 bg-coral/80 left-[2%] top-1/2 -translate-y-1/2 z-30" />
        <SolidBox className="w-3 h-3 bg-white/8 right-[5%] top-[20%] z-30" />
        <div className="flex items-center gap-4 relative z-10">
          <Link to="/" className="font-mono text-coral text-[8px] tracking-[0.3em] uppercase hover:text-white/60 transition-colors">VETTONIA</Link>
          <span className="text-white/10 text-[8px]">/</span>
          <span className="font-mono text-coral text-[8px] tracking-[0.3em] uppercase  hover:text-white/60 transition-colors">Admin</span>
        </div>
        <button onClick={handleLogout}
          className="font-mono text-white/20 text-[7px] tracking-[0.3em] uppercase hover:text-white/40 transition-colors relative z-10 cursor-pointer">
          Cerrar sesión
        </button>
      </div>
      <div className="flex flex-1">
        <nav className="w-48 shrink-0 bg-white border-r border-violeta/10 p-4 space-y-1">
          {navItems.map((item) => {
            const active = item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`font-mono text-[9px] tracking-[0.3em] uppercase block px-3 py-2 transition-colors ${active ? 'bg-violeta text-white' : 'text-texto hover:text-violeta hover:bg-violeta/5'}`}
              >
                {item.label}
              </Link>
            )
          })}
          <button onClick={clearCache}
            className="font-mono text-[7px] tracking-[0.3em] uppercase block w-full text-left px-3 py-2 text-coral/50 hover:text-coral transition-colors cursor-pointer">
            Limpiar caché
          </button>
        </nav>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
