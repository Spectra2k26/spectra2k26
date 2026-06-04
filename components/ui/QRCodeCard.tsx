'use client'
import { QRCodeSVG } from 'qrcode.react'
import { useState, useEffect } from 'react'

export default function QRCodeCard() {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.origin)
  }, [])

  return (
    <div className="glass rounded-xl p-5 border border-spectra-border flex flex-col items-center gap-3">
      <p className="text-xs font-display tracking-widest uppercase text-spectra-emerald">Scan to Follow</p>
      <div className="bg-white p-2 rounded-lg">
        <QRCodeSVG
          value={url || 'https://spectra2k26.vercel.app'}
          size={100}
          bgColor="#ffffff"
          fgColor="#030712"
          level="H"
        />
      </div>
      <p className="text-xs text-gray-500 text-center font-body">Live leaderboard on your phone</p>
    </div>
  )
}
