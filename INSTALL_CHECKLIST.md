# ✅ Life Hub - Installation Checkliste

## 🚀 Vor dem Deployment

### 1. Dateien prüfen
- [ ] Alle neuen Dateien sind vorhanden
  - [ ] `backend/src/main/java/com/lifehub/controller/NoteFolderController.java`
  - [ ] `backend/src/main/resources/db/migration/V1_0__notes_system_enhancement.sql`
  - [ ] `backend/src/main/resources/application.yml` (JWT-Secret geändert)
  - [ ] `frontend/src/components/NotesPage.tsx`
  - [ ] `frontend/src/components/SettingsPage.tsx`
  - [ ] `frontend/src/components/TodosPage.tsx` (neu)
  - [ ] `frontend/src/components/FitnessPage.tsx` (neu)
  - [ ] `frontend/src/components/Sidebar.tsx` (geändert)
  - [ ] `frontend/src/components/Header.tsx` (geändert)
  - [ ] `frontend/src/App.tsx` (neue Routes)
  - [ ] Dokumentation (6 Dateien): UPDATE_SUMMARY.md, QUICK_START.md, DEPLOYMENT_GUIDE.md, NOTES_UPDATE_README.md, TODO.md, PROJECT_STRUCTURE.md
  - [ ] Scripts: install.sh, install.ps1

### 2. Lokale Tests (Optional)
- [ ] Backend kompiliert ohne Fehler
  ```bash
  cd backend
  mvn clean compile
  ```
- [ ] Frontend kompiliert ohne Fehler (nach npm install)
  ```bash
  cd frontend
  npm run build
  ```

---

## 📦 Installation auf NAS

### Schritt 1: Code auf NAS übertragen
- [ ] Via Git Pull:
  ```bash
  ssh admin@your-nas-ip
  cd /volume1/docker/Life-Hub
  git status
  git pull origin main
  ```
- [ ] ODER manuell Files hochladen via Synology File Station

### Schritt 2: Dependencies installieren
- [ ] SSH-Verbindung zum NAS
  ```bash
  ssh admin@your-nas-ip
  ```
- [ ] Zum Projekt navigieren
  ```bash
  cd /volume1/docker/Life-Hub
  ```
- [ ] Frontend Dependencies installieren
  ```bash
  cd frontend
  npm install react-syntax-highlighter @types/react-syntax-highlighter
  cd ..
  ```
- [ ] Erfolgreich installiert prüfen
  ```bash
  cd frontend
  ls node_modules | grep react-syntax-highlighter
  # Output: react-syntax-highlighter
  ```

### Schritt 3: Datenbank-Migration
- [ ] PostgreSQL Container läuft
  ```bash
  docker ps | grep postgres
  ```
- [ ] Migration-File existiert
  ```bash
  ls backend/src/main/resources/db/migration/V1_0__notes_system_enhancement.sql
  ```
- [ ] Migration ausführen
  ```bash
  docker exec -i lifehub-db psql -U lifehub -d lifehub < backend/src/main/resources/db/migration/V1_0__notes_system_enhancement.sql
  ```
- [ ] Erfolg prüfen (sollte "ALTER TABLE" Meldungen zeigen)

- [ ] ODER manuell via psql:
  ```bash
  docker exec -it lifehub-db psql -U lifehub -d lifehub
  ```
  ```sql
  \d notes
  -- Prüfe ob neue Spalten existieren: type, file_type, parent_id, folder_path
  \q
  ```

### Schritt 4: Data-Ordner erstellen
- [ ] User-Ordner erstellen
  ```bash
  mkdir -p /volume1/docker/Life-Hub-Data/Sarkei/{privat,arbeit,schule}
  ```
- [ ] Berechtigungen setzen (falls nötig)
  ```bash
  sudo chown -R 1026:100 /volume1/docker/Life-Hub-Data/
  ls -la /volume1/docker/Life-Hub-Data/
  ```

### Schritt 5: Docker Container neu bauen
- [ ] Container stoppen
  ```bash
  cd /volume1/docker/Life-Hub
  docker-compose down
  ```
- [ ] Images neu bauen (ohne Cache!)
  ```bash
  docker-compose build --no-cache backend frontend
  ```
- [ ] Erfolg prüfen (sollte "Successfully built" zeigen)

- [ ] Container starten
  ```bash
  docker-compose up -d
  ```
- [ ] Status prüfen
  ```bash
  docker-compose ps
  # Alle 3 Container sollten "Up" sein
  ```

