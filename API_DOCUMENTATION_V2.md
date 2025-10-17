# 📚 LIFE HUB V2.0 - API DOCUMENTATION

## 🔐 Authentication & User Management

### 1. Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "max",
  "email": "max@example.com",
  "password": "password123"
}

Response 200:
{
  "userId": 1,
  "username": "max",
  "email": "max@example.com",
  "message": "User registered successfully"
}

Response 400:
{
  "error": "Username already exists: max"
}
```

### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "max",  // Can be username OR email
  "password": "password123"
}

Response 200:
{
  "userId": 1,
  "username": "max",
  "email": "max@example.com",
  "settings": {
    "id": 1,
    "userId": 1,
    "theme": "system",
    "language": "de",
    "emailNotifications": true,
    "pushNotifications": false,
    "notificationSound": true,
    "profileVisible": true,
    "showOnlineStatus": true,
    "timezone": "Europe/Berlin",
    "dateFormat": "DD.MM.YYYY",
    "timeFormat": "24h",
    "firstDayOfWeek": 1
  },
  "profile": {
    "id": 1,
    "userId": 1,
    "firstName": null,
    "lastName": null,
    "displayName": null,
    "bio": null,
    "avatarUrl": null,
    "address": null,
    "city": null,
    "postalCode": null,
    "country": null,
    "dateOfBirth": null,
    "gender": null,
    "occupation": null,
    "website": null
  },
  "sidebar": {
    "id": 1,
    "userId": 1,
    "showDashboard": true,
    "showTodos": true,
    "showCalendar": true,
    "showContacts": false,
    "showProfile": true,
    "showFitness": true,
    "showWeight": true,
    "showNutrition": true,
    "showSchool": true,
    "showSchoolNotes": true,
    "showSchoolTimetable": true,
    "showSchoolHomework": true,
    "showSchoolExams": true,
    "showSchoolGrades": true,
    // ... all sidebar fields
  },
  "message": "Login successful"
}

Response 401:
{
  "error": "Invalid credentials"
}
```

### 3. Check Username Availability
```http
GET /api/auth/check-username/max

Response 200:
{
  "available": false,
  "message": "Username already taken"
}
```

### 4. Check Email Availability
```http
GET /api/auth/check-email/max@example.com

Response 200:
{
  "available": true,
  "message": "Email available"
}
```

### 5. Get User Data
```http
GET /api/user/{userId}/data

Response 200:
{
  "user": { ... },
  "settings": { ... },
  "profile": { ... },
  "sidebar": { ... }
}
```

---

## ⚙️ User Settings

### 1. Update Settings
```http
PUT /api/user/{userId}/settings
Content-Type: application/json

{
  "theme": "dark",
  "language": "en",
  "emailNotifications": false,
  "pushNotifications": true,
  "notificationSound": false,
  "profileVisible": true,
  "showOnlineStatus": false,
  "timezone": "America/New_York",
  "dateFormat": "MM/DD/YYYY",
  "timeFormat": "12h",
  "firstDayOfWeek": 0
}

Response 200:
{
  "id": 1,
  "userId": 1,
  "theme": "dark",
  "language": "en",
  // ... updated settings
}
```

---

## 👤 User Profile

### 1. Update Profile
```http
PUT /api/user/{userId}/profile
Content-Type: application/json

{
  "firstName": "Max",
  "lastName": "Mustermann",
  "displayName": "Max M.",
  "bio": "Software Developer",
  "avatarUrl": "https://example.com/avatar.jpg",
  "address": "Musterstraße 123",
  "city": "Berlin",
  "postalCode": "10115",
  "country": "Germany",
  "dateOfBirth": "1995-05-15",
  "gender": "male",
  "occupation": "Developer",
  "website": "https://maxmustermann.de"
}

Response 200:
{
  "id": 1,
  "userId": 1,
  "firstName": "Max",
  "lastName": "Mustermann",
  // ... updated profile
}
```

---

## 📊 Sidebar Configuration

### 1. Get Sidebar Config
```http
GET /api/sidebar/{userId}

Response 200:
{
  "id": 1,
  "userId": 1,
  "showDashboard": true,
  "showTodos": true,
  "showCalendar": true,
  "showSchool": true,
  "showSchoolNotes": true,
  "showSchoolTimetable": true,
  // ... all 40+ fields
}
```

