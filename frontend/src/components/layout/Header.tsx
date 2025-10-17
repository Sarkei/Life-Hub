import { Moon, Sun, LogOut, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useProfileStore } from '../../store/profileStore'

export default function Header() {
  const [darkMode, setDarkMode] = useState(true)
  const navigate = useNavigate()
  const { username, logout } = useAuthStore()
  const { currentProfile } = useProfileStore()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/icon.ico" 
            alt="Life Hub Logo" 
            className="w-8 h-8 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          />
          <div>
            <h2 
              className="text-xl font-semibold cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => navigate('/dashboard')}
            >
              {currentProfile ? `${currentProfile.name}'s Bereich` : 'Life Hub'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Eingeloggt als <span className="font-medium">{username || 'Unbekannt'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={handleSettings}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Einstellungen"
          >
            <Settings size={20} />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 hover:text-red-700 dark:hover:text-red-500"
            title="Abmelden"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
