import { useState } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Mail, Sparkles, Loader2, Calendar, Users, FileText, ArrowRight, CheckCircle2 } from 'lucide-react'
import { API_URL } from '../../services/api'
import { Link } from 'react-router-dom'

export function AIEmailAssistant() {
    const [emailContent, setEmailContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState('')

    const handleGenerate = async () => {
        if (!emailContent.trim()) return
        setLoading(true)
        setError('')
        setResult(null)

        try {
            const response = await fetch(`${API_URL}/ai/process-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailContent }),
            })

            const data = await response.json()
            if (response.ok && data.success) {
                setResult(data)
            } else {
                setError(data.error || data.reason || 'No meeting detected in this email.')
            }
        } catch (err) {
            setError('Failed to connect to backend service. Please ensure the server is running.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <DashboardLayout pageTitle="AI Email Assistant">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">AI Email Assistant</h2>
                    <p className="text-slate-500 font-medium">
                        Paste your email content below. Our AI will analyze it and automatically schedule a meeting if needed.
                    </p>
                </div>

                <div className="glass-panel rounded-[1.5rem] p-8 shadow-sm space-y-6">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Mail size={18} className="text-blue-600" />
                            Email Content
                        </label>
                        <textarea
                            value={emailContent}
                            onChange={(e) => setEmailContent(e.target.value)}
                            placeholder="Paste the email content here..."
                            className="w-full h-64 p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none font-inter text-slate-700"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !emailContent.trim()}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:to-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Analyzing Intelligence...
                            </>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                Generate Meeting
                            </>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="glass-panel border-red-100 bg-red-50/30 rounded-[1.5rem] p-6 animate-in fade-in slide-in-from-top-4">
                        <p className="text-red-600 font-bold flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </p>
                    </div>
                )}

                {result && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                        <div className="glass-panel border-green-100 bg-green-50/30 rounded-[1.5rem] p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <CheckCircle2 className="text-green-600" />
                                    Meeting Scheduled Successfully
                                </h3>
                                <Link to={`/dashboard/meetings/${result.meetingId}`}>
                                    <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2">
                                        View Meeting <ArrowRight size={16} />
                                    </button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <FileText className="text-blue-500" size={20} />
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Title</p>
                                            <p className="font-bold text-slate-900">{result.details.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Calendar className="text-blue-500" size={20} />
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Date & Time</p>
                                            <p className="font-bold text-slate-900">
                                                {new Date(result.details.date).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 text-slate-600">
                                        <Users className="text-blue-500 mt-1" size={20} />
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Participants</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {result.details.participants && result.details.participants.length > 0 ? (
                                                    result.details.participants.map((p: string, i: number) => (
                                                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                                                            {p}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">No participants detected</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Description</p>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {result.details.description}
                                </p>
                            </div>
                        </div>

                        {/* Future Scope Note */}
                        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
                            <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-2">
                                <Sparkles size={16} />
                                Future Scope: Smart Reminders
                            </h4>
                            <p className="text-xs text-blue-600 leading-relaxed font-medium">
                                In a production environment, automated time-based reminders (e.g., 5-minute notifications)
                                would be triggered using persistent background jobs and schedulers (like Redis/Bull or Cron).
                                This demo focuses on stable meeting creation and extraction.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
