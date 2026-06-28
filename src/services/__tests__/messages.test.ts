import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getMessages, addMessage, deleteMessage } from '../messages'

vi.mock('../env', () => ({
  HAS_SUPABASE: false,
  supabase: null,
}))

beforeEach(() => {
  localStorage.clear()
})

describe('messages (localStorage fallback)', () => {
  describe('addMessage + getMessages', () => {
    it('adds a message and retrieves it', async () => {
      const msg = await addMessage('Hello world', 'Test Author')
      expect(msg.text).toBe('Hello world')
      expect(msg.author).toBe('Test Author')
      expect(msg.id).toBeDefined()

      const all = await getMessages()
      expect(all).toHaveLength(1)
      expect(all[0].text).toBe('Hello world')
    })

    it('defaults author to Alma de foso', async () => {
      const msg = await addMessage('No author', '')
      expect(msg.author).toBe('Alma de foso')
    })

    it('adds multiple messages in order', async () => {
      await addMessage('First', 'A')
      await addMessage('Second', 'B')
      const all = await getMessages()
      expect(all).toHaveLength(2)
      expect(all[0].text).toBe('Second')
      expect(all[1].text).toBe('First')
    })
  })

  describe('deleteMessage', () => {
    it('removes a message by id', async () => {
      const msg = await addMessage('To delete', 'Me')
      expect((await getMessages()).length).toBe(1)
      await deleteMessage(msg.id)
      expect(await getMessages()).toHaveLength(0)
    })
  })

  describe('getMessages', () => {
    it('returns empty array with no messages', async () => {
      expect(await getMessages()).toEqual([])
    })
  })
})
