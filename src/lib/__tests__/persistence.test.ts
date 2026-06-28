import { describe, it, expect, beforeEach } from 'vitest'
import { getItem, setItem, removeItem, getRaw, setRaw } from '../persistence'

const PREFIX = 'vettonia_'

beforeEach(() => {
  localStorage.clear()
})

describe('persistence', () => {
  describe('setRaw / getRaw', () => {
    it('stores and retrieves a raw string', () => {
      setRaw('test_key', 'hello')
      expect(localStorage.getItem(`${PREFIX}test_key`)).toBe('hello')
      expect(getRaw('test_key')).toBe('hello')
    })

    it('returns null for missing key', () => {
      expect(getRaw('nonexistent')).toBeNull()
    })

    it('overwrites existing value', () => {
      setRaw('test_key', 'first')
      setRaw('test_key', 'second')
      expect(getRaw('test_key')).toBe('second')
    })
  })

  describe('setItem / getItem', () => {
    it('stores and retrieves an object', () => {
      const obj = { name: 'test', count: 42 }
      setItem('obj_key', obj)
      expect(getItem('obj_key', null)).toEqual(obj)
    })

    it('returns fallback for missing key', () => {
      expect(getItem('missing', 'default')).toBe('default')
    })

    it('returns fallback for invalid JSON', () => {
      localStorage.setItem(`${PREFIX}bad`, 'not-json')
      expect(getItem('bad', [])).toEqual([])
    })

    it('preserves the full object shape', () => {
      const data = { a: 1, b: [2, 3], c: { d: 'e' } }
      setItem('shaped', data)
      expect(getItem('shaped', null)).toEqual(data)
    })
  })

  describe('removeItem', () => {
    it('removes a stored key', () => {
      setRaw('to_remove', 'value')
      removeItem('to_remove')
      expect(getRaw('to_remove')).toBeNull()
    })

    it('does not throw when removing missing key', () => {
      expect(() => removeItem('missing')).not.toThrow()
    })
  })

  describe('prefix isolation', () => {
    it('does not conflict with unprefixed keys', () => {
      localStorage.setItem('unprefixed', 'value')
      expect(getRaw('unprefixed')).toBeNull()
    })

    it('reads only prefixed keys', () => {
      setRaw('mykey', 'stored')
      expect(localStorage.getItem('vettonia_mykey')).toBe('stored')
    })
  })
})
