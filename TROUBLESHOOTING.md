# Troubleshooting Guide - Life Hub

## Inhaltsverzeichnis
- [Docker Probleme](#docker-probleme)
- [Backend Probleme](#backend-probleme)
- [Frontend Probleme](#frontend-probleme)
- [Datenbank Probleme](#datenbank-probleme)
- [Netzwerk Probleme](#netzwerk-probleme)

---

## Docker Probleme

### Docker Desktop startet nicht

**Symptome:**
- Docker Icon in Taskleiste bleibt rot oder grau
- Fehlermeldung: "Docker Desktop is not running"

**Lösungen:**

1. **WSL 2 aktualisieren**
   ```powershell
   # In PowerShell als Administrator
   wsl --update
   wsl --set-default-version 2
   ```

2. **Hyper-V prüfen**
   ```powershell
   # Hyper-V aktivieren
   Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
   
   # Neustart erforderlich
   Restart-Computer
   ```

3. **Docker Desktop zurücksetzen**
   - Docker Desktop öffnen
   - Settings → Troubleshoot → Reset to factory defaults
   - Computer neu starten

### "Port already allocated" Fehler

**Symptom:**
```
Error: Ports are not available: exposing port TCP 0.0.0.0:80 -> 0.0.0.0:0: listen tcp 0.0.0.0:80: bind: An attempt was made to access a socket in a way forbidden by its access permissions.
```

**Lösungen:**

```powershell
# 1. Prüfe welcher Prozess den Port verwendet
netstat -ano | findstr :80
netstat -ano | findstr :5000
netstat -ano | findstr :5432

# 2. Prozess beenden (ersetze <PID> mit der Prozess-ID)
taskkill /PID <PID> /F

# 3. Port-Reservierungen prüfen
netsh interface ipv4 show excludedportrange protocol=tcp

# 4. Hyper-V Port-Reservierungen zurücksetzen (wenn nötig)
net stop winnat
net start winnat

# 5. Alternative: Ports in docker-compose.yml ändern
# Bearbeite docker-compose.yml:
# ports:
#   - "5001:5000"  # Backend auf 5001
#   - "81:80"      # Frontend auf 81
```

### Container startet nicht

**Symptom:**
```
Container exits immediately after starting
```

**Lösungen:**

```powershell
# 1. Logs anschauen
docker-compose logs backend

# 2. Container manuell starten und Logs anzeigen
docker-compose up backend

# 3. Container interaktiv starten für Debugging
docker run -it lifehub-backend sh

# 4. Images neu bauen
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## Backend Probleme

### Backend startet nicht

**Symptom:**
```
Application failed to start
```

**Häufige Ursachen & Lösungen:**

1. **Datenbank nicht erreichbar**
   ```powershell
   # Prüfe ob PostgreSQL läuft
   docker ps | findstr postgres
   
   # Datenbank-Logs prüfen
   docker-compose logs postgres
   
   # Warte 30 Sekunden und versuche erneut
   Start-Sleep -Seconds 30
   docker-compose restart backend
   ```

2. **Falsche Datenbank-Credentials**
   ```powershell
   # Prüfe docker-compose.yml
   # DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD müssen übereinstimmen
   
   # Bearbeite docker-compose.yml und starte neu
   docker-compose down
   docker-compose up -d
   ```

3. **Java Version falsch**
   ```powershell
   # Im Backend-Container prüfen
   docker exec lifehub-backend java -version
   
   # Sollte Java 21 sein
   # Falls nicht, Dockerfile prüfen und neu bauen
   docker-compose build --no-cache backend
   ```

4. **Maven Build Fehler**
   ```powershell
   # Lokalen Build versuchen
   ./mvnw clean package
   
   # Oder in PowerShell
   .\mvnw.cmd clean package
   
   # Bei Fehlern: Dependencies updaten
   ./mvnw clean install -U
   ```

### JWT Token Fehler

**Symptom:**
```
401 Unauthorized
Invalid JWT token
```

**Lösungen:**

1. **JWT Secret prüfen**
   ```yaml
   # In docker-compose.yml
   environment:
     JWT_SECRET: dein-secret-hier-muss-lang-genug-sein-mindestens-256-bits
   ```

2. **Token abgelaufen**
   - Neu einloggen
   - Browser-Cache leeren (Ctrl+Shift+Delete)

3. **CORS Probleme**
   ```java
   // In SecurityConfig.java prüfen:
   configuration.setAllowedOrigins(List.of(
     "http://localhost:3000",
     "http://localhost:5173",
     "http://localhost:80",
     "http://localhost"
   ));
   ```

### API Endpoints geben 404

**Symptom:**
```
GET http://localhost:5000/api/todos 404 Not Found
```

**Lösungen:**

```powershell
# 1. Prüfe ob Backend läuft
curl http://localhost:5000/actuator/health

# 2. Prüfe Controller-Mapping
docker-compose logs backend | Select-String -Pattern "Mapped"

# 3. Application Context prüfen
docker-compose logs backend | Select-String -Pattern "Started LifeHubApplication"

# 4. Neustart
docker-compose restart backend
```

---

## Frontend Probleme

### Frontend zeigt weiße Seite

**Symptom:**
- Browser zeigt leere/weiße Seite
- Keine Fehlermeldung

**Lösungen:**

```powershell
# 1. Browser Console öffnen (F12)
# Prüfe auf JavaScript-Fehler

# 2. Nginx-Logs prüfen
docker-compose logs frontend

# 3. Frontend neu bauen
cd frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend

# 4. Browser-Cache leeren
# Im Browser: Ctrl+Shift+Delete
```

### API Calls schlagen fehl

**Symptom:**
```
Network Error
CORS Error
Failed to fetch
```

**Lösungen:**

1. **Backend Erreichbarkeit prüfen**
   ```powershell
   # Von Host
      # Backend API-Verbindung testen
   curl http://localhost:5000/api/auth/login
   
   # Von Frontend-Container
   docker exec lifehub-frontend curl http://backend:8080/api
   ```

2. **Nginx Proxy-Config prüfen**
   ```nginx
   # In frontend/nginx.conf
   location /api {
       proxy_pass http://backend:8080;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
   }
   ```

3. **Network prüfen**
   ```powershell
   # Alle Container müssen im selben Network sein
   docker network inspect lifehub-network
   ```

### npm install Fehler (Lokale Entwicklung)

**Symptom:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Lösungen:**

```powershell
cd frontend

# 1. node_modules und lock file löschen
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# 2. Neu installieren
npm install

# 3. Mit legacy peer deps (falls nötig)
npm install --legacy-peer-deps

# 4. Node Version prüfen
node --version  # Sollte >= 18.x sein
```

---

## Datenbank Probleme

### "Connection refused" zu PostgreSQL

**Symptom:**
```
Connection to localhost:5432 refused
```

**Lösungen:**

```powershell
# 1. PostgreSQL Container läuft?
docker ps | findstr postgres

# 2. Logs prüfen
docker-compose logs postgres

# 3. Neustart
docker-compose restart postgres

# 4. Warte und versuche erneut
Start-Sleep -Seconds 10
docker-compose restart backend
```

### Datenbank-Schema fehlt

**Symptom:**
```
Table "users" does not exist
```

**Lösungen:**

```powershell
# 1. Hibernate sollte Tabellen automatisch erstellen
# Prüfe application.yml:
# spring.jpa.hibernate.ddl-auto: update

# 2. Manuell Tabellen erstellen lassen
docker-compose restart backend

# 3. Datenbank komplett zurücksetzen
docker-compose down -v
docker-compose up -d
```

### Datenbank voll / Performance-Probleme

**Lösungen:**

```powershell
# 1. In Datenbank einloggen
docker exec -it lifehub-db psql -U lifehub -d lifehub

# 2. Tabellengröße prüfen
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# 3. Alte Daten löschen (Beispiel)
DELETE FROM todos WHERE completed_at < NOW() - INTERVAL '90 days';

# 4. VACUUM durchführen
VACUUM ANALYZE;

\q
```

---

## Netzwerk Probleme

### Container können sich nicht erreichen

**Symptom:**
```
backend: Could not connect to postgres
frontend: Could not connect to backend
```

**Lösungen:**

```powershell
# 1. Network existiert?
docker network ls | findstr lifehub

# 2. Container im richtigen Network?
docker network inspect lifehub-network

# Sollte alle 3 Container zeigen:
# - lifehub-db
# - lifehub-backend
# - lifehub-frontend

# 3. Network neu erstellen
docker-compose down
docker network rm lifehub-network
docker-compose up -d

# 4. DNS-Auflösung testen
docker exec lifehub-backend ping postgres
docker exec lifehub-frontend ping backend
```

### Firewall blockiert Ports

**Windows Firewall:**

```powershell
# Als Administrator ausführen

# Ports öffnen
New-NetFirewallRule -DisplayName "Life Hub HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
New-NetFirewallRule -DisplayName "Life Hub Backend" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
New-NetFirewallRule -DisplayName "Life Hub PostgreSQL" -Direction Inbound -Protocol TCP -LocalPort 5432 -Action Allow

# Regeln anzeigen
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Life Hub*"}

# Regeln löschen (falls nötig)
Remove-NetFirewallRule -DisplayName "Life Hub HTTP"
```

---

## Performance Optimierung

### Container nutzen zu viel RAM

```powershell
# 1. Ressourcen-Nutzung prüfen
docker stats

# 2. Docker Desktop Limits anpassen
# Settings → Resources → Advanced
# Memory: 4 GB (für alle Container zusammen)
# Swap: 1 GB

# 3. JVM Memory limits setzen (docker-compose.yml)
backend:
  environment:
    JAVA_OPTS: "-Xmx512m -Xms256m"
```

### Langsame Startzeit

```powershell
# 1. Layers cachen durch Multi-Stage Build
# Siehe Dockerfile

# 2. Dependencies pre-downloaden
docker-compose build --no-cache

# 3. Volume für Maven Cache
# In docker-compose.yml:
volumes:
  - maven-cache:/root/.m2
```

---

## Daten Backup & Recovery

### Backup erstellen

```powershell
# Datenbank Backup
docker exec lifehub-db pg_dump -U lifehub lifehub > backup.sql

# Mit Zeitstempel
$date = Get-Date -Format "yyyyMMdd_HHmmss"
docker exec lifehub-db pg_dump -U lifehub lifehub > "backup_$date.sql"
```

### Backup wiederherstellen

```powershell
# Datenbank leeren und neu erstellen
docker exec lifehub-db psql -U lifehub -c "DROP DATABASE lifehub;"
docker exec lifehub-db psql -U lifehub -c "CREATE DATABASE lifehub;"

# Backup einspielen
Get-Content backup.sql | docker exec -i lifehub-db psql -U lifehub -d lifehub
```

---

## Komplett Neu Starten

Wenn nichts mehr hilft:

```powershell
# 1. Alles stoppen und löschen
docker-compose down -v

# 2. Alle Images löschen
docker rmi lifehub-backend lifehub-frontend

# 3. Docker aufräumen
docker system prune -a --volumes

# 4. Neu bauen und starten
docker-compose up -d --build

# 5. Logs verfolgen
docker-compose logs -f
```

---

## Hilfe bekommen

Wenn du immer noch Probleme hast:

1. **Logs sammeln:**
   ```powershell
   docker-compose logs > logs.txt
   ```

2. **System-Info:**
   ```powershell
   docker version > system-info.txt
   docker-compose version >> system-info.txt
   docker info >> system-info.txt
   ```

3. **Issue erstellen** im Repository mit:
   - Beschreibung des Problems
   - Fehlermeldungen
   - logs.txt
   - system-info.txt

---

**Viel Erfolg beim Troubleshooting! 🔧**
