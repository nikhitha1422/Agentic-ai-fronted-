
import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { FileText, CheckSquare, Clock, Loader2, Bell } from 'lucide-react'
import { API_URL } from '../../services/api'
import { Link } from 'react-router-dom'

interface Notification {
  _id: string;
  type: 'summary' | 'task' | 'reminder' | 'system';
  title: string;
  message: string;
  time?: string;
  unread: boolean;
  link?: string;
  createdAt: string;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifs = () => {
    fetch(`${API_URL}/notifications`)
      .then(res => res.json())
      .then(data => {
        setNotifications(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching notifications:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchNotifs()
  }, [])

  const markAsRead = (id: string) => {
    fetch(`${API_URL}/notifications/${id}`, { method: 'PATCH' })
      .then(() => {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, unread: false } : n))
      })
  }

  const readAll = () => {
    fetch(`${API_URL}/notifications/read-all`, { method: 'POST' })
      .then(() => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
      })
  }

  const dismiss = (id: string) => {
    fetch(`${API_URL}/notifications/${id}`, { method: 'DELETE' })
      .then(() => {
        setNotifications(prev => prev.filter(n => n._id !== id))
      })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'summary': return FileText;
      case 'task': return CheckSquare;
      default: return Clock;
    }
  }

  if (loading) {
    return (
      <DashboardLayout pageTitle="Notifications">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }
  return (
    <DashboardLayout pageTitle="Notifications">
      <div className="max-w-4xl mx-auto space-y-8 text-slate-900 font-inter">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Notifications
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Stay updated with your latest alerts and tasks.
            </p>
          </div>
          <button
            onClick={readAll}
            className="px-6 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-[0.98]"
          >
            Mark all read
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-[1.5rem] border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.type)
            const isUnread = notification.unread
            return (
              <div
                key={notification._id}
                onMouseEnter={() => isUnread && markAsRead(notification._id)}
                className={`p-6 hover:bg-slate-50/50 transition-all group relative ${isUnread ? 'bg-blue-50/30' : ''}`}
              >
                {isUnread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-sm ${notification.type === 'summary' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                      notification.type === 'task' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                        'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-base font-bold transition-colors ${isUnread ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs font-medium text-slate-400 whitespace-nowrap ml-4">
                        {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}
                      </span>
                    </div>
                    <p className={`text-sm ${isUnread ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                      {notification.message}
                    </p>
                    <div className="pt-2 flex items-center gap-4">
                      {notification.link && (
                        <Link
                          to={notification.link}
                          className="text-xs font-bold text-blue-600 hover:underline transition-all"
                        >
                          View Details
                        </Link>
                      )}
                      <button
                        onClick={() => dismiss(notification._id)}
                        className="text-xs font-bold text-slate-400 hover:text-red-500 transition-all"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>

                  {isUnread && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  )}
                </div>
              </div>
            )
          })}
          {notifications.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <Bell size={24} />
              </div>
              <p className="text-slate-400 font-medium text-sm">No new notifications.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
