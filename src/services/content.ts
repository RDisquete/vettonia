import { supabase } from './supabase'
import { HAS_SUPABASE } from './env'
import { getItem, setItem } from '../lib/persistence'

export interface PageContent {
  hero: {
    title1: string
    title2: string
    dates: string
    month: string
    location: string
  }
  manifiesto: {
    line1: string
    line2: string
    line3: string
    line4: string
    subtext: string
    stat1: string
    stat1Label: string
    stat2: string
    stat2Label: string
  }
}

const DEFAULT_CONTENT: PageContent = {
  hero: {
    title1: 'Vett',
    title2: 'onia',
    dates: '14 · 15 · 16',
    month: 'agosto',
    location: 'extremadura',
  },
  manifiesto: {
    line1: 'ESTO NO ES',
    line2: 'UN FESTIVAL.',
    line3: 'ES UN PLAN.',
    line4: 'EXTREMADURA 2026',
    subtext: 'Tres días sin cobertura, 3 escenarios, +48 artistas y una sola misión: vivir el momento. Tú eres el protagonista.',
    stat1: '3',
    stat1Label: 'Escenarios',
    stat2: '+48',
    stat2Label: 'Artistas',
  },
}

const CONTENT_PAGES = ['hero', 'manifiesto'] as const
type ContentPage = typeof CONTENT_PAGES[number]

export async function getPageContent(page: ContentPage): Promise<Record<string, string>> {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data } = await supabase
        .from('page_content')
        .select('key, value')
        .eq('page', page)
      if (data && data.length > 0) {
        const result: Record<string, string> = {}
        for (const row of data) {
          result[row.key] = row.value
        }
        return result
      }
    } catch {}
  }

  return getItem<Record<string, string>>(`page_content_${page}`, {})
}

export async function setPageContent(page: ContentPage, content: Record<string, string>): Promise<boolean> {
  setItem(`page_content_${page}`, content)

  if (HAS_SUPABASE && supabase) {
    try {
      const rows = Object.entries(content).map(([key, value]) => ({
        page,
        key,
        value,
      }))
      await supabase.from('page_content').upsert(rows, { onConflict: 'page,key' })
      return true
    } catch {
      return false
    }
  }

  return true
}

export function getDefaultContent(): PageContent {
  return DEFAULT_CONTENT
}
