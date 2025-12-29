import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Bell, Zap, Globe, Loader2 } from 'lucide-react'
import { API_URL } from '../../services/api'

export function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    taskReminders: true,
    summaryAlerts: true,
    autoJoinMeetings: false,
    timezone: 'America/New_York',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/users/default_operator`)
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching settings:', err)
        setLoading(false)
      })
  }, [])

  const saveSettings = (newSettings: typeof settings) => {
    fetch(`${API_URL}/users/default_operator/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    }).catch(err => console.error('Error saving settings:', err))
  }

  const handleToggle = (key: string) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key as keyof typeof settings],
    }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  if (loading) {
    return (
      <DashboardLayout pageTitle="Settings">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }
  return (
    <DashboardLayout pageTitle="Settings">
      <div className="max-w-4xl mx-auto space-y-8 text-slate-900 font-inter">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Account Settings
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Manage your preferences and notification settings.
          </p>
        </div>

        {/* AI Settings */}
        <div className="bg-white rounded-[1.5rem] p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Zap size={20} fill="currentColor" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              AI Preferences
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-purple-200 transition-all">
              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-900">Auto-summarization</div>
                <div className="text-xs text-slate-500 font-medium max-w-sm">
                  Automatically generate AI summaries for all your recorded meetings.
                </div>
              </div>
              <button
                onClick={() => handleToggle('autoJoinMeetings')}
                className={`relative w-11 h-6 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${settings.autoJoinMeetings ? 'bg-purple-600' : 'bg-slate-200'}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${settings.autoJoinMeetings ? 'right-1' : 'left-1'}`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-[1.5rem] p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Bell size={20} fill="currentColor" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Notifications
            </h3>
          </div>
          <div className="space-y-3">
            {[
              {
                key: 'emailNotifications',
                label: 'Email Alerts',
                description: 'Receive updates and summary readiness alerts via email.',
              },
              {
                key: 'taskReminders',
                label: 'Task Reminders',
                description: 'Get notified about upcoming task deadlines and action items.',
              },
              {
                key: 'summaryAlerts',
                label: 'App Notifications',
                description: 'Show push notifications when intelligence is ready.',
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all"
              >
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900">{item.label}</div>
                  <div className="text-xs text-slate-500 font-medium max-w-sm">
                    {item.description}
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(item.key)}
                  className={`relative w-11 h-6 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${settings[item.key as keyof typeof settings] ? 'right-1' : 'left-1'}`}
                  ></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Time Zone */}
        <div className="bg-white rounded-[1.5rem] p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <Globe size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Location & Time
            </h3>
          </div>
          <div className="relative">
            <select
              value={settings.timezone}
              onChange={(e) => {
                const newSettings = {
                  ...settings,
                  timezone: e.target.value,
                }
                setSettings(newSettings)
                saveSettings(newSettings)
              }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 hover:border-blue-300 transition-all appearance-none cursor-pointer"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">Greenwich Mean Time (GMT)</option>
              <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Globe size={16} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
