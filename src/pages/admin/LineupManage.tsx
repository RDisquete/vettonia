import { useState, useEffect, useCallback, useMemo } from 'react'
import { getAllArtists, upsertArtist, deleteArtist as delArtist, publishArtist, publishAllArtists, seedFromStatic } from '../../services/lineup'
import type { Artist } from '../../data/lineup'
import SEO from '../../components/SEO'
import { toast } from 'sonner'

const genres = ['Electrónica', 'Indie Pop', 'Flamenco & Fusión', 'Rock', 'Hip Hop', 'Pop', 'Metal', 'R&B', 'Punk', 'Alternativo', 'Shoegaze & Dream', 'World & Fusión', 'Folk & Cantautor', 'Punk & Garage', 'Metal & Stoner', 'Hip Hop & Rap']

const stageNames = ['Todas', 'Escenario A', 'Escenario B', 'Escenario C']

type Field = keyof Pick<Artist, 'name' | 'bio' | 'time' | 'genre' | 'image' | 'stage'>
const fields: { key: Field; label: string; multiline?: boolean; type?: string }[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'stage', label: 'Escenario' },
  { key: 'time', label: 'Horario' },
  { key: 'genre', label: 'Género' },
  { key: 'image', label: 'URL de imagen' },
  { key: 'bio', label: 'Bio', multiline: true },
]

