import { Moon, Sun, LogOut, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useProfileStore } from '../../store/profileStore'

export default function Header() {
  const [darkMode, setDarkMode] = useState(true)
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

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {currentProfile ? `${currentProfile.name}'s Bereich` : 'Life Hub'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Eingeloggt als {username}
          </p>
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
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Einstellungen"
          >
            <Settings size={20} />
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600"
            title="Abmelden"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
