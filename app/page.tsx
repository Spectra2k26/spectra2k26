'use client'
import { motion } from 'framer-motion'
import { Maximize2, Monitor } from 'lucide-react'
import Link from 'next/link'
import AnnouncementTicker from '@/components/ui/AnnouncementTicker'
import SpectraLogo from '@/components/ui/SpectraLogo'
import Podium from '@/components/leaderboard/Podium'
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable'
import ActivityFeed from '@/components/leaderboard/ActivityFeed'
import ChampionCard from '@/components/leaderboard/ChampionCard'
import StatsPanel from '@/components/leaderboard/StatsPanel'
import QRCodeCard from '@/components/ui/QRCodeCard'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-spectra-black grid-pattern relative overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-spectra-emerald/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-spectra-gold/3 rounded-full blur-3xl" />
        {/* Watermark logo */}
        {/*
        <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none">
          <SpectraLogo size={500} />
        </div>
        */}
      </div>

      {/* Announcement Ticker */}
      <AnnouncementTicker />

      {/* Header / Hero Banner */}
      <header className="relative border-b border-spectra-border bg-gradient-to-b from-spectra-dark/80 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between gap-4">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            >
              <SpectraLogo size={52} />
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display font-black text-2xl sm:text-3xl tracking-widest text-white text-glow-emerald"
              >
                SPECTRA <span className="text-spectra-emerald">2K26</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-xs text-gray-500 font-body tracking-wider uppercase mt-0.5"
              >
                Live Championship Leaderboard
              </motion.p>
            </div>
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/display"
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-spectra-emerald/30 text-spectra-emerald text-sm font-display font-semibold hover:bg-spectra-emerald/10 transition-all group"
            >
              <Monitor size={16} />
              <span className="hidden sm:inline">Projector Mode</span>
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-spectra-emerald/10 border border-spectra-emerald/30 text-gray-400 text-sm font-display font-semibold hover:text-white transition-all"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Row */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <StatsPanel />
        </motion.section>

        {/* Podium */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-spectra-border to-transparent" />
            <h2 className="font-display text-sm tracking-widest uppercase text-gray-500">
              🏆 Top 3 Podium
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-spectra-border to-transparent" />
          </div>
          <Podium />
        </motion.section>

        {/* Main grid: Leaderboard + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 rounded-full bg-spectra-emerald" />
              <h2 className="font-display font-semibold tracking-wider text-white">
                Full Rankings
              </h2>
              <div className="flex items-center gap-1.5 ml-auto">
                <div className="w-1.5 h-1.5 rounded-full bg-spectra-emerald animate-pulse" />
                <span className="text-xs text-gray-500 font-body">Live</span>
              </div>
            </div>
            <LeaderboardTable showAll />
          </motion.section>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <ChampionCard />

            <div className="glass rounded-xl border border-spectra-border p-4 h-96">
              <ActivityFeed />
            </div>

            <QRCodeCard />
          </motion.aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-spectra-border mt-16 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-gray-600 font-body">
          <span>Spectra 2K26 • Live Championship Leaderboard</span>
          <span>Powered by real-time updates</span>
        </div>
      </footer>
    </div>
  )
}
