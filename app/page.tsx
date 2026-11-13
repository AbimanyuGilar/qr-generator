'use client'

import { useState } from 'react'
import ModeSelect from './components/ModeSelect'
import QRGenerator from './components/QRGenerator'
import QRScanner from './components/QRScanner'

type Mode = null | 'generate' | 'scan'

export default function Home() {
  const [mode, setMode] = useState<Mode>(null)

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
      {mode === null && <ModeSelect onSelect={setMode} />}
      {mode === 'generate' && <QRGenerator onBack={() => setMode(null)} />}
      {mode === 'scan' && <QRScanner onBack={() => setMode(null)} />}
    </main>
  )
}
