# 📁 Life Hub - Projekt-Struktur

## Überblick

```
Life-Hub/
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/lifehub/
│   │   │   │   ├── config/          # Konfiguration
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   └── CorsConfig.java
│   │   │   │   ├── controller/      # REST-Controller
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── TodoController.java
│   │   │   │   │   ├── FitnessController.java
│   │   │   │   │   ├── NoteFolderController.java ✨ NEU
│   │   │   │   │   └── ...
│   │   │   │   ├── model/           # Entities
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Todo.java
│   │   │   │   │   ├── Workout.java
│   │   │   │   │   ├── Note.java    ✨ ERWEITERT
│   │   │   │   │   └── ...
│   │   │   │   ├── repository/      # JPA Repositories
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── TodoRepository.java
│   │   │   │   │   ├── NoteRepository.java ✨ ERWEITERT
│   │   │   │   │   └── ...
│   │   │   │   ├── service/         # Business Logic
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── JwtService.java
│   │   │   │   │   └── ...
│   │   │   │   └── dto/             # Data Transfer Objects
│   │   │   │       ├── LoginRequest.java
│   │   │   │       ├── TreeNode.java ✨ NEU
│   │   │   │       └── ...
│   │   │   └── resources/
│   │   │       ├── application.yml   ✨ JWT-Secret geändert
│   │   │       └── db/
│   │   │           └── migration/
│   │   │               └── V1_0__notes_system_enhancement.sql ✨ NEU
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/              # React-Komponenten
│   │   │   ├── Sidebar.tsx          ✨ Kollabierbar
│   │   │   ├── Header.tsx           ✨ Username + Logout/Settings
│   │   │   ├── TodosPage.tsx        ✨ Komplett neu
│   │   │   ├── FitnessPage.tsx      ✨ NEU
│   │   │   ├── NotesPage.tsx        ✨ NEU (721 Zeilen)
│   │   │   ├── SettingsPage.tsx     ✨ NEU
│   │   │   ├── WeightPage.tsx       ⏳ TODO
│   │   │   ├── MealsPage.tsx        ⏳ TODO
│   │   │   ├── HabitsPage.tsx       ⏳ TODO
│   │   │   ├── BudgetPage.tsx       ⏳ TODO
│   │   │   └── ...
│   │   ├── stores/                  # Zustand State Management
│   │   │   ├── authStore.ts
│   │   │   └── profileStore.ts
│   │   ├── App.tsx                  ✨ Neue Routes
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json                 # Dependencies
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docs/                            # Dokumentation
│   ├── QUICK_START.md              ✨ NEU - Schnellstart
│   ├── DEPLOYMENT_GUIDE.md         ✨ NEU - Deployment
│   ├── NOTES_UPDATE_README.md      ✨ NEU - Notes-System
│   └── TODO.md                     ✨ NEU - Feature Roadmap
│
├── scripts/                        # Installation Scripts
│   ├── install.sh                  ✨ NEU - Bash-Script (Linux/NAS)
│   └── install.ps1                 ✨ NEU - PowerShell-Script
│
├── docker-compose.yml              # Docker-Konfiguration
├── .gitignore
└── README.md                       # Haupt-Dokumentation
```

---

## 🗂️ Datenbank-Schema

### Bestehende Tabellen

```sql
-- Users
users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Todos
todos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(10), -- HIGH, MEDIUM, LOW
    tags VARCHAR(255),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Workouts
workouts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    type VARCHAR(50), -- STRENGTH, CARDIO, FLEXIBILITY
    date DATE NOT NULL,
    duration INTEGER, -- Minuten
    calories INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Exercises
exercises (
    id BIGSERIAL PRIMARY KEY,
    workout_id BIGINT REFERENCES workouts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sets INTEGER,
    reps INTEGER,
    weight DOUBLE PRECISION
)
```

### Erweiterte Tabelle: Notes ✨

```sql
-- Notes (ERWEITERT)
notes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category VARCHAR(50), -- privat, arbeit, schule
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- ✨ NEU
    type VARCHAR(10) DEFAULT 'FILE', -- FILE oder FOLDER
    file_type VARCHAR(10) DEFAULT 'MARKDOWN', -- MARKDOWN oder PDF
    parent_id BIGINT, -- Referenz zum Parent-Ordner
    folder_path VARCHAR(500) -- z.B. /Mathematik/Analysis
)

-- Indexes für Performance
CREATE INDEX idx_notes_parent_id ON notes(parent_id);
CREATE INDEX idx_notes_user_category_type ON notes(user_id, category, type);
CREATE INDEX idx_notes_folder_path ON notes(folder_path);
```

