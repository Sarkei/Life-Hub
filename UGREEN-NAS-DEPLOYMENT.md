# 🖥️ Ugreen NAS Deployment über SSH

Diese Anleitung zeigt dir Schritt für Schritt, wie du den Life Hub auf deinem Ugreen NAS über SSH installierst und startest.

## 📋 Voraussetzungen

- Ugreen NAS mit SSH-Zugang aktiviert
- Docker und Docker Compose auf dem NAS installiert
- SSH-Client (z.B. PuTTY für Windows oder Terminal für Linux/Mac)
- Genug freier Speicherplatz (mindestens 5 GB empfohlen)

---

## 🔌 Schritt 1: SSH-Verbindung zum NAS herstellen

### Windows (PowerShell):
```powershell
ssh dein-username@nas-ip-adresse
# Beispiel: ssh admin@192.168.1.100
```

### Linux/Mac:
```bash
ssh dein-username@nas-ip-adresse
# Beispiel: ssh admin@192.168.1.100
```

**Beim ersten Mal:**
- Bestätige den Fingerprint mit "yes"
- Gib dein NAS-Passwort ein

---

## 📦 Schritt 2: Docker auf dem NAS prüfen

Prüfe, ob Docker und Docker Compose installiert sind:

```bash
# Docker Version prüfen
docker --version

# Docker Compose Version prüfen
docker-compose --version
```

**Erwartete Ausgabe:**
```
Docker version 24.0.x oder höher
Docker Compose version 2.x.x oder höher
```

### Falls Docker nicht installiert ist:

**Für Ugreen NAS (basierend auf Debian/Ubuntu):**
```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose installieren
sudo apt install docker-compose-plugin -y

# Aktuellen Benutzer zur Docker-Gruppe hinzufügen
sudo usermod -aG docker $USER

# Neu einloggen (oder neu verbinden)
exit
# SSH-Verbindung neu aufbauen
```

---

## 📁 Schritt 3: Arbeitsverzeichnis erstellen

Erstelle ein Verzeichnis für den Life Hub:

```bash
# Ins Home-Verzeichnis oder einen Docker-Ordner wechseln
cd ~
# Oder für zentrale Docker-Projekte:
cd /volume1/docker  # Passe den Pfad an dein NAS an

# Life Hub Verzeichnis erstellen
mkdir -p life-hub
cd life-hub

# Prüfe den aktuellen Pfad
pwd
```

---

## 📤 Schritt 4: Projekt-Dateien hochladen

### Option A: Mit SCP (von deinem Windows-PC aus)

**In PowerShell auf deinem PC (NICHT auf dem NAS):**

```powershell
# Ins Life Hub Verzeichnis auf deinem PC wechseln
cd "C:\Apps\Life Hub"

# Alle Dateien zum NAS hochladen
scp -r * dein-username@nas-ip:/home/dein-username/life-hub/

# Beispiel:
# scp -r * admin@192.168.1.100:/home/admin/life-hub/
```

### Option B: Mit Git (wenn Git auf dem NAS installiert ist)

**Auf dem NAS (SSH-Verbindung):**

```bash
cd ~/life-hub

# Wenn du ein Git-Repository hast
git clone https://github.com/dein-username/life-hub.git .

# Oder nur die Dateien herunterladen (ohne Git-Historie)
# wget oder curl verwenden
```

### Option C: Manuelle Datei-Erstellung

Falls du nur die wichtigsten Dateien brauchst, erstelle sie manuell:

```bash
cd ~/life-hub

# Docker Compose Datei erstellen
nano docker-compose.yml
```

**Füge den kompletten docker-compose.yml Inhalt ein und speichere mit `Ctrl+O`, `Enter`, `Ctrl+X`**

---

## 🔧 Schritt 5: Konfiguration anpassen

### Environment-Variablen für NAS anpassen:

```bash
cd ~/life-hub

# Erstelle eine .env Datei für NAS-spezifische Konfiguration
nano .env
```

