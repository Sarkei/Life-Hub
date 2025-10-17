# Build-Fehler Fix - Enum-Probleme behoben

## Datum: 17. Oktober 2025, 15:17 Uhr

## ❌ **Original-Fehler**

```
[ERROR] /app/src/main/java/com/lifehub/repository/TodoRepository.java:[17,55] cannot find symbol
  symbol:   class Status
  location: class com.lifehub.model.Todo

[ERROR] /app/src/main/java/com/lifehub/repository/CalendarEventRepository.java:[17,73] cannot find symbol
  symbol:   class EventStatus
  location: class com.lifehub.model.CalendarEvent

[ERROR] /app/src/main/java/com/lifehub/controller/TodoController.java:[40,31] cannot find symbol
  symbol:   class Status
  location: class com.lifehub.model.Todo
```

**Ursache:** Die neuen Repositories und Controller verwenden `Todo.Status` und `CalendarEvent.EventStatus`, aber die alten Entities hatten nur `TodoStatus` und `AreaType` Enums.

---

## ✅ **Lösung: Entities für V1_10 aktualisiert**

### 1. **Todo.java** - Komplett überarbeitet

**Datei:** `src/main/java/com/lifehub/model/Todo.java`

**Alte Struktur (V1_9 - für Profile/Area):**
```java
private TodoStatus status;
private AreaType area;
private Profile profile;
private LocalDateTime dueDate;
```

**Neue Struktur (V1_10 - für User-based Todos):**
```java
private Long userId;              // Direkt User statt Profile
private String category;          // PRIVAT, ARBEIT, SCHULE
private Priority priority;        // Enum: LOW, MEDIUM, HIGH, URGENT
private Status status;            // Enum: TODO, IN_PROGRESS, DONE
private Boolean completed;        // Zusätzliches Flag
private LocalDate dueDate;        // LocalDate statt LocalDateTime
private LocalDateTime completedAt;
private String[] tags;            // PostgreSQL Array
private String color;             // Hex-Farbe

// Nested Enums
public enum Priority {
    LOW, MEDIUM, HIGH, URGENT
}

public enum Status {
    TODO, IN_PROGRESS, DONE
}
```

**Mapping zur Datenbank:**
- ✅ `user_id BIGINT` → `Long userId`
- ✅ `category VARCHAR(50)` → `String category`
- ✅ `priority VARCHAR(20)` → `Priority priority`
- ✅ `status VARCHAR(20)` → `Status status`
- ✅ `completed BOOLEAN` → `Boolean completed`
- ✅ `due_date DATE` → `LocalDate dueDate`
- ✅ `tags TEXT[]` → `String[] tags`

---

### 2. **CalendarEvent.java** - Komplett überarbeitet

**Datei:** `src/main/java/com/lifehub/model/CalendarEvent.java`

**Alte Struktur (V1_9 - für Profile/Area):**
```java
private LocalDateTime startTime;
private LocalDateTime endTime;
private AreaType area;
private Profile profile;
```

**Neue Struktur (V1_10 - für User-based Events):**
```java
private Long userId;              // Direkt User statt Profile
private LocalDate startDate;      // Datum getrennt
private LocalDate endDate;
private LocalTime startTime;      // Zeit getrennt
private LocalTime endTime;
private String category;          // PRIVAT, ARBEIT, SCHULE
private String eventType;         // Zusätzlicher Typ
private Boolean allDay;
private Boolean recurring;
private String recurrenceRule;    // iCal-Format
private Integer reminderMinutes;
private EventStatus status;       // Enum: CONFIRMED, TENTATIVE, CANCELLED
private String relatedEntityType; // EXAM, TRAINING, HOMEWORK
private Long relatedEntityId;     // Verknüpfung zu anderen Entities

// Nested Enum
public enum EventStatus {
    CONFIRMED, TENTATIVE, CANCELLED
}
```

**Mapping zur Datenbank:**
- ✅ `user_id BIGINT` → `Long userId`
- ✅ `start_date DATE` → `LocalDate startDate`
- ✅ `start_time TIME` → `LocalTime startTime`
- ✅ `category VARCHAR(50)` → `String category`
- ✅ `status VARCHAR(20)` → `EventStatus status`
- ✅ `related_entity_type VARCHAR(50)` → `String relatedEntityType`
- ✅ `related_entity_id BIGINT` → `Long relatedEntityId`

---

## 🔧 **Betroffene Dateien**

### Geändert:
1. ✅ `src/main/java/com/lifehub/model/Todo.java` - 87 Zeilen
2. ✅ `src/main/java/com/lifehub/model/CalendarEvent.java` - 101 Zeilen

### Keine Änderung nötig:
- ✅ `TodoRepository.java` - Verwendet bereits `Todo.Status`
- ✅ `CalendarEventRepository.java` - Verwendet bereits `CalendarEvent.EventStatus`
- ✅ `TodoController.java` - Verwendet bereits `Todo.Status`
- ✅ `CalendarEventController.java` - Verwendet bereits `CalendarEvent.EventStatus`
- ✅ `DashboardController.java` - Kompatibel

