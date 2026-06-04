'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useActivity } from '@/hooks'
import { formatDistanceToNow } from 'date-fns'

function getActivityIcon(type: string) {
  switch (type) {
    case 'points_awarded': return '🏆'
    case 'event_completed': return '🎭'
    case 'rank_change': return '📊'
    case 'announcement': return '📢'
    default: return '⚡'
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case 'points_awarded': return 'border-l-spectra-emerald'
    case 'event_completed': return 'border-l-purple-500'
    case 'rank_change': return 'border-l-blue-500'
    case 'announcement': return 'border-l-yellow-500'
    default: return 'border-l-gray-600'
  }
}

export default function ActivityFeed() {
  const items = useActivity(25)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-spectra-emerald animate-pulse" />
          <h3 className="font-display font-semibold text-sm tracking-wider uppercase text-gray-300">
            Live Activity
          </h3>
        </div>
        <span className="text-xs text-gray-600 font-body">{items.length} actions</span>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: 20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className={`glass rounded-lg p-3 border-l-2 ${getActivityColor(item.type)}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0 leading-none mt-0.5">
                  {getActivityIcon(item.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 font-body leading-snug">{item.message}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.timestamp instanceof Date
                      ? formatDistanceToNow(item.timestamp, { addSuffix: true })
                      : 'just now'}
                  </p>
                </div>
                {item.points && item.points > 0 && (
                  <span className="text-xs font-display font-bold text-spectra-emerald flex-shrink-0">
                    +{item.points}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-600">
            <span className="text-3xl mb-2">⚡</span>
            <p className="text-sm font-body">Awaiting activity...</p>
          </div>
        )}
      </div>
    </div>
  )
}
