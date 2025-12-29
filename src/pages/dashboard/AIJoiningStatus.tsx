import { useEffect } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
export function AIJoiningStatus() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/dashboard/meetings/${meetingId}/ai-live`)
    }, 3000)
    return () => clearTimeout(timer)
  }, [navigate, meetingId])
  return (
    <DashboardLayout pageTitle="Neural Deployment">
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] text-text-primary selection:bg-accent/30">
        <div className="bg-card/40 backdrop-blur-3xl rounded-[3rem] p-16 max-w-2xl w-full text-center border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse"></div>

          <div className="relative mb-12">
            <div className="w-32 h-32 mx-auto rounded-[2.5rem] bg-accent/20 border border-accent/40 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-500">
              <Loader2 className="text-accent animate-spin" size={64} strokeWidth={2.5} />
            </div>
          </div>

          <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">
            Deploying neural agent...
          </h2>
          <p className="text-text-secondary font-bold text-xl mb-12 leading-relaxed opacity-60">
            Establishing secure intercept tunnel. Agent synchronization
            imminent. Maintain terminal connection.
          </p>

          <div className="space-y-6 text-left max-w-md mx-auto">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group/step">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Frequency Interception...</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group/step">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Neural Uplink Initialized...</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-accent/10 rounded-2xl border border-accent/20 animate-pulse group/step">
              <div className="w-3 h-3 rounded-full bg-accent shadow-glow"></div>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-accent">Synchronizing Data Streams...</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
