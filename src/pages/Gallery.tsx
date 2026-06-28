import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import HamburgerNav from '../components/HamburgerNav'
import GalleryModal from '../components/GalleryModal'
import StoriesFeed from '../components/StoriesFeed'
import Footer from '../sections/Footer'
import SEO from '../components/SEO'
import { SolidBox, SolidDot, SolidLine, SolidRing, SolidTri } from '../components/Solids'
import { getPhotos, isAlbumUnlocked, lockAlbum, authenticatePass, authenticatePassWithPin } from '../lib/storage'
import { getAllReactions, getUserReactions, toggleReaction } from '../services/reactions'
import { subscribeToNewPhotos } from '../services/realtime'
import type { UploadedPhoto, ReactionType, PhotoReactionCount } from '../types'
import { toast } from 'sonner'
import ErrorBoundary from '../components/ErrorBoundary'
import { GallerySkeleton } from '../components/Skeleton'

const publicPhotos = [
  { src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80', rotate: '1deg', clip: '', obj: 'center' },
  { src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80', rotate: '-2deg', clip: 'polygon(0 0, 100% 5%, 95% 95%, 0 100%)', obj: 'center 30%' },
  { src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80', rotate: '2deg', clip: 'polygon(5% 0, 100% 0, 95% 100%, 0 95%)', obj: 'center 20%' },
  { src: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80', rotate: '-1.5deg', clip: '', obj: 'center' },
  { src: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80', rotate: '1deg', clip: 'polygon(0 2%, 100% 0, 100% 100%, 0 98%)', obj: 'center 60%' },
  { src: 'https://images.unsplash.com/photo-1429962714451-bb934ecec4ec?w=600&q=80', rotate: '-1deg', clip: '', obj: 'center 40%' },
  { src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80', rotate: '2.5deg', clip: 'polygon(0 0, 100% 3%, 100% 97%, 0 100%)', obj: 'center' },
  { src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80', rotate: '-2deg', clip: 'polygon(3% 0, 100% 0, 97% 100%, 0 100%)', obj: 'center 70%' },
  { src: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&q=80', rotate: '0.5deg', clip: '', obj: 'center' },
  { src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&q=80', rotate: '-1deg', clip: 'polygon(0 3%, 100% 0, 100% 97%, 0 100%)', obj: 'center' },
  { src: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80', rotate: '1.5deg', clip: '', obj: 'center 30%' },
  { src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&q=80', rotate: '-0.5deg', clip: 'polygon(0 0, 100% 2%, 95% 98%, 0 100%)', obj: 'center' },
]

type Tab = 'publico' | 'privado'

export default function Gallery() {
  const location = useLocation()
  const initialTab: Tab = (location.state as { tab?: Tab })?.tab === 'privado' && isAlbumUnlocked() ? 'privado' : 'publico'
  const [tab, setTab] = useState<Tab>(initialTab)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)
  const [uploaded, setUploaded] = useState<UploadedPhoto[]>([])
  const [unlocked, setUnlocked] = useState(isAlbumUnlocked)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [passInput, setPassInput] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [passError, setPassError] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reactionCounts, setReactionCounts] = useState<Record<string, PhotoReactionCount[]>>({})
  const [userReactions, setUserReactions] = useState<Record<string, ReactionType[]>>({})
  const [newPhotoIds, setNewPhotoIds] = useState<Set<string>>(new Set())
  const codeInputRef = useRef<HTMLInputElement>(null)

  const loadPhotos = useCallback(async () => {
    setLoading(true)
    const [allPhotos, counts, userRxns] = await Promise.all([
      getPhotos('approved'), getAllReactions(), getUserReactions(),
    ])
    setUploaded(allPhotos)
    setReactionCounts(counts)
    setUserReactions(userRxns)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  useEffect(() => {
    if (!unlocked) return
    const unsub = subscribeToNewPhotos((photo) => {
      if (photo.status !== 'approved') return
      setUploaded(prev => [{
        id: photo.id,
        dataUrl: photo.dataUrl,
        caption: photo.caption,
        author: photo.author,
        createdAt: photo.createdAt,
        status: photo.status as UploadedPhoto['status'],
      }, ...prev])
      setNewPhotoIds(prev => new Set(prev).add(photo.id))
      setTimeout(() => {
        setNewPhotoIds(prev => { const next = new Set(prev); next.delete(photo.id); return next })
      }, 5000)
    })
    return unsub
  }, [unlocked])

  useEffect(() => {
    if (showCodeModal) codeInputRef.current?.focus()
  }, [showCodeModal])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowCodeModal(false)
    }
    if (showCodeModal) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showCodeModal])

  const handleToggleRxn = useCallback(async (photoId: string, type: ReactionType) => {
    await toggleReaction(photoId, type)
    const [counts, userRxns] = await Promise.all([getAllReactions(), getUserReactions()])
    setReactionCounts(counts)
    setUserReactions(userRxns)
  }, [])

  const handleTab = (t: Tab) => {
    if (t === 'privado') {
      if (unlocked) {
        setTab(t)
      } else {
        setShowCodeModal(true)
      }
      return
    }
    setTab(t)
  }

  const handleUnlock = async () => {
    setPassLoading(true)
    let ok = false
    if (pinInput.trim()) {
      ok = await authenticatePassWithPin(passInput, pinInput.trim())
    } else {
      ok = await authenticatePass(passInput)
    }
    setPassLoading(false)
    if (ok) {
      setUnlocked(true)
      setShowCodeModal(false)
      setPassInput('')
      setPinInput('')
      setPassError(false)
      setTab('privado')
    } else {
      setPassError(true)
    }
  }

  return (
    <div className="flex flex-col min-h-svh bg-arena">
      <SEO
        title="Galería"
        description="Fotos y momentos de Vettonia 2026. Sube tus fotos y descubre las mejores instantáneas del festival."
        path="/gallery"
      />
      <HamburgerNav />
      <div className="flex-1">
        <section className="px-5 pt-20 pb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-coral/4"
            style={{ clipPath: 'polygon(0 0, 25% 0, 40% 100%, 15% 100%)' }} />
          <div className="absolute inset-0 bg-violeta/4"
            style={{ clipPath: 'polygon(80% 0, 100% 0, 95% 100%, 60% 100%)' }} />
          <div className="absolute inset-0 bg-violeta-claro/3"
            style={{ clipPath: 'polygon(40% 0, 55% 0, 50% 100%, 35% 100%)' }} />

          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #e85d6f 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }} />

          <span className="absolute font-heading text-[clamp(10rem,35vw,30rem)] font-extrabold text-violeta/3 leading-none tracking-[-0.08em] select-none pointer-events-none top-[-2%] left-[-3%]">
            FOTOS
          </span>
          <span className="absolute font-heading text-[clamp(5rem,18vw,15rem)] font-extrabold text-coral/2 leading-none tracking-[-0.08em] select-none pointer-events-none bottom-[5%] right-[-4%] rotate-12">
            LO NUESTRO
          </span>

          <SolidBox className="w-16 h-16 bg-coral/45 left-[4%] top-[4%] z-30 rotate-12" />
          <SolidRing className="w-36 h-36 border-violeta/20 right-[-4%] top-[2%] z-30" />
          <SolidDot className="w-10 h-10 bg-violeta/40 left-[32%] top-[26%] z-30" />
          <SolidLine className="w-56 h-0.75 bg-coral/35 right-[6%] top-[42%] z-30 rotate-1" />
          <SolidTri className="w-18 h-18 bg-coral/30 left-[55%] top-[10%] z-30 rotate-25" />
          <SolidRing className="w-22 h-22 border-coral/25 right-[4%] top-[60%] z-30" />
          <SolidBox className="w-14 h-14 bg-violeta/35 right-[22%] bottom-[20%] z-30 rotate-50" />
          <SolidLine className="w-36 h-0.75 bg-violeta/25 left-[5%] top-[65%] z-30 -rotate-2" />
          <SolidDot className="w-8 h-8 bg-coral/50 left-[8%] bottom-[8%] z-30" />
          <SolidBox className="w-8 h-8 bg-violeta/40 left-[45%] bottom-[5%] z-30 rotate-30" />

          <div className="relative z-10 max-w-5xl mx-auto">
            <h1 className="font-heading text-violeta text-[clamp(3rem,8vw,6rem)] font-extrabold leading-none tracking-[-0.08em] [text-shadow:5px_5px_0_#e85d6f]">
              GALERÍA
            </h1>
            <span className="font-mono text-texto-suave text-[9px] tracking-[0.5em] uppercase block mt-1">Las pruebas del delito</span>

            {/* Tabs */}
            <div role="tablist" aria-label="Álbumes de fotos" className="flex gap-2 mt-6 mb-8">
              <button role="tab" id="tab-publico" aria-selected={tab === 'publico'}
                aria-controls="tabpanel-publico"
                onClick={() => handleTab('publico')}
                className={`font-heading text-sm font-bold tracking-[-0.02em] px-6 py-3 border-2 transition-all cursor-pointer ${
                  tab === 'publico'
                    ? 'bg-violeta text-white border-violeta'
                    : 'bg-transparent text-violeta border-violeta/30 hover:border-violeta/60'
                }`}
                style={{ clipPath: 'polygon(0 0, 95% 0, 100% 100%, 0 100%)' }}
              >
              Lo que se vio
              </button>
              <button role="tab" id="tab-privado" aria-selected={tab === 'privado'}
                aria-controls="tabpanel-privado"
                onClick={() => handleTab('privado')}
                className={`font-heading text-sm font-bold tracking-[-0.02em] px-6 py-3 border-2 transition-all cursor-pointer ${
                  tab === 'privado'
                    ? 'bg-coral text-white border-coral'
                    : 'bg-transparent text-coral border-coral/30 hover:border-coral/60'
                }`}
                style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)' }}
              >
              Lo nuestro
              </button>
            </div>

            {/* Public album */}
            {tab === 'publico' && (
              <div role="tabpanel" id="tabpanel-publico" aria-labelledby="tab-publico">
                <p className="font-ui text-texto text-sm leading-relaxed mb-6 max-w-xl">
                  Esto pasó. Y alguien lo pilló. Fotos de verdad, de gente de verdad,
                  de momentos que merecían quedarse.
                </p>
                <div className="columns-2 sm:columns-3 gap-2 space-y-2">
                  {publicPhotos.map((p, i) => (
                    <div key={i} className="break-inside-avoid overflow-hidden cursor-pointer"
                      style={{ transform: `rotate(${p.rotate})`, clipPath: p.clip || undefined }}>
                      <img
                        src={p.src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                        style={{ objectPosition: p.obj }}
                        onClick={() => { setModalIndex(i); setModalOpen(true) }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Private album */}
            {tab === 'privado' && (
              <ErrorBoundary>
              <div role="tabpanel" id="tabpanel-privado" aria-labelledby="tab-privado">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                  <p className="font-ui text-texto text-sm leading-relaxed max-w-xl">
                    {loading ? 'Cargando...' : uploaded.length === 0
                      ? 'Todavía no hay nada. Pero va a haber. Porque esto es vuestro y nadie lo va a contar mejor que vosotros.'
                      : `Aquí están, las pruebas del delito. ${uploaded.length} foto${uploaded.length !== 1 ? 's' : ''} de locura capturadas por vosotros. Esto es lo nuestro.`
                    }
                  </p>
                  <div className="flex gap-3 shrink-0 mt-1">
                    <button onClick={() => { Object.keys(localStorage).filter(k => k.startsWith('vettonia_') && k !== 'vettonia_album_unlocked' && k !== 'vettonia_auth_pass').forEach(k => localStorage.removeItem(k)); loadPhotos(); toast.success('Caché limpiada') }}
                      className="font-mono text-black/40 text-[7px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-coral transition-colors cursor-pointer">
                      Limpiar caché
                    </button>
                    <button onClick={lockAlbum}
                      className="font-mono text-black/40 text-[7px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-coral transition-colors cursor-pointer">
                      Cerrar álbum
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="mt-4"><GallerySkeleton /></div>
                ) : uploaded.length === 0 ? (
                  <div className="border-2 border-dashed border-violeta/20 p-14 sm:p-18 text-center mt-4 bg-white/40"
                       style={{ clipPath: 'polygon(1% 0, 100% 0, 99% 100%, 2% 100%)' }}>
                    <span className="font-heading text-violeta/30 text-7xl sm:text-8xl font-extrabold tracking-[-0.08em] block leading-none">:/</span>
                    <p className="font-heading text-violeta text-xl sm:text-2xl font-extrabold tracking-[-0.04em] mt-3">
                      Pues va a ser que nadie ha soltado la primera foto...
                    </p>
                    <p className="font-ui text-texto text-sm leading-relaxed mt-2 max-w-md mx-auto">
                      La gente se está guardando los momentos. ¿Tanto miedo a que se vea lo bien que lo pasaste?
                    </p>
                    <p className="font-heading text-coral text-lg font-extrabold tracking-[-0.04em] mt-4">
                      SÉ EL PRIMERO
                    </p>
                    <Link to="/upload"
                      className="border-l-4 border-t-2 border-r-2 border-b-2 border-coral/50 pl-10 pr-6 pt-3 pb-3 mt-5 inline-block hover:bg-coral hover:border-coral transition-all group"
                      style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
                      <span className="font-mono text-coral text-[11px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.6em] transition-all">
                        Sube tu foto
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 -mx-5 sm:-mx-0">
                    <StoriesFeed
                      photos={uploaded}
                      userReactions={userReactions}
                      reactionCounts={reactionCounts}
                      onToggleReaction={handleToggleRxn}
                      newPhotoIds={newPhotoIds}
                    />
                  </div>
                )}
              </div>
              </ErrorBoundary>
            )}
          </div>
        </section>
      </div>
      <Footer />

      {tab === 'publico' && (
        <GalleryModal
          images={publicPhotos.map((p) => p.src)}
          initialIndex={modalIndex}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Pass access modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-100 bg-carbón/90 backdrop-blur-md flex items-center justify-center p-4 select-none"
          onClick={() => setShowCodeModal(false)}>
          <div className="w-full max-w-sm bg-arena border-2 border-violeta/20 p-8 cursor-default relative"
            onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowCodeModal(false)}
              className="absolute -top-3 -right-3 bg-coral hover:bg-coral/80 text-white px-3 py-1.5 text-sm font-bold tracking-wider uppercase z-20 cursor-pointer border-2 border-white/50 shadow-lg">
              ✕
            </button>

            <span className="font-heading text-violeta text-3xl font-extrabold tracking-[-0.08em] leading-none block [text-shadow:3px_3px_0_#e85d6f]">
              ACCESO
            </span>
            <span className="font-mono text-texto-suave text-[8px] tracking-[0.4em] uppercase block mt-2">
              Identifícate con tu pase
            </span>
            <p className="font-ui text-texto text-xs leading-relaxed mt-3">
              Introduce el número y PIN de tu pase para acceder al álbum privado.
            </p>

            <div className="mt-4 space-y-3">
              <input ref={codeInputRef} type="text" value={passInput} onChange={(e) => { setPassInput(e.target.value); setPassError(false) }}
                onKeyDown={(e) => e.key === 'Enter' && !passLoading && handleUnlock()}
                className={`font-mono text-violeta text-sm bg-transparent border-2 px-4 py-3 w-full outline-none text-center tracking-[0.3em] uppercase placeholder:text-black/30 transition-colors ${
                  passError ? 'border-coral' : 'border-violeta/20 focus:border-coral/50'
                }`}
                placeholder="VET-000000" />
              <input type="password" value={pinInput} onChange={(e) => { setPinInput(e.target.value); setPassError(false) }}
                onKeyDown={(e) => e.key === 'Enter' && !passLoading && handleUnlock()}
                className="font-mono text-violeta text-sm bg-transparent border-2 px-4 py-3 w-full outline-none text-center tracking-[0.3em] placeholder:text-black/30 transition-colors border-violeta/20 focus:border-coral/50"
                placeholder="PIN (opcional)" />
              {passError && (
                <p className="font-mono text-coral text-[8px] tracking-[0.2em] uppercase mt-2 text-center animate-pulse">Datos incorrectos</p>
              )}
            </div>

            <button onClick={handleUnlock} disabled={passLoading}
              className={`border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/40 pl-10 pr-6 pt-3 pb-3 mt-5 w-full hover:bg-violeta hover:border-violeta transition-all group cursor-pointer ${
                passLoading ? 'opacity-50 pointer-events-none' : ''
              }`}
              style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
              <span className="font-mono text-violeta text-[10px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.5em] transition-all block">
                {passLoading ? 'Verificando...' : 'Entrar'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