### Geplante Tabellen (TODO)

```sql
-- Weight Entries
weight_entries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    weight DOUBLE PRECISION NOT NULL,
    date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Meals
meals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20), -- BREAKFAST, LUNCH, DINNER, SNACK
    calories INTEGER,
    protein DOUBLE PRECISION,
    carbs DOUBLE PRECISION,
    fats DOUBLE PRECISION,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Habits
habits (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    target_days VARCHAR(50), -- JSON-Array: ["MO", "TU", "WE"]
    start_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Habit Logs
habit_logs (
    id BIGSERIAL PRIMARY KEY,
    habit_id BIGINT REFERENCES habits(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    note TEXT
)

-- Transactions
transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    type VARCHAR(10), -- INCOME, EXPENSE
    category VARCHAR(50),
    amount DOUBLE PRECISION NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    recurring BOOLEAN DEFAULT FALSE,
    recurring_days INTEGER
)

-- Budget Limits
budget_limits (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    category VARCHAR(50),
    limit_amount DOUBLE PRECISION NOT NULL,
    month VARCHAR(7) -- Format: YYYY-MM
)

-- Calendar Events
calendar_events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    category VARCHAR(50),
    color VARCHAR(7), -- Hex-Color
    all_day BOOLEAN DEFAULT FALSE,
    recurring BOOLEAN DEFAULT FALSE,
    recurring_type VARCHAR(20), -- DAILY, WEEKLY, MONTHLY, YEARLY
    recurring_end_date DATE
)
```

---

## 🔧 File Storage Struktur

```
/volume1/docker/Life-Hub-Data/
└── {username}/                   # z.B. Sarkei
    ├── privat/                   # Kategorie: Privat
    │   ├── Ordner1/
    │   │   ├── note1.md
    │   │   └── document.pdf
    │   └── note2.md
    ├── arbeit/                   # Kategorie: Arbeit
    │   ├── Projekt1/
    │   │   ├── meeting_notes.md
    │   │   └── specs.pdf
    │   └── tasks.md
    └── schule/                   # Kategorie: Schule
        ├── Mathematik/           # Fach
        │   ├── Analysis/         # Thema
        │   │   ├── integral.md
        │   │   └── aufgaben.pdf
        │   └── Geometrie/
        │       ├── dreiecke.md
        │       └── formeln.pdf
        ├── Physik/
        │   ├── Mechanik/
        │   │   └── newton.md
        │   └── Thermodynamik/
        └── Informatik/
            ├── Java/
            │   ├── basics.md
            │   └── OOP.md
            └── Python/
```

**Datei-Namensschema:**
- Markdown: `{note_id}.md` (z.B. `123.md`)
- PDF: `{note_id}.pdf` (z.B. `456.pdf`)
- Ordner: `{folder_name}/` (DB: `type='FOLDER'`)

---

## 📦 Dependencies

### Backend (pom.xml)
```xml
<dependencies>
    <!-- Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- PostgreSQL -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "lucide-react": "^0.294.0",
    "react-markdown": "^9.0.1",
    "react-syntax-highlighter": "^15.5.0", // ⏳ TODO: installieren
    "@types/react-syntax-highlighter": "^15.5.11" // ⏳ TODO: installieren
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## 🚀 Deployment-Prozess

### 1. Lokale Entwicklung (Windows)
```powershell
# Backend starten
cd backend
mvn spring-boot:run

# Frontend starten
cd frontend
npm install
npm run dev
```

### 2. Docker Build (auf NAS)
```bash
cd /volume1/docker/Life-Hub

# Container stoppen
docker-compose down

# Neu bauen
docker-compose build --no-cache

# Starten
docker-compose up -d

# Logs ansehen
docker-compose logs -f
```

### 3. Auto-Deploy (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to NAS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy via SSH
        run: |
          ssh user@nas-ip "cd /volume1/docker/Life-Hub && git pull && docker-compose build && docker-compose up -d"
```

---

## 🔑 Environment Variables

