# 🔴 KRITISCHES PROBLEM: Frontend-Backend Disconnect

## 🎯 Problem

Das **gesamte Frontend** ist mit der **alten API-Struktur** verbunden und funktioniert nicht mehr mit der neuen Datenbank-Struktur!

### Alte API-Calls gefunden:

1. **Dashboard:** `/api/dashboard/1` ❌
2. **Calendar:** `/api/calendar/events` ❌
3. **Todos:** `/api/todos` ❌
4. **Nutrition:** `/api/nutrition/goal`, `/api/nutrition/daily` ❌
5. **Weight:** `/api/weight` ❌
6. **Fitness:** `/api/training/plans` ❌

### Warum funktioniert nichts?

**Das Frontend lädt Daten von Endpoints, die entweder:**
- ❌ Nicht existieren (z.B. `/api/dashboard/1`)
- ❌ Alte Datenstruktur zurückgeben
- ❌ Nicht mit userId aus authStore arbeiten

---

## 📊 Betroffene Komponenten

### 1. **Dashboards** (3 Dateien)
- `pages/private/Dashboard.tsx` - Lädt `/api/dashboard/1`
- `pages/work/Dashboard.tsx` - Lädt `/api/calendar/events/upcoming`
- `pages/school/Dashboard.tsx` - Lädt `/api/calendar/events/upcoming`

### 2. **Feature Pages** (6 Dateien)
- `pages/private/TodosPage.tsx` → `/api/todos`
- `pages/private/CalendarPage.tsx` → `/api/calendar/events`
- `pages/private/FitnessPage.tsx` → `/api/training/plans`
- `pages/private/WeightPage.tsx` → `/api/weight`
- `pages/private/NutritionPage.tsx` → `/api/nutrition/*`
- `pages/school/GradesPage.tsx` → `/api/grades`

### 3. **Shared Components** (2 Dateien)
- `components/KanbanBoard.tsx` → `/api/todos`
- `components/NotesPage.tsx` → `/api/notes`

**Total:** ~15+ Komponenten betroffen!

---

## ✅ Lösung: Umfassende Frontend-Überarbeitung

### Phase 1: API-Struktur definieren ⏳

**Neue API-Endpoints (basierend auf V2.0 Datenbank):**

```
# User Management
GET    /api/user/{userId}/data           # loadUserData (Settings + Profile + Sidebar)
PUT    /api/user/{userId}/settings       # updateUserSettings
PUT    /api/user/{userId}/profile        # updateUserProfile

# Todos
GET    /api/todos?userId={userId}&category={category}
POST   /api/todos
PUT    /api/todos/{id}
DELETE /api/todos/{id}

# Calendar Events
GET    /api/calendar/events?userId={userId}
POST   /api/calendar/events
PUT    /api/calendar/events/{id}
DELETE /api/calendar/events/{id}

# School - Subjects
GET    /api/school/subjects?userId={userId}
POST   /api/school/subjects
PUT    /api/school/subjects/{id}
DELETE /api/school/subjects/{id}

# School - Timetable
GET    /api/school/timetable?userId={userId}
POST   /api/school/timetable
PUT    /api/school/timetable/{id}
DELETE /api/school/timetable/{id}

# School - Homework
GET    /api/school/homework?userId={userId}
POST   /api/school/homework
PUT    /api/school/homework/{id}
DELETE /api/school/homework/{id}

# School - Exams
GET    /api/school/exams?userId={userId}
POST   /api/school/exams
PUT    /api/school/exams/{id}
DELETE /api/school/exams/{id}

# School - Grades
GET    /api/school/grades?userId={userId}
GET    /api/school/grades/average?userId={userId}&subjectId={subjectId}
POST   /api/school/grades
PUT    /api/school/grades/{id}
DELETE /api/school/grades/{id}

# School - Notes
GET    /api/school/notes?userId={userId}
POST   /api/school/notes
PUT    /api/school/notes/{id}
DELETE /api/school/notes/{id}

# School - Materials
GET    /api/school/materials?userId={userId}
POST   /api/school/materials
PUT    /api/school/materials/{id}
DELETE /api/school/materials/{id}

# School - Submissions
GET    /api/school/submissions?userId={userId}
POST   /api/school/submissions
PUT    /api/school/submissions/{id}
DELETE /api/school/submissions/{id}

# School - Projects
GET    /api/school/projects?userId={userId}
POST   /api/school/projects
PUT    /api/school/projects/{id}
DELETE /api/school/projects/{id}

# School - Flashcards
GET    /api/school/flashcards/decks?userId={userId}
GET    /api/school/flashcards/deck/{deckId}/cards
POST   /api/school/flashcards/decks
POST   /api/school/flashcards/cards
PUT    /api/school/flashcards/decks/{id}
PUT    /api/school/flashcards/cards/{id}
DELETE /api/school/flashcards/decks/{id}
DELETE /api/school/flashcards/cards/{id}

# School - Summaries
GET    /api/school/summaries?userId={userId}
POST   /api/school/summaries
PUT    /api/school/summaries/{id}
DELETE /api/school/summaries/{id}

# School - Study Sessions
GET    /api/school/study-sessions?userId={userId}
GET    /api/school/study-sessions/total-time?userId={userId}
POST   /api/school/study-sessions
PUT    /api/school/study-sessions/{id}
DELETE /api/school/study-sessions/{id}

# School - Absences
GET    /api/school/absences?userId={userId}
GET    /api/school/absences/count?userId={userId}
POST   /api/school/absences
PUT    /api/school/absences/{id}
DELETE /api/school/absences/{id}

# Fitness
GET    /api/fitness/workouts?userId={userId}
POST   /api/fitness/workouts
PUT    /api/fitness/workouts/{id}
DELETE /api/fitness/workouts/{id}

# Weight
GET    /api/weight/logs?userId={userId}
POST   /api/weight/logs
PUT    /api/weight/logs/{id}
DELETE /api/weight/logs/{id}

# Nutrition
GET    /api/nutrition/meals?userId={userId}
POST   /api/nutrition/meals
PUT    /api/nutrition/meals/{id}
DELETE /api/nutrition/meals/{id}

# Sidebar Config (bereits existiert!)
GET    /api/sidebar/{userId}
POST   /api/sidebar/{userId}
POST   /api/sidebar/{userId}/reset
```