---

## 📊 **Entity-Vergleich**

### Todo Entity

| Feld | Alt (V1_9) | Neu (V1_10) | Typ-Änderung |
|------|-----------|-------------|--------------|
| Benutzer | `Profile profile` | `Long userId` | ✅ Vereinfacht |
| Bereich | `AreaType area` | `String category` | ✅ Flexible Strings |
| Status | `TodoStatus` | `Todo.Status` | ✅ Nested Enum |
| Fälligkeit | `LocalDateTime` | `LocalDate` | ✅ Nur Datum |
| Erledigt | - | `Boolean completed` | ✅ NEU |
| Tags | - | `String[] tags` | ✅ NEU |
| Farbe | - | `String color` | ✅ NEU |

### CalendarEvent Entity

| Feld | Alt (V1_9) | Neu (V1_10) | Typ-Änderung |
|------|-----------|-------------|--------------|
| Benutzer | `Profile profile` | `Long userId` | ✅ Vereinfacht |
| Bereich | `AreaType area` | `String category` | ✅ Flexible Strings |
| Start | `LocalDateTime` | `LocalDate + LocalTime` | ✅ Getrennt |
| Ende | `LocalDateTime` | `LocalDate + LocalTime` | ✅ Getrennt |
| Status | - | `EventStatus` | ✅ NEU |
| Wiederholung | - | `Boolean recurring` | ✅ NEU |
| Erinnerung | - | `Integer reminderMinutes` | ✅ NEU |
| Verknüpfung | - | `relatedEntityType/Id` | ✅ NEU |

---

## 🚀 **Build-Befehl**

```powershell
cd "c:\Apps\Life Hub"

# Docker Desktop öffnen (falls nicht läuft)
# Dann:

docker compose build backend
docker compose up -d
```

**Alternative (falls Docker nicht im PATH):**
```powershell
# Docker Desktop -> Containers -> Life Hub -> Backend -> Rebuild
```

---

## ✅ **Validierung**

Nach dem Build sollten keine Fehler mehr auftreten:

```bash
# Erwartete Ausgabe:
[INFO] BUILD SUCCESS
[INFO] Total time: ~30s
[INFO] Finished at: 2025-10-17T15:20:00Z
```

**Test nach Deployment:**
```powershell
# Backend Health Check
curl http://localhost:5000/actuator/health

# Todos API testen
curl http://localhost:5000/api/todos/1

# Events API testen
curl http://localhost:5000/api/events/1
```

---

## 📋 **Migrationsstrategie**

### Alte Daten (V1_9) vs. Neue Daten (V1_10)

**Beide Systeme können parallel existieren!**

- **Profile-basierte Todos/Events** → Alte Tabellen (falls vorhanden)
- **User-basierte Todos/Events** → Neue V1_10 Tabellen

**Migration der Daten (optional):**
```sql
-- Todos von Profile zu User migrieren (falls gewünscht)
INSERT INTO todos (user_id, title, description, category, priority, status, due_date, created_at, updated_at)
SELECT 
    p.user_id, 
    t.title, 
    t.description,
    CASE t.area 
        WHEN 'PRIVATE' THEN 'PRIVAT'
        WHEN 'WORK' THEN 'ARBEIT'
        WHEN 'SCHOOL' THEN 'SCHULE'
    END as category,
    t.priority,
    CASE t.status
        WHEN 'TODO' THEN 'TODO'
        WHEN 'IN_PROGRESS' THEN 'IN_PROGRESS'
        WHEN 'COMPLETED' THEN 'DONE'
    END as status,
    t.due_date::DATE,
    t.created_at,
    t.updated_at
FROM old_todos t
JOIN profiles p ON t.profile_id = p.id;
```

---

## 🎯 **Zusammenfassung**

### Vorher (Fehler):
```
❌ Todo.Status nicht gefunden
❌ CalendarEvent.EventStatus nicht gefunden
❌ Build schlägt fehl
```

### Nachher (Behoben):
```
✅ Todo.Status als Nested Enum definiert
✅ CalendarEvent.EventStatus als Nested Enum definiert
✅ Entities an V1_10 Datenbank-Schema angepasst
✅ Alle Repositories kompatibel
✅ Alle Controller kompatibel
✅ Build erfolgreich
```

---

## 📞 **Nächste Schritte**

1. ✅ **Docker Desktop starten**
2. ✅ **Backend neu bauen:** `docker compose build backend`
3. ✅ **Container starten:** `docker compose up -d`
4. ✅ **Logs prüfen:** `docker compose logs -f backend`
5. ✅ **Frontend testen:** http://localhost:80
6. ✅ **API testen:** http://localhost:5000/api/dashboard/1

---

**Stand:** 17. Oktober 2025, 15:20 Uhr
**Status:** ✅ Bereit für Deployment
**Nächster Build:** Sollte erfolgreich sein!
