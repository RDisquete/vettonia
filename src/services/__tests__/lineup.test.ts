import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getAllArtists, getPublishedArtists, getPublishedStages, getAdminStages,
  upsertArtist, deleteArtist, publishArtist, publishAllArtists,
  getArtistBySlugFromService,
} from '../lineup'

vi.mock('../env', () => ({
  HAS_SUPABASE: false,
  supabase: null,
}))

beforeEach(() => {
  localStorage.clear()
})

const testArtist = {
  slug: 'test-artist',
  name: 'Test Artist',
  bio: 'A test artist',
  stage: 'Escenario A',
  time: '20:00',
  image: 'https://example.com/img.jpg',
  genre: 'Rock',
}

describe('lineup CRUD (localStorage fallback)', () => {
  describe('upsertArtist + getAllArtists', () => {
    it('creates a new artist via override', async () => {
      await upsertArtist(testArtist)
      const all = await getAllArtists()
      const a = all.find(x => x.slug === 'test-artist')
      expect(a).toBeDefined()
      expect(a!.name).toBe('Test Artist')
      expect(a!.published).toBe(true)
    })

    it('updates an existing artist', async () => {
      await upsertArtist(testArtist)
      await upsertArtist({ ...testArtist, name: 'Updated Name' })
      const all = await getAllArtists()
      const a = all.find(x => x.slug === 'test-artist')
      expect(a!.name).toBe('Updated Name')
    })
  })

  describe('deleteArtist', () => {
    it('deletes an artist from overrides', async () => {
      await upsertArtist(testArtist)
      await deleteArtist('test-artist')
      const all = await getAllArtists()
      expect(all.find(x => x.slug === 'test-artist')).toBeUndefined()
    })
  })

  describe('publishArtist', () => {
    it('sets published status in localStorage', async () => {
      await upsertArtist({ ...testArtist })
      await publishArtist('test-artist', false)
      const all = await getAllArtists()
      const a = all.find(x => x.slug === 'test-artist')
      expect(a!.published).toBe(false)
    })
  })

  describe('publishAllArtists', () => {
    it('returns 0 when no unpublished artists', async () => {
      const count = await publishAllArtists()
      expect(count).toBe(0)
    })
  })

  describe('getPublishedArtists', () => {
    it('returns only published artists', async () => {
      await upsertArtist(testArtist)
      await upsertArtist({ slug: 'draft', name: 'Draft', bio: '', stage: 'Escenario B', time: '', image: '', genre: 'Pop' })
      const published = await getPublishedArtists()
      expect(published.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('getPublishedStages', () => {
    it('returns stages with published artists', async () => {
      await upsertArtist(testArtist)
      const stages = await getPublishedStages()
      expect(stages.length).toBeGreaterThanOrEqual(1)
      expect(stages[0].artists.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('getAdminStages', () => {
    it('returns all stages', async () => {
      await upsertArtist(testArtist)
      const stages = await getAdminStages()
      expect(stages.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('getArtistBySlugFromService', () => {
    it('finds artist by slug', async () => {
      await upsertArtist(testArtist)
      const a = await getArtistBySlugFromService('test-artist')
      expect(a).toBeDefined()
      expect(a!.name).toBe('Test Artist')
    })

    it('returns undefined for unknown slug', async () => {
      const a = await getArtistBySlugFromService('nonexistent')
      expect(a).toBeUndefined()
    })
  })
})
