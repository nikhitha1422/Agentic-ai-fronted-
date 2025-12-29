import { useState, FormEvent } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Calendar, Clock, FileText, Zap, ChevronLeft, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../services/api'

export function CreateMeeting() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    allowAI: false,
    description: ''
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const isoDateString = `${formData.date}T${formData.time}:00`;

      console.log('Creating meeting with date:', isoDateString);

      const response = await fetch(
        `${API_URL}/meetings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            date: isoDateString,
            allowAI: formData.allowAI
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create meeting')
      }

      navigate(`/dashboard/meetings/${data.meetingId}`)
    } catch (error: any) {
      console.error('Error creating meeting:', error)
      alert(`Failed to create meeting: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout pageTitle="Schedule Meeting">
      <div className="max-w-2xl mx-auto py-10">
        <div className="mb-10">
          <Link
            to="/dashboard/meetings"
            className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-6 font-medium text-sm transition-all group"
          >
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Meetings
          </Link>

          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Schedule Session
          </h2>
          <p className="text-slate-500 font-medium mt-1 text-base">Details for your upcoming meeting.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-[2rem] p-10 space-y-8 shadow-sm relative overflow-hidden"
        >
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Meeting Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Strategy Sync"
              className="w-full px-5 py-3 glass-input rounded-xl text-slate-900 focus:outline-none transition-all placeholder:text-slate-400 font-medium text-base shadow-sm"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="date"
                  required
                  className="w-full pl-12 pr-4 py-3 glass-input rounded-xl text-slate-900 focus:outline-none transition-all font-medium text-base shadow-sm"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="time"
                  required
                  className="w-full pl-12 pr-4 py-3 glass-input rounded-xl text-slate-900 focus:outline-none transition-all font-medium text-base shadow-sm"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea
                placeholder="What is the meeting agenda?"
                className="w-full pl-12 pr-4 py-3 glass-input rounded-xl text-slate-900 focus:outline-none transition-all min-h-[120px] placeholder:text-slate-400 font-medium text-base shadow-sm resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* AI Toggle */}
          <div
            className={`flex items-center justify-between p-6 rounded-2xl border transition-all cursor-pointer ${formData.allowAI ? 'bg-blue-50/50 border-blue-200' : 'bg-white/40 border-slate-200/50 hover:border-blue-300'}`}
            onClick={() => setFormData({ ...formData, allowAI: !formData.allowAI })}
          >
            <div className="flex items-center gap-5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm transition-colors ${formData.allowAI ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-slate-50/50 text-slate-400 border-slate-200'}`}>
                <Zap size={18} fill={formData.allowAI ? "currentColor" : "none"} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <span className={`font-bold block text-sm ${formData.allowAI ? 'text-blue-900' : 'text-slate-900'}`}>Enable AI Assistant</span>
                <span className={`text-xs font-medium ${formData.allowAI ? 'text-blue-600' : 'text-slate-500'}`}>Automated summary & action items</span>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-all ${formData.allowAI ? 'bg-blue-600' : 'bg-slate-200/50'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-all transform ${formData.allowAI ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="px-6 py-3 text-slate-500 font-bold hover:text-slate-800 transition-colors text-sm"
              onClick={() => navigate('/dashboard/meetings')}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Creating...
                </>
              ) : (
                <>
                  Create Meeting
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
