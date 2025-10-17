# Life Hub - Deployment Guide

## 🚀 Nächste Schritte zum Deployment

### 1. Dependencies installieren

**Auf deinem NAS via SSH:**

```bash
cd /volume1/docker/Life-Hub/frontend
npm install react-syntax-highlighter @types/react-syntax-highlighter
```

### 2. Datenbank-Migration durchführen

**Verbinde dich mit PostgreSQL:**

```bash
# Via Docker
docker exec -it lifehub-db psql -U lifehub -d lifehub

# Oder direkter Zugriff
psql -h localhost -U lifehub -d lifehub
```

**Führe die Migration aus:**

```sql
-- Neue Spalten für Notizen-System
ALTER TABLE notes ADD COLUMN IF NOT EXISTS type VARCHAR(10) DEFAULT 'FILE';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS file_type VARCHAR(10) DEFAULT 'MARKDOWN';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS parent_id BIGINT;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS folder_path VARCHAR(500);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_notes_parent_id ON notes(parent_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_category_type ON notes(user_id, category, type);

-- Bestehende Notizen als FILE markieren
UPDATE notes SET type = 'FILE' WHERE type IS NULL;
UPDATE notes SET file_type = 'MARKDOWN' WHERE file_type IS NULL;
```

### 3. Änderungen committen

```bash
cd /volume1/docker/Life-Hub

# Status prüfen
git status

# Alle Änderungen hinzufügen
git add .

# Commit mit aussagekräftiger Message
git commit -m "feat: Complete notes system with folder structure, markdown editor, and PDF support

- Added NoteFolderController with 8 REST endpoints
- Extended Note entity with type, fileType, parentId, folderPath
- Created NotesPage with folder tree, markdown editor, and toolbar
- Implemented PDF upload and inline viewing
- Added collapsible sidebar with new routes
- Created SettingsPage with comprehensive user preferences
- Enhanced TodosPage with priorities, filters, and statistics
- Implemented FitnessPage with workout tracking
- Fixed JWT authentication (base64 encoded secret)"

# Push to repository
git push origin main
```

### 4. Docker Container neu bauen

```bash
cd /volume1/docker/Life-Hub

# Stoppe laufende Container
docker-compose down

# Baue Container neu (ohne Cache)
docker-compose build --no-cache backend frontend

# Starte Container
docker-compose up -d

# Logs überprüfen
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 5. Testen

**Backend Health Check:**
```bash
curl http://localhost:8080/api/health
```

**Frontend öffnen:**
- Browser: http://dein-nas-ip:3000
- Login mit deinem Account
- Navigiere zu "Notizen" im Sidebar
- Teste Ordner erstellen, Notizen schreiben, PDFs hochladen

---

## 📁 File Storage Struktur

Notizen werden gespeichert unter:
```
/volume1/docker/Life-Hub-Data/
  └── {username}/
      ├── privat/
      │   ├── Ordner1/
      │   │   ├── note1.md
      │   │   └── document.pdf
      │   └── note2.md
      ├── arbeit/
      │   └── ...
      └── schule/
          ├── Mathematik/
          │   ├── Analysis/
          │   │   └── integral.md
          │   └── Geometrie/
          └── Physik/
