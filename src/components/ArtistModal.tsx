import { useEffect, useRef } from 'react'
import type { Artist } from '../types'

interface ArtistModalProps {
  artist: Artist | null
  onClose: () => void
  stage?: string
  time?: string
}

export default function ArtistModal({ artist, onClose, stage, time }: ArtistModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!artist) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [artist, onClose])

  if (!artist) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 bg-carbón/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div className="w-full max-w-2xl bg-arena border-2 border-violeta/20 cursor-default relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-coral hover:bg-coral/80 text-white px-4 py-2 text-sm font-bold tracking-wider uppercase z-20 cursor-pointer border-2 border-white/50 shadow-lg"
        >
          ✕ Cerrar
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-0">
          <div className="w-full sm:w-56 aspect-3/4 sm:aspect-auto overflow-hidden" style={{ transform: 'rotate(-1.5deg) scale(0.95)' }}>
            <img src={artist.image} alt={artist.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          </div>
          <div className="p-5 sm:p-6 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="font-heading text-white text-xs font-bold tracking-[0.15em] uppercase bg-violeta px-3 py-1.5">{stage ?? artist.stage}</span>
              <span className="font-heading text-white text-xs font-bold tracking-[0.15em] uppercase bg-coral px-3 py-1.5">{time ?? artist.time}</span>
              <span className="font-mono text-texto text-[8px] tracking-[0.3em] uppercase bg-piedra/10 border border-piedra/20 px-2 py-1">{artist.genre}</span>
            </div>
            <h2 className="font-heading text-violeta text-3xl sm:text-4xl font-extrabold tracking-[-0.06em] leading-tight">{artist.name}</h2>
            <p className="font-ui text-black/70 text-sm leading-relaxed mt-3">{artist.bio}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
