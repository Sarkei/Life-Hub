# Life Hub

Eine moderne All-in-One Life Management Application mit Java Spring Boot Backend und React Frontend.

## Features

### Mehrere Profile
- Erstelle mehrere Profile pro Benutzer
- Jedes Profil kann eigene Einstellungen haben
- Dark Mode standardmäßig aktiviert

### 3 Hauptbereiche
- **Privat**: Persönliches Leben
- **Arbeit**: Berufliches
- **Schule**: Akademisches

### Private Funktionen
- **Dashboard mit Widgets**: Anpassbare Widget-basierte Startseite
- **Todo-Liste**: Aufgaben mit Prioritäten und Status
- **Kalender**: Ereignisse und Termine
- **Fitness Tracker**: 
  - Workout-Vorlagen erstellen
  - Workouts loggen
  - Übungen mit Sets, Reps, Gewicht
- **Gewichts-Tracker**: Gewichtsverlauf verfolgen
- **Ernährungs-Tracker**: Mahlzeiten mit Makros loggen

### Arbeit & Schule
- Angepasste Todo-Listen
- Bereichsspezifische Kalender
- Projekt-Management (kommend)
- Notizen und Dokumentation (kommend)

## Technologie-Stack

### Backend
- Java 21
- Spring Boot 3.2
- Spring Security mit JWT
- PostgreSQL
- JPA/Hibernate
- Lombok & MapStruct

### Frontend (kommend)
- React 18
- TypeScript
- Tailwind CSS
- React Query
- Zustand State Management

## 🐳 Installation mit Docker (Empfohlen)

### Voraussetzungen
- Docker Desktop installiert und gestartet
- Git (optional, für Repository-Clone)
- Mindestens 4 GB freier RAM
- Ports 80, 5000 und 5432 müssen verfügbar sein

### Schritt-für-Schritt Anleitung

#### 1. Repository vorbereiten

```powershell
# Navigiere zu deinem Life Hub Ordner
cd "C:\Apps\Life Hub"

# Prüfe ob alle Dateien vorhanden sind
dir
```

#### 2. Docker Compose starten

```powershell
# Starte alle Container (PostgreSQL, Backend, Frontend)
docker-compose up -d

# Output sollte sein:
# Creating network "life-hub_lifehub-network" ... done
# Creating volume "life-hub_postgres_data" ... done
# Creating lifehub-db ... done
# Creating lifehub-backend ... done
# Creating lifehub-frontend ... done
```

#### 3. Container-Status prüfen

```powershell
# Zeige alle laufenden Container
docker-compose ps

# Erwartete Ausgabe:
#       Name                     Command               State           Ports
# ---------------------------------------------------------------------------------
# lifehub-backend    java -jar app.jar                Up      0.0.0.0:5000->5000/tcp
# lifehub-db         docker-entrypoint.sh postgres    Up      0.0.0.0:5432->5432/tcp
# lifehub-frontend   nginx -g daemon off;             Up      0.0.0.0:80->80/tcp
```

#### 4. Logs überprüfen

```powershell
# Alle Logs anzeigen
docker-compose logs -f

# Oder einzelne Services:
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Mit Ctrl+C beenden
```

#### 5. Anwendung öffnen

Öffne deinen Browser und gehe zu:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/actuator/health

### Erste Schritte nach Installation

1. **Registrieren**: Gehe zu http://localhost/register
2. **Login**: Melde dich mit deinen Credentials an
3. **Profil erstellen**: Navigiere zu "Profile" und erstelle dein erstes Profil
4. **Bereich wählen**: Wähle zwischen Privat, Arbeit oder Schule
5. **Loslegen**: Erstelle deine ersten Todos, Kalendereinträge, etc.

### Docker-Befehle Übersicht

```powershell
# Container starten
docker-compose up -d

# Container stoppen
docker-compose down

# Container neu starten
docker-compose restart

# Einzelnen Service neu starten
docker-compose restart backend

# Logs anzeigen (live)
docker-compose logs -f

# Container und Volumes löschen (Datenbank wird gelöscht!)
docker-compose down -v

# Images neu bauen (nach Code-Änderungen)
docker-compose up -d --build

# In Container-Shell einsteigen
docker exec -it lifehub-backend sh
docker exec -it lifehub-db psql -U lifehub -d lifehub
```

### Troubleshooting

#### Port bereits belegt

```powershell
# Prüfe welcher Prozess den Port verwendet
netstat -ano | findstr :80
netstat -ano | findstr :5000
netstat -ano | findstr :5432

# Prozess beenden (ersetze <PID> mit der gefundenen Process ID)
taskkill /PID <PID> /F

# Oder ändere die Ports in docker-compose.yml:
# ports:
# Oder Port in docker-compose.yml ändern:
ports:
#   - "5001:5000"  # Backend auf Port 5001
#   - "81:80"      # Frontend auf Port 81
```

#### Backend startet nicht

```powershell
# Prüfe Backend-Logs
docker-compose logs backend

# Häufige Probleme:
# - Datenbank nicht erreichbar: Warte 30 Sekunden und prüfe erneut
# - Speicher voll: Lösche alte Docker Images
docker system prune -a

# Backend manuell neu starten
docker-compose restart backend
```

#### Datenbank-Probleme

```powershell
# PostgreSQL-Logs prüfen
docker-compose logs postgres

# Datenbank zurücksetzen (ACHTUNG: Alle Daten werden gelöscht!)
docker-compose down -v
docker-compose up -d

# Datenbank-Shell öffnen
docker exec -it lifehub-db psql -U lifehub -d lifehub

# Tabellen anzeigen
\dt

# Datenbank verlassen
\q
```

#### Frontend zeigt Fehler

