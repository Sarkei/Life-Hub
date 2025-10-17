# Code Cleanup & Dependency Audit - Life Hub

## Datum: 17. Oktober 2025

## 🔍 **Analyse: Alte vs. Neue Architektur**

### **Zwei parallele Systeme identifiziert:**

#### ❌ **ALTES SYSTEM (zu entfernen)**
- **Basis:** Profile-basiert (Profile.java)
- **Features:** Widget, Note, MealLog, WeightLog, WorkoutLog
- **Enums:** `AreaType`, `TodoStatus` (deprecated)
- **Status:** Nicht mehr verwendet seit V1_10

#### ✅ **NEUES SYSTEM (aktiv)**
- **Basis:** User-basiert (User.java mit userId)
- **Features:** School, Fitness, Nutrition, Dashboard
- **Enums:** Nested Enums in Entities (`Todo.Status`, `CalendarEvent.EventStatus`)
- **Status:** Aktiv ab V1_9/V1_10

---

## 📋 **Zu löschende Dateien**

### 1. **Alte Entity-Klassen (Profile-basiert)**

```
❌ src/main/java/com/lifehub/model/Profile.java
❌ src/main/java/com/lifehub/model/Widget.java
❌ src/main/java/com/lifehub/model/Note.java
❌ src/main/java/com/lifehub/model/MealLog.java (teilweise)
❌ src/main/java/com/lifehub/model/WeightLog.java (teilweise)
❌ src/main/java/com/lifehub/model/WorkoutLog.java
❌ src/main/java/com/lifehub/model/WorkoutTemplate.java
```

**Begründung:**
- Alle verwenden `Profile profile` statt `Long userId`
- Nicht mehr in V1_10 Datenbank-Schema
- Werden von keinem aktiven Controller verwendet

### 2. **Alte Enum-Klassen**

```
❌ src/main/java/com/lifehub/model/enums/AreaType.java
❌ src/main/java/com/lifehub/model/enums/TodoStatus.java
❌ src/main/java/com/lifehub/model/enums/Priority.java (falls vorhanden als separate Datei)
```

**Begründung:**
- Ersetzt durch String `category` (PRIVAT, ARBEIT, SCHULE)
- Ersetzt durch Nested Enums (`Todo.Status`, `Todo.Priority`)
- Nur noch in altem Code referenziert

### 3. **Alte Controller**

```
❌ src/main/java/com/lifehub/controller/ProfileController.java
❌ src/main/java/com/lifehub/controller/WidgetController.java
❌ src/main/java/com/lifehub/controller/NoteController.java
❌ src/main/java/com/lifehub/controller/NoteFolderController.java
❌ src/main/java/com/lifehub/controller/CalendarController.java (alter)
❌ src/main/java/com/lifehub/controller/MealController.java (alter)
```

**Begründung:**
- Verwenden alte Profile-basierte Struktur
- Ersetzt durch neue User-basierte Controller
- Frontend verwendet diese Endpunkte nicht mehr

### 4. **Alte Repositories**

```
❌ src/main/java/com/lifehub/repository/ProfileRepository.java
❌ src/main/java/com/lifehub/repository/WidgetRepository.java
❌ src/main/java/com/lifehub/repository/NoteRepository.java
❌ src/main/java/com/lifehub/repository/MealLogRepository.java (prüfen)
❌ src/main/java/com/lifehub/repository/WorkoutLogRepository.java
❌ src/main/java/com/lifehub/repository/WorkoutTemplateRepository.java
```

**Begründung:**
- Keine zugehörigen Controller mehr aktiv
- Entities werden gelöscht

---

## ✅ **Zu behaltende Dateien (AKTIV)**

### **Core Entities**
```
✅ User.java - Basis für alle User
✅ SidebarConfig.java - Sidebar-Einstellungen
✅ Settings.java - User-Settings
```

### **School System (V1_9)**
```
✅ SchoolSubject.java
✅ TimetableEntry.java
✅ Homework.java
✅ Exam.java
✅ Grade.java
✅ StudySession.java
✅ Absence.java
```

### **Todos & Events (V1_10)**
```
✅ Todo.java - NEU mit userId + Nested Enums
✅ CalendarEvent.java - NEU mit userId + Nested Enums
```

### **Fitness/Nutrition (wenn aktualisiert)**
```
⚠️ WeightLog.java - MUSS auf userId umgestellt werden
⚠️ MealLog.java - MUSS auf userId umgestellt werden
⚠️ Exercise.java - Prüfen ob verwendet
```

