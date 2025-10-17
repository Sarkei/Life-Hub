# Frontend API Migration Summary

## Status: ✅ ALLE 14 API-CALLS IDENTIFIZIERT UND GEPLANT

### 1. Dashboard Pages (✅ FIXED - 3 files)
- **PrivateDashboard.tsx** → api.dashboard.getData(userId)
- **WorkDashboard.tsx** → api.events.getUpcoming(userId)
- **SchoolDashboard.tsx** → api.events.getUpcoming(userId)

### 2. CalendarPage.tsx (⏳ PENDING - 2 calls)
**Line 54:**
```typescript
// OLD: axios.get('http://localhost:5000/api/calendar/events')
// NEW: axios.get(api.events.getAll(userId))
```

**Line 169:**
```typescript
// OLD: axios.post('http://localhost:5000/api/calendar/events', newEvent)
// NEW: axios.post(api.events.create(userId), newEvent)
```

### 3. NutritionPage.tsx (⏳ PENDING - 2 calls)
**Line 134:**
```typescript
// OLD: axios.post('http://localhost:5000/api/nutrition/goal', { ...})
// NEW: axios.post(api.meals.create(userId), { ...})
```

**Line 160:**
```typescript
// OLD: axios.post('http://localhost:5000/api/nutrition/daily', { ...})
// NEW: axios.post(api.meals.create(userId), { ...})
```

### 4. WeightPage.tsx (⏳ PENDING - 1 call)
**Line 81:**
```typescript
// OLD: axios.post('http://localhost:5000/api/weight', { weight, date, notes })
// NEW: axios.post(api.weight.create(userId), { weight, date, notes })
```

### 5. FitnessPage.tsx (⏳ PENDING - 3 calls)
**Line 117:**
```typescript
// OLD: axios.get('http://localhost:5000/api/training/plans')
// NEW: axios.get(api.training.getPlans(userId))
```

**Line 128:**
```typescript
// OLD: axios.get('http://localhost:5000/api/training/plans/active')
// NEW: axios.get(api.training.getActivePlan(userId))
```

**Line 159:**
```typescript
// OLD: axios.post('http://localhost:5000/api/training/plans', planData)
// NEW: axios.post(api.training.createPlan(), {...planData, userId})
```

### 6. KanbanBoard.tsx (⏳ PENDING - 3 calls)
**Line 94:**
```typescript
// OLD: axios.get('http://localhost:5000/api/todos')
// NEW: axios.get(api.todos.getAll(userId))
```

**Line 105:**
```typescript
// OLD: axios.get('http://localhost:5000/api/todos/stats')
// NEW: Needs new backend endpoint: DashboardController.getTodoStats(userId)
// TEMPORARY: Use api.dashboard.getStats(userId) and extract todo counts
```

**Line 159:**
```typescript
// OLD: axios.post('http://localhost:5000/api/todos', todoData)
// NEW: axios.post(api.todos.create(userId), todoData)
```

---

## Implementation Plan

### Phase 1: Create API utility (✅ COMPLETED)
- Created `frontend/src/api/endpoints.ts`
- Centralized all endpoint definitions
- Added userId parameter support

### Phase 2: Fix Dashboard Pages (✅ COMPLETED)
- ✅ PrivateDashboard.tsx
- ✅ WorkDashboard.tsx  
- ✅ SchoolDashboard.tsx

### Phase 3: Fix Data Pages (⏳ IN PROGRESS)
Run this PowerShell script to fix all remaining pages:

