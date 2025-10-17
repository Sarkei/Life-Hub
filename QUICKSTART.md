# Life Hub - Schnellstart-Anleitung

## 🚀 Schnellstart mit Docker

Der einfachste Weg, die App zu starten:

```powershell
# 1. Repository klonen oder in Ordner navigieren
cd "C:\Apps\Life Hub"

# 2. Mit Docker Compose starten
docker-compose up -d

# 3. Warten bis alles läuft (ca. 2-3 Minuten)
# Backend: http://localhost:8080
# Frontend: http://localhost:80
```

## 🛠️ Lokale Entwicklung

### Backend (Spring Boot)

```powershell
# PostgreSQL starten (wenn nicht schon läuft)
docker run -d -p 5432:5432 -e POSTGRES_DB=lifehub -e POSTGRES_USER=lifehub -e POSTGRES_PASSWORD=lifehub --name lifehub-db postgres:16-alpine

# Backend starten
./mvnw spring-boot:run

# Oder mit Maven Wrapper (Windows)
mvnw.cmd spring-boot:run
```

### Frontend (React + Vite)

```powershell
# In Frontend-Ordner navigieren
cd frontend

# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Öffnet: http://localhost:3000
```

## 📋 Erste Schritte

1. **Registrieren**: Gehe zu http://localhost:3000/register
2. **Profil erstellen**: Navigiere zu "Profile" und erstelle dein erstes Profil
3. **Bereich wählen**: Wähle zwischen Privat, Arbeit oder Schule
4. **Loslegen**: Erstelle Todos, Kalendereinträge, tracke Fitness und mehr!

## 🔑 Standard-Zugangsdaten (Entwicklung)

- **Datenbank**: 
  - Host: localhost:5432
  - DB: lifehub
  - User: lifehub
  - Password: lifehub

## 🎨 Features

### ✅ Implementiert
- User Authentication (JWT)
- Multi-Profil-System
- 3 Bereiche: Privat, Arbeit, Schule
- Todo-Listen mit Status & Prioritäten
- Kalender-Events
- Fitness-Tracker (Vorlagen & Logs)
- Gewichts-Tracker
- Ernährungs-Tracker
- Widget-System
- Dark Mode (Standard)
- Moderne UI mit Tailwind CSS

### 🚧 Geplant
- Implementierung der Widget-Dashboards
- Detaillierte Fitness-Statistiken
- Habit Tracker
- Notiz-System
- File Upload für Profilbilder
- Benachrichtigungen
- Export/Import-Funktionen
- Mobile App

## 🐛 Troubleshooting

### Port bereits belegt
```powershell
# Prüfe welche Ports belegt sind
netstat -ano | findstr :8080
netstat -ano | findstr :5432

# Docker Container neu starten
docker-compose down
docker-compose up -d
```

### Frontend Build-Fehler
```powershell
cd frontend
# Node Modules neu installieren
Remove-Item -Recurse -Force node_modules
npm install
```

### Datenbank zurücksetzen
```powershell
docker-compose down -v
docker-compose up -d
```

## 📝 Nützliche Befehle

```powershell
# Alle Docker Container stoppen
docker-compose down

# Logs anzeigen
docker-compose logs -f

# Nur Backend neu starten
docker-compose restart backend

# Datenbank-Shell öffnen
docker exec -it lifehub-db psql -U lifehub -d lifehub
```

## 🔧 Konfiguration

Umgebungsvariablen in `docker-compose.yml` anpassen:

```yaml
environment:
  DATABASE_URL: jdbc:postgresql://postgres:5432/lifehub
  JWT_SECRET: dein-super-geheimer-schluessel-hier
```

## 📦 Deployment auf Server

```powershell
# 1. Code auf Server pushen (Git)
git add .
git commit -m "Initial commit"
git push origin main

# 2. Auf Server:
cd /path/to/app
docker-compose -f docker-compose.yml up -d

# 3. Nginx als Reverse Proxy (optional)
# Siehe: docs/nginx-setup.md
```

## 📚 API Dokumentation

API Endpunkte sind dokumentiert in `README.md` unter "API Dokumentation".

Testen mit curl:
```powershell
# Registrieren
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d '{\"username\":\"test\",\"email\":\"test@example.com\",\"password\":\"test123\"}'

# Login
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{\"username\":\"test\",\"password\":\"test123\"}'
```

## 💡 Tipps

- **Dark Mode**: Standardmäßig aktiviert, in Einstellungen änderbar
- **Profile**: Erstelle separate Profile für Familie, Arbeit, etc.
- **Bereiche**: Nutze die 3 Bereiche für bessere Organisation
- **Shortcuts**: Sidebar-Links für schnelle Navigation

## 🎯 Performance

- Backend: Java 21, Spring Boot 3.2 (sehr schnell)
- Frontend: React 18, Vite (instant reload)
- Datenbank: PostgreSQL 16 (robust)
- Docker: Optimierte Multi-Stage Builds

## 📄 Lizenz

MIT License - Siehe LICENSE Datei für Details.
