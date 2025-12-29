
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Video,
  Calendar,
  CheckSquare,
  Bell,
  Settings,
  User,
} from 'lucide-react'

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: Video,
    label: 'Meetings',
    path: '/dashboard/meetings',
  },
  {
    icon: Calendar,
    label: 'Calendar',
    path: '/dashboard/calendar',
  },
  {
    icon: CheckSquare,
    label: 'Tasks',
    path: '/dashboard/tasks',
  },
  {
    icon: Bell,
    label: 'Notifications',
    path: '/dashboard/notifications',
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/dashboard/settings',
  },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 glass-heavy z-30 overflow-y-auto">
      <nav className="p-4 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group
                ${isActive
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <Icon
                size={20}
                className={`transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}

        <div className="mt-8 pt-8 border-t border-slate-100 mb-2">
          <Link
            to="/dashboard/profile"
            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium group
                ${location.pathname === '/dashboard/profile'
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }
              `}
          >
            <User
              size={20}
              className={`transition-colors ${location.pathname === '/dashboard/profile' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}
            />
            <span>Profile</span>
          </Link>
        </div>
      </nav>
    </aside>
  )
}
