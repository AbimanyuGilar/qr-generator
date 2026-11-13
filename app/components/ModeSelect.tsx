const BG = '#F4F1EC'
const FG = '#1C1917'

interface Props {
  onSelect: (mode: 'generate' | 'scan') => void
}

export default function ModeSelect({ onSelect }: Props) {
  return (
    <div style={{ borderColor: FG }} className="w-full max-w-[380px] border">
      {/* Header */}
      <div
        style={{ background: FG, borderColor: FG }}
        className="border-b px-6 py-5"
      >
        <span style={{ color: BG }} className="text-xs font-medium tracking-[0.18em] uppercase">
          QR Tool
        </span>
      </div>

      {/* Options */}
      <button
        onClick={() => onSelect('generate')}
        style={{ borderColor: FG, color: FG, background: BG }}
        className="w-full border-b px-6 py-8 text-left group"
      >
        <div className="text-sm font-medium tracking-wide">Generate</div>
        <div className="text-xs opacity-40 mt-1 tracking-wide">
          Buat QR code dari teks atau URL
        </div>
      </button>

      <button
        onClick={() => onSelect('scan')}
        style={{ borderColor: FG, color: FG, background: BG }}
        className="w-full px-6 py-8 text-left"
      >
        <div className="text-sm font-medium tracking-wide">Scan</div>
        <div className="text-xs opacity-40 mt-1 tracking-wide">
          Baca QR code lewat kamera
        </div>
      </button>
    </div>
  )
}
