# 🔄 Watchtower Konfiguration - Life Hub

## ⚡ Schnelles Auto-Deployment Setup

### Zeitplan:
- **Git Pull:** Jede Minute (`* * * * *`)
- **Watchtower Check:** Alle 5 Minuten (300 Sekunden)
- **Gesamt-Zeit:** ~6-7 Minuten von Git Push bis Live! 🚀

---

## 🏷️ Container-Labels Übersicht

### Backend & Frontend (werden von Watchtower überwacht):
```yaml
labels:
  - "com.centurylinklabs.watchtower.scope=lifehub"
```

### Postgres & pgAdmin (werden NICHT überwacht):
```yaml
labels:
  - "com.centurylinklabs.watchtower.enable=false"
```

---

## 🐳 Watchtower Konfiguration

### Container-Details:
```yaml
watchtower:
  image: containrrr/watchtower:latest
  container_name: lifehub-watchtower
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
  command: --interval 300 --cleanup --scope lifehub
  environment:
    - WATCHTOWER_SCOPE=lifehub
  ports:
    - "8091:8080"  # API/Metriken Port
  restart: unless-stopped
  labels:
    - "com.centurylinklabs.watchtower.scope=lifehub"
```

### Wichtige Parameter:

| Parameter | Wert | Bedeutung |
|-----------|------|-----------|
| `--interval` | 300 | Prüft alle 5 Minuten auf Updates |
| `--cleanup` | - | Entfernt alte Container-Images automatisch |
| `--scope` | lifehub | Überwacht NUR Container mit `scope=lifehub` Label |
| Port | 8091 | Eigener API-Port (kein Konflikt mit anderem Watchtower) |

---

## 🔒 Isolation von anderen Watchtower-Instanzen

### Dein Life Hub Watchtower:
- **Container-Name:** `lifehub-watchtower`
- **Port:** 8091
- **Scope:** `lifehub`
- **Überwacht:** Nur `lifehub-backend` und `lifehub-frontend`

### Dein anderer Watchtower (vermutlich):
- **Container-Name:** `watchtower` (oder ähnlich)
- **Port:** 8080 (Standard)
- **Scope:** Alle anderen Container
- **Überwacht:** Deine anderen Apps

### Keine Konflikte! ✅
- Unterschiedliche Container-Namen ✓
- Unterschiedliche Ports ✓
- Unterschiedliche Scopes ✓
- Beide können parallel laufen ✓

---

## 📋 Auto-Update Matrix

| Container | Image Tag | Watchtower Update | Manual Update |
|-----------|-----------|-------------------|---------------|
| **lifehub-backend** | build | ✅ Alle 5 Min | ❌ Nicht nötig |
| **lifehub-frontend** | build | ✅ Alle 5 Min | ❌ Nicht nötig |
| **lifehub-db** | postgres:latest | ❌ Deaktiviert | ✅ `docker-compose pull` |
| **lifehub-pgadmin** | pgadmin4:latest | ❌ Deaktiviert | ✅ `docker-compose pull` |
| **lifehub-watchtower** | watchtower:latest | ❌ Selbst-Update aus | ✅ `docker-compose pull` |

---

## 🚀 Workflow: Von Code bis Live

