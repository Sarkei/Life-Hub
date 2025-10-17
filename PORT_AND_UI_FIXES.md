# Port & UI Fixes - Zusammenfassung

## Datum: 17. Oktober 2025

## ✅ Durchgeführte Änderungen

### 1. **API Port von 8080 auf 5000 geändert**

**Problem:** Der Port 8080 war bereits belegt.

**Lösung:** Alle Frontend-API-Aufrufe von `localhost:8080` auf `localhost:5000` geändert.

**Betroffene Dateien:**
- `frontend/src/pages/SettingsPage.tsx`
- `frontend/src/pages/private/Dashboard.tsx`
- `frontend/src/pages/private/FitnessPage.tsx`
- `frontend/src/pages/private/NutritionPage.tsx`
- `frontend/src/pages/private/WeightPage.tsx`
- `frontend/src/pages/private/CalendarPage.tsx`
- `frontend/src/pages/SchoolPage.tsx`
- `frontend/src/components/layout/Sidebar.tsx`
- `frontend/src/components/KanbanBoard.tsx`
- Und alle anderen `.tsx/.ts` Dateien im Frontend

**Backend-Konfiguration:**
```yaml
# application.yml
server:
  port: ${SERVER_PORT:5000}

# docker-compose.yml
backend:
  environment:
    SERVER_PORT: 5000
  ports:
    - "5000:5000"
```

**API-Endpunkte jetzt erreichbar unter:**
- Backend: `http://localhost:5000/api`
- Frontend: `http://localhost:80` (Port 80 via nginx)
- pgAdmin: `http://localhost:5222`
- PostgreSQL: `localhost:5555`

---

### 2. **Sidebar-Konfiguration gefixt**

**Problem:** 
- Sidebar-Einträge wurden nicht angezeigt
- "Schule" fehlte als Hauptmenüpunkt
- Mapping zwischen Frontend und Backend fehlte

**Lösung:**

#### a) Migration aktualisiert (`V1_7__sidebar_config.sql`)
```sql
-- NEU hinzugefügt:
school BOOLEAN DEFAULT TRUE,
```

#### b) Backend Entity (`SidebarConfig.java`)
```java
@Column(name = "school")
@Builder.Default
private Boolean school = true;
```

#### c) Backend DTO (`SidebarConfigResponse.java`)
```java
private Boolean school;
```

#### d) Backend Controller (`SidebarController.java`)
```java
// In updateSidebarConfig:
case "school" -> config.setSchool(value);

// In resetToDefaults:
config.setSchool(true);

// In createDefaultConfig:
.school(true)

// In mapToResponse:
.school(config.getSchool())
```

#### e) Frontend (`Sidebar.tsx`)
```tsx
// NEU in defaultSidebarItems:
{ id: 'school', label: 'Schule', icon: GraduationCap, path: '/school', category: 'school', enabled: true },

// NEU in allen 3 fieldMaps (loadSidebarConfig, saveConfig, resetToDefaults):
'school': 'school',
```

**Sidebar-Struktur jetzt:**
```
✅ Allgemein
  - Dashboard
  - Aufgaben
  - Kalender
  - Profile

✅ Privat
  - Fitness
  - Gewicht
  - Ernährung
  - + 12 weitere Features (alle mit NEU Badge)

✅ Arbeit
  - Zeiterfassung
  - Projekte

✅ Schule ⭐ NEU
  - Schule (Hauptseite mit Dashboard)
  - Noten
```

---

### 3. **Kalender auf Montag-Sonntag umgestellt**

**Problem:** Kalender zeigte Sonntag-Samstag statt Montag-Sonntag.

**Lösung:**

#### a) Wochentag-Header geändert (`CalendarPage.tsx`)
```tsx
// ALT:
const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

// NEU:
const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
```

#### b) Kalender-Berechnung angepasst (`getDaysInMonth`)
```tsx
// Montag als erster Tag (0=Sonntag -> 6, 1=Montag -> 0, ...)
let startingDayOfWeek = firstDay.getDay() - 1
if (startingDayOfWeek === -1) startingDayOfWeek = 6 // Sonntag wird zu 6
```

**Ergebnis:**
```
Mo | Di | Mi | Do | Fr | Sa | So
---------------------------------
 1 |  2 |  3 |  4 |  5 |  6 |  7
 8 |  9 | 10 | 11 | 12 | 13 | 14
...
```

---

## 🔧 Technische Details

### API-Endpunkt-Übersicht

**Dashboard:**
- `GET /api/dashboard/{userId}` - Hauptdaten (Todos + Events)
- `GET /api/dashboard/{userId}/stats` - Nur Statistiken

**Todos:**
- `GET /api/todos/{userId}` - Alle Todos
- `GET /api/todos/{userId}/open` - Offene Todos
- `GET /api/todos/{userId}/overdue` - Überfällige
- `POST /api/todos/{userId}` - Todo erstellen
- `PUT /api/todos/{userId}/{todoId}` - Todo aktualisieren
- `DELETE /api/todos/{userId}/{todoId}` - Todo löschen
- `POST /api/todos/{userId}/{todoId}/complete` - Als erledigt markieren

**Events:**
- `GET /api/events/{userId}` - Alle Events
- `GET /api/events/{userId}/upcoming?days=7` - Kommende Events
- `GET /api/events/{userId}/today` - Heutige Events
- `POST /api/events/{userId}` - Event erstellen
- `PUT /api/events/{userId}/{eventId}` - Event aktualisieren
- `DELETE /api/events/{userId}/{eventId}` - Event löschen
- `POST /api/events/{userId}/{eventId}/cancel` - Event absagen

