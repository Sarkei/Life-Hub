# 📅 Kalender & Dashboard Update

## ✨ Was ist neu?

### 1. Vollständiger Kalender mit Event-Management

#### Features:
- **📅 Monatsansicht** mit interaktivem Grid-Layout
- **➕ Events erstellen** mit Modal-Dialog
- **✏️ Events bearbeiten** und Details anzeigen
- **🗑️ Events löschen** mit Bestätigung
- **🎨 Farbcodierung** - 6 vordefinierte Farben wählbar
- **📍 Standort-Unterstützung** für Events
- **🕐 Ganztags-Events** oder mit Zeitangabe
- **📂 Kategorien** - Privat, Arbeit, Schule
- **📱 Responsive Design** für mobile Geräte

#### Kalender-Navigation:
- ◀️ **Vorheriger Monat**
- ▶️ **Nächster Monat**
- 📆 **Heute-Button** zum Zurückspringen
- **Wochenübersicht** mit So-Sa
- **Aktueller Tag** mit blauem Ring markiert

#### Event-Ansicht:
- **Max 3 Events** pro Tag angezeigt
- **"+X mehr"** Indikator bei mehr Events
- **Klick auf Event** öffnet Details-Modal
- **Klick auf Tag** öffnet Erstellungs-Dialog
- **Zeitanzeige** - 🕐 für zeitbasiert, 📅 für ganztägig

---

### 2. Dashboard mit Widgets

#### Private Dashboard Features:
- **👋 Willkommens-Nachricht** mit aktuellem Datum
- **📊 Statistik-Karten** (4 Karten):
  - Offene Aufgaben
  - Nächste Termine (7 Tage)
  - Workouts (7 Tage)
  - Verbrannte Kalorien (7 Tage)
- **📅 Upcoming Events Widget**:
  - Zeigt nächste 5 Termine
  - Zeitangabe (Heute/Morgen/Datum)
  - Farbcodierung
  - Standort-Anzeige
  - Klickbar → zur Kalender-Seite
- **✅ Offene Aufgaben Widget**:
  - Zeigt nächste 3 Todos
  - Priorität mit Emoji (🔴🟡🟢)
  - Fälligkeitsdatum
  - Klickbar → zur Todo-Seite
- **🚀 Schnellzugriff-Karten** (6 Karten):
  - Todos, Kalender, Fitness, Gewicht, Ernährung, Notizen
  - Hover-Effekte mit Scale-Animation
  - Direkte Navigation per Klick

#### Arbeit Dashboard Features:
- **💼 Briefcase-Icon** im Titel
- **📊 3 Statistik-Karten**:
  - Offene Aufgaben
  - Anstehende Meetings
  - Notizen
- **📅 Meetings Widget** gefiltert nach Kategorie "arbeit"
- **🚀 3 Schnellzugriff-Karten**: Aufgaben, Kalender, Notizen

#### Schule Dashboard Features:
- **🎓 GraduationCap-Icon** im Titel
- **📊 3 Statistik-Karten**:
  - Hausaufgaben
  - Prüfungen & Termine
  - Notizen
- **📅 Prüfungen Widget** gefiltert nach Kategorie "schule"
- **🚀 3 Schnellzugriff-Karten**: Hausaufgaben, Kalender, Notizen

---

### 3. Klickbare Dashboard-Buttons

**Alle Dashboard-Elemente sind jetzt voll klickbar!**

#### Statistik-Karten:
```typescript
onClick={() => navigate('/private/todos')}
onClick={() => navigate('/private/calendar')}
onClick={() => navigate('/private/fitness')}
```

#### Schnellzugriff-Karten:
- **Hover-Effekte**: Shadow und Scale-Animation
- **Cursor**: pointer
- **Navigation** per `useNavigate()` zu jeweiliger Seite

#### Widget-Buttons:
- "Alle anzeigen" → Navigiert zur vollständigen Seite
- Event/Todo klicken → Navigiert zur Detail-Ansicht
- Leere Widgets → "Erstellen"-Button mit Navigation

---

## 🗄️ Backend API

### CalendarController Endpoints:

