import { supabase } from './supabase'
import { HAS_SUPABASE } from './env'
import { stages as staticStages, allArtists as staticArtists, type Artist, type Stage } from '../data/lineup'

const OVERRIDES_KEY = 'artist_overrides'

type OverrideMap = Record<string, Partial<Artist>>

function getOverrides(): OverrideMap {
  try {
    const raw = localStorage.getItem('vettonia_' + OVERRIDES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveOverrides(overrides: OverrideMap) {
  try { localStorage.setItem('vettonia_' + OVERRIDES_KEY, JSON.stringify(overrides)) } catch {}
}

function staticWithOverrides(): Stage[] {
  const overrides = getOverrides()
  return staticStages.map(s => ({
    ...s,
    artists: s.artists.map(a => overrides[a.slug] ? { ...a, ...overrides[a.slug] } : a),
  }))
}

export async function getPublishedArtists(): Promise<Artist[]> {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data } = await supabase
        .from('lineup_artists')
        .select('slug, name, bio, stage, time, image, genre')
        .eq('published', true)
        .order('stage')
        .order('time')
      if (data && data.length > 0) return data as Artist[]
    } catch {}
  }
  return staticWithOverrides().flatMap(s => s.artists)
}

export async function getPublishedStages(): Promise<Stage[]> {
  const artists = await getPublishedArtists()
  const map: Record<string, Artist[]> = {}
  for (const a of artists) {
    if (!map[a.stage]) map[a.stage] = []
    map[a.stage].push(a)
  }
  const stageOrder = staticStages.map(s => s.name)
  return stageOrder.filter(n => map[n]).map(name => ({ name, artists: map[name] }))
}

export async function getAllArtists(): Promise<(Artist & { published: boolean; updatedAt: string })[]> {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data } = await supabase
        .from('lineup_artists')
        .select('*')
        .order('stage')
        .order('time')
      if (data && data.length > 0) {
        return data.map(a => ({
          slug: a.slug, name: a.name, bio: a.bio, stage: a.stage,
          time: a.time, image: a.image, genre: a.genre,
          published: a.published, updatedAt: a.updated_at,
        }))
      }
    } catch {}
  }
  const overrides = getOverrides()
  return staticArtists.map(a => ({
    ...a,
    ...(overrides[a.slug] || {}),
    published: true,
    updatedAt: '',
  }))
}

export async function getAdminStages(): Promise<{ name: string; artists: (Artist & { published: boolean })[] }[]> {
  const all = await getAllArtists()
  const map: Record<string, (Artist & { published: boolean })[]> = {}
  for (const a of all) {
    if (!map[a.stage]) map[a.stage] = []
    map[a.stage].push(a)
  }
  const stageOrder = staticStages.map(s => s.name)
  return stageOrder.filter(n => map[n]).map(name => ({ name, artists: map[name] }))
}

export async function upsertArtist(artist: Artist & { published?: boolean }): Promise<void> {
  if (HAS_SUPABASE && supabase) {
    try {
      const payload = {
        slug: artist.slug,
        name: artist.name,
        bio: artist.bio,
        stage: artist.stage,
        time: artist.time,
        image: artist.image,
        genre: artist.genre,
        published: artist.published ?? false,
        updated_at: new Date().toISOString(),
      }
      const { error } = await supabase
        .from('lineup_artists')
        .upsert(payload, { onConflict: 'slug' })
      if (!error) return
    } catch {}
  }
  const overrides = getOverrides()
  const existing = staticArtists.find(a => a.slug === artist.slug)
  if (existing) {
    overrides[artist.slug] = { ...overrides[artist.slug], ...artist }
  } else {
    overrides[artist.slug] = artist as Partial<Artist>
  }
  saveOverrides(overrides)
}

export async function deleteArtist(slug: string): Promise<void> {
  if (HAS_SUPABASE && supabase) {
    try {
      await supabase.from('lineup_artists').delete().eq('slug', slug)
    } catch (e) {
      console.warn('deleteArtist Supabase error:', e)
    }
  }
  const overrides = getOverrides()
  delete overrides[slug]
  saveOverrides(overrides)
}

export async function publishArtist(slug: string, publish: boolean): Promise<void> {
  if (HAS_SUPABASE && supabase) {
    try {
      await supabase
        .from('lineup_artists')
        .update({ published: publish, updated_at: new Date().toISOString() })
        .eq('slug', slug)
      return
    } catch {}
  }
}

export async function publishAllArtists(): Promise<number> {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data } = await supabase
        .from('lineup_artists')
        .update({ published: true, updated_at: new Date().toISOString() })
        .eq('published', false)
        .select('slug')
      return data?.length ?? 0
    } catch {}
  }
  const all = await getAllArtists()
  const unpublished = all.filter(a => !a.published)
  if (unpublished.length === 0) return 0
  const overrides = getOverrides()
  for (const a of unpublished) {
    overrides[a.slug] = { ...(overrides[a.slug]), published: true } as Partial<Artist>
  }
  saveOverrides(overrides)
  return unpublished.length
}

export async function seedFromStatic(): Promise<number> {
  if (!(HAS_SUPABASE && supabase)) return 0
  let count = 0
  for (const artist of staticArtists) {
    try {
      const { error } = await supabase
        .from('lineup_artists')
        .upsert({
          slug: artist.slug,
          name: artist.name,
          bio: artist.bio,
          stage: artist.stage,
          time: artist.time,
          image: artist.image,
          genre: artist.genre,
          published: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'slug', ignoreDuplicates: true })
      if (!error) count++
    } catch {}
  }
  return count
}

export async function getArtistBySlugFromService(slug: string): Promise<Artist | undefined> {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data } = await supabase
        .from('lineup_artists')
        .select('slug, name, bio, stage, time, image, genre')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle()
      if (data) return data as Artist
    } catch {}
  }
  const a = staticArtists.find(x => x.slug === slug)
  if (!a) return undefined
  const overrides = getOverrides()
  return overrides[slug] ? { ...a, ...overrides[slug] } : a
}
