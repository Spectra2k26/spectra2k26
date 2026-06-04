'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, TrendingUp } from 'lucide-react'
import { useLeaderboard, useAnimatedCounter } from '@/hooks'

export default function ChampionCard() {
  const { schools } = useLeaderboard()
  const champion = schools[0]
  const second = schools[1]
  const lead = champion && second ? champion.totalPoints - second.totalPoints : 0
  const points = useAnimatedCounter(champion?.totalPoints ?? 0)
  const leadPoints = useAnimatedCounter(lead)

  if (!champion) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl border border-yellow-500/30 glass-gold p-6"
    >
      {/* Background shimmer */}
      <div className="absolute inset-0 shimmer pointer-events-none" />
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl" />
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          {/* Label */}
          <div className="flex items-center gap-2 mb-3">
            <Crown size={16} className="text-yellow-400 crown" />
            <span className="text-xs font-display tracking-widest uppercase text-yellow-500">
              Current Champion
            </span>
          </div>

          {/* School name */}
          <AnimatePresence mode="wait">
            <motion.h2
              key={champion.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-display font-black text-2xl text-white leading-tight mb-3"
            >
              {champion.name}
            </motion.h2>
          </AnimatePresence>

          {/* Points */}
          <motion.p className="font-display font-black text-4xl text-glow-gold text-yellow-400">
            {points.toLocaleString()}
          </motion.p>
          <p className="text-xs text-gray-500 mt-1">total points</p>
        </div>

        {/* Lead badge */}
        <div className="flex-shrink-0">
          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-600/10 border border-yellow-500/30 rounded-xl p-4 text-center">
            <div className="flex items-center gap-1 text-yellow-400 mb-1 justify-center">
              <TrendingUp size={14} />
              <span className="text-xs font-display uppercase tracking-wider">Lead</span>
            </div>
            <p className="font-display font-black text-2xl text-yellow-300">
              +{leadPoints.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">ahead of #2</p>
          </div>
        </div>
      </div>

      {/* Crown emoji decoration */}
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute top-4 right-4 text-4xl opacity-10 pointer-events-none"
      >
        👑
      </motion.div>
    </motion.div>
  )
}
