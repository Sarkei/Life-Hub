# Sidebar-Konfiguration: Datenbank-Implementierung

## Übersicht

Die Sidebar-Konfiguration wird jetzt komplett in der PostgreSQL-Datenbank gespeichert. **Kein Browser-Cache mehr!**

## Backend-Implementierung

### 1. Datenbank-Migration: V1_7__sidebar_config.sql

**Tabelle: `sidebar_config`**

```sql
CREATE TABLE sidebar_config (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    
    -- 24 Boolean-Spalten für alle Sidebar-Items
    dashboard, todos, calendar, contacts,
    fitness, weight, nutrition, goals, diary, shopping, health, travel,
    movies, music, photos, quick_notes, time_tracking, statistics,
    news, projects, grades, habits, budget,
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Features:**
- ✅ Eine Zeile pro User (user_id UNIQUE)
- ✅ TRUE/FALSE für jedes Sidebar-Item
- ✅ CASCADE DELETE: Wenn User gelöscht wird, wird Config mit gelöscht
- ✅ Index auf user_id für schnelle Abfragen

### 2. Entity: SidebarConfig.java

```java
@Entity
@Table(name = "sidebar_config")
public class SidebarConfig {
    private Long id;
    private Long userId;
    
    // 24 Boolean-Felder mit @Builder.Default
    private Boolean dashboard = true;
    private Boolean todos = true;
    // ... alle weiteren Felder
}
```

**Features:**
- ✅ @PrePersist/@PreUpdate für automatische Timestamps
- ✅ Lombok @Builder für einfache Erstellung
- ✅ Default-Werte direkt in der Entity

### 3. Repository: SidebarConfigRepository.java

```java
public interface SidebarConfigRepository extends JpaRepository<SidebarConfig, Long> {
    Optional<SidebarConfig> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
```

### 4. Controller: SidebarController.java

**3 Endpoints:**

#### GET `/api/sidebar/{userId}`
Lädt Sidebar-Konfiguration für einen User.
- Wenn nicht vorhanden → erstellt automatisch Default-Config
- Response: SidebarConfigResponse mit allen Boolean-Feldern

#### POST `/api/sidebar/{userId}`
Aktualisiert einzelne oder mehrere Felder.

**Request Body:**
```json
{
  "fitness": true,
  "weight": false,
  "nutrition": true
}
```

**Features:**
- Nur übergebene Felder werden aktualisiert
- Switch-Case für alle 24 Felder
- Automatisches Update-Timestamp

#### POST `/api/sidebar/{userId}/reset`
Setzt alle Felder auf Default-Werte zurück.

**Default-Werte:**
- ✅ Aktiviert: dashboard, todos, calendar, fitness, weight, nutrition
- ❌ Deaktiviert: Alle anderen (contacts, goals, diary, etc.)

### 5. DTO: SidebarConfigResponse.java

```java
@Data
@Builder
public class SidebarConfigResponse {
    private Boolean dashboard;
    private Boolean todos;
    // ... 24 Boolean-Felder
}
```

## Frontend-Implementierung

### Sidebar.tsx Änderungen

**1. Imports hinzugefügt:**
```typescript
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
```

**2. State-Management:**
```typescript
const userId = useAuthStore((state) => state.userId);
const [loading, setLoading] = useState(true);
```

**3. loadSidebarConfig() - Beim Component-Mount:**
```typescript
useEffect(() => {
  if (!userId) return;
  loadSidebarConfig(); // Lädt aus Datenbank
}, [userId]);
```

**Ablauf:**
1. GET Request zu `/api/sidebar/{userId}`
2. Mapping: Backend-Felder → Frontend-Items
3. `setSidebarItems(updatedItems)`
4. Fallback auf `defaultSidebarItems` bei Fehler

**Field-Mapping:**
```typescript
const fieldMap = {
  'dashboard': 'dashboard',
  'todos': 'todos',
  'calendar': 'calendar',
  'profile': 'contacts',  // Backend: contacts
  'fitness': 'fitness',
  'weight': 'weight',
  'nutrition': 'nutrition',
  'goals': 'goals',
  'journal': 'diary',     // Backend: diary
  'quick-notes': 'quickNotes', // Backend: quickNotes (camelCase)
  // ... alle weiteren Mappings
};
```

**4. saveConfig() - Bei Änderungen:**
```typescript
const saveConfig = async (items: SidebarItem[]) => {
  setSidebarItems(items); // Lokales Update
  
  // POST zu /api/sidebar/{userId}
  const updates = { /* mapping */ };
  await axios.post(`/api/sidebar/${userId}`, updates);
};
```

**5. resetToDefaults() - Reset-Button:**
```typescript
const resetToDefaults = async () => {
  const response = await axios.post(`/api/sidebar/${userId}/reset`);
  // Aktualisiere Items mit Response
  setSidebarItems(mappedItems);
};
```

## Datenfluss

### Beim Seitenaufruf:
```
1. User lädt Seite
2. userId aus authStore
3. GET /api/sidebar/{userId}
4. Backend: Prüft DB, erstellt Default falls nicht vorhanden
5. Frontend: Empfängt Config, mapped zu Items
6. Sidebar rendert mit enabled/disabled Items
```

### Bei Änderung (Toggle Item):
```
1. User klickt Checkbox im Edit-Modal
2. toggleItem(id) wird aufgerufen
3. Lokales Update: item.enabled = !item.enabled
4. POST /api/sidebar/{userId} mit Updates
5. Backend: Speichert in DB, returned neue Config
6. Sidebar re-rendert
```

### Bei Neustart/Reload:
```
1. Seite wird neu geladen
2. authStore hat userId (im Memory, nicht localStorage!)
3. Sidebar lädt Config aus DB
4. KEINE Browser-Cache-Daten mehr!
```

## Vorteile der Datenbank-Lösung

✅ **Kein Browser-Cache-Problem mehr**
- Keine localStorage/sessionStorage-Nutzung
- Keine korrupten Cache-Daten
- Keine Cache-Löschung nötig

✅ **Multi-Device-Sync**
- Sidebar-Config ist auf allen Geräten gleich
- Login auf Laptop → gleiche Sidebar wie auf Desktop

✅ **Persistenz**
- Config überlebt Browser-Cache-Löschung
- Config überlebt Cookie-Löschung
- Config überlebt Browser-Neuinstallation

✅ **User-Spezifisch**
- Jeder User hat eigene Config (user_id UNIQUE)
- Automatische CASCADE DELETE bei User-Löschung

✅ **Performance**
- Indexed DB-Query (sehr schnell)
- Nur beim Component-Mount geladen
- Lokales State-Update bei Änderungen

✅ **Sicherheit**
- Server-Side Validierung
- User kann nur eigene Config ändern
- SQL-Injection-geschützt (JPA)

## API-Dokumentation

### GET /api/sidebar/{userId}

**Response 200:**
```json
{
  "dashboard": true,
  "todos": true,
  "calendar": true,
  "contacts": false,
  "fitness": true,
  "weight": true,
  "nutrition": true,
  "goals": false,
  "diary": false,
  "shopping": false,
  "health": false,
  "travel": false,
  "movies": false,
  "music": false,
  "photos": false,
  "quickNotes": false,
  "timeTracking": false,
  "statistics": false,
  "news": false,
  "projects": false,
  "grades": false,
  "habits": false,
  "budget": false
}
```

### POST /api/sidebar/{userId}

**Request Body:**
```json
{
  "fitness": true,
  "weight": false,
  "goals": true
}
```

**Response 200:**
```json
{
  // Komplette Config (alle 24 Felder)
  "dashboard": true,
  "fitness": true,
  "weight": false,
  "goals": true,
  // ...
}
```

### POST /api/sidebar/{userId}/reset

**Response 200:**
```json
{
  // Komplette Config mit Default-Werten
  "dashboard": true,
  "todos": true,
  "calendar": true,
  "contacts": false,
  "fitness": true,
  "weight": true,
  "nutrition": true,
  // Alle anderen: false
}
```

## Migration & Deployment

### 1. Flyway-Migration läuft automatisch:
```bash
docker-compose up -d
# Flyway erkennt V1_7__sidebar_config.sql und führt aus
```

### 2. Bestehende User:
- Beim ersten GET `/api/sidebar/{userId}` wird automatisch Default-Config erstellt
- Keine manuelle Datenmigration nötig

### 3. Testing:
```bash
# 1. Backend neu bauen
mvn clean package

# 2. Container neu starten
docker-compose restart backend

# 3. Frontend testen
# - Sidebar öffnen
# - Items aktivieren/deaktivieren
# - Seite neu laden → Config sollte bleiben
```

## Troubleshooting

### Problem: "Config wird nicht geladen"
**Lösung:**
```typescript
// In Browser-Konsole prüfen:
console.log(useAuthStore.getState().userId); // Muss number sein, nicht null
```

### Problem: "Config wird nicht gespeichert"
**Lösung:**
```bash
# Backend-Logs prüfen:
docker logs lifehub-backend-1

# DB prüfen:
docker exec -it lifehub-postgres-1 psql -U lifehub -d lifehub
SELECT * FROM sidebar_config;
```

### Problem: "Items werden nicht angezeigt"
**Lösung:**
```typescript
// Field-Mapping in Sidebar.tsx prüfen
// Backend-Feldname muss mit DTO übereinstimmen
```

## Code-Statistiken

**Backend:**
- 1 Migration-Datei: V1_7__sidebar_config.sql (40 Zeilen)
- 1 Entity: SidebarConfig.java (130 Zeilen)
- 1 Repository: SidebarConfigRepository.java (10 Zeilen)
- 1 DTO: SidebarConfigResponse.java (40 Zeilen)
- 1 Controller: SidebarController.java (170 Zeilen)
- **Total: ~390 Zeilen**

**Frontend:**
- Sidebar.tsx: +150 Zeilen (loadSidebarConfig, saveConfig, resetToDefaults)
- 2 Imports hinzugefügt (axios, useAuthStore)

**Gesamt: ~540 Zeilen Code**

## Nächste Schritte

1. ✅ Backend-Migration testen
2. ✅ Frontend-Integration testen
3. ⏳ User-Testing: Sidebar konfigurieren und neu laden
4. ⏳ Multi-Device-Test: Config auf verschiedenen Geräten prüfen
5. ⏳ Performance-Test: DB-Query-Zeit messen

## Zusammenfassung

🎉 **KEIN Browser-Cache mehr!**
- Alle Sidebar-Config in PostgreSQL
- Automatisches Laden bei Seitenaufruf
- Multi-Device-Sync
- Keine Cache-Probleme mehr
- User-spezifische Konfiguration
- CASCADE DELETE bei User-Löschung

Die Sidebar-Konfiguration ist jetzt eine **echte Datenbank-gestützte Lösung** statt einer Browser-Cache-Lösung!
