'use client'

import { useState, useRef, useCallback } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

const BG = '#F4F1EC'
const FG = '#1C1917'

interface Props {
  onBack: () => void
}

export default function QRGenerator({ onBack }: Props) {
  const [text, setText] = useState('')
  const canvasRef = useRef<HTMLDivElement>(null)
  const hasValue = text.trim().length > 0

  const download = useCallback(() => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcode.png'
    a.click()
  }, [])

  return (
    <div style={{ borderColor: FG }} className="w-full max-w-[380px] border">
      {/* Header */}
      <div
        style={{ background: FG, borderColor: FG }}
        className="border-b px-6 py-5 flex items-center justify-between"
      >
        <span style={{ color: BG }} className="text-xs font-medium tracking-[0.18em] uppercase">
          Generate QR
        </span>
        <div className="flex items-center gap-4">
          {hasValue && (
            <span style={{ color: BG }} className="text-xs opacity-50 tracking-wide">
              {text.trim().length} karakter
            </span>
          )}
          <button
            onClick={onBack}
            style={{ color: BG }}
            className="text-xs opacity-50 hover:opacity-100 transition-opacity tracking-wide"
          >
            Kembali
          </button>
        </div>
      </div>

      {/* Input area */}
      <div style={{ borderColor: FG }} className="border-b">
        <textarea
          className="w-full resize-none px-6 py-5 text-sm leading-relaxed outline-none"
          style={{
            background: 'transparent',
            color: FG,
            caretColor: FG,
          }}
          rows={5}
          placeholder="Teks atau URL..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {/* QR output */}
      {hasValue && (
        <>
          <div
            style={{ borderColor: FG }}
            className="border-b flex items-center justify-center py-10"
          >
            <div ref={canvasRef}>
              <QRCodeCanvas
                value={text.trim()}
                size={1000}
                bgColor={BG}
                fgColor={FG}
                level="Q"
                style={{ width: '200px', height: '200px' }}
              />
            </div>
          </div>

          {/* Download */}
          <button
            onClick={download}
            className="w-full px-6 py-4 text-xs font-medium tracking-[0.18em] uppercase text-left transition-opacity hover:opacity-70"
            style={{ color: BG, background: FG }}
          >
            Unduh PNG
          </button>
        </>
      )}
    </div>
  )
}
