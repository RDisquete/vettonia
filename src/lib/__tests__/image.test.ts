import { describe, it, expect } from 'vitest'
import { blobToDataUrl } from '../image'

describe('blobToDataUrl', () => {
  it('converts a text blob to a data URL', async () => {
    const blob = new Blob(['hello'], { type: 'text/plain' })
    const url = await blobToDataUrl(blob)
    expect(url).toMatch(/^data:text\/plain;base64,/)
  })

  it('converts a JPEG blob correctly', async () => {
    const blob = new Blob([new Uint8Array([0xFF, 0xD8, 0xFF])], { type: 'image/jpeg' })
    const url = await blobToDataUrl(blob)
    expect(url).toMatch(/^data:image\/jpeg;base64,/)
  })

  it('produces a non-empty string', async () => {
    const blob = new Blob(['some content'])
    const url = await blobToDataUrl(blob)
    expect(url.length).toBeGreaterThan(0)
  })
})