```java
// Alle Events abrufen (mit optionalen Filtern)
GET /api/calendar/events?userId={id}&category={category}&start={datetime}&end={datetime}

// Upcoming Events (nächste 7 Tage)
GET /api/calendar/events/upcoming?userId={id}&days={7}

// Einzelnes Event abrufen
GET /api/calendar/events/{id}

// Neues Event erstellen
POST /api/calendar/events
Body: {
  userId: 1,
  title: "Team Meeting",
  description: "Weekly sync",
  startTime: "2025-10-18T10:00:00",
  endTime: "2025-10-18T11:00:00",
  category: "arbeit",
  color: "#3b82f6",
  allDay: false,
  location: "Raum 301"
}

// Event aktualisieren
PUT /api/calendar/events/{id}

// Event löschen
DELETE /api/calendar/events/{id}
```

---

## 🗃️ Datenbank-Schema

### calendar_events Tabelle:

```sql
CREATE TABLE calendar_events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    category VARCHAR(50) DEFAULT 'privat',
    color VARCHAR(7) DEFAULT '#3b82f6',
    all_day BOOLEAN DEFAULT FALSE,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes für Performance
CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_category ON calendar_events(category);
CREATE INDEX idx_calendar_events_user_start ON calendar_events(user_id, start_time);
```

---

## 📁 Neue Dateien

### Backend:
1. ✅ `CalendarEvent.java` - Entity
2. ✅ `CalendarEventRepository.java` - Repository mit Query-Methoden
3. ✅ `CalendarController.java` - REST API (6 Endpoints)
4. ✅ `V1_1__calendar_events.sql` - Datenbank-Migration

### Frontend:
1. ✅ `CalendarPage.tsx` - Vollständiger Kalender (560 Zeilen)
2. ✅ `Dashboard.tsx` (Private) - Erweitertes Dashboard (380 Zeilen)
3. ✅ `Dashboard.tsx` (Work) - Arbeit Dashboard (220 Zeilen)
4. ✅ `Dashboard.tsx` (School) - Schule Dashboard (220 Zeilen)

**Total:** 8 neue Dateien, ~1.500 Zeilen Code

---

## 🚀 Installation

### 1. Datenbank-Migration ausführen:
```bash
docker exec -i lifehub-db psql -U lifehub -d lifehub < backend/src/main/resources/db/migration/V1_1__calendar_events.sql
```

Oder manuell:
```bash
docker exec -it lifehub-db psql -U lifehub -d lifehub
```
```sql
-- Copy & paste SQL from V1_1__calendar_events.sql
\q
```

### 2. Backend neu starten:
```bash
cd /volume1/docker/Life-Hub
docker-compose down
docker-compose build --no-cache backend
docker-compose up -d
```

### 3. Frontend ist bereits aktualisiert (keine Dependencies nötig)

---

## 🎯 Verwendung

### Kalender verwenden:

1. **Navigiere zu Kalender:**
   - Privat → Kalender
   - Arbeit → Kalender
   - Schule → Kalender

2. **Termin erstellen:**
   - Klicke auf "+ Neuer Termin" (rechts oben)
   - ODER klicke auf einen Tag im Kalender
   - Fülle das Formular aus:
     - Titel (Pflicht)
     - Beschreibung (optional)
     - Ganztägig? (Checkbox)
     - Start/Ende (Datum/Zeit)
     - Ort (optional)
     - Kategorie (Privat/Arbeit/Schule)
     - Farbe wählen (6 Optionen)
   - Klicke "Erstellen"

3. **Termin ansehen:**
   - Klicke auf Event im Kalender
   - Details-Modal öffnet sich
   - Zeigt: Titel, Beschreibung, Zeit, Ort, Kategorie

4. **Termin bearbeiten:**
   - Öffne Event-Details
   - Klicke "Bearbeiten"
   - Formular öffnet sich mit vorausgefüllten Daten
   - Ändere und klicke "Aktualisieren"

5. **Termin löschen:**
   - Öffne Event-Details
   - Klicke "Löschen" (rot)
   - Bestätige in Dialog

6. **Navigation:**
   - ◀️ Vorheriger Monat
   - ▶️ Nächster Monat
   - "Heute" → Zurück zum aktuellen Monat

