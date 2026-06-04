import { useState, useEffect, useCallback } from 'react'
import { onAuthChange } from '@/lib/auth'
import {
  subscribeToLeaderboard,
  subscribeToActivity,
  subscribeToEvents,
  subscribeToAnnouncements,
} from '@/lib/db'
import type { School, Event, ActivityFeedItem, Announcement, LeaderboardEntry } from '@/types'
import type { User } from 'firebase/auth'

// ─── AUTH ────────────────────────────────────────────────────────────────────

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  return { user, loading }
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────

export function useLeaderboard() {
  const [schools, setSchools] = useState<LeaderboardEntry[]>([])
  const [prevSchools, setPrevSchools] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToLeaderboard((rawSchools) => {
      setSchools((prev) => {
        // Calculate rank changes
        const prevMap = new Map(prev.map((s) => [s.id, s.rank]))
        const updated = rawSchools.map((school, index) => {
          const prevRank = prevMap.get(school.id) ?? index + 1
          const currentRank = index + 1
          return {
            ...school,
            rank: currentRank,
            previousRank: prevRank,
            rankChange: prevRank - currentRank,
          } as LeaderboardEntry
        })
        return updated
      })
      setLoading(false)
    })
    return unsub
  }, [])

  return { schools, loading }
}

// ─── ACTIVITY FEED ───────────────────────────────────────────────────────────

export function useActivity(count = 20) {
  const [items, setItems] = useState<ActivityFeedItem[]>([])

  useEffect(() => {
    const unsub = subscribeToActivity(setItems, count)
    return unsub
  }, [count])

  return items
}

// ─── EVENTS ─────────────────────────────────────────────────────────────────

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToEvents((evts) => {
      setEvents(evts)
      setLoading(false)
    })
    return unsub
  }, [])

  return { events, loading }
}

// ─── ANNOUNCEMENTS ───────────────────────────────────────────────────────────

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    const unsub = subscribeToAnnouncements(setAnnouncements)
    return unsub
  }, [])

  return announcements
}

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────

export function useAnimatedCounter(target: number, duration = 800) {
  const [current, setCurrent] = useState(target)

  useEffect(() => {
    const start = current
    const diff = target - start
    if (diff === 0) return

    const startTime = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCurrent(Math.round(start + diff * eased))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target])

  return current
}