**Inhalt der .env Datei:**
```env
# PostgreSQL Konfiguration
POSTGRES_DB=lifehub
POSTGRES_USER=lifehub
POSTGRES_PASSWORD=DeinSicheresPasswort123!

# Backend Konfiguration
JWT_SECRET=DeinSuperGeheimesJWTSecret123!MindestenS32Zeichen
BACKEND_PORT=5000

# Frontend Konfiguration
FRONTEND_PORT=80

# NAS-spezifische Konfiguration
TZ=Europe/Berlin
```

**Speichern:** `Ctrl+O`, `Enter`, `Ctrl+X`

### Docker Compose für NAS optimieren:

```bash
nano docker-compose.yml
```

**Wichtige Anpassungen für das NAS:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: lifehub-postgres
    restart: unless-stopped  # Automatischer Neustart
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-lifehub}
      POSTGRES_USER: ${POSTGRES_USER:-lifehub}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      TZ: ${TZ:-Europe/Berlin}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - lifehub-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U lifehub"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: lifehub-backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/lifehub
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER:-lifehub}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      TZ: ${TZ:-Europe/Berlin}
    ports:
      - "${BACKEND_PORT:-5000}:5000"
    networks:
      - lifehub-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: lifehub-frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      TZ: ${TZ:-Europe/Berlin}
    ports:
      - "${FRONTEND_PORT:-80}:80"
    networks:
      - lifehub-network

networks:
  lifehub-network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
```

---

## 🚀 Schritt 6: Docker Container bauen und starten

### Container bauen (erstmaliger Build):

```bash
cd ~/life-hub

# Alle Container bauen (dauert 5-15 Minuten beim ersten Mal)
docker-compose build --no-cache

# Fortschritt beobachten
# Du siehst: Downloading dependencies, Building...
```

### Container starten:

```bash
# Container im Hintergrund starten
docker-compose up -d

# Ausgabe sollte sein:
# Creating network "lifehub_lifehub-network" ... done
# Creating volume "lifehub_postgres_data" ... done
# Creating lifehub-postgres ... done
# Creating lifehub-backend  ... done
# Creating lifehub-frontend ... done
```

---

## ✅ Schritt 7: Deployment überprüfen

### Container-Status prüfen:

```bash
# Alle laufenden Container anzeigen
docker-compose ps

# Erwartete Ausgabe (alle "Up"):
# NAME                 STATUS              PORTS
# lifehub-postgres     Up 2 minutes        5432/tcp
# lifehub-backend      Up 1 minute         0.0.0.0:5000->5000/tcp
# lifehub-frontend     Up 1 minute         0.0.0.0:80->80/tcp
```

### Logs überprüfen:

```bash
# Alle Logs anzeigen
docker-compose logs

# Nur Backend-Logs (zum Prüfen ob Spring Boot gestartet ist)
docker-compose logs backend

# Logs live verfolgen
docker-compose logs -f backend

# Letzte 50 Zeilen
docker-compose logs --tail=50 backend
```

**Erfolgreiche Backend-Startup-Meldung:**
```
Started LifeHubApplication in X.XXX seconds
```

### Health-Check:

```bash
# Backend-API testen
curl http://localhost:5000/actuator/health

# Erwartete Antwort: {"status":"UP"}

# Frontend testen
curl http://localhost/

# Sollte HTML zurückgeben
```

---

## 🌐 Schritt 8: Vom Browser zugreifen

### Lokaler Zugriff (vom NAS-Netzwerk):

```
http://nas-ip-adresse
# Beispiel: http://192.168.1.100
```

### API-Endpunkt:

```
http://nas-ip-adresse:5000
# Beispiel: http://192.168.1.100:5000
```

---


## 🔁 Schritt 9b: Automatisches Git Pull per Cronjob

Um sicherzustellen, dass dein NAS immer die neuesten Änderungen aus dem Git-Repository zieht, kannst du einen Cronjob einrichten, der alle 5 Minuten automatisch ein `git pull` im Projektverzeichnis ausführt.

### Cronjob einrichten:

```bash
crontab -e
```

Füge folgende Zeile am Ende der Datei hinzu (Pfad ggf. anpassen!):

```cron
*/5 * * * * cd /home/dein-username/life-hub && git pull >> /home/dein-username/life-hub/git-cron.log 2>&1
```

**Hinweise:**
- Ersetze `/home/dein-username/life-hub` durch deinen tatsächlichen Projektpfad, falls abweichend.
- Der Output wird in `git-cron.log` gespeichert (optional).
- Der Cronjob läuft unter dem aktuellen Benutzer. Stelle sicher, dass der Benutzer Schreibrechte im Verzeichnis hat und der SSH-Key für Git (falls privat) eingerichtet ist.

---
## 🔄 Schritt 9: Automatischer Start beim NAS-Neustart

Die Container starten automatisch neu durch `restart: unless-stopped` in der docker-compose.yml.

**Zusätzlich: Docker Compose als Systemd-Service (optional):**

```bash
# Service-Datei erstellen
sudo nano /etc/systemd/system/lifehub.service
```

**Inhalt:**
```ini
[Unit]
Description=Life Hub Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/dein-username/life-hub
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

