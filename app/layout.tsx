import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Spectra 2K26 | Live Leaderboard',
  description: 'Real-time championship leaderboard for Spectra 2026 inter-school cultural fest',
  themeColor: '#030712',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-spectra-black antialiased">{children}</body>
    </html>
  )
}
