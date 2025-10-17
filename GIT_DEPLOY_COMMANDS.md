# Git Commands für Deployment

## 🚀 Quick Deploy

```bash
# Im Life Hub Verzeichnis
cd "c:\Apps\Life Hub"

# Status
git status

# Add
git add frontend/src/components/layout/Sidebar.tsx

# Commit
git commit -m "fix(sidebar): initialize with default items and improve error handling"

# Push
git push origin main
```

---

## 📝 Detaillierter Commit

```bash
git commit -m "fix(sidebar): initialize with default items and improve error handling

- Set initial sidebarItems state to defaultSidebarItems instead of empty array
- Add userId null check with fallback to defaults  
- Add detailed console logs for debugging
- Ensure sidebar always shows items even if API fails

Fixes: Sidebar showing no items when API call fails or userId is null
Result: Sidebar now always displays at least default items (8 enabled)
"
```

---

## 🔍 Prüfen vor Push

```bash
# Welche Dateien geändert?
git diff frontend/src/components/layout/Sidebar.tsx

# Zeige nur Statistik
git diff --stat

# Zeige letzten Commit
git log --oneline -1
```

---

## ⚙️ Nach Push - Server Commands

```bash
# SSH
ssh user@your-server

# Projekt Verzeichnis
cd /path/to/life-hub

# Pull
git pull origin main

# Rebuild nur Frontend
docker compose build frontend

# Restart
docker compose up -d frontend

# Check Logs
docker logs life-hub-frontend --tail 50

# Check Backend auch
docker logs life-hub-backend --tail 50
```

---

## 🧪 Test Commands

```bash
# Backend Health
curl http://localhost:5000/actuator/health

# Sidebar API
curl http://localhost:5000/api/sidebar/1

# Full rebuild wenn nötig
docker compose down
docker compose build
docker compose up -d
```

---

## 🔄 Falls du alles neu bauen willst

```bash
# Stop & Remove
docker compose down -v

# Clean build
docker compose build --no-cache

# Start
docker compose up -d

# Follow logs
docker compose logs -f
```

---

## 📊 Monitoring

```bash
# Alle Container
docker ps

# Resource Usage
docker stats

# Specific logs
docker logs life-hub-backend -f --tail 100
docker logs life-hub-frontend -f --tail 100
docker logs life-hub-db -f --tail 100
```
