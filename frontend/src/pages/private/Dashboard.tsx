export default function PrivateDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Privat Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Willkommen auf deinem persönlichen Dashboard! Hier kannst du Widgets zu deinen wichtigsten Bereichen hinzufügen.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">📝 Todos</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Verwalte deine täglichen Aufgaben
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">📅 Kalender</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Behalte deine Termine im Blick
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">💪 Fitness</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Tracke deine Workouts
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">⚖️ Gewicht</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Verfolge deine Gewichtsentwicklung
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">🍽️ Ernährung</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Logge deine Mahlzeiten
          </p>
        </div>
      </div>
    </div>
  )
}
