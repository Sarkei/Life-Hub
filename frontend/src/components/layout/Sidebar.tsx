import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, CheckSquare, Calendar, Dumbbell, Scale, Apple, 
  Users, Target, BookOpen, ShoppingCart, HeartPulse, Plane, Film, 
  Music, Image, StickyNote, Clock, BarChart3, Newspaper, Trophy,
  Wallet, Briefcase, FolderKanban, GraduationCap, BookMarked,
  ChevronLeft, ChevronRight, Settings, ChevronDown, Home, X
} from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  category: 'general' | 'private' | 'work' | 'school';
  enabled: boolean;
  isNew?: boolean;
}

const defaultSidebarItems: SidebarItem[] = [
  // General
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', category: 'general', enabled: true },
  { id: 'todos', label: 'Aufgaben', icon: CheckSquare, path: '/todos', category: 'general', enabled: true },
  { id: 'calendar', label: 'Kalender', icon: Calendar, path: '/calendar', category: 'general', enabled: true },
  { id: 'profile', label: 'Profile', icon: Users, path: '/profile', category: 'general', enabled: true },
  
  // Private
  { id: 'fitness', label: 'Fitness', icon: Dumbbell, path: '/private/fitness', category: 'private', enabled: false },
  { id: 'weight', label: 'Gewicht', icon: Scale, path: '/private/weight', category: 'private', enabled: false },
  { id: 'nutrition', label: 'Ernährung', icon: Apple, path: '/private/nutrition', category: 'private', enabled: false },
  { id: 'goals', label: 'Ziele', icon: Target, path: '/private/goals', category: 'private', enabled: false, isNew: true },
  { id: 'journal', label: 'Tagebuch', icon: BookOpen, path: '/private/journal', category: 'private', enabled: false, isNew: true },
  { id: 'shopping', label: 'Einkaufsliste', icon: ShoppingCart, path: '/private/shopping', category: 'private', enabled: false, isNew: true },
  { id: 'health', label: 'Gesundheit', icon: HeartPulse, path: '/private/health', category: 'private', enabled: false, isNew: true },
  { id: 'travel', label: 'Reisen', icon: Plane, path: '/private/travel', category: 'private', enabled: false, isNew: true },
  { id: 'movies', label: 'Filme & Serien', icon: Film, path: '/private/movies', category: 'private', enabled: false, isNew: true },
  { id: 'music', label: 'Musik', icon: Music, path: '/private/music', category: 'private', enabled: false, isNew: true },
  { id: 'photos', label: 'Fotos', icon: Image, path: '/private/photos', category: 'private', enabled: false, isNew: true },
  { id: 'quick-notes', label: 'Schnellnotizen', icon: StickyNote, path: '/private/quick-notes', category: 'private', enabled: false, isNew: true },
  { id: 'time-tracking-private', label: 'Zeiterfassung', icon: Clock, path: '/private/time-tracking', category: 'private', enabled: false, isNew: true },
  { id: 'statistics', label: 'Statistiken', icon: BarChart3, path: '/private/statistics', category: 'private', enabled: false, isNew: true },
  { id: 'news', label: 'News Feed', icon: Newspaper, path: '/private/news', category: 'private', enabled: false, isNew: true },
  { id: 'habits', label: 'Gewohnheiten', icon: Trophy, path: '/private/habits', category: 'private', enabled: false, isNew: true },
  { id: 'budget', label: 'Budget', icon: Wallet, path: '/private/budget', category: 'private', enabled: false, isNew: true },
  
  // Work
  { id: 'time-tracking-work', label: 'Zeiterfassung', icon: Clock, path: '/work/time-tracking', category: 'work', enabled: false, isNew: true },
  { id: 'projects', label: 'Projekte', icon: FolderKanban, path: '/work/projects', category: 'work', enabled: false, isNew: true },
  
  // School
  { id: 'grades', label: 'Noten', icon: BookMarked, path: '/school/grades', category: 'school', enabled: false, isNew: true },
];