export default function LineupManage() {
  const [artists, setArtists] = useState<(Artist & { published: boolean; updatedAt: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStage, setFilterStage] = useState('Todas')
  const [filterGenre, setFilterGenre] = useState('Todas')
  const [selected, setSelected] = useState<string | null>(null)
  const [preview, setPreview] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [seeding, setSeeding] = useState(false)

  const emptyForm: Partial<Artist> = { name: '', bio: '', time: '', genre: genres[0], image: '', stage: 'Escenario A' }
  const [form, setForm] = useState<Partial<Artist>>({ ...emptyForm })
  const [dirty, setDirty] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const all = await getAllArtists()
    setArtists(all)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    let list = artists
    if (preview) list = list.filter(a => a.published)
    if (filterStage !== 'Todas') list = list.filter(a => a.stage === filterStage)
    if (filterGenre !== 'Todas') list = list.filter(a => a.genre === filterGenre)
    return list
  }, [artists, preview, filterStage, filterGenre])

  const draftCount = useMemo(() => artists.filter(a => !a.published).length, [artists])

  const openEditor = (slug: string) => {
    setAdding(false)
    const a = artists.find(x => x.slug === slug)
    if (!a) return
    setSelected(slug)
    setForm({ name: a.name, bio: a.bio, time: a.time, genre: a.genre, image: a.image, stage: a.stage })
    setDirty(false)
  }

  const openNew = () => {
    setSelected(null)
    setAdding(true)
    setForm({ ...emptyForm })
    setDirty(false)
  }

  const closeEditor = () => {
    setSelected(null)
    setAdding(false)
    setForm({ ...emptyForm })
    setDirty(false)
    setConfirmDelete(null)
  }

  const handleSave = async () => {
    if (!form.name || !form.slug && !adding) return
    if (adding && !form.slug) return
    const slug = adding ? form.slug!.toLowerCase().replace(/[^a-z0-9-]/g, '-') : selected!
    if (adding && artists.some(a => a.slug === slug)) {
      toast.error('Ya existe un artista con ese slug')
      return
    }
    await upsertArtist({ slug, name: form.name || '', bio: form.bio || '', stage: form.stage || 'Escenario A', time: form.time || '', image: form.image || '', genre: form.genre || '' })
    toast.success(adding ? 'Artista creado' : 'Artista actualizado')
    closeEditor()
    await load()
  }

  const handleDelete = async (slug: string) => {
    await delArtist(slug)
    toast.success('Artista eliminado')
    setConfirmDelete(null)
    if (selected === slug) closeEditor()
    await load()
  }

  const handlePublish = async (slug: string, publish: boolean) => {
    await publishArtist(slug, publish)
    toast.success(publish ? 'Artista publicado' : 'Artista despublicado')
    await load()
  }

  const handlePublishAll = async () => {
    const count = await publishAllArtists()
    toast.success(`${count} artista${count !== 1 ? 's' : ''} publicado${count !== 1 ? 's' : ''}`)
    await load()
  }

  const handleSeed = async () => {
    if (!window.confirm('¿Sincronizar todos los artistas estáticos a Supabase? Los existentes no se sobrescribirán.')) return
    setSeeding(true)
    const count = await seedFromStatic()
    toast.success(`${count} artista${count !== 1 ? 's' : ''} sincronizado${count !== 1 ? 's' : ''}`)
    setSeeding(false)
    await load()
  }

  return (
    <div>
      <SEO title="Cartel — Admin" description="Gestión del cartel de Vettonia." noindex />
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="font-heading text-violeta text-2xl font-bold tracking-[-0.04em]">Cartel</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase">{filtered.length} artistas</span>
          {draftCount > 0 && (
            <button onClick={handlePublishAll}
              className="font-mono text-[7px] tracking-[0.2em] uppercase px-3 py-1.5 border-2 border-coral/40 text-coral hover:bg-coral hover:text-white transition-all cursor-pointer">
              Publicar {draftCount} borrador{draftCount !== 1 ? 'es' : ''}
            </button>
          )}
          <button onClick={openNew}
            className="font-mono text-[7px] tracking-[0.2em] uppercase px-3 py-1.5 border-2 border-violeta/30 text-violeta hover:bg-violeta hover:text-white transition-all cursor-pointer">
            + Nuevo artista
          </button>
          <button onClick={() => setPreview(p => !p)}
            className={`font-mono text-[7px] tracking-[0.2em] uppercase px-3 py-1.5 border-2 transition-all cursor-pointer ${preview ? 'bg-coral text-white border-coral' : 'border-violeta/20 text-texto hover:border-violeta/40'}`}>
            {preview ? 'Vista previa' : 'Editar todos'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {stageNames.map(s => (
          <button key={s} onClick={() => setFilterStage(s)}
            className={`font-mono text-[8px] tracking-[0.2em] uppercase px-3 py-1.5 border cursor-pointer transition-all ${filterStage === s ? 'bg-violeta text-white border-violeta' : 'bg-white text-texto border-violeta/20 hover:border-violeta/40'}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {genres.map(g => (
          <button key={g} onClick={() => setFilterGenre(g)}
            className={`font-mono text-[7px] tracking-[0.2em] uppercase px-2 py-1 border cursor-pointer transition-all ${filterGenre === g ? 'bg-coral text-white border-coral' : 'bg-white text-texto-suave border-violeta/10 hover:border-coral/30'}`}>
            {g}
          </button>
        ))}
      </div>

      {(selected || adding) && (
        <div className="border-2 border-coral/30 p-4 mb-6 bg-white relative">
          <button onClick={closeEditor}
            className="absolute top-2 right-2 font-mono text-black/30 text-[8px] cursor-pointer hover:text-coral transition-colors">
            ✕
          </button>

          <div className="flex gap-4 flex-wrap sm:flex-nowrap">
            {adding && (
              <div className="w-20 h-28 shrink-0 border border-dashed border-violeta/20 flex items-center justify-center bg-violeta/3">
                <span className="font-mono text-texto-suave text-[6px] tracking-[0.2em] uppercase text-center">Nuevo</span>
              </div>
            )}
            {!adding && (
              <img src={form.image || artists.find(a => a.slug === selected)?.image || ''} alt="Foto del artista" loading="lazy" decoding="async"
                className="w-20 h-28 object-cover shrink-0 border border-violeta/10" />
            )}

            <div className="flex-1 space-y-3 min-w-0">
              {fields.map(({ key, label, multiline, type }) => (
                <div key={key}>
                  <label className="font-mono text-black/40 text-[7px] tracking-[0.3em] uppercase block mb-1">{label}</label>
                  {multiline ? (
                    <textarea value={form[key] as string || ''} rows={3}
                      onChange={(e) => { setForm(f => ({ ...f, [key]: e.target.value })); setDirty(true) }}
                      className="font-ui text-violeta text-sm bg-transparent border-2 border-violeta/10 px-3 py-2 w-full outline-none focus:border-coral/50 transition-colors resize-none" />
                  ) : key === 'genre' ? (
                    <select value={form.genre || ''}
                      onChange={(e) => { setForm(f => ({ ...f, genre: e.target.value })); setDirty(true) }}
                      className="font-mono text-violeta text-sm bg-transparent border-2 border-violeta/10 px-3 py-2 w-full outline-none focus:border-coral/50 transition-colors">
                      {genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  ) : key === 'stage' ? (
                    <select value={form.stage || 'Escenario A'}
                      onChange={(e) => { setForm(f => ({ ...f, stage: e.target.value })); setDirty(true) }}
                      className="font-mono text-violeta text-sm bg-transparent border-2 border-violeta/10 px-3 py-2 w-full outline-none focus:border-coral/50 transition-colors">
                      {['Escenario A', 'Escenario B', 'Escenario C'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : adding && key === 'name' ? (
                    <div className="flex gap-2">
                      <input type="text" value={form.slug || ''} placeholder="SLUG"
                        onChange={(e) => { const s = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''); setForm(f => ({ ...f, slug: s })); setDirty(true) }}
                        className="font-ui text-violeta text-sm bg-transparent border-2 border-violeta/10 px-3 py-2 w-28 outline-none focus:border-coral/50 transition-colors uppercase tracking-[0.15em]" />
                      <input type="text" value={form.name || ''}
                        onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setDirty(true) }}
                        className="font-ui text-violeta text-sm bg-transparent border-2 border-violeta/10 px-3 py-2 flex-1 outline-none focus:border-coral/50 transition-colors" />
                    </div>
                  ) : (
                    <input type={type || 'text'} value={form[key] as string || ''}
                      onChange={(e) => { setForm(f => ({ ...f, [key]: e.target.value })); setDirty(true) }}
                      className="font-ui text-violeta text-sm bg-transparent border-2 border-violeta/10 px-3 py-2 w-full outline-none focus:border-coral/50 transition-colors" />
                  )}
                </div>
              ))}
              {!adding && (
                <div className="font-mono text-texto-suave text-[7px] tracking-[0.15em]">
                  Slug: {selected} · {artists.find(a => a.slug === selected)?.published ? 'Publicado' : 'Borrador'}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={!dirty && !adding}
                  className={`font-mono text-[9px] tracking-[0.3em] uppercase px-6 py-2 border-2 transition-all cursor-pointer ${dirty || adding ? 'border-coral text-coral hover:bg-coral hover:text-white' : 'border-violeta/10 text-black/20'}`}
                  style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
                  {adding ? 'Crear' : 'Guardar'}
                </button>
                {!adding && (
                  <>
                    <button onClick={() => handlePublish(selected!, !artists.find(a => a.slug === selected)?.published)}
                      className="font-mono text-[8px] tracking-[0.2em] uppercase underline underline-offset-4 hover:text-coral transition-colors cursor-pointer">
                      {artists.find(a => a.slug === selected)?.published ? 'Despublicar' : 'Publicar'}
                    </button>
                    <button onClick={() => setConfirmDelete(selected!)}
                      className="font-mono text-[8px] tracking-[0.2em] uppercase underline underline-offset-4 hover:text-coral transition-colors cursor-pointer">
                      Eliminar
                    </button>
                  </>
                )}
              </div>
              {confirmDelete && (
                <div className="flex items-center gap-3 pt-2 border-t border-coral/20">
                  <span className="font-mono text-coral text-[8px] tracking-[0.2em] uppercase">¿Eliminar?</span>
                  <button onClick={() => handleDelete(confirmDelete)}
                    className="font-mono text-white text-[8px] tracking-[0.2em] uppercase bg-coral px-3 py-1.5 cursor-pointer hover:bg-coral/80 transition-colors">
                    Sí
                  </button>
                  <button onClick={() => setConfirmDelete(null)}
                    className="font-mono text-texto-suave text-[8px] tracking-[0.2em] uppercase underline underline-offset-4 hover:text-violeta transition-colors cursor-pointer">
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="border-2 border-violeta/10 p-8 bg-white">
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-violeta/5" />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-violeta/10">
          {filtered.map((a, i) => (
            <div key={a.slug}
              className={`flex items-center gap-3 px-4 py-2.5 border-b border-violeta/5 last:border-0 hover:bg-violeta/5 transition-colors ${selected === a.slug || adding ? 'bg-violeta/10' : ''} ${preview && !a.published ? 'opacity-30' : ''}`}>
              <span className="font-mono text-black/30 text-[7px] w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <img src={a.image} alt={`Foto de ${a.name}`} loading="lazy" decoding="async" className="w-7 h-9 object-cover shrink-0 border border-violeta/5" />
              <span className="font-heading text-violeta text-xs font-bold flex-1 truncate">{a.name}</span>
              <span className={`font-mono text-[6px] tracking-[0.15em] uppercase px-1.5 py-0.5 border ${a.published ? 'border-oliva/30 text-oliva' : 'border-coral/30 text-coral'}`}>
                {a.published ? 'Publicado' : 'Borrador'}
              </span>
              <span className="font-mono text-texto-suave text-[7px] tracking-[0.15em] uppercase hidden sm:block">{a.stage}</span>
              <span className="font-mono text-texto text-[8px]">{a.time}</span>
              <span className="font-mono text-black/40 text-[7px] tracking-widest uppercase hidden md:block">{a.genre}</span>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEditor(a.slug)}
                  className="font-mono text-[6px] tracking-[0.15em] uppercase px-2 py-1 border border-violeta/15 hover:border-violeta/40 text-texto hover:text-violeta transition-all cursor-pointer">
                  Editar
                </button>
                <button onClick={() => handlePublish(a.slug, !a.published)}
                  className={`font-mono text-[6px] tracking-[0.15em] uppercase px-2 py-1 border transition-all cursor-pointer ${a.published ? 'border-oliva/20 text-oliva hover:bg-oliva/5' : 'border-coral/20 text-coral hover:bg-coral/5'}`}>
                  {a.published ? '✓' : 'Pub'}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="font-ui text-texto-suave text-sm p-8 text-center">
              {preview ? 'No hay artistas publicados con esos filtros.' : 'No hay artistas con esos filtros.'}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <button onClick={handleSeed} disabled={seeding}
          className="font-mono text-[7px] tracking-[0.2em] uppercase px-3 py-2 border border-violeta/20 text-texto hover:border-violeta/40 transition-all cursor-pointer">
          {seeding ? 'Sincronizando...' : 'Sincronizar datos estáticos → Supabase'}
        </button>
        {preview && (
          <p className="font-mono text-coral text-[7px] tracking-[0.2em] uppercase">Vista previa — solo artistas publicados</p>
        )}
      </div>
    </div>
  )
}
