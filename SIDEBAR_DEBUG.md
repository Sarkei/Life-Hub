# 🔍 Sidebar Debug-Guide (Server)

## Problem: Sidebar zeigt keine Items

Da die App auf dem Server läuft, müssen wir das Problem remote debuggen.

---

## 🎯 Debug-Schritte für den Server

### **Schritt 1: Backend-Logs prüfen**

```bash
# SSH auf Server
ssh user@server

# Backend Logs anschauen
docker logs life-hub-backend --tail 100

# Oder live verfolgen
docker logs life-hub-backend -f
```

**Suche nach:**
- `Started LifeHubApplication` ✅
- `GET /api/sidebar/1` - API-Aufruf vom Frontend
- Fehler wie `NullPointerException` oder `500 Internal Server Error`

---

### **Schritt 2: API-Endpunkt testen**

```bash
# Auf dem Server
curl http://localhost:5000/api/sidebar/1

# Oder vom Laptop (wenn Server erreichbar)
curl http://deine-server-ip:5000/api/sidebar/1
```

**Erwartete Antwort:**
```json
{
  "dashboard": true,
  "todos": true,
  "calendar": true,
  "contacts": false,
  "fitness": true,
  "weight": true,
  "nutrition": true,
  "school": true,
  ...
}
```

**Wenn 404 Error:**
- SidebarController nicht deployed
- Route stimmt nicht

**Wenn 500 Error:**
- Database-Problem
- User ID 1 existiert nicht
- Migration V1_7 nicht gelaufen

---

### **Schritt 3: Database prüfen**

```bash
# PostgreSQL Container
docker exec -it life-hub-db psql -U lifehub -d lifehub

# Prüfe ob Tabelle existiert
\dt sidebar_config

# Prüfe Daten
SELECT * FROM sidebar_config WHERE user_id = 1;

# Prüfe ob User existiert
SELECT id, username, email FROM users LIMIT 5;

# Prüfe Migrations
SELECT version FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 10;
```

**Mögliche Probleme:**
- ❌ `Table "sidebar_config" does not exist` → Migration V1_7 nicht gelaufen
- ❌ `0 rows` → Keine Config für User 1
- ❌ User Tabelle leer → Kein User angelegt

---

### **Schritt 4: Browser Console prüfen**

```
1. Browser öffnen: http://deine-server-ip:5173
2. F12 drücken → Console Tab
3. Seite neu laden (Strg + R)
```

**Suche nach:**
- `GET http://localhost:5000/api/sidebar/1` → **FALSCH!** (localhost = Server, nicht Laptop)
- Sollte sein: `GET http://deine-server-ip:5000/api/sidebar/1`
- `ERR_CONNECTION_REFUSED` → Backend läuft nicht
- `404 Not Found` → Route existiert nicht
- `CORS error` → CORS-Config falsch

---

## 🐛 Häufigste Fehler

### **Problem 1: Frontend ruft localhost:5000 auf**

**Symptom:**
```
Network tab: GET http://localhost:5000/api/sidebar/1 failed
```

**Ursache:**
Frontend hat hardcoded `http://localhost:5000` in Sidebar.tsx

**Lösung:**
Axios BaseURL konfigurieren oder Environment Variable nutzen

---

### **Problem 2: V1_7 Migration fehlt**

**Symptom:**
```sql
ERROR: relation "sidebar_config" does not exist
```

**Lösung:**
```bash
# Prüfe Migrations
docker logs life-hub-backend | grep "V1_7"

# Falls nicht gelaufen
docker compose down
docker compose up -d
```

---

### **Problem 3: Keine Default-Config erstellt**

**Symptom:**
API antwortet mit `{}`

**Ursache:**
`createDefaultConfig()` wird nicht aufgerufen

**Lösung:**
Manuell Reset via API:
```bash
curl -X POST http://localhost:5000/api/sidebar/1/reset
```

---

### **Problem 4: userId ist null im Frontend**

**Symptom:**
Browser Console zeigt: `GET http://localhost:5000/api/sidebar/null`

**Ursache:**
- Nicht eingeloggt
- Token abgelaufen
- authStore nicht initialisiert

**Lösung:**
1. Logout
2. Neu einloggen
3. Check Browser Console: `useAuthStore.getState()`

---

## 🔧 Quick Fixes zum Testen

### **Fix 1: Sidebar.tsx - Hardcoded Test**

Temporär zum Debuggen:

```typescript
// In Sidebar.tsx - Zeile 59
const userId = 1; // Statt: useAuthStore((state) => state.userId);
```

**Pushe das NICHT permanent!** Nur zum Testen ob API funktioniert.

---

### **Fix 2: API BaseURL konfigurieren**

Erstelle `.env` im Frontend:

```env
VITE_API_URL=http://deine-server-ip:5000
```

Dann in Sidebar.tsx:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
await axios.get(`${API_URL}/api/sidebar/${userId}`);
```

---

### **Fix 3: Force Default Config**

Wenn API antwortet aber Sidebar leer:

```typescript
// In Sidebar.tsx - loadSidebarConfig()
const updatedItems = defaultSidebarItems.map(item => {
  // ... existing code ...
  
  // Fallback wenn backend field fehlt
  if (!backendField) {
    console.warn(`No backend field for ${item.id}`);
    return item; // Nutze default enabled-Wert
  }
  
  return { ...item, enabled: config[backendField] ?? item.enabled };
});
```

---

## 📋 Debug-Checkliste

Auf dem Server prüfen:

- [ ] **Docker Container laufen**
  ```bash
  docker ps
  # Erwarte: backend, frontend, db
  ```

- [ ] **Backend ist healthy**
  ```bash
  curl http://localhost:5000/actuator/health
  # Erwarte: {"status":"UP"}
  ```

- [ ] **Sidebar API antwortet**
  ```bash
  curl http://localhost:5000/api/sidebar/1
  # Erwarte: JSON mit allen Feldern
  ```

- [ ] **Migration V1_7 gelaufen**
  ```sql
  SELECT version FROM flyway_schema_history WHERE version = '1.7';
  # Erwarte: 1 row
  ```

- [ ] **User existiert**
  ```sql
  SELECT id FROM users WHERE id = 1;
  # Erwarte: 1 row
  ```

- [ ] **Frontend lädt**
  ```bash
  curl http://localhost:5173
  # Erwarte: HTML
  ```

- [ ] **Browser Console ohne Fehler**
  - F12 → Console → Keine roten Errors

---

## 🚀 Nach dem Fix

### **Was zu pushen:**

```bash
# Auf Laptop
git add .
git commit -m "fix: sidebar configuration loading"
git push origin main
```

### **Auf Server:**

```bash
# Auto-Pull sollte triggern, oder manuell:
git pull origin main

# Neu bauen
docker compose build

# Neu starten
docker compose up -d

# Logs prüfen
docker logs life-hub-backend --tail 50
docker logs life-hub-frontend --tail 50
```

---

## 💡 Nächste Schritte

1. **Logs vom Server schicken** - Zeig mir Backend/Frontend Logs
2. **API Response zeigen** - Was kommt bei `curl /api/sidebar/1`?
3. **Browser Console Screenshot** - Was zeigt die Developer Console?
4. **Database Check** - Existiert sidebar_config Tabelle?

Dann kann ich dir genau sagen, wo das Problem ist! 🎯
