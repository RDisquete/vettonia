import { useState, useEffect, useCallback } from 'react'
import { getPageContent, setPageContent, getDefaultContent } from '../../services/content'
import { toast } from 'sonner'
import type { PageContent } from '../../services/content'

type Section = 'hero' | 'manifiesto'

export default function ContentManage() {
  const [section, setSection] = useState<Section>('hero')
  const [content, setContent] = useState<PageContent>(getDefaultContent())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [heroData, manifiestoData] = await Promise.all([
        getPageContent('hero'),
        getPageContent('manifiesto'),
      ])
      setContent(prev => ({
        hero: { ...prev.hero, ...heroData },
        manifiesto: { ...prev.manifiesto, ...manifiestoData },
      }))
      setLoading(false)
    }
    load()
  }, [])

  const updateField = useCallback((section: Section, key: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }))
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    const ok1 = await setPageContent('hero', content.hero as unknown as Record<string, string>)
    const ok2 = await setPageContent('manifiesto', content.manifiesto as unknown as Record<string, string>)
    if (ok1 && ok2) {
      toast.success('Contenido guardado')
    } else {
      toast.error('Error al guardar (guardado en local)')
    }
    setSaving(false)
  }, [content])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="font-mono text-texto-suave text-[10px] tracking-[0.4em] uppercase animate-pulse">Cargando...</span>
      </div>
    )
  }

  const fields = section === 'hero'
    ? [
        { key: 'title1', label: 'Título 1ª línea', hint: 'Texto grande (ej. "Vett")' },
        { key: 'title2', label: 'Título 2ª línea', hint: 'Texto grande (ej. "onia")' },
        { key: 'dates', label: 'Fechas', hint: 'Ej. "14 · 15 · 16"' },
        { key: 'month', label: 'Mes', hint: 'Ej. "agosto"' },
        { key: 'location', label: 'Ubicación', hint: 'Ej. "extremadura"' },
      ]
    : [
        { key: 'line1', label: 'Línea 1', hint: 'Ej. "ESTO NO ES"' },
        { key: 'line2', label: 'Línea 2', hint: 'Ej. "UN FESTIVAL."' },
        { key: 'line3', label: 'Línea 3', hint: 'Ej. "ES UN PLAN."' },
        { key: 'line4', label: 'Línea 4', hint: 'Ej. "EXTREMADURA 2026"' },
        { key: 'subtext', label: 'Texto descriptivo', hint: 'Párrafo bajo el título' },
        { key: 'stat1', label: 'Estadística 1', hint: 'Ej. "3"' },
        { key: 'stat1Label', label: 'Etiqueta estadística 1', hint: 'Ej. "Escenarios"' },
        { key: 'stat2', label: 'Estadística 2', hint: 'Ej. "+48"' },
        { key: 'stat2Label', label: 'Etiqueta estadística 2', hint: 'Ej. "Artistas"' },
      ]

  const sectionContent = content[section] as unknown as Record<string, string>

  return (
    <div className="space-y-6">
      <span className="font-heading text-violeta text-2xl font-extrabold tracking-[-0.06em] block">
        Contenido del homepage
      </span>
      <span className="font-mono text-texto-suave text-[8px] tracking-[0.4em] uppercase block -mt-4">
        Edita los textos del Hero y Manifiesto
      </span>

      <div className="flex gap-2">
        <button onClick={() => setSection('hero')}
          className={`font-mono text-[9px] tracking-[0.3em] uppercase px-5 py-2 border-2 transition-all cursor-pointer ${
            section === 'hero'
              ? 'bg-violeta text-white border-violeta'
              : 'bg-transparent text-violeta border-violeta/30 hover:border-violeta/60'
          }`}
          style={{ clipPath: 'polygon(0 0, 95% 0, 100% 100%, 0 100%)' }}>
          Hero
        </button>
        <button onClick={() => setSection('manifiesto')}
          className={`font-mono text-[9px] tracking-[0.3em] uppercase px-5 py-2 border-2 transition-all cursor-pointer ${
            section === 'manifiesto'
              ? 'bg-coral text-white border-coral'
              : 'bg-transparent text-coral border-coral/30 hover:border-coral/60'
          }`}
          style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)' }}>
          Manifiesto
        </button>
      </div>

      <div className="space-y-4 max-w-xl">
        {fields.map(f => (
          <div key={f.key}>
            <label className="font-mono text-texto-suave text-[8px] tracking-[0.3em] uppercase block mb-1">
              {f.label}
            </label>
            {f.key === 'subtext' ? (
              <textarea value={sectionContent[f.key] || ''}
                onChange={e => updateField(section, f.key, e.target.value)}
                className="font-ui text-sm bg-white border-2 border-violeta/10 px-4 py-3 w-full outline-none focus:border-coral/50 transition-colors resize-none h-24"
              />
            ) : (
              <input value={sectionContent[f.key] || ''}
                onChange={e => updateField(section, f.key, e.target.value)}
                className="font-ui text-sm bg-white border-2 border-violeta/10 px-4 py-3 w-full outline-none focus:border-coral/50 transition-colors"
              />
            )}
            <span className="font-mono text-texto-suave/60 text-[7px] tracking-[0.2em] mt-0.5 block">{f.hint}</span>
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving}
        className="border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-10 pr-6 pt-3 pb-3 cursor-pointer hover:bg-violeta hover:text-white transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
        <span className="font-mono text-violeta text-[10px] tracking-[0.4em] uppercase group-hover:text-white">
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </span>
      </button>
    </div>
  )
}
