# 🎯 KanbanBoard.tsx API-Call Migration

## Problem
KanbanBoard verwendet **13 API-Calls**, alle ohne userId im Path:
- `/api/todos` statt `/api/todos/{userId}`

## Backend-Struktur (TodoController)
```java
GET    /api/todos/{userId}                      - Alle Todos
GET    /api/todos/{userId}/category/{category}  - By category
GET    /api/todos/{userId}/status/{status}      - By status
GET    /api/todos/{userId}/open                 - Open todos
GET    /api/todos/{userId}/completed            - Completed todos
GET    /api/todos/{userId}/overdue              - Overdue todos
GET    /api/todos/{userId}/item/{todoId}        - Single todo
POST   /api/todos/{userId}                      - Create todo
PUT    /api/todos/{userId}/{todoId}             - Update todo
POST   /api/todos/{userId}/{todoId}/complete    - Mark complete
POST   /api/todos/{userId}/{todoId}/uncomplete  - Mark incomplete
DELETE /api/todos/{userId}/{todoId}             - Delete todo
```

## Frontend API-Calls (13 total)

### 1. Line 94 - loadTodos()
```typescript
// OLD:
axios.get('http://localhost:5000/api/todos', {
  params: { userId: 1, category, archived: false }
})

// NEW:
const userId = useAuthStore.getState().userId || 1
axios.get(api.todos.getByCategory(userId, category))
```

### 2. Line 105 - loadStats()
```typescript
// OLD:
axios.get('http://localhost:5000/api/todos/stats', {
  params: { userId: 1 }
})

// NEW:
// ⚠️ Backend hat KEINEN /todos/stats Endpoint!
// WORKAROUND: Use dashboard stats
axios.get(api.dashboard.getStats(userId))
// Dann: openTodosCount, completedTodosCount extrahieren
```

### 3. Line 116 - loadSubtasks()
```typescript
// OLD:
axios.get(`http://localhost:5000/api/todos/${todoId}/subtasks`)

// NEW:
// ⚠️ TodoController hat KEINE Subtask-Endpoints!
// TODO: Backend muss Subtask-Endpoints implementieren
// Temporär: Subtasks disabled oder clientseitig verwalten
```

### 4. Line 125 - loadComments()
```typescript
// OLD:
axios.get(`http://localhost:5000/api/todos/${todoId}/comments`)

// NEW:
// ⚠️ TodoController hat KEINE Comment-Endpoints!
// TODO: Backend muss Comment-Endpoints implementieren
// Temporär: Comments disabled
```

### 5. Line 157 - handleSubmit() UPDATE
```typescript
// OLD:
axios.put(`http://localhost:5000/api/todos/${selectedTodo.id}`, formData)

// NEW:
axios.put(api.todos.update(userId, selectedTodo.id), formData)
```

### 6. Line 159 - handleSubmit() CREATE
```typescript
// OLD:
axios.post('http://localhost:5000/api/todos', formData)

// NEW:
axios.post(api.todos.create(userId), formData)
```

### 7. Line 174 - handleDelete()
```typescript
// OLD:
axios.delete(`http://localhost:5000/api/todos/${id}`)

// NEW:
axios.delete(api.todos.delete(userId, id))
```

### 8. Line 185 - handleArchive()
```typescript
// OLD:
axios.patch(`http://localhost:5000/api/todos/${id}/archive`)

// NEW:
// ⚠️ TodoController hat KEINEN /archive Endpoint!
// TODO: Backend muss Archive-Endpoint implementieren
// Temporär: Disable archive feature oder als "completed" markieren
```

### 9. Line 205 - handleDragEnd()
```typescript
// OLD:
axios.patch(`http://localhost:5000/api/todos/${draggedTodo.id}/status`, { status: newStatus })

// NEW:
// ⚠️ TodoController hat KEINEN /status PATCH Endpoint!
// WORKAROUND: Use PUT with full todo object
axios.put(api.todos.update(userId, draggedTodo.id), { ...draggedTodo, status: newStatus })
```

### 10-13. Subtasks/Comments (Lines 220, 234, 246, 257)
```typescript
// ALL ⚠️: Subtask and Comment endpoints DON'T EXIST in backend!
// Need to implement:
// - POST   /api/todos/{userId}/{todoId}/subtasks
// - PUT    /api/todos/{userId}/subtasks/{subtaskId}
// - DELETE /api/todos/{userId}/subtasks/{subtaskId}
// - POST   /api/todos/{userId}/{todoId}/comments
```

---

## Migration Strategy

### Phase 1: Fix existing endpoints (7 calls)
1. ✅ loadTodos - use getByCategory
2. ⏳ loadStats - use dashboard stats workaround
3. ✅ handleSubmit UPDATE - use api.todos.update
4. ✅ handleSubmit CREATE - use api.todos.create
5. ✅ handleDelete - use api.todos.delete
6. ⏳ handleDragEnd - use update with full object
7. ⏳ handleArchive - disable or mark as completed

### Phase 2: Disable non-existent features (6 calls)
8. ❌ Subtasks - Temporarily disable (no backend support)
9. ❌ Comments - Temporarily disable (no backend support)

### Phase 3: Backend implementation (später)
- Implement Subtask endpoints in TodoController
- Implement Comment endpoints in TodoController
- Implement Archive endpoint
- Implement Status PATCH endpoint
- Implement Stats endpoint

---

## Fix wird jetzt durchgeführt...
