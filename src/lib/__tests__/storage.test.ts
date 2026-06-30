import { describe, it, expect, vi } from 'vitest'

vi.mock('../persistence', () => ({
  getItem: vi.fn((key: string) => key === 'test' ? 'value' : null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}))

describe('services barrel', () => {
  it('re-exports from services without error', async () => {
    const mod = await import('../../services')
    expect(mod).toBeDefined()
    expect(typeof mod.unlockAlbum).toBe('function')
    expect(typeof mod.getPhotos).toBe('function')
    expect(typeof mod.getPassInfo).toBe('function')
    expect(typeof mod.getMessages).toBe('function')
    expect(typeof mod.getPassStats).toBe('function')
  })
})
