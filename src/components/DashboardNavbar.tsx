import { useState } from 'react'
import { Search, User, LogOut, Settings as SettingsIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface DashboardNavbarProps {
  pageTitle?: string
}

export function DashboardNavbar({ pageTitle }: DashboardNavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-heavy">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo and App Name */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-[#4A90E2] flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
              AM
            </div>
            <span className="text-slate-900 font-bold text-xl tracking-tight">
              Agentic AI <span className="text-[#4A90E2]">Meetings</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 ml-6 pl-6 border-l border-slate-200 h-6">
            {pageTitle && (
              <span className="text-slate-900 font-bold text-sm">
                {pageTitle}
              </span>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative group hidden md:block">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-12 pr-4 py-2.5 glass-input rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all text-sm font-medium"
            />
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all"
            >
              <User size={20} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User size={18} />
                  <span className="text-sm font-medium">Profile</span>
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <SettingsIcon size={18} />
                  <span className="text-sm font-medium">Settings</span>
                </Link>
                <div className="my-1 border-t border-slate-100" />
                <button
                  onClick={() => {
                    setShowProfileMenu(false)
                    // Handle logout
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
