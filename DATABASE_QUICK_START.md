# 🚀 DATABASE-FIRST ARCHITECTURE - QUICK START

## 📋 Was ist neu?

**Alles ist jetzt in der Datenbank!** Keine komplexen JSON-Files mehr, sondern einfache DB-Abfragen.

---

## 1️⃣ **User Registration**

### Backend (bereits implementiert):
```java
// UserService.java
User user = userService.registerUser("max", "max@example.com", "password123");
// → Erstellt automatisch:
//   - User in users Tabelle
//   - Default Settings in user_settings
//   - Leeres Profile in user_profile
//   - Default Sidebar in sidebar_config
```

### API Endpoint:
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "max",
  "email": "max@example.com",
  "password": "password123"
}

Response:
{
  "userId": 1,
  "username": "max",
  "email": "max@example.com",
  "message": "User registered successfully"
}
```

---

## 2️⃣ **User Login**

### Backend (bereits implementiert):
```java
// UserService.java
Optional<User> user = userService.loginUser("max", "password123");

// Lädt komplette Daten:
UserDataDTO data = userService.loadUserData(user.getId());
// → Enthält: User, Settings, Profile, SidebarConfig
```

### API Endpoint:
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "max",  // Username ODER Email
  "password": "password123"
}

Response:
{
  "userId": 1,
  "username": "max",
  "email": "max@example.com",
  "settings": {
    "theme": "system",
    "language": "de",
    "emailNotifications": true,
    "timezone": "Europe/Berlin",
    ...
  },
  "profile": {
    "firstName": null,
    "lastName": null,
    "bio": null,
    ...
  },
  "sidebar": {
    "showDashboard": true,
    "showTodos": true,
    "showSchool": true,
    "showSchoolNotes": true,
    ...
  },
  "message": "Login successful"
}
```

---

## 3️⃣ **Settings laden & speichern**

### Laden (Backend):
```java
// Automatisch beim Login geladen
UserSettings settings = userSettingsRepository.findByUserId(userId);
```

### Speichern (Backend):
```java
userService.updateUserSettings(userId, newSettings);
```

### API Endpoint:
```http
PUT /api/user/{userId}/settings
Content-Type: application/json

{
  "theme": "dark",
  "language": "en",
  "emailNotifications": false,
  "timezone": "America/New_York",
  "dateFormat": "MM/DD/YYYY",
  "timeFormat": "12h"
}
```

---

## 4️⃣ **Sidebar Config**

### Laden:
```http
GET /api/sidebar/{userId}

Response:
{
  "showDashboard": true,
  "showTodos": true,
  "showCalendar": true,
  "showSchool": true,
  "showSchoolNotes": true,
  "showSchoolTimetable": true,
  "showSchoolHomework": true,
  ...
}
```

### Einzelnes Feature togglen:
```http
PUT /api/sidebar/{userId}
Content-Type: application/json

{
  "field": "showSchoolNotes",
  "value": false
}
```

---

## 5️⃣ **School System - Beispiele**

### Stundenplan (Timetable):
```java
// Repository
List<SchoolTimetable> timetable = schoolTimetableRepository
    .findByUserIdOrderByDayOfWeekAscStartTimeAsc(userId);

// Filtern nach Tag
List<SchoolTimetable> monday = schoolTimetableRepository
    .findByUserIdAndDayOfWeek(userId, 1); // 1 = Monday
```

### Hausaufgaben (Homework):
```java
// Alle offenen Hausaufgaben
List<SchoolHomework> homework = schoolHomeworkRepository
    .findByUserIdAndStatus(userId, "PENDING");

// Überfällige Hausaufgaben
List<SchoolHomework> overdue = schoolHomeworkRepository
    .findByUserIdAndDueDateBeforeAndStatus(userId, LocalDate.now(), "PENDING");
```

### Prüfungen (Exams):
```java
// Kommende Prüfungen
List<SchoolExam> exams = schoolExamRepository
    .findByUserIdAndExamDateAfter(userId, LocalDate.now());

// Noch nicht benotete Prüfungen
List<SchoolExam> ungraded = schoolExamRepository
    .findByUserIdAndIsGraded(userId, false);
```

### Noten (Grades):
```java
// Alle Noten für ein Fach
List<SchoolGrade> grades = schoolGradeRepository
    .findByUserIdAndSubjectId(userId, subjectId);

// Durchschnitt berechnen (gewichtet)
BigDecimal average = schoolGradeRepository
    .calculateWeightedAverageBySubject(userId, subjectId);

// Gesamtdurchschnitt
BigDecimal overall = schoolGradeRepository
    .calculateOverallAverage(userId);
```

