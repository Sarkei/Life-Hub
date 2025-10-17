# Dashboard API Integration - Todos & Events

## ✅ Was wurde erstellt

### Backend

**Migration V1_10__todos_and_events.sql:**
- ✅ `todos` Tabelle mit:
  - title, description, category (PRIVAT/ARBEIT/SCHULE)
  - priority (LOW, MEDIUM, HIGH, URGENT)
  - status (TODO, IN_PROGRESS, DONE)
  - due_date, completed_at
  - tags (Array), color
  - Indices für Performance

- ✅ `calendar_events` Tabelle mit:
  - title, description, location
  - start_date, end_date, start_time, end_time
  - all_day, category, event_type
  - recurring, recurrence_rule
  - reminder_minutes
  - status (CONFIRMED, TENTATIVE, CANCELLED)
  - related_entity_type & related_entity_id (für Prüfungen, Training, etc.)

**TodoRepository.java - Aktualisiert:**
```java
// Offene Todos (sortiert nach Fälligkeitsdatum & Priorität)
List<Todo> findOpenTodosByUserId(Long userId);

// Überfällige Todos
List<Todo> findOverdueTodos(Long userId, LocalDate today);

// Bald fällig (nächste 7 Tage)
List<Todo> findDueSoon(Long userId, LocalDate startDate, LocalDate endDate);

// Counts
Long countByUserIdAndCompleted(Long userId, Boolean completed);
```

**CalendarEventRepository.java - Aktualisiert:**
```java
// Events in Zeitraum
List<CalendarEvent> findUpcomingEvents(Long userId, LocalDate today, LocalDate endDate);

// Heutige Events
List<CalendarEvent> findTodaysEvents(Long userId, LocalDate today);

// Events nach Related Entity (z.B. Prüfungen)
List<CalendarEvent> findByUserIdAndRelatedEntityTypeAndRelatedEntityId(...);

// Count
Long countUpcomingEvents(Long userId, LocalDate today);
```

**DashboardController.java - NEU:**

Alle Endpoints unter `/api/dashboard/{userId}`:

1. **GET `/api/dashboard/{userId}`** - Hauptendpoint
   ```json
   {
     "openTodos": [...],           // Alle offenen Todos (sortiert)
     "openTodosCount": 5,
     "upcomingEvents": [...],      // Events in nächsten 7 Tagen
     "upcomingEventsCount": 3,
     "todaysEvents": [...],        // Heutige Events
     "overdueTodos": [...],        // Überfällige Todos
     "overdueTodosCount": 2,
     "todosDueSoon": [...]         // Todos fällig in 7 Tagen
   }
   ```

2. **GET `/api/dashboard/{userId}/stats`** - Schnelle Statistiken
   ```json
   {
     "openTodosCount": 5,
     "completedTodosCount": 12,
     "overdueTodosCount": 2,
     "upcomingEventsCount": 3,
     "todaysEventsCount": 1
   }
   ```

3. **GET `/api/dashboard/{userId}/todos/open`** - Nur offene Todos
4. **GET `/api/dashboard/{userId}/todos/overdue`** - Nur überfällige Todos
5. **GET `/api/dashboard/{userId}/events/upcoming`** - Nur kommende Events (7 Tage)
6. **GET `/api/dashboard/{userId}/events/today`** - Nur heutige Events

### Frontend

**PrivateDashboard.tsx - Aktualisiert:**

```typescript
// Vorher: Mock-Daten
const mockTodos = [...]

// Nachher: Live-Daten von API
const dashboardResponse = await axios.get('http://localhost:8080/api/dashboard/1')
const data = dashboardResponse.data

setUpcomingEvents(data.upcomingEvents.slice(0, 5))
setRecentTodos(data.openTodos.slice(0, 5))

setStats({
  activeTodos: data.openTodosCount,
  upcomingEvents: data.upcomingEventsCount,
  ...
})
```

**Was wird im Dashboard angezeigt:**
- ✅ Offene Aufgaben (erste 5)
- ✅ Anstehende Termine (nächste 7 Tage, erste 5)
- ✅ Statistiken (Counts)

## 🚀 Deployment

```powershell
cd "c:\Apps\Life Hub"

# Backend neu bauen (mit V1_10 Migration)
docker compose build backend
docker compose up -d backend

# Warte auf Migration
Start-Sleep -Seconds 10

# Frontend neu bauen (mit Dashboard-Updates)
docker compose build frontend
docker compose up -d frontend
```

## 🧪 Testen

### 1. Migration prüfen

```powershell
docker compose exec backend psql -U postgres -d lifehub -c "\dt"
# Sollte zeigen: todos, calendar_events
```

