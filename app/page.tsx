import Link from 'next/link'

const BG = '#F4F1EC'
const FG = '#1C1917'

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
      <div style={{ borderColor: FG }} className="w-full max-w-[380px] border">
        {/* Header */}
        <div style={{ background: FG, borderColor: FG }} className="border-b px-6 py-5">
          <span style={{ color: BG }} className="text-xs font-medium tracking-[0.18em] uppercase">
            QR Tool
          </span>
        </div>

        {/* Options */}
        <Link
          href="/generate"
          style={{ borderColor: FG, color: FG, background: BG }}
          className="block w-full border-b px-6 py-8"
        >
          <div className="text-sm font-medium tracking-wide">Generate</div>
          <div className="text-xs opacity-40 mt-1 tracking-wide">Buat QR code dari teks atau URL</div>
        </Link>

        <Link
          href="/scan"
          style={{ color: FG, background: BG }}
          className="block w-full px-6 py-8"
        >
          <div className="text-sm font-medium tracking-wide">Scan</div>
          <div className="text-xs opacity-40 mt-1 tracking-wide">Baca QR code lewat kamera atau gambar</div>
        </Link>
      </div>
    </main>
  )
}
