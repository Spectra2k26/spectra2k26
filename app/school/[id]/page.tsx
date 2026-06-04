'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Award, Clock } from 'lucide-react'
import { getSchoolById, getTransactionsBySchool } from '@/lib/db'
import { useLeaderboard } from '@/hooks'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { School, PointTransaction } from '@/types'
import AnnouncementTicker from '@/components/ui/AnnouncementTicker'
import SpectraLogo from '@/components/ui/SpectraLogo'

export default function SchoolProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [school, setSchool] = useState<School | null>(null)
  const [transactions, setTransactions] = useState<PointTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const { schools } = useLeaderboard()

  const liveSchool = schools.find((s) => s.id === id)

  useEffect(() => {
    if (!id) return
    Promise.all([getSchoolById(id as string), getTransactionsBySchool(id as string)]).then(
      ([s, tx]) => {
        setSchool(s)
        setTransactions(tx)
        setLoading(false)
      }
    )
  }, [id])

  // Build cumulative points chart data
  const chartData = (() => {
    let cumulative = 0
    const reversed = [...transactions].reverse()
    return reversed.map((tx) => {
      cumulative += tx.points
      return {
        time: tx.timestamp instanceof Date
          ? tx.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          : '',
        points: cumulative,
        event: tx.eventName ?? tx.reason,
      }
    })
  })()

  const currentSchool = liveSchool ?? school
  const rank = liveSchool?.rank ?? '—'

  const achievements = (() => {
    const list = []
    if (rank === 1) list.push({ icon: '👑', label: 'Current Champion' })
    if (rank !== '—' && typeof rank === 'number' && rank <= 3) list.push({ icon: '🏆', label: 'Top 3 School' })
    if (transactions.length >= 5) list.push({ icon: '⚡', label: 'Active Participant' })
    const eventWins = transactions.filter((t) => t.eventName && t.points === 100).length
    if (eventWins >= 2) list.push({ icon: '🥇', label: 'Multiple Event Winner' })
    const maxPoints = Math.max(...transactions.map((t) => t.points), 0)
    if (maxPoints >= 100) list.push({ icon: '🔥', label: 'Big Point Earner' })
    return list
  })()

  if (loading) {
    return (
      <div className="min-h-screen bg-spectra-black flex items-center justify-center">
        <SpectraLogo size={60} className="animate-pulse" />
      </div>
    )
  }

  if (!currentSchool) {
    return (
      <div className="min-h-screen bg-spectra-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg font-body mb-4">School not found</p>
          <Link href="/" className="btn-emerald">Back to Leaderboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-spectra-black grid-pattern">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-spectra-emerald/3 rounded-full blur-3xl" />
      </div>

      <AnnouncementTicker />

      {/* Header */}
      <header className="relative border-b border-spectra-border bg-spectra-dark/60">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <SpectraLogo size={36} />
          <div>
            <p className="text-xs text-gray-500 font-body tracking-widest uppercase">School Profile</p>
            <h1 className="font-display font-black text-xl text-white">{currentSchool.name}</h1>
          </div>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-6 py-8">
        {/* Hero stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="glass rounded-xl border border-yellow-500/20 p-5 text-center">
            <p className="font-display font-black text-4xl text-yellow-400">#{rank}</p>
            <p className="text-xs text-gray-500 font-body mt-1">Current Rank</p>
          </div>
          <div className="glass rounded-xl border border-spectra-emerald/20 p-5 text-center">
            <p className="font-display font-black text-4xl text-spectra-emerald">
              {(currentSchool.totalPoints ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 font-body mt-1">Total Points</p>
          </div>
          <div className="glass rounded-xl border border-spectra-border p-5 text-center">
            <p className="font-display font-black text-4xl text-white">{transactions.length}</p>
            <p className="text-xs text-gray-500 font-body mt-1">Point Events</p>
          </div>
        </motion.div>

        {/* Chart */}
        {chartData.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl border border-spectra-border p-6 mb-6"
          >
            <h2 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-spectra-emerald" />
              Points Trend
            </h2>
            <div style={{ height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: '#0d1426', border: '1px solid #1a2540', borderRadius: 8, color: 'white' }}
                    formatter={(v: any) => [`${v} pts`, 'Cumulative']}
                  />
                  <Line
                    type="monotone"
                    dataKey="points"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl border border-spectra-border p-5"
          >
            <h2 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <Award size={16} className="text-spectra-gold" />
              Achievements
            </h2>
            {achievements.length > 0 ? (
              <div className="space-y-2">
                {achievements.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 bg-spectra-card/60 rounded-lg px-3 py-2.5 border border-spectra-border"
                  >
                    <span className="text-xl">{a.icon}</span>
                    <span className="text-sm font-body text-white">{a.label}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 font-body">No achievements yet. Participate in events!</p>
            )}
          </motion.div>

          {/* Transaction history */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl border border-spectra-border p-5"
          >
            <h2 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              Points History
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {transactions.length === 0 ? (
                <p className="text-sm text-gray-600 font-body">No point history yet.</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between gap-2 py-2 border-b border-spectra-border last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 font-body truncate">{tx.reason}</p>
                      {tx.eventName && (
                        <p className="text-xs text-gray-600 font-body">{tx.eventName}</p>
                      )}
                    </div>
                    <span className="font-display font-bold text-spectra-emerald text-sm flex-shrink-0">
                      +{tx.points}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
