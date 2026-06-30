import { useState, useEffect } from 'react'

const KEY = 'vettonia_dark_mode'

export function DarkModeSwitch({ onClose }: { onClose?: () => void }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY)
      const isDark = stored === 'true'
      setDark(isDark)
      document.documentElement.classList.toggle('dark', isDark)
    } catch {}
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem(KEY, String(next)) } catch {}
    onClose?.()
  }

  return (
    <button onClick={toggle}
      className="font-heading text-white text-lg font-bold tracking-[-0.01em] hover:text-coral transition-colors text-left cursor-pointer flex items-center gap-3"
    >
      <span className="text-xl">{dark ? '☀' : '☾'}</span>
      <span>{dark ? 'Modo claro' : 'Modo oscuro'}</span>
   
    </button>
  )
}
