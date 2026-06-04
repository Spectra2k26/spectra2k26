'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLeaderboard, useAuth } from '@/hooks'
import { addSchool, deleteSchool, resetSchoolPoints, importSchools } from '@/lib/db'
import { Trash2, RefreshCw, Plus, Upload, Download } from 'lucide-react'

export default function SchoolsPage() {
  const { schools, loading } = useLeaderboard()
  const { user } = useAuth()
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [importText, setImportText] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [search, setSearch] = useState('')

  const handleAdd = async () => {
    if (!newName.trim()) return
    setAdding(true)
    await addSchool(newName.trim())
    setNewName('')
    setAdding(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return
    await deleteSchool(id)
  }

  const handleReset = async (id: string, name: string) => {
    if (!confirm(`Reset all points for ${name}?`)) return
    await resetSchoolPoints(id, user?.email ?? 'admin')
  }

  const handleImport = async () => {
    const names = importText.split('\n').map((n) => n.trim()).filter(Boolean)
    if (names.length === 0) return
    await importSchools(names)
    setImportText('')
    setShowImport(false)
  }

  const handleExport = () => {
    const csv = ['Rank,School,Points', ...schools.map((s, i) => `${i + 1},"${s.name}",${s.totalPoints}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'spectra2k26-rankings.csv'
    a.click()
  }

  const filtered = schools.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-white">Schools</h1>
          <p className="text-sm text-gray-500 font-body mt-1">{schools.length} schools registered</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-spectra-border text-gray-400 hover:text-white text-sm font-body transition-all"
          >
            <Download size={14} />
            Export CSV
          </button>
          <button
            onClick={() => setShowImport(!showImport)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-spectra-border text-gray-400 hover:text-white text-sm font-body transition-all"
          >
            <Upload size={14} />
            Import
          </button>
        </div>
      </div>

      {/* Add school */}
      <div className="glass rounded-xl border border-spectra-emerald/20 p-5 mb-6">
        <h3 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
          <Plus size={16} className="text-spectra-emerald" />
          Add School
        </h3>
        <div className="flex gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="School name..."
            className="spectra-input flex-1"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
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

      {/* Import panel */}
      <AnimatePresence>
        {showImport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl border border-spectra-border p-5 mb-6 overflow-hidden"
          >
            <h3 className="font-display font-semibold text-white mb-3">Import Schools (one per line)</h3>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="DAV Public School&#10;PSBB Millennium&#10;SBOA School&#10;..."
              rows={6}
              className="spectra-input resize-none font-body text-sm"
            />
            <div className="flex gap-3 mt-3">
              <button onClick={handleImport} className="btn-emerald">
                Import {importText.split('\n').filter((l) => l.trim()).length} Schools
              </button>
              <button
                onClick={() => setShowImport(false)}
                className="px-4 py-2 rounded-lg glass border border-spectra-border text-gray-400 font-body text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search schools..."
        className="spectra-input mb-4 max-w-md text-sm"
      />

      {/* Table */}
      <div className="glass rounded-xl border border-spectra-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-spectra-border text-xs font-display tracking-widest uppercase text-gray-600">
          <span className="w-12">Rank</span>
          <span className="flex-1">School</span>
          <span className="w-28 text-right">Points</span>
          <span className="w-24 text-right">Actions</span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-spectra-card animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((school) => (
              <motion.div
                key={school.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-4 px-6 py-4 border-b border-spectra-border last:border-0 hover:bg-white/2 transition-colors"
              >
                <span className="w-12 font-display font-bold text-gray-500">#{school.rank}</span>
                <span className="flex-1 font-body text-white flex items-center gap-2">
                  {school.rank === 1 ? '🥇' : school.rank === 2 ? '🥈' : school.rank === 3 ? '🥉' : ''}
                  {school.name}
                </span>
                <span className="w-28 text-right font-display font-bold text-spectra-emerald">
                  {school.totalPoints.toLocaleString()}
                </span>
                <div className="w-24 flex items-center gap-2 justify-end">
                  <button
                    onClick={() => handleReset(school.id, school.name)}
                    className="p-2 text-gray-600 hover:text-yellow-400 transition-colors"
                    title="Reset points"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(school.id, school.name)}
                    className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                    title="Delete school"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
