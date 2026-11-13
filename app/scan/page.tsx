import QRScanner from '../components/QRScanner'

export default function ScanPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
      <QRScanner />
    </main>
  )
}