```
┌─────────────────────────────────────────────────────────┐
│ 1. Code ändern auf PC                                   │
│    └─> git add . && git commit -m "..." && git push    │
└─────────────────────────────────────────────────────────┘
                         ⬇️
┌─────────────────────────────────────────────────────────┐
│ 2. NAS Cronjob (läuft jede Minute)                     │
│    └─> git pull (in /home/username/life-hub)           │
│    └─> Dauer: ~5-10 Sekunden                           │
└─────────────────────────────────────────────────────────┘
                         ⬇️ Max. 1 Minute warten
┌─────────────────────────────────────────────────────────┐
│ 3. Watchtower Check (alle 5 Minuten)                   │
│    └─> Erkennt: Code hat sich geändert                 │
│    └─> Prüft: Nur Container mit scope=lifehub          │
└─────────────────────────────────────────────────────────┘
                         ⬇️
┌─────────────────────────────────────────────────────────┐
│ 4. Backend Rebuild                                      │
│    └─> docker-compose build backend                    │
│    └─> Maven build, Java kompilieren                   │
│    └─> Dauer: ~2-3 Minuten                             │
└─────────────────────────────────────────────────────────┘
                         ⬇️
┌─────────────────────────────────────────────────────────┐
│ 5. Frontend Rebuild                                     │
│    └─> docker-compose build frontend                   │
│    └─> npm install, npm build                          │
│    └─> Dauer: ~1-2 Minuten                             │
└─────────────────────────────────────────────────────────┘
                         ⬇️
┌─────────────────────────────────────────────────────────┐
│ 6. Container Restart                                    │
│    └─> Stoppe alte Container                           │
│    └─> Starte neue Container                           │
│    └─> Cleanup alte Images                             │
│    └─> Dauer: ~10-20 Sekunden                          │
└─────────────────────────────────────────────────────────┘
                         ⬇️
┌─────────────────────────────────────────────────────────┐
│ 7. ✨ LIVE! Änderungen sind sichtbar                   │
│    └─> Gesamt-Zeit: ~6-7 Minuten                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Monitoring & Debugging

### Watchtower Logs anzeigen:
```bash
# Live-Logs verfolgen
docker logs -f lifehub-watchtower

# Letzte 100 Zeilen
docker logs --tail=100 lifehub-watchtower

# Nach Update-Aktivitäten suchen
docker logs lifehub-watchtower | grep "Updated"
docker logs lifehub-watchtower | grep "Restarting"
```

### Git Pull Log prüfen:
```bash
# Log anzeigen
cat ~/life-hub/git-cron.log

# Live verfolgen
tail -f ~/life-hub/git-cron.log

# Letzte 10 Pulls
tail -n 20 ~/life-hub/git-cron.log
```

### Container Status:
```bash
cd ~/life-hub

# Status aller Container
docker-compose ps

# Rebuild-Zeitstempel prüfen
docker inspect lifehub-backend | grep Created
docker inspect lifehub-frontend | grep Created
```

### Watchtower API abfragen (Port 8091):
```bash
# Watchtower Metriken (falls aktiviert)
curl http://localhost:8091/v1/metrics
```

---

## 🛠️ Manuelle Kontrolle

### Force Update (ohne auf Watchtower zu warten):
```bash
cd ~/life-hub

# Git Pull
git pull

# Rebuild
docker-compose build --no-cache backend frontend

# Restart
docker-compose up -d

# Logs
docker-compose logs -f backend frontend
```

### Watchtower manuell triggern:
```bash
# Watchtower einmalig ausführen (ohne Wartezeit)
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --run-once --scope lifehub lifehub-backend lifehub-frontend
```

### Base Images updaten (Postgres, pgAdmin):
```bash
cd ~/life-hub

# Neueste Images pullen
docker-compose pull postgres pgadmin

# Container neu erstellen
docker-compose up -d postgres pgadmin

# Alte Images aufräumen
docker image prune -f
```

---

## ⚙️ Erweiterte Konfiguration

### Watchtower Benachrichtigungen (optional):

```yaml
watchtower:
  # ... bestehende Konfiguration
  environment:
    - WATCHTOWER_SCOPE=lifehub
    - WATCHTOWER_NOTIFICATIONS=email
    - WATCHTOWER_NOTIFICATION_EMAIL_FROM=watchtower@lifehub.de
    - WATCHTOWER_NOTIFICATION_EMAIL_TO=deine-email@example.com
    - WATCHTOWER_NOTIFICATION_EMAIL_SERVER=smtp.gmail.com
    - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PORT=587
    - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_USER=dein-email@gmail.com
    - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PASSWORD=dein-app-passwort
