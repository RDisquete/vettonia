import { supabase } from './supabase'
import { ALBUM_CODE, HAS_SUPABASE } from './env'
import { getItem, setItem, removeItem, setRaw, getRaw } from '../lib/persistence'
import { compressImage, blobToDataUrl } from '../lib/image'
import { verifyPassPin } from './pass'
import { signInPass, signUpPass } from './auth'
import { incrementProgress } from './achievements'
import type { PassInfo, UploadedPhoto } from '../types'

const NOTIFY_ID = import.meta.env.VITE_FORMSPREE_NOTIFY

const PHOTOS_KEY = 'private_photos'
const UNLOCK_KEY = 'album_unlocked'
const AUTH_PASS_KEY = 'auth_pass'
const LIKES_KEY = 'liked_photos'

export function isAlbumUnlocked(): boolean {
  return getRaw(UNLOCK_KEY) === 'true' || getRaw(AUTH_PASS_KEY) !== null
}

export function unlockAlbum(code: string): boolean {
  if (code.toUpperCase() !== ALBUM_CODE) return false
  setRaw(UNLOCK_KEY, 'true')
  return true
}

export function getAuthenticatedPass(): string | null {
  return getRaw(AUTH_PASS_KEY)
}

export async function authenticatePassWithPin(passNumber: string, pin: string): Promise<boolean> {
  const trimmed = passNumber.toUpperCase().trim()
  const passRegex = /^VET-\d{6}$/
  if (!passRegex.test(trimmed)) return false

  const verified = await verifyPassPin(trimmed, pin)
  if (!verified) return false

  if (HAS_SUPABASE && supabase) {
    try {
      await signInPass(trimmed, pin)
    } catch {
      try {
        const signUpData = await signUpPass(trimmed, pin)
        if (!signUpData?.session) {
          try {
            await signInPass(trimmed, pin)
          } catch {
            return false
          }
        }
      } catch {
        return false
      }
    }
  }

  setRaw(AUTH_PASS_KEY, trimmed)
  return true
}

export function lockAlbum(): void {
  removeItem(UNLOCK_KEY)
  removeItem(AUTH_PASS_KEY)
}

export async function getPhotos(status?: 'approved' | 'pending' | 'rejected'): Promise<UploadedPhoto[]> {
  if (HAS_SUPABASE && supabase) {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) {
        const sb = supabase
        const mapped: UploadedPhoto[] = data.map(p => ({
          id: p.id,
          dataUrl: sb.storage.from('photos').getPublicUrl(p.storage_path).data.publicUrl,
          caption: p.caption,
          author: p.author,
          createdAt: p.created_at,
          status: p.status || 'approved',
        }))
        setItem(PHOTOS_KEY, mapped)
        if (status) return mapped.filter(p => (p.status || 'approved') === status)
        return mapped
      }
    } catch (e) { console.warn('[album] getPhotos select', e) }
  }
  const all = getItem<UploadedPhoto[]>(PHOTOS_KEY, [])
  if (status) return all.filter(p => (p.status || 'approved') === status)
  return all
}

export async function updatePhotoStatus(id: string, status: 'approved' | 'rejected', reason?: string): Promise<void> {
  if (HAS_SUPABASE && supabase) {
    try {
      const update: Record<string, string | null> = { status }
      if (reason !== undefined) update.rejection_reason = reason
      await supabase.from('photos').update(update).eq('id', id)
    } catch (e) { console.warn('[album] updatePhotoStatus update', e) }
  }
  const all = getItem<UploadedPhoto[]>(PHOTOS_KEY, [])
  const photo = all.find(p => p.id === id)
  if (photo) {
    photo.status = status
    setItem(PHOTOS_KEY, all)
  }
}