### Schritt 6: Logs überprüfen
- [ ] Backend-Logs prüfen
  ```bash
  docker-compose logs --tail=50 backend
  ```
- [ ] Auf Fehler achten:
  - [ ] Keine "ERROR" Meldungen
  - [ ] Keine "Exception" Meldungen
  - [ ] "Started LifeHubApplication" sollte erscheinen

- [ ] Frontend-Logs prüfen
  ```bash
  docker-compose logs --tail=20 frontend
  ```

---

## 🧪 Funktionalität testen

### Test 1: Login
- [ ] Browser öffnen: `http://your-nas-ip:3000`
- [ ] Login-Seite wird angezeigt
- [ ] Mit deinem Account einloggen
- [ ] Erfolgreich eingeloggt (kein JWT-Fehler!)
- [ ] Username wird im Header angezeigt: "Eingeloggt als Sarkei"

### Test 2: Sidebar
- [ ] Sidebar ist sichtbar (linke Seite)
- [ ] Toggle-Button (ChevronLeft/Right) ist sichtbar
- [ ] Klick auf Toggle → Sidebar kollabiert auf 80px
- [ ] Klick erneut → Sidebar erweitert auf 256px
- [ ] Neue Links sind sichtbar:
  - [ ] 📝 Notizen (Privat)
  - [ ] 💪 Fitness
  - [ ] ✅ Todos
  - [ ] 📊 Gewicht (evtl. noch TODO)
  - [ ] 🍽️ Ernährung (evtl. noch TODO)
  - [ ] 🎯 Gewohnheiten (evtl. noch TODO)
  - [ ] 💰 Budget (evtl. noch TODO)
  - [ ] 📅 Kalender
  - [ ] Arbeit-Sektion mit Notizen
  - [ ] Schule-Sektion mit Notizen

### Test 3: Header
- [ ] Username wird angezeigt
- [ ] Settings-Button (⚙️) ist sichtbar
- [ ] Klick auf Settings → Navigiert zu `/settings`
- [ ] Logout-Button ist sichtbar
- [ ] Klick auf Logout → Navigiert zu `/login`

### Test 4: Settings-Seite
- [ ] Navigiere zu Settings (⚙️ Button)
- [ ] 7 Sektionen werden angezeigt:
  - [ ] Profil-Informationen (Username, Email, ID)
  - [ ] Passwort ändern
  - [ ] Benachrichtigungen (3 Toggles)
  - [ ] Erscheinungsbild (Theme-Auswahl)
  - [ ] Sprache & Region (Dropdown)
  - [ ] Datenschutz (3 Toggles)
  - [ ] Account löschen (mit Checkbox)

### Test 5: Todo-System
- [ ] Navigiere zu Todos (✅ in Sidebar)
- [ ] Statistiken werden angezeigt (Total, Aktiv, Erledigt, High Priority)
- [ ] Sample-Todos sind sichtbar
- [ ] Klick auf "Neues Todo" → Modal öffnet sich
- [ ] Todo erstellen mit:
  - [ ] Titel: "Test-Todo"
  - [ ] Priorität: High (🔴)
  - [ ] Tag: "test"
  - [ ] Fälligkeitsdatum: Morgen
- [ ] Todo wird in Liste angezeigt
- [ ] Filter funktioniert (Status, Priorität)
- [ ] Checkbox zum Abhaken funktioniert
- [ ] Bearbeiten funktioniert
- [ ] Löschen funktioniert

### Test 6: Fitness-Tracker
- [ ] Navigiere zu Fitness (💪 in Sidebar)
- [ ] Statistiken werden angezeigt
- [ ] Sample-Workouts sind sichtbar
- [ ] Klick auf "Neues Workout" → Modal öffnet sich
- [ ] Workout erstellen mit:
  - [ ] Datum: Heute
  - [ ] Typ: Strength
  - [ ] Duration: 60 Min
  - [ ] Calories: 400
  - [ ] Exercise: Bankdrücken, 4 Sets, 10 Reps, 80kg
- [ ] Workout wird in Liste angezeigt
- [ ] Statistiken werden aktualisiert
- [ ] Löschen funktioniert

### Test 7: Notizen-System (WICHTIGSTER TEST!)

#### 7.1 Navigation
- [ ] Navigiere zu "Notizen" → "Schule" in Sidebar
- [ ] NotesPage wird angezeigt
- [ ] Linke Seite: Folder-Tree (leer oder mit bestehenden Ordnern)
- [ ] Rechte Seite: "Wähle eine Notiz oder erstelle eine neue"
- [ ] Header-Buttons: "+ Ordner", "+ Notiz", "+ PDF"

