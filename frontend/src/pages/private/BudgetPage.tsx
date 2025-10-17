import { DollarSign, Plus } from 'lucide-react'

export default function BudgetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">💰 Budget</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Verwalte deine Finanzen und Ausgaben
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Transaktion hinzufügen
        </button>
      </div>

      <div className="card text-center py-16">
        <DollarSign className="mx-auto mb-4 text-primary-600" size={64} />
        <h2 className="text-2xl font-bold mb-2">Budget Feature</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Hier kannst du bald deine Finanzen verwalten und Ausgaben tracken.
        </p>
        <p className="text-sm text-gray-500">
          Feature in Entwicklung 🚧
        </p>
      </div>
    </div>
  )
}
