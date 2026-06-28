import { supabase } from './supabase'
import { HAS_SUPABASE } from './env'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

type PhotoInsertPayload = {
  id: string
  caption: string
  author: string
  created_at: string
  storage_path: string
  status: string
}

export function subscribeToNewPhotos(
  onPhoto: (photo: { id: string; dataUrl: string; caption: string; author: string; createdAt: string; status: string }) => void
): () => void {
  const sb = supabase
  if (!HAS_SUPABASE || !sb) return () => {}

  const channel = sb
    .channel('photos-realtime')
    .on<PhotoInsertPayload>(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'photos' },
      (payload: RealtimePostgresChangesPayload<PhotoInsertPayload>) => {
        const p = payload.new as PhotoInsertPayload
        const url = sb.storage.from('photos').getPublicUrl(p.storage_path).data.publicUrl
        onPhoto({
          id: p.id,
          dataUrl: url,
          caption: p.caption,
          author: p.author,
          createdAt: p.created_at,
          status: p.status,
        })
      }
    )
    .subscribe()

  return () => {
    sb.removeChannel(channel)
  }
}