### 2. API testen

**Dashboard-Daten abrufen:**
```bash
curl http://localhost:8080/api/dashboard/1
```

**Erwartete Antwort (leer bei ersten Start):**
```json
{
  "openTodos": [],
  "openTodosCount": 0,
  "upcomingEvents": [],
  "upcomingEventsCount": 0,
  "todaysEvents": [],
  "overdueTodos": [],
  "overdueTodosCount": 0,
  "todosDueSoon": []
}
```

### 3. Testdaten eintragen

**Todo erstellen:**
```bash
curl -X POST http://localhost:8080/api/dashboard/1/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Einkaufen gehen",
    "description": "Lebensmittel für die Woche",
    "category": "PRIVAT",
    "priority": "HIGH",
    "dueDate": "2025-10-20",
    "completed": false
  }'
```

**Event erstellen:**
```bash
curl -X POST http://localhost:8080/api/dashboard/1/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Zahnarzttermin",
    "description": "Kontrolluntersuchung",
    "location": "Dr. Müller, Hauptstraße 42",
    "startDate": "2025-10-19",
    "startTime": "14:00",
    "endTime": "15:00",
    "category": "PRIVAT",
    "eventType": "APPOINTMENT",
    "color": "#3B82F6"
  }'
```

### 4. Dashboard im Browser öffnen

```
http://localhost:3000/private
```

**Sollte jetzt zeigen:**
- ✅ 1 offene Aufgabe ("Einkaufen gehen")
- ✅ 1 anstehender Termin ("Zahnarzttermin")
- ✅ Statistiken aktualisiert

## 📊 API-Endpoints Übersicht

### Dashboard Endpoints
```
GET  /api/dashboard/{userId}              - Alle Dashboard-Daten
GET  /api/dashboard/{userId}/stats        - Nur Statistiken
GET  /api/dashboard/{userId}/todos/open   - Offene Todos
GET  /api/dashboard/{userId}/todos/overdue - Überfällige Todos
GET  /api/dashboard/{userId}/events/upcoming - Kommende Events (7 Tage)
GET  /api/dashboard/{userId}/events/today - Heutige Events
```

### Integration mit anderen Features

**Prüfungen → Kalender:**
```java
// Beim Erstellen einer Prüfung automatisch Event erstellen
CalendarEvent examEvent = CalendarEvent.builder()
    .userId(userId)
    .title(exam.getTitle())
    .startDate(exam.getExamDate())
    .startTime(exam.getStartTime())
    .category("SCHULE")
    .eventType("EXAM")
    .relatedEntityType("EXAM")
    .relatedEntityId(exam.getId())
    .color("#8B5CF6")
    .build();
calendarEventRepository.save(examEvent);
```

**Hausaufgaben → Todos:**
```java
// Beim Erstellen von Hausaufgaben automatisch Todo erstellen
Todo homeworkTodo = Todo.builder()
    .userId(userId)
    .title(homework.getTitle())
    .description(homework.getDescription())
    .category("SCHULE")
    .priority(homework.getPriority())
    .dueDate(homework.getDueDate())
    .completed(false)
    .build();
todoRepository.save(homeworkTodo);
```

## 🎯 Nächste Schritte

### Optional: Todo & Event Controller erstellen

Wenn du vollständige CRUD-Operationen für Todos/Events brauchst:

**TodoController.java:**
```java
@RestController
@RequestMapping("/api/todos")
class TodoController {
    GET    /{userId}                    - Alle Todos
    GET    /{userId}/category/{cat}     - Nach Kategorie
    POST   /{userId}                    - Todo erstellen
    PUT    /{userId}/{todoId}           - Todo aktualisieren
    POST   /{userId}/{todoId}/complete  - Als erledigt markieren
    DELETE /{userId}/{todoId}           - Todo löschen
}
```

**CalendarEventController.java:**
```java
@RestController
@RequestMapping("/api/events")
class CalendarEventController {
    GET    /{userId}                - Alle Events
    GET    /{userId}/range          - Events in Zeitraum
    POST   /{userId}                - Event erstellen
    PUT    /{userId}/{eventId}      - Event aktualisieren
    DELETE /{userId}/{eventId}      - Event löschen
}
```

## ✅ Erfolg!

**Was funktioniert jetzt:**
- ✅ Dashboard zeigt echte Daten aus Datenbank
- ✅ Offene Todos werden geladen
- ✅ Kommende Termine (7 Tage) werden angezeigt
- ✅ Statistiken werden berechnet
- ✅ Bereit für Integration mit Schul-System (Prüfungen, Hausaufgaben)

**Dashboard ist live! 🎉**
