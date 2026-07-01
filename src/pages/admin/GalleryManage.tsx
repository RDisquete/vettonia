import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getPhotos, deletePhoto, updatePhotoStatus } from '../../services/album'
import type { UploadedPhoto } from '../../types'
import SEO from '../../components/SEO'
import { GalleryManageSkeleton } from '../../components/Skeleton'
import { toast } from 'sonner'

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected'

export default function GalleryManage() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('pending')

  const loadPhotos = useCallback(async () => {
    setLoading(true)
    setPhotos(await getPhotos())
    setLoading(false)
  }, [])

  useEffect(() => { loadPhotos() }, [loadPhotos])

  const handleDelete = async (id: string) => {
    await deletePhoto(id)
    setPhotos(await getPhotos())
    setConfirmId(null)
    toast.success('Foto eliminada')
  }

  const handleApprove = async (id: string) => {
    await updatePhotoStatus(id, 'approved')
    toast.success('Foto aprobada')
    setPhotos(await getPhotos())
  }

  const handleReject = async (id: string) => {
    await updatePhotoStatus(id, 'rejected')
    toast.success('Foto rechazada')
    setPhotos(await getPhotos())
  }

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return photos
    return photos.filter(p => (p.status || 'approved') === statusFilter)
  }, [photos, statusFilter])

  const pendingCount = useMemo(() => photos.filter(p => p.status === 'pending').length, [photos])
  const approvedCount = useMemo(() => photos.filter(p => (p.status || 'approved') === 'approved').length, [photos])
  const rejectedCount = useMemo(() => photos.filter(p => p.status === 'rejected').length, [photos])

  const uniqueAuthors = photos.length > 0 ? new Set(photos.map(p => p.author)).size : 0
  const lastUpload = photos.length > 0
    ? new Date(Math.max(...photos.map(p => new Date(p.createdAt).getTime()))).toLocaleDateString('es', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—'

  const filters: { key: FilterStatus; label: string }[] = [
    { key: 'pending', label: `Pendientes (${pendingCount})` },
    { key: 'approved', label: `Aprobadas (${approvedCount})` },
    { key: 'rejected', label: `Rechazadas (${rejectedCount})` },
    { key: 'all', label: `Todas (${photos.length})` },
  ]

  return (
    <div>
      <SEO title="Galería — Admin" description="Gestión de fotos de Vettonia." noindex />
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="font-heading text-violeta text-2xl font-bold tracking-[-0.04em]">Galería</p>
        <Link to="/upload"
          className="border-l-4 border-t-2 border-r-2 border-b-2 border-coral/50 pl-6 pr-4 pt-2 pb-2 hover:bg-coral hover:border-coral transition-all group"
          style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
          <span className="font-mono text-coral text-[9px] tracking-[0.4em] uppercase group-hover:text-white">+ Subir foto</span>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="border border-violeta/10 p-3 bg-white">
          <span className="font-heading text-violeta text-xl font-extrabold tracking-[-0.04em] block">{photos.length}</span>
          <span className="font-mono text-texto-suave text-[7px] tracking-[0.3em] uppercase">Fotos</span>
        </div>
        <div className="border border-violeta/10 p-3 bg-white">
          <span className="font-heading text-violeta text-xl font-extrabold tracking-[-0.04em] block">{uniqueAuthors}</span>
          <span className="font-mono text-texto-suave text-[7px] tracking-[0.3em] uppercase">Autores</span>
        </div>
        <div className="border border-violeta/10 p-3 bg-white">
          <span className="font-heading text-violeta text-sm font-extrabold tracking-[-0.04em] block truncate">{lastUpload}</span>
          <span className="font-mono text-texto-suave text-[7px] tracking-[0.3em] uppercase">Última subida</span>
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="bg-coral/5 border border-coral/20 p-3 mb-4">
          <p className="font-mono text-coral text-[8px] tracking-[0.2em] uppercase">
            {pendingCount} foto{pendingCount !== 1 ? 's' : ''} pendiente{pendingCount !== 1 ? 's' : ''} de aprobación
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map(f => (
          <button key={f.key} onClick={() => setStatusFilter(f.key)}
            className={`font-mono text-[7px] tracking-[0.2em] uppercase px-2.5 py-1.5 border cursor-pointer transition-all ${statusFilter === f.key ? 'bg-violeta text-white border-violeta' : 'bg-white text-texto border-violeta/20 hover:border-violeta/40'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <GalleryManageSkeleton /> : filtered.length === 0 ? (
        <div className="border-2 border-dashed border-violeta/20 p-12 text-center bg-white/40">
          <p className="font-ui text-texto-suave text-sm">
            {statusFilter === 'pending' ? 'No hay fotos pendientes de aprobación.' :
             statusFilter === 'rejected' ? 'No hay fotos rechazadas.' :
             'No hay fotos subidas todavía.'}
          </p>
          <Link to="/upload"
            className="font-mono text-coral text-[9px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-violeta transition-colors mt-2 inline-block">
            Subir la primera foto
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((photo) => (
            <div key={photo.id} className="flex items-center gap-4 bg-white border border-violeta/10 p-3">
              <img
                src={photo.dataUrl}
                alt={photo.caption}
                loading="lazy"
                decoding="async"
                className="w-14 h-14 sm:w-16 sm:h-16 object-cover shrink-0 border border-violeta/5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-violeta text-[9px] tracking-[0.2em] uppercase">{photo.author}</span>
                  <span className={`font-mono text-[6px] tracking-[0.15em] uppercase px-1 py-0.5 border ${(photo.status || 'approved') === 'approved' ? 'border-oliva/30 text-oliva' : photo.status === 'pending' ? 'border-arena/40 text-arena' : 'border-coral/30 text-coral'}`}>
                    {photo.status || 'approved'}
                  </span>
                  <span className="text-texto-suave/50 text-[8px]">·</span>
                  <span className="font-mono text-texto-suave text-[7px] tracking-[0.15em]">
                    {new Date(photo.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {photo.caption && (
                  <p className="font-ui text-texto text-xs truncate mt-0.5 italic">&ldquo;{photo.caption}&rdquo;</p>
                )}
              </div>
              <div className="shrink-0 flex items-center gap-2">
                {(photo.status === 'pending' || photo.status === undefined) && (
                  <>
                    <button onClick={() => handleApprove(photo.id)}
                      className="font-mono text-white text-[7px] tracking-[0.2em] uppercase bg-oliva/70 px-2 py-1.5 cursor-pointer hover:bg-oliva transition-colors">
                      Aprobar
                    </button>
                    <button onClick={() => handleReject(photo.id)}
                      className="font-mono text-white text-[7px] tracking-[0.2em] uppercase bg-coral/70 px-2 py-1.5 cursor-pointer hover:bg-coral transition-colors">
                      Rechazar
                    </button>
                  </>
                )}
                {confirmId === photo.id ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDelete(photo.id)}
                      className="font-mono text-white text-[8px] tracking-[0.2em] uppercase bg-coral px-3 py-1.5 cursor-pointer hover:bg-coral-oscuro transition-colors">
                      Sí, quitar
                    </button>
                    <button onClick={() => setConfirmId(null)}
                      className="font-mono text-texto-suave text-[8px] tracking-[0.2em] uppercase underline underline-offset-4 hover:text-violeta transition-colors cursor-pointer">
                      No
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmId(photo.id)}
                    className="font-mono text-texto-suave text-[8px] tracking-[0.2em] uppercase underline underline-offset-4 hover:text-coral transition-colors cursor-pointer">
                    Quitar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
