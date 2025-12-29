import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './Button'
export function Navigation() {
  const [showAgentsDropdown, setShowAgentsDropdown] = useState(false)
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#1A73E8] flex items-center justify-center text-white font-semibold text-sm">
            AM
          </div>
          <span className="text-[#202124] font-medium text-lg">
            Agentic AI for Meetings
          </span>
        </Link>

        {/* Center Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-[#1A73E8]' : 'text-[#5F6368] hover:text-[#202124]'}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-[#1A73E8]' : 'text-[#5F6368] hover:text-[#202124]'}`}
          >
            About
          </Link>

          {/* Agents Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowAgentsDropdown(true)}
            onMouseLeave={() => setShowAgentsDropdown(false)}
          >
            <Link
              to="/agents"
              className={`text-sm font-medium transition-colors ${isActive('/agents') ? 'text-[#1A73E8]' : 'text-[#5F6368] hover:text-[#202124]'}`}
            >
              Agents
            </Link>

            {showAgentsDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 backdrop-blur-sm">
                <Link
                  to="/agents#notes-summary-agent"
                  className="block px-4 py-3 hover:bg-[#F1F3F4] transition-colors"
                >
                  <div className="font-medium text-[#202124] text-sm">
                    Meeting Notes & Summary Agent
                  </div>
                  <div className="text-xs text-[#5F6368] mt-1">
                    Listens to meetings and gives you notes + summary.
                  </div>
                </Link>
                <Link
                  to="/agents#task-reminder-agent"
                  className="block px-4 py-3 hover:bg-[#F1F3F4] transition-colors"
                >
                  <div className="font-medium text-[#202124] text-sm">
                    Task & Reminder Agent
                  </div>
                  <div className="text-xs text-[#5F6368] mt-1">
                    Assigns tasks to members and sends reminders &
                    notifications.
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-[#1A73E8]' : 'text-[#5F6368] hover:text-[#202124]'}`}
          >
            Contact Us
          </Link>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="text">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary">Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
