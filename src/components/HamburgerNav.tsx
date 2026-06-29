import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SolidDot, SolidBox } from './Solids'
import { getCurrentUser, signOut } from '../services/auth'
import { DarkModeSwitch } from './DarkModeToggle'

const baseLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Cartel', to: '/lineup' },
  { label: 'Artistas', to: '/artists' },
  { label: 'Mapa', to: '/map' },
  { label: 'Galería', to: '/gallery' },
  { label: 'Info', to: '/info' },
  { label: 'Pase', to: '/access' },
  { label: 'Subir', to: '/upload' },
  { label: 'Contacto', to: '/contact' },
]

const sizeMap = ['text-4xl', 'text-5xl', 'text-3xl', 'text-4xl', 'text-3xl', 'text-5xl', 'text-4xl', 'text-3xl', 'text-4xl']
const weightMap = ['font-bold', 'font-light', 'font-bold', 'font-normal', 'font-extralight', 'font-bold', 'font-light', 'font-bold', 'font-normal']
const trackMap = ['tracking-[-0.04em]', 'tracking-[0.15em]', 'tracking-[0.08em]', 'tracking-[0em]', 'tracking-[0.2em]', 'tracking-[-0.03em]', 'tracking-[0.12em]', 'tracking-[-0.02em]', 'tracking-[0.1em]']
const marginMap = [0, 1.5, 3, 0.5, 2, 0, 1.5, 3, 0.5]

export default function HamburgerNav() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  const links = user
    ? [...baseLinks, { label: 'Cerrar sesión', to: '' }]
    : [...baseLinks, { label: 'Acceder', to: '/login' }]

  const handleExtraClick = async () => {
    if (user) {
      await signOut()
      setUser(null)
      setOpen(false)
      navigate('/')
    } else {
      navigate('/login')
      setOpen(false)
    }
  }

  return (
    <>
      <motion.button
        initial={{ x: '100%', rotate: 12, opacity: 0 }}
        animate={{ x: 0, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14, mass: 0.8, delay: 0.3 }}
        onClick={() => setOpen(true)}
        className="fixed top-6 right-6 z-50 w-11 h-11 flex flex-col items-center justify-center gap-1 bg-violeta border border-white/10 cursor-pointer hover:bg-violeta-claro transition-colors"
        style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}
        aria-label="Menú"
      >
        <span className="block w-4 h-[1.5px] bg-white" />
        <span className="block w-4 h-[1.5px] bg-white" />
        <span className="block w-3 h-[1.5px] bg-white self-start ml-2.5" />
      </motion.button>

      {open && (
        <motion.div
          initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
          animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 bg-violeta flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-coral/8"
            style={{ clipPath: 'polygon(65% 0, 100% 0, 80% 100%, 45% 100%)' }} />
          <div className="absolute inset-0 bg-white/3"
            style={{ clipPath: 'polygon(0 30%, 25% 0, 45% 100%, 20% 100%)' }} />

          <SolidDot className="w-5 h-5 bg-coral/55 left-[12%] top-[15%] z-30" />
          <SolidBox className="w-7 h-7 bg-white/8 right-[8%] top-[10%] z-30 rotate-25" />
          <SolidDot className="w-3 h-3 bg-white/20 right-[20%] bottom-[25%] z-30" />
          <SolidBox className="w-5 h-5 bg-coral/40 left-[45%] bottom-[15%] z-30 rotate-40" />

          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors bg-violeta-claro/30 z-30"
            style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 85%)' }}
            aria-label="Cerrar menú"
          >
            <span className="block w-5 h-[1.5px] bg-white rotate-45 absolute" />
            <span className="block w-5 h-[1.5px] bg-white -rotate-45 absolute" />
          </button>

          <nav className="relative z-10 flex flex-col items-start ml-8 sm:ml-12 gap-3">
            {links.map((l, i) => {
              if (l.to === '' || (l.to === '/login' && !user)) {
                return (
                  <button
                    key={l.label}
                    onClick={handleExtraClick}
                    className={`font-heading text-white ${sizeMap[i] || 'text-4xl'} ${weightMap[i] || 'font-bold'} ${trackMap[i] || 'tracking-[-0.02em]'} uppercase hover:text-coral transition-colors text-left cursor-pointer`}
                    style={{ marginLeft: `${marginMap[i] || 0}rem` }}
                  >
                    {l.label}
                  </button>
                )
              }
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`font-heading text-white ${sizeMap[i]} ${weightMap[i]} ${trackMap[i]} uppercase hover:text-coral transition-colors`}
                  style={{ marginLeft: `${marginMap[i]}rem` }}
                >
                  {l.label}
                </Link>
              )
            })}
            <div className="mt-6 ml-0.5 border-t border-white/10 pt-4 w-full max-w-48">
              <DarkModeSwitch onClose={() => setOpen(false)} />
            </div>
          </nav>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
            <img src="/vettonia-logo.png" alt="Vettonia" loading="lazy" decoding="async" className="h-10 sm:h-24 w-auto opacity-80 sm:opacity-95" />
          </div>
        </motion.div>
      )}
    </>
  )
}
