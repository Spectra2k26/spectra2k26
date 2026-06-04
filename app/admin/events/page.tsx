'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEvents, useLeaderboard, useAuth } from '@/hooks'
import { createEvent, deleteEvent, awardEventPoints } from '@/lib/db'
import { Plus, Trophy, Trash2, CheckCircle, Calendar } from 'lucide-react'
import type { Event } from '@/types'

const CATEGORIES = ['Dance', 'Music', 'Drama', 'Quiz', 'Sports', 'Art', 'Photography', 'Debate', 'Fashion', 'Other']

function AwardModal({
  event,
  onClose,
}: {
  event: Event
  onClose: () => void
}) {
  const { schools } = useLeaderboard()
  const { user } = useAuth()
  const [results, setResults] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const setResult = (schoolId: string, position: string) => {
    setResults((prev) => {
      const next = { ...prev }
      // Remove this school from any other slot
      Object.keys(next).forEach((k) => { if (next[k] === position && k !== schoolId) delete next[k] })
      if (position === '') delete next[schoolId]
      else next[schoolId] = position
      return next
    })
  }

  const handleAward = async () => {
    setLoading(true)
    try {
      const resultList = Object.entries(results)
        .filter(([, pos]) => pos !== '')
        .map(([schoolId, pos]) => {
          const school = schools.find((s) => s.id === schoolId)!
          return {
            schoolId,
            schoolName: school.name,
            position: (pos === 'consolation' ? 'consolation' : parseInt(pos)) as 1 | 2 | 3 | 'consolation',
          }
        })
      await awardEventPoints(event, resultList, user?.email ?? 'admin')
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass rounded-2xl border border-spectra-emerald/20 p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-white">
            🎭 Award Points — {event.name}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>

        {/* Points legend */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { label: '🥇 1st', pts: event.firstPlacePoints },
            { label: '🥈 2nd', pts: event.secondPlacePoints },
            { label: '🥉 3rd', pts: event.thirdPlacePoints },
            { label: '🎖 Consolation', pts: event.consolationPoints },
          ].map(({ label, pts }) => (
            <div key={label} className="glass rounded-lg px-3 py-2 border border-spectra-border text-xs font-body">
              <span className="text-gray-400">{label}: </span>
              <span className="text-spectra-emerald font-bold">+{pts} pts</span>
            </div>
          ))}
        </div>

        {/* School list */}
        <div className="space-y-2">
          {schools.map((school) => (
            <div key={school.id} className="flex items-center justify-between gap-3 glass rounded-lg p-3 border border-spectra-border">
              <span className="text-sm text-white font-body">{school.name}</span>
              <select
                value={results[school.id] ?? ''}
                onChange={(e) => setResult(school.id, e.target.value)}
                className="spectra-input w-40 text-sm py-1.5"
              >
                <option value="">Not placed</option>
                <option value="1">🥇 1st Place (+{event.firstPlacePoints})</option>
                <option value="2">🥈 2nd Place (+{event.secondPlacePoints})</option>
                <option value="3">🥉 3rd Place (+{event.thirdPlacePoints})</option>
                <option value="consolation">🎖 Consolation (+{event.consolationPoints})</option>
              </select>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAward}
            disabled={loading || Object.keys(results).length === 0}
            className="btn-emerald flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trophy size={16} />
            )}
            Award Points & Publish Results
          </motion.button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg glass border border-spectra-border text-gray-400 font-body text-sm"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function EventsPage() {
  const { events, loading } = useEvents()
  const [showCreate, setShowCreate] = useState(false)
  const [awardEvent, setAwardEvent] = useState<Event | null>(null)
  const [form, setForm] = useState({
    name: '',
    category: 'Dance',
    firstPlacePoints: 100,
    secondPlacePoints: 75,
    thirdPlacePoints: 50,
    consolationPoints: 25,
  })
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    if (!form.name.trim()) return
    setCreating(true)
    await createEvent(form)
    setForm({ name: '', category: 'Dance', firstPlacePoints: 100, secondPlacePoints: 75, thirdPlacePoints: 50, consolationPoints: 25 })
    setShowCreate(false)
    setCreating(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white">Events</h1>
          <p className="text-sm text-gray-500 font-body mt-1">
            {events.filter((e) => e.isCompleted).length}/{events.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-emerald flex items-center gap-2"
        >
          <Plus size={16} />
          Create Event
        </button>
      </div>

      {/* Create event panel */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl border border-spectra-emerald/20 p-6 mb-6 overflow-hidden"
          >
            <h3 className="font-display font-bold text-white mb-5">New Event</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-display tracking-wider uppercase text-gray-500 mb-2 block">Event Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Dance Competition"
                  className="spectra-input"
                />
              </div>
              <div>
                <label className="text-xs font-display tracking-wider uppercase text-gray-500 mb-2 block">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="spectra-input"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { key: 'firstPlacePoints', label: '🥇 1st Place' },
                { key: 'secondPlacePoints', label: '🥈 2nd Place' },
                { key: 'thirdPlacePoints', label: '🥉 3rd Place' },
                { key: 'consolationPoints', label: '🎖 Consolation' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block font-body">{label}</label>
                  <input
                    type="number"
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: parseInt(e.target.value) || 0 }))}
                    className="spectra-input text-sm"
                    min="0"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={creating || !form.name.trim()}
                className="btn-emerald flex items-center gap-2 disabled:opacity-50"
              >
                {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Calendar size={16} />}
                Create Event
              </button>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg glass border border-spectra-border text-gray-400 font-body text-sm">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events list */}
      <div className="space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-spectra-card animate-pulse border border-spectra-border" />)
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No events created yet.</div>
        ) : (
          events.map((event) => (
            <motion.div
              key={event.id}
              layout
              className={`glass rounded-xl border p-5 flex items-center gap-4 ${event.isCompleted ? 'border-spectra-emerald/20 bg-spectra-emerald/5' : 'border-spectra-border'}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {event.isCompleted && <CheckCircle size={14} className="text-spectra-emerald" />}
                  <h3 className="font-display font-bold text-white">{event.name}</h3>
                  <span className="text-xs text-gray-500 bg-spectra-card px-2 py-0.5 rounded-full font-body">{event.category}</span>
                </div>
                <div className="flex gap-3 text-xs text-gray-500 font-body">
                  <span>1st: <strong className="text-white">+{event.firstPlacePoints}</strong></span>
                  <span>2nd: <strong className="text-white">+{event.secondPlacePoints}</strong></span>
                  <span>3rd: <strong className="text-white">+{event.thirdPlacePoints}</strong></span>
                  <span>Consolation: <strong className="text-white">+{event.consolationPoints}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!event.isCompleted && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAwardEvent(event)}
                    className="btn-emerald flex items-center gap-2 text-sm py-2"
                  >
                    <Trophy size={14} />
                    Award Points
                  </motion.button>
                )}
                {event.isCompleted && (
                  <span className="text-xs text-spectra-emerald font-display tracking-wider">COMPLETED</span>
                )}
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {awardEvent && <AwardModal event={awardEvent} onClose={() => setAwardEvent(null)} />}
      </AnimatePresence>
    </div>
  )
}
