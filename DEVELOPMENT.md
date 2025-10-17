# Development Notes

## Architektur-Entscheidungen

### Backend
- **Spring Boot 3.2**: Moderne Java-Version mit allen Features
- **JPA/Hibernate**: ORM für Datenbank-Operationen
- **JWT**: Stateless Authentication
- **PostgreSQL**: Robuste relationale Datenbank
- **Lombok**: Reduziert Boilerplate-Code
- **MapStruct**: DTO-Mapping

### Frontend
- **React 18**: Moderne UI-Library
- **TypeScript**: Type-Safety
- **Vite**: Schneller Build-Tool
- **Tailwind CSS**: Utility-First CSS
- **React Query**: Server State Management
- **Zustand**: Client State Management
- **React Router**: Routing

### Datenbank-Schema

```
User (1) -> (*) Profile (1) -> (*) Todo
                        (1) -> (*) CalendarEvent  
                        (1) -> (*) WorkoutTemplate
                        (1) -> (*) WorkoutLog
                        (1) -> (*) WeightLog
                        (1) -> (*) MealLog
                        (1) -> (*) Widget
```

## Erweiterungsmöglichkeiten

### Backend
- [ ] WebSocket für Echtzeit-Updates
- [ ] Email-Service für Benachrichtigungen
- [ ] File Storage (S3/Local) für Bilder
- [ ] Caching mit Redis
- [ ] API Rate Limiting
- [ ] GraphQL als Alternative zu REST
- [ ] Microservices-Architektur bei Bedarf

### Frontend
- [ ] PWA Support (Offline-Modus)
- [ ] Push Notifications
- [ ] Internationalisierung (i18n)
- [ ] Accessibility (ARIA)
- [ ] End-to-End Tests
- [ ] Storybook für Komponenten
- [ ] Performance Monitoring

### Features
- [ ] Team-Collaboration (geteilte Profile)
- [ ] Import von Google Calendar/Fitness-Apps
- [ ] AI-gestützte Vorschläge
- [ ] Gamification (Achievements, Streaks)
- [ ] Social Features (Freunde, Gruppen)
- [ ] Premium-Features (Subscription)

## Code-Konventionen

### Java
- Package-Struktur: `com.lifehub.{domain}`
- Naming: PascalCase für Klassen, camelCase für Methoden
- DTOs für API-Responses
- Builder-Pattern für Entities
- Service-Layer für Business Logic

### TypeScript/React
- Functional Components mit Hooks
- Custom Hooks für wiederverwendbare Logik
- Styled Components in Tailwind
- Props-Interfaces für Typsicherheit
- Folder-Struktur: `/pages`, `/components`, `/api`, `/store`

## Testing-Strategie

### Backend
```java
// Unit Tests
@Test
void shouldCreateTodo() {
    // Arrange
    // Act
    // Assert
}

// Integration Tests
@SpringBootTest
@AutoConfigureMockMvc
class TodoControllerTest {
    // Tests
}
```

### Frontend
```typescript
// Component Tests
import { render, screen } from '@testing-library/react'

test('renders todo', () => {
  render(<Todo />)
  expect(screen.getByText(/todo/i)).toBeInTheDocument()
})
```

## Deployment-Checkliste

- [ ] Umgebungsvariablen setzen
- [ ] JWT Secret ändern
- [ ] Database Credentials ändern
- [ ] CORS Origins konfigurieren
- [ ] SSL/TLS Zertifikate
- [ ] Backup-Strategie
- [ ] Monitoring Setup
- [ ] Logging konfigurieren
- [ ] Rate Limiting aktivieren
- [ ] Firewall-Regeln

## Bekannte Issues

- TypeScript-Fehler im Frontend sind normal (Dependencies müssen installiert werden)
- Erste Ausführung kann länger dauern (Maven Downloads, npm install)
- JWT Secret muss in Produktion geändert werden

## Hilfreiche Links

- Spring Boot Docs: https://spring.io/projects/spring-boot
- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- PostgreSQL: https://www.postgresql.org/docs/
