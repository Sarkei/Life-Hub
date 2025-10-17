# 📋 Life Hub - Feature Roadmap & TODO

## 🔥 Priorität: HOCH (Sofort umsetzen)

### Installation & Deployment
- [ ] `npm install react-syntax-highlighter @types/react-syntax-highlighter` ausführen
- [ ] Datenbank-Migration durchführen (V1_0__notes_system_enhancement.sql)
- [ ] Docker-Container neu bauen und starten
- [ ] Alle Features testen (Login, Notizen, Todos, Fitness)
- [ ] Auth-Check in App.tsx wieder aktivieren (Production)

### Bug Fixes
- [ ] TypeScript-Warungen nach npm install prüfen
- [ ] CORS-Config für PDF-Viewing testen
- [ ] File-Upload Größenbeschränkung setzen (z.B. 10MB)
- [ ] Error-Handling in NotesPage verbessern

---

## 🎯 Priorität: MITTEL (Diese Woche)

### Notizen-System Erweiterungen
- [ ] **Suche:** Volltextsuche in Notizen implementieren
  - Backend: `/api/notes/search?query={text}&category={category}`
  - Frontend: Suchfeld im Header der NotesPage
  - Elasticsearch oder PostgreSQL Full-Text-Search

- [ ] **Tags:** Tag-System für Notizen
  - Backend: Tabelle `note_tags`, Many-to-Many Relation
  - Frontend: Tag-Input mit Autocomplete
  - Filter nach Tags

- [ ] **Favoriten:** Favoriten-Markierung
  - Backend: `is_favorite BOOLEAN` in notes-Tabelle
  - Frontend: Stern-Icon zum Markieren
  - Sidebar: Favoriten-Sektion

- [ ] **Recent:** Zuletzt geöffnete Notizen
  - Backend: `last_opened TIMESTAMP` in notes-Tabelle
  - Frontend: "Zuletzt geöffnet" Sektion
  - Limit auf 10 Notizen

- [ ] **Export:** Notizen exportieren
  - Markdown-Export (Zip-Datei mit allen Notizen)
  - PDF-Export (Einzelne Notiz als PDF)
  - HTML-Export

- [ ] **Import:** Bulk-Import von Notizen
  - Markdown-Dateien hochladen (Zip)
  - Ordnerstruktur beibehalten
  - Metadaten extrahieren

- [ ] **Templates:** Vorlagen für Notizen
  - Vorlagen-System im Backend
  - Standard-Templates (Meeting, Lecture, Project)
  - Custom Templates erstellen

- [ ] **Sharing:** Notizen teilen
  - Shareable Links generieren
  - Passwort-Schutz
  - Ablaufdatum
  - Mit anderen Usern teilen

- [ ] **Versioning:** Versionierung
  - Git-ähnliches Versioning
  - Diff-View zwischen Versionen
  - Restore zu alter Version

### Notizen UI/UX Verbesserungen
- [ ] **Drag & Drop:** Dateien zwischen Ordnern verschieben
- [ ] **Keyboard Shortcuts:** Strg+S zum Speichern, Strg+B für Bold
- [ ] **Dark Mode:** für Markdown-Editor
- [ ] **Auto-Save:** Alle 30 Sekunden automatisch speichern
- [ ] **Attachment Support:** Bilder/Dateien in Notizen einbetten
- [ ] **Markdown Tables:** Toolbar-Button für Tabellen
- [ ] **Checklists:** `- [ ]` Support mit klickbaren Checkboxen
- [ ] **Emoji Picker:** Emoji-Button im Toolbar
- [ ] **Word Count:** Wörter/Zeichen zählen

---

## 💪 Priorität: MITTEL (Diese Woche)

### Gewicht-Tracker (WeightPage.tsx)
**Features:**
- Gewichtsverlauf mit Chart (Chart.js oder Recharts)
- Zielgewicht festlegen
- Trend berechnen (Durchschnitt letzte 7/30 Tage)
- BMI-Rechner
- Statistiken: Aktuell, Ziel, Differenz, Fortschritt %
- Export als CSV

**Backend:**
```java
@Entity
class WeightEntry {
    Long id;
    Long userId;
    Double weight;
    LocalDate date;
    String note;
}
```

