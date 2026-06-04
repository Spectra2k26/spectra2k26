# Spectra 2K26 — Live Leaderboard System
## Complete Setup & Deployment Guide

---

## Prerequisites

- Node.js 18+ installed
- A Google account (for Firebase)
- A Vercel account (free tier works)
- Git

---

## Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → Name it `spectra2k26`
3. Disable Google Analytics (optional) → **Create project**

### 1.2 Enable Firestore

1. Left sidebar → **Firestore Database** → **Create database**
2. Select **Start in production mode**
3. Choose region: `asia-south1` (Mumbai) for best performance in India
4. Click **Enable**

### 1.3 Deploy Firestore Security Rules

1. In Firestore → **Rules** tab
2. Replace all content with the contents of `firestore.rules`
3. Click **Publish**

### 1.4 Deploy Firestore Indexes

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:indexes
```

Or manually create indexes via Firestore console.

### 1.5 Enable Firebase Authentication

1. Left sidebar → **Authentication** → **Get started**
2. Go to **Sign-in method** tab
3. Enable **Email/Password**
4. Click **Save**

### 1.6 Create Admin User

1. In Authentication → **Users** tab → **Add user**
2. Enter email: `admin@spectra2k26.com` (or your choice)
3. Enter a strong password
4. Click **Add user**

### 1.7 Get Firebase Config

1. Project Settings (gear icon) → **Your apps**
2. Click **</>** (Web) → Register app → Name it `spectra2k26-web`
3. Copy the `firebaseConfig` object values

---

## Step 2: Local Development

### 2.1 Install Dependencies

```bash
cd spectra2k26
npm install
```

### 2.2 Create Environment File

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=spectra2k26.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=spectra2k26
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=spectra2k26.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 2.3 Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 3: Seed Initial Data (Optional)

To quickly populate with demo schools for testing:

1. Open `/lib/db.ts`
2. In your browser console (on any page), call: `seedDemoData()`

Or add a temporary button in admin that calls `seedDemoData()`.

---

## Step 4: Deploy to Vercel

### 4.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Spectra 2K26 leaderboard"
git remote add origin https://github.com/yourusername/spectra2k26.git
git push -u origin main
```

### 4.2 Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Add Environment Variables (from `.env.local`):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. Click **Deploy**

### 4.3 Add Authorized Domain

1. Firebase Console → Authentication → Settings → **Authorized domains**
2. Add your Vercel domain: `spectra2k26.vercel.app`

---

## Step 5: Event Day Operations

### Screen Setup

| Screen | URL | Purpose |
|--------|-----|---------|
| Public leaderboard | `/` | Main display, spectators |
| Projector mode | `/display` | Stage, LED wall, auditorium |
| Admin dashboard | `/admin` | Point management (tablet/laptop) |

### Recommended Setup

1. **Stage Projector/LED Wall**: Open `/display` → Click "Fullscreen" button
2. **Registration Desk**: Open `/` on a tablet
3. **Admin Laptop**: Open `/admin/dashboard` for point awarding
4. **QR Code**: Scan from `/` — share with students for mobile access

### Pre-Event Checklist

- [ ] All schools added via Admin → Schools
- [ ] All events created via Admin → Events
- [ ] Announcements added for the day's schedule
- [ ] Admin credentials shared with coordinators
- [ ] Test a point award to verify real-time sync
- [ ] All screens open and displaying

### Awarding Points

**Quick Award:**
1. Admin Dashboard → Find school
2. Click +10 / +20 / +50 / +75 / +100
3. Leaderboard updates instantly on all screens

**Event Results:**
1. Admin → Events
2. Click "Award Points" on the completed event
3. Select positions for each school
4. Click "Award Points & Publish Results"

### Closing Ceremony

1. Admin → Statistics → "Generate Final Report"
2. Download the final report
3. Display final rankings on projector

---

## Database Schema Reference

### `schools` collection
```
{
  name: string
  totalPoints: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### `events` collection
```
{
  name: string
  category: string
  firstPlacePoints: number
  secondPlacePoints: number
  thirdPlacePoints: number
  consolationPoints: number
  isCompleted: boolean
  results?: EventResult[]
  createdAt: Timestamp
  completedAt?: Timestamp
}
```

### `transactions` collection (audit log)
```
{
  schoolId: string
  schoolName: string
  points: number
  reason: string
  eventId?: string
  eventName?: string
  adminEmail: string
  timestamp: Timestamp
}
```

### `activity` collection (feed)
```
{
  type: 'points_awarded' | 'event_completed' | 'announcement'
  schoolId?: string
  schoolName?: string
  points?: number
  eventName?: string
  message: string
  timestamp: Timestamp
}
```

### `announcements` collection
```
{
  text: string
  type: 'info' | 'event' | 'winner' | 'general'
  isActive: boolean
  createdAt: Timestamp
}
```

---

## Adding Spectra Logo/Banner Images

Replace the SVG logo component with your actual Spectra images:

1. Place `logo.png` and `banner.png` in `/public/`
2. In `components/ui/SpectraLogo.tsx`, replace with:
```tsx
import Image from 'next/image'
export default function SpectraLogo({ size = 40 }: { size?: number }) {
  return <Image src="/logo.png" width={size} height={size} alt="Spectra 2K26" />
}
```

---

## Support

For issues or customizations, refer to:
- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Vercel Docs](https://vercel.com/docs)
