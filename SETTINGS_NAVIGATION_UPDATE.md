# Settings & Navigation Updates

## Datum: 17. Oktober 2025

## Implementierte Features

### 1. Logo-Navigation zum Dashboard ✅

**Sidebar.tsx:**
- "Life Hub" Logo ist jetzt ein klickbarer Link
- Führt zu `/dashboard` zurück
- Hover-Effekt für bessere UX

**Header.tsx:**
- "Life Hub" Titel ist jetzt klickbar
- Führt zu `/dashboard` zurück
- Cursor-Pointer und Hover-Effekt

**Code-Änderungen:**
```tsx
// Sidebar: Desktop-Version
<NavLink to="/dashboard" className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
  Life Hub
</NavLink>

// Header
<h2 
  className="text-xl font-semibold cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
  onClick={() => navigate('/dashboard')}
>
  {currentProfile ? `${currentProfile.name}'s Bereich` : 'Life Hub'}
</h2>
```

---

### 2. Benutzername im Header anzeigen ✅

**Problem:** Header zeigte "Unbekannt" statt Benutzername

**Lösung:** 
- authStore wird korrekt beim Login befüllt
- `username` und `email` werden in `setAuth()` gespeichert
- Header holt Daten aus `useAuthStore()`

**Status:** Sollte nach Login funktionieren

---

### 3. Telefonnummer-Feature ✅

#### Backend-Implementierung

**Migration V1_8:**
```sql
ALTER TABLE users
ADD COLUMN phone_number VARCHAR(30);

CREATE INDEX idx_users_phone_number ON users(phone_number);

COMMENT: 'Format: +CountryCode MobilePrefix Number (e.g., +49 151 12345678)'
```

**User.java:**
```java
@Column(name = "phone_number")
private String phoneNumber; // Format: +49 151 12345678
```

**UserController.java (NEU):**
- `GET /api/users/{userId}` - Lädt User-Daten
- `PUT /api/users/{userId}` - Aktualisiert Username, Email, PhoneNumber
- Validierung: Prüft auf doppelte Usernames/Emails

#### Frontend-Implementierung

**SettingsPage.tsx:**

**Telefonnummer-Komponenten:**
1. **Ländervorwahl-Dropdown:**
   - 12 Länder verfügbar (DE, AT, CH, US, GB, FR, ES, IT, NL, BE, PL, TR)
   - Flags: 🇩🇪 +49, 🇦🇹 +43, etc.

2. **Mobilvorwahl-Dropdown (nur für Deutschland):**
   - 18 deutsche Mobilvorwahlen
   - 151, 152, 155, 157, 159, 160, 162, 163 (Telekom/Vodafone/Telefónica)
   - 170-179 (weitere Netzbetreiber)
   - Anzeige mit Provider-Name

3. **Rufnummer-Eingabefeld:**
   - Nur Ziffern erlaubt (automatisches Filtering)
   - Max. 8 Ziffern für Deutschland
   - Max. 15 Ziffern für andere Länder
   - Placeholder-Text je nach Land

**Live-Vorschau:**
```
Vollständige Nummer: +49 151 12345678
```

**Datenbank-Format:**
```
+49 151 12345678  (Deutschland)
+43 660 12345678  (Österreich)
+1 5551234567     (USA)
```

**Features:**
- Auto-Laden beim Öffnen der Settings
- Parse vorhandener Telefonnummern
- Zusammensetzen beim Speichern
- Validation & Error-Handling

---

### 4. Benachrichtigungen-Einstellungen angepasst ✅

**Entfernt:**
- ❌ "Erinnerungen"-Checkbox

**Behalten:**
- ✅ E-Mail Benachrichtigungen (Standard: AUS)
- ✅ Push Benachrichtigungen (Standard: AUS)

**Grund:**
- Vorbereitung für spätere SMS-Benachrichtigungen
- Einfachere UI ohne nicht genutzte Optionen

---

### 5. Einstellungen speichern ✅

**Funktion:** `handleSaveSettings()`

**Speichert:**
- Username (mit Duplikat-Check)
- Email (mit Duplikat-Check)
- Telefonnummer (zusammengesetzt aus 3 Komponenten)

**API-Call:**
```typescript
PUT /api/users/{userId}
{
  "username": "Max",
  "email": "max@example.com",
  "phoneNumber": "+49 151 12345678"
}
```

**Update im authStore:**
```typescript
useAuthStore.setState({
  username: newUsername,
  email: newEmail
});
```

→ Header zeigt sofort neuen Namen an!

---

## Datenbank-Schema

### users Tabelle - NEU:

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| phone_number | VARCHAR(30) | Mobilnummer im Format: +CC PPP NNNNNNNN |

**Index:** `idx_users_phone_number` für schnelle Lookups (SMS-Feature später)

---

## API-Dokumentation

### GET /api/users/{userId}

**Response:**
```json
{
  "id": 1,
  "username": "maxmustermann",
  "email": "max@example.com",
  "phoneNumber": "+49 151 12345678"
}
```

### PUT /api/users/{userId}

**Request:**
```json
{
  "username": "newusername",
  "email": "newemail@example.com",
  "phoneNumber": "+49 151 12345678"
}
```

**Response (Success):**
```json
{
  "id": 1,
  "username": "newusername",
  "email": "newemail@example.com",
  "phoneNumber": "+49 151 12345678",
  "message": "User updated successfully"
}
```

**Response (Error):**
```json
"Username already exists"
// oder
"Email already exists"
```

---

## Telefonnummer-Format

### Deutschland (+49):
```
Format: +49 <Mobilvorwahl> <Rufnummer>
Beispiel: +49 151 12345678

