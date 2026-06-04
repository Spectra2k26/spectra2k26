'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLeaderboard, useEvents } from '@/hooks'
import { getClosingCeremonyData } from '@/lib/db'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Download, Lock } from 'lucide-react'

export default function StatsPage() {
  const { schools } = useLeaderboard()
  const { events } = useEvents()
  const [closing, setClosing] = useState(false)
  const [closingData, setClosingData] = useState<any>(null)

  const totalPoints = schools.reduce((s, x) => s + x.totalPoints, 0)
  const completedEvents = events.filter((e) => e.isCompleted).length
  const avgPoints = schools.length > 0 ? Math.round(totalPoints / schools.length) : 0

  const chartData = schools.slice(0, 12).map((s) => ({
    name: s.name.split(' ').slice(0, 2).join(' '),
    points: s.totalPoints,
  }))

  const handleClosing = async () => {
    setClosing(true)
    const data = await getClosingCeremonyData()
    setClosingData(data)
    setClosing(false)
  }

  const handleExportPDF = () => {
    if (!closingData) return
    const lines = [
      'SPECTRA 2K26 - FINAL RANKINGS',
      '================================',
      '',
      'OVERALL CHAMPION',
      `${closingData.schools[0]?.name} - ${closingData.schools[0]?.totalPoints} Points`,
      '',
      '1ST RUNNER-UP',
      `${closingData.schools[1]?.name} - ${closingData.schools[1]?.totalPoints} Points`,
      '',
      '2ND RUNNER-UP',
      `${closingData.schools[2]?.name} - ${closingData.schools[2]?.totalPoints} Points`,
      '',
      'TOP 10 RANKINGS',
      '===============',
      ...closingData.schools.slice(0, 10).map((s: any, i: number) =>
        `#${i + 1}. ${s.name} - ${s.totalPoints} Points`
      ),
      '',
      `Total Events: ${closingData.events.length}`,
      `Total Points Awarded: ${closingData.schools.reduce((a: number, s: any) => a + s.totalPoints, 0)}`,
    ]
    const text = lines.join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'spectra2k26-final-report.txt'
    a.click()
  }

  const COLORS = ['#f59e0b', '#9ca3af', '#cd7c3c', '#10b981', '#6366f1', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4', '#84cc16', '#ef4444']

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-white">Statistics</h1>
        <p className="text-sm text-gray-500 font-body mt-1">Championship overview and closing ceremony tools</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Schools', value: schools.length, icon: '🏫', color: 'border-spectra-border' },
          { label: 'Total Points', value: totalPoints.toLocaleString(), icon: '⚡', color: 'border-spectra-emerald/20' },
          { label: 'Events Completed', value: `${completedEvents} / ${events.length}`, icon: '✅', color: 'border-green-500/20' },
          { label: 'Average Points', value: avgPoints.toLocaleString(), icon: '📊', color: 'border-blue-500/20' },
          { label: 'Champion', value: schools[0]?.name?.split(' ')[0] ?? '—', icon: '👑', color: 'border-yellow-500/20' },
          { label: 'Remaining Events', value: events.length - completedEvents, icon: '🎯', color: 'border-purple-500/20' },
        ].map(({ label, value, icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`glass rounded-xl border ${color} p-5 flex items-center gap-3`}
          >
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="font-display font-black text-2xl text-white">{value}</p>
              <p className="text-xs text-gray-500 font-body">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="glass rounded-xl border border-spectra-border p-6 mb-8">
        <h2 className="font-display font-semibold text-white mb-6">Points by School</h2>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 60, left: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'Exo 2' }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: '#0d1426',
                  border: '1px solid #1a2540',
                  borderRadius: 8,
                  color: 'white',
                  fontFamily: 'Exo 2',
                }}
              />
              <Bar dataKey="points" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Closing Ceremony */}
      <div className="glass rounded-xl border border-yellow-500/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <Lock size={18} className="text-yellow-400" />
              Closing Ceremony Mode
            </h2>
            <p className="text-sm text-gray-500 font-body mt-1">
              Generate and lock final rankings for the closing ceremony.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClosing}
            disabled={closing}
            className="px-5 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-display font-semibold text-sm hover:bg-yellow-500/20 transition-all disabled:opacity-50"
          >
            {closing ? (
              <div className="w-4 h-4 border-2 border-yellow-500/30 border-t-yellow-400 rounded-full animate-spin mx-3" />
            ) : '🏆 Generate Final Report'}
          </motion.button>
        </div>

        {closingData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            {/* Podium */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {closingData.schools.slice(0, 3).map((s: any, i: number) => {
                const medals = ['🥇', '🥈', '🥉']
                const labels = ['Overall Champion', '1st Runner-Up', '2nd Runner-Up']
                const colors = ['text-yellow-400 border-yellow-500/30', 'text-gray-300 border-gray-500/20', 'text-orange-400 border-orange-600/25']
                return (
                  <div key={s.id} className={`glass rounded-xl border p-4 text-center ${colors[i]}`}>
                    <p className="text-3xl mb-2">{medals[i]}</p>
                    <p className="font-display font-bold text-white text-sm mb-1">{s.name}</p>
                    <p className={`font-display font-black text-2xl ${colors[i].split(' ')[0]}`}>{s.totalPoints.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-1">{labels[i]}</p>
                  </div>
                )
              })}
            </div>

            {/* Top 10 */}
            <div className="glass rounded-xl border border-spectra-border p-4 mb-4">
              <h3 className="font-display font-semibold text-white mb-3">Top 10 Final Rankings</h3>
              {closingData.schools.slice(0, 10).map((s: any, i: number) => (
                <div key={s.id} className="flex items-center gap-3 py-2 border-b border-spectra-border last:border-0">
                  <span className="font-display font-bold text-gray-500 w-6">#{i + 1}</span>
                  <span className="flex-1 text-sm text-white font-body">{s.name}</span>
                  <span className="font-display font-bold text-spectra-emerald">{s.totalPoints.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleExportPDF}
              className="btn-emerald flex items-center gap-2"
            >
              <Download size={16} />
              Export Final Report
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