export async function uploadPhoto(
  file: File,
  caption: string,
  author: string
): Promise<UploadedPhoto> {
  const compressed = await compressImage(file)
  const compressedFile = new File([compressed], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })

  const   photo: UploadedPhoto = {
    id: crypto.randomUUID(),
    dataUrl: '',
    caption,
    author,
    createdAt: new Date().toISOString(),
    status: 'pending',
  }

  if (HAS_SUPABASE && supabase) {
    try {
      const storagePath = `${photo.id}.jpg`
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(storagePath, compressedFile, { upsert: true })

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('photos')
          .getPublicUrl(storagePath)
        if (urlData) photo.dataUrl = urlData.publicUrl

        const { error: dbError } = await supabase
          .from('photos')
          .insert({
            id: photo.id,
            caption: photo.caption,
            author: photo.author,
            created_at: photo.createdAt,
            storage_path: storagePath,
          })

        if (dbError) {
          console.warn('db insert error:', dbError)
        }

        if (NOTIFY_ID && !dbError) {
          const fd = new FormData()
          fd.append('author', photo.author)
          fd.append('caption', photo.caption)
          fd.append('photo_id', photo.id)
          fetch(`https://formspree.io/f/${NOTIFY_ID}`, {
            method: 'POST', body: fd, headers: { Accept: 'application/json' },
          }).catch(() => {})
        }
      } else {
        console.warn('storage upload error:', JSON.stringify(uploadError))
      }
    } catch (e) {
      console.warn('upload exception:', e)
    }
  }

  if (!photo.dataUrl) {
    photo.dataUrl = await blobToDataUrl(compressed)
  }

  const all = getItem<UploadedPhoto[]>(PHOTOS_KEY, [])
  all.unshift(photo)
  setItem(PHOTOS_KEY, all)
  incrementProgress('fotografo')
  return photo
}

export async function deletePhoto(id: string): Promise<void> {
  if (HAS_SUPABASE && supabase) {
    try {
      await supabase.storage.from('photos').remove([`${id}.jpg`])
      await supabase.from('photos').delete().eq('id', id)
    } catch (e) { console.warn('[album] deletePhoto', e) }
  }
  const all = getItem<UploadedPhoto[]>(PHOTOS_KEY, []).filter(p => p.id !== id)
  setItem(PHOTOS_KEY, all)
}

function getActivePassNumber(): string {
  return getAuthenticatedPass() || getItem<PassInfo | null>('pass_info', null)?.number || ''
}

export async function getLikedPhotos(): Promise<string[]> {
  const passNumber = getActivePassNumber()
  if (!passNumber) return getItem<string[]>(LIKES_KEY, [])

  if (HAS_SUPABASE && supabase) {
    try {
      const { data } = await supabase
        .from('likes')
        .select('photo_id')
        .eq('pass_number', passNumber)
      if (data) {
        const ids = data.map(l => l.photo_id)
        setItem(LIKES_KEY, ids)
        return ids
      }
    } catch (e) { console.warn('[album] getLikedPhotos select', e) }
  }
  return getItem<string[]>(LIKES_KEY, [])
}

export async function toggleLike(photoId: string): Promise<boolean> {
  const passNumber = getActivePassNumber()

  if (passNumber && HAS_SUPABASE && supabase) {
    try {
      const { data: existing } = await supabase!
        .from('likes')
        .select('id')
        .eq('photo_id', photoId)
        .eq('pass_number', passNumber)
        .maybeSingle()

      if (existing) {
        await supabase.from('likes').delete().eq('id', existing.id)
        const likes = getItem<string[]>(LIKES_KEY, []).filter(id => id !== photoId)
        setItem(LIKES_KEY, likes)
        return false
      } else {
        await supabase.from('likes').insert({
          id: crypto.randomUUID(),
          photo_id: photoId,
          pass_number: passNumber,
        })
        const likes = getItem<string[]>(LIKES_KEY, [])
        if (!likes.includes(photoId)) likes.push(photoId)
        setItem(LIKES_KEY, likes)
        return true
      }
    } catch (e) { console.warn('[album] toggleLike select/delete/insert', e) }
  }

  const likes = getItem<string[]>(LIKES_KEY, [])
  const idx = likes.indexOf(photoId)
  if (idx === -1) {
    likes.push(photoId)
    setItem(LIKES_KEY, likes)
    return true
  }
  likes.splice(idx, 1)
  setItem(LIKES_KEY, likes)
  return false
}
