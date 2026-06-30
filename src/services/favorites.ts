import { supabase } from './supabase'
import { HAS_SUPABASE } from './env'
import { getItem, setItem } from '../lib/persistence'
import { getAuthenticatedPass } from './album'
import { setProgress } from './achievements'

const FAVORITES_KEY = 'favorite_artists'

function getActivePass(): string {
  return getAuthenticatedPass() || ''
}

export async function getFavorites(): Promise<Set<string>> {
  const pass = getActivePass()

  if (pass && HAS_SUPABASE && supabase) {
    try {
      const { data } = await supabase
        .from('favorites')
        .select('artist_slug')
        .eq('pass_number', pass)
      if (data) {
        const slugs = data.map(f => f.artist_slug)
        setItem(FAVORITES_KEY, slugs)
        setProgress('melomano', slugs.length)
        return new Set(slugs)
      }
    } catch (e) { console.warn('[favorites] getFavorites select', e) }
  }

  const cached = getItem<string[]>(FAVORITES_KEY, [])
  setProgress('melomano', cached.length)
  return new Set(cached)
}

export async function toggleFavorite(slug: string): Promise<boolean> {
  const favorites = await getFavorites()
  const pass = getActivePass()
  const isFav = favorites.has(slug)

  if (isFav) {
    if (pass && HAS_SUPABASE && supabase) {
      try {
        await supabase
          .from('favorites')
          .delete()
          .eq('artist_slug', slug)
          .eq('pass_number', pass)
      } catch (e) { console.warn('[favorites] toggleFavorite delete', e) }
    }
    const stored = getItem<string[]>(FAVORITES_KEY, [])
    const updated = stored.filter(s => s !== slug)
    setItem(FAVORITES_KEY, updated)
    setProgress('melomano', updated.length)
    return false
  }

  if (pass && HAS_SUPABASE && supabase) {
    try {
      await supabase
        .from('favorites')
        .insert({ id: crypto.randomUUID(), artist_slug: slug, pass_number: pass })
    } catch (e) { console.warn('[favorites] toggleFavorite insert', e) }
  }

  const stored = getItem<string[]>(FAVORITES_KEY, [])
  if (!stored.includes(slug)) stored.push(slug)
  setItem(FAVORITES_KEY, stored)
  setProgress('melomano', stored.length)
  return true
}