**API-Endpoints:**
- `GET /api/weight/entries?startDate={date}&endDate={date}`
- `POST /api/weight/entries`
- `DELETE /api/weight/entries/{id}`
- `GET /api/weight/statistics`

---

### Ernährung (MealsPage.tsx)
**Features:**
- Mahlzeiten-Tracker (Frühstück, Mittagessen, Abendessen, Snacks)
- Kalorien zählen
- Makros (Protein, Kohlenhydrate, Fette)
- Wasser-Tracker
- Tages-Ziel setzen
- Verlauf mit Chart
- Favoriten-Mahlzeiten

**Backend:**
```java
@Entity
class Meal {
    Long id;
    Long userId;
    String name;
    MealType type; // BREAKFAST, LUNCH, DINNER, SNACK
    Integer calories;
    Double protein;
    Double carbs;
    Double fats;
    LocalDateTime timestamp;
}
```

**API-Endpoints:**
- `GET /api/meals/entries?date={date}`
- `POST /api/meals/entries`
- `DELETE /api/meals/entries/{id}`
- `GET /api/meals/statistics?date={date}`
- `GET /api/meals/favorites`
- `POST /api/meals/favorites`

---

### Gewohnheiten (HabitsPage.tsx)
**Features:**
- Habit-Tracker mit täglichen Checkboxen
- Streaks zählen (Längste, Aktuelle)
- Habit-Kategorien (Gesundheit, Produktivität, Lernen, etc.)
- Erinnerungen setzen
- Statistiken: Erfolgsrate, Total Days, Current Streak
- Visualisierung (Heatmap wie GitHub)

**Backend:**
```java
@Entity
class Habit {
    Long id;
    Long userId;
    String name;
    String category;
    List<DayOfWeek> targetDays; // z.B. nur Mo-Fr
    LocalDate startDate;
}

@Entity
class HabitLog {
    Long id;
    Long habitId;
    LocalDate date;
    Boolean completed;
    String note;
}
```

**API-Endpoints:**
- `GET /api/habits`
- `POST /api/habits`
- `PUT /api/habits/{id}`
- `DELETE /api/habits/{id}`
- `GET /api/habits/{id}/logs?startDate={date}&endDate={date}`
- `POST /api/habits/{id}/logs`
- `GET /api/habits/{id}/statistics`

---

### Budget (BudgetPage.tsx)
**Features:**
- Einnahmen/Ausgaben Tracking
- Kategorien (Essen, Transport, Wohnen, Freizeit, etc.)
- Monatliches Budget setzen
- Visualisierung (Pie Chart, Bar Chart)
- Wiederkehrende Transaktionen
- Export als CSV
- Statistiken: Total, This Month, Last Month, Categories

**Backend:**
```java
@Entity
class Transaction {
    Long id;
    Long userId;
    TransactionType type; // INCOME, EXPENSE
    String category;
    Double amount;
    LocalDate date;
    String description;
    Boolean recurring; // Wiederkehrend
    Integer recurringDays; // Alle X Tage
}

@Entity
class BudgetLimit {
    Long id;
    Long userId;
    String category;
    Double limit;
    YearMonth month;
}
```

**API-Endpoints:**
- `GET /api/budget/transactions?startDate={date}&endDate={date}`
- `POST /api/budget/transactions`
- `PUT /api/budget/transactions/{id}`
- `DELETE /api/budget/transactions/{id}`
- `GET /api/budget/limits?month={month}`
- `POST /api/budget/limits`
- `GET /api/budget/statistics?month={month}`

---

## 📅 Priorität: NIEDRIG (Nächste Woche)

### Kalender (CalendarPage.tsx - Vollständig)
**Features:**
- Monatsansicht, Wochenansicht, Tagesansicht
- Events erstellen/bearbeiten/löschen
- Kategorien (Arbeit, Privat, Schule)
- Farben pro Kategorie
- Erinnerungen
- Wiederkehrende Events
- Integration mit Todos (Fälligkeit im Kalender anzeigen)
- iCal/Google Calendar Import/Export

**Backend:**
```java
@Entity
class CalendarEvent {
    Long id;
    Long userId;
    String title;
    String description;
    LocalDateTime startTime;
    LocalDateTime endTime;
    String category;
    String color;
    Boolean allDay;
    Boolean recurring;
    RecurringType recurringType; // DAILY, WEEKLY, MONTHLY, YEARLY
    LocalDate recurringEndDate;
}
```

