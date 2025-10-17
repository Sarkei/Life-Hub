import { useState, useEffect } from 'react'
import { Plus, X, Clock, MapPin, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'
import { api } from '../../api/endpoints'
import { useAuthStore } from '../../store/authStore'

interface CalendarEvent {
  id?: number
  userId: number
  title: string
  description?: string
  startTime: string
  endTime: string
  category: string
  color: string
  allDay: boolean
  location?: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [formData, setFormData] = useState<CalendarEvent>({
    userId: 1, // TODO: Get from auth
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    category: 'privat',
    color: '#3b82f6',
    allDay: false,
    location: ''
  })

  const colors = [
    { name: 'Blau', value: '#3b82f6' },
    { name: 'Grün', value: '#10b981' },
    { name: 'Rot', value: '#ef4444' },
    { name: 'Gelb', value: '#f59e0b' },
    { name: 'Lila', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' }
  ]

  useEffect(() => {
    loadEvents()
  }, [currentDate])

  const loadEvents = async () => {
    try {
      const userId = useAuthStore.getState().userId || 1
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59)
      
      const response = await axios.get(api.events.getRange(userId), {
        params: {
          startDate: startOfMonth.toISOString().split('T')[0],
          endDate: endOfMonth.toISOString().split('T')[0]
        }
      })
      setEvents(response.data)
    } catch (error) {
      console.error('Error loading events:', error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    // Montag als erster Tag (0=Sonntag -> 6, 1=Montag -> 0, ...)
    let startingDayOfWeek = firstDay.getDay() - 1
    if (startingDayOfWeek === -1) startingDayOfWeek = 6 // Sonntag wird zu 6

    const days = []
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      })
    }

    // Next month days
    const remainingDays = 42 - days.length // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      })
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    setFormData({
      ...formData,
      startTime: `${dateStr}T09:00`,
      endTime: `${dateStr}T10:00`
    })
    setShowModal(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventDetails(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title || !formData.startTime || !formData.endTime) {
      alert('Bitte fülle alle Pflichtfelder aus!')
      return
    }

    try {
      const userId = useAuthStore.getState().userId || 1
      
      // Ensure proper DateTime format for backend
      const eventData = {
        ...formData,
        userId,
        startTime: formData.startTime.includes('T') ? formData.startTime : `${formData.startTime}T00:00`,
        endTime: formData.endTime.includes('T') ? formData.endTime : `${formData.endTime}T23:59`
      }

      if (selectedEvent?.id) {
        // Update
        await axios.put(api.events.update(userId, selectedEvent.id), eventData)
        alert('Termin erfolgreich aktualisiert!')
      } else {
        // Create
        await axios.post(api.events.create(userId), eventData)
        alert('Termin erfolgreich erstellt!')
      }
      
      setShowModal(false)
      setSelectedEvent(null)
      setFormData({
        userId,
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        category: 'privat',
        color: '#3b82f6',
        allDay: false,
        location: ''
      })
      loadEvents()
    } catch (error: any) {
      console.error('Error saving event:', error)
      alert(`Fehler beim Speichern: ${error.response?.data?.message || error.message || 'Unbekannter Fehler'}`)
    }
  }

  const handleEdit = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setFormData(event)
    setShowEventDetails(false)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Termin wirklich löschen?')) {
      try {
        const userId = useAuthStore.getState().userId || 1
        await axios.delete(api.events.delete(userId, id))
        setShowEventDetails(false)
        loadEvents()
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ]

  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

  const days = getDaysInMonth(currentDate)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📅 Kalender</h1>
        <button
          onClick={() => {
            setSelectedEvent(null)
            setFormData({
              userId: 1,
              title: '',
              description: '',
              startTime: new Date().toISOString().slice(0, 16),
              endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
              category: 'privat',
              color: '#3b82f6',
              allDay: false,
              location: ''
            })
            setShowModal(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Neuer Termin
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={handlePreviousMonth} className="btn-secondary p-2">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={handleNextMonth} className="btn-secondary p-2">
              <ChevronRight size={20} />
            </button>
          </div>
          <button onClick={handleToday} className="btn-secondary">
            Heute
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {dayNames.map(day => (
            <div key={day} className="text-center font-semibold text-sm py-2 text-gray-600 dark:text-gray-400">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((dayInfo, index) => {
            const dayEvents = getEventsForDate(dayInfo.date)
            const isToday = dayInfo.date.toDateString() === new Date().toDateString()

            return (
              <div
                key={index}
                onClick={() => dayInfo.isCurrentMonth && handleDateClick(dayInfo.date)}
                className={`
                  min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors
                  ${dayInfo.isCurrentMonth 
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750' 
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400'}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                  {dayInfo.day}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event, idx) => (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEventClick(event)
                      }}
                      className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: event.color, color: 'white' }}
                    >
                      {event.allDay ? '📅' : '🕐'} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{dayEvents.length - 3} mehr
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Create/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedEvent?.id ? 'Termin bearbeiten' : 'Neuer Termin'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Titel *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Beschreibung</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input w-full h-24"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.allDay}
                    onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Ganztägig</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start *</label>
                  <input
                    type={formData.allDay ? 'date' : 'datetime-local'}
                    value={formData.allDay ? formData.startTime.split('T')[0] : formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: formData.allDay ? `${e.target.value}T00:00` : e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ende *</label>
                  <input
                    type={formData.allDay ? 'date' : 'datetime-local'}
                    value={formData.allDay ? formData.endTime.split('T')[0] : formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: formData.allDay ? `${e.target.value}T23:59` : e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ort</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input w-full"
                  placeholder="z.B. Besprechungsraum 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kategorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input w-full"
                >
                  <option value="privat">Privat</option>
                  <option value="arbeit">Arbeit</option>
                  <option value="schule">Schule</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Farbe</label>
                <div className="flex gap-2">
                  {colors.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-10 h-10 rounded-full border-2 transition-transform ${
                        formData.color === color.value ? 'border-gray-800 dark:border-white scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {selectedEvent?.id ? 'Aktualisieren' : 'Erstellen'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
              <button onClick={() => setShowEventDetails(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {selectedEvent.description && (
                <p className="text-gray-600 dark:text-gray-400">{selectedEvent.description}</p>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} />
                <span>
                  {new Date(selectedEvent.startTime).toLocaleString('de-DE')} - 
                  {new Date(selectedEvent.endTime).toLocaleString('de-DE')}
                </span>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} />
                  <span>{selectedEvent.location}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedEvent.color }}
                />
                <span className="text-sm capitalize">{selectedEvent.category}</span>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleEdit(selectedEvent)}
                  className="btn-secondary flex items-center gap-2 flex-1"
                >
                  <Edit2 size={16} />
                  Bearbeiten
                </button>
                <button
                  onClick={() => selectedEvent.id && handleDelete(selectedEvent.id)}
                  className="btn-secondary flex items-center gap-2 flex-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 size={16} />
                  Löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
