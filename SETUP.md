# 🚀 Komplette Setup-Anleitung für Life Hub

## Inhaltsverzeichnis
1. [Systemvoraussetzungen](#systemvoraussetzungen)
2. [Docker Installation](#docker-installation)
3. [Projekt Setup](#projekt-setup)
4. [Container starten](#container-starten)
5. [Verifizierung](#verifizierung)
6. [Erste Schritte](#erste-schritte)

---

## 1. Systemvoraussetzungen

### Windows
- Windows 10/11 (64-bit)
- Mindestens 8 GB RAM (4 GB für Docker)
- 10 GB freier Festplattenspeicher
- Virtualisierung im BIOS aktiviert

### Docker Desktop Anforderungen
- WSL 2 (Windows Subsystem for Linux)
- Hyper-V aktiviert

---

## 2. Docker Installation

### Windows - Docker Desktop installieren

1. **Docker Desktop herunterladen**
   ```
   https://www.docker.com/products/docker-desktop
   ```

2. **Installer ausführen**
   - Doppelklick auf `Docker Desktop Installer.exe`
   - "Use WSL 2 instead of Hyper-V" auswählen
   - Installation abschließen
   - Computer neu starten

3. **Docker Desktop starten**
   - Docker Desktop aus dem Startmenü öffnen
   - Warten bis das Docker-Icon in der Taskleiste grün ist
   - Einstellungen öffnen (Zahnrad-Symbol)

4. **Docker Einstellungen optimieren**
   - **Resources** → **Advanced**:
     - CPUs: 2-4 (je nach System)
     - Memory: 4 GB
     - Swap: 1 GB
   - **Apply & Restart** klicken

5. **Installation testen**
   ```powershell
   # PowerShell öffnen (als Administrator)
   docker --version
   docker-compose --version
   
   # Test-Container ausführen
   docker run hello-world
   ```

---

## 3. Projekt Setup

### Ordnerstruktur prüfen

```powershell
# Navigiere zu deinem Projekt
cd "C:\Apps\Life Hub"

# Prüfe die Struktur
tree /F /A

# Erwartete Struktur:
# Life Hub/
# ├── docker-compose.yml
# ├── Dockerfile
# ├── pom.xml
# ├── README.md
# ├── src/
# │   └── main/
# └── frontend/
#     ├── Dockerfile
#     ├── package.json
#     └── src/
```

### Umgebungsvariablen setzen (Optional für Entwicklung)

Erstelle eine `.env` Datei im Hauptverzeichnis:

```powershell
# .env Datei erstellen
@"
# Datenbank
DATABASE_URL=jdbc:postgresql://postgres:5432/lifehub
DATABASE_USERNAME=lifehub
DATABASE_PASSWORD=lifehub

# JWT Secret (ÄNDERE DIES IN PRODUKTION!)
JWT_SECRET=dein-sehr-langes-und-sicheres-geheimnis-mindestens-256-bits-lang-12345678901234567890

# Server
SERVER_PORT=8080
"@ | Out-File -FilePath .env -Encoding UTF8
```

---

## 4. Container starten

### Methode 1: Docker Compose (Empfohlen)

```powershell
# Im Life Hub Verzeichnis
cd "C:\Apps\Life Hub"

# Alle Services starten (Datenbank, Backend, Frontend)
docker-compose up -d

# Output:
# [+] Running 4/4
#  ✔ Network life-hub_lifehub-network     Created
#  ✔ Volume "life-hub_postgres_data"      Created
#  ✔ Container lifehub-db                 Started
#  ✔ Container lifehub-backend            Started
#  ✔ Container lifehub-frontend           Started

# Logs verfolgen (Ctrl+C zum Beenden)
docker-compose logs -f
```

### Methode 2: Schritt für Schritt

```powershell
# 1. Netzwerk erstellen
docker network create lifehub-network

# 2. PostgreSQL starten
docker run -d `
  --name lifehub-db `
  --network lifehub-network `
  -e POSTGRES_DB=lifehub `
  -e POSTGRES_USER=lifehub `
  -e POSTGRES_PASSWORD=lifehub `
  -p 5432:5432 `
  -v lifehub-postgres:/var/lib/postgresql/data `
  postgres:16-alpine

# 3. Backend bauen und starten
docker build -t lifehub-backend .
docker run -d `
  --name lifehub-backend `
  --network lifehub-network `
  -e DATABASE_URL=jdbc:postgresql://lifehub-db:5432/lifehub `
  -e DATABASE_USERNAME=lifehub `
  -e DATABASE_PASSWORD=lifehub `
  -p 8080:8080 `
  lifehub-backend

# 4. Frontend bauen und starten
cd frontend
docker build -t lifehub-frontend .
docker run -d `
  --name lifehub-frontend `
  --network lifehub-network `
  -p 80:80 `
  lifehub-frontend
```

---

## 5. Verifizierung

### Container-Status prüfen

```powershell
# Alle Container anzeigen
docker ps

# Erwartete Ausgabe (alle Container sollten "Up" sein):
# CONTAINER ID   IMAGE              STATUS         PORTS
# abc123def456   lifehub-frontend   Up 2 minutes   0.0.0.0:80->80/tcp
# def456ghi789   lifehub-backend    Up 2 minutes   0.0.0.0:8080->8080/tcp
# ghi789jkl012   postgres:16        Up 2 minutes   0.0.0.0:5432->5432/tcp
```

### Service-Tests

```powershell
# 1. Datenbank testen
docker exec lifehub-db psql -U lifehub -d lifehub -c "SELECT version();"

# 2. Backend Health Check
curl http://localhost:8080/actuator/health
# Erwartete Antwort: {"status":"UP"}

# 3. Frontend testen
curl http://localhost
# Sollte HTML zurückgeben

# 4. Browser öffnen
Start-Process "http://localhost"
```

### Logs prüfen

```powershell
# Alle Logs
docker-compose logs

# Backend Logs (auf Fehler prüfen)
docker-compose logs backend | Select-String -Pattern "ERROR"

# Frontend Logs
docker-compose logs frontend

# Datenbank Logs
docker-compose logs postgres
```

---

## 6. Erste Schritte

### 1. Registrierung

```powershell
# Browser öffnen
Start-Process "http://localhost/register"
```

Oder navigiere manuell zu: http://localhost/register

1. Gib einen Benutzernamen ein
2. Gib eine E-Mail-Adresse ein
3. Wähle ein Passwort (mindestens 6 Zeichen)
4. Klicke auf "Registrieren"

### 2. Profil erstellen

Nach der Registrierung:
1. Navigiere zu "Profile" in der Sidebar
2. Klicke auf "+ Neues Profil"
3. Gib einen Namen ein (z.B. "Mein Hauptprofil")
4. Wähle eine Farbe
5. Klicke auf "Erstellen"
6. Klicke auf das Profil, um es zu aktivieren

### 3. Bereiche erkunden

**Privat-Bereich:**
- Todos erstellen und verwalten
- Kalendereinträge hinzufügen
- Workouts tracken
- Gewicht loggen
- Mahlzeiten eintragen

**Arbeit-Bereich:**
- Berufliche Todos
- Meeting-Kalender
- Projektmanagement

**Schule-Bereich:**
- Hausaufgaben tracken
- Klausurtermine verwalten
- Lernplan erstellen

---

## Häufige Probleme & Lösungen

### Problem: "Port already allocated"

```powershell
# Prüfe welcher Prozess den Port verwendet
netstat -ano | findstr :80
netstat -ano | findstr :8080

# Prozess beenden (ersetze <PID>)
taskkill /PID <PID> /F

# Oder ändere Ports in docker-compose.yml
```

### Problem: Backend startet nicht

```powershell
# Logs prüfen
docker-compose logs backend

# Häufige Ursachen:
# 1. Datenbank nicht erreichbar → Warte 30 Sekunden
# 2. Port belegt → Siehe oben
# 3. Speicher voll → docker system prune -a

# Manuell neu starten
docker-compose restart backend
```

### Problem: Frontend zeigt keine Daten

```powershell
# 1. Prüfe ob Backend läuft
curl http://localhost:8080/actuator/health

# 2. Prüfe Browser Console (F12)
# Sollte keine CORS-Fehler zeigen

# 3. Cache leeren
# Im Browser: Ctrl+Shift+Delete
```

### Problem: Datenbank-Verbindung fehlgeschlagen

```powershell
# Container neu starten
docker-compose restart postgres backend

# Oder komplett neu aufsetzen
docker-compose down -v
docker-compose up -d
```

---

## Nützliche Kommandos

### Container Management

```powershell
# Container stoppen
docker-compose stop

# Container starten
docker-compose start

# Container neu starten
docker-compose restart

# Container löschen (Daten bleiben erhalten)
docker-compose down

# Container UND Daten löschen
docker-compose down -v

# Einzelnen Service neu starten
docker-compose restart backend
```

### Monitoring

```powershell
# Ressourcen-Nutzung anzeigen
docker stats

# Container-Details
docker inspect lifehub-backend

# Container-Logs (Live)
docker-compose logs -f --tail=100
```

### Wartung

```powershell
# Nicht verwendete Images löschen
docker image prune -a

# System aufräumen
docker system prune -a --volumes

# Speicherplatz prüfen
docker system df
```

---

## Production Deployment Checklist

Vor dem Deployment auf einem Server:

- [ ] JWT_SECRET in docker-compose.yml ändern
- [ ] Datenbank-Passwort ändern
- [ ] CORS Origins in SecurityConfig anpassen
- [ ] SSL/TLS Zertifikat einrichten
- [ ] Firewall-Regeln konfigurieren
- [ ] Backup-Strategie implementieren
- [ ] Monitoring/Logging einrichten
- [ ] Umgebungsvariablen aus .env-Datei laden

---

## Support & Hilfe

Bei Problemen:
1. Prüfe die Logs: `docker-compose logs`
2. Prüfe den Container-Status: `docker ps -a`
3. Erstelle ein Issue im Repository
4. Siehe TROUBLESHOOTING.md für detaillierte Lösungen

---

**Viel Erfolg mit deinem Life Hub! 🚀**
