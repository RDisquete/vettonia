import { describe, it, expect } from 'vitest'
import { isUnsplashUrl, unsplashSrcset, unsplashAutoFormat, imgAttributes } from '../images'

describe('images', () => {
  describe('isUnsplashUrl', () => {
    it('returns true for unsplash urls', () => {
      expect(isUnsplashUrl('https://images.unsplash.com/photo-abc')).toBe(true)
    })

    it('returns false for non-unsplash urls', () => {
      expect(isUnsplashUrl('https://example.com/photo.jpg')).toBe(false)
    })
  })

  describe('unsplashAutoFormat', () => {
    it('adds auto=format if missing', () => {
      const url = 'https://images.unsplash.com/photo-abc?w=600'
      expect(unsplashAutoFormat(url)).toContain('auto=format')
    })

    it('does not duplicate auto=format', () => {
      const url = 'https://images.unsplash.com/photo-abc?auto=format&w=600'
      expect(unsplashAutoFormat(url)).toBe(url)
    })

    it('returns same url for non-unsplash', () => {
      const url = 'https://example.com/photo.jpg'
      expect(unsplashAutoFormat(url)).toBe(url)
    })

    it('adds ? if no query params', () => {
      const url = 'https://images.unsplash.com/photo-abc'
      expect(unsplashAutoFormat(url)).toBe('https://images.unsplash.com/photo-abc?auto=format')
    })
  })

  describe('unsplashSrcset', () => {
    it('returns empty for non-unsplash urls', () => {
      expect(unsplashSrcset('https://example.com/photo.jpg')).toBe('')
    })

    it('generates srcset with default widths', () => {
      const url = 'https://images.unsplash.com/photo-abc?w=600&q=80'
      const result = unsplashSrcset(url)
      expect(result).toContain('400w')
      expect(result).toContain('800w')
      expect(result).toContain('auto=format')
    })

    it('preserves original q and fit', () => {
      const url = 'https://images.unsplash.com/photo-abc?q=90&fit=crop'
      const result = unsplashSrcset(url)
      expect(result).toContain('q=90')
      expect(result).toContain('fit=crop')
    })
  })

  describe('imgAttributes', () => {
    it('adds loading lazy by default', () => {
      const attrs = imgAttributes('https://example.com/photo.jpg')
      expect(attrs.loading).toBe('lazy')
    })

    it('sets decoding async', () => {
      const attrs = imgAttributes('https://example.com/photo.jpg')
      expect(attrs.decoding).toBe('async')
    })

    it('adds srcset for unsplash urls', () => {
      const attrs = imgAttributes('https://images.unsplash.com/photo-abc?w=600')
      expect(attrs.srcset).toBeDefined()
      expect(attrs.src).toContain('auto=format')
    })

    it('does not add srcset for non-unsplash urls', () => {
      const attrs = imgAttributes('https://example.com/photo.jpg')
      expect(attrs.srcset).toBeUndefined()
    })
  })
})
