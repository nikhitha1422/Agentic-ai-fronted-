import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { API_URL } from '../../services/api'

interface Meeting {
  meetingId: string;
  title: string;
  date: string;
  status: string;
}

export function Calendar() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

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

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const events: Record<number, { type: 'meeting' | 'task' | 'summary', color: string }[]> = {}

  meetings.forEach(meeting => {
    const meetingDate = new Date(meeting.date)
    if (meetingDate.getMonth() === currentDate.getMonth() && meetingDate.getFullYear() === currentDate.getFullYear()) {
      const day = meetingDate.getDate()
      if (!events[day]) events[day] = []
      events[day].push({
        type: 'meeting',
        color: 'bg-blue-600'
      })
    }
  })

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + offset)))
  }

  if (loading) {
    return (
      <DashboardLayout pageTitle="Calendar">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }
  return (
    <DashboardLayout pageTitle="Calendar">
      <div className="space-y-8 text-slate-900 font-inter">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {currentDate.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              View your scheduled meetings and deadlines.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all group"
            >
              <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Meetings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tasks</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-[1.5rem] p-6 border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 gap-4">
            {days.map((day) => (
              <div
                key={day}
                className="text-center text-slate-400 font-bold text-xs uppercase tracking-wider pb-4"
              >
                {day}
              </div>
            ))}

            {Array.from({
              length: firstDayOfMonth,
            }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}

            {Array.from({
              length: daysInMonth,
            }).map((_, i) => {
              const day = i + 1
              const today = new Date()
              const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()
              const hasEvents = events[day]
              return (
                <div
                  key={day}
                  className={`
                    aspect-square rounded-2xl p-3 transition-all border relative group cursor-pointer
                    ${isToday ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-slate-50/50 border-transparent hover:bg-white hover:border-blue-200 hover:shadow-md'}
                  `}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={`text-sm font-bold ${isToday ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-900'}`}
                    >
                      {day}
                    </span>
                    {hasEvents && (
                      <div className="flex gap-1 mt-auto justify-center">
                        {hasEvents.map((event, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${event.type === 'meeting' ? 'bg-blue-500' : 'bg-indigo-500'}`}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-[1.5rem] p-8 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Upcoming Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.slice(0, 6).map((meeting, i) => (
              <Link key={i} to={`/dashboard/meetings/${meeting.meetingId}/summary`} className="group">
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-blue-200 group-hover:shadow-md transition-all">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {meeting.title}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {new Date(meeting.date).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${meeting.status === 'live' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    {meeting.status}
                  </span>
                </div>
              </Link>
            ))}
            {meetings.length === 0 && (
              <div className="col-span-full text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm font-medium">No upcoming events found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
