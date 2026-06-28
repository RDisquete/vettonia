import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAlerts, addAlert, markAlertRead, deleteAlert } from '../alerts'

vi.mock('../env', () => ({
  HAS_SUPABASE: false,
  supabase: null,
}))

beforeEach(() => {
  localStorage.clear()
})

const userId = 'user-1'

describe('alerts (localStorage fallback)', () => {
  describe('addAlert + getAlerts', () => {
    it('adds and retrieves alerts for a user', async () => {
      const alert = await addAlert(userId, 'like', 'Someone liked your photo')
      expect(alert.message).toBe('Someone liked your photo')
      expect(alert.type).toBe('like')
      expect(alert.read).toBe(false)

      const all = await getAlerts(userId)
      expect(all).toHaveLength(1)
      expect(all[0].message).toBe('Someone liked your photo')
    })

    it('only returns alerts for the specified user', async () => {
      await addAlert('user-1', 'message', 'For user 1')
      await addAlert('user-2', 'photo', 'For user 2')
      const user1Alerts = await getAlerts('user-1')
      expect(user1Alerts).toHaveLength(1)
      expect(user1Alerts[0].message).toBe('For user 1')
    })
  })

  describe('markAlertRead', () => {
    it('marks an alert as read', async () => {
      const alert = await addAlert(userId, 'like', 'Read me')
      await markAlertRead(alert.id)
      const all = await getAlerts(userId)
      expect(all[0].read).toBe(true)
    })
  })

  describe('deleteAlert', () => {
    it('deletes an alert', async () => {
      const alert = await addAlert(userId, 'photo', 'Delete me')
      expect((await getAlerts(userId)).length).toBe(1)
      await deleteAlert(alert.id)
      expect(await getAlerts(userId)).toHaveLength(0)
    })
  })

  describe('getAlerts', () => {
    it('returns empty array for user with no alerts', async () => {
      expect(await getAlerts('unknown')).toEqual([])
    })
  })
})