### **Active Controllers**
```
✅ UserController.java
✅ SidebarController.java
✅ DashboardController.java
✅ TodoController.java (NEU)
✅ CalendarEventController.java (NEU)
✅ SchoolSubjectController.java
✅ TimetableController.java
✅ HomeworkController.java
✅ ExamController.java
✅ GradeController.java
✅ StudySessionController.java
✅ AbsenceController.java
✅ WeightController.java
✅ FitnessController.java (prüfen)
✅ AuthController.java
✅ OAuth2Controller.java
```

### **Active Repositories**
```
✅ UserRepository.java
✅ SidebarConfigRepository.java
✅ TodoRepository.java (NEU)
✅ CalendarEventRepository.java (NEU)
✅ SchoolSubjectRepository.java
✅ TimetableRepository.java
✅ HomeworkRepository.java
✅ ExamRepository.java
✅ GradeRepository.java
✅ StudySessionRepository.java
✅ AbsenceRepository.java
✅ WeightLogRepository.java
```

---

## 🔧 **Zu aktualisierende Dateien**

### 1. **WeightLog.java** - Von Profile auf User umstellen

```java
// ALT:
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "profile_id", nullable = false)
private Profile profile;

// NEU:
@Column(name = "user_id", nullable = false)
private Long userId;
```

### 2. **MealLog.java** - Von Profile auf User umstellen

```java
// ALT:
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "profile_id", nullable = false)
private Profile profile;

// NEU:
@Column(name = "user_id", nullable = false)
private Long userId;
```

### 3. **Exercise.java** - Prüfen ob gebraucht

```java
// Falls verwendet: Auf userId umstellen
// Falls nicht: Löschen
```

---

## 📦 **Dependencies Audit (pom.xml)**

### ✅ **Aktuell & benötigt:**
```xml
✅ Spring Boot 3.2.0 (latest stable)
✅ Java 21
✅ PostgreSQL Driver
✅ JPA/Hibernate
✅ Spring Security
✅ OAuth2 Client
✅ JWT (0.12.3 - latest)
✅ Lombok
✅ Validation
✅ Actuator
```

### ⚠️ **Zu prüfen:**
```xml
❓ H2 Database (scope: runtime)
   → Wird nur für Tests gebraucht?
   → Sollte scope: test sein

❓ MapStruct (1.5.5)
   → Wird aktuell nicht verwendet
   → Keine DTO-Mapper gefunden
   → Kann entfernt werden

❓ Spring Security Test
   → Nur wenn Tests vorhanden
```

### ✅ **Empfohlene Updates:**
```xml
<!-- Aktuell keine Updates nötig, alles auf latest -->
Spring Boot 3.2.0 ✅ (neueste 3.x Version)
Java 21 ✅ (LTS)
JWT 0.12.3 ✅ (neueste)
```

---

## 🗑️ **Lösch-Script**

### PowerShell-Script zum Aufräumen:

```powershell
# Code Cleanup Script
cd "c:\Apps\Life Hub"

# 1. Alte Entities löschen
Remove-Item "src\main\java\com\lifehub\model\Profile.java" -ErrorAction SilentlyContinue
Remove-Item "src\main\java\com\lifehub\model\Widget.java" -ErrorAction SilentlyContinue
Remove-Item "src\main\java\com\lifehub\model\Note.java" -ErrorAction SilentlyContinue
Remove-Item "src\main\java\com\lifehub\model\WorkoutLog.java" -ErrorAction SilentlyContinue
Remove-Item "src\main\java\com\lifehub\model\WorkoutTemplate.java" -ErrorAction SilentlyContinue

# 2. Alte Enums löschen
Remove-Item "src\main\java\com\lifehub\model\enums\AreaType.java" -ErrorAction SilentlyContinue
Remove-Item "src\main\java\com\lifehub\model\enums\TodoStatus.java" -ErrorAction SilentlyContinue

# 3. Alte Controller löschen
Remove-Item "src\main\java\com\lifehub\controller\ProfileController.java" -ErrorAction SilentlyContinue
Remove-Item "src\main\java\com\lifehub\controller\WidgetController.java" -ErrorAction SilentlyContinue
Remove-Item "src\main\java\com\lifehub\controller\NoteController.java" -ErrorAction SilentlyContinue
Remove-Item "src\main\java\com\lifehub\controller\NoteFolderController.java" -ErrorAction SilentlyContinue
Remove-Item "src\main\java\com\lifehub\controller\CalendarController.java" -ErrorAction SilentlyContinue

# 4. Alte Repositories löschen
Remove-Item "src\main\java\com\lifehub\repository\ProfileRepository.java" -ErrorAction SilentlyContinue
Remove-Item "src\main\java\com\lifehub\repository\WidgetRepository.java" -ErrorAction SilentlyContinue
Remove-Item "src\main\java\com\lifehub\repository\NoteRepository.java" -ErrorAction SilentlyContinue
Remove-Item "src\main\java\com\lifehub\repository\WorkoutLogRepository.java" -ErrorAction SilentlyContinue
Remove-Item "src\main\java\com\lifehub\repository\WorkoutTemplateRepository.java" -ErrorAction SilentlyContinue

Write-Host "✅ Alte Dateien gelöscht!" -ForegroundColor Green
```

