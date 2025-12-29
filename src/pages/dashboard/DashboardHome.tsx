import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import {
  Calendar,
  FileText,
  Video,
  Zap,
  TrendingUp,
  Plus,
  Loader2,
  Clock,
  CheckCircle2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { API_URL } from '../../services/api'

interface Meeting {
  _id: string;
  meetingId: string;
  title: string;
  date: string;
  status: string;
}

export function DashboardHome() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/meetings`)
      .then(res => res.json())
      .then(data => {
        setMeetings(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching meetings:', err)
        setLoading(false)
      })
  }, [])

  const nextMeeting = meetings.length > 0 ? meetings[0] : null
  const recentSummaries = meetings.slice(0, 3)

  return (
    <DashboardLayout pageTitle="Dashboard">
      <div className="space-y-8 text-slate-900 font-inter">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Good afternoon, User
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              Here is your daily meeting intelligence report.
            </p>
          </div>
          <div className="glass-heavy px-4 py-2 rounded-xl flex items-center gap-2 text-green-600 text-xs font-bold shadow-sm">
            <TrendingUp size={14} />
            <span>+12% Productivity</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex gap-6">
          <Link to="/dashboard/meetings/new" className="flex-1">
            <button className="w-full h-full px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:to-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
              <Plus size={20} strokeWidth={2.5} />
              Schedule New Meeting
            </button>
          </Link>
          <button className="flex-1 px-6 py-5 glass-heavy text-blue-600 rounded-2xl font-bold text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-sm group">
            <div className="w-8 h-8 rounded-full bg-blue-50/50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Zap size={16} className="fill-current" />
            </div>
            AI Instant Join
          </button>
          <Link to="/dashboard/meetings" className="flex-1">
            <button className="w-full h-full px-6 py-5 glass-heavy text-slate-600 rounded-2xl font-bold text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-sm">
              <FileText size={20} />
              View Archives
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Next Meeting Card */}
            <div className="glass-panel rounded-[1.5rem] p-8 shadow-sm transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none"></div>

              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-50/50 flex items-center justify-center text-blue-600 backdrop-blur-sm">
                  <Video size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Next Up</h3>
                  <p className="text-xs font-semibold text-slate-400">Upcoming Schedule</p>
                </div>
              </div>

              {nextMeeting ? (
                <div className="space-y-6 relative z-10">
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 leading-tight">
                      {nextMeeting.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-slate-500 font-medium text-xs bg-slate-50/50 px-3 py-1.5 rounded-lg border border-slate-100/50">
                        <Calendar size={14} className="text-blue-500" />
                        <span>{new Date(nextMeeting.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 font-medium text-xs bg-slate-50/50 px-3 py-1.5 rounded-lg border border-slate-100/50">
                        <Clock size={14} className="text-blue-500" />
                        <span>{new Date(nextMeeting.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <Link to={`/dashboard/meetings/${nextMeeting.meetingId}`} className="flex-1">
                      <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 hover:shadow-lg transition-all active:scale-[0.98]">
                        Join Meeting Room
                      </button>
                    </Link>
                    <Link to={`/dashboard/meetings/${nextMeeting.meetingId}/summary`} className="flex-1">
                      <button className="w-full px-6 py-3 glass-heavy text-slate-600 rounded-xl font-bold text-sm hover:bg-white/80 transition-all">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50/30 rounded-2xl border border-dashed border-slate-200/50">
                  <p className="text-slate-400 font-medium text-sm">No upcoming meetings scheduled.</p>
                  <Link to="/dashboard/meetings/new" className="text-blue-600 font-bold text-xs mt-2 hover:underline inline-block">
                    Schedule one now
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Summaries Card */}
            <div className="glass-panel rounded-[1.5rem] p-8 shadow-sm transition-all flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-indigo-600 backdrop-blur-sm">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Recent Summaries</h3>
                  <p className="text-xs font-semibold text-slate-400">Latest Intelligence</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {recentSummaries.map((item) => (
                  <Link
                    key={item.meetingId}
                    to={`/dashboard/meetings/${item.meetingId}/summary`}
                    className="flex justify-between items-center p-4 rounded-xl border border-slate-100/50 hover:bg-blue-50/20 hover:border-blue-100/50 hover:shadow-sm transition-all group glass-card-hover"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100/50 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">
                          Processed • {new Date(item.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {recentSummaries.length === 0 && (
                  <div className="text-center py-10 bg-slate-50/30 rounded-2xl">
                    <p className="text-slate-400 text-sm font-medium">No recent summaries found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Insight Overview Section */}
        <div className="glass-panel rounded-[1.5rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Overview Stats</h3>
            <select className="glass-input text-xs font-bold text-slate-500 rounded-lg py-1.5 px-3 focus:ring-0 cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
              <p className="text-slate-400 font-semibold text-xs uppercase tracking-wide mb-2">Total Meetings</p>
              <div className="text-3xl font-bold text-slate-900">{meetings.length}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
              <p className="text-slate-400 font-semibold text-xs uppercase tracking-wide mb-2">Tasks Identified</p>
              <div className="text-3xl font-bold text-blue-600">0</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
              <p className="text-slate-400 font-semibold text-xs uppercase tracking-wide mb-2">AI Efficiency</p>
              <div className="text-3xl font-bold text-green-500">98.4%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
              <p className="text-slate-400 font-semibold text-xs uppercase tracking-wide mb-2">Hours Saved</p>
              <div className="text-3xl font-bold text-slate-900">~{(meetings.length * 1.5).toFixed(1)}h</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
