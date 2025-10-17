# 🔧 Sidebar Frontend Update

## Problem

Sidebar zeigt nur 2 School-Features:
- ❌ "Schule" (Overview)
- ❌ "Noten" (Grades)

Aber wir haben **13 School-Features** in der Datenbank!

---

## Lösung

### 1. **Neue Icons importieren**

```tsx
import { 
  CalendarDays, ClipboardList, FileText, TrendingUp, FileBox,
  Upload, FolderOpen, CreditCard, Brain, FileEdit, Timer, UserX
} from 'lucide-react';
```

### 2. **School-Items erweitern (13 Features)**

```tsx
// School
{ id: 'school', label: 'Schule Übersicht', icon: GraduationCap, path: '/school', category: 'school', enabled: true },
{ id: 'school-subjects', label: 'Fächer', icon: BookOpen, path: '/school/subjects', category: 'school', enabled: true },
{ id: 'school-timetable', label: 'Stundenplan', icon: CalendarDays, path: '/school/timetable', category: 'school', enabled: true },
{ id: 'school-homework', label: 'Hausaufgaben', icon: ClipboardList, path: '/school/homework', category: 'school', enabled: true },
{ id: 'school-exams', label: 'Prüfungen', icon: FileText, path: '/school/exams', category: 'school', enabled: true },
{ id: 'school-grades', label: 'Noten', icon: TrendingUp, path: '/school/grades', category: 'school', enabled: true },
{ id: 'school-notes', label: 'Notizen', icon: StickyNote, path: '/school/notes', category: 'school', enabled: true },
{ id: 'school-materials', label: 'Materialien', icon: FileBox, path: '/school/materials', category: 'school', enabled: false },
{ id: 'school-submissions', label: 'Abgaben', icon: Upload, path: '/school/submissions', category: 'school', enabled: true },
{ id: 'school-projects', label: 'Projekte', icon: FolderOpen, path: '/school/projects', category: 'school', enabled: false },
{ id: 'school-flashcards', label: 'Karteikarten', icon: CreditCard, path: '/school/flashcards', category: 'school', enabled: false },
{ id: 'school-summaries', label: 'Zusammenfassungen', icon: FileEdit, path: '/school/summaries', category: 'school', enabled: false },
{ id: 'school-study-sessions', label: 'Lernsessions', icon: Timer, path: '/school/study-sessions', category: 'school', enabled: true },
{ id: 'school-absences', label: 'Fehlzeiten', icon: UserX, path: '/school/absences', category: 'school', enabled: true },
```

### 3. **Field-Mapping aktualisieren (3 Stellen)**

#### A) `loadSidebarConfig()`:
```tsx
const fieldMap: Record<string, keyof typeof config> = {
  // ... existing mappings ...
  'school': 'showSchool',
  'school-subjects': 'showSchoolSubjects',
  'school-timetable': 'showSchoolTimetable',
  'school-homework': 'showSchoolHomework',
  'school-exams': 'showSchoolExams',
  'school-grades': 'showSchoolGrades',
  'school-notes': 'showSchoolNotes',
  'school-materials': 'showSchoolMaterials',
  'school-submissions': 'showSchoolSubmissions',
  'school-projects': 'showSchoolProjects',
  'school-flashcards': 'showSchoolFlashcards',
  'school-summaries': 'showSchoolSummaries',
  'school-study-sessions': 'showSchoolStudySessions',
  'school-absences': 'showSchoolAbsences',
};
```

#### B) `saveConfig()`:
```tsx
const fieldMap: Record<string, string> = {
  // ... existing mappings ...
  'school': 'showSchool',
  'school-subjects': 'showSchoolSubjects',
  'school-timetable': 'showSchoolTimetable',
  'school-homework': 'showSchoolHomework',
  'school-exams': 'showSchoolExams',
  'school-grades': 'showSchoolGrades',
  'school-notes': 'showSchoolNotes',
  'school-materials': 'showSchoolMaterials',
  'school-submissions': 'showSchoolSubmissions',
  'school-projects': 'showSchoolProjects',
  'school-flashcards': 'showSchoolFlashcards',
  'school-summaries': 'showSchoolSummaries',
  'school-study-sessions': 'showSchoolStudySessions',
  'school-absences': 'showSchoolAbsences',
};
```

#### C) `resetToDefaults()`:
```tsx
const fieldMap: Record<string, keyof typeof config> = {
  // ... existing mappings ...
  'school': 'showSchool',
  'school-subjects': 'showSchoolSubjects',
  'school-timetable': 'showSchoolTimetable',
  'school-homework': 'showSchoolHomework',
  'school-exams': 'showSchoolExams',
  'school-grades': 'showSchoolGrades',
  'school-notes': 'showSchoolNotes',
  'school-materials': 'showSchoolMaterials',
  'school-submissions': 'showSchoolSubmissions',
  'school-projects': 'showSchoolProjects',
  'school-flashcards': 'showSchoolFlashcards',
  'school-summaries': 'showSchoolSummaries',
  'school-study-sessions': 'showSchoolStudySessions',
  'school-absences': 'showSchoolAbsences',
};
```

---

## Nächste Schritte

Nach der Sidebar-Aktualisierung:

1. **Routes erstellen** für alle 13 School-Pages
2. **Components erstellen** für jede School-Page
3. **API-Integration** für CRUD-Operationen

---

## Status

- ✅ Icons importiert
- ✅ 13 School-Items hinzugefügt
- ⏳ Field-Mappings aktualisieren (3 Stellen)
- ⏳ Routes erstellen
- ⏳ Components erstellen
