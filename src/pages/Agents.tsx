import { Video, CheckCircle } from 'lucide-react'

export function Agents() {
  return (
    <main className="bg-white min-h-screen text-slate-900 font-inter selection:bg-blue-50">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-blue-50/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-blue-50/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-20 space-y-4">
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
            Intelligent Assistants
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Specialized AI models designed for productive meetings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Meeting Notes & Summary Agent Card */}
          <div
            id="notes-summary-agent"
            className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-xl hover:shadow-2xl hover:border-blue-200 transition-all group"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 text-blue-600 group-hover:scale-110 transition-transform">
              <Video size={32} />
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              Meeting <span className="text-blue-600">Scribe</span>
            </h2>

            <p className="text-lg text-slate-500 leading-relaxed mb-8 font-medium">
              This assistant joins your calls, records the conversation, and generates detailed
              summaries with key takeaways and structured notes.
            </p>

            <div className="space-y-4">
              {[
                "Automatic recording and transcription",
                "Context-aware summary generation",
                "Integration with your calendar",
                "Secure participant verification"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-base font-semibold text-slate-600">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Task & Reminder Agent Card */}
          <div
            id="task-reminder-agent"
            className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-xl hover:shadow-2xl hover:border-blue-200 transition-all group"
          >
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-8 text-purple-600 group-hover:scale-110 transition-transform">
              <CheckCircle size={32} />
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              Task <span className="text-purple-600">Manager</span>
            </h2>

            <p className="text-lg text-slate-500 leading-relaxed mb-8 font-medium">
              This assistant analyzes the meeting notes to identify action items, assign owners,
              and track progress until completion.
            </p>

            <div className="space-y-4">
              {[
                "Extracts action items automatically",
                "Assigns tasks to team members",
                "Tracks deadlines and sends reminders",
                "Monitors project progress"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p className="text-base font-semibold text-slate-600">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