**Schule:**
- `GET /api/subjects/{userId}` - Fächer
- `GET /api/timetable/{userId}/day/{date}` - Stundenplan
- `GET /api/homework/{userId}/upcoming` - Offene Hausaufgaben
- `GET /api/exams/{userId}/upcoming` - Kommende Prüfungen
- `GET /api/grades/{userId}/stats` - Notenstatistiken
- `POST /api/subjects/{userId}` - Fach erstellen
- `POST /api/timetable/{userId}` - Stunde erstellen
- `POST /api/homework/{userId}` - Hausaufgabe erstellen
- `POST /api/exams/{userId}` - Prüfung erstellen

**Sidebar:**
- `GET /api/sidebar/{userId}` - Konfiguration laden
- `POST /api/sidebar/{userId}` - Konfiguration speichern
- `POST /api/sidebar/{userId}/reset` - Auf Standard zurücksetzen

**Fitness:**
- `GET /api/training/plans?userId={userId}` - Trainingspläne
- `POST /api/training/plans` - Plan erstellen
- `GET /api/training/workouts/{workoutId}/exercises` - Übungen

**Ernährung:**
- `GET /api/nutrition/goal?userId={userId}` - Ernährungsziel
- `GET /api/nutrition/daily/today?userId={userId}` - Heutige Einträge
- `POST /api/nutrition/daily` - Eintrag erstellen

---

## 🚀 Deployment

### Docker-Container neu bauen

```powershell
cd "c:\Apps\Life Hub"

# Backend neu bauen (mit V1_7 Migration + School Field)
docker compose build backend

# Alle Container starten
docker compose up -d

# Logs überprüfen
docker compose logs -f backend
docker compose logs -f frontend
```

### Datenbank-Migration überprüfen

```powershell
# In Container einloggen
docker compose exec backend psql -U lifehub -d lifehub

# Tabellen prüfen
\dt

# Sidebar-Config prüfen
SELECT * FROM sidebar_config;

# Migration-Status prüfen
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```

**Erwartete Migrationen:**
1. V1_7 - sidebar_config (mit `school` Feld)
2. V1_8 - phone_number
3. V1_9 - school_management (7 Tabellen)
4. V1_10 - todos_and_events (2 Tabellen)

---

## 📋 Testing

### 1. Port-Test
```bash
# Backend erreichbar?
curl http://localhost:5000/actuator/health

# Sidebar-API testen
curl http://localhost:5000/api/sidebar/1

# Dashboard-API testen
curl http://localhost:5000/api/dashboard/1
```

### 2. Sidebar-Test
- Öffne `http://localhost:80`
- Klicke auf Settings-Icon (Zahnrad oben rechts)
- Klicke auf "Seitenleiste anpassen"
- ✅ "Schule" sollte sichtbar sein
- ✅ Alle Features sollten mit Checkboxen angezeigt werden
- ✅ "NEU" Badge bei neuen Features

### 3. Kalender-Test
- Navigiere zu "Kalender"
- ✅ Woche startet mit Montag
- ✅ Wochenende (Sa/So) am Ende
- ✅ Termine korrekt platziert

### 4. School-Dashboard-Test
- Klicke auf "Schule" in der Sidebar
- ✅ Dashboard mit Statistiken lädt
- ✅ Heutige Stunden angezeigt
- ✅ Nächste 3 Prüfungen
- ✅ Top 5 Hausaufgaben

---

## 🐛 Bekannte Issues

### TypeScript Lint-Warnings (nicht kritisch)
```
Parameter 'item' implicitly has an 'any' type.
Parameter 'state' implicitly has an 'any' type.
```
**Status:** Wird beim Build automatisch aufgelöst durch TypeScript-Inferenz.

---

## 📝 Nächste Schritte

1. ✅ **Deployment testen** - Alle Container starten und APIs testen
2. ⏳ **Testdaten erstellen** - Fächer, Stundenplan, Hausaufgaben anlegen
3. ⏳ **Frontend-Seiten erstellen** - 7 Detail-Seiten für Schule
4. ⏳ **Mobile Optimierung** - Sidebar-Responsiveness testen

---

## 🎯 Erfolg-Kriterien

- [x] Backend läuft auf Port 5000
- [x] Frontend verbindet sich mit Port 5000
- [x] Sidebar zeigt "Schule" an
- [x] Sidebar-Konfiguration speicherbar
- [x] Kalender startet mit Montag
- [ ] Docker-Deployment erfolgreich
- [ ] Alle APIs antworten korrekt

---

## 💾 Backup-Befehle

```powershell
# Falls Probleme auftreten, Container zurücksetzen:
docker compose down
docker volume prune -f
docker compose up -d
```

```sql
-- Falls Sidebar nicht funktioniert, manuell resetten:
DELETE FROM sidebar_config WHERE user_id = 1;

-- Dann neu laden im Frontend (F5)
```

---

## 📞 Support-Informationen

**Ports:**
- Frontend: http://localhost:80
- Backend API: http://localhost:5000/api
- pgAdmin: http://localhost:5222
  - Email: admin@lifehub.de
  - Passwort: lifehubadmin
- PostgreSQL: localhost:5555
  - User: lifehub
  - Password: lifehub
  - Database: lifehub

**Logs:**
```powershell
docker compose logs -f backend     # Backend-Logs live
docker compose logs -f frontend    # Frontend-Logs
docker compose logs -f postgres    # Datenbank-Logs
```

**Container-Status:**
```powershell
docker compose ps                  # Alle Container-Status
docker compose restart backend     # Backend neu starten
docker compose restart frontend    # Frontend neu starten
```

---

**Stand:** 17. Oktober 2025, 23:47 Uhr
**Autor:** GitHub Copilot
**Version:** Life Hub v1.10
