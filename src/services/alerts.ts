import { supabase } from './supabase'
import { HAS_SUPABASE } from './env'
import { getItem, setItem } from '../lib/persistence'
import type { Alert } from '../types'

const ALERTS_KEY = 'alerts'

export async function getAlerts(userId: string): Promise<Alert[]> {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        const mapped: Alert[] = data.map(a => ({
          id: a.id,
          userId: a.user_id,
          type: a.type,
          message: a.message,
          read: a.read,
          createdAt: a.created_at,
        }))
        setItem(ALERTS_KEY, mapped)
        return mapped
      }
    } catch {}
  }
  const all = getItem<Alert[]>(ALERTS_KEY, [])
  return all.filter(a => a.userId === userId)
}

export async function addAlert(
  userId: string,
  type: Alert['type'],
  message: string
): Promise<Alert> {
  const alert: Alert = {
    id: crypto.randomUUID(),
    userId,
    type,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  }

  if (HAS_SUPABASE && supabase) {
    try {
      const { error } = await supabase.from('alerts').insert({
        id: alert.id,
        user_id: alert.userId,
        type: alert.type,
        message: alert.message,
        read: alert.read,
        created_at: alert.createdAt,
      })
      if (!error) {
        const all = getItem<Alert[]>(ALERTS_KEY, [])
        all.unshift(alert)
        setItem(ALERTS_KEY, all)
        return alert
      }
    } catch {}
  }

  const all = getItem<Alert[]>(ALERTS_KEY, [])
  all.unshift(alert)
  setItem(ALERTS_KEY, all)
  return alert
}

export async function markAlertRead(id: string): Promise<void> {
  if (HAS_SUPABASE && supabase) {
    try {
      await supabase.from('alerts').update({ read: true }).eq('id', id)
    } catch {}
  }
  const all = getItem<Alert[]>(ALERTS_KEY, [])
  const alert = all.find(a => a.id === id)
  if (alert) {
    alert.read = true
    setItem(ALERTS_KEY, all)
  }
}

export async function deleteAlert(id: string): Promise<void> {
  if (HAS_SUPABASE && supabase) {
    try {
      await supabase.from('alerts').delete().eq('id', id)
    } catch {}
  }
  const all = getItem<Alert[]>(ALERTS_KEY, []).filter(a => a.id !== id)
  setItem(ALERTS_KEY, all)
}
