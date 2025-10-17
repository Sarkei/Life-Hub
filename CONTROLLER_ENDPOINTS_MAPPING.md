# Controller Endpoints Mapping

## ✅ Backend Controller Status (ALLE EXISTIEREN!)

### 1. DashboardController (`/api/dashboard`)
```
✅ GET /api/dashboard/{userId}                     - Full dashboard data
✅ GET /api/dashboard/{userId}/stats               - Statistics only
✅ GET /api/dashboard/{userId}/todos/open          - Open todos
✅ GET /api/dashboard/{userId}/events/upcoming     - Upcoming events (7 days)
✅ GET /api/dashboard/{userId}/events/today        - Today's events
✅ GET /api/dashboard/{userId}/todos/overdue       - Overdue todos
```

### 2. CalendarEventController (`/api/events`)
```
✅ GET    /api/events/{userId}                     - All events
✅ GET    /api/events/{userId}/category/{category} - By category
✅ GET    /api/events/{userId}/range               - Date range (query params)
✅ GET    /api/events/{userId}/upcoming            - Upcoming events
✅ GET    /api/events/{userId}/today               - Today's events
✅ GET    /api/events/{userId}/related/{type}/{id} - Related to entity
✅ GET    /api/events/{userId}/item/{eventId}      - Single event
✅ POST   /api/events/{userId}                     - Create event
✅ PUT    /api/events/{userId}/{eventId}           - Update event
✅ POST   /api/events/{userId}/{eventId}/cancel    - Cancel event
✅ POST   /api/events/{userId}/{eventId}/confirm   - Confirm event
✅ DELETE /api/events/{userId}/{eventId}           - Delete event
```

### 3. WeightController (`/api/weight`)
```
✅ GET    /api/weight/{userId}                     - All weight logs (optional date range)
✅ POST   /api/weight/{userId}                     - Create weight log
✅ PUT    /api/weight/{userId}/{id}                - Update weight log
✅ DELETE /api/weight/{userId}/{id}                - Delete weight log
```

### 4. MealController (`/api/meals`)
```
✅ GET    /api/meals/{userId}                      - All meals (optional date/range)
✅ POST   /api/meals/{userId}                      - Create meal
✅ PUT    /api/meals/{userId}/{id}                 - Update meal
✅ DELETE /api/meals/{userId}/{id}                 - Delete meal
```

### 5. TodoController (`/api/todos`)
```
✅ GET    /api/todos/{userId}                      - All todos
✅ GET    /api/todos/{userId}/category/{category}  - By category
✅ GET    /api/todos/{userId}/status/{status}      - By status
✅ GET    /api/todos/{userId}/open                 - Open todos
✅ GET    /api/todos/{userId}/completed            - Completed todos
✅ GET    /api/todos/{userId}/overdue              - Overdue todos
✅ GET    /api/todos/{userId}/item/{todoId}        - Single todo
✅ POST   /api/todos/{userId}                      - Create todo
✅ PUT    /api/todos/{userId}/{todoId}             - Update todo
✅ POST   /api/todos/{userId}/{todoId}/complete    - Mark complete
✅ POST   /api/todos/{userId}/{todoId}/uncomplete  - Mark incomplete
✅ DELETE /api/todos/{userId}/{todoId}             - Delete todo
```

### 6. School Controllers
```
✅ GradeController           - /api/grades
✅ HomeworkController        - /api/homework
✅ ExamController            - /api/exams
✅ TimetableController       - /api/timetable
✅ SchoolSubjectController   - /api/school-subjects
✅ SchoolNoteController      - /api/school-notes
✅ StudySessionController    - /api/study-sessions
✅ AbsenceController         - /api/absences
```

---

## ❌ Frontend API Calls (FALSCHE URLs!)

### Frontend → Backend URL Mapping

| Frontend File | Frontend URL (❌ FALSCH) | Backend URL (✅ RICHTIG) |
|---------------|--------------------------|--------------------------|
| **Dashboard.tsx:44** | `GET /api/dashboard/1` | `GET /api/dashboard/{userId}` |
| **PrivateDashboard.tsx** | `GET /api/dashboard/1` | `GET /api/dashboard/{userId}` |
| **WorkDashboard.tsx:27** | `GET /api/calendar/events/upcoming` | `GET /api/events/{userId}/upcoming` |
| **SchoolDashboard.tsx:27** | `GET /api/calendar/events/upcoming` | `GET /api/events/{userId}/upcoming` |
| **CalendarPage.tsx:54** | `GET /api/calendar/events` | `GET /api/events/{userId}` |
| **CalendarPage.tsx:169** | `POST /api/calendar/events` | `POST /api/events/{userId}` |
| **NutritionPage.tsx:134** | `POST /api/nutrition/goal` | `POST /api/meals/{userId}` (?) |
| **NutritionPage.tsx:160** | `POST /api/nutrition/daily` | `POST /api/meals/{userId}` (?) |
| **WeightPage.tsx:81** | `POST /api/weight` | `POST /api/weight/{userId}` |
| **FitnessPage.tsx:117** | `GET /api/training/plans` | ❓ (Controller prüfen) |
| **FitnessPage.tsx:128** | `GET /api/training/plans/active` | ❓ (Controller prüfen) |
| **FitnessPage.tsx:159** | `POST /api/training/plans` | ❓ (Controller prüfen) |
| **KanbanBoard.tsx:94** | `GET /api/todos` | `GET /api/todos/{userId}` |
| **KanbanBoard.tsx:105** | `GET /api/todos/stats` | ❓ (Neuer Endpoint?) |
| **KanbanBoard.tsx:159** | `POST /api/todos` | `POST /api/todos/{userId}` |

---

## 🔧 Benötigte Frontend-Änderungen

### 1. Zentrale API-Konfiguration erstellen
Datei: `frontend/src/api/endpoints.ts`

### 2. Alle 14+ axios-Calls aktualisieren
- Dashboard.tsx (1 Call)
- PrivateDashboard.tsx (1 Call)  
- WorkDashboard.tsx (1 Call)
- SchoolDashboard.tsx (1 Call)
- CalendarPage.tsx (2 Calls)
- NutritionPage.tsx (2 Calls)
- WeightPage.tsx (1 Call)
- FitnessPage.tsx (3 Calls)
- KanbanBoard.tsx (3 Calls)

### 3. UserID aus Auth Store holen
```typescript
const userId = useAuthStore(state => state.user?.id);
```

### 4. Neue URLs verwenden
```typescript
// Alt: axios.get('http://localhost:5000/api/dashboard/1')
// Neu: axios.get(`http://localhost:5000/api/dashboard/${userId}`)
```

---

## 📝 Nächste Schritte

1. ✅ TrainingPlanController prüfen (für Fitness)
2. ✅ Nutritions/Meals Controller prüfen
3. ✅ Zentrale API-Utility erstellen
4. ✅ Alle 14 Frontend-Calls aktualisieren
5. ✅ Testen!
