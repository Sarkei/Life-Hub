# Life Hub - Umfassendes Update 🚀

## ✅ Implementierte Features

### 1. **Verbesserte Sidebar**
- ✨ Sticky Position (bleibt beim Scrollen sichtbar)
- 🔄 Collapsible mit Toggle-Button (80px ↔ 256px)
- 📝 Neue Bereiche: Notizen, Gewohnheiten, Budget

### 2. **Notizen-System** 📚
**Vollständiges Dokumenten-Management mit:**

#### Backend (Spring Boot):
- `Note.java` - Entity mit Ordnerstruktur-Support
- `NoteFolderController.java` - REST API für alle Operationen
- Datei-basierte Speicherung: `/volume1/docker/Life-Hub-Data/{username}/{category}/`

#### Features:
- **Ordnerbaum**: Beliebig verschachtelte Ordnerstruktur
- **Markdown-Editor**: Mit Rich-Text Toolbar
  - Fett, Kursiv, Überschriften (H1, H2)
  - Listen (normal & nummeriert)
  - Links, Bilder, Zitate, Code-Blocks
  - Live-Vorschau mit Syntax-Highlighting
- **PDF-Support**: Upload, Inline-Viewing im Browser
- **CRUD-Operationen**: Erstellen, Umbenennen, Löschen (Ordner & Dateien)
- **Kategorie-basiert**: Separate Bereiche für Schule, Arbeit, Privat

#### Speicherorte:
```
/volume1/docker/Life-Hub-Data/
├── Sarkei/
│   ├── schule/
│   │   ├── Mathematik/
│   │   │   ├── Analysis/
│   │   │   │   ├── Integral.md
│   │   │   │   └── Skript.pdf
│   │   │   └── Geometrie/
│   │   └── Physik/
│   ├── arbeit/
│   └── privat/
└── {other_user}/
    └── ...
```

### 3. **Weitere neue Funktionen in Sidebar**
- 📊 **Gewohnheiten-Tracker** (Link vorbereitet)
- 💰 **Budget-Tracker** (Link vorbereitet)
- 📝 **Notizen** in allen 3 Bereichen (Schule, Arbeit, Privat)

### 4. **Vollständige Todo-Page**
- Prioritäten (Hoch/Mittel/Niedrig) mit Farbcoding
- Filter nach Status & Priorität
- Fälligkeitsdatum & Tags
- Statistiken-Dashboard
- Bearbeiten & Löschen

### 5. **Fitness-Tracker**
- Workout-Typen (Kraft, Cardio, Flexibilität)
- Übungen mit Sets/Reps/Gewicht
- Statistiken (Workouts, Minuten, Kalorien)
- Notizen pro Workout

### 6. **Einstellungs-Seite**
- Profil-Informationen
- Passwort ändern
- Benachrichtigungen
- Theme & Sprache
- Privatsphäre-Einstellungen
- Konto löschen

## 📦 Installation

### NPM-Pakete installieren:
```bash
cd frontend
npm install react-syntax-highlighter @types/react-syntax-highlighter
```

Oder verwende das bereitgestellte Script:
```bash
cd frontend
npm run install-deps
```

### Auf dem NAS deployen:
```bash
# SSH in NAS
cd /volume1/docker/Life-Hub
git pull
docker-compose build --no-cache backend frontend
docker-compose up -d
```

## 🔧 Backend-Konfiguration

### Neue Endpunkte (`NoteFolderController.java`):
```
GET    /api/notes/folders/tree?category={category}      - Ordnerstruktur laden
POST   /api/notes/folders/create-folder                 - Ordner erstellen
POST   /api/notes/folders/create-note                   - Markdown-Notiz erstellen
POST   /api/notes/folders/upload-pdf                    - PDF hochladen
PUT    /api/notes/folders/update-note/{id}              - Notiz aktualisieren
PUT    /api/notes/folders/rename/{id}                   - Umbenennen
DELETE /api/notes/folders/{id}                          - Löschen
GET    /api/notes/folders/pdf/{id}                      - PDF abrufen
```

### Datenbank-Migration:
Die `Note`-Entity wurde erweitert. Migration nötig:
```sql
ALTER TABLE notes ADD COLUMN type VARCHAR(10) DEFAULT 'FILE';
ALTER TABLE notes ADD COLUMN file_type VARCHAR(10) DEFAULT 'MARKDOWN';
ALTER TABLE notes ADD COLUMN parent_id BIGINT;
ALTER TABLE notes ADD COLUMN folder_path VARCHAR(500);
```

## 🎯 Verwendung

### Notizen-System:
1. Navigiere zu **Schule > Notizen** (oder Arbeit/Privat)
2. **Ordner erstellen**: Klicke "Ordner" Button
3. **Notiz erstellen**: Klicke "Notiz" Button
4. **PDF hochladen**: Klicke "PDF" Button und wähle Datei
5. **Bearbeiten**: Klicke auf Notiz im Baum
6. **Markdown formatieren**: Nutze Toolbar (Fett, Kursiv, etc.)
7. **Vorschau**: Klicke "Vorschau" Button
8. **Speichern**: Klicke "Speichern"

