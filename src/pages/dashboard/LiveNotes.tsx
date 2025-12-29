
import { DashboardLayout } from '../../components/DashboardLayout'
import { FileText, Tag } from 'lucide-react'
export function LiveNotes() {
  const notes = [
    {
      speaker: 'Sarah Johnson',
      time: '2:03 PM',
      text: 'Reviewed Q4 performance metrics - exceeded targets by 15%',
      action: true,
    },
    {
      speaker: 'Michael Chen',
      time: '2:08 PM',
      text: 'Discussed customer feedback on new dashboard features',
      action: false,
    },
    {
      speaker: 'Sarah Johnson',
      time: '2:12 PM',
      text: 'Need to prioritize mobile app development for Q1',
      action: true,
    },
    {
      speaker: 'Emily Davis',
      time: '2:15 PM',
      text: 'Analytics show 40% increase in user engagement',
      action: false,
    },
    {
      speaker: 'Michael Chen',
      time: '2:20 PM',
      text: 'Schedule follow-up meeting to review implementation timeline',
      action: true,
    },
    {
      speaker: 'Sarah Johnson',
      time: '2:25 PM',
      text: 'Allocate additional resources to customer support team',
      action: true,
    },
  ]
  return (
    <DashboardLayout pageTitle="Neural Notes">
      <div className="max-w-4xl mx-auto space-y-12 text-text-primary selection:bg-accent/30 lowercase-labels">
        {/* Header */}
        <div className="bg-card/40 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter mb-2">
                Product Strategy Review
              </h2>
              <p className="text-text-secondary font-bold text-xl opacity-60">
                Real-time intelligence capture in progress...
              </p>
            </div>
            <div className="flex items-center gap-4 px-8 py-3 bg-green-500/10 border border-green-500/20 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></div>
              <span className="text-green-500 font-black uppercase text-[10px] tracking-[0.3em]">Recording</span>
            </div>
          </div>
        </div>

        {/* Notes Stream */}
        <div className="bg-card/40 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/5 shadow-2xl relative">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 text-accent shadow-glow">
              <FileText size={24} />
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight">
              Intercept Stream
            </h3>
          </div>

          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-6 custom-scrollbar">
            {notes.map((note, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-[2rem] p-8 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group/note"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent text-sm font-black border border-accent/30 shadow-glow group-hover/note:scale-110 transition-transform">
                      {note.speaker
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="text-xl font-black text-white group-hover/note:text-accent transition-colors">
                        {note.speaker}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-50">{note.time}</div>
                    </div>
                  </div>
                  {note.action && (
                    <div className="flex items-center gap-3 px-6 py-2 bg-accent-bright/10 border border-accent-bright/20 rounded-full shadow-glow">
                      <Tag size={14} className="text-accent-bright" />
                      <span className="text-accent-bright text-[10px] font-black uppercase tracking-[0.2em]">
                        Action
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-lg font-bold text-text-secondary leading-relaxed ml-16 opacity-90">{note.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
