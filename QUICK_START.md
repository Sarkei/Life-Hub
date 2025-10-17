# 🚀 Life Hub - Quick Start Guide

## Installation auf dem NAS

### Methode 1: Automatisches Install-Script (Empfohlen)

```bash
# SSH in dein NAS
ssh admin@your-nas-ip

# Zum Projekt-Verzeichnis
cd /volume1/docker/Life-Hub

# Script ausführbar machen
chmod +x install.sh

# Installieren
./install.sh
```

Das Script:
- ✅ Installiert `react-syntax-highlighter` 
- ✅ Erstellt Data-Ordner
- ✅ Führt Datenbank-Migration aus
- ✅ Baut Docker-Container neu
- ✅ Startet die Anwendung

---

### Methode 2: Manuell

#### 1️⃣ Dependencies installieren
```bash
cd /volume1/docker/Life-Hub/frontend
npm install react-syntax-highlighter @types/react-syntax-highlighter
```

#### 2️⃣ Datenbank-Migration
```bash
cd /volume1/docker/Life-Hub
docker exec -i lifehub-db psql -U lifehub -d lifehub < backend/src/main/resources/db/migration/V1_0__notes_system_enhancement.sql
```

Oder manuell via psql:
```bash
docker exec -it lifehub-db psql -U lifehub -d lifehub
```
```sql
ALTER TABLE notes ADD COLUMN IF NOT EXISTS type VARCHAR(10) DEFAULT 'FILE';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS file_type VARCHAR(10) DEFAULT 'MARKDOWN';
ALTER TABLE notes ADD COLUMN IF NOT EXISTS parent_id BIGINT;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS folder_path VARCHAR(500);
CREATE INDEX IF NOT EXISTS idx_notes_parent_id ON notes(parent_id);
```

#### 3️⃣ Docker Container neu bauen
```bash
cd /volume1/docker/Life-Hub
docker-compose down
docker-compose build --no-cache backend frontend
docker-compose up -d
```

#### 4️⃣ Logs überprüfen
```bash
docker-compose logs -f backend
```

---

## 📦 Was ist neu?

### ✨ Notizen-System
- **Ordnerstruktur:** Unbegrenzte Verschachtelung möglich
- **Markdown-Editor:** 13 Formatierungs-Buttons (Bold, Italic, H1-H2, Listen, Links, Bilder, Code)
- **Syntax-Highlighting:** Für Code-Blöcke in Notizen
- **PDF-Support:** Upload und Inline-Viewing
- **Split-View:** Markdown-Vorschau während des Schreibens
- **File Storage:** Dateien werden unter `/volume1/docker/Life-Hub-Data/{username}/{category}/` gespeichert

### 🎨 UI Verbesserungen
- **Kollabierbare Sidebar:** 80px ↔ 256px mit ChevronLeft/Right
- **Sticky Sidebar:** Bleibt beim Scrollen sichtbar
- **Username-Anzeige:** Im Header mit "Eingeloggt als [Username]"
- **Logout-Button:** Funktional mit Navigation zu `/login`
- **Settings-Seite:** 7 Sektionen (Profil, Passwort, Notifications, Theme, Sprache, Privacy, Account löschen)

### 📝 Todo-System
- **Prioritäten:** High 🔴, Medium 🟡, Low 🟢
- **Filter:** Nach Status und Priorität
- **Tags:** Mehrere Tags pro Todo
- **Fälligkeitsdatum:** Mit Kalender-Auswahl
- **Statistiken:** Total, Aktiv, Erledigt, High Priority

### 💪 Fitness-Tracker
- **Workout-Typen:** Strength, Cardio, Flexibility
- **Exercise-Details:** Sets, Reps, Weight
- **Statistiken:** Total Workouts, Minutes, Calories
- **Notizen:** Pro Workout

---

## 🗂️ File Storage Struktur

```
/volume1/docker/Life-Hub-Data/
└── Sarkei/                    # Dein Username
    ├── privat/                # Kategorie: Privat
    │   ├── Ordner1/
    │   │   ├── note1.md
    │   │   └── document.pdf
    │   └── note2.md
    ├── arbeit/                # Kategorie: Arbeit
    │   └── ...
    └── schule/                # Kategorie: Schule
        ├── Mathematik/        # Fach-Ordner
        │   ├── Analysis/      # Themen-Ordner
        │   │   ├── integral.md
        │   │   └── aufgaben.pdf
        │   └── Geometrie/
        │       └── dreiecke.md
        └── Physik/
            └── mechanik.md
```

**Wichtig:** 
- Ordner werden automatisch erstellt
- Dateien haben die Dateiendung `.md` (Markdown) oder `.pdf`
- Ordner-Struktur wird in der Datenbank gespeichert
- Files werden im Dateisystem gespeichert (nicht in DB)

---

## 🛠️ API Endpoints

### Notes/Folders API

| Method | Endpoint | Beschreibung |
|--------|----------|--------------|
| `GET` | `/api/notes/folders/tree?category={category}` | Lädt Ordnerstruktur |
| `POST` | `/api/notes/folders/create-folder` | Erstellt neuen Ordner |
| `POST` | `/api/notes/folders/create-note` | Erstellt Markdown-Notiz |
| `POST` | `/api/notes/folders/upload-pdf` | Lädt PDF hoch |
| `PUT` | `/api/notes/folders/update-note/{id}` | Speichert Notiz |
| `PUT` | `/api/notes/folders/rename/{id}?newName={name}` | Benennt um |
| `DELETE` | `/api/notes/folders/{id}` | Löscht Item |
| `GET` | `/api/notes/folders/pdf/{id}` | Ruft PDF ab |

