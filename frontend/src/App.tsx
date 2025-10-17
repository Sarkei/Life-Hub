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
import MealsPage from './pages/private/MealsPage'
import WorkDashboard from './pages/work/Dashboard'
import SchoolDashboard from './pages/school/Dashboard'
import ProfilesPage from './pages/ProfilesPage'
import SettingsPage from './pages/SettingsPage'

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
          <Route path="private/meals" element={<MealsPage />} />
          
          {/* Work Area */}
          <Route path="work" element={<WorkDashboard />} />
          <Route path="work/todos" element={<TodosPage />} />
          <Route path="work/calendar" element={<CalendarPage />} />
          
          {/* School Area */}
          <Route path="school" element={<SchoolDashboard />} />
          <Route path="school/todos" element={<TodosPage />} />
          <Route path="school/calendar" element={<CalendarPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