### 2. Update Sidebar Config
```http
PUT /api/sidebar/{userId}
Content-Type: application/json

{
  "field": "showSchoolNotes",
  "value": false
}

Response 200:
{
  "id": 1,
  "userId": 1,
  "showSchoolNotes": false,
  // ... all fields
}
```

### 3. Reset to Defaults
```http
POST /api/sidebar/{userId}/reset

Response 200:
{
  "id": 1,
  "userId": 1,
  // ... default values
}
```

---

## 🎓 School System

### Subjects (Fächer)

#### Get All Subjects
```http
GET /api/school/subjects/{userId}

Response 200:
[
  {
    "id": 1,
    "userId": 1,
    "name": "Mathematik",
    "shortName": "Mathe",
    "teacherName": "Herr Müller",
    "room": "A101",
    "color": "#3B82F6",
    "description": "Analysis, Algebra",
    "semester": "WS 2024/25",
    "credits": 5,
    "isActive": true,
    "isFavorite": false
  }
]
```

#### Create Subject
```http
POST /api/school/subjects/{userId}
Content-Type: application/json

{
  "name": "Mathematik",
  "shortName": "Mathe",
  "teacherName": "Herr Müller",
  "room": "A101",
  "color": "#3B82F6",
  "semester": "WS 2024/25",
  "credits": 5
}
```

### Timetable (Stundenplan)

#### Get Weekly Timetable
```http
GET /api/school/timetable/{userId}

Response 200:
[
  {
    "id": 1,
    "userId": 1,
    "subjectId": 1,
    "dayOfWeek": 1,  // 1=Monday
    "startTime": "08:00:00",
    "endTime": "09:30:00",
    "room": "A101",
    "teacher": "Herr Müller",
    "notes": null,
    "isActive": true,
    "validFrom": "2024-09-01",
    "validUntil": "2025-02-28"
  }
]
```

#### Get Timetable for Specific Day
```http
GET /api/school/timetable/{userId}/day/{dayOfWeek}
// dayOfWeek: 1=Monday, 2=Tuesday, ..., 7=Sunday
```

### Homework (Hausaufgaben)

#### Get All Homework
```http
GET /api/school/homework/{userId}

Response 200:
[
  {
    "id": 1,
    "userId": 1,
    "subjectId": 1,
    "title": "Kapitel 5 lesen",
    "description": "Seiten 120-145 bearbeiten",
    "dueDate": "2024-10-20",
    "estimatedDurationMinutes": 60,
    "status": "PENDING",  // PENDING, IN_PROGRESS, COMPLETED
    "priority": "MEDIUM",  // LOW, MEDIUM, HIGH, URGENT
    "completedAt": null
  }
]
```

#### Get Pending Homework
```http
GET /api/school/homework/{userId}/status/PENDING
```

#### Get Overdue Homework
```http
GET /api/school/homework/{userId}/overdue
```

#### Create Homework
```http
POST /api/school/homework/{userId}
Content-Type: application/json

{
  "subjectId": 1,
  "title": "Kapitel 5 lesen",
  "description": "Seiten 120-145 bearbeiten",
  "dueDate": "2024-10-20",
  "estimatedDurationMinutes": 60,
  "priority": "MEDIUM"
}
```

#### Update Homework Status
```http
PUT /api/school/homework/{userId}/{homeworkId}
Content-Type: application/json

{
  "status": "COMPLETED"
}
```

### Exams (Prüfungen)

#### Get All Exams
```http
GET /api/school/exams/{userId}

Response 200:
[
  {
    "id": 1,
    "userId": 1,
    "subjectId": 1,
    "title": "Klausur Analysis",
    "examDate": "2024-11-15",
    "startTime": "10:00:00",
    "durationMinutes": 90,
    "location": "A101",
    "examType": "written",  // written, oral, practical, project
    "topics": "Differential, Integral",
    "preparationNotes": "Kapitel 1-5 wiederholen",
    "grade": null,
    "maxPoints": 100.00,
    "achievedPoints": null,
    "isGraded": false
  }
]
```

#### Get Upcoming Exams
```http
GET /api/school/exams/{userId}/upcoming
```

#### Get Ungraded Exams
```http
GET /api/school/exams/{userId}/ungraded
```

