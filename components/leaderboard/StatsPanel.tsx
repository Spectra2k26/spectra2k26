'use client'
import { motion } from 'framer-motion'
import { useLeaderboard, useEvents } from '@/hooks'

function StatCard({
  label,
  value,
  icon,
  color,
  delay,
}: {
  label: string
  value: string | number
  icon: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`glass rounded-xl p-4 border ${color} flex items-center gap-3`}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-2xl font-display font-black text-white">{value}</p>
        <p className="text-xs text-gray-500 font-body mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}

export default function StatsPanel() {
  const { schools } = useLeaderboard()
  const { events } = useEvents()

  const totalPoints = schools.reduce((s, x) => s + x.totalPoints, 0)
  const completedEvents = events.filter((e) => e.isCompleted).length
  const avgPoints = schools.length > 0 ? Math.round(totalPoints / schools.length) : 0

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <StatCard label="Schools" value={schools.length} icon="🏫" color="border-spectra-border" delay={0} />
      <StatCard label="Points Awarded" value={totalPoints.toLocaleString()} icon="⚡" color="border-spectra-emerald/20" delay={0.1} />
      <StatCard label="Events Done" value={`${completedEvents}/${events.length}`} icon="🎭" color="border-purple-500/20" delay={0.2} />
      <StatCard label="Avg Points" value={avgPoints.toLocaleString()} icon="📊" color="border-blue-500/20" delay={0.3} />
      <StatCard label="Top School" value={schools[0]?.name?.split(' ')[0] ?? '—'} icon="🥇" color="border-yellow-500/20" delay={0.4} />
      <StatCard label="Total Events" value={events.length} icon="🎯" color="border-spectra-border" delay={0.5} />
    </div>
  )
}
