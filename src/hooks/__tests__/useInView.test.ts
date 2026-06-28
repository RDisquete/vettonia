import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import useInView from '../useInView'

describe('useInView', () => {
  beforeEach(() => {
    const mockObserve = vi.fn()
    const mockUnobserve = vi.fn()
    const mockDisconnect = vi.fn()
    vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    })))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns ref and inView false initially', () => {
    const { result } = renderHook(() => useInView())
    expect(result.current.ref).toBeDefined()
    expect(result.current.inView).toBe(false)
  })

  it('creates ref object', () => {
    const { result } = renderHook(() => useInView())
    expect(result.current.ref).toHaveProperty('current')
  })
})
