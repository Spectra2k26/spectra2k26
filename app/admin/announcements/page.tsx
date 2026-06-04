'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnnouncements } from '@/hooks'
import { addAnnouncement, deleteAnnouncement } from '@/lib/db'
import { Plus, Trash2, Megaphone } from 'lucide-react'
import type { Announcement } from '@/types'

const TYPES: { value: Announcement['type']; label: string; icon: string }[] = [
  { value: 'info', label: 'Info', icon: 'ℹ️' },
  { value: 'event', label: 'Event', icon: '🎭' },
  { value: 'winner', label: 'Winner', icon: '🏆' },
  { value: 'general', label: 'General', icon: '📢' },
]

export default function AnnouncementsPage() {
  const announcements = useAnnouncements()
  const [text, setText] = useState('')
  const [type, setType] = useState<Announcement['type']>('general')
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    if (!text.trim()) return
    setAdding(true)
    await addAnnouncement(text.trim(), type)
    setText('')
    setAdding(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-white">Announcements</h1>
        <p className="text-sm text-gray-500 font-body mt-1">
          Messages that appear in the scrolling ticker on all screens
        </p>
      </div>

      {/* Add announcement */}
      <div className="glass rounded-xl border border-spectra-emerald/20 p-5 mb-6">
        <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
          <Megaphone size={16} className="text-spectra-emerald" />
          New Announcement
        </h3>

        <div className="flex gap-2 mb-3 flex-wrap">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-semibold border transition-all ${
                type === t.value
                  ? 'bg-spectra-emerald/20 border-spectra-emerald/40 text-spectra-emerald'
                  : 'glass border-spectra-border text-gray-500 hover:text-white'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="e.g. 🎭 Dance Competition Results Published"
            className="spectra-input flex-1"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            disabled={adding || !text.trim()}
            className="btn-emerald flex items-center gap-2 disabled:opacity-50"
          >
            {adding ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            Add
          </motion.button>
        </div>
      </div>

      {/* Ticker preview */}
      {announcements.length > 0 && (
        <div className="glass rounded-xl border border-spectra-border p-4 mb-6 overflow-hidden">
          <p className="text-xs text-gray-600 font-display tracking-widest uppercase mb-2">Live Ticker Preview</p>
          <div className="overflow-hidden h-8 flex items-center">
            <span className="ticker-content text-sm text-gray-300 font-body">
              {announcements.map((a) => a.text).join('   •   ')}
            </span>
          </div>
        </div>
      )}

      {/* Announcements list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {announcements.map((item) => {
            const typeConfig = TYPES.find((t) => t.value === item.type)
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="glass rounded-xl border border-spectra-border p-4 flex items-center gap-4"
              >
                <span className="text-2xl">{typeConfig?.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-body">{item.text}</p>
                  <p className="text-xs text-gray-600 mt-0.5 font-body">
                    {typeConfig?.label} •{' '}
                    {item.createdAt instanceof Date
                      ? item.createdAt.toLocaleString()
                      : 'just now'}
                  </p>
                </div>
                <button
                  onClick={() => deleteAnnouncement(item.id)}
                  className="p-2 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {announcements.length === 0 && (
          <div className="text-center py-12 text-gray-600 font-body text-sm">
            No announcements. Add one above to display it on all screens.
          </div>
        )}
      </div>
    </div>
  )
}
