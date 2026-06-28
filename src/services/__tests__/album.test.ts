import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isAlbumUnlocked, unlockAlbum, lockAlbum, getAuthenticatedPass, getPhotos, updatePhotoStatus } from '../album'

vi.mock('../env', () => ({
  HAS_SUPABASE: false,
  supabase: null,
  ALBUM_CODE: 'VETTONIA',
}))

vi.mock('../lib/image', () => ({
  compressImage: (f: File) => Promise.resolve(f),
  blobToDataUrl: (_b: Blob) => Promise.resolve('data:image/jpeg;base64,fake'),
}))

vi.mock('../pass', () => ({
  verifyPassPin: () => Promise.resolve(false),
  signInPass: () => Promise.reject(new Error('no supabase')),
  signUpPass: () => Promise.reject(new Error('no supabase')),
}))

vi.mock('../auth', () => ({
  signInPass: () => Promise.reject(new Error('no supabase')),
  signUpPass: () => Promise.reject(new Error('no supabase')),
}))

beforeEach(() => {
  localStorage.clear()
})

describe('album lock/unlock', () => {
  it('starts locked', () => {
    expect(isAlbumUnlocked()).toBe(false)
  })

  it('unlocks with correct code', () => {
    const ok = unlockAlbum('VETTONIA')
    expect(ok).toBe(true)
    expect(isAlbumUnlocked()).toBe(true)
  })

  it('fails with wrong code', () => {
    const ok = unlockAlbum('wrong')
    expect(ok).toBe(false)
    expect(isAlbumUnlocked()).toBe(false)
  })

  it('is case insensitive', () => {
    const ok = unlockAlbum('vettonia')
    expect(ok).toBe(true)
    expect(isAlbumUnlocked()).toBe(true)
  })

  it('locks again', () => {
    unlockAlbum('VETTONIA')
    expect(isAlbumUnlocked()).toBe(true)
    lockAlbum()
    expect(isAlbumUnlocked()).toBe(false)
  })
})

describe('getAuthenticatedPass', () => {
  it('returns null when not authenticated', () => {
    expect(getAuthenticatedPass()).toBeNull()
  })

  it('returns pass number when stored', () => {
    localStorage.setItem('vettonia_auth_pass', 'VET-000001ABC')
    expect(getAuthenticatedPass()).toBe('VET-000001ABC')
  })
})

describe('getPhotos', () => {
  it('returns empty array when no photos stored', async () => {
    const photos = await getPhotos()
    expect(photos).toEqual([])
  })

  it('returns stored photos from localStorage', async () => {
    const photo = { id: '1', dataUrl: 'url', caption: 'Test', author: 'Me', createdAt: new Date().toISOString(), status: 'approved' as const }
    localStorage.setItem('vettonia_private_photos', JSON.stringify([photo]))
    const photos = await getPhotos()
    expect(photos).toHaveLength(1)
    expect(photos[0].id).toBe('1')
  })

  it('filters by approved status', async () => {
    const pending = { id: '1', dataUrl: 'url', caption: '', author: '', createdAt: '', status: 'pending' as const }
    const approved = { id: '2', dataUrl: 'url', caption: '', author: '', createdAt: '', status: 'approved' as const }
    localStorage.setItem('vettonia_private_photos', JSON.stringify([pending, approved]))
    const approvedOnly = await getPhotos('approved')
    expect(approvedOnly).toHaveLength(1)
    expect(approvedOnly[0].id).toBe('2')
  })
})

describe('updatePhotoStatus', () => {
  it('updates status in localStorage', async () => {
    const photo = { id: 'p1', dataUrl: 'url', caption: '', author: '', createdAt: '', status: 'pending' as const }
    localStorage.setItem('vettonia_private_photos', JSON.stringify([photo]))
    await updatePhotoStatus('p1', 'approved')
    const stored = JSON.parse(localStorage.getItem('vettonia_private_photos')!)
    expect(stored[0].status).toBe('approved')
  })

  it('does not throw for missing photo', async () => {
    await expect(updatePhotoStatus('nonexistent', 'approved')).resolves.toBeUndefined()
  })
})
