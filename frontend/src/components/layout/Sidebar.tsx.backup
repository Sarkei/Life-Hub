import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  Dumbbell, 
  Weight,
  Utensils,
  Briefcase,
  GraduationCap,
  Users,
  ChevronLeft,
  ChevronRight,
  FileText,
  TrendingUp,
  DollarSign,
  BookOpen,
  Settings,
  X,
  Target,
  Book,
  ShoppingCart,
  Heart,
  Plane,
  Film,
  Music,
  Camera,
  Zap,
  Clock,
  BarChart3,
  Newspaper
} from 'lucide-react'

interface SidebarItem {
  id: string
  label: string
  icon: any
  path: string
  category: 'private' | 'work' | 'school' | 'general'
  enabled: boolean
  isNew?: boolean
}

const defaultSidebarItems: SidebarItem[] = [
  // General
  { id: 'profiles', label: 'Profile', icon: Users, path: '/profiles', category: 'general', enabled: true },
  
  // Private
  { id: 'private-dashboard', label: 'Dashboard', icon: Home, path: '/private', category: 'private', enabled: true },
  { id: 'private-todos', label: 'Todos', icon: CheckSquare, path: '/private/todos', category: 'private', enabled: true },
  { id: 'private-calendar', label: 'Kalender', icon: Calendar, path: '/private/calendar', category: 'private', enabled: true },
  { id: 'private-fitness', label: 'Fitness', icon: Dumbbell, path: '/private/fitness', category: 'private', enabled: true },
  { id: 'private-weight', label: 'Gewicht', icon: Weight, path: '/private/weight', category: 'private', enabled: true },
  { id: 'private-meals', label: 'Ernährung', icon: Utensils, path: '/private/meals', category: 'private', enabled: true },
  { id: 'private-notes', label: 'Notizen', icon: FileText, path: '/private/notes', category: 'private', enabled: true },
  { id: 'private-habits', label: 'Gewohnheiten', icon: TrendingUp, path: '/private/habits', category: 'private', enabled: true },
  { id: 'private-budget', label: 'Budget', icon: DollarSign, path: '/private/budget', category: 'private', enabled: true },
  { id: 'private-goals', label: 'Ziele', icon: Target, path: '/private/goals', category: 'private', enabled: false, isNew: true },
  { id: 'private-journal', label: 'Tagebuch', icon: Book, path: '/private/journal', category: 'private', enabled: false, isNew: true },
  { id: 'private-shopping', label: 'Einkaufsliste', icon: ShoppingCart, path: '/private/shopping', category: 'private', enabled: false, isNew: true },
  { id: 'private-health', label: 'Gesundheit', icon: Heart, path: '/private/health', category: 'private', enabled: false, isNew: true },
  { id: 'private-travel', label: 'Reisen', icon: Plane, path: '/private/travel', category: 'private', enabled: false, isNew: true },
  { id: 'private-movies', label: 'Filme & Serien', icon: Film, path: '/private/movies', category: 'private', enabled: false, isNew: true },
  { id: 'private-music', label: 'Musik', icon: Music, path: '/private/music', category: 'private', enabled: false, isNew: true },
  { id: 'private-photos', label: 'Fotos', icon: Camera, path: '/private/photos', category: 'private', enabled: false, isNew: true },
  { id: 'private-quick-notes', label: 'Schnellnotizen', icon: Zap, path: '/private/quick-notes', category: 'private', enabled: false, isNew: true },
  { id: 'private-time-tracking', label: 'Zeiterfassung', icon: Clock, path: '/private/time-tracking', category: 'private', enabled: false, isNew: true },
  { id: 'private-statistics', label: 'Statistiken', icon: BarChart3, path: '/private/statistics', category: 'private', enabled: false, isNew: true },
  { id: 'private-news', label: 'News', icon: Newspaper, path: '/private/news', category: 'private', enabled: false, isNew: true },
  
  // Work
  { id: 'work-dashboard', label: 'Dashboard', icon: Briefcase, path: '/work', category: 'work', enabled: true },
  { id: 'work-todos', label: 'Todos', icon: CheckSquare, path: '/work/todos', category: 'work', enabled: true },
  { id: 'work-calendar', label: 'Kalender', icon: Calendar, path: '/work/calendar', category: 'work', enabled: true },
  { id: 'work-notes', label: 'Notizen', icon: FileText, path: '/work/notes', category: 'work', enabled: true },
  { id: 'work-time-tracking', label: 'Zeiterfassung', icon: Clock, path: '/work/time-tracking', category: 'work', enabled: false, isNew: true },
  { id: 'work-projects', label: 'Projekte', icon: Target, path: '/work/projects', category: 'work', enabled: false, isNew: true },
  
  // School
  { id: 'school-dashboard', label: 'Dashboard', icon: GraduationCap, path: '/school', category: 'school', enabled: true },
  { id: 'school-todos', label: 'Todos', icon: CheckSquare, path: '/school/todos', category: 'school', enabled: true },
  { id: 'school-calendar', label: 'Kalender', icon: Calendar, path: '/school/calendar', category: 'school', enabled: true },
  { id: 'school-notes', label: 'Notizen', icon: BookOpen, path: '/school/notes', category: 'school', enabled: true },
  { id: 'school-grades', label: 'Noten', icon: BarChart3, path: '/school/grades', category: 'school', enabled: false, isNew: true },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>(defaultSidebarItems)

  // Load saved configuration from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarConfig')
    if (saved) {
      try {
        const config = JSON.parse(saved)
        setSidebarItems(config)
      } catch (error) {
        console.error('Error loading sidebar config:', error)
      }
    }
  }, [])

  // Save configuration to localStorage
  const saveConfig = (items: SidebarItem[]) => {
    setSidebarItems(items)
    localStorage.setItem('sidebarConfig', JSON.stringify(items))
  }

  const toggleItem = (id: string) => {
    const updated = sidebarItems.map(item =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    )
    saveConfig(updated)
  }

  const resetToDefaults = () => {
    saveConfig(defaultSidebarItems)
    setShowEditModal(false)
  }

  const enabledItems = sidebarItems.filter(item => item.enabled)
  const generalItems = enabledItems.filter(item => item.category === 'general')
  const privateItems = enabledItems.filter(item => item.category === 'private')
  const workItems = enabledItems.filter(item => item.category === 'work')
  const schoolItems = enabledItems.filter(item => item.category === 'school')

  return (
    <>
      <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col h-screen sticky top-0`}>
        {/* Header mit Toggle & Edit Buttons */}
        <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <h1 className="text-2xl font-bold text-primary-600">Life Hub</h1>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {!isCollapsed && (
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Seitenleiste bearbeiten"
              >
                <Settings size={20} />
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isCollapsed ? 'Seitenleiste erweitern' : 'Seitenleiste verkleinern'}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        <nav className="px-4 space-y-2 flex-1 overflow-y-auto py-4">
          {/* General Items */}
          {generalItems.length > 0 && (
            <div className="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
              {generalItems.map(item => (
                <NavLink 
                  key={item.id}
                  to={item.path} 
                  className={({ isActive }) => 
                    `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon size={20} />
                  {!isCollapsed && (
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.isNew && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">NEU</span>}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}

          {/* Private Items */}
          {privateItems.length > 0 && (
            <div>
              {!isCollapsed && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Privat
                </div>
              )}
              {privateItems.map(item => (
                <NavLink 
                  key={item.id}
                  to={item.path} 
                  className={({ isActive }) => 
                    `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon size={20} />
                  {!isCollapsed && (
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.isNew && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">NEU</span>}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}

          {/* Work Items */}
          {workItems.length > 0 && (
            <div className="pt-4">
              {!isCollapsed && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Arbeit
                </div>
              )}
              {workItems.map(item => (
                <NavLink 
                  key={item.id}
                  to={item.path} 
                  className={({ isActive }) => 
                    `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon size={20} />
                  {!isCollapsed && (
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.isNew && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">NEU</span>}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}

          {/* School Items */}
          {schoolItems.length > 0 && (
            <div className="pt-4">
              {!isCollapsed && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Schule
                </div>
              )}
              {schoolItems.map(item => (
                <NavLink 
                  key={item.id}
                  to={item.path} 
                  className={({ isActive }) => 
                    `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon size={20} />
                  {!isCollapsed && (
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.isNew && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">NEU</span>}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
      </aside>

      {/* Edit Sidebar Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Seitenleiste anpassen</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Wähle die Features aus, die in deiner Seitenleiste angezeigt werden sollen. 
              Neue Features sind mit einem <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">NEU</span> Badge markiert.
            </p>

            {/* General Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users size={20} />
                Allgemein
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sidebarItems.filter(item => item.category === 'general').map(item => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleItem(item.id)}
                      className="rounded"
                    />
                    <item.icon size={18} className="text-gray-600 dark:text-gray-400" />
                    <span className="flex-1">{item.label}</span>
                    {item.isNew && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">NEU</span>}
                  </label>
                ))}
              </div>
            </div>

            {/* Private Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Home size={20} />
                Privat
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sidebarItems.filter(item => item.category === 'private').map(item => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleItem(item.id)}
                      className="rounded"
                    />
                    <item.icon size={18} className="text-gray-600 dark:text-gray-400" />
                    <span className="flex-1">{item.label}</span>
                    {item.isNew && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">NEU</span>}
                  </label>
                ))}
              </div>
            </div>

            {/* Work Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase size={20} />
                Arbeit
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sidebarItems.filter(item => item.category === 'work').map(item => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleItem(item.id)}
                      className="rounded"
                    />
                    <item.icon size={18} className="text-gray-600 dark:text-gray-400" />
                    <span className="flex-1">{item.label}</span>
                    {item.isNew && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">NEU</span>}
                  </label>
                ))}
              </div>
            </div>

            {/* School Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap size={20} />
                Schule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sidebarItems.filter(item => item.category === 'school').map(item => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => toggleItem(item.id)}
                      className="rounded"
                    />
                    <item.icon size={18} className="text-gray-600 dark:text-gray-400" />
                    <span className="flex-1">{item.label}</span>
                    {item.isNew && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">NEU</span>}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button onClick={resetToDefaults} className="btn-secondary flex-1">
                Auf Standard zurücksetzen
              </button>
              <button onClick={() => setShowEditModal(false)} className="btn-primary flex-1">
                Fertig
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