**Service aktivieren:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable lifehub.service
sudo systemctl start lifehub.service

# Status prüfen
sudo systemctl status lifehub.service
```

---

## 🛠️ Nützliche Verwaltungsbefehle

### Container neustarten:

```bash
cd ~/life-hub

# Alle Container neustarten
docker-compose restart

# Nur einen Container neustarten
docker-compose restart backend
```

### Container stoppen:

```bash
# Alle Container stoppen (Daten bleiben erhalten)
docker-compose stop

# Container stoppen und entfernen (Daten in Volumes bleiben erhalten)
docker-compose down
```

### Container komplett entfernen (inkl. Volumes):

```bash
# ⚠️ ACHTUNG: Löscht ALLE Daten inkl. Datenbank!
docker-compose down -v
```

### Updates einspielen:

```bash
cd ~/life-hub

# Container stoppen
docker-compose down

# Neue Dateien hochladen (mit SCP von deinem PC)
# Oder Git Pull wenn du Git verwendest
# git pull

# Neu bauen
docker-compose build --no-cache

# Starten
docker-compose up -d

# Logs prüfen
docker-compose logs -f
```

### Ressourcen-Verbrauch prüfen:

```bash
# CPU und RAM-Verbrauch der Container
docker stats

# Speicherplatz der Container
docker system df

# Detaillierte Container-Infos
docker-compose ps -a
docker inspect lifehub-backend
```

---

## 💾 Backup und Wiederherstellung

### Datenbank-Backup erstellen:

```bash
cd ~/life-hub

# Backup in Datei speichern
docker-compose exec -T postgres pg_dump -U lifehub lifehub > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup prüfen
ls -lh backup_*.sql
```

### Automatisches Backup einrichten:

```bash
# Backup-Script erstellen
nano ~/backup-lifehub.sh
```

**Script-Inhalt:**
```bash
#!/bin/bash
BACKUP_DIR="/home/dein-username/life-hub/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cd /home/dein-username/life-hub

docker-compose exec -T postgres pg_dump -U lifehub lifehub > "$BACKUP_DIR/lifehub_$DATE.sql"

# Alte Backups löschen (älter als 30 Tage)
find $BACKUP_DIR -name "lifehub_*.sql" -mtime +30 -delete

echo "Backup erstellt: lifehub_$DATE.sql"
```

**Ausführbar machen:**
```bash
chmod +x ~/backup-lifehub.sh

# Test
~/backup-lifehub.sh
```

**Cron-Job einrichten (täglich um 2 Uhr nachts):**
```bash
crontab -e

# Füge hinzu:
0 2 * * * /home/dein-username/backup-lifehub.sh >> /home/dein-username/backup-lifehub.log 2>&1
```

### Datenbank wiederherstellen:

```bash
cd ~/life-hub

# Aus Backup-Datei wiederherstellen
cat backup_20250117_020000.sql | docker-compose exec -T postgres psql -U lifehub lifehub
```

---

## 🔒 Sicherheit und Firewall

### Firewall-Regeln (falls UFW installiert):

```bash
# Port 80 (Frontend) öffnen
sudo ufw allow 80/tcp

# Port 5000 (Backend API) öffnen - nur bei Bedarf
sudo ufw allow 5000/tcp

# SSH-Port sichern (falls noch nicht geschehen)
sudo ufw allow 22/tcp

# Firewall aktivieren
sudo ufw enable

