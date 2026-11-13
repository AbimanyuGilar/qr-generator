'use client'

import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'

const BG = '#F4F1EC'
const FG = '#1C1917'

interface Props {
  onBack: () => void
}

type ScanState = 'idle' | 'scanning' | 'result' | 'denied' | 'no_qr'

export default function QRScanner({ onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const rafRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)

  const [state, setState] = useState<ScanState>('idle')
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  const startCamera = async () => {
    setState('scanning')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch {
      setState('denied')
    }
  }

  const tick = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)

    if (code) {
      stopCamera()
      setResult(code.data)
      setState('result')
      return
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    if (state === 'scanning') {
      rafRef.current = requestAnimationFrame(tick)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [state])

  useEffect(() => {
    return () => stopCamera()
  }, [])

  const reset = () => {
    setResult('')
    setCopied(false)
    setState('idle')
    if (fileRef.current) fileRef.current.value = ''
  }

  const copy = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      URL.revokeObjectURL(url)

      if (code) {
        setResult(code.data)
        setState('result')
      } else {
        setState('no_qr')
        if (fileRef.current) fileRef.current.value = ''
      }
    }

    img.src = url
  }

  return (
    <div style={{ borderColor: FG }} className="w-full max-w-[380px] border">
      {/* Header */}
      <div
        style={{ background: FG, borderColor: FG }}
        className="border-b px-6 py-5 flex items-center justify-between"
      >
        <span style={{ color: BG }} className="text-xs font-medium tracking-[0.18em] uppercase">
          Scan QR
        </span>
        <button
          onClick={() => { stopCamera(); onBack() }}
          style={{ color: BG }}
          className="text-xs opacity-50 hover:opacity-100 transition-opacity tracking-wide"
        >
          Kembali
        </button>
      </div>

      {/* Idle */}
      {(state === 'idle' || state === 'no_qr') && (
        <>
          {state === 'no_qr' && (
            <div style={{ borderColor: FG, color: FG }} className="border-b px-6 py-4">
              <span className="text-xs opacity-50 tracking-wide">QR code tidak ditemukan dalam gambar</span>
            </div>
          )}

          <button
            onClick={startCamera}
            style={{ borderColor: FG, color: FG, background: BG }}
            className="w-full border-b px-6 py-7 text-left"
          >
            <div className="text-sm font-medium tracking-wide">Kamera</div>
            <div className="text-xs opacity-40 mt-1 tracking-wide">Arahkan ke QR code</div>
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            style={{ color: FG, background: BG }}
            className="w-full px-6 py-7 text-left"
          >
            <div className="text-sm font-medium tracking-wide">Upload gambar</div>
            <div className="text-xs opacity-40 mt-1 tracking-wide">JPG, PNG, atau WebP</div>
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </>
      )}

      {/* Denied */}
      {state === 'denied' && (
        <div style={{ color: FG }} className="px-6 py-10">
          <div className="text-sm font-medium tracking-wide">Akses kamera ditolak</div>
          <div className="text-xs opacity-40 mt-1 tracking-wide">
            Izinkan kamera di pengaturan browser
          </div>
        </div>
      )}

      {/* Scanning */}
      {state === 'scanning' && (
        <>
          <div style={{ borderColor: FG, aspectRatio: '1' }} className="border-b relative overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 pointer-events-none">
              <div style={{ borderColor: BG }} className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2" />
              <div style={{ borderColor: BG }} className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2" />
              <div style={{ borderColor: BG }} className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2" />
              <div style={{ borderColor: BG }} className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2" />
            </div>
          </div>

          <button
            onClick={() => { stopCamera(); reset() }}
            style={{ color: FG, background: BG }}
            className="w-full px-6 py-4 text-xs font-medium tracking-[0.18em] uppercase text-left transition-opacity hover:opacity-50"
          >
            Batalkan
          </button>
        </>
      )}

      {/* Result */}
      {state === 'result' && (
        <>
          <div style={{ borderColor: FG }} className="border-b px-6 py-5">
            <p style={{ color: FG }} className="text-sm leading-relaxed break-all">
              {result}
            </p>
          </div>

          <button
            onClick={copy}
            style={{ color: BG, background: FG }}
            className="w-full border-b px-6 py-4 text-xs font-medium tracking-[0.18em] uppercase text-left transition-opacity hover:opacity-70"
          >
            {copied ? 'Tersalin' : 'Salin Teks'}
          </button>

          <button
            onClick={reset}
            style={{ color: FG, background: BG }}
            className="w-full px-6 py-4 text-xs font-medium tracking-[0.18em] uppercase text-left transition-opacity hover:opacity-50"
          >
            Scan Lagi
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