### Markdown-Shortcuts:
- `**text**` - Fett
- `*text*` - Kursiv
- `# Überschrift` - H1
- `## Überschrift` - H2
- `- Item` - Liste
- `1. Item` - Nummerierte Liste
- `` `code` `` - Inline-Code
- ` ```language\ncode\n``` ` - Code-Block mit Syntax-Highlighting

### Ordner-Organisation:
- Erstelle Fachordner (z.B. "Mathematik")
- Erstelle Unterordner (z.B. "Analysis", "Geometrie")
- Speichere Notizen und PDFs in passenden Ordnern
- Alles wird unter `/volume1/docker/Life-Hub-Data/Sarkei/schule/` gespeichert

## 🚀 Nächste Schritte (Optional)

### Noch zu implementieren:
1. **Gewicht-Tracker** (`WeightPage.tsx`)
   - Gewichtsverlauf-Diagramm
   - BMI-Rechner
   - Ziel-Gewicht Tracking

2. **Ernährungs-Tracker** (`MealsPage.tsx`)
   - Mahlzeiten-Log
   - Kalorien-Tracking
   - Makro-Nährstoffe

3. **Gewohnheiten-Tracker** (`HabitsPage.tsx`)
   - Tägliche Gewohnheiten
   - Streak-Tracking
   - Habit-Statistiken

4. **Budget-Tracker** (`BudgetPage.tsx`)
   - Einnahmen/Ausgaben
   - Kategorien
   - Monatsübersicht

5. **Kalender** (vollständige Implementierung)
   - Monats-/Wochen-/Tages-Ansicht
   - Drag & Drop Events
   - Wiederkehrende Termine

## 🐛 Bekannte Einschränkungen

1. **Auth-Check deaktiviert**: Momentan kann jeder ohne Login zugreifen (siehe App.tsx)
2. **Keine Auth-Header**: Müssen für Produktion noch Token aus authStore holen
3. **PDF-Viewer**: Benötigt CORS-Konfiguration für Inline-Viewing
4. **Markdown-Dependencies**: `react-syntax-highlighter` muss noch installiert werden

## 📝 Dateien-Änderungen

### Backend:
- ✅ `Note.java` - Erweitert um Ordnerstruktur
- ✅ `NoteFolderController.java` - NEU - Volle CRUD-API
- ✅ `NoteRepository.java` - Erweitert um `findByParentId`
- ✅ `NoteController.java` - Bestehend (bleibt kompatibel)

### Frontend:
- ✅ `Sidebar.tsx` - Erweitert um neue Links
- ✅ `NotesPage.tsx` - NEU - Vollständiger Editor
- ✅ `App.tsx` - Routen hinzugefügt
- ✅ `TodosPage.tsx` - Vollständig neu implementiert
- ✅ `FitnessPage.tsx` - Vollständig neu implementiert
- ✅ `SettingsPage.tsx` - NEU - Vollständige Seite
- ✅ `Header.tsx` - Logout & Settings funktional
- ✅ `package.json` - Dependencies geprüft

### Noch zu erstellen:
- ⏳ `WeightPage.tsx`
- ⏳ `MealsPage.tsx`
- ⏳ `HabitsPage.tsx`
- ⏳ `BudgetPage.tsx`
- ⏳ `CalendarPage.tsx` (vollständig)
- ⏳ `WorkDashboard.tsx` (vollständig)
- ⏳ `SchoolDashboard.tsx` (vollständig)

## 🎉 Testen

1. **Deployen**:
   ```bash
   cd /volume1/docker/Life-Hub
   git add -A
   git commit -m "feat: Add comprehensive notes system with markdown editor and PDF support"
   git push
   # Auto-deploy läuft automatisch
   ```

2. **Frontend-Test** (lokal):
   ```bash
   cd frontend
   npm install
   npm run dev
   # http://localhost:5173
   ```

3. **Backend-Test**:
   - Starte Backend
   - Teste API: `GET /api/notes/folders/tree?category=schule`
   - Erstelle Ordner/Notizen via Postman oder Frontend

## 💡 Tipps

### Markdown-Editor Features:
- **Split-View**: Bearbeiten und Vorschau gleichzeitig (Toggle "Vorschau")
- **Syntax-Highlighting**: Code-Blocks werden farblich hervorgehoben
- **Auto-Save**: Vergiss nicht zu speichern! (Ctrl+S kommt noch)
- **Keyboard-Shortcuts**: Strg+B = Fett, Strg+I = Kursiv (in Planung)

### Ordner-Best-Practices:
- **Fächer-Ordner**: Mathematik, Physik, Chemie, etc.
- **Themen-Unterordner**: Analysis, Lineare Algebra, etc.
- **Konsistente Benennung**: Keine Sonderzeichen, CamelCase oder snake_case

### Performance:
- PDFs werden nicht in Datenbank gespeichert (nur Pfad)
- Markdown-Dateien sind kleine Textdateien
- Ordnerstruktur wird on-demand geladen

## 🔐 Sicherheit (TODO für Produktion)

- [ ] Auth-Check in App.tsx wieder aktivieren
- [ ] JWT-Token in API-Requests senden
- [ ] CORS für PDF-Viewer konfigurieren
- [ ] File-Upload Validierung (Größe, Typ)
- [ ] Path-Traversal Protection
- [ ] Rate-Limiting für Uploads

Viel Erfolg! 🚀
