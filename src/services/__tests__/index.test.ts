import { describe, it, expect, vi } from 'vitest'

vi.mock('../../services/env', () => ({
  HAS_SUPABASE: false,
  supabase: null,
}))

describe('services index (barrel)', () => {
  it('re-exports all expected functions', async () => {
    const mod = await import('../index')
    expect(mod).toBeDefined()
    expect(typeof mod.unlockAlbum).toBe('function')
    expect(typeof mod.getPhotos).toBe('function')
    expect(typeof mod.getPassInfo).toBe('function')
    expect(typeof mod.getMessages).toBe('function')
    expect(typeof mod.getPassStats).toBe('function')
    expect(typeof mod.getAlerts).toBe('function')
    expect(typeof mod.getPublishedArtists).toBe('function')
  })
})
