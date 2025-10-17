import { useState, useEffect } from 'react'
import { Plus, Play, Edit2, Trash2, Check, X, Target, Calendar, Dumbbell, Clock, Flame, ChevronDown, ChevronUp } from 'lucide-react'
import axios from 'axios'

interface TrainingPlan {
  id: number
  userId: number
  name: string
  description?: string
  active: boolean
  goal?: string
  durationWeeks?: number
  createdAt: string
  updatedAt: string
}

interface Workout {
  id: number
  trainingPlanId: number
  name: string
  description?: string
  dayOfWeek: string
  type?: string
  durationMinutes?: number
  caloriesBurned?: number
  completed: boolean
  completedAt?: string
  createdAt: string
  updatedAt: string
}

interface WorkoutExercise {
  id?: number
  workoutId: number
  name: string
  sets?: number
  reps?: number
  weight?: number
  durationSeconds?: number
  notes?: string
  position: number
}

export default function FitnessPage() {
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([])
  const [activePlan, setActivePlan] = useState<TrainingPlan | null>(null)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showWorkoutModal, setShowWorkoutModal] = useState(false)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [showWorkoutDetail, setShowWorkoutDetail] = useState(false)
  
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    goal: '',
    durationWeeks: 12
  })
  
  const [workoutForm, setWorkoutForm] = useState({
    name: '',
    description: '',
    dayOfWeek: 'MONDAY',
    type: '',
    durationMinutes: 60,
    caloriesBurned: 300
  })
  
  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    durationSeconds: 0,
    notes: ''
  })
  
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null)

  const daysOfWeek = [
    { value: 'MONDAY', label: 'Montag', short: 'Mo' },
    { value: 'TUESDAY', label: 'Dienstag', short: 'Di' },
    { value: 'WEDNESDAY', label: 'Mittwoch', short: 'Mi' },
    { value: 'THURSDAY', label: 'Donnerstag', short: 'Do' },
    { value: 'FRIDAY', label: 'Freitag', short: 'Fr' },
    { value: 'SATURDAY', label: 'Samstag', short: 'Sa' },
    { value: 'SUNDAY', label: 'Sonntag', short: 'So' }
  ]

  const goals = ['Muskelaufbau', 'Abnehmen', 'Ausdauer', 'Kraft', 'Beweglichkeit', 'Allgemeine Fitness']
  const workoutTypes = ['Krafttraining', 'Cardio', 'HIIT', 'Stretching', 'Yoga', 'Pilates', 'Crossfit']

  useEffect(() => {
    loadTrainingPlans()
    loadActivePlan()
  }, [])

  useEffect(() => {
    if (selectedPlan) {
      loadWorkouts(selectedPlan.id)
    }
  }, [selectedPlan])

  useEffect(() => {
    if (selectedWorkout) {
      loadExercises(selectedWorkout.id)
    }
  }, [selectedWorkout])

  const loadTrainingPlans = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/training/plans', {
        params: { userId: 1 }
      })
      setTrainingPlans(response.data)
    } catch (error) {
      console.error('Error loading training plans:', error)
    }
  }

  const loadActivePlan = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/training/plans/active', {
        params: { userId: 1 }
      })
      setActivePlan(response.data)
      setSelectedPlan(response.data)
    } catch (error) {
      // No active plan
      setActivePlan(null)
    }
  }

  const loadWorkouts = async (planId: number) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/training/plans/${planId}/workouts`)
      setWorkouts(response.data)
    } catch (error) {
      console.error('Error loading workouts:', error)
    }
  }

  const loadExercises = async (workoutId: number) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/training/workouts/${workoutId}/exercises`)
      setExercises(response.data)
    } catch (error) {
      console.error('Error loading exercises:', error)
    }
  }

  const handleCreatePlan = async () => {
    try {
      await axios.post('http://localhost:8080/api/training/plans', {
        userId: 1,
        ...planForm
      })
      loadTrainingPlans()
      setShowPlanModal(false)
      resetPlanForm()
      alert('Trainingsplan erfolgreich erstellt!')
    } catch (error) {
      console.error('Error creating plan:', error)
      alert('Fehler beim Erstellen des Plans')
    }
  }

  const handleUpdatePlan = async () => {
    if (!selectedPlan) return
    try {
      await axios.put(`http://localhost:8080/api/training/plans/${selectedPlan.id}`, planForm)
      loadTrainingPlans()
      if (activePlan?.id === selectedPlan.id) loadActivePlan()
      setShowPlanModal(false)
      resetPlanForm()
      alert('Trainingsplan erfolgreich aktualisiert!')
    } catch (error) {
      console.error('Error updating plan:', error)
      alert('Fehler beim Aktualisieren des Plans')
    }
  }

  const handleActivatePlan = async (planId: number) => {
    try {
      await axios.patch(`http://localhost:8080/api/training/plans/${planId}/activate`, null, {
        params: { userId: 1 }
      })
      loadTrainingPlans()
      loadActivePlan()
      alert('Trainingsplan aktiviert! Workouts wurden im Kalender (Kategorie "Trainingsplan") für diese und nächste Woche eingetragen.')
    } catch (error) {
      console.error('Error activating plan:', error)
      alert('Fehler beim Aktivieren des Plans')
    }
  }

  const handleDeletePlan = async (planId: number) => {
    if (!confirm('Trainingsplan wirklich löschen? Alle Workouts werden ebenfalls gelöscht.')) return
    try {
      await axios.delete(`http://localhost:8080/api/training/plans/${planId}`)
      loadTrainingPlans()
      if (activePlan?.id === planId) {
        setActivePlan(null)
        setSelectedPlan(null)
      }
      alert('Trainingsplan gelöscht!')
    } catch (error) {
      console.error('Error deleting plan:', error)
      alert('Fehler beim Löschen des Plans')
    }
  }

  const handleCreateWorkout = async () => {
    if (!selectedPlan) return
    try {
      await axios.post(`http://localhost:8080/api/training/plans/${selectedPlan.id}/workouts`, workoutForm)
      loadWorkouts(selectedPlan.id)
      setShowWorkoutModal(false)
      resetWorkoutForm()
      alert('Workout erfolgreich erstellt!')
    } catch (error) {
      console.error('Error creating workout:', error)
      alert('Fehler beim Erstellen des Workouts')
    }
  }

  const handleUpdateWorkout = async () => {
    if (!selectedWorkout) return
    try {
      await axios.put(`http://localhost:8080/api/training/workouts/${selectedWorkout.id}`, workoutForm)
      loadWorkouts(selectedWorkout.trainingPlanId)
      setShowWorkoutModal(false)
      resetWorkoutForm()
      alert('Workout erfolgreich aktualisiert!')
    } catch (error) {
      console.error('Error updating workout:', error)
      alert('Fehler beim Aktualisieren des Workouts')
    }
  }

  const handleCompleteWorkout = async (workoutId: number) => {
    if (!confirm('Workout als absolviert markieren? Es wird in der Kalender-Kategorie "Fitness" gespeichert.')) return
    try {
      await axios.patch(`http://localhost:8080/api/training/workouts/${workoutId}/complete`)
      if (selectedPlan) loadWorkouts(selectedPlan.id)
      alert('Workout absolviert! 🎉 Es wurde im Kalender unter "Fitness" gespeichert.')
    } catch (error) {
      console.error('Error completing workout:', error)
      alert('Fehler beim Abschließen des Workouts')
    }
  }

  const handleDeleteWorkout = async (workoutId: number) => {
    if (!confirm('Workout wirklich löschen?')) return
    try {
      await axios.delete(`http://localhost:8080/api/training/workouts/${workoutId}`)
      if (selectedPlan) loadWorkouts(selectedPlan.id)
      if (selectedWorkout?.id === workoutId) {
        setSelectedWorkout(null)
        setShowWorkoutDetail(false)
      }
      alert('Workout gelöscht!')
    } catch (error) {
      console.error('Error deleting workout:', error)
      alert('Fehler beim Löschen des Workouts')
    }
  }

  const handleCreateExercise = async () => {
    if (!selectedWorkout) return
    try {
      await axios.post(`http://localhost:8080/api/training/workouts/${selectedWorkout.id}/exercises`, {
        ...exerciseForm,
        position: exercises.length
      })
      loadExercises(selectedWorkout.id)
      setShowExerciseModal(false)
      resetExerciseForm()
    } catch (error) {
      console.error('Error creating exercise:', error)
      alert('Fehler beim Erstellen der Übung')
    }
  }

  const handleDeleteExercise = async (exerciseId: number) => {
    if (!confirm('Übung wirklich löschen?')) return
    try {
      await axios.delete(`http://localhost:8080/api/training/exercises/${exerciseId}`)
      if (selectedWorkout) loadExercises(selectedWorkout.id)
    } catch (error) {
      console.error('Error deleting exercise:', error)
      alert('Fehler beim Löschen der Übung')
    }
  }

  const openEditPlanModal = (plan: TrainingPlan) => {
    setSelectedPlan(plan)
    setPlanForm({
      name: plan.name,
      description: plan.description || '',
      goal: plan.goal || '',
      durationWeeks: plan.durationWeeks || 12
    })
    setShowPlanModal(true)
  }

  const openEditWorkoutModal = (workout: Workout) => {
    setSelectedWorkout(workout)
    setWorkoutForm({
      name: workout.name,
      description: workout.description || '',
      dayOfWeek: workout.dayOfWeek,
      type: workout.type || '',
      durationMinutes: workout.durationMinutes || 60,
      caloriesBurned: workout.caloriesBurned || 300
    })
    setShowWorkoutModal(true)
  }

  const openWorkoutDetail = (workout: Workout) => {
    setSelectedWorkout(workout)
    setShowWorkoutDetail(true)
  }

  const resetPlanForm = () => {
    setSelectedPlan(null)
    setPlanForm({ name: '', description: '', goal: '', durationWeeks: 12 })
  }

  const resetWorkoutForm = () => {
    setSelectedWorkout(null)
    setWorkoutForm({ name: '', description: '', dayOfWeek: 'MONDAY', type: '', durationMinutes: 60, caloriesBurned: 300 })
  }

  const resetExerciseForm = () => {
    setExerciseForm({ name: '', sets: 3, reps: 10, weight: 0, durationSeconds: 0, notes: '' })
  }

  const getDayLabel = (day: string) => {
    return daysOfWeek.find(d => d.value === day)?.label || day
  }

  const workoutsByDay = daysOfWeek.map(day => ({
    ...day,
    workouts: workouts.filter(w => w.dayOfWeek === day.value)
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🏋️ Fitness & Trainingspläne</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Erstelle Trainingspläne und tracke deine Workouts
          </p>
        </div>
        <button onClick={() => { resetPlanForm(); setShowPlanModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Neuer Trainingsplan
        </button>
      </div>

      {/* Active Plan Banner */}
      {activePlan && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Play size={20} />
                <span className="text-sm font-medium">AKTIVER TRAININGSPLAN</span>
              </div>
              <h2 className="text-2xl font-bold">{activePlan.name}</h2>
              {activePlan.goal && <p className="mt-1 opacity-90">Ziel: {activePlan.goal}</p>}
            </div>
            <button
              onClick={() => setSelectedPlan(activePlan)}
              className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Details anzeigen
            </button>
          </div>
        </div>
      )}

      {/* Training Plans List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Alle Trainingspläne</h2>
        {trainingPlans.length === 0 ? (
          <div className="card text-center py-12">
            <Dumbbell className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 dark:text-gray-400 mb-4">Noch keine Trainingspläne vorhanden</p>
            <button onClick={() => { resetPlanForm(); setShowPlanModal(true); }} className="btn-primary">
              Ersten Plan erstellen
            </button>
          </div>
        ) : (
          trainingPlans.map(plan => (
            <div key={plan.id} className={`card ${plan.active ? 'ring-2 ring-primary-500' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    {plan.active && (
                      <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-1 rounded-full font-medium">
                        AKTIV
                      </span>
                    )}
                  </div>
                  {plan.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{plan.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {plan.goal && (
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Target size={16} />
                        {plan.goal}
                      </div>
                    )}
                    {plan.durationWeeks && (
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Calendar size={16} />
                        {plan.durationWeeks} Wochen
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!plan.active && (
                    <button
                      onClick={() => handleActivatePlan(plan.id)}
                      className="btn-secondary flex items-center gap-2 text-green-600 dark:text-green-400"
                      title="Plan aktivieren"
                    >
                      <Play size={18} />
                      Aktivieren
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedPlan(plan)
                      setExpandedPlan(expandedPlan === plan.id ? null : plan.id)
                    }}
                    className="btn-secondary"
                    title="Workouts anzeigen"
                  >
                    {expandedPlan === plan.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <button onClick={() => openEditPlanModal(plan)} className="btn-secondary" title="Bearbeiten">
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="btn-secondary text-red-600 dark:text-red-400"
                    title="Löschen"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Workouts Section */}
              {expandedPlan === plan.id && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold">Workouts</h4>
                    <button
                      onClick={() => { setSelectedPlan(plan); resetWorkoutForm(); setShowWorkoutModal(true); }}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                      <Plus size={16} />
                      Workout hinzufügen
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                    {workoutsByDay.map(day => {
                      const dayWorkouts = workouts.filter(w => w.trainingPlanId === plan.id && w.dayOfWeek === day.value)
                      return (
                        <div key={day.value} className="bg-gray-50 dark:bg-gray-750 rounded-lg p-3">
                          <div className="text-center font-semibold text-sm mb-2">{day.short}</div>
                          <div className="space-y-2">
                            {dayWorkouts.map(workout => (
                              <div
                                key={workout.id}
                                onClick={() => openWorkoutDetail(workout)}
                                className={`p-2 rounded cursor-pointer transition-colors text-xs ${
                                  workout.completed
                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                              >
                                <div className="font-medium truncate">{workout.name}</div>
                                {workout.durationMinutes && (
                                  <div className="flex items-center gap-1 text-gray-500 mt-1">
                                    <Clock size={12} />
                                    {workout.durationMinutes}min
                                  </div>
                                )}
                              </div>
                            ))}
                            {dayWorkouts.length === 0 && (
                              <div className="text-xs text-center text-gray-400 py-2">Kein Training</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedPlan ? 'Trainingsplan bearbeiten' : 'Neuer Trainingsplan'}
              </h2>
              <button onClick={() => { setShowPlanModal(false); resetPlanForm(); }} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="input w-full"
                  placeholder="z.B. Push/Pull/Legs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Beschreibung</label>
                <textarea
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  className="input w-full h-24"
                  placeholder="Beschreibe deinen Trainingsplan..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ziel</label>
                  <select
                    value={planForm.goal}
                    onChange={(e) => setPlanForm({ ...planForm, goal: e.target.value })}
                    className="input w-full"
                  >
                    <option value="">Ziel wählen</option>
                    {goals.map(goal => (
                      <option key={goal} value={goal}>{goal}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dauer (Wochen)</label>
                  <input
                    type="number"
                    value={planForm.durationWeeks}
                    onChange={(e) => setPlanForm({ ...planForm, durationWeeks: parseInt(e.target.value) })}
                    className="input w-full"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={() => { setShowPlanModal(false); resetPlanForm(); }} className="btn-secondary flex-1">
                  Abbrechen
                </button>
                <button
                  onClick={selectedPlan ? handleUpdatePlan : handleCreatePlan}
                  className="btn-primary flex-1"
                  disabled={!planForm.name}
                >
                  {selectedPlan ? 'Speichern' : 'Erstellen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Workout Modal */}
      {showWorkoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {selectedWorkout ? 'Workout bearbeiten' : 'Neues Workout'}
              </h2>
              <button onClick={() => { setShowWorkoutModal(false); resetWorkoutForm(); }} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  value={workoutForm.name}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, name: e.target.value })}
                  className="input w-full"
                  placeholder="z.B. Brust & Trizeps"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Beschreibung</label>
                <textarea
                  value={workoutForm.description}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, description: e.target.value })}
                  className="input w-full h-24"
                  placeholder="Beschreibe das Workout..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Wochentag *</label>
                  <select
                    value={workoutForm.dayOfWeek}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, dayOfWeek: e.target.value })}
                    className="input w-full"
                  >
                    {daysOfWeek.map(day => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Typ</label>
                  <select
                    value={workoutForm.type}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, type: e.target.value })}
                    className="input w-full"
                  >
                    <option value="">Typ wählen</option>
                    {workoutTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Dauer (Minuten)</label>
                  <input
                    type="number"
                    value={workoutForm.durationMinutes}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, durationMinutes: parseInt(e.target.value) })}
                    className="input w-full"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Kalorien</label>
                  <input
                    type="number"
                    value={workoutForm.caloriesBurned}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, caloriesBurned: parseInt(e.target.value) })}
                    className="input w-full"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={() => { setShowWorkoutModal(false); resetWorkoutForm(); }} className="btn-secondary flex-1">
                  Abbrechen
                </button>
                <button
                  onClick={selectedWorkout ? handleUpdateWorkout : handleCreateWorkout}
                  className="btn-primary flex-1"
                  disabled={!workoutForm.name}
                >
                  {selectedWorkout ? 'Speichern' : 'Erstellen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workout Detail Modal */}
      {showWorkoutDetail && selectedWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{selectedWorkout.name}</h2>
              <button onClick={() => setShowWorkoutDetail(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {selectedWorkout.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedWorkout.description}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="card">
                <Calendar size={20} className="text-primary-600 mb-2" />
                <div className="text-sm text-gray-600 dark:text-gray-400">Wochentag</div>
                <div className="font-semibold">{getDayLabel(selectedWorkout.dayOfWeek)}</div>
              </div>
              {selectedWorkout.type && (
                <div className="card">
                  <Dumbbell size={20} className="text-primary-600 mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">Typ</div>
                  <div className="font-semibold">{selectedWorkout.type}</div>
                </div>
              )}
              {selectedWorkout.durationMinutes && (
                <div className="card">
                  <Clock size={20} className="text-primary-600 mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">Dauer</div>
                  <div className="font-semibold">{selectedWorkout.durationMinutes} min</div>
                </div>
              )}
              {selectedWorkout.caloriesBurned && (
                <div className="card">
                  <Flame size={20} className="text-orange-500 mb-2" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">Kalorien</div>
                  <div className="font-semibold">{selectedWorkout.caloriesBurned} kcal</div>
                </div>
              )}
            </div>

            {/* Exercises */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Übungen ({exercises.length})</h3>
                <button
                  onClick={() => { resetExerciseForm(); setShowExerciseModal(true); }}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  Übung hinzufügen
                </button>
              </div>

              {exercises.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Noch keine Übungen hinzugefügt
                </div>
              ) : (
                <div className="space-y-2">
                  {exercises.map((exercise, index) => (
                    <div key={exercise.id} className="card flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold">{index + 1}. {exercise.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {exercise.sets && exercise.reps && (
                            <span>{exercise.sets} x {exercise.reps} Wdh.</span>
                          )}
                          {exercise.weight && exercise.weight > 0 && (
                            <span className="ml-3">{exercise.weight} kg</span>
                          )}
                          {exercise.durationSeconds && exercise.durationSeconds > 0 && (
                            <span className="ml-3">{exercise.durationSeconds}s</span>
                          )}
                        </div>
                        {exercise.notes && (
                          <div className="text-sm text-gray-500 mt-1 italic">{exercise.notes}</div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteExercise(exercise.id!)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {!selectedWorkout.completed && (
                <button
                  onClick={() => handleCompleteWorkout(selectedWorkout.id)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Check size={18} />
                  Workout absolvieren
                </button>
              )}
              <button onClick={() => openEditWorkoutModal(selectedWorkout)} className="btn-secondary flex items-center gap-2">
                <Edit2 size={18} />
                Bearbeiten
              </button>
              <button
                onClick={() => handleDeleteWorkout(selectedWorkout.id)}
                className="btn-secondary flex items-center gap-2 text-red-600 dark:text-red-400 ml-auto"
              >
                <Trash2 size={18} />
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Exercise Modal */}
      {showExerciseModal && selectedWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Übung hinzufügen</h2>
              <button onClick={() => { setShowExerciseModal(false); resetExerciseForm(); }} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Übungsname *</label>
                <input
                  type="text"
                  value={exerciseForm.name}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                  className="input w-full"
                  placeholder="z.B. Bankdrücken"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sätze</label>
                  <input
                    type="number"
                    value={exerciseForm.sets}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, sets: parseInt(e.target.value) })}
                    className="input w-full"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Wdh.</label>
                  <input
                    type="number"
                    value={exerciseForm.reps}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, reps: parseInt(e.target.value) })}
                    className="input w-full"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Gewicht (kg)</label>
                  <input
                    type="number"
                    value={exerciseForm.weight}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, weight: parseInt(e.target.value) })}
                    className="input w-full"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dauer (Sekunden, optional)</label>
                <input
                  type="number"
                  value={exerciseForm.durationSeconds}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, durationSeconds: parseInt(e.target.value) })}
                  className="input w-full"
                  min="0"
                  placeholder="z.B. 60 für Planks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notizen</label>
                <textarea
                  value={exerciseForm.notes}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, notes: e.target.value })}
                  className="input w-full h-20"
                  placeholder="z.B. Langsam ausführen, auf Form achten"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={() => { setShowExerciseModal(false); resetExerciseForm(); }} className="btn-secondary flex-1">
                  Abbrechen
                </button>
                <button
                  onClick={handleCreateExercise}
                  className="btn-primary flex-1"
                  disabled={!exerciseForm.name}
                >
                  Hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
