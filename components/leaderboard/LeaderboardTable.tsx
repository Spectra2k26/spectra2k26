'use client'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react'
import { useLeaderboard, useAnimatedCounter } from '@/hooks'
import type { LeaderboardEntry } from '@/types'
import Link from 'next/link'

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <span className="font-display font-black text-xl rank-1">#{rank}</span>
  )
  if (rank === 2) return (
    <span className="font-display font-black text-xl rank-2">#{rank}</span>
  )
  if (rank === 3) return (
    <span className="font-display font-black text-xl rank-3">#{rank}</span>
  )
  return (
    <span className="font-display font-semibold text-lg text-gray-500">#{rank}</span>
  )
}

function RankChangeIndicator({ change }: { change: number }) {
  if (change > 0) return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-0.5 text-emerald-400 text-xs font-semibold"
    >
      <TrendingUp size={12} />
      <span>+{change}</span>
    </motion.div>
  )
  if (change < 0) return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-0.5 text-red-400 text-xs font-semibold"
    >
      <TrendingDown size={12} />
      <span>{change}</span>
    </motion.div>
  )
  return (
    <div className="flex items-center gap-0.5 text-gray-600 text-xs">
      <Minus size={10} />
    </div>
  )
}

function PointBar({ points, maxPoints }: { points: number; maxPoints: number }) {
  const pct = maxPoints > 0 ? (points / maxPoints) * 100 : 0
  return (
    <div className="w-full bg-spectra-border rounded-full h-1.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full bg-gradient-to-r from-spectra-emerald-dark to-spectra-emerald"
      />
    </div>
  )
}

function LeaderboardRow({
  school,
  maxPoints,
  index,
}: {
  school: LeaderboardEntry
  maxPoints: number
  index: number
}) {
  const animatedPoints = useAnimatedCounter(school.totalPoints, 600)

  const rowBg =
    school.rank === 1
      ? 'bg-gradient-to-r from-yellow-900/10 to-transparent border-yellow-500/10'
      : school.rank === 2
      ? 'bg-gradient-to-r from-gray-700/10 to-transparent border-gray-500/10'
      : school.rank === 3
      ? 'bg-gradient-to-r from-orange-900/10 to-transparent border-orange-600/10'
      : 'border-spectra-border/50'

  return (
    <motion.div
      layout
      layoutId={school.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        layout: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      }}
      className={`leaderboard-row group relative border rounded-xl p-4 mb-2 ${rowBg} cursor-pointer`}
    >
      <Link href={`/school/${school.id}`} className="block">
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div className="w-12 flex-shrink-0 flex flex-col items-center gap-0.5">
            <RankBadge rank={school.rank} />
            <RankChangeIndicator change={school.rankChange ?? 0} />
          </div>

          {/* School info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {school.rank <= 3 && (
                <span className="text-lg">
                  {school.rank === 1 ? '🥇' : school.rank === 2 ? '🥈' : '🥉'}
                </span>
              )}
              <p className="font-display font-semibold text-white truncate text-sm sm:text-base group-hover:text-spectra-emerald transition-colors">
                {school.name}
              </p>
            </div>
            <PointBar points={school.totalPoints} maxPoints={maxPoints} />
          </div>

          {/* Points */}
          <div className="text-right flex-shrink-0">
            <motion.p
              key={animatedPoints}
              className="font-display font-black text-xl sm:text-2xl text-white"
            >
              {animatedPoints.toLocaleString()}
            </motion.p>
            <p className="text-xs text-gray-500">points</p>
          </div>
        </div>
      </Link>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-spectra-emerald/20" />
    </motion.div>
  )
}

export default function LeaderboardTable({ showAll = false }: { showAll?: boolean }) {
  const { schools, loading } = useLeaderboard()
  const displayed = showAll ? schools : schools.slice(0, 20)
  const maxPoints = schools[0]?.totalPoints ?? 1

  const MotionRow = motion(LeaderboardRow)

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-spectra-card animate-pulse border border-spectra-border" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 px-4 mb-3 text-xs font-display tracking-widest uppercase text-gray-600">
        <span className="w-12 text-center">Rank</span>
        <span className="flex-1">School</span>
        <span className="w-24 text-right">Points</span>
      </div>

      <AnimatePresence>
        {displayed.map((school, index) => (
          <MotionRow
            key={school.id}
            school={school}
            maxPoints={maxPoints}
            index={index}
          />
        ))}
      </AnimatePresence>

      {!showAll && schools.length > 20 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 text-sm text-gray-500 font-body"
        >
          Showing top 20 of {schools.length} schools
        </motion.div>
      )}
    </div>
  )
}
