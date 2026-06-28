import { describe, it, expect, vi } from 'vitest'
import { encodePassQR, decodePassQR } from '../qr'

vi.mock('../env', () => ({
  HAS_SUPABASE: false,
  supabase: null,
}))

describe('qr service', () => {
  it('encodes pass data', () => {
    const qr = encodePassQR('Juan Pérez', 'VET-000001ABC')
    const decoded = JSON.parse(qr)
    expect(decoded.v).toBe(1)
    expect(decoded.n).toBe('Juan Pérez')
    expect(decoded.p).toBe('VET-000001ABC')
  })

  it('decodes valid QR', () => {
    const qr = encodePassQR('Ana', 'VET-000002XYZ')
    const data = decodePassQR(qr)
    expect(data).not.toBeNull()
    expect(data!.n).toBe('Ana')
    expect(data!.p).toBe('VET-000002XYZ')
  })

  it('returns null for invalid QR', () => {
    expect(decodePassQR('invalid')).toBeNull()
    expect(decodePassQR('{"v":2,"n":"a","p":"b"}')).toBeNull()
    expect(decodePassQR('{"n":"a"}')).toBeNull()
    expect(decodePassQR('')).toBeNull()
  })

  it('handles empty name gracefully', () => {
    const qr = encodePassQR('', 'VET-000001')
    const data = decodePassQR(qr)
    expect(data?.n).toBe('')
    expect(data?.p).toBe('VET-000001')
  })

  it('handles special characters', () => {
    const qr = encodePassQR('María José Fernández-López', 'VET-999999')
    const data = decodePassQR(qr)
    expect(data?.n).toBe('María José Fernández-López')
  })
})