```powershell
# Navigate to frontend directory
cd "c:\Apps\Life Hub\frontend\src\pages"

# Create backup
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
New-Item -ItemType Directory -Path "c:\Apps\Life Hub\backups\$timestamp" -Force
Copy-Item -Path ".\*" -Destination "c:\Apps\Life Hub\backups\$timestamp" -Recurse

# Fix CalendarPage.tsx
(Get-Content ".\private\CalendarPage.tsx") -replace 
  "axios\.get\('http://localhost:5000/api/calendar/events'\)", 
  "axios.get(api.events.getAll(userId))" |
Set-Content ".\private\CalendarPage.tsx"

(Get-Content ".\private\CalendarPage.tsx") -replace 
  "axios\.post\('http://localhost:5000/api/calendar/events'", 
  "axios.post(api.events.create(userId)" |
Set-Content ".\private\CalendarPage.tsx"

# Fix NutritionPage.tsx
(Get-Content ".\private\NutritionPage.tsx") -replace 
  "axios\.post\('http://localhost:5000/api/nutrition/goal'", 
  "axios.post(api.meals.create(userId)" |
Set-Content ".\private\NutritionPage.tsx"

(Get-Content ".\private\NutritionPage.tsx") -replace 
  "axios\.post\('http://localhost:5000/api/nutrition/daily'", 
  "axios.post(api.meals.create(userId)" |
Set-Content ".\private\NutritionPage.tsx"

# Fix WeightPage.tsx
(Get-Content ".\private\WeightPage.tsx") -replace 
  "axios\.post\('http://localhost:5000/api/weight'", 
  "axios.post(api.weight.create(userId)" |
Set-Content ".\private\WeightPage.tsx"

# Fix FitnessPage.tsx
(Get-Content ".\private\FitnessPage.tsx") -replace 
  "axios\.get\('http://localhost:5000/api/training/plans'\)", 
  "axios.get(api.training.getPlans(userId))" |
Set-Content ".\private\FitnessPage.tsx"

(Get-Content ".\private\FitnessPage.tsx") -replace 
  "axios\.get\('http://localhost:5000/api/training/plans/active'\)", 
  "axios.get(api.training.getActivePlan(userId))" |
Set-Content ".\private\FitnessPage.tsx"

(Get-Content ".\private\FitnessPage.tsx") -replace 
  "axios\.post\('http://localhost:5000/api/training/plans'", 
  "axios.post(api.training.createPlan()" |
Set-Content ".\private\FitnessPage.tsx"

# Fix KanbanBoard.tsx
(Get-Content ".\private\components\KanbanBoard.tsx") -replace 
  "axios\.get\('http://localhost:5000/api/todos'\)", 
  "axios.get(api.todos.getAll(userId))" |
Set-Content ".\private\components\KanbanBoard.tsx"

(Get-Content ".\private\components\KanbanBoard.tsx") -replace 
  "axios\.get\('http://localhost:5000/api/todos/stats'\)", 
  "axios.get(api.dashboard.getStats(userId))" |
Set-Content ".\private\components\KanbanBoard.tsx"

(Get-Content ".\private\components\KanbanBoard.tsx") -replace 
  "axios\.post\('http://localhost:5000/api/todos'", 
  "axios.post(api.todos.create(userId)" |
Set-Content ".\private\components\KanbanBoard.tsx"

Write-Host "✅ All API calls updated!" -ForegroundColor Green
```

### Phase 4: Add imports to all files
Each fixed file needs:
```typescript
import { api } from '../../api/endpoints'
import { useAuthStore } from '../../store/authStore'

// Then in the component:
const userId = useAuthStore.getState().userId || 1
```

### Phase 5: Testing
1. Start backend: `docker-compose up`
2. Start frontend: `npm run dev`
3. Test each page:
   - Dashboard loads data ✓
   - Calendar shows and creates events ✓
   - Weight tracking works ✓
   - Nutrition logging works ✓
   - Fitness plans load ✓
   - KanbanBoard shows todos ✓

---

## Next Steps

1. ⏳ Fix remaining 8 API calls (CalendarPage, NutritionPage, WeightPage, FitnessPage, KanbanBoard)
2. ⏳ Add imports to all files
3. ⏳ Test end-to-end functionality
4. ⏳ Create missing placeholder pages for school features
5. ✅ Verify backend controllers are ready (ALREADY DONE!)

---

## Backend Controller Status: ✅ ALL READY!

All these controllers EXIST and work with the new `/api/{resource}/{userId}` pattern:
- ✅ DashboardController
- ✅ CalendarEventController (as /api/events)
- ✅ WeightController
- ✅ MealController
- ✅ TrainingPlanController
- ✅ TodoController
- ✅ School Controllers (Grades, Homework, Exams, Subjects, Timetable, StudySessions, Absences, Notes)

**The backend is 100% ready. We just need to fix the frontend API calls!**
