import { useEffect, useCallback, useRef, useState, memo } from 'react'

type GalleryModalProps = {
  images: string[]
  initialIndex?: number
  open: boolean
  onClose: () => void
}

const GalleryModal = memo(function GalleryModal({ images, initialIndex = 0, open, onClose }: GalleryModalProps) {
  const [current, setCurrent] = useState(initialIndex)
  const touchX = useRef(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length])

  useEffect(() => {
    if (!open) return
    setCurrent(initialIndex)
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', handler)
    closeRef.current?.focus()
    return () => window.removeEventListener('keydown', handler)
  }, [open, initialIndex, onClose, prev, next])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div ref={modalRef} role="dialog" aria-modal="true" aria-label="Visor de fotos"
      className="fixed inset-0 z-100 bg-carbón/90 backdrop-blur-md flex items-center justify-center select-none"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        const delta = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(delta) > 50) { if (delta > 0) prev(); else next() }
      }}
    >
      <button ref={closeRef}
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors z-10"
        style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 85%)' }}
        aria-label="Cerrar"
      >
        <span aria-hidden="true" className="block w-5 h-[1.5px] bg-white rotate-45 absolute" />
        <span aria-hidden="true" className="block w-5 h-[1.5px] bg-white -rotate-45 absolute" />
      </button>

      <button
        onClick={prev}
        className="hidden sm:flex absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center cursor-pointer hover:bg-white/10 transition-colors z-10"
        aria-label="Anterior"
      >
        <span aria-hidden="true" className="block w-3 h-[1.5px] bg-white -rotate-45 absolute" />
        <span aria-hidden="true" className="block w-3 h-[1.5px] bg-white rotate-45 absolute mt-1.5" />
      </button>

      <button
        onClick={next}
        className="hidden sm:flex absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center cursor-pointer hover:bg-white/10 transition-colors z-10"
        aria-label="Siguiente"
      >
        <span aria-hidden="true" className="block w-3 h-[1.5px] bg-white rotate-45 absolute" />
        <span aria-hidden="true" className="block w-3 h-[1.5px] bg-white -rotate-45 absolute mt-1.5" />
      </button>

      <div className="w-full max-w-[90vw] max-h-[85vh] sm:w-220 sm:h-155 sm:max-w-none sm:max-h-none flex items-center justify-center">
        <img
          src={images[current]}
          alt={`Foto ${current + 1} de ${images.length}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain z-0"
          style={{ viewTransitionName: 'gallery-img' }}
        />
      </div>

      <a href={images[current]} download
        className="absolute bottom-6 left-6 border-l-4 border-t-2 border-r-2 border-b-2 border-coral/60 pl-8 pr-5 pt-2 pb-2 font-mono text-coral bg-violeta text-[10px] tracking-[0.4em] uppercase hover:bg-coral hover:text-white transition-all z-10"
        style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}
        onClick={(e) => e.stopPropagation()}>
        DESCARGAR
      </a>

      <span className="absolute bottom-6 font-mono text-white/40 text-[9px] tracking-[0.3em] uppercase" aria-live="polite" aria-atomic="true">
        {current + 1} / {images.length}
      </span>
    </div>
  )
})

export default GalleryModal