### Backend (.env oder application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://postgres:5432/lifehub
    username: lifehub
    password: ${DB_PASSWORD}
  
jwt:
  secret: ${JWT_SECRET}
  expiration: 86400000 # 24 Stunden

storage:
  base-path: /volume1/docker/Life-Hub-Data
```

### Frontend (.env)
```env
VITE_API_URL=http://your-nas-ip:8080
```

---

## 📊 Code-Statistiken

### Backend
- **Java-Dateien:** ~30 Dateien
- **Zeilen Code:** ~3.000 LOC
- **Controller:** 8 (AuthController, TodoController, FitnessController, NoteFolderController, ...)
- **Entities:** 6 (User, Todo, Workout, Exercise, Note, ...)
- **Repositories:** 6

### Frontend
- **React-Komponenten:** ~15 Komponenten
- **Zeilen Code:** ~4.500 LOC
- **Pages:** 
  - Dashboard ✅
  - Login/Register ✅
  - TodosPage ✅ (467 Zeilen)
  - FitnessPage ✅ (545 Zeilen)
  - NotesPage ✅ (721 Zeilen)
  - SettingsPage ✅ (358 Zeilen)
  - WeightPage ⏳ TODO
  - MealsPage ⏳ TODO
  - HabitsPage ⏳ TODO
  - BudgetPage ⏳ TODO
  - CalendarPage ⏳ TODO (teilweise vorhanden)

### Gesamtprojekt
- **Total LOC:** ~7.500 Zeilen
- **Sprachen:** Java, TypeScript, SQL, YAML, Markdown
- **Commits:** (je nach Entwicklungsstand)

---

## 📝 Entwicklungs-Workflow

### Neue Feature hinzufügen

1. **Backend:**
   ```bash
   # Entity erstellen
   backend/src/main/java/com/lifehub/model/NewEntity.java
   
   # Repository erstellen
   backend/src/main/java/com/lifehub/repository/NewRepository.java
   
   # Controller erstellen
   backend/src/main/java/com/lifehub/controller/NewController.java
   
   # Testen via Postman/Insomnia
   ```

2. **Frontend:**
   ```bash
   # Page erstellen
   frontend/src/components/NewPage.tsx
   
   # Route hinzufügen in App.tsx
   <Route path="/new-route" element={<NewPage />} />
   
   # Sidebar-Link hinzufügen in Sidebar.tsx
   ```

3. **Deployment:**
   ```bash
   # Änderungen committen
   git add .
   git commit -m "feat: Add new feature"
   git push
   
   # Auf NAS deployen
   cd /volume1/docker/Life-Hub
   git pull
   docker-compose build
   docker-compose up -d
   ```

---

## 🐛 Debugging

### Backend-Logs
```bash
# Live-Logs
docker-compose logs -f backend

# Letzte 100 Zeilen
docker-compose logs --tail=100 backend

# Fehler filtern
docker-compose logs backend | grep -i error
```

### Frontend-Logs
```bash
# Live-Logs
docker-compose logs -f frontend

# Browser-Console (F12)
# React DevTools installieren
```

### Datenbank-Debugging
```bash
# In Container einloggen
docker exec -it lifehub-db psql -U lifehub -d lifehub

# Tabellen anzeigen
\dt

# Daten abfragen
SELECT * FROM notes WHERE user_id = 1;

# Spalten anzeigen
\d notes
```

---

## 📚 Nützliche Befehle

### Docker
```bash
# Alle Container anzeigen
docker ps

# Container stoppen
docker-compose down

# Container neu starten
docker-compose restart backend

# Container-Logs
docker-compose logs backend

# In Container einloggen
docker exec -it lifehub-backend bash

# Volumes anzeigen
docker volume ls

# Volumes löschen (VORSICHT!)
docker-compose down -v
```

### Git
```bash
# Status prüfen
git status

# Änderungen anzeigen
git diff

# Änderungen stagen
git add .

# Committen
git commit -m "Message"

# Pushen
git push origin main

# Branch erstellen
git checkout -b feature/new-feature

# Branch mergen
git checkout main
git merge feature/new-feature
```

### npm
```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev

# Build für Production
npm run build

# Dependencies aktualisieren
npm update

# Paket hinzufügen
npm install package-name
```

---

**Happy Coding! 🚀**
