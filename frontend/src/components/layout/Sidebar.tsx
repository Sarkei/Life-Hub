import { NavLink } from 'react-router-dom'
import { useState } from 'react'
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
  ChevronRight
} from 'lucide-react'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col h-screen sticky top-0`}>
      {/* Header mit Toggle Button */}
      <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold text-primary-600">Life Hub</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-auto"
          title={isCollapsed ? 'Seitenleiste erweitern' : 'Seitenleiste verkleinern'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="px-4 space-y-2 flex-1 overflow-y-auto py-4">
        <div className="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
          <NavLink 
            to="/profiles" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Profile' : ''}
          >
            <Users size={20} />
            {!isCollapsed && <span>Profile</span>}
          </NavLink>
        </div>

        <div>
          {!isCollapsed && (
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Privat
            </div>
          )}
          <NavLink 
            to="/private" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Dashboard' : ''}
          >
            <Home size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>
          <NavLink 
            to="/private/todos" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Todos' : ''}
          >
            <CheckSquare size={20} />
            {!isCollapsed && <span>Todos</span>}
          </NavLink>
          <NavLink 
            to="/private/calendar" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Kalender' : ''}
          >
            <Calendar size={20} />
            {!isCollapsed && <span>Kalender</span>}
          </NavLink>
          <NavLink 
            to="/private/fitness" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Fitness' : ''}
          >
            <Dumbbell size={20} />
            {!isCollapsed && <span>Fitness</span>}
          </NavLink>
          <NavLink 
            to="/private/weight" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Gewicht' : ''}
          >
            <Weight size={20} />
            {!isCollapsed && <span>Gewicht</span>}
          </NavLink>
          <NavLink 
            to="/private/meals" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Ernährung' : ''}
          >
            <Utensils size={20} />
            {!isCollapsed && <span>Ernährung</span>}
          </NavLink>
        </div>

        <div className="pt-4">
          {!isCollapsed && (
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Arbeit
            </div>
          )}
          <NavLink 
            to="/work" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Arbeit Dashboard' : ''}
          >
            <Briefcase size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>
          <NavLink 
            to="/work/todos" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Arbeit Todos' : ''}
          >
            <CheckSquare size={20} />
            {!isCollapsed && <span>Todos</span>}
          </NavLink>
          <NavLink 
            to="/work/calendar" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Arbeit Kalender' : ''}
          >
            <Calendar size={20} />
            {!isCollapsed && <span>Kalender</span>}
          </NavLink>
        </div>

        <div className="pt-4">
          {!isCollapsed && (
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Schule
            </div>
          )}
          <NavLink 
            to="/school" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Schule Dashboard' : ''}
          >
            <GraduationCap size={20} />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>
          <NavLink 
            to="/school/todos" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Schule Todos' : ''}
          >
            <CheckSquare size={20} />
            {!isCollapsed && <span>Todos</span>}
          </NavLink>
          <NavLink 
            to="/school/calendar" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? 'Schule Kalender' : ''}
          >
            <Calendar size={20} />
            {!isCollapsed && <span>Kalender</span>}
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}