---

### Phase 2: Backend Controllers erstellen 🔴

**PRIORITY HIGH - Ohne diese funktioniert gar nichts!**

#### Must-Have Controllers (sofort):
1. ✅ **SidebarController** - Existiert bereits!
2. ⏳ **TodoController** - CRUD für Todos
3. ⏳ **CalendarController** - CRUD für Calendar Events
4. ⏳ **SchoolSubjectController** - CRUD für Subjects
5. ⏳ **SchoolTimetableController** - CRUD für Stundenplan
6. ⏳ **SchoolHomeworkController** - CRUD für Hausaufgaben
7. ⏳ **SchoolExamController** - CRUD für Prüfungen
8. ⏳ **SchoolGradeController** - CRUD + Average-Berechnung

#### Nice-to-Have Controllers (später):
9. ⏳ FitnessController
10. ⏳ WeightController
11. ⏳ NutritionController

---

### Phase 3: Frontend API-Service erstellen ⏳

**Zentrale API-Service Klasse:**

```typescript
// frontend/src/services/api.ts

import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Auto-inject userId from authStore
api.interceptors.request.use((config) => {
  const userId = useAuthStore.getState().userId;
  if (userId) {
    config.params = { ...config.params, userId };
  }
  return config;
});

export const todoApi = {
  getAll: (category?: string) => api.get('/todos', { params: { category } }),
  create: (data: any) => api.post('/todos', data),
  update: (id: number, data: any) => api.put(`/todos/${id}`, data),
  delete: (id: number) => api.delete(`/todos/${id}`),
};

export const calendarApi = {
  getAll: () => api.get('/calendar/events'),
  create: (data: any) => api.post('/calendar/events', data),
  update: (id: number, data: any) => api.put(`/calendar/events/${id}`, data),
  delete: (id: number) => api.delete(`/calendar/events/${id}`),
};

export const schoolApi = {
  subjects: {
    getAll: () => api.get('/school/subjects'),
    create: (data: any) => api.post('/school/subjects', data),
    update: (id: number, data: any) => api.put(`/school/subjects/${id}`, data),
    delete: (id: number) => api.delete(`/school/subjects/${id}`),
  },
  // ... 12 weitere School-Features
};

export default api;
```

---

### Phase 4: Frontend Komponenten anpassen ⏳

**Jede Komponente muss:**
1. ✅ Neue API-Service verwenden
2. ✅ userId aus authStore holen
3. ✅ Neue Datenstruktur verwenden (mit timestamps, auditing)

**Beispiel TodosPage.tsx:**

```typescript
// OLD ❌
const response = await axios.get('http://localhost:5000/api/todos');

// NEW ✅
import { todoApi } from '../services/api';
const response = await todoApi.getAll(category);
```

---

## 📋 Action Plan

### Sofort (Priority 1):
1. 🔴 **TodoController** erstellen → TodosPage funktioniert
2. 🔴 **CalendarController** erstellen → CalendarPage funktioniert
3. 🔴 **API-Service** erstellen (frontend) → Zentrale API-Verwaltung

### Danach (Priority 2):
4. 🟡 **8 School-Controllers** erstellen → School-Pages funktionieren
5. 🟡 **Frontend Komponenten** anpassen (15+ Dateien)

### Später (Priority 3):
6. 🟢 **Fitness/Weight/Nutrition Controllers** erstellen
7. 🟢 **Dashboard aggregierte Daten** (braucht alle Controller!)

---

## 🚨 Kritischer Zustand

**Aktueller Status:**
- ✅ Backend: Datenbank-Struktur perfekt (V2.0)
- ✅ Backend: Repositories vorhanden (12 neue)
- ✅ Backend: UserService funktioniert
- ❌ **Backend: Keine CRUD-Controller** (außer Sidebar!)
- ❌ **Frontend: Verwendet alte APIs**
- ❌ **Frontend: Keine Daten werden geladen**

**Das System ist aktuell NICHT funktionsfähig!**

---

## ✅ Empfehlung

**Schritt-für-Schritt vorgehen:**

1. **Jetzt sofort:** TodoController + CalendarController erstellen
2. **Dann:** Frontend API-Service erstellen
3. **Dann:** TodosPage + CalendarPage anpassen
4. **Dann:** School-Controllers erstellen (8 Stück)
5. **Dann:** School-Pages anpassen (11 Stück)

**Geschätzte Zeit:** 4-6 Stunden für vollständige Funktionalität

---

## 📊 Fortschritt

- [x] Datenbank-Struktur (V2.0)
- [x] Entities (17 Stück)
- [x] Repositories (12 Stück)
- [x] UserService
- [x] SidebarController
- [x] Frontend Sidebar
- [x] Frontend Routing
- [ ] **Controllers (10+ fehlen)** 🔴
- [ ] **Frontend API-Service** 🔴
- [ ] **Frontend Komponenten-Anpassung** 🔴

**Completion:** 60% → Benötigt noch 40% für vollständige Funktionalität!
