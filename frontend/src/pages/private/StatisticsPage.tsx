import { BarChart3, TrendingUp } from 'lucide-react'

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">📊 Statistiken</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Übersicht über alle deine Daten und Trends
        </p>
      </div>

      <div className="card text-center py-16">
        <BarChart3 className="mx-auto mb-4 text-primary-600" size={64} />
        <h2 className="text-2xl font-bold mb-2">Statistiken Feature</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Hier siehst du bald ausführliche Statistiken und Analysen zu all deinen Daten.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
          <TrendingUp size={16} />
          <span>Feature in Entwicklung 🚧</span>
        </div>
      </div>
    </div>
  )
}
