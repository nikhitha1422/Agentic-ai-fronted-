import { DashboardLayout } from '../../components/DashboardLayout'
import { Plus, Calendar, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API_URL } from '../../services/api'

interface Meeting {
  id: string;
  meetingId: string;
  title: string;
  date: string;
  status: string;
}

export function MeetingsList() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/meetings`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch meetings');
        return res.json();
      })
      .then((data) => {
        setMeetings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching meetings:', err);
        setError('Failed to load meetings. Is the backend running?');
        setLoading(false);
      });
  }, []);

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <DashboardLayout pageTitle="Meetings">
      <div className="space-y-8 text-slate-900 font-inter">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Meeting History
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Manage your past sessions and AI summaries.
            </p>
          </div>
          <Link to="/dashboard/meetings/new">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] transition-all flex items-center gap-2">
              <Plus size={18} strokeWidth={2.5} />
              New Meeting
            </button>
          </Link>
        </div>

        {/* Meetings Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 text-center flex flex-col items-center gap-4 justify-center">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <span className="font-medium text-slate-400 text-sm">Loading meetings...</span>
            </div>
          ) : error ? (
            <div className="p-20 text-center text-red-500 font-medium text-sm">
              {error}
            </div>
          ) : meetings.length === 0 ? (
            <div className="p-20 text-center space-y-6">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                <Calendar size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-900">No meetings found</p>
                <p className="text-slate-500 text-sm">You haven't scheduled any meetings yet.</p>
              </div>
              <Link to="/dashboard/meetings/new" className="inline-block px-8 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all">Schedule First Meeting</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-slate-500 font-semibold text-xs uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {meetings.map((meeting) => (
                    <tr
                      key={meeting.meetingId}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {meeting.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-slate-700">
                            {formatDate(meeting.date)}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatTime(meeting.date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-block border ${meeting.status === 'live' ? 'bg-red-50 border-red-100 text-red-600' :
                              meeting.status === 'ended' ? 'bg-slate-100 border-slate-200 text-slate-500' :
                                meeting.status === 'summarized' ? 'bg-green-50 border-green-100 text-green-600' :
                                  'bg-blue-50 border-blue-100 text-blue-600'
                            }`}
                        >
                          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/dashboard/meetings/${meeting.meetingId}/summary`} className="inline-block">
                          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all font-bold text-xs shadow-sm">
                            View Summary
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
