import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getPhotos } from '../../services/album'
import { getPublishedArtists } from '../../services/lineup'
import { getAlerts } from '../../services/alerts'
import type { UploadedPhoto } from '../../types'
import SEO from '../../components/SEO'
import { DashboardSkeleton } from '../../components/Skeleton'

export default function Dashboard() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [artistCount, setArtistCount] = useState(0)
  const [pendingPhotos, setPendingPhotos] = useState(0)
  const [unreadAlerts, setUnreadAlerts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const [allPhotos, artists, alerts] = await Promise.all([
        getPhotos(),
        getPublishedArtists(),
        getAlerts('admin').catch(() => []),
      ])
      setPhotos(allPhotos)
      setArtistCount(artists.length)
      setPendingPhotos(allPhotos.filter(p => p.status === 'pending').length)
      setUnreadAlerts(alerts.filter(a => !a.read).length)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const uniqueAuthors = useMemo(
    () => (photos.length > 0 ? new Set(photos.map((p) => p.author)).size : 0),
    [photos]
  )

  const stats = useMemo(
    () => [
      { label: 'Artistas', value: artistCount, path: '/admin/lineup' },
      { label: 'Fotos', value: photos.length, path: '/admin/gallery' },
      { label: 'Pendientes', value: pendingPhotos, path: '/admin/gallery', highlight: pendingPhotos > 0 },
      { label: 'Autores', value: uniqueAuthors, path: '/admin/gallery' },
    ],
    [artistCount, photos.length, pendingPhotos, uniqueAuthors]
  )

  const recentPhotos = useMemo(
    () => [...photos].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 4),
    [photos]
  )

  if (loading) return <div><SEO title="Panel de control" description="Panel de administración de Vettonia." noindex /><DashboardSkeleton /></div>

  if (error) return (
    <div>
      <SEO title="Panel de control" description="Panel de administración de Vettonia." noindex />
      <p className="font-heading text-violeta text-2xl font-bold tracking-[-0.04em]">Panel de control</p>
      <div className="mt-6 border-2 border-dashed border-coral/30 p-8 text-center bg-white/40">
        <p className="font-ui text-texto-suave text-sm">No se pudieron cargar los datos.</p>
        <button onClick={load}
          className="font-mono text-coral text-[9px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-violeta transition-colors mt-2 inline-block cursor-pointer">
          Reintentar
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <SEO title="Panel de control" description="Panel de administración de Vettonia." noindex />
      <p className="font-heading text-violeta text-2xl font-bold tracking-[-0.04em]">Panel de control</p>
      <p className="font-ui text-texto-suave text-xs mt-1">Vettonia 2027 — {new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {stats.map((s) => (
          <Link key={s.label} to={s.path}
            className={`border-2 p-4 bg-white hover:border-coral/50 transition-colors ${s.highlight ? 'border-coral/40' : 'border-violeta/10'}`}>
            <p className={`font-heading text-3xl sm:text-4xl font-bold tracking-[-0.04em] ${s.highlight ? 'text-coral' : 'text-violeta'}`}>{s.value}</p>
            <p className="font-mono text-texto-suave text-[7px] tracking-[0.3em] uppercase mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      {unreadAlerts > 0 && (
        <Link to="/admin/alerts"
          className="mt-4 block border border-coral/20 bg-coral/5 p-3 hover:bg-coral/10 transition-colors">
          <p className="font-mono text-coral text-[8px] tracking-[0.2em] uppercase">
            {unreadAlerts} alerta{unreadAlerts !== 1 ? 's' : ''} sin leer
          </p>
        </Link>
      )}

      {photos.length > 0 && (
        <div className="mt-6">
          <p className="font-heading text-violeta text-lg font-bold tracking-[-0.04em] mb-3">Últimas subidas</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentPhotos.map((photo) => (
              <div key={photo.id} className="border border-violeta/10 bg-white overflow-hidden">
                <img src={photo.dataUrl} alt={`Foto de ${photo.author || 'usuario'}`} loading="lazy" decoding="async" className="w-full aspect-square object-cover" />
                <div className="p-2">
                  <p className="font-mono text-violeta text-[7px] tracking-[0.2em] uppercase truncate">{photo.author}</p>
                  {photo.caption && (
                    <p className="font-ui text-texto-suave text-[10px] truncate mt-0.5">&ldquo;{photo.caption}&rdquo;</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {photos.length === 0 && (
        <div className="mt-6 border-2 border-dashed border-violeta/20 p-8 text-center bg-white/40">
          <p className="font-ui text-texto-suave text-sm">No hay fotos subidas todavía.</p>
          <Link to="/upload"
            className="font-mono text-coral text-[9px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-violeta transition-colors mt-2 inline-block">
            Subir la primera foto
          </Link>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Link to="/admin/gallery"
          className="border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-6 pr-4 pt-4 pb-4 hover:bg-violeta hover:border-violeta transition-all group"
          style={{ clipPath: 'polygon(3% 0, 100% 0, 97% 100%, 0 100%)' }}>
          <span className="font-heading text-violeta text-lg font-extrabold tracking-[-0.04em] block group-hover:text-white">Galería</span>
          <span className="font-mono text-texto-suave text-[7px] tracking-[0.3em] uppercase group-hover:text-white/60">Gestionar fotos</span>
        </Link>
        <Link to="/admin/lineup"
          className="border-l-4 border-t-2 border-r-2 border-b-2 border-coral/30 pl-6 pr-4 pt-4 pb-4 hover:bg-coral hover:border-coral transition-all group"
          style={{ clipPath: 'polygon(3% 0, 100% 0, 97% 100%, 0 100%)' }}>
          <span className="font-heading text-coral text-lg font-extrabold tracking-[-0.04em] block group-hover:text-white">Cartel</span>
          <span className="font-mono text-texto-suave text-[7px] tracking-[0.3em] uppercase group-hover:text-white/60">{artistCount} artistas</span>
        </Link>
      </div>
    </div>
  )
}