---

### Dashboard verwenden:

1. **Navigiere zum Dashboard:**
   - Privat Dashboard: `/private`
   - Arbeit Dashboard: `/work`
   - Schule Dashboard: `/school`

2. **Statistiken ansehen:**
   - Klicke auf Statistik-Karten
   - Navigiert zur jeweiligen Detailseite

3. **Upcoming Events:**
   - Zeigt nächste 5 Termine (7 Tage)
   - Farbcodiert nach Kategorie
   - Klick auf Event → zur Kalender-Seite
   - "Alle anzeigen" → zur Kalender-Seite

4. **Offene Aufgaben:**
   - Zeigt nächste 3 Todos
   - Priorität mit Emoji
   - Klick auf Todo → zur Todo-Seite

5. **Schnellzugriff:**
   - Klicke auf Karten
   - Hover-Effekt mit Animation
   - Direkte Navigation

---

## ✅ Features-Checkliste

### Kalender:
- [x] Monatsansicht mit Grid
- [x] Events erstellen/bearbeiten/löschen
- [x] Ganztags-Events
- [x] Zeitbasierte Events
- [x] Farbcodierung (6 Farben)
- [x] Kategorien (Privat/Arbeit/Schule)
- [x] Standort-Feld
- [x] Navigation (Vor/Zurück/Heute)
- [x] Event-Details-Modal
- [x] Erstellen-Modal
- [x] Responsive Design

### Dashboard:
- [x] Willkommens-Nachricht
- [x] Statistik-Karten (klickbar)
- [x] Upcoming Events Widget (7 Tage)
- [x] Offene Aufgaben Widget
- [x] Schnellzugriff-Karten (klickbar)
- [x] Hover-Animationen
- [x] Private Dashboard
- [x] Arbeit Dashboard
- [x] Schule Dashboard
- [x] Kategorie-Filterung für Events

### Backend:
- [x] CalendarEvent Entity
- [x] CalendarEventRepository
- [x] CalendarController (6 Endpoints)
- [x] Datenbank-Migration
- [x] Query-Methoden (DateRange, Category, Upcoming)
- [x] CORS-Support

---

## 🎨 UI/UX Highlights

### Kalender:
- **Interaktive Grid-Ansicht** mit Hover-Effekten
- **Modal-Dialoge** für saubere UX
- **Farbauswahl** mit visuellen Buttons
- **Responsive Grid** (6 Wochen à 7 Tage)
- **Heute-Markierung** mit blauem Ring
- **Event-Badges** mit Icons (🕐/📅)
- **Truncate** bei langen Titeln
- **"+X mehr"** Indikator

### Dashboard:
- **Statistik-Karten** mit farbigen Icons
- **Widget-Layout** mit Grid-System
- **Hover-Effekte** (Shadow, Scale)
- **Smooth Transitions** überall
- **Empty States** mit Call-to-Action
- **Konsistente Farbschema** pro Kategorie
- **Icons** von Lucide React
- **Dark Mode** Support

---

## 🔧 Technische Details

### State Management:
```typescript
const [currentDate, setCurrentDate] = useState(new Date())
const [events, setEvents] = useState<CalendarEvent[]>([])
const [selectedDate, setSelectedDate] = useState<Date | null>(null)
const [showModal, setShowModal] = useState(false)
const [showEventDetails, setShowEventDetails] = useState(false)
const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
```

### API Calls:
```typescript
// Load events for current month
const loadEvents = async () => {
  const response = await axios.get('http://localhost:8080/api/calendar/events', {
    params: {
      userId: 1,
      start: startOfMonth.toISOString(),
      end: endOfMonth.toISOString()
    }
  })
  setEvents(response.data)
}

// Load upcoming events (Dashboard)
const response = await axios.get('http://localhost:8080/api/calendar/events/upcoming', {
  params: { userId: 1, days: 7 }
})
```

### Navigation:
```typescript
const navigate = useNavigate()

onClick={() => navigate('/private/calendar')}
onClick={() => navigate('/private/todos')}
onClick={() => navigate('/private/fitness')}
```

---

## 📊 Beispiel-Events

