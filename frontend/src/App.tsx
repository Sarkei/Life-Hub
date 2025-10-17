import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { OAuth2CallbackPage } from './pages/OAuth2CallbackPage'
import DashboardLayout from './components/layout/DashboardLayout'
import PrivateDashboard from './pages/private/Dashboard'
import TodosPage from './pages/private/TodosPage'
import CalendarPage from './pages/private/CalendarPage'
import FitnessPage from './pages/private/FitnessPage'
import WeightPage from './pages/private/WeightPage'
import NutritionPage from './pages/private/NutritionPage'
import WorkDashboard from './pages/work/Dashboard'
import SchoolDashboard from './pages/school/Dashboard'
import { SchoolPage } from './pages/SchoolPage'
import ProfilesPage from './pages/ProfilesPage'
import SettingsPage from './pages/SettingsPage'
import NotesPage from './components/NotesPage'
import GoalsPage from './pages/private/GoalsPage'
import JournalPage from './pages/private/JournalPage'
import ShoppingPage from './pages/private/ShoppingPage'
import HealthPage from './pages/private/HealthPage'
import TravelPage from './pages/private/TravelPage'
import MoviesPage from './pages/private/MoviesPage'
import MusicPage from './pages/private/MusicPage'
import PhotosPage from './pages/private/PhotosPage'
import QuickNotesPage from './pages/private/QuickNotesPage'
import TimeTrackingPage from './pages/private/TimeTrackingPage'
import StatisticsPage from './pages/private/StatisticsPage'
import NewsPage from './pages/private/NewsPage'
import ProjectsPage from './pages/work/ProjectsPage'
import GradesPage from './pages/school/GradesPage'
import HabitsPage from './pages/private/HabitsPage'
import BudgetPage from './pages/private/BudgetPage'

function App() {
  const { token } = useAuthStore()
  
  // DEBUG: Zeige Token-Status
  console.log('App.tsx - Token:', token ? 'EXISTS' : 'NULL')
  console.log('App.tsx - Full state:', useAuthStore.getState())

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
        
        {/* TEMPORÄR: Auth-Check deaktiviert - JEDER kann zugreifen */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/private" replace />} />
          <Route path="profiles" element={<ProfilesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Private Area */}
          <Route path="private" element={<PrivateDashboard />} />
          <Route path="private/todos" element={<TodosPage />} />
          <Route path="private/calendar" element={<CalendarPage />} />
          <Route path="private/fitness" element={<FitnessPage />} />
          <Route path="private/weight" element={<WeightPage />} />
          <Route path="private/nutrition" element={<NutritionPage />} />
          <Route path="private/notes" element={<NotesPage category="privat" />} />
          <Route path="private/habits" element={<HabitsPage />} />
          <Route path="private/budget" element={<BudgetPage />} />
          <Route path="private/goals" element={<GoalsPage />} />
          <Route path="private/journal" element={<JournalPage />} />
          <Route path="private/shopping" element={<ShoppingPage />} />
          <Route path="private/health" element={<HealthPage />} />
          <Route path="private/travel" element={<TravelPage />} />
          <Route path="private/movies" element={<MoviesPage />} />
          <Route path="private/music" element={<MusicPage />} />
          <Route path="private/photos" element={<PhotosPage />} />
          <Route path="private/quick-notes" element={<QuickNotesPage />} />
          <Route path="private/time-tracking" element={<TimeTrackingPage />} />
          <Route path="private/statistics" element={<StatisticsPage />} />
          <Route path="private/news" element={<NewsPage />} />
          
          {/* Work Area */}
          <Route path="work" element={<WorkDashboard />} />
          <Route path="work/todos" element={<TodosPage />} />
          <Route path="work/calendar" element={<CalendarPage />} />
          <Route path="work/notes" element={<NotesPage category="arbeit" />} />
          <Route path="work/time-tracking" element={<TimeTrackingPage />} />
          <Route path="work/projects" element={<ProjectsPage />} />
          
          {/* School Area */}
          <Route path="school" element={<SchoolPage />} />
          <Route path="school/dashboard-old" element={<SchoolDashboard />} />
          <Route path="school/todos" element={<TodosPage />} />
          <Route path="school/calendar" element={<CalendarPage />} />
          <Route path="school/notes" element={<NotesPage category="schule" />} />
          <Route path="school/grades" element={<GradesPage />} />
          <Route path="school/timetable" element={<div className="p-6"><h1 className="text-2xl font-bold">Stundenplan - In Entwicklung</h1><p className="mt-4">Hier kannst du deinen Stundenplan anlegen und verwalten.</p></div>} />
          <Route path="school/homework" element={<div className="p-6"><h1 className="text-2xl font-bold">Hausaufgaben - In Entwicklung</h1><p className="mt-4">Verwalte hier deine Hausaufgaben mit Kanban-Board.</p></div>} />
          <Route path="school/exams" element={<div className="p-6"><h1 className="text-2xl font-bold">Prüfungen - In Entwicklung</h1><p className="mt-4">Plane und tracke deine Prüfungen hier.</p></div>} />
          <Route path="school/subjects" element={<div className="p-6"><h1 className="text-2xl font-bold">Fächer - In Entwicklung</h1><p className="mt-4">Verwalte hier deine Schulfächer.</p></div>} />
          <Route path="school/study-sessions" element={<div className="p-6"><h1 className="text-2xl font-bold">Lernzeiten - In Entwicklung</h1><p className="mt-4">Tracke deine Lernzeiten mit Timer.</p></div>} />
          <Route path="school/absences" element={<div className="p-6"><h1 className="text-2xl font-bold">Fehlzeiten - In Entwicklung</h1><p className="mt-4">Erfasse hier deine Fehlzeiten.</p></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