### Lernzeiten (Study Sessions):
```java
// Gesamte Lernzeit
Long totalMinutes = schoolStudySessionRepository
    .getTotalStudyTime(userId);

// Lernzeit für ein Fach
Long subjectMinutes = schoolStudySessionRepository
    .getTotalStudyTimeBySubject(userId, subjectId);
```

---

## 6️⃣ **Datenbank-Struktur**

### User Management:
- `users` - Account-Daten
- `user_settings` - Einstellungen
- `user_profile` - Profil-Info
- `sidebar_config` - Sidebar-Einstellungen

### School System:
- `school_subjects` - Fächer
- `school_timetable` - Stundenplan
- `school_homework` - Hausaufgaben
- `school_exams` - Prüfungen
- `school_grades` - Noten
- `school_note_folders` - Notizen-Ordner
- `school_notes` - Notizen (Markdown)
- `school_materials` - Dateien/PDFs
- `school_submissions` - Abgaben
- `school_projects` - Projekte
- `school_flashcard_decks` - Lernkarten-Decks
- `school_flashcards` - Lernkarten
- `school_summaries` - Zusammenfassungen
- `school_study_sessions` - Lernzeiten
- `school_absences` - Fehlzeiten

---

## 7️⃣ **Frontend Integration**

### Login Flow:
```typescript
// 1. Login Request
const response = await axios.post('/api/auth/login', {
  usernameOrEmail: username,
  password: password
});

// 2. Response enthält ALLES:
const { userId, username, email, settings, profile, sidebar } = response.data;

// 3. In Context speichern
setUser({ userId, username, email });
setSettings(settings);
setProfile(profile);
setSidebarConfig(sidebar);

// 4. Zur Dashboard-Seite navigieren
navigate('/dashboard');
```

### Settings ändern:
```typescript
// 1. Settings aktualisieren
const newSettings = {
  ...currentSettings,
  theme: 'dark',
  language: 'en'
};

// 2. An Backend senden
await axios.put(`/api/user/${userId}/settings`, newSettings);

// 3. Im State aktualisieren
setSettings(newSettings);
```

### Sidebar aktualisieren:
```typescript
// 1. Feature togglen
const updatedSidebar = {
  ...sidebarConfig,
  showSchoolNotes: false
};

// 2. An Backend senden
await axios.put(`/api/sidebar/${userId}`, {
  field: 'showSchoolNotes',
  value: false
});

// 3. Im State aktualisieren
setSidebarConfig(updatedSidebar);
```

---

## 8️⃣ **Deployment Checklist**

### Vor dem Deployment:
1. ✅ **Backup der Datenbank** machen
2. ✅ `application.properties` prüfen:
   ```properties
   spring.flyway.enabled=true
   spring.flyway.clean-disabled=false
   spring.jpa.hibernate.ddl-auto=validate
   ```
3. ✅ PasswordEncoder in SecurityConfig aktiviert
4. ✅ CORS für Frontend konfiguriert

### Nach dem Deployment:
1. ✅ Logs prüfen: `docker logs life-hub-backend --tail 100`
2. ✅ Flyway Migration erfolgreich: `V2_0__complete_database_schema.sql`
3. ✅ Health Check: `curl http://localhost:5000/actuator/health`
4. ✅ Test Registration: `POST /api/auth/register`
5. ✅ Test Login: `POST /api/auth/login`

---

## 🎯 **Wichtige Hinweise**

### Password Encoding:
```java
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### Flyway Clean:
```properties
# NUR IN DEVELOPMENT!
spring.flyway.clean-disabled=false

# IN PRODUCTION:
spring.flyway.clean-disabled=true
```

### CORS Configuration:
```java
@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}
```

---

## ✨ **Vorteile der neuen Architektur**

1. **Einfacher:** Alles in der DB, keine JSON-Files
2. **Schneller:** 30+ Indizes für Performance
3. **Sicherer:** Automatische Timestamps, CASCADE Deletes
4. **Vollständiger:** 28 Tabellen für alle Features
5. **Wartbar:** Klare Struktur, JPA Repositories

---

## 🚀 **Next Steps**

1. ✅ Backend fertig (Entities, Repositories, Services)
2. ⏳ AuthController erweitern
3. ⏳ School Controllers erstellen
4. ⏳ Frontend anpassen (Login, Settings, School)
5. ⏳ Deployen und testen

**Du hast jetzt eine professionelle, skalierbare Architektur!** 🎉
