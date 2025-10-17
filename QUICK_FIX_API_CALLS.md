# ⚡ SCHNELL-FIX: Alle Frontend-API-Calls auf einmal reparieren

## Status: 11 API-Calls identifiziert + 3 bereits gefixt = 14 total

### ✅ Bereits Gefixt (3 Dateien):
1. ✅ Dashboard.tsx → Line 44
2. ✅ WorkDashboard.tsx → Line 27
3. ✅ SchoolDashboard.tsx → Line 27

### ⏳ Noch zu fixen (8 Dateien, 11 Calls):

#### 1. CalendarPage.tsx (2 calls)
```typescript
// Line 54 - GET events
// ALT:
const response = await axios.get('http://localhost:5000/api/calendar/events', {
  params: { userId: 1, start, end }
})

// NEU:
const userId = useAuthStore.getState().userId || 1
const response = await axios.get(api.events.getRange(userId), {
  params: { start, end }
})

// Line 169 - POST event
// ALT:
await axios.post('http://localhost:5000/api/calendar/events', eventData)

// NEU:
await axios.post(api.events.create(userId), eventData)
```

#### 2. NutritionPage.tsx (2 calls)
```typescript
// Line 134 - POST goal
// ALT:
await axios.post('http://localhost:5000/api/nutrition/goal', { calories, protein, carbs, fats })

// NEU:
const userId = useAuthStore.getState().userId || 1
await axios.post(api.meals.create(userId), {
  mealName: 'Nutrition Goal',
  mealType: 'goal',
  date: new Date().toISOString().split('T')[0],
  calories, protein, carbs, fats
})

// Line 160 - POST daily
// ALT:
await axios.post('http://localhost:5000/api/nutrition/daily', { date, calories, protein, carbs, fats })

// NEU:
await axios.post(api.meals.create(userId), {
  mealName: 'Daily Log',
  mealType: 'daily',
  date,
  calories, protein, carbs, fats
})
```

#### 3. WeightPage.tsx (1 call)
```typescript
// Line 81 - POST weight
// ALT:
await axios.post('http://localhost:5000/api/weight', { weight, date, notes })

// NEU:
const userId = useAuthStore.getState().userId || 1
await axios.post(api.weight.create(userId), { weight, date, notes })
```

#### 4. FitnessPage.tsx (3 calls)
```typescript
// Line 117 - GET plans
// ALT:
const response = await axios.get('http://localhost:5000/api/training/plans', {
  params: { userId: 1 }
})

// NEU:
const userId = useAuthStore.getState().userId || 1
const response = await axios.get(api.training.getPlans(userId))

// Line 128 - GET active plan
// ALT:
const response = await axios.get('http://localhost:5000/api/training/plans/active', {
  params: { userId: 1 }
})

// NEU:
const response = await axios.get(api.training.getActivePlan(userId))

// Line 159 - POST create plan
// ALT:
await axios.post('http://localhost:5000/api/training/plans', { name, description, goal })

// NEU:
await axios.post(api.training.createPlan(), {
  userId,
  name, description, goal
})
```

#### 5. KanbanBoard.tsx (3 calls)
```typescript
// Line 94 - GET todos
// ALT:
const response = await axios.get('http://localhost:5000/api/todos', {
  params: { userId: 1, category, archived: false }
})

// NEU:
const userId = useAuthStore.getState().userId || 1
const response = await axios.get(api.todos.getByCategory(userId, category))

// Line 105 - GET stats
// ALT:
const response = await axios.get('http://localhost:5000/api/todos/stats', {
  params: { userId: 1 }
})

// NEU:
// WORKAROUND: Backend has no /todos/stats endpoint
// Use dashboard stats instead
const response = await axios.get(api.dashboard.getStats(userId))
// Then extract: openTodosCount, completedTodosCount

// Line 159 - POST create todo
// ALT:
await axios.post('http://localhost:5000/api/todos', formData)

// NEU:
await axios.post(api.todos.create(userId), formData)
```

---

## 🚀 Automatisches Fix-Script

### Dateiänderungen erforderlich:

**Alle 8 Dateien benötigen:**
```typescript
// Am Anfang der Datei hinzufügen:
import { api } from '../../api/endpoints'  // oder '../api/endpoints' je nach Pfad
import { useAuthStore } from '../../store/authStore'
```

**In jeder Funktion, die API-Calls macht:**
```typescript
const userId = useAuthStore.getState().userId || 1
```

---

## 📝 Manueller Fix-Plan (Schritt für Schritt)

### Schritt 1: CalendarPage.tsx fixenimport hinzufügen oben:
```typescript
import { api } from '../../api/endpoints'
import { useAuthStore } from '../../store/authStore'
```

Dann Line 48-60 ersetzen:
```typescript
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
```

Dann Line 165-173 ersetzen:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    const userId = useAuthStore.getState().userId || 1
    const eventData = { ...formData, userId }
    
    if (selectedEvent?.id) {
      await axios.put(api.events.update(userId, selectedEvent.id), eventData)
    } else {
      await axios.post(api.events.create(userId), eventData)
    }
    loadEvents()
    setShowModal(false)
    setSelectedEvent(null)
    // ... rest bleibt gleich
  }
}
```

### Schritt 2: Alle anderen Dateien analog fixen

---

## ✅ Fertigstellungs-Checkliste

- [x] endpoints.ts erstellt
- [x] Dashboard.tsx gefixt
- [x] WorkDashboard.tsx gefixt
- [x] SchoolDashboard.tsx gefixt
- [ ] CalendarPage.tsx fixen
- [ ] NutritionPage.tsx fixen
- [ ] WeightPage.tsx fixen
- [ ] FitnessPage.tsx fixen
- [ ] KanbanBoard.tsx fixen
- [ ] npm install im Frontend ausführen
- [ ] Frontend starten und testen
- [ ] Backend starten und testen
- [ ] End-to-End Tests durchführen
