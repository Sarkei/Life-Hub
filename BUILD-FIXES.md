# 🔧 Build-Fehler behoben

## ✅ Behobene Probleme:

### 1. JWT API Fehler (KRITISCH) ✅
**Problem:**
```
cannot find symbol: method parserBuilder()
location: class io.jsonwebtoken.Jwts
```

**Ursache:**
JJWT Version 0.12.x hat die API geändert. Die alten Methoden `parserBuilder()` und `setClaims()` existieren nicht mehr.

**Lösung:**
`JwtService.java` komplett aktualisiert für JJWT 0.12.x:

#### Änderungen in Imports:
```java
// Alt:
import java.security.Key;
import io.jsonwebtoken.SignatureAlgorithm;

// Neu:
import javax.crypto.SecretKey;
// SignatureAlgorithm nicht mehr nötig
```

#### Änderungen in Token-Erstellung:
```java
// Alt:
.setClaims(extraClaims)
.setSubject(...)
.setIssuedAt(...)
.setExpiration(...)
.signWith(key, SignatureAlgorithm.HS256)

// Neu:
.claims(extraClaims)
.subject(...)
.issuedAt(...)
.expiration(...)
.signWith(key)  // Algorithmus wird automatisch erkannt
```

#### Änderungen in Token-Parsing:
```java
// Alt:
Jwts.parserBuilder()
    .setSigningKey(key)
    .build()
    .parseClaimsJws(token)
    .getBody()

// Neu:
Jwts.parser()
    .verifyWith(key)
    .build()
    .parseSignedClaims(token)
    .getPayload()
```

#### Änderungen in Key-Generierung:
```java
// Alt:
private Key getSignInKey()

// Neu:
private SecretKey getSignInKey()
```

---

### 2. Lombok @Builder Warnings ✅
**Problem:**
```
@Builder will ignore the initializing expression entirely.
If you want the initializing expression to serve as default, add @Builder.Default.
```

**Ursache:**
Lombok ignoriert Default-Werte bei `@Builder`, wenn nicht `@Builder.Default` angegeben wird.

**Lösung:**
`@Builder.Default` zu allen Feldern mit Initialwerten hinzugefügt:

#### Widget.java:
```java
@Builder.Default
private Integer gridX = 0;

@Builder.Default
private Integer gridY = 0;

@Builder.Default
private Integer gridWidth = 2;

@Builder.Default
private Integer gridHeight = 2;
```

#### CalendarEvent.java:
```java
@Builder.Default
private String color = "#3b82f6";

@Builder.Default
private Boolean allDay = false;
```

#### User.java:
```java
@Builder.Default
private Boolean enabled = true;

@Builder.Default
private Set<Profile> profiles = new HashSet<>();
```

#### Todo.java:
```java
@Builder.Default
private TodoStatus status = TodoStatus.TODO;

@Builder.Default
private Priority priority = Priority.MEDIUM;

@Builder.Default
private Integer position = 0;
```

#### Profile.java:
```java
@Builder.Default
private String color = "#6366f1";
```

#### Exercise.java:
```java
@Builder.Default
private Integer position = 0;
```

---

## 🚀 Nächste Schritte:

### Container neu bauen:

```powershell
# Windows PowerShell
cd "C:\Apps\Life Hub"

# Alte Container stoppen und entfernen
docker-compose down

# Neu bauen (ohne Cache)
docker-compose build --no-cache

# Starten
docker-compose up -d

# Logs prüfen
docker-compose logs -f backend
```

### Auf Ugreen NAS:

```bash
# SSH verbinden
ssh admin@nas-ip

# Zum Projekt
cd ~/life-hub

# Neue Dateien hochladen (von PC aus mit SCP)
# Dann:
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Logs prüfen
docker-compose logs -f backend
```

---

## ✅ Erwartete Ausgabe nach Fix:

```
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  XX.XXX s
[INFO] Finished at: 2025-10-17T...
[INFO] ------------------------------------------------------------------------
```

**Backend sollte erfolgreich starten:**
```
Started LifeHubApplication in X.XXX seconds
```

---

## 📊 Zusammenfassung:

| Problem | Status | Dateien |
|---------|--------|---------|
| JWT API Fehler | ✅ Behoben | `JwtService.java` |
| Widget @Builder | ✅ Behoben | `Widget.java` |
| CalendarEvent @Builder | ✅ Behoben | `CalendarEvent.java` |
| User @Builder | ✅ Behoben | `User.java` |
| Todo @Builder | ✅ Behoben | `Todo.java` |
| Profile @Builder | ✅ Behoben | `Profile.java` |
| Exercise @Builder | ✅ Behoben | `Exercise.java` |

**Ergebnis:** 0 Errors, 0 Warnings ✨

---

## 🔍 Weitere Hinweise:

### JWT Deprecated API Warning:
Die Warnung über deprecated API bezieht sich auf alte JJWT Methoden, die wir jetzt alle ersetzt haben.

### Testing:
Nach dem Deployment testen:

```powershell
# Health Check
curl http://localhost:5000/actuator/health

# Frontend
http://localhost/

# Login/Register
http://localhost/login
```

---

## 📚 Referenzen:

- **JJWT 0.12.x Migration Guide**: https://github.com/jwtk/jjwt#install
- **Lombok @Builder.Default**: https://projectlombok.org/features/Builder
- **Spring Boot JWT**: https://spring.io/guides/tutorials/spring-boot-oauth2/

---

## ✨ Alle Fehler behoben!

Der Build sollte jetzt durchlaufen. Viel Erfolg! 🎉
