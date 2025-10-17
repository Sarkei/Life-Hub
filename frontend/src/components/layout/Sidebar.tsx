import { NavLink } from 'react-router-dom'
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  Dumbbell, 
  Weight,
  Utensils,
  Briefcase,
  GraduationCap,
  Users
} from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600">Life Hub</h1>
      </div>

      <nav className="px-4 space-y-2">
        <div className="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
          <NavLink to="/profiles" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }>
            <Users size={20} />
            <span>Profile</span>
          </NavLink>
        </div>

        <div>
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Privat
          </div>
          <NavLink to="/private" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }>
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/private/todos" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }>
            <CheckSquare size={20} />
            <span>Todos</span>
          </NavLink>
          <NavLink to="/private/calendar" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }>
            <Calendar size={20} />
            <span>Kalender</span>
          </NavLink>
          <NavLink to="/private/fitness" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }>
            <Dumbbell size={20} />
            <span>Fitness</span>
          </NavLink>
          <NavLink to="/private/weight" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }>
            <Weight size={20} />
            <span>Gewicht</span>
          </NavLink>
          <NavLink to="/private/meals" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }>
            <Utensils size={20} />
            <span>Ernährung</span>
          </NavLink>
        </div>

        <div className="pt-4">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Arbeit
          </div>
          <NavLink to="/work" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }>
            <Briefcase size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/work/todos" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }>
            <CheckSquare size={20} />
            <span>Todos</span>
          </NavLink>
          <NavLink to="/work/calendar" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }>
            <Calendar size={20} />
            <span>Kalender</span>
          </NavLink>
        </div>

        <div className="pt-4">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Schule
          </div>
          <NavLink to="/school" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }>
            <GraduationCap size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/school/todos" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }>
            <CheckSquare size={20} />
            <span>Todos</span>
          </NavLink>
          <NavLink to="/school/calendar" className={({ isActive }) => 
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }>
            <Calendar size={20} />
            <span>Kalender</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}
