import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SolidBox, SolidDot } from '../../../components/Solids'
import type { PassStats as Stats } from '../../../services/stats'
import type { UploadedPhoto } from '../../../types'
import { SkeletonBox, SkeletonText } from '../../../components/Skeleton'
import EmptyState from '../../../components/EmptyState'
import GalleryModal from '../../../components/GalleryModal'

interface Props {
  stats: Stats
  messageCount: number
  photos: UploadedPhoto[]
  loading?: boolean
}

const r = () => `${(Math.random() * 4 - 2).toFixed(1)}deg`

export default function PassStats({ stats, messageCount, photos, loading }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)

  if (loading) {
    return (
      <section className="px-5 pb-20">
        <div className="max-w-4xl mx-auto space-y-4">
          <SkeletonText className="w-32 h-5 mb-2" />
          <SkeletonText className="w-60 h-3 mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
            {[...Array(4)].map((_, i) => (
              <SkeletonBox key={i} className="h-24" />
            ))}
          </div>
          <SkeletonBox className="w-full h-40" />
        </div>
      </section>
    )
  }
  return (
    <section className="px-5 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="border-l-4 border-coral/50 pl-5 mb-8">
          <span className="font-heading text-violeta text-2xl sm:text-3xl font-extrabold tracking-[-0.04em]">
            TUS NÚMEROS
          </span>
          <p className="font-ui text-texto text-sm leading-relaxed mt-1">
            Esto es lo que has construido en Vettonia. Cada foto, cada like, cada momento cuenta.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {[
            { value: stats.photosUploaded, label: 'Fotos subidas', color: 'text-coral', border: 'border-coral/50' },
            { value: stats.totalLikes, label: 'Fotos con like', color: 'text-violeta', border: 'border-violeta/50' },
            { value: stats.uniqueAuthors, label: 'Fotógrafos', color: 'text-coral', border: 'border-coral/50' },
            { value: messageCount, label: 'Mensajes en el muro', color: 'text-violeta', border: 'border-violeta/50' },
          ].map((stat, i) => (
            <div key={i}
              className={`border-l-4 ${stat.border} bg-white/70 border-2 border-violeta/5 p-4 text-center`}
              style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}>
              <span className={`font-heading ${stat.color} text-3xl sm:text-4xl font-extrabold tracking-[-0.08em] block leading-none`}>
                {stat.value}
              </span>
              <span className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase block mt-1">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="border-2 border-violeta/10 bg-white/70 p-6 overflow-hidden relative"
             style={{ clipPath: 'polygon(0 0, 100% 0, 99% 100%, 1% 100%)' }}>
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #e85d6f 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }} />
          <SolidDot className="w-4 h-4 bg-coral/30 right-[5%] top-[10%] z-30" />
          <SolidBox className="w-6 h-6 bg-violeta/20 left-[3%] bottom-[20%] z-30 rotate-30" />

          <div className="relative z-10">
            <span className="font-heading text-violeta text-lg font-extrabold tracking-[-0.04em]">
              Tu línea temporal
            </span>
            <p className="font-ui text-texto text-sm leading-relaxed mt-2 max-w-xl">
              {stats.joinDate
                ? `Formas parte de esto desde el ${new Date(stats.joinDate).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}.`
                : 'Aún no has empezado tu historia aquí.'}
            </p>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <Link to="/upload"
                className="border-l-4 border-t-2 border-r-2 border-b-2 border-coral/50 px-6 py-2 hover:bg-coral hover:border-coral transition-all group"
                style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
                <span className="font-mono text-coral text-[10px] tracking-[0.4em] uppercase group-hover:text-white group-hover:tracking-[0.5em] transition-all block">
                  + Subir foto
                </span>
              </Link>
              <Link to="/gallery"
                className="font-mono text-violeta text-[10px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-coral transition-colors">
                Ir al álbum
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <span className="font-heading text-violeta text-lg font-extrabold tracking-[-0.04em] block">
            Tus fotos recientes
          </span>
          <span className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase block mb-4">Las últimas que has soltado en el álbum</span>
          {photos.length === 0 ? (
            <EmptyState
              icon=":)"
              title="Aún no has subido fotos"
              description="El álbum está esperando tus mejores momentos."
              action={{ label: 'Subir foto', to: '/upload' }}
            />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {photos.slice(0, 5).map((photo, i) => (
                <div key={photo.id} className="aspect-square overflow-hidden border border-violeta/10 bg-white/60 cursor-pointer"
                  style={{ transform: `rotate(${r()})` }}
                  onClick={() => { setModalIndex(i); setModalOpen(true) }}>
                  <img src={photo.dataUrl} alt={photo.caption} loading="lazy" decoding="async"
                    className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <GalleryModal
        images={photos.map((p) => p.dataUrl)}
        initialIndex={modalIndex}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  )
}