```

**Wichtig:** Das Backend erstellt automatisch:
- User-Ordner bei erstem Login
- Kategorie-Ordner (privat/arbeit/schule) bei Bedarf
- Unterordner beim Erstellen von Folders

---

## ✅ Implementierte Features

### Notes System
- ✅ Ordnerstruktur mit unbegrenzter Verschachtelung
- ✅ Markdown Editor mit 13 Formatierungs-Buttons
- ✅ Syntax-Highlighting für Code-Blöcke
- ✅ PDF Upload und Inline-Viewing
- ✅ Drag & Drop Support (UI ready)
- ✅ Umbenennen von Dateien/Ordnern
- ✅ Löschen mit Bestätigung
- ✅ Split-View für Markdown-Preview

### UI/UX
- ✅ Kollabierbare Sidebar (80px ↔ 256px)
- ✅ Sticky Sidebar beim Scrollen
- ✅ Username-Anzeige im Header
- ✅ Logout-Funktionalität
- ✅ Settings-Seite mit 7 Sektionen

### Todo-Management
- ✅ Prioritäten (High/Medium/Low)
- ✅ Filter nach Status und Priorität
- ✅ Tags-System
- ✅ Fälligkeitsdatum
- ✅ Statistik-Cards

### Fitness-Tracker
- ✅ Workout-Typen (Strength/Cardio/Flexibility)
- ✅ Exercise-Details (Sets/Reps/Weight)
- ✅ Statistiken (Total, Minutes, Calories)
- ✅ Notes per Workout

---

## 🔧 Bekannte Issues

### TypeScript Warungen (IDE-only)
```
Cannot find module 'react/jsx-runtime'
Cannot find module 'react-syntax-highlighter'
```
**Lösung:** Nach `npm install` verschwinden diese

### CORS für PDF-Viewing
Falls PDFs nicht inline angezeigt werden:
```java
// Backend: SecurityConfig.java
.cors(cors -> cors.configurationSource(request -> {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOriginPatterns(Arrays.asList("*"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(Arrays.asList("*"));
    config.setAllowCredentials(true);
    return config;
}))
```

### Auth-Check deaktiviert
In `App.tsx` ist Auth temporär ausgeschaltet:
```typescript
// TEMPORÄR: Auth-Check deaktiviert für Entwicklung
// const isAuthenticated = !!token && !!user;
const isAuthenticated = true;
```
**Für Production:** Entferne `const isAuthenticated = true;`

---

## 📊 API Endpoints

### Notes API
- `GET /api/notes/folders/tree?category={category}` - Ordnerstruktur laden
- `POST /api/notes/folders/create-folder` - Ordner erstellen
- `POST /api/notes/folders/create-note` - Markdown-Notiz erstellen
- `POST /api/notes/folders/upload-pdf` - PDF hochladen
- `PUT /api/notes/folders/update-note/{id}` - Notiz speichern
- `PUT /api/notes/folders/rename/{id}?newName={name}` - Umbenennen
- `DELETE /api/notes/folders/{id}` - Löschen
- `GET /api/notes/folders/pdf/{id}` - PDF abrufen

---

## 🎯 Nächste Erweiterungen

### Geplante Features
- [ ] **Gewicht-Tracker:** Gewichtsverlauf mit Charts
- [ ] **Ernährung:** Mahlzeiten-Tracker mit Kalorien
- [ ] **Habits:** Gewohnheits-Tracker mit Streaks
- [ ] **Budget:** Einnahmen/Ausgaben-Verwaltung
- [ ] **Calendar:** Vollständige Kalender-Integration
- [ ] **Dashboard-Widgets:** Übersicht aller Bereiche

### Notizen-System Erweiterungen
- [ ] **Search:** Volltextsuche in Notizen
- [ ] **Tags:** Tag-System für Notizen
- [ ] **Favorites:** Favoriten-Markierung
- [ ] **Recent:** Zuletzt geöffnete Notizen
- [ ] **Export:** Markdown/PDF Export
- [ ] **Import:** Bulk-Import von Notizen
- [ ] **Templates:** Vorlagen für Notizen
- [ ] **Sharing:** Notizen teilen (Link/User)

---

## 🐛 Troubleshooting

### Container startet nicht
```bash
# Logs ansehen
docker-compose logs backend
docker-compose logs frontend

# Container neu bauen
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Datenbank-Verbindung fehlschlägt
```bash
# PostgreSQL Container prüfen
docker ps | grep postgres

# Datenbank-Logs
docker logs lifehub-db

# Verbindung testen
docker exec -it lifehub-db psql -U lifehub -d lifehub -c "SELECT 1;"
```

### Frontend zeigt leere Seite
```bash
# Browser-Console öffnen (F12)
# Auf Fehler prüfen

# Frontend-Logs
docker-compose logs frontend

# Node-Module neu installieren
cd /volume1/docker/Life-Hub/frontend
rm -rf node_modules package-lock.json
npm install
```

### Notizen speichern nicht
```bash
# Ordner-Berechtigungen prüfen
ls -la /volume1/docker/Life-Hub-Data/

# Ordner erstellen falls nötig
mkdir -p /volume1/docker/Life-Hub-Data/Sarkei/{privat,arbeit,schule}
chown -R 1026:100 /volume1/docker/Life-Hub-Data/

# Backend-Logs
docker-compose logs backend | grep -i error
```

---

## 📞 Support

Bei Fragen oder Problemen:
1. Logs überprüfen (`docker-compose logs -f`)
2. Browser-Console öffnen (F12)
3. README.md in jeweiligen Ordnern lesen
4. Datenbank-Status prüfen

**Happy Coding! 🚀**
