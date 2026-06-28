import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  vi.stubEnv('VITE_ALBUM_CODE', '')
  vi.stubEnv('VITE_SUPABASE_URL', '')
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('env', () => {
  it('exports ALBUM_CODE with default VETTONIA', async () => {
    const mod = await import('../env')
    expect(mod.ALBUM_CODE).toBe('VETTONIA')
  })

  it('exports ALBUM_CODE in uppercase', async () => {
    const mod = await import('../env')
    expect(mod.ALBUM_CODE).toBe(mod.ALBUM_CODE.toUpperCase())
  })

  it('sets HAS_SUPABASE to false without env vars', async () => {
    const mod = await import('../env')
    expect(mod.HAS_SUPABASE).toBe(false)
  })
})
