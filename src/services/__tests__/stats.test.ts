import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPassStats } from '../stats'

vi.mock('../env', () => ({
  HAS_SUPABASE: false,
  supabase: null,
}))

beforeEach(() => {
  localStorage.clear()
})

describe('getPassStats (localStorage fallback)', () => {
  it('returns zeroed stats when no data exists', async () => {
    const stats = await getPassStats()
    expect(stats.photosUploaded).toBe(0)
    expect(stats.totalLikes).toBe(0)
    expect(stats.uniqueAuthors).toBe(0)
    expect(stats.joinDate).toBe('')
  })

  it('counts photos and authors', async () => {
    localStorage.setItem('vettonia_private_photos', JSON.stringify([
      { id: '1', dataUrl: 'u1', caption: '', author: 'Alice', createdAt: '', status: 'approved' },
      { id: '2', dataUrl: 'u2', caption: '', author: 'Bob', createdAt: '', status: 'approved' },
      { id: '3', dataUrl: 'u3', caption: '', author: 'Alice', createdAt: '', status: 'approved' },
    ]))
    localStorage.setItem('vettonia_liked_photos', JSON.stringify(['1', '2']))
    localStorage.setItem('vettonia_pass_info', JSON.stringify({ name: 'Test', number: 'VET-000001ABC', createdAt: '2027-01-15' }))

    const stats = await getPassStats()
    expect(stats.photosUploaded).toBe(3)
    expect(stats.totalLikes).toBe(2)
    expect(stats.uniqueAuthors).toBe(2)
    expect(stats.joinDate).toBe('2027-01-15')
  })
})
