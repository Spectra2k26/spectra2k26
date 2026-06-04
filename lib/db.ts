import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  writeBatch,
  Timestamp,
  where,
} from 'firebase/firestore'
import { db } from './firebase'
import type { School, Event, PointTransaction, Announcement, ActivityFeedItem } from '@/types'

// ─── SCHOOLS ────────────────────────────────────────────────────────────────

export function subscribeToLeaderboard(callback: (schools: School[]) => void) {
  const q = query(collection(db, 'schools'), orderBy('totalPoints', 'desc'))
  return onSnapshot(q, (snap) => {
    const schools = snap.docs.map((d, i) => ({
      id: d.id,
      ...d.data(),
      rank: i + 1,
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
      updatedAt: d.data().updatedAt?.toDate?.() ?? new Date(),
    })) as School[]
    callback(schools)
  })
}

export async function addSchool(name: string) {
  return addDoc(collection(db, 'schools'), {
    name,
    totalPoints: 0,
    previousRank: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateSchoolPoints(
  schoolId: string,
  schoolName: string,
  points: number,
  reason: string,
  adminEmail: string,
  eventId?: string,
  eventName?: string
) {
  const batch = writeBatch(db)

  // Update school points
  const schoolRef = doc(db, 'schools', schoolId)
  batch.update(schoolRef, {
    totalPoints: increment(points),
    updatedAt: serverTimestamp(),
  })

  // Log the transaction
  const txRef = doc(collection(db, 'transactions'))
  batch.set(txRef, {
    schoolId,
    schoolName,
    points,
    reason,
    eventId: eventId ?? null,
    eventName: eventName ?? null,
    adminEmail,
    adminId: adminEmail,
    timestamp: serverTimestamp(),
  })

  // Add to activity feed
  const actRef = doc(collection(db, 'activity'))
  batch.set(actRef, {
    type: 'points_awarded',
    schoolId,
    schoolName,
    points,
    eventName: eventName ?? null,
    message: eventName
      ? `${schoolName} earned +${points} points in ${eventName}`
      : `${schoolName} earned +${points} points`,
    timestamp: serverTimestamp(),
  })

  await batch.commit()
}

export async function resetSchoolPoints(schoolId: string, adminEmail: string) {
  const schoolDoc = await getDoc(doc(db, 'schools', schoolId))
  const schoolName = schoolDoc.data()?.name ?? 'Unknown'

  const batch = writeBatch(db)
  batch.update(doc(db, 'schools', schoolId), {
    totalPoints: 0,
    updatedAt: serverTimestamp(),
  })
  const txRef = doc(collection(db, 'transactions'))
  batch.set(txRef, {
    schoolId,
    schoolName,
    points: 0,
    reason: 'Points reset by admin',
    adminEmail,
    adminId: adminEmail,
    timestamp: serverTimestamp(),
  })
  await batch.commit()
}

export async function deleteSchool(schoolId: string) {
  await deleteDoc(doc(db, 'schools', schoolId))
}

export async function getSchoolById(schoolId: string) {
  const snap = await getDoc(doc(db, 'schools', schoolId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as School
}

export async function importSchools(names: string[]) {
  const batch = writeBatch(db)
  names.forEach((name) => {
    const ref = doc(collection(db, 'schools'))
    batch.set(ref, {
      name: name.trim(),
      totalPoints: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })
  await batch.commit()
}

// ─── EVENTS ─────────────────────────────────────────────────────────────────

export function subscribeToEvents(callback: (events: Event[]) => void) {
  const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const events = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
      completedAt: d.data().completedAt?.toDate?.() ?? null,
    })) as Event[]
    callback(events)
  })
}

export async function createEvent(event: Omit<Event, 'id' | 'createdAt' | 'isCompleted'>) {
  return addDoc(collection(db, 'events'), {
    ...event,
    isCompleted: false,
    createdAt: serverTimestamp(),
  })
}

export async function updateEvent(eventId: string, data: Partial<Event>) {
  await updateDoc(doc(db, 'events', eventId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteEvent(eventId: string) {
  await deleteDoc(doc(db, 'events', eventId))
}

export async function awardEventPoints(
  event: Event,
  results: Array<{ schoolId: string; schoolName: string; position: 1 | 2 | 3 | 'consolation' }>,
  adminEmail: string
) {
  const batch = writeBatch(db)

  for (const result of results) {
    const points =
      result.position === 1
        ? event.firstPlacePoints
        : result.position === 2
        ? event.secondPlacePoints
        : result.position === 3
        ? event.thirdPlacePoints
        : event.consolationPoints

    batch.update(doc(db, 'schools', result.schoolId), {
      totalPoints: increment(points),
      updatedAt: serverTimestamp(),
    })

    const txRef = doc(collection(db, 'transactions'))
    batch.set(txRef, {
      schoolId: result.schoolId,
      schoolName: result.schoolName,
      points,
      reason: `Position ${result.position} in ${event.name}`,
      eventId: event.id,
      eventName: event.name,
      adminEmail,
      adminId: adminEmail,
      timestamp: serverTimestamp(),
    })

    const actRef = doc(collection(db, 'activity'))
    const medal = result.position === 1 ? '🥇' : result.position === 2 ? '🥈' : result.position === 3 ? '🥉' : '🎖️'
    batch.set(actRef, {
      type: 'event_completed',
      schoolId: result.schoolId,
      schoolName: result.schoolName,
      points,
      eventName: event.name,
      message: `${medal} ${result.schoolName} earned +${points} points in ${event.name}`,
      timestamp: serverTimestamp(),
    })
  }

  batch.update(doc(db, 'events', event.id), {
    isCompleted: true,
    results,
    completedAt: serverTimestamp(),
  })

  // Announce
  const actRef = doc(collection(db, 'activity'))
  batch.set(actRef, {
    type: 'announcement',
    message: `🎭 ${event.name} Results Published`,
    timestamp: serverTimestamp(),
  })

  await batch.commit()
}

// ─── ACTIVITY FEED ───────────────────────────────────────────────────────────

export function subscribeToActivity(callback: (items: ActivityFeedItem[]) => void, count = 20) {
  const q = query(collection(db, 'activity'), orderBy('timestamp', 'desc'), limit(count))
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      timestamp: d.data().timestamp?.toDate?.() ?? new Date(),
    })) as ActivityFeedItem[]
    callback(items)
  })
}

