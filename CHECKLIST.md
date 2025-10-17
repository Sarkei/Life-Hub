# ✅ Life Hub - Schnellstart Checkliste

Folge dieser Checkliste Schritt für Schritt für eine erfolgreiche Installation!

---

## 📋 Vor der Installation

- [ ] **Windows 10/11** (64-bit) installiert
- [ ] Mindestens **8 GB RAM** verfügbar
- [ ] Mindestens **10 GB freier Speicher**
- [ ] **Administratorrechte** auf dem System
- [ ] Internetverbindung vorhanden

---

## 🐳 Docker Installation

- [ ] **Docker Desktop** von https://www.docker.com/products/docker-desktop heruntergeladen
- [ ] Docker Desktop Installer ausgeführt
- [ ] "Use WSL 2 instead of Hyper-V" ausgewählt
- [ ] Computer neu gestartet
- [ ] Docker Desktop gestartet (Icon in Taskleiste ist grün ✅)
- [ ] Docker getestet:
  ```powershell
  docker --version
  docker run hello-world
  ```

---

## 📁 Projekt Setup

- [ ] Zum Life Hub Ordner navigiert:
  ```powershell
  cd "C:\Apps\Life Hub"
  ```

- [ ] Dateien vorhanden geprüft:
  ```powershell
  dir
  ```
  Folgende Dateien sollten existieren:
  - [ ] `docker-compose.yml`
  - [ ] `Dockerfile`
  - [ ] `pom.xml`
  - [ ] `README.md`
  - [ ] Ordner `src/`
  - [ ] Ordner `frontend/`

---

## 🚀 Container starten

- [ ] PowerShell als Administrator geöffnet
- [ ] Zum Projektordner navigiert
- [ ] Container gestartet:
  ```powershell
  docker-compose up -d
  ```

- [ ] Warten bis alle Container laufen (ca. 2-3 Minuten)

- [ ] Status geprüft:
  ```powershell
  docker-compose ps
  ```
  Alle 3 Container sollten "Up" Status haben:
  - [ ] `lifehub-db` (PostgreSQL)
  - [ ] `lifehub-backend` (Spring Boot)
  - [ ] `lifehub-frontend` (React/Nginx)

---

## ✔️ Verifizierung

- [ ] **Datenbank** läuft:
  ```powershell
  docker exec lifehub-db psql -U lifehub -d lifehub -c "SELECT 1;"
  ```

- [ ] **Backend** läuft:
  ```powershell
  curl http://localhost:8080/actuator/health
  ```
  Erwartete Antwort: `{"status":"UP"}`

- [ ] **Frontend** läuft:
  - [ ] Browser öffnen: http://localhost
  - [ ] Login-Seite wird angezeigt

---

## 👤 Erste Schritte in der App

- [ ] Registrierung durchgeführt:
  - [ ] Zu http://localhost/register navigiert
  - [ ] Benutzername eingegeben
  - [ ] E-Mail eingegeben
  - [ ] Passwort eingegeben (min. 6 Zeichen)
  - [ ] "Registrieren" geklickt

- [ ] Login erfolgreich

- [ ] Erstes Profil erstellt:
  - [ ] Zu "Profile" navigiert
  - [ ] "+ Neues Profil" geklickt
  - [ ] Name eingegeben
  - [ ] Farbe gewählt
  - [ ] "Erstellen" geklickt
  - [ ] Profil aktiviert (angeklickt)

- [ ] Bereiche erkundet:
  - [ ] Privat-Dashboard geöffnet
  - [ ] Arbeit-Dashboard geöffnet
  - [ ] Schule-Dashboard geöffnet

---

## 🎯 Features testen

### Privat-Bereich

- [ ] **Todos**:
  - [ ] Zu "Privat → Todos" navigiert
  - [ ] Erstes Todo erstellt
  - [ ] Todo als erledigt markiert

- [ ] **Kalender**:
  - [ ] Zu "Privat → Kalender" navigiert
  - [ ] Erstes Event erstellt

- [ ] **Fitness**:
  - [ ] Zu "Privat → Fitness" navigiert
  - [ ] Workout-Vorlage erstellt
  - [ ] Workout geloggt

- [ ] **Gewicht**:
  - [ ] Zu "Privat → Gewicht" navigiert
  - [ ] Gewicht eingetragen

- [ ] **Ernährung**:
  - [ ] Zu "Privat → Ernährung" navigiert
  - [ ] Mahlzeit geloggt

---

## 🔧 Optional: Entwicklungsumgebung

### VS Code Extensions installieren

- [ ] VS Code geöffnet
- [ ] Extensions installiert:
  ```powershell
  code --install-extension vscjava.vscode-java-pack
  code --install-extension vmware.vscode-boot-dev-pack
  code --install-extension dsznajder.es7-react-js-snippets
  code --install-extension bradlc.vscode-tailwindcss
  code --install-extension ms-azuretools.vscode-docker
  ```

### Lokale Entwicklung (Optional)

- [ ] **Frontend Dependencies installiert**:
  ```powershell
  cd frontend
  npm install
  npm run dev
  ```

- [ ] **Backend lokal gestartet**:
  ```powershell
  ./mvnw spring-boot:run
  ```

---

## 📊 Performance Check

- [ ] Ressourcen-Nutzung geprüft:
  ```powershell
  docker stats
  ```

- [ ] Memory-Nutzung akzeptabel (<4 GB für alle Container)
- [ ] CPU-Nutzung normal (<50% im Leerlauf)

---

## 🔐 Sicherheit (Für Produktion)

Falls du die App auf einem Server deployen möchtest:

- [ ] JWT_SECRET in `docker-compose.yml` geändert
- [ ] Datenbank-Passwort geändert
- [ ] Firewall-Regeln konfiguriert
- [ ] SSL/TLS Zertifikat eingerichtet
- [ ] Backup-Strategie implementiert

---

## 🆘 Wenn etwas nicht funktioniert

1. [ ] **Logs geprüft**:
   ```powershell
   docker-compose logs -f
   ```

2. [ ] **TROUBLESHOOTING.md gelesen**

3. [ ] **Container neu gestartet**:
   ```powershell
   docker-compose restart
   ```

4. [ ] **Komplett neu gestartet**:
   ```powershell
   docker-compose down -v
   docker-compose up -d
   ```

5. [ ] Immer noch Probleme? → Issue im Repository erstellen

---

## 🎉 Fertig!

Wenn alle Punkte abgehakt sind, ist dein Life Hub einsatzbereit!

### Nächste Schritte:

- [ ] **Dokumentation lesen**: `README.md`
- [ ] **Features erkunden**: Alle Bereiche testen
- [ ] **Anpassen**: Eigene Workflows erstellen
- [ ] **Backup einrichten**: Regelmäßige Backups automatisieren

---

### Wichtige Links:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/actuator/health

### Hilfreiche Befehle:

```powershell
# Container starten
docker-compose up -d

# Container stoppen
docker-compose down

# Logs anzeigen
docker-compose logs -f

# Status prüfen
docker-compose ps

# Neu starten
docker-compose restart
```

---

**Viel Spaß mit deinem Life Hub! 🚀✨**

Bei Fragen oder Problemen:
1. Siehe `TROUBLESHOOTING.md`
2. Siehe `SETUP.md` für detaillierte Anleitung
3. Erstelle ein Issue im Repository
