import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextPassNumber, setPassName, getPassPin, setPassPin, verifyPassPin } from '../pass'

vi.mock('../env', () => ({
  HAS_SUPABASE: false,
  supabase: null,
}))

beforeEach(() => {
  localStorage.clear()
})

describe('pass flow integration', () => {
  describe('nextPassNumber', () => {
    it('generates VET-000001 on first call', () => {
      const num = nextPassNumber()
      expect(num).toMatch(/^VET-\d{6}[A-Z0-9]{3}$/)
      expect(num.startsWith('VET-000001')).toBe(true)
    })

    it('increments the counter on each call', () => {
      const first = nextPassNumber()
      const second = nextPassNumber()
      const firstSeq = parseInt(first.slice(4, 10), 10)
      const secondSeq = parseInt(second.slice(4, 10), 10)
      expect(secondSeq).toBe(firstSeq + 1)
    })

    it('includes a random 3-char suffix', () => {
      const num = nextPassNumber()
      const suffix = num.split('-')[1].slice(6)
      expect(suffix).toMatch(/^[A-Z0-9]{3}$/)
    })

    it('produces unique numbers across calls', () => {
      const nums = new Set(Array.from({ length: 10 }, () => nextPassNumber()))
      expect(nums.size).toBe(10)
    })
  })

  describe('setPassName', () => {
    it('stores a name in localStorage', async () => {
      await setPassName('Rafael')
      const stored = JSON.parse(localStorage.getItem('vettonia_pass_info')!)
      expect(stored.name).toBe('Rafael')
    })

    it('updates an existing name', async () => {
      await setPassName('First')
      await setPassName('Second')
      const stored = JSON.parse(localStorage.getItem('vettonia_pass_info')!)
      expect(stored.name).toBe('Second')
    })
  })

  describe('setPassPin / getPassPin', () => {
    it('stores a PIN in localStorage', async () => {
      await setPassPin('1234')
      expect(getPassPin()).toBe('1234')
    })

    it('overwrites the existing PIN', async () => {
      await setPassPin('0000')
      await setPassPin('5678')
      expect(getPassPin()).toBe('5678')
    })

    it('returns null when no PIN is set', () => {
      expect(getPassPin()).toBeNull()
    })
  })

  describe('verifyPassPin', () => {
    it('returns true when PIN matches', async () => {
      const passNum = nextPassNumber()
      localStorage.setItem('vettonia_pass_info', JSON.stringify({ name: '', number: passNum, createdAt: '' }))
      await setPassPin('4321')
      const result = await verifyPassPin(passNum, '4321')
      expect(result).toBe(true)
    })

    it('returns false when PIN does not match', async () => {
      const passNum = nextPassNumber()
      localStorage.setItem('vettonia_pass_info', JSON.stringify({ name: '', number: passNum, createdAt: '' }))
      await setPassPin('1111')
      const result = await verifyPassPin(passNum, '2222')
      expect(result).toBe(false)
    })
  })

  describe('full pass creation flow', () => {
    it('creates a pass with name, number, PIN, and verifies it', async () => {
      const passNumber = nextPassNumber()
      expect(passNumber).toMatch(/^VET-\d{6}[A-Z0-9]{3}$/)

      localStorage.setItem('vettonia_pass_info', JSON.stringify({ name: '', number: passNumber, createdAt: '' }))

      await setPassName('María García')
      const info = JSON.parse(localStorage.getItem('vettonia_pass_info')!)
      expect(info.name).toBe('María García')

      await setPassPin('7890')
      expect(getPassPin()).toBe('7890')

      const verified = await verifyPassPin(passNumber, '7890')
      expect(verified).toBe(true)

      const wrongPin = await verifyPassPin(passNumber, '0000')
      expect(wrongPin).toBe(false)
    })
  })
})