export default function Sidebar() {
  const userId = useAuthStore((state) => state.userId);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Lade Sidebar-Konfiguration aus Datenbank
  useEffect(() => {
    if (!userId) return;
    
    loadSidebarConfig();

    // Mobile Detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [userId]);

  const loadSidebarConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/sidebar/${userId}`);
      const config = response.data;

      // Mapping: Backend-Felder -> Frontend-Items
      const updatedItems = defaultSidebarItems.map(item => {
        const fieldMap: Record<string, keyof typeof config> = {
          'dashboard': 'dashboard',
          'todos': 'todos',
          'calendar': 'calendar',
          'profile': 'contacts',
          'fitness': 'fitness',
          'weight': 'weight',
          'nutrition': 'nutrition',
          'goals': 'goals',
          'journal': 'diary',
          'shopping': 'shopping',
          'health': 'health',
          'travel': 'travel',
          'movies': 'movies',
          'music': 'music',
          'photos': 'photos',
          'quick-notes': 'quickNotes',
          'time-tracking-private': 'timeTracking',
          'statistics': 'statistics',
          'news': 'news',
          'habits': 'habits',
          'budget': 'budget',
          'time-tracking-work': 'timeTracking',
          'projects': 'projects',
          'grades': 'grades',
        };

        const backendField = fieldMap[item.id];
        if (backendField && config[backendField] !== undefined) {
          return { ...item, enabled: config[backendField] };
        }
        return item;
      });

      setSidebarItems(updatedItems);
    } catch (error) {
      console.error('Fehler beim Laden der Sidebar-Konfiguration:', error);
      // Fallback auf Default-Items
      setSidebarItems(defaultSidebarItems);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (items: SidebarItem[]) => {
    setSidebarItems(items);

    // Speichere in Datenbank (KEIN Browser-Cache!)
    if (!userId) return;

    try {
      const updates: Record<string, boolean> = {};
      items.forEach(item => {
        const fieldMap: Record<string, string> = {
          'dashboard': 'dashboard',
          'todos': 'todos',
          'calendar': 'calendar',
          'profile': 'contacts',
          'fitness': 'fitness',
          'weight': 'weight',
          'nutrition': 'nutrition',
          'goals': 'goals',
          'journal': 'diary',
          'shopping': 'shopping',
          'health': 'health',
          'travel': 'travel',
          'movies': 'movies',
          'music': 'music',
          'photos': 'photos',
          'quick-notes': 'quickNotes',
          'time-tracking-private': 'timeTracking',
          'statistics': 'statistics',
          'news': 'news',
          'habits': 'habits',
          'budget': 'budget',
          'time-tracking-work': 'timeTracking',
          'projects': 'projects',
          'grades': 'grades',
        };

        const backendField = fieldMap[item.id];
        if (backendField) {
          updates[backendField] = item.enabled;
        }
      });

      await axios.post(`http://localhost:8080/api/sidebar/${userId}`, updates);
    } catch (error) {
      console.error('Fehler beim Speichern der Sidebar-Konfiguration:', error);
    }
  };

  const toggleItem = (id: string) => {
    const newItems = sidebarItems.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    saveConfig(newItems);
  };

  const resetToDefaults = async () => {
    if (!userId) return;

    try {
      const response = await axios.post(`http://localhost:8080/api/sidebar/${userId}/reset`);
      const config = response.data;

      // Aktualisiere Items mit Reset-Werten
      const updatedItems = defaultSidebarItems.map(item => {
        const fieldMap: Record<string, keyof typeof config> = {
          'dashboard': 'dashboard',
          'todos': 'todos',
          'calendar': 'calendar',
          'profile': 'contacts',
          'fitness': 'fitness',
          'weight': 'weight',
          'nutrition': 'nutrition',
          'goals': 'goals',
          'journal': 'diary',
          'shopping': 'shopping',
          'health': 'health',
          'travel': 'travel',
          'movies': 'movies',
          'music': 'music',
          'photos': 'photos',
          'quick-notes': 'quickNotes',
          'time-tracking-private': 'timeTracking',
          'statistics': 'statistics',
          'news': 'news',
          'habits': 'habits',
          'budget': 'budget',
          'time-tracking-work': 'timeTracking',
          'projects': 'projects',
          'grades': 'grades',
        };

        const backendField = fieldMap[item.id];
        if (backendField && config[backendField] !== undefined) {
          return { ...item, enabled: config[backendField] };
        }
        return item;
      });

      setSidebarItems(updatedItems);
    } catch (error) {
      console.error('Fehler beim Zurücksetzen:', error);
    }
  };

  const generalItems = sidebarItems.filter(item => item.category === 'general' && item.enabled);
  const privateItems = sidebarItems.filter(item => item.category === 'private' && item.enabled);
  const workItems = sidebarItems.filter(item => item.category === 'work' && item.enabled);
  const schoolItems = sidebarItems.filter(item => item.category === 'school' && item.enabled);

  const getCurrentPageInfo = () => {
    const currentItem = sidebarItems.find(item => item.path === location.pathname);
    return currentItem || { label: 'Dashboard', icon: LayoutDashboard };
  };

  const currentPage = getCurrentPageInfo();

  // Mobile Top Bar
  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 flex items-center px-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-3 flex-1 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <currentPage.icon size={24} className="text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-lg">{currentPage.label}</span>
            <ChevronDown 
              size={20} 
              className={`ml-auto transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="fixed top-16 left-0 right-0 bottom-0 z-40">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Dropdown Content */}
            <div className="absolute top-0 left-0 right-0 max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="p-4">
                {/* General Section */}
                {generalItems.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      <Home size={16} />
                      Allgemein
                    </div>
                    <div className="space-y-1">
                      {generalItems.map(item => (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`
                          }
                        >
                          <item.icon size={20} />
                          <span>{item.label}</span>
                          {item.isNew && (
                            <span className="ml-auto text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                              NEU
                            </span>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}

                {/* Private Section */}
                {privateItems.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      <Home size={16} />
                      Privat
                    </div>
                    <div className="space-y-1">
                      {privateItems.map(item => (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`
                          }
                        >
                          <item.icon size={20} />
                          <span>{item.label}</span>
                          {item.isNew && (
                            <span className="ml-auto text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                              NEU
                            </span>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Section */}
                {workItems.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      <Briefcase size={16} />
                      Arbeit
                    </div>
                    <div className="space-y-1">
                      {workItems.map(item => (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`
                          }
                        >
                          <item.icon size={20} />
                          <span>{item.label}</span>
                          {item.isNew && (
                            <span className="ml-auto text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                              NEU
                            </span>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}

                {/* School Section */}
                {schoolItems.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      <GraduationCap size={16} />
                      Schule
                    </div>
                    <div className="space-y-1">
                      {schoolItems.map(item => (
                        <NavLink
                          key={item.id}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`
                          }
                        >
                          <item.icon size={20} />
                          <span>{item.label}</span>
                          {item.isNew && (
                            <span className="ml-auto text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                              NEU
                            </span>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}

                {/* Settings Button */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowEditModal(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Settings size={20} />
                  <span>Seitenleiste anpassen</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <>
      <aside className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} overflow-y-auto z-40`}>
        {/* Header */}
        <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4'} border-b border-gray-200 dark:border-gray-700`}>
          {!isCollapsed && <h1 className="text-xl font-bold">Life Hub</h1>}
          <div className="flex gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isCollapsed ? 'Erweitern' : 'Verkleinern'}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            {!isCollapsed && (
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Seitenleiste anpassen"
              >
                <Settings size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          {/* General Items */}
          {generalItems.length > 0 && (
            <div className="mb-2">
              {/* Category Header - Always Visible */}
              <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center py-2' : 'px-4 py-2'} text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase`}>
                {isCollapsed ? (
                  <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 rounded" title="Allgemein" />
                ) : (
                  <>
                    <Home size={14} />
                    Allgemein
                  </>
                )}
              </div>
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
            <div className="mb-2">
              {/* Category Separator - Always Visible */}
              <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center py-2' : 'px-4 py-2'} text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-4`}>
                {isCollapsed ? (
                  <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 rounded" title="Privat" />
                ) : (
                  <>
                    <Home size={14} />
                    Privat
                  </>
                )}
              </div>
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
            <div className="mb-2">
              {/* Category Separator - Always Visible */}
              <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center py-2' : 'px-4 py-2'} text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-4`}>
                {isCollapsed ? (
                  <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 rounded" title="Arbeit" />
                ) : (
                  <>
                    <Briefcase size={14} />
                    Arbeit
                  </>
                )}
              </div>
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
            <div className="mb-2">
              {/* Category Separator - Always Visible */}
              <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center py-2' : 'px-4 py-2'} text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-4`}>
                {isCollapsed ? (
                  <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 rounded" title="Schule" />
                ) : (
                  <>
                    <GraduationCap size={14} />
                    Schule
                  </>
                )}
              </div>
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
                <Home size={20} />
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
  );
}
