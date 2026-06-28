import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signUp, signIn, getCurrentUser, getSession, signOut, onAuthStateChange } from '../auth'

const { mockSupabase } = vi.hoisted(() => ({
  mockSupabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(() => ({
      upsert: vi.fn().mockResolvedValue({ error: null }),
      select: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ data: null }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null }),
      })),
    })),
  },
}))

vi.mock('../supabase', () => ({
  supabase: mockSupabase,
}))

vi.mock('../env', () => ({
  HAS_SUPABASE: true,
  supabase: mockSupabase,
}))

vi.mock('../pass', () => ({
  nextPassNumber: () => 'VET-000001ABC',
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('auth', () => {
  describe('signUp', () => {
    it('calls auth.signUp and inserts profile + pass', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'u1' } },
        error: null,
      })
      mockSupabase.from.mockImplementation(() => ({
        upsert: vi.fn().mockResolvedValue({ error: null }),
        select: vi.fn(() => ({
          eq: vi.fn().mockResolvedValue({ data: null }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null }),
        })),
      }))

      const result = await signUp('test@test.com', 'password123', 'Test User')
      expect(result.passNumber).toBeDefined()
      expect(result.passNumber).toMatch(/^VET-/)
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      })
    })
  })

  describe('signIn', () => {
    it('calls signInWithPassword', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'u1' } },
        error: null,
      })

      const data = await signIn('test@test.com', 'password123')
      expect(data.user.id).toBe('u1')
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      })
    })

    it('throws on error', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: {},
        error: new Error('Invalid credentials'),
      })
      await expect(signIn('bad@test.com', 'wrong')).rejects.toThrow('Invalid credentials')
    })
  })

  describe('getCurrentUser', () => {
    it('returns user when authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'u1', email: 'test@test.com' } },
      })
      const user = await getCurrentUser()
      expect(user).not.toBeNull()
      expect(user!.id).toBe('u1')
    })

    it('returns null when not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
      const user = await getCurrentUser()
      expect(user).toBeNull()
    })
  })

  describe('getSession', () => {
    it('returns session when authenticated', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: { user: { id: 'u1' } } },
      })
      const session = await getSession()
      expect(session).not.toBeNull()
    })

    it('returns null without session', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } })
      const session = await getSession()
      expect(session).toBeNull()
    })
  })

  describe('signOut', () => {
    it('calls supabase.auth.signOut', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null })
      await signOut()
      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('onAuthStateChange', () => {
    it('registers a listener and returns unsubscribe', () => {
      const cb = vi.fn()
      const unsubscribe = onAuthStateChange(cb)
      expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalled()
      expect(typeof unsubscribe).toBe('function')
    })
  })
})
