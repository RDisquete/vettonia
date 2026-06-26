import { supabase } from './supabase'
import { HAS_SUPABASE } from './env'
import { getPhotos, getLikedPhotos } from './album'
import { getPassInfo } from './pass'

export interface PassStats {
  photosUploaded: number
  totalLikes: number
  joinDate: string
  uniqueAuthors: number
}

export async function getPassStats(): Promise<PassStats> {
  let photosUploaded = 0
  let totalLikes = 0
  let joinDate = ''
  let uniqueAuthors = 0

  if (HAS_SUPABASE && supabase) {
    try {
      const pass = await getPassInfo()
      const [photosRes, likesRes] = await Promise.all([
        supabase.from('photos').select('id, author, created_at', { count: 'exact', head: false }).limit(1),
        pass.number ? supabase.from('likes').select('id', { count: 'exact', head: false }).eq('pass_number', pass.number) : null,
      ])

      if (photosRes.data) {
        photosUploaded = photosRes.count ?? 0
        const { data: allPhotos } = await supabase.from('photos').select('author')
        if (allPhotos) uniqueAuthors = new Set(allPhotos.map(p => p.author)).size
      } else {
        const fallback = await getPhotos()
        photosUploaded = fallback.length
        uniqueAuthors = new Set(fallback.map(p => p.author)).size
      }

      if (likesRes?.count !== undefined && likesRes?.count !== null) {
        totalLikes = likesRes.count
      } else {
        totalLikes = (await getLikedPhotos()).length
      }

      joinDate = pass.createdAt
    } catch {
      return fallbackStats()
    }
  } else {
    return fallbackStats()
  }

  return { photosUploaded, totalLikes, joinDate, uniqueAuthors }
}

async function fallbackStats(): Promise<PassStats> {
  const photos = await getPhotos()
  const liked = await getLikedPhotos()
  const info = await getPassInfo()

  return {
    photosUploaded: photos.length,
    totalLikes: liked.length,
    joinDate: info.createdAt,
    uniqueAuthors: new Set(photos.map(p => p.author)).size,
  }
}
