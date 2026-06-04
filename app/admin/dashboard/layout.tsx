'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks'
import SpectraLogo from '@/components/ui/SpectraLogo'
import Link from 'next/link'
import { signOut } from '@/lib/auth'
import { motion } from 'framer-motion'
import { LayoutDashboard, Trophy, Calendar, Megaphone, BarChart2, LogOut, Home, Monitor } from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/schools', label: 'Schools', icon: Trophy },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/stats', label: 'Statistics', icon: BarChart2 },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-spectra-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <SpectraLogo size={60} className="animate-pulse" />
          <p className="text-gray-500 font-body text-sm">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-spectra-black grid-pattern flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-64 flex-shrink-0 glass border-r border-spectra-border flex flex-col"
      >
        {/* Brand */}
        <div className="p-5 border-b border-spectra-border">
          <div className="flex items-center gap-3">
            <SpectraLogo size={40} />
            <div>
              <p className="font-display font-black text-lg text-white tracking-wider">
                SPECTRA <span className="text-spectra-emerald">2K26</span>
              </p>
              <p className="text-xs text-gray-500 font-body">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-spectra-emerald/10 hover:border-spectra-emerald/20 border border-transparent transition-all font-body text-sm group"
            >
              <Icon size={18} className="group-hover:text-spectra-emerald transition-colors" />
              {label}
            </Link>
          ))}

          <div className="border-t border-spectra-border mt-4 pt-4 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 border border-transparent transition-all font-body text-sm"
            >
              <Home size={18} />
              Public View
            </Link>
            <Link
              href="/display"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 border border-transparent transition-all font-body text-sm"
            >
              <Monitor size={18} />
              Display Mode
            </Link>
          </div>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-spectra-border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-spectra-emerald/20 border border-spectra-emerald/30 flex items-center justify-center text-spectra-emerald text-xs font-display font-bold flex-shrink-0">
                {user.email?.[0]?.toUpperCase()}
              </div>
              <p className="text-xs text-gray-400 truncate font-body">{user.email}</p>
            </div>
            <button
              onClick={() => { signOut(); router.push('/admin') }}
              className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
