import QRGenerator from './components/QRGenerator'

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
      <QRGenerator />
    </main>
  )
}
