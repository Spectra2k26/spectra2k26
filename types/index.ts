export interface School {
  id: string
  name: string
  totalPoints: number
  rank?: number
  previousRank?: number
  rankChange?: number
  color?: string
  logo?: string
  achievements?: Achievement[]
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  name: string
  category: string
  firstPlacePoints: number
  secondPlacePoints: number
  thirdPlacePoints: number
  consolationPoints: number
  isCompleted: boolean
  results?: EventResult[]
  createdAt: Date
  completedAt?: Date
}

export interface EventResult {
  schoolId: string
  schoolName: string
  position: 1 | 2 | 3 | 'consolation'
  pointsAwarded: number
}

export interface PointTransaction {
  id: string
  schoolId: string
  schoolName: string
  points: number
  reason: string
  eventId?: string
  eventName?: string
  adminId: string
  adminEmail: string
  timestamp: Date
}

export interface Announcement {
  id: string
  text: string
  type: 'info' | 'event' | 'winner' | 'general'
  isActive: boolean
  createdAt: Date
}

export interface ActivityFeedItem {
  id: string
  type: 'points_awarded' | 'event_completed' | 'rank_change' | 'announcement'
  schoolId?: string
  schoolName?: string
  points?: number
  eventName?: string
  message: string
  timestamp: Date
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: Date
}

export interface LeaderboardEntry extends School {
  rank: number
  previousRank: number
  rankChange: number
}

export interface Stats {
  totalSchools: number
  totalPointsAwarded: number
  eventsCompleted: number
  eventsTotal: number
  mostSuccessfulSchool?: string
  mostCompetitiveEvent?: string
  averagePoints: number
}