**API-Endpoints:**
- `GET /api/calendar/events?startDate={date}&endDate={date}`
- `POST /api/calendar/events`
- `PUT /api/calendar/events/{id}`
- `DELETE /api/calendar/events/{id}`
- `GET /api/calendar/export` (iCal-Datei)
- `POST /api/calendar/import` (iCal-Datei hochladen)

---

### Dashboard-Widgets
**Features:**
- Übersicht aller Bereiche auf einer Seite
- Anpassbare Widgets (Position, Größe)
- Widgets:
  - Todo-Summary (Heute fällig, Diese Woche)
  - Fitness-Summary (Letzte Workouts)
  - Weight-Chart (Trend)
  - Habits-Heatmap
  - Budget-Summary (This Month)
  - Recent Notes
  - Calendar-Events (Heute)
- Drag & Drop zum Anordnen

**Technologie:**
- React-Grid-Layout
- LocalStorage für Layout speichern
- Backend: Keine neuen Endpoints, nutzt bestehende

---

### Arbeit & Schule Dashboards
**Arbeit Dashboard:**
- Projekte-Übersicht
- Tasks nach Projekt
- Zeiterfassung
- Meetings im Kalender
- Arbeit-Notizen
- Team-Mitglieder (optional)

**Schule Dashboard:**
- Fächer-Übersicht
- Stundenplan
- Hausaufgaben (Todo-Integration)
- Noten-Tracker
- Schule-Notizen
- Prüfungstermine

**Backend:**
```java
@Entity
class Project {
    Long id;
    Long userId;
    String name;
    String description;
    ProjectStatus status; // ACTIVE, COMPLETED, ARCHIVED
    LocalDate startDate;
    LocalDate endDate;
}

@Entity
class Subject {
    Long id;
    Long userId;
    String name;
    String teacher;
    String room;
    List<DayOfWeek> schedule; // Wochentage
    LocalTime startTime;
    LocalTime endTime;
}

@Entity
class Grade {
    Long id;
    Long subjectId;
    String title;
    Double grade;
    Double weight;
    LocalDate date;
}
```

---

## 🔐 Sicherheit & Performance

### Sicherheit
- [ ] **Auth wieder aktivieren:** `isAuthenticated` in App.tsx
- [ ] **JWT Token in API-Requests:** Alle Axios-Requests mit Bearer Token
- [ ] **CORS richtig konfigurieren:** Nur erlaubte Origins
- [ ] **Input-Validierung:** XSS-Schutz, SQL-Injection Schutz
- [ ] **File-Upload Limit:** Max 10MB pro Datei
- [ ] **Rate Limiting:** Max Requests pro Minute
- [ ] **HTTPS erzwingen:** Redirect von HTTP zu HTTPS
- [ ] **Password Hashing:** BCrypt mit Salts
- [ ] **Session Timeout:** Nach 30 Minuten Inaktivität

### Performance
- [ ] **Lazy Loading:** Code-Splitting für Pages
- [ ] **Image Optimization:** WebP-Format, Lazy Loading
- [ ] **API Caching:** Redis für häufige Queries
- [ ] **Database Indexes:** Auf häufig abgefragten Feldern
- [ ] **Pagination:** Für lange Listen (Notizen, Todos, etc.)
- [ ] **Gzip Compression:** Für API-Responses
- [ ] **CDN für Assets:** Bilder, CSS, JS auf CDN
- [ ] **Service Worker:** PWA-Support für Offline-Nutzung

---

## 🎨 UI/UX Verbesserungen

### Design
- [ ] **Dark Mode:** Vollständig für alle Pages
- [ ] **Responsive Design:** Mobile-optimiert (Tablet, Phone)
- [ ] **Animations:** Smooth Transitions, Fade-Ins
- [ ] **Loading States:** Spinner/Skeleton Screens
- [ ] **Error Messages:** User-freundliche Fehlermeldungen
- [ ] **Success Messages:** Toast-Notifications
- [ ] **Empty States:** Placeholder für leere Listen
- [ ] **Icons:** Konsistente Icon-Nutzung
- [ ] **Typography:** Bessere Font-Hierarchie
- [ ] **Accessibility:** ARIA-Labels, Keyboard-Navigation