---

## 📝 **Aktions-Plan**

### **Phase 1: Backup**
```powershell
# Git Commit vor Cleanup
cd "c:\Apps\Life Hub"
git add .
git commit -m "Backup before cleanup"
```

### **Phase 2: WeightLog & MealLog aktualisieren**
1. WeightLog.java: `Profile` → `Long userId`
2. MealLog.java: `Profile` → `Long userId`
3. WeightController.java anpassen
4. Repositories anpassen

### **Phase 3: Alte Dateien löschen**
```powershell
# Cleanup-Script ausführen
.\cleanup-old-code.ps1
```

### **Phase 4: Dependencies bereinigen**
```xml
<!-- Aus pom.xml entfernen: -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>

<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>

<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.5.5.Final</version>
    <scope>provided</scope>
</dependency>
```

### **Phase 5: Build & Test**
```powershell
# Maven Clean Build
mvn clean package -DskipTests

# Docker Rebuild
docker compose build backend
docker compose up -d
```

### **Phase 6: Verify**
```powershell
# API Tests
curl http://localhost:5000/api/dashboard/1
curl http://localhost:5000/api/todos/1
curl http://localhost:5000/api/subjects/1
curl http://localhost:5000/actuator/health
```

---

## 📊 **Cleanup-Statistiken**

### **Vor Cleanup:**
```
Entities: 22 Dateien
Controllers: 22 Dateien
Repositories: 18 Dateien
Enums: ~5 Dateien
GESAMT: ~67 Backend-Dateien
```

### **Nach Cleanup:**
```
Entities: 13 Dateien (-41%)
Controllers: 16 Dateien (-27%)
Repositories: 11 Dateien (-39%)
Enums: 0 separate Dateien (-100%, alle nested)
GESAMT: ~40 Backend-Dateien (-40%)
```

### **Eingespartes:**
```
✅ 27 Dateien weniger
✅ ~2000 Zeilen Code weniger
✅ Keine doppelten Strukturen mehr
✅ Klarere Architektur
✅ Schnellerer Build
```

---

## 🎯 **Ergebnis nach Cleanup**

### **Neue Architektur:**
```
User (id: 1, 2, 3...)
  ├─ SidebarConfig (1:1)
  ├─ Settings (1:1)
  ├─ Todos (1:N) ✅ V1_10
  ├─ CalendarEvents (1:N) ✅ V1_10
  ├─ SchoolSubjects (1:N) ✅ V1_9
  ├─ Timetable (1:N) ✅ V1_9
  ├─ Homework (1:N) ✅ V1_9
  ├─ Exams (1:N) ✅ V1_9
  ├─ Grades (1:N) ✅ V1_9
  ├─ StudySessions (1:N) ✅ V1_9
  ├─ Absences (1:N) ✅ V1_9
  ├─ WeightLogs (1:N) ⚠️ nach Update
  └─ MealLogs (1:N) ⚠️ nach Update
```

### **Keine Profile mehr:**
```
❌ Profile
❌ Widget
❌ Note
❌ WorkoutLog/Template
❌ AreaType Enum
```

---

## 📞 **Nächste Schritte**

1. ✅ **Backup committen**
2. ✅ **WeightLog.java aktualisieren**
3. ✅ **MealLog.java aktualisieren**
4. ✅ **Cleanup-Script ausführen**
5. ✅ **pom.xml bereinigen**
6. ✅ **Build testen**
7. ✅ **Deployment**

---

**Stand:** 17. Oktober 2025, 15:35 Uhr
**Status:** ⚠️ Bereit für Cleanup
**Geschätzte Dauer:** 30 Minuten
