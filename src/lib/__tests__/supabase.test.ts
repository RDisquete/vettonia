import { describe, it, expect, vi } from 'vitest'

describe('supabase client', () => {
  it('is null when env vars are missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')

    const mod = await import('../../services/supabase')
    expect(mod.supabase).toBeNull()

    vi.unstubAllEnvs()
  })
})