#### 7.2 Ordner erstellen
- [ ] Klick auf "+ Ordner"
- [ ] Modal öffnet sich: "Neuen Ordner erstellen"
- [ ] Name eingeben: "Mathematik"
- [ ] Parent: (leer lassen für Root-Level)
- [ ] Klick "Erstellen"
- [ ] Modal schließt sich
- [ ] "Mathematik"-Ordner erscheint im Folder-Tree
- [ ] 📁-Icon ist sichtbar

#### 7.3 Unterordner erstellen
- [ ] Klick auf "Mathematik" → wird markiert (blauer Hintergrund)
- [ ] Klick auf "+ Ordner"
- [ ] Name eingeben: "Analysis"
- [ ] Parent ist automatisch "Mathematik"
- [ ] Klick "Erstellen"
- [ ] "Analysis"-Ordner erscheint unter "Mathematik" (eingerückt)
- [ ] ChevronDown-Icon bei "Mathematik" zum Expandieren

#### 7.4 Notiz erstellen
- [ ] Klick auf "Analysis" → wird markiert
- [ ] Klick auf "+ Notiz"
- [ ] Modal öffnet sich: "Neue Notiz erstellen"
- [ ] Titel eingeben: "Integralrechnung"
- [ ] Klick "Erstellen"
- [ ] Modal schließt sich
- [ ] "Integralrechnung"-Notiz erscheint unter "Analysis"
- [ ] 📄-Icon ist sichtbar
- [ ] Rechte Seite: Markdown-Editor öffnet sich

#### 7.5 Markdown-Editor
- [ ] Toolbar mit 13 Buttons ist sichtbar:
  - [ ] B (Bold)
  - [ ] I (Italic)
  - [ ] H1
  - [ ] H2
  - [ ] ☰ (Bullet List)
  - [ ] # (Numbered List)
  - [ ] 🔗 (Link)
  - [ ] 🖼️ (Bild)
  - [ ] " (Zitat)
  - [ ] </> (Code)
  - [ ] 📊 (Tabelle)
  - [ ] ✅ (Checklist)
  - [ ] ⚡ (Formel)

- [ ] Text eingeben:
  ```markdown
  # Integralrechnung
  
  ## Definition
  Das **Integral** ist die Umkehrung der Ableitung.
  
  ## Formel
  $$\int_a^b f(x)dx = F(b) - F(a)$$
  
  ## Code-Beispiel
  ```python
  def integral(f, a, b):
      return F(b) - F(a)
  ```
  
  ## Aufgaben
  - [ ] Aufgabe 1
  - [ ] Aufgabe 2
  ```

- [ ] Toolbar-Buttons testen:
  - [ ] Text markieren → **B** klicken → Text wird fett: `**Text**`
  - [ ] Text markieren → *I* klicken → Text wird kursiv: `*Text*`
  - [ ] Cursor auf Zeile → H1 klicken → `# ` wird eingefügt
  - [ ] Code-Button klicken → Code-Block wird eingefügt

- [ ] Split-View testen:
  - [ ] Toggle "Split View" (falls vorhanden)
  - [ ] Vorschau erscheint rechts neben Editor
  - [ ] Syntax-Highlighting funktioniert (Python-Code ist farbig)
  - [ ] LaTeX-Formel wird gerendert (Integral-Symbol)

- [ ] Speichern testen:
  - [ ] Klick "Speichern" (💾)
  - [ ] "Gespeichert!"-Meldung erscheint kurz
  - [ ] Notiz neu laden → Inhalt ist noch da

#### 7.6 PDF hochladen
- [ ] Klick auf "Mathematik"-Ordner
- [ ] Klick "+ PDF"
- [ ] File-Input öffnet sich
- [ ] PDF-Datei auswählen (max 10MB)
- [ ] Upload-Progress (falls vorhanden)
- [ ] PDF erscheint im Folder-Tree mit 📄-Icon
- [ ] Klick auf PDF → PDF wird inline angezeigt (rechte Seite)

#### 7.7 Umbenennen
- [ ] Hover über "Analysis"-Ordner
- [ ] ✏️-Icon erscheint
- [ ] Klick auf ✏️
- [ ] Prompt öffnet sich: "Neuen Namen eingeben"
- [ ] Namen ändern zu: "Analysis I"
- [ ] Enter → Ordner wird umbenannt

#### 7.8 Löschen
- [ ] Hover über Test-Notiz
- [ ] 🗑️-Icon erscheint
- [ ] Klick auf 🗑️
- [ ] Confirm-Dialog: "Wirklich löschen?"
- [ ] Klick "Ja" → Notiz wird gelöscht
- [ ] Notiz verschwindet aus Tree

