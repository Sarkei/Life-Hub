# 🔍 Vollständige API-Call Analyse

## Gefundene API-Calls: 50+ Matches

### ✅ Bereits korrekt (verwenden userId in Path):
1. **Sidebar.tsx** (3 calls)
   - ✅ GET `/api/sidebar/${userId}`
   - ✅ POST `/api/sidebar/${userId}`
   - ✅ POST `/api/sidebar/${userId}/reset`

2. **SchoolPage.tsx** (4 calls)
   - ✅ GET `/api/timetable/${userId}/day/${today}`
   - ✅ GET `/api/exams/${userId}/upcoming`
   - ⚠️ GET `/api/homework/${userId}/upcoming` (prüfen ob Endpoint existiert)
   - ⚠️ GET `/api/grades/${userId}/stats` (prüfen ob Endpoint existiert)

3. **SettingsPage.tsx** (2 calls)
   - ✅ GET `/api/users/${userId}`
   - ✅ PUT `/api/users/${userId}`

4. **Dashboard Pages** (3 calls - bereits gefixt)
   - ✅ PrivateDashboard.tsx
   - ✅ WorkDashboard.tsx
   - ✅ SchoolDashboard.tsx

### ❌ FALSCH - Verwenden KEIN userId oder Query Params:

#### 1. CalendarPage.tsx (4 calls)
```typescript
Line 54:  GET  'http://localhost:5000/api/calendar/events' + params
Line 165: PUT  'http://localhost:5000/api/calendar/events/${id}'
Line 169: POST 'http://localhost:5000/api/calendar/events'
Line 203: DELETE 'http://localhost:5000/api/calendar/events/${id}'
```
**Problem:** Backend erwartet `/api/events/${userId}`!

#### 2. WeightPage.tsx (4 calls)
```typescript
Line 51:  GET  'http://localhost:5000/api/weight' + ?userId=X
Line 63:  GET  'http://localhost:5000/api/weight/stats' + ?userId=X
Line 81:  POST 'http://localhost:5000/api/weight'
Line 114: DELETE 'http://localhost:5000/api/weight/${id}'
```
**Problem:** Backend erwartet `/api/weight/${userId}`, nicht Query Params!

#### 3. NutritionPage.tsx (6 calls)
```typescript
Line 89:  GET  'http://localhost:5000/api/nutrition/goal' + ?userId=X
Line 101: GET  'http://localhost:5000/api/nutrition/daily/today' + ?userId=X
Line 112: GET  'http://localhost:5000/api/nutrition/stats' + ?userId=X
Line 121: GET  'http://localhost:5000/api/nutrition/daily/recent' + ?userId=X&days=7
Line 134: POST 'http://localhost:5000/api/nutrition/goal'
Line 160: POST 'http://localhost:5000/api/nutrition/daily'
```
**Problem:** Backend hat `/api/meals/${userId}`, nicht `/api/nutrition/`!

#### 4. FitnessPage.tsx (13 calls!)
```typescript
Line 117: GET  'http://localhost:5000/api/training/plans' + params {userId}
Line 128: GET  'http://localhost:5000/api/training/plans/active' + params {userId}
Line 141: GET  'http://localhost:5000/api/training/plans/${planId}/workouts'
Line 150: GET  'http://localhost:5000/api/training/workouts/${workoutId}/exercises'
Line 159: POST 'http://localhost:5000/api/training/plans'
Line 176: PUT  'http://localhost:5000/api/training/plans/${id}'
Line 190: PATCH 'http://localhost:5000/api/training/plans/${id}/activate' + params {userId}
Line 205: DELETE 'http://localhost:5000/api/training/plans/${id}'
Line 221: POST 'http://localhost:5000/api/training/plans/${id}/workouts'
Line 235: PUT  'http://localhost:5000/api/training/workouts/${id}'
Line 249: PATCH 'http://localhost:5000/api/training/workouts/${id}/complete'
Line 261: DELETE 'http://localhost:5000/api/training/workouts/${id}'
Line 277: POST 'http://localhost:5000/api/training/workouts/${id}/exercises'
Line 293: DELETE 'http://localhost:5000/api/training/exercises/${id}'
```
**Status:** Diese sind größtenteils KORREKT, nur die ersten 2 verwenden Query Params