```

### Zeitplan anpassen:

**Noch schneller (alle 2 Minuten):**
```yaml
command: --interval 120 --cleanup --scope lifehub
```

**Langsamer (alle 10 Minuten):**
```yaml
command: --interval 600 --cleanup --scope lifehub
```

**Nur bestimmte Tageszeit (z.B. nachts):**
```bash
# Watchtower stoppen
docker stop lifehub-watchtower

# Cronjob für Watchtower Start/Stop
crontab -e

# Watchtower nur von 2-6 Uhr laufen lassen
0 2 * * * docker start lifehub-watchtower
0 6 * * * docker stop lifehub-watchtower
```

---

## ⚠️ Troubleshooting

### Problem: Watchtower updated andere Apps

**Prüfung:**
```bash
# Welche Container haben das lifehub-Label?
docker ps --filter "label=com.centurylinklabs.watchtower.scope=lifehub"

# Sollte nur zeigen:
# lifehub-backend
# lifehub-frontend
# lifehub-watchtower
```

**Lösung:** Labels in docker-compose.yml prüfen und `docker-compose up -d` ausführen.

### Problem: Beide Watchtower kollidieren

**Prüfung:**
```bash
# Alle Watchtower-Container anzeigen
docker ps | grep watchtower

# Port-Konflikte prüfen
docker ps | grep 8080
docker ps | grep 8091
```

**Lösung:** Port 8091 in docker-compose.yml ändern, falls bereits belegt.

### Problem: Watchtower updated nicht

**Debug:**
```bash
# Watchtower Logs prüfen
docker logs lifehub-watchtower

# Häufige Meldungen:
# "Skipping container X (not scoped)" - OK, korrekt!
# "Updated container Y" - Erfolg!
# "No new images found" - Kein Update nötig
```

**Manuell testen:**
```bash
# Forciere Update
docker restart lifehub-watchtower

# Nach ~1 Minute Logs prüfen
docker logs --tail=50 lifehub-watchtower
```

---

## ✅ Checkliste: Setup verifizieren

Nach dem ersten Start:

- [ ] Cronjob läuft: `crontab -l` zeigt `* * * * * ... git pull`
- [ ] Git Pull funktioniert: `cat ~/life-hub/git-cron.log`
- [ ] Watchtower läuft: `docker ps | grep lifehub-watchtower`
- [ ] Watchtower ist auf Port 8091: `docker ps | grep 8091`
- [ ] Nur Backend/Frontend haben scope-Label: `docker inspect lifehub-backend | grep scope`
- [ ] Postgres/pgAdmin sind excluded: `docker inspect lifehub-db | grep enable=false`
- [ ] Watchtower Logs zeigen Aktivität: `docker logs lifehub-watchtower`
- [ ] Test-Push wird nach ~6-7 Min deployed

---

## 🎯 Best Practices

1. **Commit-Messages:** Schreibe klare Commit-Messages für besseres Debugging
2. **Git Log:** Prüfe regelmäßig `git-cron.log` auf Fehler
3. **Watchtower Log:** Überwache Watchtower-Logs bei größeren Updates
4. **Backup:** Erstelle Backup vor größeren Änderungen (`docker-compose exec postgres pg_dump...`)
5. **Rollback:** Bei Problemen: `git revert` und auf Auto-Deployment warten
6. **Testing:** Teste Änderungen lokal vor dem Push
7. **Monitoring:** Richte Uptime-Monitoring ein (z.B. Uptime Kuma)

---

## 📚 Weiterführende Dokumentation

- [Watchtower Dokumentation](https://containrrr.dev/watchtower/)
- [Docker Labels](https://docs.docker.com/config/labels-custom-metadata/)
- [Cron Syntax](https://crontab.guru/)
- [Docker Compose Labels](https://docs.docker.com/compose/compose-file/compose-file-v3/#labels)

---

**Happy Auto-Deploying! 🚀**
