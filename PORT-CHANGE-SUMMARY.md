# ⚙️ Port-Änderung & Build-Fixes Zusammenfassung

## 🔄 Backend-Port von 8080 auf 5000 geändert

### Geänderte Dateien:

#### 1. **docker-compose.yml**
```yaml
backend:
  ports:
    - "5000:5000"  # Vorher: 8080:8080
  environment:
    SERVER_PORT: 5000  # Neu hinzugefügt
```

#### 2. **src/main/resources/application.yml**
```yaml
server:
  port: ${SERVER_PORT:5000}  # Vorher: 8080
```

#### 3. **frontend/vite.config.ts**
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5000',  // Vorher: 8080
    changeOrigin: true,
  },
}
```

#### 4. **frontend/nginx.conf**
```nginx
location /api {
    proxy_pass http://backend:5000;  # Vorher: 8080
}
```

### Dokumentations-Updates:

✅ **README.md** - Alle Verweise auf Port 8080 auf 5000 geändert
✅ **UGREEN-NAS-DEPLOYMENT.md** - NAS-Anleitung aktualisiert
✅ **TROUBLESHOOTING.md** - Troubleshooting-Befehle angepasst

---

## 🚀 Wie du jetzt startest:

### Option 1: Docker Compose (Empfohlen)

```powershell
# Im Life Hub Ordner
cd "C:\Apps\Life Hub"

# Container neu bauen (wegen Änderungen)
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Status prüfen
docker-compose ps
```

### Option 2: Auf Ugreen NAS

```bash
# SSH-Verbindung
ssh admin@nas-ip

# Zum Projekt-Ordner
cd ~/life-hub

# Container neu bauen und starten
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Logs prüfen
docker-compose logs -f backend
```

---

## 🌐 Neue Zugriffs-URLs:

### Lokal:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/actuator/health

### Ugreen NAS (im Netzwerk):
- **Frontend**: http://nas-ip/
- **Backend API**: http://nas-ip:5000/api
- **Health Check**: http://nas-ip:5000/actuator/health

---

## 🔥 Firewall-Regeln anpassen:

### Windows (PowerShell als Admin):
```powershell
# Alte Regel für Port 8080 entfernen (optional)
Remove-NetFirewallRule -DisplayName "Life Hub Backend" -ErrorAction SilentlyContinue

# Neue Regel für Port 5000
New-NetFirewallRule -DisplayName "Life Hub Backend" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow
```

### Linux/NAS:
```bash
# UFW Firewall
sudo ufw delete allow 8080/tcp  # Alte Regel entfernen
sudo ufw allow 5000/tcp         # Neue Regel hinzufügen
sudo ufw status
```

---

## ✅ Überprüfung nach dem Start:

```powershell
# 1. Container-Status
docker-compose ps
# Backend sollte "Up" sein auf Port 5000

# 2. Backend-Health
curl http://localhost:5000/actuator/health
# Erwartete Antwort: {"status":"UP"}

# 3. Frontend lädt (öffne Browser)
# http://localhost

# 4. Logs prüfen
docker-compose logs backend | Select-String -Pattern "Started LifeHubApplication"
```

---

## 🐛 Falls etwas nicht funktioniert:

### Backend startet nicht:
```powershell
# Logs anschauen
docker-compose logs backend

# Port-Konflikt prüfen
netstat -ano | findstr :5000

# Container neu bauen
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Frontend kann Backend nicht erreichen:
```powershell
# Nginx-Logs prüfen
docker-compose logs frontend

# Frontend neu bauen
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Port 5000 bereits belegt:
```powershell
# Welcher Prozess nutzt Port 5000?
netstat -ano | findstr :5000

# Prozess beenden (ersetze <PID>)
taskkill /PID <PID> /F

# Oder anderen Port verwenden (in docker-compose.yml):
# ports:
#   - "5001:5000"  # Backend auf externem Port 5001
```

---

## � Zusätzliche Build-Fixes:

### Frontend Dockerfile
**Problem:** `npm ci` benötigt eine `package-lock.json`, die nicht vorhanden war.

**Lösung:** `npm ci` durch `npm install` ersetzt in `frontend/Dockerfile`.

```dockerfile
# Vorher:
RUN npm ci

# Nachher:
RUN npm install
```

### Backend JWT Service
**Problem:** JJWT 0.12.x API-Breaking-Changes.

**Lösung:** `JwtService.java` für neue API aktualisiert (siehe [BUILD-FIXES.md](BUILD-FIXES.md)).

### Lombok Warnings
**Problem:** `@Builder` ignoriert Default-Werte ohne `@Builder.Default`.

**Lösung:** `@Builder.Default` zu allen Entity-Feldern mit Initialwerten hinzugefügt.

---

## �📝 Wichtige Hinweise:

1. **Neu bauen erforderlich**: Da die Port-Konfiguration in den Container eingebaut wird, müssen die Container neu gebaut werden mit `docker-compose build --no-cache`

2. **Browser-Cache**: Lösche den Browser-Cache oder nutze Inkognito-Modus, falls das Frontend noch alte API-URLs cached

3. **Entwicklungsmodus**: Wenn du lokal entwickelst (nicht Docker), starte das Backend mit:
   ```bash
   SERVER_PORT=5000 ./mvnw spring-boot:run
   ```

4. **Environment-Variable**: Der Port kann über die Environment-Variable `SERVER_PORT` geändert werden, ohne Code anzupassen

---

## 🎉 Fertig!

Dein Life Hub läuft jetzt auf Port **5000** statt 8080!

Bei Fragen siehe:
- [README.md](README.md) - Vollständige Dokumentation
- [UGREEN-NAS-DEPLOYMENT.md](UGREEN-NAS-DEPLOYMENT.md) - NAS-spezifische Anleitung
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Problemlösungen