#### 5. KanbanBoard.tsx (13 calls!)
```typescript
Line 94:  GET  'http://localhost:5000/api/todos' + params {userId, category, archived}
Line 105: GET  'http://localhost:5000/api/todos/stats' + params {userId}
Line 116: GET  'http://localhost:5000/api/todos/${todoId}/subtasks'
Line 125: GET  'http://localhost:5000/api/todos/${todoId}/comments'
Line 157: PUT  'http://localhost:5000/api/todos/${id}'
Line 159: POST 'http://localhost:5000/api/todos'
Line 174: DELETE 'http://localhost:5000/api/todos/${id}'
Line 185: PATCH 'http://localhost:5000/api/todos/${id}/archive'
Line 205: PATCH 'http://localhost:5000/api/todos/${id}/status'
Line 220: POST 'http://localhost:5000/api/todos/${id}/subtasks'
Line 234: PUT  'http://localhost:5000/api/todos/subtasks/${id}'
Line 246: DELETE 'http://localhost:5000/api/todos/subtasks/${id}'
Line 257: POST 'http://localhost:5000/api/todos/${id}/comments'
```
**Problem:** Backend erwartet `/api/todos/${userId}` am Anfang!

---

## 🎯 Prioritäten-Liste

### Kritisch (brechen komplett):
1. **CalendarPage.tsx** - Völlig falsche URL `/api/calendar/events` statt `/api/events/${userId}`
2. **KanbanBoard.tsx** - Fehlt userId im Path `/api/todos` statt `/api/todos/${userId}`
3. **NutritionPage.tsx** - Falscher Controller `/api/nutrition` statt `/api/meals/${userId}`
4. **WeightPage.tsx** - Query Params statt Path Param

### Mittel (teilweise falsch):
5. **FitnessPage.tsx** - Nur 2 Calls verwenden Query Params statt Path
6. **SchoolPage.tsx** - Prüfen ob Endpoints existieren

---

## 📋 Backend-Controller Überprüfung

### ✅ Existierende Controller:
- ✅ TodoController → `/api/todos/${userId}`
- ✅ CalendarEventController → `/api/events/${userId}` ⚠️ (Frontend sagt "calendar")
- ✅ WeightController → `/api/weight/${userId}`
- ✅ MealController → `/api/meals/${userId}` ⚠️ (Frontend sagt "nutrition")
- ✅ TrainingPlanController → `/api/training/...`
- ✅ DashboardController → `/api/dashboard/${userId}`
- ✅ SidebarController → `/api/sidebar/${userId}`
- ✅ HomeworkController → `/api/homework/${userId}`
- ✅ ExamController → `/api/exams/${userId}`
- ✅ GradeController → `/api/grades/${userId}`
- ✅ TimetableController → `/api/timetable/${userId}`
- ✅ UserController → `/api/users/${userId}`

### ❌ Fehlende Endpoints:
- ❌ `/api/todos/stats` (KanbanBoard braucht das)
- ❌ `/api/grades/${userId}/stats` (SchoolPage braucht das)
- ❌ `/api/homework/${userId}/upcoming` (SchoolPage braucht das)
- ❌ `/api/weight/stats` (WeightPage braucht das)
- ❌ `/api/nutrition/*` (komplett falsch - sollte `/api/meals/` sein)

---

## 🛠️ Fix-Reihenfolge (nach Priorität):

1. ✅ **CalendarPage.tsx** - URL von `/calendar/events` auf `/events/${userId}` ändern
2. ✅ **NutritionPage.tsx** - URL von `/nutrition/` auf `/meals/${userId}` ändern
3. ✅ **WeightPage.tsx** - Query Params auf Path Params ändern
4. ✅ **KanbanBoard.tsx** - `/todos` auf `/todos/${userId}` ändern
5. ✅ **FitnessPage.tsx** - Query Params für plans auf Path Params ändern
6. ✅ **Backend** - Fehlende Endpoints hinzufügen (stats, upcoming, etc.)
7. ✅ **SchoolPage.tsx** - Endpoints verifizieren
8. ✅ **Icon/Favicon** - Lifehub Logo und Tab-Icon korrigieren

---

## 🚨 Kritische Erkenntnisse:

1. **Frontend verwendet falsche Controller-Namen:**
   - `/api/calendar/*` → sollte `/api/events/*` sein
   - `/api/nutrition/*` → sollte `/api/meals/*` sein

2. **Frontend verwendet Query Params statt Path Params:**
   - `?userId=1` → sollte `/${userId}` sein

3. **Mehrere Endpoints fehlen im Backend:**
   - Stats-Endpoints für verschiedene Controller
   - Upcoming-Endpoints für Homework

4. **Subtasks/Comments-Endpoints fehlen möglicherweise im TodoController**

Ich beginne jetzt systematisch mit dem Fixen!
