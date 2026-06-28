import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAccess, usePass } from '../hooks'

vi.mock('../../../lib/storage', () => ({
  unlockAlbum: vi.fn((code: string) => code.toUpperCase() === 'VETTONIA'),
  isAlbumUnlocked: vi.fn(() => false),
  lockAlbum: vi.fn(),
  getPassInfo: vi.fn(() => Promise.resolve({ name: '', number: '', createdAt: '' })),
  setPassName: vi.fn(() => Promise.resolve()),
  getPassPhoto: vi.fn(() => Promise.resolve(null)),
  setPassPhoto: vi.fn(() => Promise.resolve('data:image/jpeg;base64,fake')),
  getMessages: vi.fn(() => Promise.resolve([])),
  addMessage: vi.fn(() => Promise.resolve()),
  deleteMessage: vi.fn(() => Promise.resolve()),
  getPassStats: vi.fn(() => Promise.resolve({ photosUploaded: 0, totalLikes: 0, uniqueAuthors: 0, joinDate: '' })),
  getPhotos: vi.fn(() => Promise.resolve([])),
  getPassPin: vi.fn(() => null),
  setPassPin: vi.fn(() => Promise.resolve()),
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useAccess', () => {
  it('starts with locked state', () => {
    const { result } = renderHook(() => useAccess())
    expect(result.current.unlocked).toBe(false)
    expect(result.current.tab).toBe('pase')
  })

  it('unlocks with correct code', () => {
    const { result } = renderHook(() => useAccess())
    act(() => { result.current.setCode('VETTONIA') })
    act(() => { result.current.handleSubmit() })
    expect(result.current.unlocked).toBe(true)
    expect(result.current.codeError).toBe(false)
  })

  it('shows error with wrong code', () => {
    const { result } = renderHook(() => useAccess())
    act(() => { result.current.setCode('wrong') })
    act(() => { result.current.handleSubmit() })
    expect(result.current.unlocked).toBe(false)
    expect(result.current.codeError).toBe(true)
  })

  it('logs out', () => {
    const { result } = renderHook(() => useAccess())
    act(() => { result.current.handleLogout() })
    expect(result.current.unlocked).toBe(false)
    expect(result.current.tab).toBe('pase')
  })
})

describe('usePass', () => {
  it('loads pass info on mount', async () => {
    const { result } = renderHook(() => usePass())
    await vi.waitFor(() => {
      expect(result.current.passLoading).toBe(false)
    })
  })

  it('provides empty initial state', async () => {
    const { result } = renderHook(() => usePass())
    await vi.waitFor(() => {
      expect(result.current.passInfo.number).toBe('')
      expect(result.current.passPhoto).toBeNull()
    })
  })
})
