import { supabase } from './supabase'
import { HAS_SUPABASE } from './env'
import { getItem, setItem } from '../lib/persistence'
import { getAuthenticatedPass } from './album'
import type { ReactionType, PhotoReaction, PhotoReactionCount } from '../types'

const REACTIONS_KEY = 'photo_reactions'

const REACTION_TYPES: ReactionType[] = ['❤️', '🔥', '🎉']

function getActivePass(): string {
  return getAuthenticatedPass() || ''
}

export async function getPhotoReactions(photoId: string): Promise<PhotoReactionCount[]> {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data } = await supabase
        .from('reactions')
        .select('type, count:type')
        .eq('photo_id', photoId)
      if (data) {
        const counts: Record<string, number> = {}
        for (const r of data) {
          counts[r.type] = (counts[r.type] || 0) + 1
        }
        return REACTION_TYPES.map(type => ({ type, count: counts[type] || 0 }))
      }
    } catch (e) { console.warn('[reactions] getPhotoReactions select', e) }
  }

  const all = getItem<PhotoReaction[]>(REACTIONS_KEY, [])
  const filtered = all.filter(r => r.photoId === photoId)
  return REACTION_TYPES.map(type => ({ type, count: filtered.filter(r => r.type === type).length }))
}

export async function getAllReactions(): Promise<Record<string, PhotoReactionCount[]>> {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data } = await supabase
        .from('reactions')
        .select('photo_id, type')
      if (data) {
        const grouped: Record<string, Record<string, number>> = {}
        for (const r of data) {
          if (!grouped[r.photo_id]) grouped[r.photo_id] = {}
          grouped[r.photo_id][r.type] = (grouped[r.photo_id][r.type] || 0) + 1
        }
        const result: Record<string, PhotoReactionCount[]> = {}
        for (const [photoId, counts] of Object.entries(grouped)) {
          result[photoId] = REACTION_TYPES.map(type => ({ type, count: counts[type] || 0 }))
        }
        return result
      }
    } catch (e) { console.warn('[reactions] getAllReactions select', e) }
  }

  const all = getItem<PhotoReaction[]>(REACTIONS_KEY, [])
  const grouped: Record<string, PhotoReactionCount[]> = {}
  for (const r of all) {
    if (!grouped[r.photoId]) {
      grouped[r.photoId] = REACTION_TYPES.map(t => ({ type: t, count: 0 }))
    }
    const entry = grouped[r.photoId].find(g => g.type === r.type)
    if (entry) entry.count++
  }
  return grouped
}

export async function getUserReactions(): Promise<Record<string, ReactionType[]>> {
  const pass = getActivePass()
  if (!pass) return {}

  if (HAS_SUPABASE && supabase) {
    try {
      const { data } = await supabase
        .from('reactions')
        .select('photo_id, type')
        .eq('pass_number', pass)
      if (data) {
        const grouped: Record<string, ReactionType[]> = {}
        for (const r of data) {
          if (!grouped[r.photo_id]) grouped[r.photo_id] = []
          grouped[r.photo_id].push(r.type as ReactionType)
        }
        return grouped
      }
    } catch (e) { console.warn('[reactions] getUserReactions select', e) }
  }

  const all = getItem<PhotoReaction[]>(REACTIONS_KEY, [])
  const grouped: Record<string, ReactionType[]> = {}
  for (const r of all) {
    if (r.passNumber !== pass) continue
    if (!grouped[r.photoId]) grouped[r.photoId] = []
    grouped[r.photoId].push(r.type as ReactionType)
  }
  return grouped
}

export async function toggleReaction(photoId: string, type: ReactionType): Promise<boolean> {
  const pass = getActivePass()
  const all = getItem<PhotoReaction[]>(REACTIONS_KEY, [])
  const existing = all.find(r => r.photoId === photoId && r.passNumber === pass && r.type === type)

  if (existing) {
    if (pass && HAS_SUPABASE && supabase) {
      try {
        await supabase
          .from('reactions')
          .delete()
          .eq('photo_id', photoId)
          .eq('pass_number', pass)
          .eq('type', type)
      } catch (e) { console.warn('[reactions] toggleReaction delete/insert', e) }
    }
    setItem(REACTIONS_KEY, all.filter(r => r.id !== existing.id))
    return false
  }

  if (pass && HAS_SUPABASE && supabase) {
    try {
      await supabase
        .from('reactions')
        .insert({ id: crypto.randomUUID(), photo_id: photoId, pass_number: pass, type })
    } catch (e) { console.warn('[reactions] toggleReaction insert', e) }
  }

  const reaction: PhotoReaction = {
    id: crypto.randomUUID(),
    photoId,
    passNumber: pass,
    type,
    createdAt: new Date().toISOString(),
  }
  all.push(reaction)
  setItem(REACTIONS_KEY, all)
  return true
}

export { REACTION_TYPES }