# Status prüfen
sudo ufw status
```

### Nur interne Zugriffe erlauben (optional):

In `docker-compose.yml` die Ports auf localhost beschränken:

```yaml
ports:
  - "127.0.0.1:5000:5000"  # Backend nur lokal
  - "80:80"                 # Frontend öffentlich
```

---

## 🐛 Troubleshooting auf dem NAS

### Problem: Container starten nicht

```bash
# Logs aller Container anzeigen
docker-compose logs

# Einzelne Container-Logs
docker-compose logs postgres
docker-compose logs backend
docker-compose logs frontend

# Container-Status prüfen
docker-compose ps -a
```

### Problem: Port bereits belegt

```bash
# Prüfe welcher Prozess Port 80 oder 5000 verwendet
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :5000

# Oder mit ss
sudo ss -tulpn | grep :80

# Prozess beenden (ersetze PID)
sudo kill -9 <PID>
```

### Problem: Nicht genug Speicherplatz

```bash
# Speicherplatz prüfen
df -h

# Docker aufräumen
docker system prune -a
docker volume prune

# Alte Images löschen
docker images
docker rmi <image-id>
```

### Problem: Container läuft, aber nicht erreichbar

```bash
# Netzwerk prüfen
docker network ls
docker network inspect lifehub_lifehub-network

# Container-IP herausfinden
docker inspect lifehub-backend | grep IPAddress

# Von innerhalb des NAS testen
curl http://localhost:5000/actuator/health
curl http://localhost/
```

### Problem: Datenbank-Verbindung fehlgeschlagen

```bash
# Prüfe ob PostgreSQL läuft
docker-compose ps postgres

# PostgreSQL-Logs
docker-compose logs postgres

# In PostgreSQL-Container einloggen
docker-compose exec postgres psql -U lifehub lifehub

# Verbindung testen
docker-compose exec backend nc -zv postgres 5432
```

---

## 📊 Monitoring und Performance

### Container-Ressourcen überwachen:

```bash
# Live-Statistiken
docker stats

# Einmalige Ausgabe
docker stats --no-stream

# Nur Life Hub Container
docker stats lifehub-postgres lifehub-backend lifehub-frontend
```

### Performance-Optimierung für NAS:

**In docker-compose.yml Memory-Limits setzen:**

```yaml
services:
  backend:
    # ... andere Konfiguration
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

---

## 🔄 Checkliste für regelmäßige Wartung

- [ ] **Täglich:** Backup-Logs prüfen
- [ ] **Wöchentlich:** Container-Logs auf Fehler prüfen (`docker-compose logs --tail=100`)
- [ ] **Wöchentlich:** Ressourcen-Verbrauch prüfen (`docker stats --no-stream`)
- [ ] **Monatlich:** Updates einspielen und neu bauen
- [ ] **Monatlich:** Alte Docker-Images aufräumen (`docker system prune`)
- [ ] **Monatlich:** Speicherplatz prüfen (`df -h`)
- [ ] **Monatlich:** Backup-Wiederherstellung testen

---

## 📞 Schnellreferenz - Wichtigste Befehle

```bash
# Ins Projekt-Verzeichnis
cd ~/life-hub

# Container starten
docker-compose up -d

# Container stoppen
docker-compose stop

# Container neustarten
docker-compose restart

# Logs anzeigen
docker-compose logs -f

# Status prüfen
docker-compose ps

# Container neu bauen
docker-compose build --no-cache

# Aufräumen
docker system prune -a

# Backup erstellen
docker-compose exec -T postgres pg_dump -U lifehub lifehub > backup.sql
```

---

## ✅ Erfolg!

Dein Life Hub läuft jetzt auf deinem Ugreen NAS! 🎉

**Zugriff:**
- Frontend: `http://<nas-ip>/`
- Backend API: `http://<nas-ip>:5000/`

**Nächste Schritte:**
1. Registriere einen Account im Frontend
2. Erstelle dein erstes Profil (Private, Work oder School)
3. Beginne mit dem Planen deiner Todos und Termine

Bei Problemen siehe [TROUBLESHOOTING.md](TROUBLESHOOTING.md) oder die Logs mit `docker-compose logs -f`.
