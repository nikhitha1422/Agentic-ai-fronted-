import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { API_URL } from '../../services/api'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

interface Meeting {
  meetingId: string;
  title: string;
  date: string;
  status: string;
}

export function Calendar() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
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

  if (loading) {
    return (
      <DashboardLayout pageTitle="Calendar">
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  const events = meetings.map(meeting => ({
    id: meeting.meetingId,
    title: meeting.title,
    start: meeting.date,
    backgroundColor: meeting.status === 'live' ? '#ef4444' : '#2563eb',
    borderColor: 'transparent',
    extendedProps: { ...meeting }
  }))

  const handleDateClick = (arg: any) => {
    setSelectedDay(arg.date.getDate())
    setCurrentDate(arg.date)
  }

  const selectedDayMeetings = selectedDay ? meetings.filter(m => {
    const d = new Date(m.date);
    return d.getDate() === selectedDay &&
      d.getMonth() === currentDate.getMonth() &&
      d.getFullYear() === currentDate.getFullYear();
  }) : [];

  return (
    <DashboardLayout pageTitle="Calendar">
      <style>{`
        #calendar {
          max-width: 100%;
          margin: 0 auto;
          min-height: 600px;
        }
        .fc {
          font-family: 'Inter', sans-serif;
          background: white;
          padding: 1.5rem;
          border-radius: 1.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }
        .fc .fc-toolbar-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
        }
        .fc .fc-button-primary {
          background-color: #2563eb;
          border-color: transparent;
          font-weight: 600;
          border-radius: 0.75rem;
        }
        .fc .fc-button-primary:hover {
          background-color: #1d4ed8;
        }
        .fc .fc-daygrid-day.fc-day-today {
          background-color: #eff6ff !important;
        }
        .fc .fc-daygrid-day-number {
          font-weight: 600;
          color: #475569;
          padding: 8px;
        }
        .fc .fc-col-header-cell-cushion {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          padding: 1rem 0;
        }
        .fc .fc-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }
      `}</style>

      <div className="space-y-8 text-slate-900 font-inter">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Calendar
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            View your scheduled meetings and deadlines.
          </p>
        </div>

        {/* Calendar Grid and Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 overflow-hidden" id="calendar">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              dateClick={handleDateClick}
              height="auto"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: ''
              }}
            />
          </div>

          {/* Day Details */}
          <div className="bg-white rounded-[1.5rem] p-8 border border-slate-200 shadow-sm min-h-[400px]">
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {selectedDay ? `${currentDate.toLocaleString('default', { month: 'long' })} ${selectedDay}` : 'Select a day'}
            </h3>
            <div className="space-y-4">
              {selectedDayMeetings.length > 0 ? (
                selectedDayMeetings.map((meeting) => (
                  <Link key={meeting.meetingId} to={`/dashboard/meetings/${meeting.meetingId}`} className="block p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all group">
                    <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600">
                      {meeting.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-20 text-slate-400">
                  <p className="text-sm font-medium">No sessions scheduled for this day.</p>
                </div>
              )}
            </div>
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