### User Experience
- [ ] **Onboarding:** Erste Schritte Guide
- [ ] **Tooltips:** Hilfe-Texte bei Hover
- [ ] **Keyboard Shortcuts:** Übersicht anzeigen
- [ ] **Undo/Redo:** Für Notizen-Editor
- [ ] **Bulk Actions:** Mehrere Items gleichzeitig löschen
- [ ] **Search:** Globale Suche über alle Bereiche
- [ ] **Notifications:** Push-Notifications im Browser
- [ ] **Multi-Language:** Deutsch, Englisch, etc.

---

## 📱 Mobile & PWA

### Progressive Web App
- [ ] **Service Worker:** Offline-Unterstützung
- [ ] **manifest.json:** App-Installierbar
- [ ] **Icons:** Alle Größen (192x192, 512x512)
- [ ] **Splash Screen:** Launch-Screen
- [ ] **Push Notifications:** Via Service Worker
- [ ] **App-Like Feel:** Keine Browser-UI
- [ ] **Offline-First:** Sync wenn Online

### Mobile Optimierung
- [ ] **Touch-Gestures:** Swipe, Pinch-to-Zoom
- [ ] **Mobile Navigation:** Bottom Tab Bar
- [ ] **Responsive Sidebar:** Drawer auf Mobile
- [ ] **Mobile Keyboard:** Input-Optimierung
- [ ] **Camera Access:** Fotos direkt aufnehmen

---

## 🧪 Testing & Quality

### Testing
- [ ] **Unit Tests:** Jest für Komponenten
- [ ] **Integration Tests:** API-Tests mit Postman/Insomnia
- [ ] **E2E Tests:** Cypress für User-Flows
- [ ] **Performance Tests:** Lighthouse Audits
- [ ] **Security Tests:** OWASP Top 10 Check

### Monitoring
- [ ] **Error Tracking:** Sentry Integration
- [ ] **Analytics:** User-Verhalten tracken
- [ ] **Performance Monitoring:** Backend Response Times
- [ ] **Logs:** Strukturiertes Logging (JSON)
- [ ] **Alerts:** Bei kritischen Fehlern

---

## 🚀 DevOps & Infrastruktur

### Deployment
- [ ] **CI/CD Pipeline:** GitHub Actions
- [ ] **Auto-Deploy:** Bei Push auf main
- [ ] **Health Checks:** Endpoint für Monitoring
- [ ] **Backup Strategy:** Automatische DB-Backups
- [ ] **Rollback-Plan:** Bei fehlerhaftem Deploy

### Dokumentation
- [ ] **API Documentation:** Swagger/OpenAPI
- [ ] **User Guide:** Ausführliche Anleitung
- [ ] **Developer Guide:** Setup für Contributors
- [ ] **Changelog:** Version History

---

## 🎯 Reihenfolge der Implementierung

### Phase 1 (Diese Woche)
1. Installation & Deployment (HOCH)
2. Bug Fixes (HOCH)
3. WeightPage.tsx implementieren
4. MealsPage.tsx implementieren

### Phase 2 (Nächste Woche)
1. HabitsPage.tsx implementieren
2. BudgetPage.tsx implementieren
3. Notizen-Suche implementieren
4. Dark Mode vollständig

### Phase 3 (In 2 Wochen)
1. CalendarPage vollständig
2. Dashboard-Widgets
3. Arbeit & Schule Dashboards
4. Mobile Optimierung

### Phase 4 (In 4 Wochen)
1. PWA-Support
2. Security-Hardening
3. Performance-Optimierung
4. Testing-Suite

---

## 📊 Metriken & Ziele

### Performance-Ziele
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] API Response Time < 200ms

### User-Ziele
- [ ] 100% Feature-Coverage
- [ ] 0 kritische Bugs
- [ ] Mobile-Responsive (100%)
- [ ] Accessibility Score A

---

**Status aktualisieren mit:**
```bash
# Öffne diese Datei
vim /volume1/docker/Life-Hub/TODO.md

# Checkboxen aktualisieren
- [x] Task erledigt
```

**Viel Erfolg! 🚀**
