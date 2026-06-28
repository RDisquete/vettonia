import { describe, it, expect, vi } from 'vitest'

vi.mock('../persistence', () => ({
  getItem: vi.fn((key: string) => key === 'test' ? 'value' : null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}))

// Re-export barrel — only test that it exports expected keys
describe('storage (barrel)', () => {
  it('re-exports from services without error', async () => {
    const mod = await import('../storage')
    expect(mod).toBeDefined()
    expect(typeof mod.unlockAlbum).toBe('function')
    expect(typeof mod.getPhotos).toBe('function')
    expect(typeof mod.getPassInfo).toBe('function')
    expect(typeof mod.getMessages).toBe('function')
    expect(typeof mod.getPassStats).toBe('function')
  })
})
