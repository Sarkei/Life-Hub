import { TrendingUp, Plus } from 'lucide-react'

export default function HabitsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📈 Gewohnheiten</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tracke deine täglichen Gewohnheiten
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Neue Gewohnheit
        </button>
      </div>

      <div className="card text-center py-16">
        <TrendingUp className="mx-auto mb-4 text-primary-600" size={64} />
        <h2 className="text-2xl font-bold mb-2">Gewohnheiten Feature</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Hier kannst du bald deine täglichen Gewohnheiten tracken und Fortschritte sehen.
        </p>
        <p className="text-sm text-gray-500">
          Feature in Entwicklung 🚧
        </p>
      </div>
    </div>
  )
}
