import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Calendar, FileText, ArrowRight, Clock, Briefcase } from 'lucide-react'
import axios from 'axios'
import { api } from '../../api/endpoints'
import { useAuthStore } from '../../store/authStore'

interface CalendarEvent {
  id: number
  title: string
  startTime: string
  endTime: string
  color: string
  allDay: boolean
  location?: string
}

export default function WorkDashboard() {
  const navigate = useNavigate()
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    loadWorkData()
  }, [])

  const loadWorkData = async () => {
    try {
      // Get userId from auth store
      const userId = useAuthStore.getState().userId || 1
      
      // Load work events (next 7 days)
      const eventsResponse = await axios.get(api.events.getUpcoming(userId), {
        params: { days: 7 }
      })
      // Filter for work events
      const workEvents = eventsResponse.data.filter((e: CalendarEvent & { category: string }) => e.category === 'arbeit')
      setUpcomingEvents(workEvents.slice(0, 5))
    } catch (error) {
      console.error('Error loading work data:', error)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Briefcase size={36} />
          Arbeit Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Übersicht deiner beruflichen Aufgaben und Termine
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/work/todos')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Offene Aufgaben</p>
              <p className="text-3xl font-bold mt-1">0</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/work/calendar')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Anstehende Meetings</p>
              <p className="text-3xl font-bold mt-1">{upcomingEvents.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Calendar className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/work/notes')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notizen</p>
              <p className="text-3xl font-bold mt-1">-</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <FileText className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Work Events */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar size={24} />
            Nächste Meetings & Termine
          </h2>
          <button
            onClick={() => navigate('/work/calendar')}
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
                onClick={() => navigate('/work/calendar')}
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
              onClick={() => navigate('/work/calendar')}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Termin erstellen
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Schnellzugriff</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="card hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate('/work/todos')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Aufgaben</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tasks verwalten</p>
              </div>
            </div>
          </div>

          <div
            className="card hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate('/work/calendar')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Kalender</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Meetings planen</p>
              </div>
            </div>
          </div>

          <div
            className="card hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate('/work/notes')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Notizen</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dokumente verwalten</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
