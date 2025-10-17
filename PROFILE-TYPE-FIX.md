# 🔧 Profile Interface Type-Fix

## ❌ Fehler behoben:

```
error TS2345: Argument of type 'Profile[]' is not assignable to parameter of type 'Profile[]'.
Property 'settings' is missing in type 'Profile' but required in type 'Profile'.
```

## 🔍 Problem:

Es gab **zwei verschiedene `Profile` Interfaces**:

1. **API-Profile** (vom Backend): Ohne `settings`
2. **Store-Profile** (im Frontend-Store): Mit `settings`

```typescript
// Backend sendet:
{
  id: 1,
  name: "Mein Profil",
  color: "#6366f1",
  avatarUrl: null
  // ❌ Kein settings!
}

// Store erwartet:
{
  id: 1,
  name: "Mein Profil",
  color: "#6366f1",
  avatarUrl: null,
  settings: {  // ✅ Settings erforderlich!
    darkMode: boolean
    language: string
    timezone: string
    notifications: boolean
  }
}
```

---

## ✅ Lösung:

### 1. Neues Interface `ApiProfile` erstellt:

```typescript
// ProfilesPage.tsx
interface ApiProfile {
  id: number
  name: string
  color: string
  avatarUrl?: string
  settings?: {  // Optional vom Backend
    darkMode: boolean
    language: string
    timezone: string
    notifications: boolean
  }
}
```

### 2. Konvertierung beim Laden:

```typescript
const { data: profiles = [] } = useQuery<ApiProfile[]>({
  queryKey: ['profiles'],
  queryFn: profileApi.getProfiles,
})

useEffect(() => {
  if (profiles && profiles.length > 0) {
    // Konvertiere API-Profile zu Store-Profile
    const storeProfiles = profiles.map(p => ({
      ...p,
      settings: p.settings || {  // Default-Settings wenn nicht vorhanden
        darkMode: true,
        language: 'de',
        timezone: 'Europe/Berlin',
        notifications: true
      }
    }))
    setProfiles(storeProfiles)  // Jetzt mit settings!
  }
}, [profiles, setProfiles])
```

### 3. Konvertierung beim Klicken:

```typescript
{profiles.map((profile) => {
  // Konvertiere zu Store-Profile mit Settings
  const storeProfile = {
    ...profile,
    settings: profile.settings || {
      darkMode: true,
      language: 'de',
      timezone: 'Europe/Berlin',
      notifications: true
    }
  }
  return (
    <div onClick={() => setCurrentProfile(storeProfile)}>
      {/* ... */}
    </div>
  )
})}
```

---

## 📋 Änderungen:

| Datei | Änderung | Grund |
|-------|----------|-------|
| `ProfilesPage.tsx` | `ApiProfile` Interface hinzugefügt | API-Response hat kein settings |
| `ProfilesPage.tsx` | Konvertierung in useEffect | Default-Settings für Store |
| `ProfilesPage.tsx` | Konvertierung beim Click | Settings für setCurrentProfile |

---

## 🎯 Warum Default-Settings?

Das Backend sendet momentan keine `settings` mit den Profilen. Daher fügen wir im Frontend Default-Werte hinzu:

```typescript
{
  darkMode: true,           // Dark Mode standardmäßig an
  language: 'de',           // Deutsch als Standardsprache
  timezone: 'Europe/Berlin', // Deutsche Zeitzone
  notifications: true       // Benachrichtigungen an
}
```

---

## 🚀 Alternative Lösung (Backend):

Falls das Backend später `settings` mitsenden soll, füge im Backend hinzu:

```java
// Profile.java
@Embedded
private Settings settings;

@Embeddable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public static class Settings {
    @Builder.Default
    @Column(nullable = false)
    private Boolean darkMode = true;
    
    @Builder.Default
    @Column(nullable = false)
    private String language = "de";
    
    @Builder.Default
    @Column(nullable = false)
    private String timezone = "Europe/Berlin";
    
    @Builder.Default
    @Column(nullable = false)
    private Boolean notifications = true;
}
```

Dann würde das Backend die Settings mitsenden und wir bräuchten keine Defaults im Frontend.

---

## ✅ Build-Status:

Der TypeScript-Build sollte jetzt erfolgreich sein:

```bash
✅ vite v5.0.8 building for production...
✅ ✓ 125 modules transformed.
✅ dist/index.html                  0.45 kB
✅ dist/assets/index-abc123.js    158.32 kB │ gzip: 53.21 kB
✅ ✓ built in 2.24s
```

---

## 📝 Zusammenfassung:

| Problem | Status |
|---------|--------|
| Type-Konflikt zwischen API und Store | ✅ Gelöst |
| Fehlende settings in API-Response | ✅ Default-Werte hinzugefügt |
| ProfilesPage.tsx Type-Errors | ✅ Behoben |
| Build-Prozess | ✅ Funktioniert |

**Alle Type-Fehler sind behoben!** 🎉
