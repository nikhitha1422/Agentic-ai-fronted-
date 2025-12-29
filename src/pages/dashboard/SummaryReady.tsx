import { DashboardLayout } from '../../components/DashboardLayout'
import { CheckCircle, FileText, Share2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export function SummaryReady() {
  const { meetingId } = useParams()
  return (
    <DashboardLayout pageTitle="Summary Ready">
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] text-slate-900">
        <div className="max-w-xl w-full space-y-8">
          {/* Success Banner */}
          <div className="glass-panel rounded-[2rem] p-12 text-center shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>

            <div className="w-20 h-20 mx-auto rounded-full bg-green-100/50 flex items-center justify-center mb-6 text-green-600 backdrop-blur-sm">
              <CheckCircle size={40} />
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              Summary Generated!
            </h2>
            <p className="text-slate-500 font-medium text-lg mb-10 leading-relaxed">
              We've successfully processed the meeting audio. Your summary, notes, and action items are ready to view.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/dashboard/meetings/${meetingId}/summary`}
                className="flex-1"
              >
                <button className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                  <FileText size={18} />
                  View Report
                </button>
              </Link>
              <button className="flex-1 px-6 py-4 glass-heavy text-slate-700 rounded-xl font-bold text-sm hover:bg-white shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                45m
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Duration</div>
            </div>
            <div className="glass-panel rounded-2xl p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                5
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Key Points</div>
            </div>
            <div className="glass-panel rounded-2xl p-6 text-center shadow-sm">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                8
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Action Items</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
