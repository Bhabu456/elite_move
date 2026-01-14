import { FiTruck, FiPhone } from "react-icons/fi"

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FiTruck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">MoveEasy</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Packers & Movers</p>
          </div>
        </div>

        <a href="tel:+911234567890" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
          <FiPhone className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">+91 123 456 7890</span>
        </a>
      </div>
    </header>
  )
}