#### 7.9 File-System Verifikation
- [ ] SSH zum NAS
  ```bash
  cd /volume1/docker/Life-Hub-Data/Sarkei/schule
  ls -R
  ```
- [ ] Ordner "Mathematik/" existiert
- [ ] Unterordner "Analysis/" existiert
- [ ] Datei "123.md" (oder ähnliche ID) existiert
- [ ] PDF-Datei existiert

#### 7.10 Datenbank Verifikation
- [ ] SSH zum NAS
  ```bash
  docker exec -it lifehub-db psql -U lifehub -d lifehub
  ```
  ```sql
  SELECT id, title, type, file_type, parent_id, folder_path, category 
  FROM notes 
  WHERE user_id = (SELECT id FROM users WHERE username = 'Sarkei')
  ORDER BY id;
  ```
- [ ] "Mathematik" ist vorhanden mit `type='FOLDER'`
- [ ] "Analysis" ist vorhanden mit `type='FOLDER'`, `parent_id` zeigt auf Mathematik
- [ ] "Integralrechnung" ist vorhanden mit `type='FILE'`, `file_type='MARKDOWN'`
- [ ] PDF ist vorhanden mit `type='FILE'`, `file_type='PDF'`
- [ ] `folder_path` ist korrekt gesetzt (z.B. `/Mathematik/Analysis`)

---

## 🎉 Nach erfolgreichen Tests

### Alle Tests bestanden?
- [ ] Login funktioniert ✅
- [ ] JWT-Fehler ist behoben ✅
- [ ] Sidebar kollabiert/erweitert ✅
- [ ] Username wird angezeigt ✅
- [ ] Logout funktioniert ✅
- [ ] Settings-Seite vollständig ✅
- [ ] Todos mit Prioritäten ✅
- [ ] Fitness-Tracker funktioniert ✅
- [ ] Notizen: Ordner erstellen ✅
- [ ] Notizen: Unterordner erstellen ✅
- [ ] Notizen: Markdown schreiben ✅
- [ ] Notizen: Syntax-Highlighting ✅
- [ ] Notizen: Speichern ✅
- [ ] Notizen: PDF hochladen ✅
- [ ] Notizen: Umbenennen ✅
- [ ] Notizen: Löschen ✅
- [ ] Files im Dateisystem ✅
- [ ] Einträge in Datenbank ✅

### Dann:
✅ **ALLES FUNKTIONIERT!** 🎉🚀

---

## 🐛 Falls Fehler auftreten

### TypeScript-Fehler in IDE
**Problem:** `Cannot find module 'react-syntax-highlighter'`
**Lösung:** 
```bash
cd frontend
npm install react-syntax-highlighter @types/react-syntax-highlighter
```

### Notizen werden nicht gespeichert
**Problem:** `java.nio.file.NoSuchFileException`
**Lösung:**
```bash
mkdir -p /volume1/docker/Life-Hub-Data/Sarkei/{privat,arbeit,schule}
sudo chown -R 1026:100 /volume1/docker/Life-Hub-Data/
```

### PDF wird nicht angezeigt
**Problem:** CORS-Fehler in Browser-Console
**Lösung:** Backend CORS-Config prüfen, evtl. `application.yml` anpassen

### Container startet nicht
**Problem:** `docker-compose up -d` schlägt fehl
**Lösung:**
```bash
docker-compose logs backend
# Fehler analysieren
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Migration schlägt fehl
**Problem:** `ERROR: column "type" already exists`
**Lösung:** Migration wurde bereits ausgeführt, überspringen

---

## 📝 Notizen

### Wichtige Pfade
- **Projekt:** `/volume1/docker/Life-Hub`
- **Data:** `/volume1/docker/Life-Hub-Data/Sarkei/`
- **Backend-Logs:** `docker-compose logs backend`
- **Frontend-Logs:** `docker-compose logs frontend`
- **DB:** `docker exec -it lifehub-db psql -U lifehub -d lifehub`

### Wichtige Befehle
```bash
# Status prüfen
docker-compose ps

# Logs live
docker-compose logs -f

# Neu starten
docker-compose restart backend

# Neu bauen
docker-compose build --no-cache

# Container stoppen
docker-compose down

# Container + Volumes löschen (VORSICHT!)
docker-compose down -v
```

---

**Happy Testing! 🧪🚀**

Bei Erfolg: Genieße dein vollwertiges Notizen-Management-System! 📝✨
