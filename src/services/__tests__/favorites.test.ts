import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getFavorites, toggleFavorite } from '../favorites'

vi.mock('../env', () => ({
  HAS_SUPABASE: false,
  supabase: null,
}))

vi.mock('../album', () => ({
  getAuthenticatedPass: () => null,
}))

beforeEach(() => {
  localStorage.clear()
})

describe('favorites (localStorage fallback)', () => {
  it('returns empty set when no favorites', async () => {
    const favs = await getFavorites()
    expect(favs.size).toBe(0)
  })

  it('toggles a favorite on', async () => {
    const result = await toggleFavorite('sor')
    expect(result).toBe(true)
    const favs = await getFavorites()
    expect(favs.has('sor')).toBe(true)
  })

  it('toggles a favorite off', async () => {
    await toggleFavorite('sor')
    await toggleFavorite('sor')
    const favs = await getFavorites()
    expect(favs.has('sor')).toBe(false)
  })

  it('stores multiple favorites', async () => {
    await toggleFavorite('sor')
    await toggleFavorite('laura-aire')
    await toggleFavorite('cacho-castana')
    const favs = await getFavorites()
    expect(favs.size).toBe(3)
    expect(favs.has('sor')).toBe(true)
    expect(favs.has('laura-aire')).toBe(true)
    expect(favs.has('cacho-castana')).toBe(true)
  })

  it('persists across getFavorites calls', async () => {
    await toggleFavorite('sor')
    const favs1 = await getFavorites()
    expect(favs1.has('sor')).toBe(true)

    const favs2 = await getFavorites()
    expect(favs2.has('sor')).toBe(true)
  })
})
