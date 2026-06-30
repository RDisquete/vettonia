import { useState } from 'react'
import SEO from '../../components/SEO'

const STORAGE_KEY = 'vettonia_alerts'

type AlertType = 'info' | 'warning' | 'emergency'

type Alert = {
  id: string
  title: string
  desc: string
  type: AlertType
  active: boolean
  createdAt: string
}

function getAlerts(): Alert[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAlerts(alerts: Alert[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts))
}

const defaults: Alert[] = [
  { id: '1', title: 'TORMENTA', desc: 'Pinta mal el viernes por la tarde. Mejor prepararse.', type: 'warning', active: true, createdAt: '2027-06-01' },
  { id: '2', title: 'CAMBIO DE HORARIO', desc: 'El Escenario B abre 30 min más tarde el sábado.', type: 'info', active: true, createdAt: '2027-06-05' },
  { id: '3', title: 'AGOTADO', desc: 'Los abonos de día para el domingo vuelan. Quedan pocos.', type: 'warning', active: false, createdAt: '2027-06-10' },
]

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const stored = getAlerts()
    return stored.length > 0 ? stored : defaults
  })
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [type, setType] = useState<AlertType>('info')
  const [editing, setEditing] = useState<string | null>(null)

  const handleSave = () => {
    if (!title.trim() || !desc.trim()) return
    let updated: Alert[]
    if (editing) {
      updated = alerts.map((a) => a.id === editing ? { ...a, title: title.trim(), desc: desc.trim(), type } : a)
    } else {
      const newAlert: Alert = {
        id: crypto.randomUUID(),
        title: title.trim(),
        desc: desc.trim(),
        type,
        active: true,
        createdAt: new Date().toISOString(),
      }
      updated = [newAlert, ...alerts]
    }
    saveAlerts(updated)
    setAlerts(updated)
    setTitle('')
    setDesc('')
    setType('info')
    setShowForm(false)
    setEditing(null)
  }

  const handleEdit = (a: Alert) => {
    setTitle(a.title)
    setDesc(a.desc)
    setType(a.type)
    setEditing(a.id)
    setShowForm(true)
  }

  const handleToggle = (id: string) => {
    const updated = alerts.map((a) => a.id === id ? { ...a, active: !a.active } : a)
    saveAlerts(updated)
    setAlerts(updated)
  }

  const handleDelete = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id)
    saveAlerts(updated)
    setAlerts(updated)
  }

  return (
    <div>
      <SEO title="Alertas — Admin" description="Gestión de alertas de Vettonia." noindex />
      <div className="flex items-center justify-between mb-6">
        <p className="font-heading text-violeta text-2xl font-bold tracking-[-0.04em]">Alertas</p>
        <button onClick={() => { setShowForm(true); setEditing(null); setTitle(''); setDesc('') }}
          className="border-l-4 border-t-2 border-r-2 border-b-2 border-violeta/30 pl-6 pr-4 pt-2 pb-2 cursor-pointer hover:bg-violeta hover:border-violeta transition-all group"
          style={{ clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
          <span className="font-mono text-violeta text-[9px] tracking-[0.4em] uppercase group-hover:text-white">+ Nueva alerta</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="border-2 border-coral/30 p-4 mb-6 bg-white">
          <p className="font-heading text-violeta text-sm font-bold tracking-[-0.02em] mb-3">
            {editing ? 'Editar alerta' : 'Nueva alerta'}
          </p>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            className="font-heading text-violeta text-sm font-bold tracking-[-0.02em] bg-transparent border-2 border-violeta/20 px-3 py-2 w-full outline-none placeholder:text-black/30 mb-3"
            placeholder="Título (ej: TORMENTA)" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
            className="font-ui text-texto text-sm bg-transparent border-2 border-violeta/20 px-3 py-2 w-full outline-none placeholder:text-black/30 resize-none h-16"
            placeholder="Descripción de la alerta..." />
          <div className="flex gap-3 mt-3">
            {(['info', 'warning', 'emergency'] as AlertType[]).map(t => (
              <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="alert-type" value={t} checked={type === t}
                  onChange={() => setType(t)} className="accent-violeta" />
                <span className={`font-mono text-[8px] tracking-[0.2em] uppercase ${
                  t === 'emergency' ? 'text-coral' : t === 'warning' ? 'text-amber-600' : 'text-violeta'
                }`}>{t}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleSave}
              className="font-mono text-white text-[8px] tracking-[0.3em] uppercase bg-violeta px-4 py-2 cursor-pointer hover:bg-violeta/80 transition-colors">
              {editing ? 'Guardar' : 'Crear'}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null) }}
              className="font-mono text-black/40 text-[8px] tracking-[0.3em] uppercase underline underline-offset-4 hover:text-violeta transition-colors cursor-pointer">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {alerts.length === 0 ? (
        <div className="border-2 border-dashed border-violeta/20 p-8 text-center bg-white/40">
          <p className="font-ui text-texto-suave text-sm">No hay alertas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <div key={a.id}
              className={`border-2 p-4 bg-white flex items-center justify-between gap-4 ${a.active ? 'border-coral/30' : 'border-violeta/10 opacity-50'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-heading text-violeta text-sm font-bold tracking-[-0.02em]">{a.title}</p>
                  <span className={`font-mono text-[7px] tracking-[0.2em] uppercase px-1.5 py-0.5 ${
                    a.type === 'emergency' ? 'bg-coral/15 text-coral' :
                    a.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-violeta/10 text-violeta'
                  }`}>{a.type}</span>
                  <span className={`font-mono text-[7px] tracking-[0.3em] uppercase ${a.active ? 'text-coral' : 'text-black/40'}`}>
                    {a.active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <p className="font-ui text-texto text-xs mt-1">{a.desc}</p>
                <span className="font-mono text-black/30 text-[6px] tracking-[0.15em] mt-1 block">
                  {new Date(a.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => handleToggle(a.id)}
                  className={`font-mono text-[7px] tracking-[0.2em] uppercase cursor-pointer transition-colors ${a.active ? 'text-black/40 hover:text-violeta' : 'text-coral hover:text-coral'}`}>
                  {a.active ? 'Desactivar' : 'Activar'}
                </button>
                <button onClick={() => handleEdit(a)}
                  className="font-mono text-black/30 text-[7px] tracking-[0.2em] uppercase underline underline-offset-4 hover:text-violeta transition-colors cursor-pointer">
                  Editar
                </button>
                <button onClick={() => handleDelete(a.id)}
                  className="font-mono text-coral/60 text-[7px] tracking-[0.2em] uppercase underline underline-offset-4 hover:text-coral transition-colors cursor-pointer">
                  Quitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
