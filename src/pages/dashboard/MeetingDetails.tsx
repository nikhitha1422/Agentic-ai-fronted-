import { DashboardLayout } from '../../components/DashboardLayout'
import {
  Calendar,
  Clock,
  Users,
  Link as LinkIcon,
  FileText,
  Zap,
  Upload,
  Loader2
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API_URL } from '../../services/api'

interface Meeting {
  id: string;
  meetingId: string;
  title: string;
  date: string;
  status: string;
  description?: string;
}

export function MeetingDetails() {
  const { meetingId } = useParams();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!meetingId) return;
    fetch(`${API_URL}/meetings/${meetingId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Meeting not found');
        return res.json();
      })
      .then((data) => {
        setMeeting(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching meeting:', err);
        setError('Failed to load meeting details.');
        setLoading(false);
      });
  }, [meetingId]);

  if (loading) {
    return (
      <DashboardLayout pageTitle="Meeting Details">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !meeting) {
    return (
      <DashboardLayout pageTitle="Meeting Details">
        <div className="p-8 text-center text-red-500">
          {error || 'Meeting not found'}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout pageTitle="Meeting Details">
      <div className="max-w-4xl mx-auto py-10 space-y-8">
        {/* Meeting Header */}
        <div className="glass-panel rounded-[2rem] p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                {meeting.title}
              </h2>
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${meeting.status === 'live' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className={`text-xs font-bold uppercase tracking-wide ${meeting.status === 'live' ? 'text-red-500' : 'text-green-600'}`}>
                  {meeting.status === 'live' ? 'Live Now' : meeting.status === 'summarized' ? 'Summarized' : 'Scheduled'}
                </span>
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              {meeting.status === 'summarized' ? (
                <Link to={`/dashboard/meetings/${meeting.meetingId}/summary`} className="flex-1 md:flex-none">
                  <button className="w-full px-8 py-3 glass-heavy text-slate-700 rounded-xl font-bold text-sm hover:bg-white transition-all shadow-sm flex items-center justify-center gap-2">
                    <FileText size={18} />
                    View Summary
                  </button>
                </Link>
              ) : (
                <Link to={`/meet/${meeting.meetingId}`} className="flex-1 md:flex-none">
                  <button className="w-full px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                    <Zap size={18} fill="currentColor" />
                    Join Meeting
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-slate-50/50 flex items-center justify-center border border-slate-100/50 text-blue-500 backdrop-blur-sm">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="text-slate-400 font-medium text-xs uppercase mb-1">Date</div>
                  <div className="text-slate-900 font-bold text-lg">
                    {new Date(meeting.date).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-slate-50/50 flex items-center justify-center border border-slate-100/50 text-purple-500 backdrop-blur-sm">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-slate-400 font-medium text-xs uppercase mb-1">Time</div>
                  <div className="text-slate-900 font-bold text-lg">
                    {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-slate-50/50 flex items-center justify-center border border-slate-100/50 text-green-500 backdrop-blur-sm">
                  <Users size={20} />
                </div>
                <div>
                  <div className="text-slate-400 font-medium text-xs uppercase mb-1">Participants</div>
                  <div className="text-slate-900 font-bold text-lg">Multiple Allowed</div>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-slate-50/50 flex items-center justify-center border border-slate-100/50 text-orange-500 backdrop-blur-sm">
                  <LinkIcon size={20} />
                </div>
                <div>
                  <div className="text-slate-400 font-medium text-xs uppercase mb-1">Meeting Link</div>
                  <div
                    className="text-blue-600 font-medium text-sm truncate hover:underline cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/meet/${meeting.meetingId}`)}
                    title="Click to copy"
                  >
                    {window.location.origin}/meet/{meeting.meetingId}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description / Agenda */}
        <div className="glass-panel rounded-[2rem] p-10 shadow-sm relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50/50 flex items-center justify-center text-slate-500 backdrop-blur-sm">
              <FileText size={20} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Agenda</h3>
          </div>
          <div className="text-slate-600 leading-relaxed text-lg">
            <p className="whitespace-pre-wrap">{meeting.description || 'No specific agenda provided.'}</p>
          </div>
        </div>

        {/* Attachments */}
        <div className="glass-panel rounded-[2rem] p-10 shadow-sm relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50/50 flex items-center justify-center text-slate-500 backdrop-blur-sm">
              <Upload size={20} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Attachments
            </h3>
          </div>
          <div className="border-2 border-dashed border-slate-200/60 rounded-2xl p-10 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-slate-50/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 backdrop-blur-sm">
              <Upload size={24} />
            </div>
            <p className="text-slate-900 font-bold text-lg mb-1">Upload Files</p>
            <p className="text-slate-500 text-xs font-medium">Documents uploaded here will be used for context.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
