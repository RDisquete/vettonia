import { useState } from 'react'

const FORMSPREE_NEWSLETTER = import.meta.env.VITE_FORMSPREE_NEWSLETTER

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !FORMSPREE_NEWSLETTER) return
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_NEWSLETTER}`, {
        method: 'POST',
        body: new FormData(e.target as HTMLFormElement),
        headers: { Accept: 'application/json' },
      })
      if (res.ok) setSent(true)
      else setError(true)
    } catch {
      setError(true)
    }
  }

  if (!FORMSPREE_NEWSLETTER) return null

  if (sent) return <p className="font-mono text-coral text-[9px] tracking-[0.2em] uppercase">✓ Te has apuntado</p>

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(false) }}
        required placeholder="tu@email.com"
        className="font-ui text-white/95 text-xs bg-white/20 border border-white/30 px-3 py-2 outline-none flex-1 min-w-0 placeholder:text-white/50 focus:border-coral/50 transition-colors"
      />
      <button type="submit"
        className="font-mono text-[8px] tracking-[0.2em] uppercase px-3 py-2 bg-coral text-white hover:bg-coral/80 transition-colors cursor-pointer shrink-0">
        OK
      </button>
      {error && <p className="font-mono text-coral text-[7px] tracking-[0.15em] absolute -bottom-5 left-0">Error al enviar</p>}
    </form>
  )
}
