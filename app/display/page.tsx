'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minimize2, Maximize2, X } from 'lucide-react'
import { useLeaderboard, useActivity, useAnnouncements, useAnimatedCounter } from '@/hooks'
import SpectraLogo from '@/components/ui/SpectraLogo'
import type { LeaderboardEntry } from '@/types'

function DisplayRow({ school, index }: { school: LeaderboardEntry; index: number }) {
  const points = useAnimatedCounter(school.totalPoints, 600)
  const isTop3 = school.rank <= 3
  const medal = school.rank === 1 ? '🥇' : school.rank === 2 ? '🥈' : school.rank === 3 ? '🥉' : null

  const rankColor =
    school.rank === 1
      ? 'text-yellow-400'
      : school.rank === 2
      ? 'text-gray-300'
      : school.rank === 3
      ? 'text-orange-400'
      : 'text-gray-500'

  const rowBg = isTop3
    ? school.rank === 1
      ? 'bg-gradient-to-r from-yellow-900/20 to-transparent border-yellow-500/20'
      : school.rank === 2
      ? 'bg-gradient-to-r from-gray-700/15 to-transparent border-gray-500/20'
      : 'bg-gradient-to-r from-orange-900/15 to-transparent border-orange-600/20'
    : index % 2 === 0
    ? 'bg-spectra-card/30 border-spectra-border/30'
    : 'border-spectra-border/20'

  return (
    <motion.div
      layout
      layoutId={`display-${school.id}`}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ layout: { type: 'spring', stiffness: 250, damping: 28 }, delay: index * 0.03 }}
      className={`flex items-center gap-6 px-8 py-5 rounded-xl border ${rowBg} mb-2`}
    >
      {/* Rank */}
      <div className="w-20 flex-shrink-0 text-center">
        <span className={`font-display font-black text-3xl ${rankColor}`}>
          #{school.rank}
        </span>
      </div>

      {/* Medal + School */}
      <div className="flex-1 flex items-center gap-3">
        {medal && <span className="text-4xl">{medal}</span>}
        <span className="font-display font-bold text-white text-2xl tracking-wide">
          {school.name}
        </span>
        {school.rankChange !== undefined && school.rankChange !== 0 && (
          <span
            className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
              school.rankChange > 0
                ? 'text-emerald-400 bg-emerald-900/30'
                : 'text-red-400 bg-red-900/30'
            }`}
          >
            {school.rankChange > 0 ? '▲' : '▼'}
            {Math.abs(school.rankChange)}
          </span>
        )}
      </div>

      {/* Points */}
      <div className="text-right flex-shrink-0">
        <motion.p key={points} className={`font-display font-black text-4xl ${isTop3 ? rankColor : 'text-white'}`}>
          {points.toLocaleString()}
        </motion.p>
        <p className="text-sm text-gray-600 font-body">pts</p>
      </div>
    </motion.div>
  )
}

export default function DisplayPage() {
  const { schools } = useLeaderboard()
  const activity = useActivity(10)
  const announcements = useAnnouncements()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [time, setTime] = useState(new Date())
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout>()

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let direction = 1
    let pos = 0

    scrollIntervalRef.current = setInterval(() => {
      pos += direction * 1.2
      const max = container.scrollHeight - container.clientHeight

      if (pos >= max) {
        direction = -1
        setTimeout(() => {}, 2000) // pause at bottom
      }
      if (pos <= 0) {
        direction = 1
        setTimeout(() => {}, 2000) // pause at top
      }

      pos = Math.max(0, Math.min(pos, max))
      container.scrollTop = pos
    }, 50)

    return () => clearInterval(scrollIntervalRef.current)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const champion = schools[0]
  const lead = schools.length >= 2 ? schools[0]?.totalPoints - schools[1]?.totalPoints : 0

  const ticker = announcements.length > 0
    ? announcements.map((a) => a.text).join('   •   ')
    : '🏆 Welcome to Spectra 2K26   •   ⚡ Real-time championship leaderboard   •   🎭 Events in progress'

  return (
    <div className="min-h-screen bg-spectra-black grid-pattern flex flex-col overflow-hidden">
      {/* Fixed background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-spectra-emerald/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-spectra-gold/3 rounded-full blur-3xl" />
        {/* Background logo removed */}
      </div>

      {/* Announcement Ticker */}
      <div className="relative z-10 bg-gradient-to-r from-spectra-emerald/10 via-transparent to-spectra-emerald/10 border-b border-spectra-emerald/20 overflow-hidden h-10 flex items-center">
        <div className="flex items-center gap-3 px-6 flex-shrink-0 border-r border-spectra-emerald/20">
          <div className="w-2 h-2 rounded-full bg-spectra-emerald animate-pulse" />
          <span className="font-display text-xs tracking-widest uppercase text-spectra-emerald">Live</span>
        </div>
        <div className="overflow-hidden flex-1">
          <span className="ticker-content text-sm text-gray-300 font-body">{ticker}</span>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-spectra-border">
        <div className="flex items-center gap-5">
          <SpectraLogo size={60} />
          <div>
            <h1 className="font-display font-black text-4xl tracking-widest text-white text-glow-emerald">
              SPECTRA <span className="text-spectra-emerald">2K26</span>
            </h1>
            <p className="text-sm text-gray-500 font-body tracking-widest uppercase">
              Live Championship Leaderboard
            </p>
          </div>
        </div>

        {/* Right: time + controls */}
        <div className="flex items-center gap-6">
          {/* Champion pill */}
          {champion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden lg:flex items-center gap-3 glass-gold border border-yellow-500/30 rounded-2xl px-5 py-3"
            >
              <span className="text-2xl">👑</span>
              <div>
                <p className="text-xs text-yellow-500 font-display uppercase tracking-wider">Champion</p>
                <p className="font-display font-bold text-white text-sm">{champion.name}</p>
                <p className="font-display font-black text-yellow-400 text-lg">{champion.totalPoints.toLocaleString()} pts</p>
              </div>
            </motion.div>
          )}

          {/* Clock */}
          <div className="text-right">
            <p className="font-display font-black text-3xl text-white tabular-nums">
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-gray-500 font-body">
              {time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </p>
          </div>

          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="glass border border-spectra-border rounded-lg p-3 text-gray-400 hover:text-white hover:border-spectra-emerald/40 transition-all"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex gap-6 px-8 py-6 overflow-hidden">
        {/* Scrolling leaderboard */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-hidden"
          style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
        >
          {/* Column headers */}
          <div className="flex items-center gap-6 px-8 mb-4 text-xs font-display tracking-widest uppercase text-gray-600">
            <span className="w-20 text-center">Rank</span>
            <span className="flex-1">School</span>
            <span className="w-32 text-right">Points</span>
          </div>

          <AnimatePresence mode="popLayout">
            {schools.map((school, i) => (
              <DisplayRow key={school.id} school={school} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {/* Right sidebar: Activity */}
        <div className="w-80 flex-shrink-0 hidden xl:flex flex-col gap-4">
          {/* Activity feed */}
          <div className="glass rounded-xl border border-spectra-border p-5 flex-1 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-spectra-emerald animate-pulse" />
              <h3 className="font-display text-sm tracking-widest uppercase text-gray-400">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[calc(100%-2rem)]">
              <AnimatePresence mode="popLayout" initial={false}>
                {activity.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="glass rounded-lg p-3 border-l-2 border-l-spectra-emerald"
                  >
                    <p className="text-sm text-gray-200 font-body leading-snug">{item.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Top 3 mini podium */}
          <div className="glass rounded-xl border border-spectra-border p-5">
            <h3 className="font-display text-xs tracking-widest uppercase text-gray-500 mb-3">Top 3</h3>
            {schools.slice(0, 3).map((s, i) => {
              const medals = ['🥇', '🥈', '🥉']
              const colors = ['text-yellow-400', 'text-gray-300', 'text-orange-400']
              return (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-spectra-border last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{medals[i]}</span>
                    <span className="text-sm font-display text-white">{s.name}</span>
                  </div>
                  <span className={`font-display font-black text-lg ${colors[i]}`}>
                    {s.totalPoints.toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