#### Create Exam
```http
POST /api/school/exams/{userId}
Content-Type: application/json

{
  "subjectId": 1,
  "title": "Klausur Analysis",
  "examDate": "2024-11-15",
  "startTime": "10:00",
  "durationMinutes": 90,
  "location": "A101",
  "examType": "written",
  "topics": "Differential, Integral"
}
```

#### Update Exam Grade
```http
PUT /api/school/exams/{userId}/{examId}
Content-Type: application/json

{
  "grade": 1.7,
  "achievedPoints": 85.5,
  "isGraded": true
}
```

### Grades (Noten)

#### Get All Grades
```http
GET /api/school/grades/{userId}

Response 200:
[
  {
    "id": 1,
    "userId": 1,
    "subjectId": 1,
    "examId": 1,
    "gradeValue": 1.7,
    "gradeType": "exam",  // exam, oral, homework, project, final
    "weight": 1.0,
    "title": "Klausur Analysis",
    "description": null,
    "receivedDate": "2024-11-20",
    "maxPoints": 100.00,
    "achievedPoints": 85.50,
    "percentage": 85.50,
    "semester": "WS 2024/25"
  }
]
```

#### Get Grades for Subject
```http
GET /api/school/grades/{userId}/subject/{subjectId}
```

#### Get Average Grade for Subject
```http
GET /api/school/grades/{userId}/subject/{subjectId}/average

Response 200:
{
  "subjectId": 1,
  "average": 2.1,
  "gradeCount": 5
}
```

#### Get Overall Average
```http
GET /api/school/grades/{userId}/average

Response 200:
{
  "average": 2.3,
  "gradeCount": 15
}
```

### Study Sessions (Lernzeiten)

#### Get All Study Sessions
```http
GET /api/school/study-sessions/{userId}

Response 200:
[
  {
    "id": 1,
    "userId": 1,
    "subjectId": 1,
    "title": "Prüfungsvorbereitung",
    "description": "Analysis wiederholen",
    "startTime": "2024-10-18T14:00:00",
    "endTime": "2024-10-18T16:30:00",
    "durationMinutes": 150,
    "location": "Bibliothek",
    "studyType": "solo",  // solo, group, tutoring
    "notes": "Sehr produktiv",
    "productivityRating": 4  // 1-5
  }
]
```

#### Get Total Study Time
```http
GET /api/school/study-sessions/{userId}/total-time

Response 200:
{
  "totalMinutes": 1250,
  "totalHours": 20.83
}
```

#### Get Study Time by Subject
```http
GET /api/school/study-sessions/{userId}/subject/{subjectId}/total-time

Response 200:
{
  "subjectId": 1,
  "totalMinutes": 450,
  "totalHours": 7.5
}
```

### Absences (Fehlzeiten)

#### Get All Absences
```http
GET /api/school/absences/{userId}

Response 200:
[
  {
    "id": 1,
    "userId": 1,
    "subjectId": 1,
    "absenceDate": "2024-10-15",
    "startTime": "08:00:00",
    "endTime": "09:30:00",
    "reason": "Krankheit",
    "description": "Grippe",
    "absenceType": "SICK",  // SICK, EXCUSED, UNEXCUSED, VACATION
    "isExcused": true,
    "certificateRequired": true,
    "certificateSubmitted": true,
    "teacherNotified": true,
    "parentNotified": true
  }
]
```

#### Get Absence Statistics
```http
GET /api/school/absences/{userId}/statistics

Response 200:
{
  "totalAbsences": 5,
  "sickDays": 3,
  "excusedDays": 4,
  "unexcusedDays": 1
}
```

---

## 📝 Response Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid credentials)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔒 Authentication

Currently, the API uses simple user ID-based authentication. 
In production, add:
- JWT tokens
- Refresh tokens
- Session management
- Rate limiting

---

## 📊 Pagination

For large datasets, add pagination:
```http
GET /api/school/homework/{userId}?page=0&size=20&sort=dueDate,asc
```

---

## 🎯 Error Responses

Standard error format:
```json
{
  "error": "Error message",
  "timestamp": "2024-10-18T10:30:00",
  "path": "/api/user/123"
}
```

---

## ✅ Health Check

```http
GET /actuator/health

Response 200:
{
  "status": "UP"
}
```
