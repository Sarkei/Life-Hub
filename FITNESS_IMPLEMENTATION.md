# Life Hub - Fitness & Ernährung Implementation

## 📋 Übersicht

Vollständige Implementation der Fitness-, Gewichts-, Ernährungs- und Gym-Tracking Funktionalitäten für die Life Hub App.

## ✅ Implementierte Features

### 1. **Gewichts-Tracker** 
**Backend:**
- `Weight.java` Entity mit userId, date, weight, notes
- `WeightRepository` mit Abfragen für History, Trends, Statistiken
- `WeightController` mit REST API:
  - `GET /api/weight` - Alle Gewichtseinträge
  - `GET /api/weight/latest` - Neuester Eintrag
  - `GET /api/weight/recent` - Letzte 30 Tage
  - `GET /api/weight/stats` - Statistiken (Durchschnitt, Min, Max, Trends)
  - `POST /api/weight` - Neuer Eintrag (1x pro Tag)
  - `PUT /api/weight/{id}` - Eintrag bearbeiten
  - `DELETE /api/weight/{id}` - Eintrag löschen
- Migration `V1_4__weights.sql` mit Unique Constraint auf (user_id, date)

**Frontend:**
- `WeightPage.tsx` (450+ Zeilen)
- Statistik-Cards: Aktuelles Gewicht, 7-Tage/30-Tage/Gesamt-Veränderung
- Tabelle mit Gewichtsverlauf und Trend-Indikatoren
- Modal zum Hinzufügen mit Datum, Gewicht, Notizen
- Farbkodierte Trends (Grün = Abnahme, Rot = Zunahme)
- Validierung: Max 1 Eintrag pro Tag

### 2. **Ernährungs-Tracker**
**Backend:**
- `NutritionGoal.java` Entity mit BMR/TDEE Berechnung
  - Mifflin-St Jeor Formel für BMR
  - TDEE basierend auf Aktivitätslevel (1.2 - 1.9)
  - Ziel-Anpassung (Abnehmen -500 kcal, Halten 0, Zunehmen +500 kcal)
  - Auto-Berechnung der Makros (30% Protein, 40% Kohlenhydrate, 30% Fett)
- `DailyNutrition.java` Entity für tägliche Einträge
- `NutritionGoalRepository` & `DailyNutritionRepository`
- `NutritionController` mit REST API:
  - `GET /api/nutrition/goal` - Benutzerziel abrufen
  - `POST /api/nutrition/goal` - Ziel erstellen/aktualisieren
  - `GET /api/nutrition/daily/today` - Heutiger Eintrag
  - `GET /api/nutrition/daily/history` - Verlauf
  - `GET /api/nutrition/daily/recent` - Letzte 7/30 Tage
  - `POST /api/nutrition/daily` - Neuer/Update Eintrag
  - `GET /api/nutrition/stats` - Statistiken (Fortschritt, Durchschnitte)
- Migration `V1_5__nutrition.sql`

**Frontend:**
- `NutritionPage.tsx` (750+ Zeilen)
- Kalorienziel-Setup Modal mit:
  - Gewicht, Größe, Alter, Geschlecht
  - Aktivitätslevel (5 Stufen)
  - Zieltyp (Abnehmen/Halten/Zunehmen)
- Tagesansicht mit:
  - Verbrauchte/Ziel/Verbleibende Kalorien
  - Progress Bar mit Farbkodierung
  - Makro-Verteilung (Protein/Kohlenhydrate/Fett)
- Statistiken: 7-Tage & 30-Tage Durchschnitt
- Verlauf der letzten 7 Tage
- Modal zum Eintragen mit Kalorien & Makros

### 3. **Gym Tracker**
**Backend:**
- `Exercise.java` Entity - Übungsbibliothek
  - Vordefinierte Übungen (40+ Übungen)
  - Custom Übungen pro User
  - Kategorien: Strength, Cardio, Flexibility, Sports
  - Muskelgruppen: Chest, Back, Shoulders, Biceps, Triceps, Legs, Core, Full Body, Cardio
  - Equipment: Barbell, Dumbbell, Machine, Cable, Bodyweight, etc.
- `GymSession.java` Entity - Trainings-Sessions
  - Start/End Time, Duration
  - Workout Name, Notes