**Request-Beispiel (Create Folder):**
```json
{
  "name": "Mathematik",
  "category": "schule",
  "parentId": null
}
```

**Request-Beispiel (Create Note):**
```json
{
  "title": "Analysis Notizen",
  "content": "# Integralrechnung\n\n$$\\int_a^b f(x)dx$$",
  "category": "schule",
  "parentId": 123
}
```

---

## 🎯 Verwendung

### 1. Login
- Öffne Browser: `http://your-nas-ip:3000`
- Login mit: Username `Sarkei` und deinem Passwort

### 2. Notizen-Bereich öffnen
- Klicke in der Sidebar auf **"Notizen"** (📝 Icon)
- Wähle Kategorie: **Privat**, **Arbeit** oder **Schule**

### 3. Ordner erstellen
- Klicke auf **"+ Ordner"**
- Name eingeben (z.B. "Mathematik")
- Bei Bedarf Parent-Ordner auswählen
- **Erstellen** klicken

### 4. Notiz erstellen
- Ordner auswählen (wird links markiert)
- Klicke auf **"+ Notiz"**
- Titel eingeben
- **Erstellen** klicken
- Editor öffnet sich

### 5. Markdown schreiben
**Toolbar verwenden:**
- **B** = Fett
- **I** = Kursiv
- **H1** = Überschrift 1
- **H2** = Überschrift 2
- **☰** = Bullet List
- **#** = Numbered List
- **Link** = Link einfügen
- **Bild** = Bild einfügen
- **"** = Zitat
- **</>** = Code-Block

**Markdown-Beispiele:**
```markdown
# Überschrift 1
## Überschrift 2

**Fett** und *kursiv*

- Punkt 1
- Punkt 2

1. Nummeriert 1
2. Nummeriert 2

[Link-Text](https://example.com)

![Bild Alt-Text](https://example.com/image.png)

> Zitat

Inline `code`

```python
def hello():
    print("Hello World")
```

Mathe: $E = mc^2$

$$
\int_a^b f(x)dx = F(b) - F(a)
$$
```

### 6. PDF hochladen
- Ordner auswählen
- Klicke auf **"+ PDF"**
- PDF-Datei auswählen
- PDF wird inline angezeigt

### 7. Umbenennen/Löschen
- Rechtsklick auf Datei/Ordner (oder Hover für Buttons)
- **Rename** oder **Delete** wählen
- Bestätigen

---

## 🔧 Troubleshooting

### Container startet nicht
```bash
# Logs ansehen
docker-compose logs backend
docker-compose logs frontend

# Neu bauen
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Notizen werden nicht gespeichert
```bash
# Ordner-Berechtigungen prüfen
ls -la /volume1/docker/Life-Hub-Data/

# Berechtigungen setzen (falls nötig)
sudo chown -R 1026:100 /volume1/docker/Life-Hub-Data/
```

### Datenbank-Probleme
```bash
# DB-Container prüfen
docker ps | grep postgres

# DB-Logs
docker logs lifehub-db

# Manuell in DB
docker exec -it lifehub-db psql -U lifehub -d lifehub

# Tabellen prüfen
\dt
SELECT * FROM notes LIMIT 5;
```

### TypeScript-Fehler im Frontend
```bash
cd /volume1/docker/Life-Hub/frontend

# Node-Modules löschen und neu installieren
rm -rf node_modules package-lock.json
npm install

# Container neu bauen
cd ..
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

---

## 📚 Weitere Dokumentation

- **DEPLOYMENT_GUIDE.md** - Ausführliche Deployment-Anleitung
- **NOTES_UPDATE_README.md** - Technische Details zum Notizen-System
- **backend/src/main/resources/db/migration/** - Datenbank-Migrationen

---

## ✅ Checkliste

Nach Installation prüfen:

- [ ] Frontend läuft auf Port 3000
- [ ] Backend läuft auf Port 8080
- [ ] Login funktioniert
- [ ] Username wird im Header angezeigt
- [ ] Sidebar ist kollabierbar
- [ ] Settings-Seite erreichbar
- [ ] Notizen-Bereich erreichbar (Privat/Arbeit/Schule)
- [ ] Ordner erstellen funktioniert
- [ ] Notiz erstellen funktioniert
- [ ] Markdown-Toolbar funktioniert
- [ ] Notiz speichern funktioniert
- [ ] PDF-Upload funktioniert
- [ ] PDF wird inline angezeigt
- [ ] Umbenennen funktioniert
- [ ] Löschen funktioniert

---

## 🎉 Fertig!

Dein Life Hub ist jetzt vollständig eingerichtet mit:
- ✅ Notizen-System mit Ordnerstruktur
- ✅ Markdown-Editor mit Syntax-Highlighting
- ✅ PDF-Support
- ✅ Todo-System mit Prioritäten
- ✅ Fitness-Tracker
- ✅ Settings-Seite
- ✅ Kollabierbare Sidebar

**Viel Spaß beim Organisieren! 🚀**