### Meeting (Arbeit):
```json
{
  "title": "Team Standup",
  "description": "Tägliches Morning Standup",
  "startTime": "2025-10-18T09:00:00",
  "endTime": "2025-10-18T09:30:00",
  "category": "arbeit",
  "color": "#3b82f6",
  "allDay": false,
  "location": "Zoom"
}
```

### Prüfung (Schule):
```json
{
  "title": "Mathe Klausur",
  "description": "Analysis II - Kapitel 1-5",
  "startTime": "2025-10-20T08:00:00",
  "endTime": "2025-10-20T10:00:00",
  "category": "schule",
  "color": "#ef4444",
  "allDay": false,
  "location": "Hörsaal A"
}
```

### Geburtstag (Privat):
```json
{
  "title": "Mama's Geburtstag",
  "startTime": "2025-10-25T00:00:00",
  "endTime": "2025-10-25T23:59:00",
  "category": "privat",
  "color": "#ec4899",
  "allDay": true
}
```

---

## 🐛 Bekannte Issues

### TypeScript-Fehler (IDE-only):
```
Cannot find module 'react'
Cannot find module 'lucide-react'
```
**Lösung:** Diese sind normal und verschwinden nach `npm install`. Runtime ist nicht betroffen.

### Timezone-Handling:
Events werden in lokaler Zeitzone gespeichert. Bei Bedarf UTC-Konvertierung implementieren.

### Pagination:
Aktuell werden alle Events des Monats geladen. Bei vielen Events sollte Pagination implementiert werden.

---

## 🚀 Nächste Erweiterungen

### Geplante Features:
- [ ] **Wochenansicht** für Kalender
- [ ] **Tagesansicht** für detaillierte Zeitleiste
- [ ] **Drag & Drop** zum Verschieben von Events
- [ ] **Wiederkehrende Events** (täglich/wöchentlich/monatlich)
- [ ] **Erinnerungen** mit Notifications
- [ ] **iCal/Google Calendar** Import/Export
- [ ] **Sharing** von Events mit anderen Usern
- [ ] **Farbschema-Anpassung** im Settings
- [ ] **Todo-API Integration** für Dashboard-Widget
- [ ] **Workout-API Integration** für Dashboard-Widget

---

## ✅ Test-Checkliste

### Kalender:
- [ ] Monat wechseln (Vor/Zurück)
- [ ] "Heute"-Button funktioniert
- [ ] Termin erstellen
- [ ] Termin mit Zeit erstellen
- [ ] Ganztags-Termin erstellen
- [ ] Farbe wählen
- [ ] Kategorie wählen
- [ ] Standort eingeben
- [ ] Event anklicken → Details-Modal
- [ ] Event bearbeiten
- [ ] Event löschen
- [ ] Events werden im Grid angezeigt
- [ ] Max 3 Events pro Tag
- [ ] "+X mehr" wird angezeigt
- [ ] Heutiger Tag markiert

### Dashboard:
- [ ] Dashboard lädt
- [ ] Statistik-Karten zeigen Zahlen
- [ ] Klick auf Karten navigiert
- [ ] Upcoming Events Widget zeigt Events
- [ ] Events nach Kategorie gefiltert (Arbeit/Schule)
- [ ] Klick auf Event navigiert zu Kalender
- [ ] Offene Aufgaben Widget (Mock-Daten)
- [ ] Schnellzugriff-Karten sind klickbar
- [ ] Hover-Animationen funktionieren
- [ ] Private/Work/School Dashboards unterschiedlich

### Backend:
- [ ] GET /api/calendar/events funktioniert
- [ ] GET /api/calendar/events/upcoming funktioniert
- [ ] POST /api/calendar/events erstellt Event
- [ ] PUT /api/calendar/events/{id} aktualisiert
- [ ] DELETE /api/calendar/events/{id} löscht
- [ ] Kategorie-Filter funktioniert
- [ ] DateRange-Filter funktioniert
- [ ] Events werden in DB gespeichert

---

**Happy Scheduling! 📅✨**

Bei Fragen oder Problemen: Schaue in diese Dokumentation oder prüfe die Logs mit `docker-compose logs -f backend`