// ─── ANNOUNCEMENTS ───────────────────────────────────────────────────────────

export function subscribeToAnnouncements(callback: (items: Announcement[]) => void) {
  const q = query(
    collection(db, 'announcements'),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
    })) as Announcement[]
    callback(items)
  })
}

export async function addAnnouncement(text: string, type: Announcement['type']) {
  return addDoc(collection(db, 'announcements'), {
    text,
    type,
    isActive: true,
    createdAt: serverTimestamp(),
  })
}

export async function deleteAnnouncement(id: string) {
  await deleteDoc(doc(db, 'announcements', id))
}

// ─── TRANSACTIONS ────────────────────────────────────────────────────────────

export async function getTransactionsBySchool(schoolId: string): Promise<PointTransaction[]> {
  const q = query(
    collection(db, 'transactions'),
    where('schoolId', '==', schoolId),
    orderBy('timestamp', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    timestamp: d.data().timestamp?.toDate?.() ?? new Date(),
  })) as PointTransaction[]
}

export async function getAllTransactions(): Promise<PointTransaction[]> {
  const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    timestamp: d.data().timestamp?.toDate?.() ?? new Date(),
  })) as PointTransaction[]
}

// ─── CLOSING CEREMONY ────────────────────────────────────────────────────────

export async function getClosingCeremonyData() {
  const [schoolsSnap, eventsSnap, txSnap] = await Promise.all([
    getDocs(query(collection(db, 'schools'), orderBy('totalPoints', 'desc'))),
    getDocs(collection(db, 'events')),
    getDocs(query(collection(db, 'transactions'), orderBy('timestamp', 'desc'))),
  ])

  const schools = schoolsSnap.docs.map((d, i) => ({
    id: d.id,
    rank: i + 1,
    ...d.data(),
  }))
  const events = eventsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
  const transactions = txSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    timestamp: d.data().timestamp?.toDate?.() ?? new Date(),
  }))

  return { schools, events, transactions }
}

// ─── FIRESTORE SETUP ─────────────────────────────────────────────────────────

export async function seedDemoData() {
  const schoolNames = [
    'DAV Public School',
    'PSBB Millennium',
    'SBOA School',
    'Chettinad Vidyashram',
    'The Hindu Senior Secondary School',
    'Vidya Mandir',
    'Chinmaya Vidyalaya',
    'Velammal Bodhi Campus',
    'Sri Sankara Senior Secondary',
    'Don Bosco Matriculation',
  ]
  const batch = writeBatch(db)
  const points = [950, 920, 885, 810, 780, 740, 710, 680, 645, 600]

  schoolNames.forEach((name, i) => {
    const ref = doc(collection(db, 'schools'))
    batch.set(ref, {
      name,
      totalPoints: points[i],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })

  await batch.commit()
}
