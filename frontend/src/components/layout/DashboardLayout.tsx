import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      {/* Desktop Layout - with left margin for sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header />
        {/* Mobile - Add top padding for top bar, Desktop - normal padding */}
        <main className="flex-1 overflow-y-auto p-6 pt-20 md:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