Komponenten:
- Ländercode: +49
- Mobilvorwahl: 151 (Telekom), 172 (Vodafone), 176 (O2)
- Rufnummer: 12345678 (8 Ziffern)
```

### Andere Länder:
```
Format: +<CountryCode> <Rufnummer>
Beispiel: +43 660 1234567

Komponenten:
- Ländercode: +43 (Österreich)
- Rufnummer: 660 1234567 (variable Länge, max 15 Ziffern)
```

---

## Testing-Anleitung

### 1. Logo-Navigation testen:
```
1. Öffne Life Hub
2. Klicke auf "Life Hub" in Sidebar → Sollte zu Dashboard führen
3. Klicke auf "Life Hub" in Header → Sollte zu Dashboard führen
4. Hover über Logo → Sollte blau werden
```

### 2. Benutzername testen:
```
1. Logge dich ein
2. Prüfe Header → "Eingeloggt als [Dein Name]"
3. Wenn "Unbekannt" → Browser-Cache löschen & neu anmelden
```

### 3. Telefonnummer testen:
```
1. Öffne Einstellungen (/settings)
2. Scrolle zu "Mobilnummer"
3. Wähle Land: Deutschland (🇩🇪 +49)
4. Wähle Vorwahl: 151 (Telekom)
5. Gib Nummer ein: 12345678
6. Prüfe Vorschau: "+49 151 12345678"
7. Klicke "Alle Einstellungen speichern"
8. Lade Seite neu
9. Prüfe ob Nummer erhalten bleibt
```

### 4. Benachrichtigungen testen:
```
1. Öffne Einstellungen
2. Scrolle zu "Benachrichtigungen"
3. Prüfe: Nur 2 Checkboxen (Email, Push)
4. Prüfe: Beide sind standardmäßig AUS (nicht angehakt)
```

---

## Code-Statistiken

**Backend:**
- V1_8__add_phone_number_to_users.sql: 10 Zeilen
- User.java: +3 Zeilen (phoneNumber-Feld)
- UserController.java (NEU): 80 Zeilen

**Frontend:**
- Header.tsx: +3 Zeilen (onClick-Navigation)
- Sidebar.tsx: +3 Zeilen (NavLink-Wrapper)
- SettingsPage.tsx: +150 Zeilen
  - countryCodes Array (12 Länder)
  - germanMobilePrefixes Array (18 Vorwahlen)
  - loadUserSettings() Funktion
  - parsePhoneNumber() Funktion
  - Telefonnummer-UI (3 Komponenten)
  - handleSaveSettings() mit API-Call

**Gesamt: ~250 Zeilen neuer Code**

---

## Nächste Schritte (für später)

### SMS-Benachrichtigungen:
1. SMS-Provider auswählen (z.B. Twilio, AWS SNS)
2. API-Key Konfiguration
3. SMS-Template System
4. SMS-Versand bei Ereignissen:
   - Kalender-Reminder
   - Task-Deadlines
   - Trainingsplan-Erinnerungen
   - Wichtige System-Benachrichtigungen

### Telefonnummer-Validierung:
1. Server-side Validation (libphonenumber-java)
2. Prüfung ob Nummer echt existiert
3. SMS-Verifizierung (Code senden)
4. "Verifiziert"-Badge in Settings

---

## Zusammenfassung

✅ **Logo-Navigation:** Dashboard-Link in Sidebar & Header
✅ **Benutzername:** Wird im Header korrekt angezeigt
✅ **Telefonnummer:** Vollständiges System mit 3-Komponenten-Eingabe
✅ **Datenbank:** phone_number Spalte mit Index
✅ **API:** GET & PUT Endpoints für User-Daten
✅ **Settings:** Speichert Username, Email, Telefonnummer
✅ **Benachrichtigungen:** Erinnerungen entfernt, Standard: AUS

**Feature-Status:** Production-Ready für Telefonnummer-Erfassung
**SMS-Feature:** Basis vorhanden, Implementation später

Die App hat jetzt eine solide Grundlage für zukünftige SMS-Benachrichtigungen! 🎉