```powershell
# Prüfe ob Backend läuft
curl http://localhost:5000/actuator/health

# Nginx-Logs prüfen
docker-compose logs frontend

# Frontend neu bauen
docker-compose up -d --build frontend
```

### Container auf Server deployen

#### Auf Windows Server

```powershell
# 1. Docker auf Server installieren
# Lade Docker Desktop herunter: https://www.docker.com/products/docker-desktop

# 2. Code auf Server übertragen (z.B. via Git oder ZIP)
# Option A: Git
git clone <dein-repository-url>

# Option B: Manuell
# Kopiere den Ordner "Life Hub" auf den Server

# 3. Navigiere zum Ordner
cd "C:\path\to\Life Hub"

# 4. Umgebungsvariablen anpassen (Produktion)
# Bearbeite docker-compose.yml und ändere:
# - JWT_SECRET zu einem sicheren Wert
# - DATABASE_PASSWORD zu einem sicheren Passwort

# 5. Starte die Container
docker-compose up -d

# 6. Firewall-Regeln setzen (Windows Firewall)
New-NetFirewallRule -DisplayName "Life Hub HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
New-NetFirewallRule -DisplayName "Life Hub Backend" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow
```

#### Auf Linux Server

```bash
# 1. Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 2. Docker Compose installieren
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Code übertragen
git clone <dein-repository-url>
cd life-hub

# 4. Umgebungsvariablen anpassen
nano docker-compose.yml
# Ändere JWT_SECRET und Passwörter!

# 5. Container starten
docker-compose up -d

# 6. Nginx Reverse Proxy (optional, für HTTPS)
# Siehe weiter unten
```

### Nginx Reverse Proxy mit SSL (Optional)

Für Produktion mit Domain und HTTPS:

```nginx
# /etc/nginx/sites-available/lifehub.conf
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Backup & Restore

#### Datenbank-Backup erstellen

```powershell
# Backup erstellen
docker exec lifehub-db pg_dump -U lifehub lifehub > backup_$(date +%Y%m%d).sql

# Auf Linux:
docker exec lifehub-db pg_dump -U lifehub lifehub > backup_$(date +%Y%m%d).sql
```

#### Datenbank wiederherstellen

```powershell
# Windows PowerShell
Get-Content backup_20240101.sql | docker exec -i lifehub-db psql -U lifehub -d lifehub

# Linux
cat backup_20240101.sql | docker exec -i lifehub-db psql -U lifehub -d lifehub
```

### Automatisches Backup (Linux)

```bash
# Crontab bearbeiten
crontab -e

# Tägliches Backup um 2 Uhr nachts
0 2 * * * docker exec lifehub-db pg_dump -U lifehub lifehub > /backup/lifehub_$(date +\%Y\%m\%d).sql

# Alte Backups nach 30 Tagen löschen
0 3 * * * find /backup -name "lifehub_*.sql" -mtime +30 -delete
```

Die Anwendung ist dann verfügbar unter:
- Backend: http://localhost:5000
- Frontend: http://localhost:80

### Lokale Entwicklung

#### Backend

```bash
# PostgreSQL starten (oder Docker verwenden)
docker run -d -p 5432:5432 -e POSTGRES_DB=lifehub -e POSTGRES_USER=lifehub -e POSTGRES_PASSWORD=lifehub postgres:16-alpine

# Maven Build
./mvnw clean install

# Anwendung starten
./mvnw spring-boot:run
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Dokumentation

### Authentication

**POST** `/api/auth/register`
```json
{
  "username": "user",
  "email": "user@example.com",
  "password": "password"
}
```

**POST** `/api/auth/login`
```json
{
  "username": "user",
  "password": "password"
}
```

### Profile

**GET** `/api/profiles` - Alle Profile abrufen  
**POST** `/api/profiles` - Neues Profil erstellen  
**GET** `/api/profiles/{id}` - Profil abrufen  
**PUT** `/api/profiles/{id}` - Profil aktualisieren  
**DELETE** `/api/profiles/{id}` - Profil löschen

### Todos

**GET** `/api/todos?profileId={id}&area={PRIVATE|WORK|SCHOOL}&status={TODO|IN_PROGRESS|COMPLETED}`  
**POST** `/api/todos` - Todo erstellen  
**PUT** `/api/todos/{id}` - Todo aktualisieren  
**DELETE** `/api/todos/{id}` - Todo löschen

### Kalender

**GET** `/api/calendar?profileId={id}&area={area}&start={datetime}&end={datetime}`  
**POST** `/api/calendar` - Event erstellen  
**PUT** `/api/calendar/{id}` - Event aktualisieren  
**DELETE** `/api/calendar/{id}` - Event löschen

### Fitness

**GET** `/api/fitness/templates?profileId={id}` - Workout-Vorlagen  
**POST** `/api/fitness/templates` - Vorlage erstellen  
**GET** `/api/fitness/logs?profileId={id}` - Workout-Logs  
**POST** `/api/fitness/logs` - Workout loggen

### Ernährung

**GET** `/api/meals?profileId={id}&date={date}`  
**POST** `/api/meals` - Mahlzeit loggen

### Gewicht

**GET** `/api/weight?profileId={id}`  
**POST** `/api/weight` - Gewicht loggen

### Widgets

**GET** `/api/widgets?profileId={id}&area={area}`  
**POST** `/api/widgets` - Widget erstellen  
**PUT** `/api/widgets/{id}` - Widget aktualisieren  
**DELETE** `/api/widgets/{id}` - Widget löschen

## Umgebungsvariablen

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/lifehub
DATABASE_USERNAME=lifehub
DATABASE_PASSWORD=lifehub
JWT_SECRET=your-secret-key-here
```

## Lizenz

MIT License

## Beiträge

Beiträge sind willkommen! Bitte erstelle einen Pull Request.