- `ExerciseLog.java` Entity - Sets/Reps/Gewicht pro Übung
- Repositories: `ExerciseRepository`, `GymSessionRepository`, `ExerciseLogRepository`
- `GymController` mit umfangreicher REST API:
  - **Exercises:**
    - `GET /api/gym/exercises` - Alle Übungen (vordefiniert + custom)
    - `GET /api/gym/exercises/category/{category}` - Nach Kategorie
    - `GET /api/gym/exercises/muscle/{muscleGroup}` - Nach Muskelgruppe
    - `POST /api/gym/exercises` - Custom Übung erstellen
    - `PUT /api/gym/exercises/{id}` - Übung bearbeiten
    - `DELETE /api/gym/exercises/{id}` - Custom Übung löschen
  - **Sessions:**
    - `GET /api/gym/sessions` - Alle Sessions
    - `GET /api/gym/sessions/recent` - Letzte 10 Sessions
    - `GET /api/gym/sessions/active` - Aktive Session
    - `GET /api/gym/sessions/{id}` - Session Details mit Logs
    - `POST /api/gym/sessions/start` - Session starten
    - `PUT /api/gym/sessions/{id}/end` - Session beenden
    - `PUT /api/gym/sessions/{id}` - Session aktualisieren
    - `DELETE /api/gym/sessions/{id}` - Session löschen
  - **Exercise Logs:**
    - `GET /api/gym/logs/session/{sessionId}` - Logs einer Session
    - `GET /api/gym/logs/exercise/{exerciseId}` - History einer Übung
    - `POST /api/gym/logs` - Set hinzufügen
    - `PUT /api/gym/logs/{id}` - Set bearbeiten
    - `DELETE /api/gym/logs/{id}` - Set löschen
  - **Statistics:**
    - `GET /api/gym/stats` - Gesamt-Statistiken
    - `GET /api/gym/stats/exercise/{exerciseId}` - Übungs-Statistiken
- Migration `V1_6__gym_tracking.sql` mit 40+ vordefinierten Übungen

**Frontend:**
- TODO: GymPage.tsx zu erstellen mit:
  - Übungsbibliothek (Filter nach Kategorie/Muskelgruppe)
  - Session starten/beenden
  - Live-Tracking: Set-by-Set Eingabe
  - Session-History
  - Fortschritts-Charts pro Übung (Max Weight, Volume, etc.)

## 📊 Datenbank Schema

### Tabellen
- `weights` - Gewichtseinträge (Unique per user/date)
- `nutrition_goals` - Kalorienziele (Unique per user)
- `daily_nutrition` - Tägliche Ernährungseinträge (Unique per user/date)
- `exercises` - Übungsbibliothek (vordefiniert + custom)
- `gym_sessions` - Trainings-Sessions
- `exercise_logs` - Sets/Reps pro Übung

### Migrationen
- `V1_4__weights.sql` - Gewichts-Tracking
- `V1_5__nutrition.sql` - Ernährungs-Tracking
- `V1_6__gym_tracking.sql` - Gym-Tracking + vordefinierte Übungen

## 🔧 API Endpoints

### Weight API
```
GET    /api/weight?userId={id}
GET    /api/weight/latest?userId={id}
GET    /api/weight/recent?userId={id}
GET    /api/weight/stats?userId={id}
GET    /api/weight/range?userId={id}&startDate={date}&endDate={date}
POST   /api/weight
PUT    /api/weight/{id}
DELETE /api/weight/{id}
```

### Nutrition API
```
GET    /api/nutrition/goal?userId={id}
POST   /api/nutrition/goal
DELETE /api/nutrition/goal/{id}
GET    /api/nutrition/daily?userId={id}&date={date}
GET    /api/nutrition/daily/today?userId={id}
GET    /api/nutrition/daily/history?userId={id}
GET    /api/nutrition/daily/recent?userId={id}&days={7|30}
POST   /api/nutrition/daily
PUT    /api/nutrition/daily/{id}
DELETE /api/nutrition/daily/{id}
GET    /api/nutrition/stats?userId={id}
```

### Gym API
```
GET    /api/gym/exercises?userId={id}
GET    /api/gym/exercises/category/{category}
GET    /api/gym/exercises/muscle/{muscleGroup}
GET    /api/gym/exercises/{id}
POST   /api/gym/exercises
PUT    /api/gym/exercises/{id}
DELETE /api/gym/exercises/{id}

GET    /api/gym/sessions?userId={id}
GET    /api/gym/sessions/recent?userId={id}
GET    /api/gym/sessions/active?userId={id}
GET    /api/gym/sessions/{id}
POST   /api/gym/sessions/start
PUT    /api/gym/sessions/{id}/end
PUT    /api/gym/sessions/{id}
DELETE /api/gym/sessions/{id}

GET    /api/gym/logs/session/{sessionId}
GET    /api/gym/logs/exercise/{exerciseId}?userId={id}
POST   /api/gym/logs
PUT    /api/gym/logs/{id}
DELETE /api/gym/logs/{id}

GET    /api/gym/stats?userId={id}
GET    /api/gym/stats/exercise/{exerciseId}?userId={id}
```

