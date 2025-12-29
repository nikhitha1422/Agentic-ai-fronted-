export function About() {
  return (
    <main className="bg-white min-h-screen text-slate-900 font-inter selection:bg-blue-50">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-50/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-50/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24 relative z-10">
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Our Mission
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Empowering teams with intelligent meeting assistance.
          </p>
        </div>

        <div className="space-y-12 text-lg text-slate-600 leading-relaxed font-normal">
          <p className="border-l-4 border-blue-500 pl-6 py-2">
            We built Agentic AI to eliminate the manual work of meeting documentation.
            Instead of taking notes, teams can focus on high-value collaboration while
            our intelligent assistants handle the summaries and action items.
          </p>

          <p>
            In today's fast-paced business environment, alignment is essential but often difficult to maintain.
            Key decisions are made, tasks are identified, and context is shared—but capturing it all
            while actively participating is a challenge.
          </p>

          <p>
            That's where we come in. Our AI agents analyze your discussions with precision,
            transforming raw conversation into actionable intelligence. We handle the documentation
            so your primary focus remains on the work itself.
          </p>

          <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 my-12 relative overflow-hidden">
            <p className="text-2xl font-bold text-slate-900 tracking-tight relative z-10">
              "Our goal is to turn every conversation into accountability."
            </p>
          </div>

          <p>
            We believe meetings should accelerate progress, not slow it down. With our platform,
            every discussion becomes a bridge toward your goals, with accurate summaries, assigned tasks,
            and automated follow-ups that keep everyone aligned.
          </p>

          <p>
            Built on secure, enterprise-grade infrastructure, our platform ensures your data
            remains private and protected. We're committed to transparency and security,
            enabling teams to work smarter, not harder.
          </p>
        </div>
      </div>
    </main>
  )
}
