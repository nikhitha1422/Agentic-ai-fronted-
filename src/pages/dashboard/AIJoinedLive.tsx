import { DashboardLayout } from '../../components/DashboardLayout'
import { Mic, User } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export function AIJoinedLive() {
  const { meetingId } = useParams()
  return (
    <DashboardLayout pageTitle="Neural Intercept">
      <div className="max-w-4xl mx-auto space-y-12 text-text-primary selection:bg-accent/30 lowercase-labels">
        {/* Status Card */}
        <div className="bg-card/40 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden text-center group">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none"></div>
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-green-500/10 border border-green-500/20 rounded-full mb-8 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
            <span className="text-green-500 font-black uppercase text-[10px] tracking-[0.3em]">
              Agent Synchronized
            </span>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-4">
            Product Strategy Review
          </h2>
          <p className="text-text-secondary font-bold text-xl opacity-60">Intercept commenced at 14:00</p>
        </div>

        {/* Waveform Visualization */}
        <div className="bg-card/40 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 text-accent shadow-glow">
              <Mic size={24} fill="currentColor" />
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight">
              Acoustic Surveillance
            </h3>
          </div>

          {/* Animated Waveform */}
          <div className="flex items-center justify-center gap-1.5 h-48 mb-10 bg-white/5 rounded-[2.5rem] p-8 border border-white/5 shadow-inner">
            {[...Array(48)].map((_, i) => (
              <div
                key={i}
                className="w-2.5 bg-gradient-to-t from-accent via-accent-bright to-white rounded-full shadow-glow"
                style={{
                  height: `${Math.random() * 80 + 20}%`,
                  animation: `waveform-pulse ${Math.random() * 0.4 + 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.03}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Current Speaker */}
          <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 group/speaker transition-all hover:bg-white/10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-accent/20 flex items-center justify-center border border-accent/40 shadow-glow group-hover/speaker:scale-110 transition-transform">
                <User className="text-accent" size={32} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-2xl font-black text-white tracking-tight">
                  Sarah Johnson
                </div>
                <div className="text-sm text-text-secondary font-bold uppercase tracking-widest opacity-60">
                  Director of Intelligence
                </div>
              </div>
              <div className="flex items-center gap-4 px-6 py-2 bg-green-500/10 rounded-full border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-green-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  Transmitting
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-card/40 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
          <h3 className="text-3xl font-black text-white mb-8 tracking-tight">
            Neural Recognition Stream
          </h3>
          <div className="space-y-6 text-text-secondary font-medium text-xl leading-relaxed italic opacity-80">
            <p className="border-l-4 border-accent/30 pl-8 py-2">
              "We need to focus on the Q1 roadmap and prioritize customer
              feedback..."
            </p>
            <p className="border-l-4 border-accent-bright/30 pl-8 py-2">
              "The analytics show strong engagement with the new dashboard
              features..."
            </p>
            <p className="border-l-4 border-accent/30 pl-8 py-2">
              "Let's schedule a follow-up to review the implementation
              timeline..."
            </p>
          </div>
          <div className="mt-12 pt-10 border-t border-white/5 text-center space-y-8">
            <p className="text-sm text-text-secondary font-bold uppercase tracking-widest opacity-50">
              Full intelligence extraction will be available upon session termination
            </p>
            <Link to={`/dashboard/meetings/${meetingId}/summary-ready`}>
              <button className="px-10 py-5 bg-accent text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-accent-bright shadow-glow transition-all active:scale-95">
                Terminate & Extract Intelligence
              </button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