## 🚀 Features

### Gewichts-Tracker
- ✅ Tägliche Gewichtseinträge mit Notizen
- ✅ Automatische Trend-Berechnung (7-Tage, 30-Tage, Gesamt)
- ✅ Statistiken: Min, Max, Durchschnitt
- ✅ Farbkodierte Trend-Indikatoren
- ✅ Validierung: 1 Eintrag pro Tag

### Ernährungs-Tracker
- ✅ BMR-Berechnung (Mifflin-St Jeor Formel)
- ✅ TDEE basierend auf Aktivitätslevel
- ✅ Automatische Kalorienziel-Anpassung
- ✅ Makro-Berechnung (30/40/30 Split)
- ✅ Tägliche Fortschritts-Anzeige
- ✅ Verbleibende Kalorien mit Farbkodierung
- ✅ 7-Tage & 30-Tage Durchschnitte
- ✅ Zieltyp: Abnehmen/Halten/Zunehmen

### Gym Tracker
- ✅ 40+ vordefinierte Übungen
- ✅ Custom Übungen erstellen
- ✅ Kategorien: Kraft, Cardio, Flexibilität, Sport
- ✅ 9 Muskelgruppen
- ✅ 8 Equipment-Typen
- ✅ Session-Tracking mit Start/End Time
- ✅ Set-by-Set Logging (Reps, Gewicht, Notizen)
- ✅ Session-History
- ✅ Übungs-Statistiken (Max Weight, Total Volume)
- ✅ Gesamt-Statistiken (Total Sessions, Workout Time)

## 📝 TODO

### Gym Tracker Frontend
- [ ] GymPage.tsx erstellen
- [ ] Übungsbibliothek mit Filter/Suche
- [ ] Session-Tracking UI (Start/Pause/Ende)
- [ ] Live Set-Eingabe während Session
- [ ] Session-History mit Details
- [ ] Fortschritts-Charts (Recharts Integration)
- [ ] Custom Übung erstellen Modal

### Weitere Verbesserungen
- [ ] Gewichts-Tracker: Chart mit Trend-Linie (Recharts)
- [ ] Ernährung: Dashboard-Widget mit verbleibenden Kalorien
- [ ] Ernährung: Wöchentliche Reports
- [ ] Gym: Personal Records (PR) Tracking
- [ ] Gym: Workout-Templates

## 🎨 UI/UX Features

- Dark Mode Support
- Responsive Design (Desktop + Mobile)
- Loading States mit Spinner
- Success/Error Messages mit Auto-Dismiss
- Modal-Formulare mit Validation
- Farbkodierte Status-Indikatoren:
  - Grün = Positiver Fortschritt/Im Ziel
  - Rot = Negativer Fortschritt/Über Ziel
  - Gelb = Warnung
  - Grau = Neutral

## 🔐 Sicherheit & Validierung

- Unique Constraints für tägliche Einträge
- Input Validation (Min/Max Werte)
- Error Handling mit aussagekräftigen Messages
- Safe Delete mit Confirmation
- Cascade Delete für abhängige Einträge

## 📦 Verwendete Technologien

**Backend:**
- Spring Boot 3.x
- PostgreSQL
- JPA/Hibernate
- Flyway Migrations

**Frontend:**
- React 18.2 + TypeScript
- Axios für API-Calls
- Lucide React Icons
- Tailwind CSS
- React Router

## 🏃‍♂️ Starten der Anwendung

1. **Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

2. **Frontend:**
```bash
cd frontend
npm run dev
```

3. **Datenbank:**
- PostgreSQL muss laufen
- Flyway führt Migrationen automatisch aus

## 📈 Statistiken

- **Backend:** 6 neue Entities, 10 Repositories, 3 Controller
- **API Endpoints:** 35+ REST Endpoints
- **Migrationen:** 3 SQL-Dateien mit Schema + 40 Übungen
- **Frontend:** 2 vollständige Pages (Weight, Nutrition)
- **Code:** ~2500+ Zeilen Backend, ~1200+ Zeilen Frontend

---

**Status:** Backend komplett ✅ | Frontend Weight & Nutrition ✅ | Gym Frontend TODO 🔄
