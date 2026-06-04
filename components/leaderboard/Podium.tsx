'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useLeaderboard, useAnimatedCounter } from '@/hooks'
import type { LeaderboardEntry } from '@/types'

function PodiumCard({
  school,
  position,
  delay,
}: {
  school: LeaderboardEntry | null
  position: 1 | 2 | 3
  delay: number
}) {
  const points = useAnimatedCounter(school?.totalPoints ?? 0)

  const config = {
    1: {
      medal: '🥇',
      label: 'Champion',
      height: 'h-36',
      barHeight: 'h-24',
      gradient: 'from-yellow-500/20 via-amber-400/10 to-transparent',
      border: 'border-yellow-500/40',
      glow: 'shadow-[0_0_40px_rgba(245,158,11,0.25)]',
      textColor: 'text-yellow-400',
      badgeGrad: 'from-yellow-500 to-amber-600',
      podiumColor: 'bg-gradient-to-t from-yellow-700/30 to-yellow-500/10',
      podiumBorder: 'border-yellow-500/30',
      crownSize: 'text-4xl',
      order: 'order-2',
    },
    2: {
      medal: '🥈',
      label: '1st Runner-Up',
      height: 'h-28',
      barHeight: 'h-16',
      gradient: 'from-gray-400/20 via-gray-300/10 to-transparent',
      border: 'border-gray-400/30',
      glow: 'shadow-[0_0_25px_rgba(156,163,175,0.15)]',
      textColor: 'text-gray-300',
      badgeGrad: 'from-gray-400 to-gray-600',
      podiumColor: 'bg-gradient-to-t from-gray-700/30 to-gray-500/10',
      podiumBorder: 'border-gray-400/20',
      crownSize: 'text-3xl',
      order: 'order-1',
    },
    3: {
      medal: '🥉',
      label: '2nd Runner-Up',
      height: 'h-24',
      barHeight: 'h-12',
      gradient: 'from-orange-600/20 via-orange-500/10 to-transparent',
      border: 'border-orange-600/30',
      glow: 'shadow-[0_0_20px_rgba(205,124,60,0.15)]',
      textColor: 'text-orange-400',
      badgeGrad: 'from-orange-500 to-orange-700',
      podiumColor: 'bg-gradient-to-t from-orange-900/30 to-orange-700/10',
      podiumBorder: 'border-orange-600/20',
      crownSize: 'text-2xl',
      order: 'order-3',
    },
  }[position]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col items-center ${config.order}`}
    >
      {/* School card */}
      <div
        className={`relative w-52 mb-3 rounded-xl p-4 bg-gradient-to-b ${config.gradient} border ${config.border} ${config.glow} flex flex-col items-center gap-2`}
      >
        {position === 1 && (
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="text-3xl mb-1"
          >
            👑
          </motion.div>
        )}

        <span className={`text-5xl ${position === 1 ? 'animate-float' : ''}`}>{config.medal}</span>

        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={school?.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="font-display font-bold text-white text-sm leading-tight text-center"
            >
              {school?.name ?? '—'}
            </motion.p>
          </AnimatePresence>

          <motion.p
            key={points}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-display font-black text-2xl mt-1 ${config.textColor}`}
          >
            {points.toLocaleString()}
          </motion.p>
          <p className="text-xs text-gray-500 mt-0.5">points</p>
        </div>

        <span
          className={`text-xs font-display font-semibold tracking-widest uppercase bg-gradient-to-r ${config.badgeGrad} bg-clip-text text-transparent`}
        >
          {config.label}
        </span>

        {/* Shimmer overlay */}
        {position === 1 && (
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="shimmer absolute inset-0 rounded-xl" />
          </div>
        )}
      </div>

      {/* Podium block */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.5, ease: 'easeOut' }}
        style={{ transformOrigin: 'bottom' }}
        className={`w-52 ${config.barHeight} ${config.podiumColor} border-t border-x ${config.podiumBorder} rounded-t-lg flex items-center justify-center`}
      >
        <span className={`font-display font-black text-3xl ${config.textColor} opacity-40`}>
          {position}
        </span>
      </motion.div>
    </motion.div>
  )
}

export default function Podium() {
  const { schools } = useLeaderboard()
  const top3 = schools.slice(0, 3)

  return (
    <div className="relative py-10">
      {/* Glow backdrop */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <div className="w-96 h-32 bg-spectra-emerald/5 rounded-full blur-3xl" />
        <div className="w-64 h-32 bg-spectra-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative flex items-end justify-center gap-4 px-4">
        <PodiumCard school={top3[1] ?? null} position={2} delay={0.2} />
        <PodiumCard school={top3[0] ?? null} position={1} delay={0} />
        <PodiumCard school={top3[2] ?? null} position={3} delay={0.4} />
      </div>
    </div>
  )
}
