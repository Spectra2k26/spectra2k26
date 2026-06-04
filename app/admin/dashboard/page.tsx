'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLeaderboard, useActivity, useAuth } from '@/hooks'
import { updateSchoolPoints } from '@/lib/db'
import { Plus, Zap, CheckCircle } from 'lucide-react'
import type { LeaderboardEntry } from '@/types'

const QUICK_POINTS = [10, 20, 50, 75, 100]

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="toast flex items-center gap-3 bg-spectra-card border border-spectra-emerald/30 rounded-xl p-4 shadow-2xl"
    >
      <CheckCircle size={20} className="text-spectra-emerald flex-shrink-0" />
      <p className="text-sm text-white font-body">{message}</p>
      <button onClick={onClose} className="ml-auto text-gray-500 hover:text-white">✕</button>
    </motion.div>
  )
}

function SchoolPointCard({ school }: { school: LeaderboardEntry }) {
  const { user } = useAuth()
  const [customPoints, setCustomPoints] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  const awardPoints = async (pts: number) => {
    if (!user || pts === 0) return
    setLoading(true)
    try {
      await updateSchoolPoints(
        school.id,
        school.name,
        pts,
        reason || `Quick award +${pts}`,
        user.email ?? 'admin'
      )
      showToast(`+${pts} awarded to ${school.name}`)
      setCustomPoints('')
      setReason('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCustom = () => {
    const pts = parseInt(customPoints)
    if (isNaN(pts) || pts <= 0) return
    awardPoints(pts)
  }

  const rankColors: Record<number, string> = {
    1: 'border-yellow-500/30 from-yellow-900/10',
    2: 'border-gray-500/25 from-gray-700/10',
    3: 'border-orange-600/25 from-orange-900/10',
  }

  const borderClass = rankColors[school.rank] ?? 'border-spectra-border from-transparent'

  return (
    <motion.div
      layout
      layoutId={`card-${school.id}`}
      className={`relative glass rounded-xl border bg-gradient-to-br ${borderClass} to-transparent p-5`}
    >
      {/* School name + rank */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{school.rank === 1 ? '🥇' : school.rank === 2 ? '🥈' : school.rank === 3 ? '🥉' : ''}</span>
            <h3 className="font-display font-bold text-white">{school.name}</h3>
          </div>
          <p className="text-xs text-gray-500 font-body mt-0.5">Rank #{school.rank}</p>
        </div>
        <div className="text-right">
          <p className="font-display font-black text-2xl text-spectra-emerald">
            {school.totalPoints.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600">pts</p>
        </div>
      </div>

      {/* Quick points */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {QUICK_POINTS.map((pts) => (
          <motion.button
            key={pts}
            whileTap={{ scale: 0.92 }}
            disabled={loading}
            onClick={() => awardPoints(pts)}
            className="px-3 py-1.5 rounded-lg bg-spectra-emerald/10 border border-spectra-emerald/20 text-spectra-emerald text-xs font-display font-semibold hover:bg-spectra-emerald/20 hover:border-spectra-emerald/40 transition-all disabled:opacity-50"
          >
            +{pts}
          </motion.button>
        ))}
      </div>

      {/* Reason */}
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional)"
        className="spectra-input text-sm mb-2"
      />

      {/* Custom value */}
      <div className="flex gap-2">
        <input
          type="number"
          value={customPoints}
          onChange={(e) => setCustomPoints(e.target.value)}
          placeholder="Custom points..."
          min="1"
          className="spectra-input text-sm flex-1"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={loading || !customPoints}
          onClick={handleCustom}
          className="btn-emerald flex items-center gap-1 px-4 text-sm flex-shrink-0 disabled:opacity-50"
        >
          <Zap size={14} />
          Award
        </motion.button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-3 left-3 right-3 bg-spectra-emerald/20 border border-spectra-emerald/30 rounded-lg px-3 py-2 text-xs text-spectra-emerald font-body flex items-center gap-2"
          >
            <CheckCircle size={12} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { schools, loading } = useLeaderboard()
  const activity = useActivity(10)
  const [search, setSearch] = useState('')

  const filtered = schools.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white">
            Point Management
          </h1>
          <p className="text-sm text-gray-500 font-body mt-1">
            Award points to schools in real-time. All actions are logged.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-spectra-emerald animate-pulse" />
          <span className="text-xs text-gray-500 font-body">Live sync active</span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search schools..."
          className="spectra-input max-w-md text-sm"
        />
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-52 rounded-xl bg-spectra-card animate-pulse border border-spectra-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((school) => (
              <SchoolPointCard key={school.id} school={school} />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-500">
              No schools found. Add schools from the Schools page.
            </div>
          )}
        </div>
      )}

      {/* Recent activity */}
      <div className="mt-10">
        <h2 className="font-display font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {activity.slice(0, 5).map((item) => (
            <div key={item.id} className="glass rounded-lg p-3 border border-spectra-border flex items-center gap-3">
              <span className="text-lg">
                {item.type === 'points_awarded' ? '⚡' : item.type === 'event_completed' ? '🎭' : '📢'}
              </span>
              <div className="flex-1">
                <p className="text-sm text-gray-200 font-body">{item.message}</p>
                <p className="text-xs text-gray-600">
                  {item.timestamp instanceof Date
                    ? item.timestamp.toLocaleTimeString()
                    : 'just now'}
                </p>
              </div>
              {item.points && (
                <span className="text-sm font-display font-bold text-spectra-emerald">+{item.points}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
