import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type AlertType = 'info' | 'warning' | 'emergency'

type Alert = {
  id: string
  title: string
  desc: string
  type: AlertType
  active: boolean
  createdAt: string
}

const DISMISSED_KEY = 'vettonia_dismissed_alerts'

function getActiveAlerts(): Alert[] {
  try {
    const raw = localStorage.getItem('vettonia_alerts')
    if (!raw) return []
    const all: Alert[] = JSON.parse(raw)
    return all.filter(a => a.active)
  } catch {
    return []
  }
}

function getDismissed(): Set<string> {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function dismissAlert(id: string) {
  const dismissed = getDismissed()
  dismissed.add(id)
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...dismissed]))
}

const typeStyles: Record<AlertType, { bg: string; border: string; icon: string; text: string; dot: string; bar: string }> = {
  info: {
    bg: 'bg-violeta/5',
    border: 'border-violeta/20',
    icon: 'i',
    text: 'text-violeta',
    dot: 'bg-violeta',
    bar: 'bg-violeta',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    icon: '!',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
  },
  emergency: {
    bg: 'bg-coral/10',
    border: 'border-coral/40',
    icon: '!!',
    text: 'text-coral',
    dot: 'bg-coral',
    bar: 'bg-coral',
  },
}

export default function AlertBanner() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  useEffect(() => {
    const active = getActiveAlerts()
    const diss = getDismissed()
    setAlerts(active.filter(a => !diss.has(a.id)))
  }, [])

  const handleDismiss = (id: string) => {
    dismissAlert(id)
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  if (alerts.length === 0) return null

  return (
    <div className="sticky top-0 left-0 right-0 z-[60] flex flex-col">
      <AnimatePresence>
        {alerts.map((alert) => {
          const s = typeStyles[alert.type]
          return (
            <motion.div
              key={alert.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${s.bg} border-b ${s.border} overflow-hidden`}
            >
              <div className={`h-1 ${s.bar}`} />
              <div className="px-4 py-2.5 flex items-center gap-3 max-w-7xl mx-auto">
                <span className={`font-heading text-[10px] font-extrabold tracking-[0.15em] uppercase ${s.text} shrink-0`}>
                  {s.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`font-heading text-xs font-bold tracking-[-0.01em] ${s.text}`}>
                    {alert.title}
                  </span>
                  <span className="font-ui text-texto-suave text-[11px] ml-2">{alert.desc}</span>
                </div>
                <button onClick={() => handleDismiss(alert.id)}
                  className={`font-mono text-[9px] tracking-[0.2em] uppercase ${s.text} opacity-50 hover:opacity-100 transition-opacity shrink-0 cursor-pointer`}>
                  X
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
