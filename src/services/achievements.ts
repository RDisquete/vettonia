import { getItem, setItem, getRaw } from '../lib/persistence'
import type { AchievementDef } from '../types'

const STATE_KEY = 'achievements_state'
const PROGRESS_KEY = 'achievement_progress'
const STAGES_KEY = 'viewed_stages'

export const ALL_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'veterano', label: 'Veterano', description: 'Código introducido', icon: '🏅', target: 1 },
  { id: 'fotografo', label: 'Fotógrafo', description: '3+ fotos subidas', icon: '📸', target: 3 },
  { id: 'famoso', label: 'Famoso', description: 'Primer mensaje en el muro', icon: '💬', target: 1 },
  { id: 'melomano', label: 'Melómano', description: '5+ artistas marcados', icon: '🎵', target: 5 },
  { id: 'explorador', label: 'Explorador', description: 'Visita los 3 escenarios', icon: '🌍', target: 3 },
  { id: 'influencer', label: 'Influencer', description: '5+ ❤️ en el álbum', icon: '🔥', target: 1 },
]

function getState(): Record<string, { unlocked: boolean; progress: number }> {
  return getItem<Record<string, { unlocked: boolean; progress: number }>>(STATE_KEY, {})
}

function saveState(state: Record<string, { unlocked: boolean; progress: number }>) {
  setItem(STATE_KEY, state)
}

export function getProgress(id: string): number {
  return getItem<Record<string, number>>(PROGRESS_KEY, {})[id] || 0
}

export function setProgress(id: string, value: number) {
  const all = getItem<Record<string, number>>(PROGRESS_KEY, {})
  all[id] = value
  setItem(PROGRESS_KEY, all)
}

export function incrementProgress(id: string, by = 1) {
  setProgress(id, getProgress(id) + by)
}

export function getViewedStages(): string[] {
  return getItem<string[]>(STAGES_KEY, [])
}

export function trackStageView(stageName: string) {
  const viewed = getViewedStages()
  if (!viewed.includes(stageName)) {
    viewed.push(stageName)
    setItem(STAGES_KEY, viewed)
    setProgress('explorador', viewed.length)
  }
}

export function getAchievements(): (AchievementDef & { unlocked: boolean; progress: number })[] {
  const state = getState()
  const progress = getItem<Record<string, number>>(PROGRESS_KEY, {})
  return ALL_ACHIEVEMENTS.map(def => ({
    ...def,
    unlocked: state[def.id]?.unlocked || false,
    progress: Math.max(state[def.id]?.progress || 0, progress[def.id] || 0),
  }))
}

export function refreshAchievements(overrides?: Partial<Record<string, { unlocked: boolean; progress: number }>>): (AchievementDef & { unlocked: boolean; progress: number })[] {
  const state = getState()
  const progress = getItem<Record<string, number>>(PROGRESS_KEY, {})

  const unlockedKey = getRaw('album_unlocked')
  const authPass = getRaw('auth_pass')
  if (unlockedKey === 'true' || authPass !== null) {
    state.veterano = { unlocked: true, progress: 1 }
  }

  if (overrides) {
    for (const [id, val] of Object.entries(overrides)) {
      if (val) state[id] = val
    }
  }

  for (const def of ALL_ACHIEVEMENTS) {
    const p = progress[def.id] || 0
    const current = state[def.id]
    if (p >= def.target && !current?.unlocked) {
      state[def.id] = { unlocked: true, progress: p }
    }
  }

  saveState(state)
  return ALL_ACHIEVEMENTS.map(def => ({
    ...def,
    unlocked: state[def.id]?.unlocked || false,
    progress: Math.max(state[def.id]?.progress || 0, progress[def.id] || 0),
  }))
}

export function isUnlocked(id: string): boolean {
  return getState()[id]?.unlocked || false
}
