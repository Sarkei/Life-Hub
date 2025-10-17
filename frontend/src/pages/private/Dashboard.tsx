import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Calendar, Dumbbell, Weight, UtensilsCrossed, FileText, ArrowRight, Clock } from 'lucide-react'
import axios from 'axios'

interface Todo {
  id: number
  title: string
  completed: boolean
  priority: string
  dueDate?: string
}

interface CalendarEvent {
  id: number
  title: string
  startTime: string
  endTime: string
  color: string
  allDay: boolean
  location?: string
}

interface Workout {
  id: number
  date: string
  type: string
  duration: number
  calories: number
}

export default function PrivateDashboard() {
  const navigate = useNavigate()
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([])
  const [recentTodos, setRecentTodos] = useState<Todo[]>([])
  const [stats, setStats] = useState({
    totalTodos: 0,
    activeTodos: 0,
    completedTodos: 0,
    upcomingEvents: 0,
    weekWorkouts: 0,
    weekCalories: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load upcoming events (next 7 days)
      const eventsResponse = await axios.get('http://localhost:8080/api/calendar/events/upcoming', {
        params: { userId: 1, days: 7 }
      })
      setUpcomingEvents(eventsResponse.data.slice(0, 5))

      // Load recent todos
      // TODO: Add API endpoint for todos
      const mockTodos = [
        { id: 1, title: 'Einkaufen gehen', completed: false, priority: 'high', dueDate: '2025-10-18' },
        { id: 2, title: 'Email beantworten', completed: false, priority: 'medium', dueDate: '2025-10-17' },
        { id: 3, title: 'Steuererklärung vorbereiten', completed: false, priority: 'high', dueDate: '2025-10-20' }
      ]
      setRecentTodos(mockTodos)

      // Calculate stats
      setStats({
        totalTodos: mockTodos.length,
        activeTodos: mockTodos.filter(t => !t.completed).length,
        completedTodos: mockTodos.filter(t => t.completed).length,
        upcomingEvents: eventsResponse.data.length,
        weekWorkouts: mockWorkouts.length,
        weekCalories: mockWorkouts.reduce((sum, w) => sum + w.calories, 0)
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Heute'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Morgen'
    } else {
      return date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'low': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Willkommen zurück! 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Hier ist deine Übersicht für heute, {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/private/todos')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Offene Aufgaben</p>
              <p className="text-3xl font-bold mt-1">{stats.activeTodos}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/private/calendar')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nächste Termine</p>
              <p className="text-3xl font-bold mt-1">{stats.upcomingEvents}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Calendar className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/private/fitness')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Workouts (7 Tage)</p>
              <p className="text-3xl font-bold mt-1">{stats.weekWorkouts}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Dumbbell className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/private/fitness')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Kalorien (7 Tage)</p>
              <p className="text-3xl font-bold mt-1">{stats.weekCalories}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <Weight className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events Widget */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar size={24} />
              Nächste Termine (7 Tage)
            </h2>
            <button
              onClick={() => navigate('/private/calendar')}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
            >
              Alle anzeigen <ArrowRight size={16} />
            </button>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => navigate('/private/calendar')}
                >
                  <div
                    className="w-1 h-full rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold truncate">{event.title}</h3>
                      <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(event.startTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <Clock size={14} />
                      <span>
                        {event.allDay ? 'Ganztägig' : `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
                      </span>
                    </div>
                    {event.location && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                        📍 {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar size={48} className="mx-auto mb-3 opacity-50" />
              <p>Keine anstehenden Termine</p>
              <button
                onClick={() => navigate('/private/calendar')}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Termin erstellen
              </button>
            </div>
          )}
        </div>

        {/* Recent Todos Widget */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 size={24} />
              Offene Aufgaben
            </h2>
            <button
              onClick={() => navigate('/private/todos')}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
            >
              Alle anzeigen <ArrowRight size={16} />
            </button>
          </div>

          {recentTodos.length > 0 ? (
            <div className="space-y-3">
              {recentTodos.map(todo => (
                <div
                  key={todo.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => navigate('/private/todos')}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    className="mt-1 rounded"
                    onChange={() => {}}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold truncate">{todo.title}</h3>
                      <span className={`text-xs font-semibold ${getPriorityColor(todo.priority)}`}>
                        {todo.priority === 'high' && '🔴'}
                        {todo.priority === 'medium' && '🟡'}
                        {todo.priority === 'low' && '🟢'}
                      </span>
                    </div>
                    {todo.dueDate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Fällig: {formatDate(todo.dueDate)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CheckCircle2 size={48} className="mx-auto mb-3 opacity-50" />
              <p>Keine offenen Aufgaben</p>
              <button
                onClick={() => navigate('/private/todos')}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Aufgabe erstellen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-xl font-bold mb-4">Schnellzugriff</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            className="card hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate('/private/todos')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Todos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aufgaben verwalten</p>
              </div>
            </div>
          </div>

          <div
            className="card hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate('/private/calendar')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Kalender</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Termine planen</p>
              </div>
            </div>
          </div>

          <div
            className="card hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate('/private/fitness')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Dumbbell className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Fitness</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Workouts tracken</p>
              </div>
            </div>
          </div>

          <div
            className="card hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate('/private/weight')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Weight className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Gewicht</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gewicht verfolgen</p>
              </div>
            </div>
          </div>

          <div
            className="card hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate('/private/meals')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ernährung</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mahlzeiten loggen</p>
              </div>
            </div>
          </div>

          <div
            className="card hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate('/private/notes')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="text-pink-600 dark:text-pink-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Notizen</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notizen schreiben</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
