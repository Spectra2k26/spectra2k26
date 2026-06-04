'use client'
import { useAnnouncements } from '@/hooks'

export default function AnnouncementTicker() {
  const announcements = useAnnouncements()

  if (announcements.length === 0) {
    return (
      <div className="bg-spectra-dark border-b border-spectra-border overflow-hidden h-9 flex items-center">
        <div className="flex items-center gap-2 px-4 flex-shrink-0">
          <span className="text-spectra-emerald text-xs font-display tracking-widest uppercase">Live</span>
          <span className="w-2 h-2 rounded-full bg-spectra-emerald animate-pulse" />
        </div>
        <div className="overflow-hidden flex-1">
          <span className="ticker-content text-sm text-gray-400 font-body">
            🏆 Welcome to Spectra 2K26 — The Championship Begins &nbsp;&nbsp;&nbsp;⚡ Real-time
            leaderboard active &nbsp;&nbsp;&nbsp;🎭 Events underway &nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>
    )
  }

  const tickerText = announcements.map((a) => a.text).join('   •   ')

  return (
    <div className="bg-spectra-dark border-b border-spectra-border overflow-hidden h-9 flex items-center">
      <div className="flex items-center gap-2 px-4 flex-shrink-0 border-r border-spectra-border pr-4">
        <span className="text-spectra-emerald text-xs font-display tracking-widest uppercase">Live</span>
        <span className="w-2 h-2 rounded-full bg-spectra-emerald animate-pulse" />
      </div>
      <div className="overflow-hidden flex-1">
        <span className="ticker-content text-sm text-gray-300 font-body">{tickerText} &nbsp;&nbsp;&nbsp;</span>
      </div>
    </div>
  )
}
