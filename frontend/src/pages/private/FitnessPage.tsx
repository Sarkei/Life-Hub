import { useState } from 'react'
import { Plus, Dumbbell, Timer, Flame, TrendingUp, Calendar, Trophy, Target } from 'lucide-react'

interface Workout {
  id: number
  name: string
  type: 'strength' | 'cardio' | 'flexibility' | 'other'
  duration: number // Minuten
  calories: number
  exercises: Exercise[]
  date: string
  notes: string
}

interface Exercise {
  name: string
  sets: number
  reps: number
  weight: number // kg
}

export default function FitnessPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: 1,
      name: 'Ganzkörper-Training',
      type: 'strength',
      duration: 60,
      calories: 450,
      exercises: [
        { name: 'Bankdrücken', sets: 4, reps: 10, weight: 80 },
        { name: 'Kniebeugen', sets: 4, reps: 12, weight: 100 },
        { name: 'Klimmzüge', sets: 3, reps: 8, weight: 0 }
      ],
      date: '2025-10-17',
      notes: 'Gutes Training, neue PR beim Bankdrücken!'
    },
    {
      id: 2,
      name: 'Joggen im Park',
      type: 'cardio',
      duration: 30,
      calories: 300,
      exercises: [],
      date: '2025-10-16',
      notes: '5km in 30 Minuten'
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    type: 'strength' as 'strength' | 'cardio' | 'flexibility' | 'other',
    duration: 0,
    calories: 0,
    notes: ''
  })

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0
  })

  const handleAddWorkout = () => {
    if (!newWorkout.name.trim()) return
    
    const workout: Workout = {
      id: Date.now(),
      name: newWorkout.name,
      type: newWorkout.type,
      duration: newWorkout.duration,
      calories: newWorkout.calories,
      exercises: exercises,
      date: new Date().toISOString().split('T')[0],
      notes: newWorkout.notes
    }
    
    setWorkouts([...workouts, workout])
    setNewWorkout({ name: '', type: 'strength', duration: 0, calories: 0, notes: '' })
    setExercises([])
    setShowAddModal(false)
  }

  const handleAddExercise = () => {
    if (!newExercise.name.trim()) return
    
    setExercises([...exercises, { ...newExercise }])
    setNewExercise({ name: '', sets: 3, reps: 10, weight: 0 })
  }

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strength': return 'bg-red-100 text-red-600 dark:bg-red-900/30'
      case 'cardio': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
      case 'flexibility': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strength': return '💪'
      case 'cardio': return '🏃'
      case 'flexibility': return '🧘'
      default: return '⚡'
    }
  }

  const stats = {
    totalWorkouts: workouts.length,
    totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0),
    totalCalories: workouts.reduce((sum, w) => sum + w.calories, 0),
    thisWeek: workouts.filter(w => {
      const date = new Date(w.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return date >= weekAgo
    }).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fitness Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tracke deine Workouts und erreiche deine Ziele
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Neues Workout</span>
        </button>
      </div>

      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <Dumbbell className="text-primary-600" size={24} />
            <div className="text-sm text-gray-600 dark:text-gray-400">Workouts</div>
          </div>
          <div className="text-3xl font-bold">{stats.totalWorkouts}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <Timer className="text-blue-600" size={24} />
            <div className="text-sm text-gray-600 dark:text-gray-400">Minuten</div>
          </div>
          <div className="text-3xl font-bold text-blue-600">{stats.totalDuration}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="text-orange-600" size={24} />
            <div className="text-sm text-gray-600 dark:text-gray-400">Kalorien</div>
          </div>
          <div className="text-3xl font-bold text-orange-600">{stats.totalCalories}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-green-600" size={24} />
            <div className="text-sm text-gray-600 dark:text-gray-400">Diese Woche</div>
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.thisWeek}</div>
        </div>
      </div>

      {/* Workout-Übersicht */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Trophy className="text-yellow-500" size={24} />
          <span>Deine Workouts</span>
        </h2>
        
        <div className="space-y-4">
          {workouts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Target className="mx-auto mb-4" size={48} />
              <p>Noch keine Workouts aufgezeichnet</p>
              <p className="text-sm mt-2">Starte jetzt und tracke deinen Fortschritt!</p>
            </div>
          ) : (
            workouts.map(workout => (
              <div
                key={workout.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{workout.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(workout.type)}`}>
                        {getTypeIcon(workout.type)} {workout.type.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(workout.date).toLocaleDateString('de-DE')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Timer size={14} />
                        {workout.duration} Min
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame size={14} />
                        {workout.calories} kcal
                      </span>
                    </div>
                  </div>
                </div>

                {workout.exercises.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-sm font-medium">Übungen:</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {workout.exercises.map((exercise, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 dark:bg-gray-900 rounded px-3 py-2 text-sm"
                        >
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {exercise.sets}x{exercise.reps} 
                            {exercise.weight > 0 && ` @ ${exercise.weight}kg`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {workout.notes && (
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
                    💭 {workout.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Workout Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Neues Workout</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Workout-Name *</label>
                <input
                  type="text"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="z.B. Ganzkörper-Training"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Typ</label>
                  <select
                    value={newWorkout.type}
                    onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    <option value="strength">💪 Kraft</option>
                    <option value="cardio">🏃 Cardio</option>
                    <option value="flexibility">🧘 Flexibilität</option>
                    <option value="other">⚡ Andere</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dauer (Min)</label>
                  <input
                    type="number"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Kalorien</label>
                  <input
                    type="number"
                    value={newWorkout.calories}
                    onChange={(e) => setNewWorkout({ ...newWorkout, calories: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              {/* Übungen hinzufügen */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold mb-3">Übungen</h3>
                
                <div className="grid grid-cols-12 gap-2 mb-3">
                  <input
                    type="text"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    className="col-span-4 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="Übungsname"
                  />
                  <input
                    type="number"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 0 })}
                    className="col-span-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="Sätze"
                  />
                  <input
                    type="number"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) || 0 })}
                    className="col-span-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="Wdh"
                  />
                  <input
                    type="number"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise({ ...newExercise, weight: parseFloat(e.target.value) || 0 })}
                    className="col-span-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    placeholder="kg"
                  />
                  <button
                    onClick={handleAddExercise}
                    className="col-span-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                  >
                    + Übung
                  </button>
                </div>

                {exercises.length > 0 && (
                  <div className="space-y-2">
                    {exercises.map((exercise, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded px-3 py-2"
                      >
                        <div>
                          <span className="font-medium">{exercise.name}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-3">
                            {exercise.sets}x{exercise.reps}
                            {exercise.weight > 0 && ` @ ${exercise.weight}kg`}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveExercise(idx)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Entfernen
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notizen</label>
                <textarea
                  value={newWorkout.notes}
                  onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  rows={3}
                  placeholder="Wie lief das Workout?"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewWorkout({ name: '', type: 'strength', duration: 0, calories: 0, notes: '' })
                  setExercises([])
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Abbrechen
              </button>
              <button
                onClick={handleAddWorkout}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
              >
                Workout speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
