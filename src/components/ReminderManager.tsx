import { useEffect, useRef } from 'react'
import { allArtists } from '../data/lineup'
import { getFavorites } from '../services/favorites'
import { getItem, setItem } from '../lib/persistence'

const REMINDERS_KEY = 'sent_reminders'
const WINDOW_MINUTES = 15

function getMinutesUntil(time: string): number {
  const now = new Date()
  const [h, m] = time.split(':').map(Number)
  const target = new Date()
  target.setHours(h, m, 0, 0)
  return (target.getTime() - now.getTime()) / 60000
}

export default function ReminderManager() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    const check = async () => {
      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

      const favSlugs = await getFavorites()
      if (favSlugs.size === 0) return

      const sent = new Set(getItem<string[]>(REMINDERS_KEY, []))
      let changed = false

      for (const artist of allArtists) {
        if (!favSlugs.has(artist.slug)) continue
        if (sent.has(artist.slug)) continue

        const minutesUntil = getMinutesUntil(artist.time)
        if (minutesUntil > 0 && minutesUntil <= WINDOW_MINUTES) {
          new Notification('Vettonia 2027', {
            body: `${artist.name} empieza en ${Math.round(minutesUntil)} min en ${artist.stage}`,
            icon: '/vettonia-logo.png',
            tag: artist.slug,
          })
          sent.add(artist.slug)
          changed = true
        }
      }

      if (changed) {
        setItem(REMINDERS_KEY, [...sent])
      }
    }

    check()

    intervalRef.current = setInterval(check, 30000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return null
}
