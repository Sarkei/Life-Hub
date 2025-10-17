import { Plane, Plus } from 'lucide-react'

export default function TravelPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">✈️ Reisen</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Plane deine Reisen und speichere Erinnerungen
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Neue Reise
        </button>
      </div>

      <div className="card text-center py-16">
        <Plane className="mx-auto mb-4 text-primary-600" size={64} />
        <h2 className="text-2xl font-bold mb-2">Reisen Feature</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Hier kannst du bald deine Reisen planen und Erinnerungen festhalten.
        </p>
        <p className="text-sm text-gray-500">
          Feature in Entwicklung 🚧
        </p>
      </div>
    </div>
  )
}
