import { Film, Plus } from 'lucide-react'

export default function MoviesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🎬 Filme & Serien</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Verwalte deine Watchlist und bewerte Gesehenes
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Hinzufügen
        </button>
      </div>

      <div className="card text-center py-16">
        <Film className="mx-auto mb-4 text-primary-600" size={64} />
        <h2 className="text-2xl font-bold mb-2">Filme & Serien Feature</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Hier kannst du bald deine Watchlist verwalten und Filme/Serien bewerten.
        </p>
        <p className="text-sm text-gray-500">
          Feature in Entwicklung 🚧
        </p>
      </div>
    </div>
  )
}
