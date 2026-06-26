import { supabase } from './supabase'
import { HAS_SUPABASE } from './env'
import { getItem, setItem } from '../lib/persistence'
import type { WallMessage } from '../types'

const MESSAGES_KEY = 'wall_messages'

export async function getMessages(): Promise<WallMessage[]> {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        const mapped: WallMessage[] = data.map(m => ({
          id: m.id,
          text: m.text,
          author: m.author,
          createdAt: m.created_at,
        }))
        setItem(MESSAGES_KEY, mapped)
        return mapped
      }
    } catch {}
  }
  return getItem<WallMessage[]>(MESSAGES_KEY, [])
}

export async function addMessage(text: string, author: string): Promise<WallMessage> {
  const msg: WallMessage = {
    id: crypto.randomUUID(),
    text,
    author: author || 'Alma de foso',
    createdAt: new Date().toISOString(),
  }

  if (HAS_SUPABASE && supabase) {
    try {
      const { error } = await supabase.from('messages').insert({
        id: msg.id,
        text: msg.text,
        author: msg.author,
        created_at: msg.createdAt,
        pass_number: null,
      })
      if (!error) {
        const all = getItem<WallMessage[]>(MESSAGES_KEY, [])
        all.unshift(msg)
        setItem(MESSAGES_KEY, all)
        return msg
      }
    } catch {}
  }

  const all = getItem<WallMessage[]>(MESSAGES_KEY, [])
  all.unshift(msg)
  setItem(MESSAGES_KEY, all)
  return msg
}

export async function deleteMessage(id: string): Promise<void> {
  if (HAS_SUPABASE && supabase) {
    try {
      await supabase.from('messages').delete().eq('id', id)
    } catch {}
  }
  const all = getItem<WallMessage[]>(MESSAGES_KEY, []).filter(m => m.id !== id)
  setItem(MESSAGES_KEY, all)
}
